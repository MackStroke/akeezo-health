import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { app } from "../main.js";
import { UserModel } from "../db/models/index.js";
import { signToken } from "../utils/auth.js";
const PORT = 4098;
const baseUrl = `http://localhost:${PORT}`;
let server;
let adminToken;
let nonAdminToken;
before(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local");
    }
    // Create or retrieve super admin test token
    const adminUser = await UserModel.findOne({ role: "admin" }) || {
        _id: "660000000000000000000006",
        role: "admin",
        name: "Super Admin",
        tokenVersion: 1,
    };
    adminToken = signToken({
        userId: String(adminUser._id),
        role: "admin",
        name: adminUser.name || "Super Admin",
        tokenVersion: 1,
    });
    nonAdminToken = signToken({
        userId: "660000000000000000000007",
        role: "coordinator",
        name: "Coordinator User",
        tokenVersion: 1,
    });
    server = app.listen(PORT);
    await new Promise((resolve) => setTimeout(resolve, 300));
});
after(async () => {
    if (server) {
        await new Promise((resolve) => server.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
});
test("Admin Notifications Suite", async (t) => {
    await t.test("1. Unauthorized requests are rejected (401)", async () => {
        const res = await fetch(`${baseUrl}/api/v1/admin/notifications`);
        assert.equal(res.status, 401);
    });
    await t.test("2. Non-admin users are forbidden (403)", async () => {
        const res = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${nonAdminToken}` },
        });
        assert.equal(res.status, 403);
    });
    await t.test("3. Super Admin retrieves aggregated notifications with unread counter", async () => {
        const res = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(res.status, 200);
        const json = await res.json();
        assert.ok(json.data);
        assert.ok(Array.isArray(json.data.notifications));
        assert.equal(typeof json.data.unreadCount, "number");
        assert.equal(typeof json.data.totalCount, "number");
        // Notifications must have structured fields
        if (json.data.notifications.length > 0) {
            const first = json.data.notifications[0];
            assert.ok(first.id);
            assert.ok(first.title);
            assert.ok(first.message);
            assert.ok(first.category);
            assert.equal(typeof first.isRead, "boolean");
        }
    });
    await t.test("4. Marking individual notification as read updates read status", async () => {
        const listRes = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const listJson = await listRes.json();
        const target = listJson.data.notifications[0];
        assert.ok(target, "Must have at least one notification to test");
        const patchRes = await fetch(`${baseUrl}/api/v1/admin/notifications/${target.id}/read`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(patchRes.status, 200);
        const patchJson = await patchRes.json();
        assert.equal(patchJson.data.success, true);
        assert.equal(patchJson.data.isRead, true);
        // Verify it reflects in list
        const checkRes = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const checkJson = await checkRes.json();
        const updated = checkJson.data.notifications.find((n) => n.id === target.id);
        assert.ok(updated);
        assert.equal(updated.isRead, true);
    });
    await t.test("5. Marking all notifications as read resets unread counter", async () => {
        const listRes = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const listJson = await listRes.json();
        const ids = listJson.data.notifications.map((n) => n.id);
        const markAllRes = await fetch(`${baseUrl}/api/v1/admin/notifications/mark-all-read`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({ ids }),
        });
        assert.equal(markAllRes.status, 200);
        const checkRes = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const checkJson = await checkRes.json();
        assert.equal(checkJson.data.unreadCount, 0);
    });
    await t.test("6. Dismissing notification removes it from active notifications list", async () => {
        const listRes = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const listJson = await listRes.json();
        const target = listJson.data.notifications[0];
        assert.ok(target);
        const delRes = await fetch(`${baseUrl}/api/v1/admin/notifications/${target.id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(delRes.status, 200);
        const checkRes = await fetch(`${baseUrl}/api/v1/admin/notifications`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const checkJson = await checkRes.json();
        const exists = checkJson.data.notifications.some((n) => n.id === target.id);
        assert.equal(exists, false, "Dismissed notification must not be present in active list");
    });
});
