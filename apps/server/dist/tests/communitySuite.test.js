import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";
import { CommunityThreadModel, UserModel } from "../db/models/index.js";
import { seedCommunity } from "../seeds/communitySeed.js";
import { signToken, hashPassword } from "../utils/auth.js";
describe("Community Q&A & Real Patient Stories Suite", () => {
    let server;
    let baseUrl;
    let adminToken;
    const createdThreadIds = [];
    before(async () => {
        await connectDB();
        await seedCommunity();
        // Find or create admin user for test
        let adminUser = await UserModel.findOne({ role: "admin", status: "active" });
        if (!adminUser) {
            adminUser = await UserModel.create({
                name: "Community Test Admin",
                email: `community_admin_${Date.now()}@akeezo.com`,
                phone: `+9199997${Math.floor(10000 + Math.random() * 90000)}`,
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
            permissions: ["all"],
        });
        server = http.createServer(app);
        await new Promise((resolve) => {
            // Use isolated port 4103 as per mern-enterprise-guardrails
            server.listen(4103, () => {
                baseUrl = "http://127.0.0.1:4103";
                resolve();
            });
        });
    });
    after(async () => {
        if (createdThreadIds.length > 0) {
            await CommunityThreadModel.deleteMany({ _id: { $in: createdThreadIds } });
        }
        if (server) {
            await new Promise((resolve) => server.close(() => resolve()));
        }
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
    test("1. SSR GET /community returns HTTP 200 text/html with hero trust metrics and view tabs", async () => {
        const res = await fetch(`${baseUrl}/community`);
        assert.equal(res.status, 200);
        assert.match(res.headers.get("content-type") || "", /text\/html/);
        const html = await res.text();
        assert.ok(html.includes("Medical Travel Q&") || html.includes("Healthcare Community") || html.includes("Patient Stories"), "Must render community hero title");
        assert.ok(html.includes("1,400+") || html.includes("Patient Stories"), "Must render patient stories trust counter");
        assert.ok(html.includes("Doctor Answers") || html.includes("320+"), "Must render doctor answers trust metric");
        assert.ok(html.includes("Ask a Question"), "Must render Ask Question button CTA");
        assert.ok(html.includes("Share Your Journey"), "Must render Share Journey CTA");
        assert.ok(html.includes("Trending"), "Must render Trending view tab");
        assert.ok(html.includes("Doctor Answered"), "Must render Doctor Answered view tab");
        assert.ok(html.includes("Patient Stories"), "Must render Patient Stories tab");
    });
    test("2. SSR GET /community/:slug renders thread with QAPage JSON-LD and doctor responses", async () => {
        const res = await fetch(`${baseUrl}/community/rhinoplasty-at-yanhee-hospital-bangkok-experience`);
        assert.equal(res.status, 200);
        assert.match(res.headers.get("content-type") || "", /text\/html/);
        const html = await res.text();
        assert.ok(html.includes('"@type":"QAPage"') || html.includes("QAPage"), "Must render QAPage JSON-LD schema");
        assert.ok(html.includes("Rhinoplasty at Yanhee Hospital Bangkok"), "Must render discussion thread title");
        assert.ok(html.includes("Sophie Jenkins"), "Must render author name");
        assert.ok(html.includes("United Kingdom"), "Must render patient home country");
        assert.ok(html.includes("Dr. Chokchai Amornpiwat") || html.includes("Plastic & Reconstructive Surgery"), "Must render verified doctor answer");
        assert.ok(html.includes("Yanhee International Hospital"), "Must render hospital reference in story");
    });
    test("3. 301 Redirect: GET /ask-cma redirects to /community", async () => {
        const res = await fetch(`${baseUrl}/ask-cma`, { redirect: "manual" });
        assert.equal(res.status, 301);
        assert.equal(res.headers.get("location"), "/community");
    });
    test("4. 301 Redirect: GET /ask-akeezo redirects to /community", async () => {
        const res = await fetch(`${baseUrl}/ask-akeezo`, { redirect: "manual" });
        assert.equal(res.status, 301);
        assert.equal(res.headers.get("location"), "/community");
    });
    test("5. Non-existent thread slug returns HTTP 404 cleanly", async () => {
        const res = await fetch(`${baseUrl}/community/non-existent-thread-slug-xyz123`);
        assert.equal(res.status, 404);
        const html = await res.text();
        assert.ok(html.includes("Discussion Not Found") || html.includes("404"), "Must indicate not found");
    });
    test("6. Public REST API GET /api/v1/community returns list, category filtering, and search", async () => {
        const res = await fetch(`${baseUrl}/api/v1/community`);
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.ok(body.data, "Must return data envelope");
        assert.ok(Array.isArray(body.data.threads), "Threads must be an array");
        assert.ok(body.data.threads.length > 0, "Should have seeded community threads");
        // Test category filter
        const catRes = await fetch(`${baseUrl}/api/v1/community?category=Cosmetic+%26+Plastic+Surgery`);
        assert.equal(catRes.status, 200);
        const catBody = await catRes.json();
        assert.ok(catBody.data.threads.every((i) => i.category.toLowerCase().includes("cosmetic") || i.category.toLowerCase().includes("plastic")));
        // Test text search
        const searchRes = await fetch(`${baseUrl}/api/v1/community?search=Yanhee`);
        assert.equal(searchRes.status, 200);
        const searchBody = await searchRes.json();
        assert.ok(searchBody.data.threads.length > 0, "Search for 'Yanhee' must return relevant threads");
    });
    test("7. Public REST API GET /api/v1/community/:slug returns full thread detail", async () => {
        const res = await fetch(`${baseUrl}/api/v1/community/rhinoplasty-at-yanhee-hospital-bangkok-experience`);
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.ok(body.data, "Must return data envelope");
        assert.equal(body.data.slug, "rhinoplasty-at-yanhee-hospital-bangkok-experience");
        assert.equal(body.data.author.name, "Sophie Jenkins");
        assert.equal(body.data.isStory, true);
        assert.equal(body.data.storyDetails.costUsd, "$2,850");
        assert.ok(Array.isArray(body.data.replies), "Must return replies array");
    });
    test("8. Public REST API POST /api/v1/community creates new patient question and generates slug", async () => {
        const newThread = {
            title: "Cost and wait time for Dental Implants in Mumbai vs Delhi?",
            category: "Dental",
            content: "I am planning to get full arch dental implants next month. Can anyone who had all-on-4 or all-on-6 in Mumbai share their total cost and appointment timeline?",
            authorName: "Marcus Sterling",
            country: "Australia",
            countryCode: "AU",
            tags: ["Dental", "DentalImplants", "Mumbai", "AllOn4"],
        };
        const res = await fetch(`${baseUrl}/api/v1/community`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newThread),
        });
        assert.equal(res.status, 201);
        const body = await res.json();
        assert.ok(body.data);
        assert.ok(body.data._id || body.data.id);
        assert.match(body.data.slug, /dental-implants/i);
        const createdId = body.data._id || body.data.id;
        createdThreadIds.push(createdId);
        // Verify it is queryable
        const getRes = await fetch(`${baseUrl}/api/v1/community/${body.data.slug}`);
        assert.equal(getRes.status, 200);
    });
    test("9. Public REST API POST /api/v1/community/:threadId/replies posts peer response", async () => {
        const listRes = await fetch(`${baseUrl}/api/v1/community`);
        const listBody = await listRes.json();
        const thread = listBody.data.threads[0];
        const replyPayload = {
            threadId: thread._id || thread.id,
            authorName: "Liam O'Connor",
            content: "Thank you for the detailed breakdown! Did the hospital provide an airport transfer driver directly to your hotel?",
            authorRole: "patient",
        };
        const res = await fetch(`${baseUrl}/api/v1/community/${thread._id || thread.id}/replies`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(replyPayload),
        });
        assert.equal(res.status, 201);
        const body = await res.json();
        assert.ok(body.data.id);
        assert.equal(body.data.content, replyPayload.content);
    });
    test("10. Public REST API POST /api/v1/community/:threadId/upvote increments upvote count", async () => {
        const listRes = await fetch(`${baseUrl}/api/v1/community`);
        const listBody = await listRes.json();
        const thread = listBody.data.threads[0];
        const initialUpvotes = thread.upvotes || 0;
        const res = await fetch(`${baseUrl}/api/v1/community/${thread._id || thread.id}/upvote`, {
            method: "POST",
        });
        assert.equal(res.status, 200);
        const body = await res.json();
        assert.equal(body.data.upvotes, initialUpvotes + 1);
    });
    test("11. Admin Community CMS: Status updates and verified doctor answer posting", async () => {
        // 1. Admin list community threads
        const adminListRes = await fetch(`${baseUrl}/api/v1/admin/community`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(adminListRes.status, 200);
        const adminListBody = await adminListRes.json();
        assert.ok(adminListBody.data.threads.length > 0);
        assert.ok(adminListBody.data.stats.total >= 6);
        const targetThread = adminListBody.data.threads[0];
        const threadId = targetThread._id || targetThread.id;
        // 2. Admin pin toggle
        const pinRes = await fetch(`${baseUrl}/api/v1/admin/community/${threadId}/pin`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ isPinned: true }),
        });
        assert.equal(pinRes.status, 200);
        const pinBody = await pinRes.json();
        assert.equal(pinBody.data.isPinned, true);
        // 3. Admin verified doctor response
        const docAnswerPayload = {
            doctorName: "Dr. Naresh Trehan",
            doctorSpecialty: "Cardiovascular & Thoracic Surgery",
            hospitalName: "Medanta The Medicity, Gurugram",
            doctorId: "dr-naresh-trehan",
            content: "Patients traveling internationally should request digital angiography reviews before booking flights. Ensure 48 hours resting window upon arrival before surgical workups.",
        };
        const docReplyRes = await fetch(`${baseUrl}/api/v1/admin/community/${threadId}/doctor-reply`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${adminToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(docAnswerPayload),
        });
        assert.equal(docReplyRes.status, 201);
        const docReplyBody = await docReplyRes.json();
        assert.equal(docReplyBody.data.isDoctorAnswered, true);
        assert.ok(docReplyBody.data.doctorAnswerPreview);
        assert.equal(docReplyBody.data.doctorAnswerPreview.doctorName, "Dr. Naresh Trehan");
        // 4. Verify thread reflects doctor answer on public API
        const publicVerifyRes = await fetch(`${baseUrl}/api/v1/community/${targetThread.slug}`);
        assert.equal(publicVerifyRes.status, 200);
        const publicVerifyBody = await publicVerifyRes.json();
        assert.equal(publicVerifyBody.data.isDoctorAnswered, true);
    });
});
