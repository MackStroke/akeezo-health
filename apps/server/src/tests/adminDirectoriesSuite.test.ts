import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";
import { UserModel, Page, ContentRevision, RouteEntry } from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";

describe("Admin Dedicated Healthcare Directories & Tabular Listing Suite", () => {
  let server: http.Server;
  let baseUrl: string;
  let adminToken: string;
  let createdItemId: string | null = null;

  before(async () => {
    await connectDB();
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      // Use isolated port 4096
      server.listen(4096, () => {
        baseUrl = "http://127.0.0.1:4096";
        resolve();
      });
    });

    // Create or retrieve an active super admin user
    let adminUser = await UserModel.findOne({ role: "admin", status: "active" });
    if (!adminUser) {
      adminUser = await UserModel.create({
        name: "Test Super Admin",
        email: "superadmin.dir.test@akeezo.com",
        passwordHash: "$2b$10$abcdefghijklmnopqrstuvwxyz123456",
        role: "admin",
        status: "active",
        phone: "+919876543299",
        tokenVersion: 1,
      });
    }
    adminToken = signToken({
      userId: adminUser._id.toString(),
      role: "admin",
      tokenVersion: adminUser.tokenVersion || 1,
      email: adminUser.email,
    });
  });

  after(async () => {
    if (createdItemId) {
      const page = await Page.findOne({ slug: "doctors", locale: "en" });
      if (page && (page.publishedRevisionId || page.draftRevisionId)) {
        const revId = page.publishedRevisionId || page.draftRevisionId;
        const rev = await ContentRevision.findById(revId);
        if (rev && rev.payload && Array.isArray((rev.payload as any).doctors)) {
          const filtered = (rev.payload as any).doctors.filter((d: any) => d.id !== createdItemId);
          rev.payload = { ...rev.payload, doctors: filtered };
          await rev.save();
        }
      }
    }
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("1. Admin SPA serves dedicated /admin/doctors route with HTTP 200 text/html", async () => {
    const res = await fetch(`${baseUrl}/admin/doctors`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("AKEEZO") || html.includes("admin"), "Must serve admin portal HTML");
  });

  test("2. Admin SPA serves dedicated /admin/hospitals route with HTTP 200 text/html", async () => {
    const res = await fetch(`${baseUrl}/admin/hospitals`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);
  });

  test("3. Admin SPA serves dedicated /admin/treatments route with HTTP 200 text/html", async () => {
    const res = await fetch(`${baseUrl}/admin/treatments`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);
  });

  test("4. Admin SPA serves dedicated /admin/destinations route with HTTP 200 text/html", async () => {
    const res = await fetch(`${baseUrl}/admin/destinations`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);
  });

  test("5. Admin SPA serves dedicated /admin/blog route with HTTP 200 text/html", async () => {
    const res = await fetch(`${baseUrl}/admin/blog`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);
  });

  test("6. In-page Profile views for doctors and hospitals return HTTP 200 text/html", async () => {
    const resDoc = await fetch(`${baseUrl}/admin/doctors?edit=semra-kahraman`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(resDoc.status, 200);

    const resHosp = await fetch(`${baseUrl}/admin/hospitals?action=new`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(resHosp.status, 200);
  });

  test("7. Backend API GET /api/v1/admin/pages/doctors returns doctors catalog", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/pages/doctors`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.page.slug, "doctors");
    assert.ok(json.data.payload, "Must contain payload");
    assert.ok(Array.isArray(json.data.payload.doctors), "Must contain doctors list");
  });

  test("8. Backend API POST /api/v1/admin/pages/doctors/items creates new doctor entry", async () => {
    const testDoctor = {
      name: "Dr. Alistair Sterling",
      slug: "dr-alistair-sterling",
      specialty: "Neurosurgery",
      hospital: "Memorial Healthcare",
      city: "Istanbul",
      country: "Turkey",
      experienceYears: 22,
      rating: 4.95,
      reviewCount: 140,
      consultationFeeUsd: "$120",
      active: true,
      verified: true,
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/pages/doctors/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        item: testDoctor,
        collectionKey: "doctors",
        publishImmediately: true,
      }),
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.ok(json.data.item.id, "Must return created item id");
    assert.equal(json.data.item.name, "Dr. Alistair Sterling");
    createdItemId = json.data.item.id;
  });

  test("9. Backend API PATCH /api/v1/admin/pages/doctors/items/:itemId/toggle toggles status", async () => {
    assert.ok(createdItemId, "Must have createdItemId");
    const res = await fetch(`${baseUrl}/api/v1/admin/pages/doctors/items/${createdItemId}/toggle?collectionKey=doctors`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.active, false, "Status must be toggled to false");
  });

  test("10. Backend API DELETE /api/v1/admin/pages/doctors/items/:itemId removes doctor entry", async () => {
    assert.ok(createdItemId, "Must have createdItemId");
    const res = await fetch(`${baseUrl}/api/v1/admin/pages/doctors/items/${createdItemId}?collectionKey=doctors`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.data.deletedItemId, createdItemId);
    createdItemId = null;
  });
});
