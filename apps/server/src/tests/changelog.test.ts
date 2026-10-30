import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { app } from "../main.js";
import { UserModel, ChangelogModel } from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";

describe("Platform Changelogs Suite (Admin Recording, Lifecycle, Public API & SSR)", async () => {
  let serverInstance: any;
  let baseUrl = "";
  let adminToken = "";
  let createdChangelogId = "";

  before(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local");
    }

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

    adminToken = signToken({ userId: adminUser._id.toString(), role: "admin" });

    await new Promise<void>((resolve) => {
      serverInstance = app.listen(0, "127.0.0.1", () => {
        const port = (serverInstance.address() as any).port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    // Cleanup test data
    if (createdChangelogId) {
      await ChangelogModel.deleteOne({ _id: createdChangelogId });
    }
    await ChangelogModel.deleteMany({ version: { $regex: /^v99\./ } });

    if (serverInstance) {
      await new Promise<void>((resolve) => serverInstance.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("1. Unauthorized admin access returns 401", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/changelogs`);
    assert.equal(res.status, 401, "Should require authentication");
  });

  test("2. GET /api/v1/admin/changelogs returns seeded records with pagination", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/changelogs?page=1&limit=10`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert.equal(res.status, 200, "Should return 200 OK");
    const json = (await res.json()) as any;
    assert.ok(json.data, "Should return data array");
    assert.ok(Array.isArray(json.data), "Data should be an array");
    assert.ok(json.data.length >= 1, "Should contain seeded changelogs");
    assert.ok(json.pagination, "Should return pagination metadata");
    assert.equal(json.pagination.page, 1);
    assert.ok(json.pagination.total >= 1);

    // Verify fields of seeded record
    const entry = json.data[0];
    assert.ok(entry.version, "Should have version string");
    assert.ok(entry.title, "Should have title");
    assert.ok(entry.category, "Should have category");
    assert.ok(entry.status, "Should have status");
  });

  test("3. POST /api/v1/admin/changelogs records a new release note persistently", async () => {
    const payload = {
      version: "v99.1.0",
      title: "Automated Test Release Note",
      summary: "Comprehensive test release summary for changelog feature.",
      releaseDate: "2026-10-31",
      category: "feature",
      status: "published",
      audience: "all",
      items: [
        { type: "feature", text: "Added advanced changelog recording system", badge: "Admin" },
        { type: "security", text: "Audit trail logging on release note modifications", badge: "Governance" }
      ],
      modules: ["Admin", "Core Platform", "SSR"],
      notes: "### Technical Highlights\n- Itemized bullet builder\n- DPDP administrative audit logging\n- Public SSR /changelog viewer",
      authorName: "Priti SuperAdmin",
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/changelogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });

    assert.equal(res.status, 201, "Should return 201 Created");
    const json = (await res.json()) as any;
    assert.ok(json.data, "Should return created record");
    assert.equal(json.data.version, "v99.1.0");
    assert.equal(json.data.items.length, 2);
    createdChangelogId = json.data._id;

    // Verify MongoDB persistence
    const inDb = await ChangelogModel.findById(createdChangelogId);
    assert.ok(inDb, "Must exist in MongoDB");
    assert.equal(inDb?.title, "Automated Test Release Note");
    assert.equal(inDb?.items[0].badge, "Admin");
  });

  test("4. POST /api/v1/admin/changelogs rejects duplicate versions with 409", async () => {
    const duplicatePayload = {
      version: "v99.1.0",
      title: "Duplicate version attempt",
      releaseDate: "2026-10-31",
      category: "improvement",
      status: "draft",
      audience: "internal",
      items: [{ type: "improvement", text: "Duplicate entry check" }],
      modules: ["Core"],
      authorName: "Priti",
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/changelogs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(duplicatePayload),
    });

    assert.equal(res.status, 409, "Should reject duplicate version with HTTP 409");
  });

  test("5. PUT /api/v1/admin/changelogs/:id updates fields and persists changes", async () => {
    assert.ok(createdChangelogId, "createdChangelogId must be present");

    const updatePayload = {
      title: "Updated Automated Test Release Note",
      summary: "Updated summary reflecting new capabilities.",
      category: "improvement",
      items: [
        { type: "improvement", text: "Polished itemized bullet builder UI", badge: "UI/UX" }
      ],
      notes: "### Updated Highlights\n- Live test verified",
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/changelogs/${createdChangelogId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updatePayload),
    });

    assert.equal(res.status, 200, "Should return 200 OK");
    const json = (await res.json()) as any;
    assert.equal(json.data.title, "Updated Automated Test Release Note");

    // Verify database reflection
    const inDb = await ChangelogModel.findById(createdChangelogId);
    assert.equal(inDb?.title, "Updated Automated Test Release Note");
    assert.equal(inDb?.items[0].badge, "UI/UX");
  });

  test("6. POST /api/v1/admin/changelogs/:id/publish toggles status", async () => {
    assert.ok(createdChangelogId, "createdChangelogId must be present");

    // Toggle to draft
    const res1 = await fetch(`${baseUrl}/api/v1/admin/changelogs/${createdChangelogId}/publish`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert.equal(res1.status, 200, "Should toggle to draft");
    const json1 = (await res1.json()) as any;
    assert.equal(json1.data.status, "draft");

    // Toggle back to published
    const res2 = await fetch(`${baseUrl}/api/v1/admin/changelogs/${createdChangelogId}/publish`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert.equal(res2.status, 200, "Should toggle back to published");
    const json2 = (await res2.json()) as any;
    assert.equal(json2.data.status, "published");
  });

  test("7. GET /api/v1/changelogs returns published public changelogs", async () => {
    const res = await fetch(`${baseUrl}/api/v1/changelogs`);
    assert.equal(res.status, 200, "Public changelog endpoint should return 200 OK");

    const json = (await res.json()) as any;
    assert.ok(Array.isArray(json.data), "Should return array of changelogs");
    assert.ok(json.data.length >= 1, "Should include published entries");

    // Every returned record must be published and audience in all/public
    for (const entry of json.data) {
      assert.equal(entry.status, "published", "Public listing must only contain published entries");
      assert.ok(["all", "public"].includes(entry.audience), "Public listing must only contain all/public audiences");
    }

    // Verify our created release note is present
    const found = json.data.find((e: any) => e.version === "v99.1.0");
    assert.ok(found, "Created published changelog should be present in public API");
  });

  test("8. GET /changelog renders the public release notes SSR page", async () => {
    const res = await fetch(`${baseUrl}/changelog`);
    assert.equal(res.status, 200, "SSR /changelog should return 200 OK");

    const html = await res.text();
    assert.ok(html.includes("Akeezo Platform Changelog &amp; Release Notes") || html.includes("Platform Changelog"), "SSR page should contain header");
    assert.ok(html.includes("v99.1.0"), "SSR page should render the published changelog version");
    assert.ok(html.includes("Updated Automated Test Release Note"), "SSR page should render release title");
  });

  test("9. DELETE /api/v1/admin/changelogs/:id removes the entry", async () => {
    assert.ok(createdChangelogId, "createdChangelogId must be present");

    const res = await fetch(`${baseUrl}/api/v1/admin/changelogs/${createdChangelogId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert.equal(res.status, 200, "Should return 200 OK");

    // Verify deletion from MongoDB
    const inDb = await ChangelogModel.findById(createdChangelogId);
    assert.equal(inDb, null, "Record should be removed from MongoDB");

    // Public API should no longer include it
    const publicRes = await fetch(`${baseUrl}/api/v1/changelogs`);
    const publicJson = (await publicRes.json()) as any;
    const found = publicJson.data.find((e: any) => e.version === "v99.1.0");
    assert.equal(found, undefined, "Deleted changelog should no longer appear in public API");
    createdChangelogId = "";
  });
});
