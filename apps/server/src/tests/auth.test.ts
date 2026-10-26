import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
} from "../utils/auth.js";

describe("Authentication & RBAC Security Verification", () => {
  it("Password hashing and secure verification", () => {
    const rawPassword = "AdminSecret2026!";
    const hash = hashPassword(rawPassword);

    assert.notEqual(hash, rawPassword);
    assert.equal(verifyPassword(rawPassword, hash), true);
    assert.equal(verifyPassword("WrongPassword123", hash), false);
  });

  it("JWT Session Token generation and signature verification", () => {
    const payload = { userId: "user-12345", role: "admin" };
    const token = signToken(payload);

    assert.ok(token);
    assert.equal(token.split(".").length, 3);

    const verified = verifyToken(token);
    assert.ok(verified);
    assert.equal(verified?.userId, "user-12345");
    assert.equal(verified?.role, "admin");
    assert.ok(verified?.exp);
  });

  it("JWT rejects tampered signatures", () => {
    const payload = { userId: "user-12345", role: "coordinator" };
    const token = signToken(payload);
    const [header, body, signature] = token.split(".");

    // Tamper with payload (escalating to admin)
    const tamperedBody = Buffer.from(JSON.stringify({ userId: "user-12345", role: "admin" }))
      .toString("base64")
      .replace(/=/g, "");
    const forgedToken = `${header}.${tamperedBody}.${signature}`;

    const verified = verifyToken(forgedToken);
    assert.equal(verified, null); // Signature mismatch must reject!
  });

  it("Phone OTP temporary tokens contain isTempOtp and phone claims", () => {
    const tempToken = signToken(
      { userId: "user-admin", phone: "+91 82876 39443", isTempOtp: true, isTemp2FA: true },
      true
    );
    const verified = verifyToken(tempToken);

    assert.ok(verified);
    assert.equal(verified?.userId, "user-admin");
    assert.equal(verified?.phone, "+91 82876 39443");
    assert.equal(verified?.isTempOtp, true);
    assert.equal(verified?.isTemp2FA, true);
  });

  it("UserSession schema enforces TTL expiration and token hash uniqueness", async () => {
    const { UserSessionModel } = await import("../db/models/UserSession.js");
    const indexes = UserSessionModel.schema.indexes();

    const ttlIndex = indexes.find(
      ([idx, opts]: any) => idx.expiresAt === 1 && opts?.expireAfterSeconds === 0
    );
    assert.ok(ttlIndex, "UserSession must define a TTL index on expiresAt with expireAfterSeconds: 0");

    const tokenHashField = UserSessionModel.schema.path("tokenHash") as any;
    assert.equal(tokenHashField?.options?.unique, true, "UserSession tokenHash must be unique");
  });

  it("User model schema defines tokenVersion and compound indexes for session security", async () => {
    const { UserModel } = await import("../db/models/User.js");
    const tokenVersionField = UserModel.schema.path("tokenVersion") as any;
    assert.ok(tokenVersionField, "User schema must define tokenVersion field for session invalidation");
    assert.equal(tokenVersionField.defaultValue, 1);

    const indexes = UserModel.schema.indexes();
    const roleStatusIndex = indexes.find(
      ([idx]: any) => idx.role === 1 && idx.status === 1
    );
    assert.ok(roleStatusIndex, "User schema must have compound index on { role: 1, status: 1 }");
  });

  it("Token versioning: signs tokens with user's tokenVersion", () => {
    const tokenV1 = signToken({ userId: "u-1", tokenVersion: 1 });
    const verifiedV1 = verifyToken(tokenV1);
    assert.equal(verifiedV1?.tokenVersion, 1);

    const tokenV2 = signToken({ userId: "u-1", tokenVersion: 2 });
    const verifiedV2 = verifyToken(tokenV2);
    assert.equal(verifiedV2?.tokenVersion, 2);
  });
});
