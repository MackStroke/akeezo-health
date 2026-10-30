import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { app } from "../main.js";
import { UserModel, SiteSettings, RouteEntry, Page, ContentRevision } from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";

describe("Third-Party Platform Integrations Suite (GTM, GCP, Meta, Gemini, GA4)", async () => {
  let serverInstance: any;
  let baseUrl = "";
  let adminToken = "";

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
    if (serverInstance) {
      await new Promise<void>((resolve) => serverInstance.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("1. GET /api/v1/admin/integrations returns all 5 platform integrations masked", async () => {
    const res = await fetch(`${baseUrl}/api/v1/admin/integrations`, {
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });

    assert.equal(res.status, 200, "Should return 200 OK");
    const json = (await res.json()) as any;
    assert.ok(json.data, "Should return data payload");

    const data = json.data;
    assert.ok(data.googleTagManager, "googleTagManager config must exist");
    assert.ok(data.googleCloud, "googleCloud config must exist");
    assert.ok(data.metaPixel, "metaPixel config must exist");
    assert.ok(data.gemini, "gemini config must exist");
    assert.ok(data.googleAnalytics, "googleAnalytics config must exist");

    // DPDP Act compliance: raw secret must never be exposed
    assert.equal(data.gemini.apiKey, "", "Raw apiKey must be stripped in response");
    assert.ok(data.gemini.apiKeyMasked.includes("•"), "Masked apiKey must be present");
  });

  test("2. PUT /api/v1/admin/integrations updates configs and preserves raw secret on masked re-save", async () => {
    const secretKey = "AIzaSyTestSecretEncryptionVerification123456";

    // Step A: Save raw secret key and enable platforms
    const putRes1 = await fetch(`${baseUrl}/api/v1/admin/integrations`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleTagManager: {
          enabled: true,
          containerId: "GTM-TEST999",
        },
        googleCloud: {
          enabled: true,
          projectId: "akeezo-health-prod",
          region: "asia-south1",
          storageBucket: "gs://akeezo-vault-prod",
        },
        metaPixel: {
          enabled: true,
          pixelId: "982347109283471",
          testEventCode: "TEST84920",
        },
        gemini: {
          enabled: true,
          apiKey: secretKey,
          model: "gemini-2.0-flash",
          temperature: 0.25,
        },
        googleAnalytics: {
          enabled: true,
          measurementId: "G-TESTGA4XXXX",
          anonymizeIp: true,
        },
      }),
    });

    assert.equal(putRes1.status, 200, "Should update integrations successfully");
    const json1 = (await putRes1.json()) as any;
    assert.equal(json1.data.googleTagManager.containerId, "GTM-TEST999");
    assert.equal(json1.data.gemini.apiKey, "", "apiKey must be empty in response");
    assert.ok(json1.data.gemini.apiKeyMasked.startsWith("AIzaSy"), "Mask should retain prefix");

    // Verify raw secret exists in DB
    const dbSettings1 = await SiteSettings.findOne();
    assert.equal(dbSettings1?.integrations?.gemini?.apiKey, secretKey, "DB must hold the raw API key");

    // Step B: Re-save using masked bullets (simulating the admin updating another field)
    const putRes2 = await fetch(`${baseUrl}/api/v1/admin/integrations`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${adminToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        googleTagManager: {
          enabled: true,
          containerId: "GTM-TEST999",
        },
        gemini: {
          enabled: true,
          apiKey: json1.data.gemini.apiKeyMasked, // Client submits masked bullets!
          model: "gemini-1.5-pro",
          temperature: 0.1,
        },
      }),
    });

    assert.equal(putRes2.status, 200, "Should handle masked re-save gracefully");
    const json2 = (await putRes2.json()) as any;
    assert.equal(json2.data.gemini.model, "gemini-1.5-pro");

    // Verify raw secret was preserved in DB and NOT overwritten with bullets
    const dbSettings2 = await SiteSettings.findOne();
    assert.equal(
      dbSettings2?.integrations?.gemini?.apiKey,
      secretKey,
      "Raw API key must NOT be overwritten by masked bullets"
    );
  });

  test("3. Validation endpoints reject invalid formats and accept valid syntax", async () => {
    // 3a. GTM validation
    const gtmValid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/google-tag-manager`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ containerId: "GTM-AKZ89P4" }),
    });
    assert.equal(gtmValid.status, 200);
    const gtmValidJson = (await gtmValid.json()) as any;
    assert.equal(gtmValidJson.ok, true);

    const gtmInvalid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/google-tag-manager`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ containerId: "INVALID_GTM_CONTAINER" }),
    });
    assert.equal(gtmInvalid.status, 400);

    // 3b. GCP Project validation
    const gcpValid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/google-cloud`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: "akeezo-health-prod" }),
    });
    assert.equal(gcpValid.status, 200);

    const gcpInvalid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/google-cloud`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ projectId: "INVALID_PROJECT_WITH_CAPS!" }),
    });
    assert.equal(gcpInvalid.status, 400);

    // 3c. Meta Pixel validation
    const metaValid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/meta-pixel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ pixelId: "982347109283471" }),
    });
    assert.equal(metaValid.status, 200);

    const metaInvalid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/meta-pixel`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ pixelId: "not-a-number" }),
    });
    assert.equal(metaInvalid.status, 400);

    // 3d. GA4 validation
    const gaValid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/google-analytics`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ measurementId: "G-AKEEZO2026X" }),
    });
    assert.equal(gaValid.status, 200);

    const gaInvalid = await fetch(`${baseUrl}/api/v1/admin/integrations/test/google-analytics`, {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ measurementId: "bad-format-id" }),
    });
    assert.equal(gaInvalid.status, 400);
  });

  test("4. Public Website SSR dynamically injects GTM, GA4, and Meta Pixel scripts", async () => {
    // Enable GTM, GA4, and Meta Pixel in active SiteSettings
    await SiteSettings.updateOne(
      {},
      {
        $set: {
          "integrations.googleTagManager.enabled": true,
          "integrations.googleTagManager.containerId": "GTM-TEST999",
          "integrations.googleAnalytics.enabled": true,
          "integrations.googleAnalytics.measurementId": "G-TESTGA4XXXX",
          "integrations.googleAnalytics.anonymizeIp": true,
          "integrations.metaPixel.enabled": true,
          "integrations.metaPixel.pixelId": "982347109283471",
        },
      }
    );

    // Request public SSR page
    const ssrRes = await fetch(`${baseUrl}/`);
    assert.equal(ssrRes.status, 200, "SSR homepage must return 200 OK");
    const html = await ssrRes.text();

    // Verify GTM head script and body noscript iframe
    assert.ok(
      html.includes("https://www.googletagmanager.com/gtm.js?id='+i+dl") &&
        html.includes("'dataLayer','GTM-TEST999'"),
      "GTM script in head"
    );
    assert.ok(
      html.includes('src="https://www.googletagmanager.com/ns.html?id=GTM-TEST999"'),
      "GTM noscript iframe in body"
    );

    // Verify GA4 script and config
    assert.ok(
      html.includes("https://www.googletagmanager.com/gtag/js?id=G-TESTGA4XXXX"),
      "GA4 script tag present"
    );
    assert.ok(
      html.includes("gtag('config', 'G-TESTGA4XXXX', { 'anonymize_ip': true });"),
      "GA4 IP anonymization config present"
    );

    // Verify Meta Pixel script and noscript image
    assert.ok(
      html.includes("https://connect.facebook.net/en_US/fbevents.js"),
      "Meta Pixel script present"
    );
    assert.ok(html.includes("fbq('init', '982347109283471');"), "Meta Pixel init call present");
    assert.ok(
      html.includes('src="https://www.facebook.com/tr?id=982347109283471&ev=PageView&noscript=1"'),
      "Meta Pixel noscript tracking pixel present"
    );
  });
});
