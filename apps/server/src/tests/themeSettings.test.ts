import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { app } from "../main.js";
import { SiteSettings, UserModel } from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";
import {
  DEFAULT_WEBSITE_THEME,
  DEFAULT_ADMIN_THEME,
  THEME_PRESETS,
  generateWebsiteThemeCss,
  generateAdminThemeCss,
  extractPrimaryFontName,
  getGoogleFontUrl,
} from "@akeezo/contracts";
import { renderFallback500Html, toSafeSiteSettings } from "../ssr/renderer.js";

describe("Theme Settings Architecture Verification Suite", async () => {
  let serverInstance: any;
  let baseUrl = "";
  let adminToken = "";

  before(async () => {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local");
    }

    // Super Admin user
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

    // Use dynamic port 0 to prevent conflicts
    await new Promise<void>((resolve) => {
      serverInstance = app.listen(0, "127.0.0.1", () => {
        const port = (serverInstance.address() as any).port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    // Reset theme back to default before disconnecting
    await SiteSettings.findOneAndUpdate(
      { environment: "development" },
      {
        $set: {
          websiteTheme: DEFAULT_WEBSITE_THEME,
          adminTheme: DEFAULT_ADMIN_THEME,
          primaryColor: DEFAULT_WEBSITE_THEME.primaryColor,
          secondaryColor: DEFAULT_WEBSITE_THEME.secondaryColor,
          accentColor: DEFAULT_WEBSITE_THEME.accentColor,
          actionColor: DEFAULT_WEBSITE_THEME.actionColor,
        },
      }
    );

    if (serverInstance) {
      if (typeof serverInstance.closeAllConnections === "function") {
        serverInstance.closeAllConnections();
      }
      await new Promise<void>((resolve) => serverInstance.close(() => resolve()));
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  });

  test("1. GET /api/v1/site: Delivers complete websiteTheme and adminTheme token objects", async () => {
    const res = await fetch(`${baseUrl}/api/v1/site`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.ok(json.data, "Site endpoint must return data");

    const { websiteTheme, adminTheme } = json.data;
    assert.ok(websiteTheme, "Must include websiteTheme");
    assert.ok(adminTheme, "Must include adminTheme");

    // Check essential theme tokens
    assert.ok(websiteTheme.primaryColor, "websiteTheme must have primaryColor");
    assert.ok(websiteTheme.actionColor, "websiteTheme must have actionColor");
    assert.ok(websiteTheme.secondaryColor, "websiteTheme must have secondaryColor");
    assert.ok(websiteTheme.radiusCard, "websiteTheme must have radiusCard");
    assert.ok(websiteTheme.radiusButton, "websiteTheme must have radiusButton");
    assert.ok(websiteTheme.fontFamily, "websiteTheme must have fontFamily");
    assert.ok(websiteTheme.mode, "websiteTheme must have mode");

    assert.ok(adminTheme.primaryColor, "adminTheme must have primaryColor");
    assert.ok(adminTheme.sidebarBackground, "adminTheme must have sidebarBackground");
    assert.ok(adminTheme.headerBackground, "adminTheme must have headerBackground");
    assert.ok(adminTheme.radiusCard, "adminTheme must have radiusCard");
  });

  test("2. PUT /api/v1/admin/site-settings: Persists customized theme tokens and synchronizes top-level colors", async () => {
    const customWebsite = {
      primaryColor: "#0284C7",
      secondaryColor: "#F97316",
      accentColor: "#EA580C",
      actionColor: "#0369A1",
      actionHoverColor: "#075985",
      actionAccentColor: "#C2410C",
      backgroundColor: "#F8FAFC",
      surfaceColor: "#FFFFFF",
      surfaceMutedColor: "#F1F5F9",
      surfaceTealColor: "#E0F2FE",
      surfaceOrangeColor: "#FFEDD5",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      textMutedColor: "#475569",
      headingColor: "#082F49",
      borderColor: "#E2E8F0",
      borderTealColor: "#BAE6FD",
      borderOrangeColor: "#FED7AA",
      emergencyColor: "#E11D48",
      fontFamily: "'Inter', sans-serif",
      headingFontFamily: "'Inter', sans-serif",
      radiusCard: "18px",
      radiusHero: "28px",
      radiusButton: "14px",
      radiusPill: "999px",
      mode: "light" as const,
      activePreset: "custom",
    };

    const customAdmin = {
      primaryColor: "#0369A1",
      accentColor: "#38BDF8",
      secondaryColor: "#F97316",
      sidebarBackground: "#082F49",
      sidebarText: "#F0F9FF",
      sidebarActiveBackground: "#0C4A6E",
      headerBackground: "#FFFFFF",
      headerText: "#0F172A",
      contentBackground: "#F8FAFC",
      cardBackground: "#FFFFFF",
      textColor: "#0F172A",
      textMutedColor: "#64748B",
      borderColor: "#E2E8F0",
      fontFamily: "'Inter', sans-serif",
      radiusCard: "14px",
      radiusButton: "8px",
      mode: "light" as const,
      activePreset: "custom",
    };

    const putRes = await fetch(`${baseUrl}/api/v1/admin/site-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        websiteTheme: customWebsite,
        adminTheme: customAdmin,
      }),
    });

    assert.equal(putRes.status, 200, "Updating site settings must succeed");
    const putJson = await putRes.json();

    assert.equal(putJson.data.websiteTheme.primaryColor, "#0284C7");
    assert.equal(putJson.data.websiteTheme.radiusCard, "18px");
    assert.equal(putJson.data.websiteTheme.fontFamily, "'Inter', sans-serif");
    // Verify sync to top-level colors
    assert.equal(putJson.data.primaryColor, "#0284C7");
    assert.equal(putJson.data.secondaryColor, "#F97316");
    assert.equal(putJson.data.actionColor, "#0369A1");
    // Verify admin theme
    assert.equal(putJson.data.adminTheme.sidebarBackground, "#082F49");
    assert.equal(putJson.data.adminTheme.primaryColor, "#0369A1");

    // Verify persisted directly in MongoDB
    const docInDb = await SiteSettings.findOne({ environment: "development" }).lean();
    assert.ok(docInDb);
    assert.equal(docInDb.websiteTheme?.primaryColor, "#0284C7");
    assert.equal(docInDb.adminTheme?.sidebarBackground, "#082F49");
  });

  test("3. Input Sanitization: Strips potential CSS injection payloads from color and unit values", async () => {
    const maliciousPayload = {
      websiteTheme: {
        primaryColor: "red; } body { display: none !important; } /*",
        radiusCard: "20px; </style><script>alert(1)</script>",
      },
    };

    const res = await fetch(`${baseUrl}/api/v1/admin/site-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(maliciousPayload),
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    // Sanitized: must NOT contain semicolons, braces, or html tags
    assert.ok(!json.data.websiteTheme.primaryColor.includes(";"));
    assert.ok(!json.data.websiteTheme.primaryColor.includes("}"));
    assert.ok(!json.data.websiteTheme.radiusCard.includes("<"));
    assert.ok(!json.data.websiteTheme.radiusCard.includes(">"));
  });

  test("4. POST /api/v1/admin/theme/preset: Applies curated presets cleanly to website, admin, or both", async () => {
    // 4a. Apply Sapphire preset to both
    const sapphireRes = await fetch(`${baseUrl}/api/v1/admin/theme/preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ presetId: "sapphire", target: "both" }),
    });

    assert.equal(sapphireRes.status, 200);
    const sapphireJson = await sapphireRes.json();
    assert.equal(sapphireJson.data.websiteTheme.activePreset, "sapphire");
    assert.equal(sapphireJson.data.websiteTheme.primaryColor, THEME_PRESETS.sapphire.websiteTheme.primaryColor);
    assert.equal(sapphireJson.data.adminTheme.activePreset, "sapphire");
    assert.equal(sapphireJson.data.adminTheme.sidebarBackground, THEME_PRESETS.sapphire.adminTheme.sidebarBackground);

    // 4b. Apply Midnight preset only to admin
    const midnightAdminRes = await fetch(`${baseUrl}/api/v1/admin/theme/preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ presetId: "midnight", target: "admin" }),
    });

    assert.equal(midnightAdminRes.status, 200);
    const midnightJson = await midnightAdminRes.json();
    assert.equal(midnightJson.data.adminTheme.activePreset, "midnight");
    assert.equal(midnightJson.data.adminTheme.sidebarBackground, THEME_PRESETS.midnight.adminTheme.sidebarBackground);
    // Website theme remains sapphire
    assert.equal(midnightJson.data.websiteTheme.activePreset, "sapphire");

    // 4c. Reject unknown preset
    const invalidRes = await fetch(`${baseUrl}/api/v1/admin/theme/preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ presetId: "nonexistent-preset" }),
    });
    assert.equal(invalidRes.status, 400);
    const invalidJson = await invalidRes.json();
    assert.equal(invalidJson.error.code, "INVALID_PRESET");
  });

  test("5. POST /api/v1/admin/theme/reset: Restores factory brand defaults", async () => {
    const resetRes = await fetch(`${baseUrl}/api/v1/admin/theme/reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ target: "both" }),
    });

    assert.equal(resetRes.status, 200);
    const resetJson = await resetRes.json();
    assert.equal(resetJson.data.websiteTheme.primaryColor, DEFAULT_WEBSITE_THEME.primaryColor);
    assert.equal(resetJson.data.websiteTheme.actionColor, DEFAULT_WEBSITE_THEME.actionColor);
    assert.equal(resetJson.data.adminTheme.primaryColor, DEFAULT_ADMIN_THEME.primaryColor);
    assert.equal(resetJson.data.adminTheme.sidebarBackground, DEFAULT_ADMIN_THEME.sidebarBackground);
  });

  test("6. SSR Dynamic Injection: Injects <style id='akeezo-dynamic-theme'> with CSS variables into SSR HTML", async () => {
    // 6a. Set Emerald preset
    await fetch(`${baseUrl}/api/v1/admin/theme/preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ presetId: "emerald", target: "both" }),
    });

    const ssrRes = await fetch(`${baseUrl}/`);
    assert.equal(ssrRes.status, 200);
    const html = await ssrRes.text();

    assert.ok(html.includes('id="akeezo-dynamic-theme"'), "SSR HTML must contain style tag with dynamic theme");
    assert.ok(html.includes("--brand-teal: #10B981"), "SSR HTML must contain customized Emerald primary brand color");
    assert.ok(html.includes("--action: #059669"), "SSR HTML must contain customized Emerald action button color");
    assert.ok(html.includes("--radius-card: 18px"), "SSR HTML must contain customized Emerald card radius");
  });

  test("7. Fallback 500 HTML Renderer: Injects dynamic theme variables into resilient error page", async () => {
    const customSettings = toSafeSiteSettings({
      websiteTheme: {
        ...DEFAULT_WEBSITE_THEME,
        primaryColor: "#E11D48",
        actionColor: "#BE123C",
      },
    });

    const html500 = renderFallback500Html(customSettings);
    assert.ok(html500.includes('id="akeezo-dynamic-theme"'), "Fallback 500 must contain dynamic theme style tag");
    assert.ok(html500.includes("--brand-teal: #E11D48"), "Fallback 500 must reflect custom primary color");
    assert.ok(html500.includes("--action: #BE123C"), "Fallback 500 must reflect custom action color");
  });

  test("8. Partial Theme Update: Deep merges updates and prevents token wipeout", async () => {
    // Apply warmCare first so tokens have distinct values
    await fetch(`${baseUrl}/api/v1/admin/theme/preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ presetId: "warmCare", target: "both" }),
    });

    // Send a partial update changing only primaryColor and radiusCard on website, leaving all other tokens out
    const partialUpdateRes = await fetch(`${baseUrl}/api/v1/admin/site-settings`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        websiteTheme: {
          primaryColor: "#FF1493",
          radiusCard: "24px",
        },
      }),
    });

    assert.equal(partialUpdateRes.status, 200);
    const partialJson = await partialUpdateRes.json();
    const updatedWebsite = partialJson.data.websiteTheme;

    // Specified fields must be updated
    assert.equal(updatedWebsite.primaryColor, "#FF1493");
    assert.equal(updatedWebsite.radiusCard, "24px");

    // Unspecified fields MUST be preserved from prior state (warmCare) and NOT wiped out
    assert.equal(updatedWebsite.actionColor, THEME_PRESETS.warmCare.websiteTheme.actionColor);
    assert.equal(updatedWebsite.secondaryColor, THEME_PRESETS.warmCare.websiteTheme.secondaryColor);
    assert.equal(updatedWebsite.radiusHero, THEME_PRESETS.warmCare.websiteTheme.radiusHero);
    assert.equal(updatedWebsite.fontFamily, THEME_PRESETS.warmCare.websiteTheme.fontFamily);

    // Admin theme must also remain intact
    assert.equal(partialJson.data.adminTheme.activePreset, "warmCare");
  });

  test("9. Admin Panel Zero-FOAC Server Injection: Serves /admin HTML with dynamic style tag and dark mode class", async () => {
    // 9a. Set midnight preset (which has mode: 'dark')
    await fetch(`${baseUrl}/api/v1/admin/theme/preset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ presetId: "midnight", target: "both" }),
    });

    const adminHtmlRes = await fetch(`${baseUrl}/admin/`);
    assert.equal(adminHtmlRes.status, 200);
    const adminHtml = await adminHtmlRes.text();

    assert.ok(adminHtml.includes('id="akeezo-dynamic-admin-theme"'), "Admin HTML must contain pre-injected dynamic theme style");
    assert.ok(adminHtml.includes("--admin-primary: #00A896"), "Admin HTML must inject midnight primary color variable");
    assert.ok(adminHtml.includes("--admin-sidebar-bg: #030E0D"), "Admin HTML must inject midnight sidebar background variable");
    assert.ok(adminHtml.includes('<html class="dark"'), "Admin HTML must include dark class on html for dark mode");
  });

  test("10. Dynamic Font URL Helper: Correctly generates Google Font URLs and filters local/system fonts", async () => {
    // 10a. System and generic fonts should return null
    assert.equal(extractPrimaryFontName("system-ui, sans-serif"), null);
    assert.equal(extractPrimaryFontName("-apple-system, BlinkMacSystemFont"), null);
    assert.equal(extractPrimaryFontName("sans-serif"), null);
    assert.equal(getGoogleFontUrl("system-ui, sans-serif"), null);

    // 10b. Bundled Lato should return null (bundled locally)
    assert.equal(extractPrimaryFontName("'Lato', sans-serif"), "Lato");
    assert.equal(getGoogleFontUrl("'Lato', sans-serif"), null);

    // 10c. Named Google web fonts should generate full stylesheet URL
    assert.equal(extractPrimaryFontName("'Open Sans', sans-serif"), "Open Sans");
    assert.equal(
      getGoogleFontUrl("'Open Sans', sans-serif"),
      "https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700;800;900&display=swap"
    );

    assert.equal(extractPrimaryFontName("'Poppins', system-ui, sans-serif"), "Poppins");
    assert.equal(
      getGoogleFontUrl("'Poppins', system-ui, sans-serif"),
      "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
    );

    assert.equal(
      getGoogleFontUrl("Playfair Display"),
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400;500;600;700;800;900&display=swap"
    );
  });
});
