process.env.NODE_ENV = "test";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../db/connection.js";
import { app } from "../index.js";
import { EnquiryModel, PatientModel, CaseModel, CaseAuditLogModel, } from "../db/models/index.js";
import { signToken } from "../utils/auth.js";
describe("Dual Portal Architecture Verification: Website Admin & Case Management CMS", () => {
    let server;
    let baseUrl;
    before(async () => {
        await connectDB();
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
    it("1. Super Admin Overview Stats: Enforces strict RBAC and returns unified KPIs for Admin", async () => {
        const adminToken = signToken({ userId: "660000000000000000000001", role: "admin" });
        const coordinatorToken = signToken({ userId: "660000000000000000000002", role: "coordinator" });
        // A. Unauthenticated request must be rejected (401)
        const unauthRes = await fetch(`${baseUrl}/api/v1/admin/overview-stats`);
        assert.equal(unauthRes.status, 401, "Unauthenticated request to /admin/* must be rejected with 401");
        // B. Non-admin user (e.g. coordinator) must be forbidden (403)
        const nonAdminRes = await fetch(`${baseUrl}/api/v1/admin/overview-stats`, {
            headers: { Authorization: `Bearer ${coordinatorToken}` },
        });
        assert.equal(nonAdminRes.status, 403, "Non-admin user accessing /admin/* must be rejected with 403");
        // C. Super Admin request must succeed (200)
        const res = await fetch(`${baseUrl}/api/v1/admin/overview-stats`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(res.status, 200, "Overview stats must return HTTP 200 for Super Admin");
        const json = await res.json();
        assert.ok(json.data, "Response must contain data object");
        // Website stats
        assert.ok(json.data.website, "Must contain website stats");
        assert.ok(typeof json.data.website.totalPages === "number", "Website total pages must be a number");
        // Leads stats
        assert.ok(json.data.leads, "Must contain leads stats");
        assert.ok(typeof json.data.leads.totalEnquiries === "number", "Total enquiries must be a number");
        assert.ok(typeof json.data.leads.conversionRatePercent === "number", "Conversion rate must be a number");
        // Case Management stats
        assert.ok(json.data.caseManagement, "Must contain case management stats");
        assert.ok(typeof json.data.caseManagement.totalCases === "number", "Total cases must be a number");
        assert.ok(typeof json.data.caseManagement.activeCases === "number", "Active cases must be a number");
        assert.ok(json.data.caseManagement.stageBreakdown, "Must contain stage breakdown");
        // System health
        assert.equal(json.data.system.status, "healthy", "System status must be healthy");
    });
    it("2. Website Lead Collector to Case Conversion: POST /api/v1/admin/enquiries/:id/convert-to-case", async () => {
        const adminToken = signToken({ userId: "660000000000000000000001", role: "admin" });
        // A. Create test inbound website lead
        const timestamp = Date.now();
        const receiptId = `TEST-LEAD-${timestamp}`;
        const uniquePhone = `+2547${String(timestamp).slice(-8)}`;
        const testLead = await EnquiryModel.create({
            receiptId,
            requesterName: "Amina Yusuf",
            email: `amina-${timestamp}@test.org`,
            phone: uniquePhone,
            country: "Kenya",
            serviceType: "medical_tourism",
            message: "Patient requires mitral valve replacement quote and urgent visa assistance.",
            sourcePath: "/treatments/cardiology",
            status: "received",
        });
        // B. Trigger convert-to-case from Website Super Admin Lead Collector
        const convertRes = await fetch(`${baseUrl}/api/v1/admin/enquiries/${testLead._id}/convert-to-case`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
        });
        const json = await convertRes.json();
        if (convertRes.status !== 201) {
            console.error("[Convert Error Payload]:", json);
        }
        assert.equal(convertRes.status, 201, "Lead conversion must return HTTP 201");
        assert.ok(json.data, "Must contain conversion data");
        const { caseCode, patient, enquiry } = json.data;
        assert.ok(caseCode.startsWith("CASE-2026-"), `Case code must follow standard pattern, got: ${caseCode}`);
        // C. Verify Patient was created
        const createdPatient = await PatientModel.findById(patient._id);
        assert.ok(createdPatient, "Patient record must exist in database");
        assert.equal(createdPatient.fullName, "Amina Yusuf");
        assert.equal(createdPatient.countryOfResidence, "Kenya");
        // D. Verify Case was created with stage 'new_referral'
        const createdCase = await CaseModel.findOne({ caseCode });
        assert.ok(createdCase, "Case record must exist in database");
        assert.equal(createdCase.stage, "new_referral", "New case must be in new_referral stage");
        assert.equal(createdCase.status, "open", "New case must be open");
        assert.equal(createdCase.specialty, "general_surgery", "Specialty must map correctly from medical_tourism");
        // E. Verify Enquiry was marked as converted
        const updatedEnquiry = await EnquiryModel.findById(testLead._id);
        assert.equal(updatedEnquiry?.status, "converted", "Enquiry status must be converted");
        assert.ok(updatedEnquiry?.notes?.includes(caseCode), "Enquiry notes must reference created case code");
        // F. Verify Case Audit Trail
        const audit = await CaseAuditLogModel.findOne({ caseId: createdCase._id });
        assert.ok(audit, "Case audit log must be recorded");
        assert.equal(audit.action, "create");
        assert.equal(audit.entityType, "case");
        // Clean up test documents
        await CaseAuditLogModel.deleteOne({ caseId: createdCase._id });
        await CaseModel.deleteOne({ _id: createdCase._id });
        await PatientModel.deleteOne({ _id: createdPatient._id });
        await EnquiryModel.deleteOne({ _id: testLead._id });
    });
    it("3. Distinct Static Portals: /admin/ and /case-management/ serve their independent SPAs", async () => {
        // Test A: Website Management Super Admin Portal (/admin/)
        const adminRes = await fetch(`${baseUrl}/admin/`);
        assert.equal(adminRes.status, 200, "/admin/ must return HTTP 200");
        const adminHtml = await adminRes.text();
        assert.ok(adminHtml.includes("Akeezo Website Management & Super Admin") || adminHtml.includes("/admin/assets/"), "/admin/ must serve the dedicated Website Management & Super Admin SPA");
        // Test B: /admin without trailing slash serves index.html or redirects cleanly
        const adminNoSlashRes = await fetch(`${baseUrl}/admin`);
        assert.ok(adminNoSlashRes.status === 200 || adminNoSlashRes.status === 301, "/admin must respond with 200 or 301");
        // Test C: Case Management Portal (/case-management/)
        const cmRes = await fetch(`${baseUrl}/case-management/`);
        assert.equal(cmRes.status, 200, "/case-management/ must return HTTP 200");
        const cmHtml = await cmRes.text();
        assert.ok(cmHtml.includes("case-management") || cmHtml.includes("AKEEZO"), "/case-management/ must serve the dedicated Case Management System SPA");
        // Test D: Ensure /admin/ is NOT redirected to /case-management/
        assert.notEqual(adminRes.url, `${baseUrl}/case-management/`, "/admin/ must NOT redirect to /case-management/");
    });
    it("4. Super Admin Gateway: Non-admin users cannot access /admin via direct URL", async () => {
        const coordinatorToken = signToken({ userId: "660000000000000000000002", role: "coordinator" });
        const partnerToken = signToken({ userId: "660000000000000000000003", role: "partner" });
        // A. Coordinator with cookie attempting to visit /admin must be redirected to /case-management
        const coordRes = await fetch(`${baseUrl}/admin`, {
            headers: { Cookie: `akeezo_session=${encodeURIComponent(coordinatorToken)}` },
            redirect: "manual",
        });
        assert.equal(coordRes.status, 302, "Coordinator attempting to visit /admin must receive 302 redirect");
        assert.ok(coordRes.headers.get("location")?.includes("/case-management?access=denied_super_admin_only"), "Must redirect to case management with denied query param");
        // B. Partner with cookie attempting to visit /admin must also be redirected
        const partnerRes = await fetch(`${baseUrl}/admin/users`, {
            headers: { Cookie: `akeezo_session=${encodeURIComponent(partnerToken)}` },
            redirect: "manual",
        });
        assert.equal(partnerRes.status, 302, "Partner visiting /admin/* must receive 302 redirect");
    });
    it("5. Case Management Cross-Account Isolation and RBAC Protection", async () => {
        // A. Unauthenticated requests to Case Management API must be rejected with 401
        const unauthRes = await fetch(`${baseUrl}/api/v1/cases`);
        assert.equal(unauthRes.status, 401, "Unauthenticated request to /api/v1/cases must be rejected with 401");
        // B. Unauthenticated requests to commission records must be rejected with 401
        const unauthCommRes = await fetch(`${baseUrl}/api/v1/commission-records`);
        assert.equal(unauthCommRes.status, 401, "Unauthenticated request to /commission-records must be rejected with 401");
        // C. Create two distinct partner agencies and cases for isolation test
        const { PartnerModel, CaseModel, PatientModel, UserModel } = await import("../db/models/index.js");
        const testOwner = (await UserModel.findOne()) || new mongoose.Types.ObjectId();
        const testTime = Date.now();
        const partnerA = await PartnerModel.create({
            name: "Tashkent Health Facilitators",
            partnerCode: `TEST-UZ-${testTime}`,
            country: "UZ",
            contactName: "Aziz",
            contactPhone: "+998901234567",
            contactEmail: `aziz-${testTime}@uz-test.org`,
            status: "active",
        });
        const partnerB = await PartnerModel.create({
            name: "Nairobi Medical Escorts",
            partnerCode: `TEST-KE-${testTime}`,
            country: "KE",
            contactName: "John",
            contactPhone: "+254712345678",
            contactEmail: `john-${testTime}@ke-test.org`,
            status: "active",
        });
        const userPartnerA = await UserModel.create({
            name: "Partner Agent A",
            email: `agent-a-${testTime}@uz-test.org`,
            role: "partner",
            partnerId: partnerA._id,
            passwordHash: "hash-test",
            status: "active",
            tokenVersion: 1,
        });
        const userPartnerB = await UserModel.create({
            name: "Partner Agent B",
            email: `agent-b-${testTime}@ke-test.org`,
            role: "partner",
            partnerId: partnerB._id,
            passwordHash: "hash-test",
            status: "active",
            tokenVersion: 1,
        });
        const patientA = await PatientModel.create({
            fullName: "Rustam Karimov",
            dateOfBirth: "1985-04-12",
            sex: "male",
            nationality: "UZ",
            phone: `+99890${String(testTime).slice(-6)}`,
            source: "partner",
        });
        const caseA = await CaseModel.create({
            caseCode: `AKZ-ISO-${testTime}`,
            patientId: patientA._id,
            partnerId: partnerA._id,
            source: "partner",
            caseType: "treatment",
            specialty: "oncology",
            diagnosisSummary: "Gastric adenocarcinoma",
            urgency: "priority",
            stage: "new_referral",
            status: "open",
            ownerId: testOwner._id || testOwner,
        });
        try {
            // Partner A token
            const tokenPartnerA = signToken({
                userId: userPartnerA._id.toString(),
                role: "partner",
                partnerId: partnerA._id.toString(),
            });
            // Partner B token
            const tokenPartnerB = signToken({
                userId: userPartnerB._id.toString(),
                role: "partner",
                partnerId: partnerB._id.toString(),
            });
            // D. Partner A can view Case A
            const viewResA = await fetch(`${baseUrl}/api/v1/cases/${caseA._id}`, {
                headers: { Authorization: `Bearer ${tokenPartnerA}` },
            });
            assert.equal(viewResA.status, 200, "Partner A must be able to read own case");
            // E. Anti-Cross-Access: Partner B CANNOT view Case A -> MUST BE REJECTED WITH 403
            const crossRes = await fetch(`${baseUrl}/api/v1/cases/${caseA._id}`, {
                headers: { Authorization: `Bearer ${tokenPartnerB}` },
            });
            assert.equal(crossRes.status, 403, "Partner B must be forbidden from accessing Partner A's case");
            const crossJson = await crossRes.json();
            assert.equal(crossJson.error?.code, "FORBIDDEN");
            // F. Partner attempting to tamper with query parameter to view Partner A's cases
            const queryTamperRes = await fetch(`${baseUrl}/api/v1/cases?partnerId=${partnerA._id}`, {
                headers: { Authorization: `Bearer ${tokenPartnerB}` },
            });
            assert.equal(queryTamperRes.status, 200);
            const queryTamperJson = await queryTamperRes.json();
            // Server overrides query partnerId with authenticated partner ID, so Partner B gets 0 cases!
            const leakedCase = (queryTamperJson.data || []).find((c) => c._id === caseA._id.toString());
            assert.equal(leakedCase, undefined, "Server must override partnerId query param and never leak other partner cases");
            // G. Partner cannot record payments -> MUST BE REJECTED WITH 403
            const paymentForbiddenRes = await fetch(`${baseUrl}/api/v1/payments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenPartnerA}`,
                },
                body: JSON.stringify({ amountMinor: 100000 }),
            });
            assert.equal(paymentForbiddenRes.status, 403, "Partner role must be rejected from recording payments");
            // H. Partner cannot call migration import -> MUST BE REJECTED WITH 403
            const migrationForbiddenRes = await fetch(`${baseUrl}/api/v1/migration/import`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokenPartnerA}`,
                },
                body: JSON.stringify({ dryRun: true }),
            });
            assert.equal(migrationForbiddenRes.status, 403, "Partner role must be rejected from migration import");
            // I. Search Isolation: Partner A sees case in search, Partner B does NOT
            const searchResA = await fetch(`${baseUrl}/api/v1/cases/search?q=Rustam`, {
                headers: { Authorization: `Bearer ${tokenPartnerA}` },
            });
            assert.equal(searchResA.status, 200);
            const searchJsonA = await searchResA.json();
            assert.equal(searchJsonA.data.length, 1, "Partner A should find their own patient in search");
            const searchResB = await fetch(`${baseUrl}/api/v1/cases/search?q=Rustam`, {
                headers: { Authorization: `Bearer ${tokenPartnerB}` },
            });
            assert.equal(searchResB.status, 200);
            const searchJsonB = await searchResB.json();
            assert.equal(searchJsonB.data.length, 0, "Partner B must NEVER see Partner A's patient in search");
            // J. Partner Statement IDOR: Partner B cannot view Partner A's commission statement
            const statementRes = await fetch(`${baseUrl}/api/v1/partners/${partnerA._id}/statement`, {
                headers: { Authorization: `Bearer ${tokenPartnerB}` },
            });
            assert.equal(statementRes.status, 403, "Partner B must be forbidden from accessing Partner A statement");
            // K. Partner Agency Isolation: Partner B listing partners only sees own partner agency
            const partnersListRes = await fetch(`${baseUrl}/api/v1/partners`, {
                headers: { Authorization: `Bearer ${tokenPartnerB}` },
            });
            assert.equal(partnersListRes.status, 200);
            const partnersListJson = await partnersListRes.json();
            assert.equal(partnersListJson.data.length, 1, "Partner B should only see their own partner agency");
            assert.equal(partnersListJson.data[0]._id, partnerB._id.toString());
        }
        finally {
            await CaseModel.deleteOne({ _id: caseA._id });
            await PatientModel.deleteOne({ _id: patientA._id });
            await PartnerModel.deleteOne({ _id: partnerA._id });
            await PartnerModel.deleteOne({ _id: partnerB._id });
            await UserModel.deleteMany({ _id: { $in: [userPartnerA._id, userPartnerB._id] } });
        }
    });
    it("6. CORS origin security and OTP verification enforcement", async () => {
        // A. CORS: Untrusted origin is rejected (no Access-Control-Allow-Origin returned)
        const corsRes = await fetch(`${baseUrl}/health`, {
            headers: { Origin: "https://unauthorized-attacker-site.com" },
        });
        assert.equal(corsRes.headers.get("access-control-allow-origin"), null, "Untrusted origin must not receive Access-Control-Allow-Origin");
        // B. CORS: Trusted origin receives header
        const trustedCorsRes = await fetch(`${baseUrl}/health`, {
            headers: { Origin: "https://akeezo.com" },
        });
        assert.equal(trustedCorsRes.headers.get("access-control-allow-origin"), "https://akeezo.com", "Trusted domain must receive matching Access-Control-Allow-Origin");
        // C. OTP: Arbitrary 6-digit code must be rejected with 422
        const loginRes = await fetch(`${baseUrl}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "priti@akeezo.com", password: "Akeezo@2026!" }),
        });
        const loginJson = await loginRes.json();
        const tempToken = loginJson.data?.tempToken;
        assert.ok(tempToken, "Login must yield temporary OTP token");
        const invalidOtpRes = await fetch(`${baseUrl}/api/v1/auth/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tempToken, code: "777777" }),
        });
        assert.equal(invalidOtpRes.status, 422, "Arbitrary 6-digit code must be rejected with 422");
        const invalidJson = await invalidOtpRes.json();
        assert.equal(invalidJson.error?.code, "INVALID_OTP_CODE");
        // D. OTP: Valid test code succeeds
        const validOtpRes = await fetch(`${baseUrl}/api/v1/auth/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tempToken, code: "123456" }),
        });
        assert.equal(validOtpRes.status, 200, "Valid OTP code must succeed");
        const validJson = await validOtpRes.json();
        assert.ok(validJson.data?.token, "Must return active session token");
        // E. Phone Number OTP flow (Firebase SMS option)
        const phoneOtpRes = await fetch(`${baseUrl}/api/v1/auth/phone/otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: "+91 98765 43211" }),
        });
        assert.equal(phoneOtpRes.status, 200, "Requesting OTP via phone number must return 200");
        const phoneOtpJson = await phoneOtpRes.json();
        assert.ok(phoneOtpJson.data?.tempToken, "Phone OTP must return temporary session token");
        assert.ok(phoneOtpJson.data?.maskedPhone, "Phone OTP must return masked phone number");
        // Verify OTP from Phone flow
        const phoneVerifyRes = await fetch(`${baseUrl}/api/v1/auth/otp/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tempToken: phoneOtpJson.data.tempToken,
                code: "123456",
                firebaseIdToken: "test-firebase-id-token",
            }),
        });
        assert.equal(phoneVerifyRes.status, 200, "Verifying Phone OTP must return 200");
        const phoneVerifyJson = await phoneVerifyRes.json();
        assert.equal(phoneVerifyJson.data?.user?.email, "priya@akeezo.com");
        // F. Email OTP flow (Firebase One-Time Code option)
        const emailOtpRes = await fetch(`${baseUrl}/api/v1/auth/email/otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "priya@akeezo.com" }),
        });
        assert.equal(emailOtpRes.status, 200, "Requesting OTP via email must return 200");
        const emailOtpJson = await emailOtpRes.json();
        assert.ok(emailOtpJson.data?.tempToken, "Email OTP must return temporary session token");
        // G. Direct Firebase token login endpoint
        const firebaseDirectRes = await fetch(`${baseUrl}/api/v1/auth/firebase`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                firebaseIdToken: "mock-verified-firebase-jwt-token-abcdef1234567890",
                phone: "+91 98765 43211",
            }),
        });
        assert.equal(firebaseDirectRes.status, 200, "Direct Firebase ID token login must return 200");
        const firebaseDirectJson = await firebaseDirectRes.json();
        assert.equal(firebaseDirectJson.data?.user?.email, "priya@akeezo.com");
    });
});
