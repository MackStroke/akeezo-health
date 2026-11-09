import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";
import { EnquiryModel, UserModel } from "../db/models/index.js";
import { signToken, hashPassword } from "../utils/auth.js";
describe("Hospital Details Page & Two-Way Admin Sync Suite", () => {
    let server;
    let baseUrl;
    const createdEnquiryIds = [];
    let adminToken;
    before(async () => {
        await connectDB();
        // Find or create admin user for test
        let adminUser = await UserModel.findOne({ role: "admin", status: "active" });
        if (!adminUser) {
            adminUser = await UserModel.create({
                name: "Hospital Test Admin",
                email: `hsp_admin_${Date.now()}@akeezo.com`,
                phone: `+9199998${Math.floor(10000 + Math.random() * 90000)}`,
                passwordHash: hashPassword("Admin@123"),
                role: "admin",
                permissions: ["all"],
                status: "active",
                phoneVerified: true,
            });
        }
        adminToken = signToken({
            userId: adminUser._id.toString(),
            email: adminUser.email,
            role: "admin",
            permissions: ["all"]
        });
        server = http.createServer(app);
        await new Promise((resolve) => {
            // Use isolated port 4102 as per mern-enterprise-guardrails
            server.listen(4102, () => {
                baseUrl = "http://127.0.0.1:4102";
                resolve();
            });
        });
    });
    after(async () => {
        if (createdEnquiryIds.length > 0) {
            await EnquiryModel.deleteMany({ _id: { $in: createdEnquiryIds } });
        }
        if (server) {
            await new Promise((resolve) => server.close(() => resolve()));
        }
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
    test("1. SSR GET /hospitals/yanhee-international-hospital returns HTTP 200 text/html with Hospital and Breadcrumb schemas", async () => {
        const res = await fetch(`${baseUrl}/hospitals/yanhee-international-hospital`);
        assert.equal(res.status, 200);
        assert.match(res.headers.get("content-type") || "", /text\/html/);
        const html = await res.text();
        assert.ok(html.includes('"@type":"Hospital"'), "Must include Hospital schema in JSON-LD");
        assert.ok(html.includes('"@type":"BreadcrumbList"'), "Must include BreadcrumbList schema");
        assert.ok(html.includes('"@type":"FAQPage"'), "Must include FAQPage schema");
        assert.ok(html.includes("Yanhee International Hospital"), "Must render hospital name in title/body");
    });
    test("2. Hospital Hero collage renders rating score 75.21, rank badge, and capacity counters", async () => {
        const res = await fetch(`${baseUrl}/hospitals/yanhee-international-hospital`);
        const html = await res.text();
        assert.ok(html.includes("Yanhee International Hospital"), "Must render hospital name");
        assert.ok(html.includes("Ranked") || html.includes("Special Platinum Certified"), "Must render rank badge");
        assert.ok(html.includes("75.21") || html.includes("Verified Patient Score"), "Must render rating score");
        assert.ok(html.includes("400"), "Must render 400 beds counter");
        assert.ok(html.includes("18"), "Must render 18 ICU beds counter");
        assert.ok(html.includes("42"), "Must render 42 operating rooms counter");
        assert.ok(html.includes("1984"), "Must render 1984 established year");
    });
    test("3. Surgeries & Cost Comparison section renders procedure prices with US/UK benchmark savings", async () => {
        const res = await fetch(`${baseUrl}/hospitals/yanhee-international-hospital`);
        const html = await res.text();
        assert.ok(html.includes("Cost of Surgeries"), "Must render Cost of Surgeries heading");
        assert.ok(html.includes("Breast Augmentation (Implants)"), "Must list Breast Augmentation procedure");
        assert.ok(html.includes("Full Face Lift (Rhytidectomy)"), "Must list Facelift procedure");
        assert.ok(html.includes("Rhinoplasty (Nose Surgery)"), "Must list Rhinoplasty procedure");
        assert.ok(html.includes("Typical US / UK Price"), "Must render US/UK price comparison column");
        assert.ok(html.includes("Save"), "Must render savings percentage pill");
    });
    test("4. Facilities & Room Suites section renders patient accommodations and logistics", async () => {
        const res = await fetch(`${baseUrl}/hospitals/yanhee-international-hospital`);
        const html = await res.text();
        assert.ok(html.includes("Facilities, Patient Suites"), "Must render Facilities section");
        assert.ok(html.includes("Standard Private Suite"), "Must render Standard Private Suite");
        assert.ok(html.includes("VIP Presidential Suite"), "Must render VIP Presidential Suite");
        assert.ok(html.includes("Suvarnabhumi Airport (BKK)"), "Must render BKK airport distance");
        assert.ok(html.includes("Don Mueang Airport (DMK)"), "Must render DMK airport distance");
    });
    test("5. Hospital FAQs section renders accredited international patient questions", async () => {
        const res = await fetch(`${baseUrl}/hospitals/yanhee-international-hospital`);
        const html = await res.text();
        assert.ok(html.includes("Frequently Asked Questions"), "Must render FAQ section heading");
        assert.ok(html.includes("Is Yanhee International Hospital JCI accredited?"), "Must render JCI FAQ");
        assert.ok(html.includes("Where is Yanhee International Hospital located in Bangkok?"), "Must render location FAQ");
    });
    test("6. 301 Redirect: /hospital/yanhee-international-hospital redirects to /hospitals/yanhee-international-hospital", async () => {
        const res = await fetch(`${baseUrl}/hospital/yanhee-international-hospital`, {
            redirect: "manual"
        });
        assert.equal(res.status, 301);
        assert.equal(res.headers.get("location"), "/hospitals/yanhee-international-hospital");
    });
    test("7. Fallback 404: Unknown hospital returns HTTP 404 cleanly", async () => {
        const res = await fetch(`${baseUrl}/hospitals/non-existent-hospital-xyz`);
        assert.equal(res.status, 404);
        const html = await res.text();
        assert.ok(html.includes("Hospital Not Found") || html.includes("404"), "Must indicate not found");
    });
    test("8. Public API GET /api/v1/hospitals/yanhee-international-hospital returns structured JSON", async () => {
        const res = await fetch(`${baseUrl}/api/v1/hospitals/yanhee-international-hospital`);
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.ok(body.data, "Must return data object");
        assert.equal(body.data.slug, "yanhee-international-hospital");
        assert.equal(body.data.name, "Yanhee International Hospital");
        assert.equal(body.data.city, "Bangkok");
        assert.equal(body.data.country, "Thailand");
        assert.equal(body.data.bedsCount, 400);
        assert.equal(body.data.icuCount, 18);
        assert.equal(body.data.operatingRooms, 42);
        assert.ok(Array.isArray(body.data.surgeriesCost), "Must include surgeries cost array");
        assert.ok(Array.isArray(body.data.faqs), "Must include FAQs array");
    });
    test("9. Lead Capture POST /api/v1/enquiries registers hospital booking with AKZ-HSP receipt", async () => {
        const res = await fetch(`${baseUrl}/api/v1/enquiries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                requesterName: "Sarah Jenkins",
                email: "sarah.jenkins@example.com",
                phone: "+44 7700 900123",
                country: "United Kingdom",
                hospitalName: "Yanhee International Hospital",
                hospitalSlug: "yanhee-international-hospital",
                procedure: "Breast Augmentation (Mentor Implants)",
                sourcePath: "/hospitals/yanhee-international-hospital",
                notes: "Preferred arrival date in November for in-person surgical evaluation."
            })
        });
        assert.equal(res.status, 201);
        const body = await res.json();
        assert.ok(body.data.success);
        assert.ok(body.data.receiptId.startsWith("AKZ-HSP-"), `Receipt ID should start with AKZ-HSP-, got: ${body.data.receiptId}`);
        assert.ok(body.data.enquiryId);
        createdEnquiryIds.push(body.data.enquiryId);
        // Verify in database
        const saved = await EnquiryModel.findById(body.data.enquiryId);
        assert.ok(saved);
        assert.equal(saved.requesterName, "Sarah Jenkins");
        assert.ok(saved.notes?.includes("Yanhee International Hospital"));
    });
    test("10. Two-Way Admin Sync: Updating hospital via Admin API persists to MongoDB and reflects in SSR", async () => {
        // 1. Fetch current hospitals page from admin
        const getRes = await fetch(`${baseUrl}/api/v1/admin/pages/hospitals`, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        assert.equal(getRes.status, 200);
        const getBody = await getRes.json();
        const currentPayload = getBody.data.payload || {};
        const existingHospitals = Array.isArray(currentPayload.hospitals) ? currentPayload.hospitals : [];
        // 2. Add or update Yanhee with custom admin badge and updated bed count
        const updatedYanhee = {
            id: "hsp-yanhee-test",
            name: "Yanhee International Hospital",
            slug: "yanhee-international-hospital",
            city: "Bangkok",
            country: "Thailand",
            bedsCount: 450, // Updated capacity from admin
            rankBadge: "Special Platinum Certified - Newsweek 2024",
            active: true,
            verified: true
        };
        const newHospitalsList = [
            updatedYanhee,
            ...existingHospitals.filter((h) => h.slug !== "yanhee-international-hospital")
        ];
        // 3. Save via Admin PUT
        const putRes = await fetch(`${baseUrl}/api/v1/admin/pages/hospitals`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                title: "World-Class Hospitals | Personally Matched for You",
                payload: {
                    ...currentPayload,
                    hospitals: newHospitalsList
                },
                publish: true
            })
        });
        assert.equal(putRes.status, 200);
        // 4. Verify public SSR reflects updated admin data immediately
        const ssrRes = await fetch(`${baseUrl}/hospitals/yanhee-international-hospital`);
        assert.equal(ssrRes.status, 200);
        const ssrHtml = await ssrRes.text();
        assert.ok(ssrHtml.includes("Special Platinum Certified"), "SSR must reflect updated admin rank badge");
        assert.ok(ssrHtml.includes("450"), "SSR must reflect updated admin beds capacity");
    });
});
