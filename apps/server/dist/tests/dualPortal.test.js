process.env.NODE_ENV = "test";
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
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
});
