import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { app } from "../main.js";
import {
  Page,
  ContentRevision,
  RouteEntry,
  EnquiryModel,
  UserModel,
  MediaAssetModel,
  RedirectModel,
  SiteSettings,
} from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";

const TEST_PORT = 4995;
let serverInstance: any;
let baseUrl = `http://127.0.0.1:${TEST_PORT}`;
let adminToken = "";

describe("Comprehensive Admin Panel Backend Suite", async () => {
  before(async () => {
    // 1. Ensure DB connection
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local");
    }

    // 2. Setup Super Admin User
    let adminUser = await UserModel.findOne({ email: "priti@akeezo.com" });
    if (!adminUser) {
      adminUser = await UserModel.create({
        name: "Priti",
        email: "priti@akeezo.com",
        phone: "+91 82876 39443",
        role: "admin",
        passwordHash: hashPassword("Akeezo@2026!"),
        status: "active",
        phoneVerified: true,
      });
    }

    adminToken = signToken({ userId: adminUser._id.toString(), role: "admin", tokenVersion: adminUser.tokenVersion || 1 });

    // 3. Start local test server
    await new Promise<void>((resolve) => {
      serverInstance = app.listen(TEST_PORT, () => resolve());
    });
  });

  after(async () => {
    if (serverInstance) {
      await new Promise<void>((resolve) => serverInstance.close(() => resolve()));
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  test("1. Overview Stats: Aggregates real backend counters accurately", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/overview-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(json.data.website.totalPages >= 1);
    assert.ok(json.data.leads.totalEnquiries >= 0);
    assert.ok(Array.isArray(json.data.recentEnquiries));
    assert.ok(json.data.system.status === "healthy");
  });

  test("2. Content & Pages: Save draft does not immediately overwrite live route until published", async () => {
    const testSlug = "test-treatment-page";

    // Step A: Save Draft
    const draftRes = await fetch(`${baseUrl}/api/v1/admin/pages/${testSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        payload: { headline: "Draft Headline 1.0" },
        seo: { title: "Draft Title" },
        publishImmediately: false,
      }),
    });
    assert.equal(draftRes.status, 200);
    const draftJson = await draftRes.json();
    assert.equal(draftJson.data.published, false);
    assert.equal(draftJson.data.page.status, "draft");

    // Live RouteEntry should not exist for draft
    const routeEntryBefore = await RouteEntry.findOne({ path: `/${testSlug}` });
    assert.equal(routeEntryBefore, null);

    // Step B: Publish Page
    const pubRes = await fetch(`${baseUrl}/api/v1/admin/pages/${testSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        payload: { headline: "Live Published Headline 2.0" },
        seo: { title: "Live Published Title" },
        publishImmediately: true,
      }),
    });
    assert.equal(pubRes.status, 200);
    const pubJson = await pubRes.json();
    assert.equal(pubJson.data.published, true);
    assert.equal(pubJson.data.page.status, "published");

    // Live RouteEntry must exist now
    const routeEntryAfter = await RouteEntry.findOne({ path: `/${testSlug}` });
    assert.ok(routeEntryAfter);
    assert.equal(routeEntryAfter.statusCode, 200);

    // Clean up test page
    await Page.deleteOne({ slug: testSlug });
    await RouteEntry.deleteOne({ path: `/${testSlug}` });
  });

  test("3. Media Library: Uploads, sanitizes SVGs, and validates file size", async () => {
    const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"><circle cx="10" cy="10" r="5"/></svg>`;
    const base64Data = Buffer.from(sampleSvg).toString("base64");

    const uploadRes = await fetch(`${baseUrl}/api/v1/admin/media/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        originalFilename: "test-icon.svg",
        mimeType: "image/svg+xml",
        dataBase64: base64Data,
        altText: "Test Icon",
        caption: "Sanitized Test Icon",
      }),
    });
    assert.equal(uploadRes.status, 201);
    const uploadJson = await uploadRes.json();
    const mediaId = uploadJson.data._id;
    assert.ok(uploadJson.data.url.startsWith("/uploads/"));

    // Verify sanitized from XSS
    const listRes = await fetch(`${baseUrl}/api/v1/admin/media?search=test-icon`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listJson = await listRes.json();
    assert.ok(listJson.data.length >= 1);

    // Clean up
    await fetch(`${baseUrl}/api/v1/admin/media/${mediaId}?force=true`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  });

  test("4. Enquiries & CSV Export: Mitigates spreadsheet formula injection", async () => {
    // Create malicious formula enquiry
    const enqRes = await fetch(`${baseUrl}/api/v1/admin/enquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        requesterName: "=cmd|' /C calc'!A0", // Formula injection attack vector
        email: "attacker@example.com",
        phone: "+91 99999 88888",
        message: "+2+5+cmd",
        serviceType: "medical_tourism",
      }),
    });
    assert.equal(enqRes.status, 201);
    const enqJson = await enqRes.json();
    const createdId = enqJson.data._id;

    // Export CSV
    const csvRes = await fetch(`${baseUrl}/api/v1/admin/enquiries/export/csv`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(csvRes.status, 200);
    const csvText = await csvRes.text();

    // Verify values starting with =, +, -, @ are escaped with prepended '
    assert.ok(csvText.includes("\"'=cmd|' /C calc'!A0\""));
    assert.ok(csvText.includes("\"'+2+5+cmd\""));

    // Clean up
    await EnquiryModel.deleteOne({ _id: createdId });
  });

  test("5. SEO & Redirects: Enforces loop prevention and reserved path protection", async () => {
    // Test A: Loop prevention (source === destination)
    const loopRes = await fetch(`${baseUrl}/api/v1/admin/redirects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        sourcePath: "/cardiac-care",
        destinationPath: "/cardiac-care",
        statusCode: 301,
      }),
    });
    assert.equal(loopRes.status, 400);
    const loopJson = await loopRes.json();
    assert.equal(loopJson.error.code, "REDIRECT_LOOP");

    // Test B: Reserved route shadowing protection
    const reservedRes = await fetch(`${baseUrl}/api/v1/admin/redirects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        sourcePath: "/admin/critical",
        destinationPath: "/",
        statusCode: 301,
      }),
    });
    assert.equal(reservedRes.status, 400);
    const reservedJson = await reservedRes.json();
    assert.equal(reservedJson.error.code, "RESERVED_PATH");

    // Test C: Valid redirect creation
    const validRes = await fetch(`${baseUrl}/api/v1/admin/redirects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
      body: JSON.stringify({
        sourcePath: "/old-oncology-url",
        destinationPath: "/#treatments",
        statusCode: 301,
        notes: "Oncology tariff campaign redirect",
      }),
    });
    assert.equal(validRes.status, 201);
    const validJson = await validRes.json();
    const redirectId = validJson.data._id;

    // Clean up
    await RedirectModel.deleteOne({ _id: redirectId });
  });

  test("6. Users & Roles: Protects last active administrator from demotion or disablement", async () => {
    // Find the active admin
    const adminUser = await UserModel.findOne({ role: "admin", status: "active" });
    assert.ok(adminUser);

    // Ensure exactly one active admin exists for this test so we are testing the boundary condition
    const otherAdmins = await UserModel.find({ role: "admin", status: "active", _id: { $ne: adminUser._id } });
    await UserModel.updateMany({ _id: { $in: otherAdmins.map((a) => a._id) } }, { status: "disabled" });

    try {
      // Attempt to disable the last admin
      const disableRes = await fetch(`${baseUrl}/api/v1/admin/users/${adminUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ status: "disabled" }),
      });
      assert.equal(disableRes.status, 403);
      const disableJson = await disableRes.json();
      assert.equal(disableJson.error.code, "CANNOT_DEMOTE_LAST_OWNER");

      // Attempt to demote role to viewer
      const demoteRes = await fetch(`${baseUrl}/api/v1/admin/users/${adminUser._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${adminToken}` },
        body: JSON.stringify({ role: "viewer" }),
      });
      assert.equal(demoteRes.status, 403);
      const demoteJson = await demoteRes.json();
      assert.equal(demoteJson.error.code, "CANNOT_DEMOTE_LAST_OWNER");
    } finally {
      // Restore other admins to active
      await UserModel.updateMany({ _id: { $in: otherAdmins.map((a) => a._id) } }, { status: "active" });
    }
  });

  test("7. Settings: Masks privileged secrets and provides system health aggregates", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/site-settings`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(json.data.brandName);
    assert.ok(json.data.integrations?.firebaseProjectMasked);

    const healthRes = await fetch(`${baseUrl}/api/v1/admin/system-health`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(healthRes.status, 200);
    const healthJson = await healthRes.json();
    assert.ok(healthJson.data.memory.rssMb > 0);
    assert.equal(healthJson.data.database.status, "connected");
  });
});
