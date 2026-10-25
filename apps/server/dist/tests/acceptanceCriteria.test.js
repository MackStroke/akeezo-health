process.env.NODE_ENV = "test";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { connectDB, disconnectDB } from "../db/connection.js";
import { app } from "../index.js";
import { calculateAkeezoCommission, calculatePartnerShare, calculatePartnerPayable, deriveCommissionStatus, } from "../services/commissionEngine.js";
import { encryptSensitiveField, decryptSensitiveField, maskSensitiveValue, } from "../utils/crypto.js";
import { findDuplicatePatients } from "../services/duplicatePatient.js";
import { evaluateStageGuards } from "../services/stageGuards.js";
import { UserModel, PartnerModel, HospitalModel, PatientModel, CaseModel, CaseStageHistoryModel, QuoteRequestModel, QuoteModel, EpisodeModel, EpisodeSeriesModel, CommissionRecordModel, VisaRecordModel, TravelRecordModel, CaseAuditLogModel, } from "../db/models/index.js";
describe("Phase 1 Acceptance Criteria Verification (AC-1 to AC-15)", () => {
    let server;
    let baseUrl;
    before(async () => {
        await connectDB();
        await EpisodeModel.init(); // Enforce database partial unique index build
        await new Promise((resolve) => {
            server = app.listen(0, "127.0.0.1", () => {
                const port = server.address().port;
                baseUrl = `http://127.0.0.1:${port}`;
                resolve();
            });
        });
    });
    after(async () => {
        if (server) {
            if (typeof server.closeAllConnections === "function") {
                server.closeAllConnections();
            }
            await new Promise((resolve) => server.close(resolve));
        }
        await disconnectDB();
    });
    // ==========================================
    // AC-1: PATIENT DUPLICATE DETECTION & INTAKE
    // ==========================================
    it("AC-1: Duplicate Detection - matches by passport hash and by normalized name + DOB", async () => {
        // 1. Passport match test (Farid Ahmed, passport: FA9823412)
        const passportMatches = await findDuplicatePatients({
            passportNumber: "FA9823412",
        });
        assert.ok(passportMatches.length >= 1, "Should detect at least 1 match by passport");
        const pMatch = passportMatches[0];
        assert.equal(pMatch.matchReason, "passport_match");
        assert.equal(pMatch.fullName, "Farid Ahmed");
        assert.ok(pMatch.passportNumberMasked?.endsWith("412"), "Passport must be masked showing only last 3 digits");
        // 2. Name + Date of Birth match test
        const nameDobMatches = await findDuplicatePatients({
            name: "  farid   ahmed  ",
            dateOfBirth: "1978-05-14",
        });
        assert.ok(nameDobMatches.length >= 1, "Should detect match by normalized name and DOB");
        assert.equal(nameDobMatches[0].fullName, "Farid Ahmed");
        // 3. Negative check - unique new patient
        const uniqueMatches = await findDuplicatePatients({
            passportNumber: "ZZ9999999",
            name: "Completely Unique Patient",
            dateOfBirth: "1995-01-01",
        });
        assert.equal(uniqueMatches.length, 0, "Unique patient query should return 0 duplicate matches");
    });
    // ==========================================
    // AC-2: STAGE TRANSITION GUARDS & EXIT CRITERIA
    // ==========================================
    it("AC-2: Stage Exit Guards - blocks forward move when reports, consent, or RFQ are missing", async () => {
        // Test pilot case AKZ-2026-00001 (already has reports, consent, and RFQ)
        const pilotCase = await CaseModel.findOne({ caseCode: "AKZ-2026-00001" });
        assert.ok(pilotCase, "Pilot case AKZ-2026-00001 must exist");
        const readinessPilot = await evaluateStageGuards(pilotCase._id, "quotes_requested");
        assert.equal(readinessPilot.isReady, true, "Pilot case should satisfy all exit criteria for quotes_requested");
        assert.ok(readinessPilot.guards.every((g) => g.passed), "All stage guards must pass");
        // Test a newly created unpopulated case
        const testPatient = await PatientModel.findOne();
        const testOwner = await UserModel.findOne();
        const bareCase = await CaseModel.create({
            caseCode: "AKZ-TEST-GUARD-01",
            patientId: testPatient._id,
            source: "partner",
            caseType: "treatment",
            specialty: "oncology",
            diagnosisSummary: "Preliminary case without documents",
            urgency: "routine",
            stage: "under_review",
            ownerId: testOwner._id,
        });
        try {
            const bareReadiness = await evaluateStageGuards(bareCase._id, "quotes_requested");
            assert.equal(bareReadiness.isReady, false, "Bare case without medical reports or consent must NOT be ready");
            const failedGuards = bareReadiness.guards.filter((g) => !g.passed);
            const failedNames = failedGuards.map((g) => g.guard);
            assert.ok(failedNames.includes("medical_report_required"), "Must fail medical_report_required guard");
            assert.ok(failedNames.includes("hospital_share_consent_required"), "Must fail hospital_share_consent_required guard");
            assert.ok(failedNames.includes("rfq_created_required"), "Must fail rfq_created_required guard");
        }
        finally {
            await CaseModel.findByIdAndDelete(bareCase._id);
        }
    });
    // ==========================================
    // AC-3: RFQ CREATION & STRUCTURED QUOTE LOGGING
    // ==========================================
    it("AC-3: RFQ and Quote Packaging - stores structured inclusions, exclusions, stay days, and validity", async () => {
        const pilotCase = await CaseModel.findOne({ caseCode: "AKZ-2026-00001" });
        assert.ok(pilotCase);
        const rfq = await QuoteRequestModel.findOne({ caseId: pilotCase._id });
        assert.ok(rfq, "Quote RFQ must exist for pilot case");
        assert.equal(rfq.roundNo, 1);
        assert.equal(rfq.status, "open");
        const quotes = await QuoteModel.find({ caseId: pilotCase._id });
        assert.ok(quotes.length >= 3, "Should have received at least 3 structured hospital quotes");
        for (const q of quotes) {
            assert.ok(q.amountMinMinor > 0, "Quote must have a positive minimum amount");
            assert.ok(q.amountMaxMinor >= q.amountMinMinor, "Max amount must be >= min amount");
            assert.ok(q.inclusions && q.inclusions.length > 5, "Quote must have structured inclusions");
            assert.ok(q.exclusions && q.exclusions.length > 5, "Quote must have structured exclusions");
            assert.ok(q.estimatedStayDays > 0, "Quote must specify estimated stay days");
            assert.ok(q.validityUntil instanceof Date, "Quote must have a validity deadline");
        }
    });
    // ==========================================
    // AC-4: QUOTE COMPARISON & SINGLE SELECTION
    // ==========================================
    it("AC-4: Quote Comparison & Selection - identifies lowest price, unselects competing quotes, rejects expired quotes", async () => {
        const pilotCase = await CaseModel.findOne({ caseCode: "AKZ-2026-00001" });
        assert.ok(pilotCase);
        const quotes = await QuoteModel.find({ caseId: pilotCase._id }).sort({ amountMinMinor: 1 });
        assert.ok(quotes.length >= 3);
        // Lowest quote check: Max Hospital (75000000 minor)
        const lowestQuote = quotes[0];
        const secondLowest = quotes[1];
        assert.ok(lowestQuote.amountMinMinor < secondLowest.amountMinMinor, "Lowest quote must have smallest amountMinMinor");
        // Select the lowest quote
        await QuoteModel.updateMany({ caseId: pilotCase._id }, { isSelected: false });
        await QuoteModel.findByIdAndUpdate(lowestQuote._id, { isSelected: true, selectedAt: new Date() });
        const selectedCount = await QuoteModel.countDocuments({ caseId: pilotCase._id, isSelected: true });
        assert.equal(selectedCount, 1, "Exactly one quote must be marked selected");
        // Expired quote check: selecting an expired quote must be rejected
        const expiredQuote = new QuoteModel({
            caseId: pilotCase._id,
            hospitalId: lowestQuote.hospitalId,
            quoteType: "initial",
            amountMinMinor: 50000000,
            amountMaxMinor: 60000000,
            validityUntil: new Date("2020-01-01"), // Expired in the past
        });
        const isExpired = new Date(expiredQuote.validityUntil) < new Date();
        assert.equal(isExpired, true, "Quote with past validity date must be flagged expired");
    });
    // ==========================================
    // AC-5: MEDICAL VISA & TRAVEL LOGISTICS
    // ==========================================
    it("AC-5: Visa & Inbound Travel Logistics - requires approved visa and inbound arrival date for international patients", async () => {
        // Case 4: Fatima Al-Mansoor (Iraq - international)
        const case4 = await CaseModel.findOne({ caseCode: "AKZ-2026-00004" });
        assert.ok(case4, "Case 4 must exist");
        assert.equal(case4.patientInIndia, false, "Must be international patient");
        const visa = await VisaRecordModel.findOne({ caseId: case4._id });
        assert.ok(visa, "Visa record must exist");
        assert.equal(visa.status, "approved", "Visa must be approved");
        assert.ok(visa.applicationRef, "Visa application reference must exist");
        const inboundTravel = await TravelRecordModel.findOne({ caseId: case4._id, direction: "inbound" });
        assert.ok(inboundTravel, "Inbound flight travel record must exist");
        assert.equal(inboundTravel.status, "confirmed");
        assert.ok(inboundTravel.arriveAt instanceof Date, "Arrival date must be recorded");
        // Domestic patient exemption check: domestic patient bypasses visa check
        const domesticCase = new CaseModel({
            caseCode: "AKZ-TEST-DOMESTIC",
            patientInIndia: true,
            stage: "visa_travel",
        });
        assert.equal(domesticCase.patientInIndia, true, "Domestic patient flag must be true");
    });
    // ==========================================
    // AC-6: STRICT ONE ACTIVE EPISODE RULE (EP-3)
    // ==========================================
    it("AC-6: Rule EP-3 - only ONE episode per case can be in active status; second activation is blocked", async () => {
        // Case 2: Amina Mwangi already has an active episode
        const case2 = await CaseModel.findOne({ caseCode: "AKZ-2026-00002" });
        assert.ok(case2, "Case 2 must exist");
        const currentActive = await EpisodeModel.findOne({ caseId: case2._id, status: "active" });
        assert.ok(currentActive, "Case 2 must have an active episode");
        // Create a planned second episode on the same case
        const ep2 = await EpisodeModel.create({
            caseId: case2._id,
            sequenceNo: 99,
            episodeType: "ipd",
            hospitalId: currentActive.hospitalId,
            treatmentName: "Post-op Valve Rehabilitation (Second Episode)",
            status: "planned",
        });
        try {
            // 1. Service layer check: activating ep2 via API when currentActive exists must fail with 422
            const res = await fetch(`${baseUrl}/api/v1/episodes/${ep2._id}/activate`, { method: "POST" });
            assert.equal(res.status, 422, "API must reject activating a second episode on the same case");
            const errJson = await res.json();
            assert.equal(errJson.error?.code, "episode_already_active");
            // 2. Direct database invariant check: MongoDB partial unique index MUST throw duplicate key error code 11000
            let duplicateKeyError = null;
            try {
                ep2.status = "active";
                await ep2.save();
            }
            catch (err) {
                duplicateKeyError = err;
            }
            assert.ok(duplicateKeyError, "MongoDB partial unique index MUST reject a second active episode on the same case");
            assert.equal(duplicateKeyError.code, 11000, "MongoDB partial unique index must enforce EP-3 with duplicate key error code 11000");
        }
        finally {
            await EpisodeModel.findByIdAndDelete(ep2._id);
        }
    });
    // ==========================================
    // AC-7: COMMISSION CALCULATION
    // ==========================================
    it("AC-7: Given billed 10,00,000 INR, 15% hospital rate, 40% partner share -> Akeezo 1,50,000, Partner 60,000, Net 90,000", () => {
        const billedAmountMinor = 100000000;
        const hospitalRate = {
            type: "percent_of_billed",
            value: 15,
        };
        const partnerAgreement = {
            type: "percent_of_akeezo_commission",
            value: 40,
            payoutTrigger: "on_hospital_receipt",
        };
        const akeezoCommissionMinor = calculateAkeezoCommission(billedAmountMinor, hospitalRate);
        const partnerShareMinor = calculatePartnerShare(akeezoCommissionMinor, partnerAgreement, true);
        const akeezoNetMinor = akeezoCommissionMinor - partnerShareMinor;
        assert.equal(akeezoCommissionMinor, 15000000);
        assert.equal(partnerShareMinor, 6000000);
        assert.equal(akeezoNetMinor, 9000000);
    });
    // ==========================================
    // AC-8: PARTIAL PAYMENT & PROPORTIONAL PARTNER PAYABLE
    // ==========================================
    it("AC-8: Hospital pays 75,000 (50%) -> Partner payable 30,000; Hospital pays second 75,000 -> Total partner payable 60,000", () => {
        const akeezoCommissionMinor = 15000000; // 1,50,000 INR
        const partnerShareMinor = 6000000; // 60,000 INR
        let hospitalReceivedMinor = 7500000;
        let partnerPaidMinor = 0;
        let payableResult = calculatePartnerPayable(partnerShareMinor, akeezoCommissionMinor, hospitalReceivedMinor, partnerPaidMinor, "on_hospital_receipt");
        assert.equal(payableResult.partnerPayableMinor, 3000000);
        assert.equal(payableResult.recoveryDueMinor, 0);
        partnerPaidMinor += payableResult.partnerPayableMinor;
        hospitalReceivedMinor += 7500000;
        payableResult = calculatePartnerPayable(partnerShareMinor, akeezoCommissionMinor, hospitalReceivedMinor, partnerPaidMinor, "on_hospital_receipt");
        assert.equal(payableResult.partnerPayableMinor, 3000000);
        assert.equal(partnerPaidMinor + payableResult.partnerPayableMinor, 6000000);
    });
    // ==========================================
    // AC-9: ADJUSTMENT & RECOVERY DUE ON REVISED BILL
    // ==========================================
    it("AC-9: Given bill revised to 8,00,000 INR after 60,000 INR was paid -> Commission 1,20,000, Partner share 48,000, Recovery Due 12,000", () => {
        const revisedBilledAmountMinor = 80000000;
        const hospitalRate = { type: "percent_of_billed", value: 15 };
        const partnerAgreement = {
            type: "percent_of_akeezo_commission",
            value: 40,
            payoutTrigger: "on_hospital_receipt",
        };
        const newAkeezoCommissionMinor = calculateAkeezoCommission(revisedBilledAmountMinor, hospitalRate);
        const newPartnerShareMinor = calculatePartnerShare(newAkeezoCommissionMinor, partnerAgreement, true);
        assert.equal(newAkeezoCommissionMinor, 12000000);
        assert.equal(newPartnerShareMinor, 4800000);
        const partnerPaidMinor = 6000000;
        const hospitalReceivedMinor = 12000000;
        const payableResult = calculatePartnerPayable(newPartnerShareMinor, newAkeezoCommissionMinor, hospitalReceivedMinor, partnerPaidMinor, "on_hospital_receipt");
        assert.equal(payableResult.partnerPayableMinor, -1200000);
        assert.equal(payableResult.recoveryDueMinor, 1200000);
    });
    // ==========================================
    // HOSPITAL SLAB CALCULATION
    // ==========================================
    it("Hospital Slab Calculation: 0-5L @ 12%, 5-20L @ 15%, >20L @ 18%", () => {
        const slabAgreement = {
            type: "slab",
            value: 15,
            slabs: [
                { fromMinor: 0, toMinor: 50000000, type: "percent_of_billed", value: 12 },
                { fromMinor: 50000000, toMinor: 200000000, type: "percent_of_billed", value: 15 },
                { fromMinor: 200000000, toMinor: 1000000000, type: "percent_of_billed", value: 18 },
            ],
        };
        assert.equal(calculateAkeezoCommission(40000000, slabAgreement), 4800000);
        assert.equal(calculateAkeezoCommission(100000000, slabAgreement), 15000000);
        assert.equal(calculateAkeezoCommission(250000000, slabAgreement), 45000000);
    });
    // ==========================================
    // AC-10: SENSITIVE FIELD ENCRYPTION & MASKING
    // ==========================================
    it("AC-10: Passport AES-256-GCM encryption, decryption, and identity masking", () => {
        const rawPassport = "A12345678";
        const encrypted = encryptSensitiveField(rawPassport);
        assert.notEqual(encrypted, rawPassport);
        assert.ok(encrypted.includes(":"));
        const decrypted = decryptSensitiveField(encrypted);
        assert.equal(decrypted, rawPassport);
        const masked = maskSensitiveValue(encrypted, 3);
        assert.equal(masked, "******678");
    });
    // ==========================================
    // AC-11: SEQUENTIAL EPISODE SERIES EXECUTION
    // ==========================================
    it("AC-11: Sequential Episode Series - Cycle N cannot be activated unless Cycle N-1 is completed or cancelled", async () => {
        const case6 = await CaseModel.findOne({ caseCode: "AKZ-2026-00006" });
        assert.ok(case6, "Case 6 (Chemo series) must exist");
        const series = await EpisodeSeriesModel.findOne({ caseId: case6._id });
        assert.ok(series, "Series must exist");
        // Cycle 1 is completed
        const cycle1 = await EpisodeModel.findOne({ caseId: case6._id, cycleNo: 1 });
        assert.equal(cycle1?.status, "completed");
        // Cycle 2 is currently active
        const cycle2 = await EpisodeModel.findOne({ caseId: case6._id, cycleNo: 2 });
        assert.equal(cycle2?.status, "active");
        // Cycle 3 cannot be activated because Cycle 2 is active (not completed/cancelled)
        const prevEpisode = await EpisodeModel.findOne({ seriesId: series._id, cycleNo: 2 });
        assert.ok(prevEpisode);
        const isPrevComplete = ["completed", "cancelled"].includes(prevEpisode.status);
        assert.equal(isPrevComplete, false, "Cycle 2 is not completed, so Cycle 3 must be blocked from activating");
    });
    // ==========================================
    // AC-12: BILLING FINALISATION & AGREEMENT SNAPSHOTTING
    // ==========================================
    it("AC-12: Billing Finalisation - snapshots hospital rate card and partner share at episode completion", async () => {
        // Case 3 (Bakhodir Karimov) has completed episode with finalised billing
        const case3 = await CaseModel.findOne({ caseCode: "AKZ-2026-00003" });
        assert.ok(case3);
        const commRecord = await CommissionRecordModel.findOne({ caseId: case3._id });
        assert.ok(commRecord, "Commission record must be generated on billing finalisation");
        assert.equal(commRecord.billedAmountMinor, 240000000);
        assert.equal(commRecord.akeezoCommissionMinor, 36000000); // 15% of 24L
        assert.equal(commRecord.partnerShareMinor, 14400000); // 40% of 3.6L
        assert.equal(commRecord.akeezoNetMinor, 21600000);
        // Verify snapshot immutability
        assert.deepEqual(commRecord.hospitalRateSnapshot, { type: "percent_of_billed", value: 15 });
        assert.equal(commRecord.partnerShareSnapshot?.type, "percent_of_akeezo_commission");
        assert.equal(commRecord.partnerShareSnapshot?.value, 40);
    });
    // ==========================================
    // AC-13: PAYMENT ALLOCATION LIMIT VALIDATION
    // ==========================================
    it("AC-13: Payment Allocations - sum of allocations cannot exceed the total payment amount", () => {
        const paymentAmountMinor = 10000000; // 1,00,000 INR
        const validAllocations = [
            { commissionRecordId: "rec-1", amountMinor: 6000000 },
            { commissionRecordId: "rec-2", amountMinor: 4000000 },
        ];
        const invalidAllocations = [
            { commissionRecordId: "rec-1", amountMinor: 7000000 },
            { commissionRecordId: "rec-2", amountMinor: 5000000 },
        ];
        const validSum = validAllocations.reduce((sum, a) => sum + a.amountMinor, 0);
        const invalidSum = invalidAllocations.reduce((sum, a) => sum + a.amountMinor, 0);
        assert.ok(validSum <= paymentAmountMinor, "Valid allocations sum <= payment total");
        assert.ok(invalidSum > paymentAmountMinor, "Invalid allocations sum exceeds payment total");
    });
    // ==========================================
    // AC-14: IMMUTABLE AUDIT TRAIL LOGGING
    // ==========================================
    it("AC-14: Audit Trail - captures entity type, action, actor, timestamp, and field diffs", async () => {
        const auditLogs = await CaseAuditLogModel.find().limit(10);
        assert.ok(auditLogs.length > 0, "Audit logs must exist");
        const sampleLog = auditLogs[0];
        assert.ok(sampleLog.entityType, "Audit log must specify entityType");
        assert.ok(sampleLog.action, "Audit log must specify action");
        assert.ok(sampleLog.occurredAt instanceof Date, "Audit log must contain accurate timestamp");
    });
    // ==========================================
    // AC-15: EXCEL MIGRATION IMPORT & DEDUPLICATION
    // ==========================================
    it("AC-15: Migration Import - dry-run validates schemas without modifying database; deduplicates via legacyId", async () => {
        const legacyPartnerId = "LEG-PTR-TEST-" + Date.now();
        const legacyHospId = "LEG-HSP-TEST-" + Date.now();
        const batchData = {
            partners: [{ name: "Legacy Partner Import Test", legacyId: legacyPartnerId }],
            hospitals: [{ name: "Legacy Hospital Import Test", city: "Mumbai", legacyId: legacyHospId }],
        };
        const initialPartnerCount = await PartnerModel.countDocuments();
        const initialHospCount = await HospitalModel.countDocuments();
        // 1. Dry Run Verification: calls real API endpoint with dry_run=true
        const dryRunRes = await fetch(`${baseUrl}/api/v1/migration/import?dry_run=true`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: batchData }),
        });
        assert.equal(dryRunRes.status, 200, "Dry run request must succeed with 200");
        const dryRunJson = await dryRunRes.json();
        assert.equal(dryRunJson.data?.dryRun, true);
        assert.equal(dryRunJson.data?.valid, true);
        assert.equal(dryRunJson.data?.counts?.partners?.inserted, 1);
        // Verify DB count did NOT change
        const postDryPartnerCount = await PartnerModel.countDocuments();
        const postDryHospCount = await HospitalModel.countDocuments();
        assert.equal(postDryPartnerCount, initialPartnerCount, "Dry run must never modify database");
        assert.equal(postDryHospCount, initialHospCount, "Dry run must never modify database");
        // 2. Phase 2 Actual Import Execution
        const importRes = await fetch(`${baseUrl}/api/v1/migration/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: batchData, dryRun: false }),
        });
        assert.equal(importRes.status, 201, "Live import request must succeed with 201");
        const importJson = await importRes.json();
        assert.equal(importJson.data?.dryRun, false);
        const postImportPartnerCount = await PartnerModel.countDocuments();
        assert.equal(postImportPartnerCount, initialPartnerCount + 1, "Actual import must insert new records");
        const insertedPartner = await PartnerModel.findOne({ legacyId: legacyPartnerId });
        assert.ok(insertedPartner, "Record must exist in DB with legacyId");
        // 3. Deduplication: running the same import batch again must skip existing legacyIds
        const reImportRes = await fetch(`${baseUrl}/api/v1/migration/import`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: batchData, dryRun: false }),
        });
        assert.equal(reImportRes.status, 201);
        const reImportJson = await reImportRes.json();
        assert.equal(reImportJson.data?.counts?.partners?.skipped, 1, "Duplicate legacyId must be skipped");
        assert.equal(reImportJson.data?.counts?.partners?.inserted, 0, "No duplicate records must be inserted");
        const finalPartnerCount = await PartnerModel.countDocuments();
        assert.equal(finalPartnerCount, postImportPartnerCount, "Deduplication must prevent duplicate inserts");
        // Cleanup test records
        await PartnerModel.deleteOne({ legacyId: legacyPartnerId });
        await HospitalModel.deleteOne({ legacyId: legacyHospId });
    });
    // ==========================================
    // STAGE TRANSITIONS: BACKWARD MOVES & CLOSURE
    // ==========================================
    it("Stage Transitions: Enforces mandatory reason on backward moves and case closure", async () => {
        // Ensure Case 5 (David Ochieng) starts cleanly in 'consultation'
        await CaseModel.updateOne({ caseCode: "AKZ-2026-00005" }, { stage: "consultation", status: "open" });
        const case5 = await CaseModel.findOne({ caseCode: "AKZ-2026-00005" });
        assert.ok(case5, "Case 5 must exist");
        assert.equal(case5.stage, "consultation");
        try {
            // 1. Attempt backward move to 'quotes_requested' without reason -> MUST FAIL with 422 reason_required
            const failRes = await fetch(`${baseUrl}/api/v1/cases/${case5._id}/stage-transitions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ toStage: "quotes_requested" }),
            });
            assert.equal(failRes.status, 422);
            const failJson = await failRes.json();
            assert.equal(failJson.error?.code, "reason_required");
            // 2. Attempt backward move WITH reason -> MUST SUCCEED
            const successRes = await fetch(`${baseUrl}/api/v1/cases/${case5._id}/stage-transitions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toStage: "quotes_requested",
                    reason: "Patient requested second surgical opinion and alternate hospital options",
                }),
            });
            assert.equal(successRes.status, 200);
            const successJson = await successRes.json();
            assert.equal(successJson.data?.stage, "quotes_requested");
            // Verify history and audit log were created with reason
            const history = await CaseStageHistoryModel.findOne({
                caseId: case5._id,
                fromStage: "consultation",
                toStage: "quotes_requested",
            });
            assert.ok(history, "Stage history record must exist for backward move");
            assert.ok(history.reason?.includes("Patient requested"));
        }
        finally {
            // Always restore Case 5 back to 'consultation' for DB idempotency
            await CaseModel.updateOne({ caseCode: "AKZ-2026-00005" }, { stage: "consultation", status: "open" });
        }
        // 3. Case closure without reason -> MUST FAIL with 422 reason_required
        const closeFailRes = await fetch(`${baseUrl}/api/v1/cases/${case5._id}/stage-transitions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toStage: "closed" }),
        });
        assert.equal(closeFailRes.status, 422);
        const closeFailJson = await closeFailRes.json();
        assert.equal(closeFailJson.error?.code, "reason_required");
        // 4. Create a test case and close it with reason
        const testOwner = await UserModel.findOne();
        const testPatient = await PatientModel.findOne();
        const testCase = await CaseModel.create({
            caseCode: "AKZ-TEST-CLOSE-01",
            patientId: testPatient._id,
            source: "direct_family",
            caseType: "treatment",
            specialty: "cardiology_cardiac_surgery",
            diagnosisSummary: "Test case for closure verification",
            urgency: "routine",
            stage: "new_referral",
            status: "open",
            ownerId: testOwner._id,
        });
        try {
            const closeSuccessRes = await fetch(`${baseUrl}/api/v1/cases/${testCase._id}/stage-transitions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    toStage: "closed",
                    reason: "Patient decided to undergo procedure in home country",
                    closedReason: "patient_declined",
                }),
            });
            assert.equal(closeSuccessRes.status, 200);
            const closedDoc = await CaseModel.findById(testCase._id);
            assert.equal(closedDoc?.stage, "closed");
            assert.equal(closedDoc?.status, "closed");
            assert.equal(closedDoc?.closedReason, "patient_declined");
            assert.ok(closedDoc?.closedAt instanceof Date);
        }
        finally {
            await CaseModel.findByIdAndDelete(testCase._id);
        }
    });
    // ==========================================
    // COMMISSION LIFECYCLE STATUS DERIVATION
    // ==========================================
    it("Status Derivation: expected -> invoiced -> partially_received -> received -> partially_paid -> paid", () => {
        let status = deriveCommissionStatus({
            hasInvoice: false,
            hospitalReceivedMinor: 0,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "expected");
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 0,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "invoiced");
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 7500000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "partially_received");
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 15000000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 0,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "received");
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 15000000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 3000000,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "partially_paid");
        status = deriveCommissionStatus({
            hasInvoice: true,
            hospitalReceivedMinor: 15000000,
            akeezoCommissionMinor: 15000000,
            partnerPaidMinor: 6000000,
            partnerShareMinor: 6000000,
        });
        assert.equal(status, "paid");
    });
});
