import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";
import { EnquiryModel } from "../db/models/index.js";
describe("Doctor Details Page & Lead Booking Suite", () => {
    let server;
    let baseUrl;
    const createdEnquiryIds = [];
    before(async () => {
        await connectDB();
        server = http.createServer(app);
        await new Promise((resolve) => {
            // Use isolated port 4099 as per mern-enterprise-guardrails
            server.listen(4099, () => {
                baseUrl = "http://127.0.0.1:4099";
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
    test("1. SSR GET /doctors/semra-kahraman returns HTTP 200 text/html with Physician schema", async () => {
        const res = await fetch(`${baseUrl}/doctors/semra-kahraman`);
        assert.equal(res.status, 200);
        assert.match(res.headers.get("content-type") || "", /text\/html/);
        const html = await res.text();
        assert.ok(html.includes('"@type":"Physician"'), "Must include Physician schema");
        assert.ok(html.includes("Prof. Dr. Semra Kahraman"), "Must include doctor name in schema/body");
        assert.ok(html.includes("Memorial Şişli Hospital"), "Must include hospital affiliation in schema/body");
    });
    test("2. Doctor Hero profile renders verified badges, experience, and ratings", async () => {
        const res = await fetch(`${baseUrl}/doctors/semra-kahraman`);
        const html = await res.text();
        assert.ok(html.includes("Prof. Dr. Semra Kahraman"), "Must render doctor H1 name");
        assert.ok(html.includes("IVF Treatment"), "Must render specialty badge");
        assert.ok(html.includes("Years of Experience"), "Must render experience counter");
        assert.ok(html.includes("Memorial Şişli Hospital"), "Must render hospital location");
    });
    test("3. Procedures section renders clinical procedures catalog with indicative savings", async () => {
        const res = await fetch(`${baseUrl}/doctors/semra-kahraman`);
        const html = await res.text();
        assert.ok(html.includes("In Vitro Fertilization (IVF) with ICSI"), "Must list primary IVF procedure");
        assert.ok(html.includes("Preimplantation Genetic Testing"), "Must list PGT procedure");
        assert.ok(html.includes("Request Procedure Quote"), "Must render Request Procedure Quote CTAs");
    });
    test("4. Sticky Consultation Card renders teleconsultation CTA and guarantees", async () => {
        const res = await fetch(`${baseUrl}/doctors/semra-kahraman`);
        const html = await res.text();
        assert.ok(html.includes("Get Teleconsultation Now"), "Must render primary booking CTA");
        assert.ok(html.includes("Book Teleconsultation / Appointment"), "Must render booking card headline");
        assert.ok(html.includes("DPDP Act 2023 Compliant"), "Must render DPDP compliance badge");
    });
    test("5. Reviews and FAQs sections render verified patient stories and answers", async () => {
        const res = await fetch(`${baseUrl}/doctors/semra-kahraman`);
        const html = await res.text();
        assert.ok(html.includes("Patient Stories &amp; Verified Reviews") || html.includes("Patient Stories & Verified Reviews"), "Must render reviews heading");
        assert.ok(html.includes("Frequently Asked Questions"), "Must render FAQs section");
        assert.ok(html.includes("How many years of clinical experience does Prof. Dr. Semra Kahraman have?"), "Must include specific FAQ item");
    });
    test("6. Public API GET /api/v1/doctors/:slug returns full doctor details", async () => {
        const res = await fetch(`${baseUrl}/api/v1/doctors/semra-kahraman`);
        assert.equal(res.status, 200);
        const json = await res.json();
        assert.ok(json.data, "Must return data object");
        assert.equal(json.data.slug, "semra-kahraman");
        assert.equal(json.data.specialty, "IVF Treatment");
        assert.equal(json.data.experienceYears, 45);
        assert.ok(Array.isArray(json.data.procedures), "Procedures must be an array");
        assert.ok(json.data.procedures.length >= 3, "Must have at least 3 procedures");
    });
    test("7. Public Lead Collection POST /api/v1/enquiries registers consultation with receipt ID", async () => {
        const payload = {
            requesterName: "Sarah Jenkins",
            phone: "+44 7911 123456",
            email: "sarah.jenkins@example.co.uk",
            country: "United Kingdom",
            serviceType: "consultation",
            doctorName: "Prof. Dr. Semra Kahraman",
            doctorSlug: "semra-kahraman",
            hospital: "Memorial Şişli Hospital",
            procedure: "In Vitro Fertilization (IVF) with ICSI",
            consultationType: "video",
            preferredDate: "2026-11-20",
            preferredSlot: "Morning (09:00 - 12:00)",
            message: "Inquiring about IVF with PGT-A for age 38",
        };
        const res = await fetch(`${baseUrl}/api/v1/enquiries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        assert.equal(res.status, 201);
        const json = await res.json();
        assert.equal(json.data.success, true);
        assert.match(json.data.receiptId, /^AKZ-DOC-[A-Z0-9]+-[A-Z0-9]+$/);
        createdEnquiryIds.push(json.data.enquiryId);
        // Verify record in MongoDB
        const saved = (await EnquiryModel.findById(json.data.enquiryId).lean());
        assert.ok(saved, "Enquiry record must exist in MongoDB");
        assert.equal(saved.requesterName, "Sarah Jenkins");
        assert.equal(saved.serviceType, "consultation");
        assert.ok(saved.notes?.includes("Prof. Dr. Semra Kahraman"), "Must include doctor in notes");
    });
    test("8. Permanent Redirect GET /doctor/semra-kahraman returns 301 to /doctors/semra-kahraman", async () => {
        const res = await fetch(`${baseUrl}/doctor/semra-kahraman`, { redirect: "manual" });
        assert.equal(res.status, 301);
        assert.equal(res.headers.get("location"), "/doctors/semra-kahraman");
    });
    test("9. Non-existent doctor slug returns 404 status cleanly", async () => {
        const res = await fetch(`${baseUrl}/doctors/unknown-non-existent-doctor-slug`);
        assert.equal(res.status, 404);
    });
});
