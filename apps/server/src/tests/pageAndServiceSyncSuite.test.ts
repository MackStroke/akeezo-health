import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";
import { Page, ContentRevision } from "../db/models/index.js";

describe("Page and Service CMS Two-Way Synchronization Suite", () => {
  let server: http.Server;
  let baseUrl: string;
  const TEST_PORT = 4119;
  let originalTreatmentsList: any[] | null = null;
  let treatmentsRevId: string | null = null;

  before(async () => {
    await connectDB();

    // Cache original treatments catalog for pristine cleanup
    const page = await Page.findOne({ slug: "treatments", locale: "en" }).lean();
    if (page) {
      const revId = page.publishedRevisionId || page.draftRevisionId;
      if (revId) {
        treatmentsRevId = revId.toString();
        const rev = await ContentRevision.findById(revId).lean();
        originalTreatmentsList = (rev?.payload as any)?.treatments || null;
      }
    }

    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      server.listen(TEST_PORT, () => {
        baseUrl = `http://127.0.0.1:${TEST_PORT}`;
        resolve();
      });
    });
  });

  after(async () => {
    // Restore original treatments catalog if modified during test
    if (treatmentsRevId && originalTreatmentsList) {
      await ContentRevision.findByIdAndUpdate(treatmentsRevId, {
        "payload.treatments": originalTreatmentsList,
      });
    }

    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("1. GET /api/v1/treatments returns active treatments array synced with MongoDB Page CMS", async () => {
    const res = await fetch(`${baseUrl}/api/v1/treatments`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.data), "Treatments data must be an array");
    assert.ok(body.data.length >= 8, `Expected at least 8 treatments, got ${body.data.length}`);

    const cardiac = body.data.find((t: any) => t.slug === "cardiac-surgery");
    assert.ok(cardiac, "Cardiac Surgery must be present in treatments catalog");
    assert.ok(cardiac.avgCostAbroad, "Treatment must contain avgCostAbroad");
    assert.ok(cardiac.avgCostHome, "Treatment must contain avgCostHome");
  });

  test("2. GET /api/v1/treatments/:slug returns 200 for valid slug and 404 for unknown slug", async () => {
    const resValid = await fetch(`${baseUrl}/api/v1/treatments/cardiac-surgery`);
    assert.equal(resValid.status, 200);
    const validBody = await resValid.json();
    assert.equal(validBody.data.slug, "cardiac-surgery");
    assert.ok(validBody.data.title.includes("Cardiac Surgery"), "Treatment title must contain Cardiac Surgery");

    const resUnknown = await fetch(`${baseUrl}/api/v1/treatments/non-existent-treatment-xyz`);
    assert.equal(resUnknown.status, 404);
  });

  test("3. GET /api/v1/destinations returns active destinations array synced with MongoDB Page CMS", async () => {
    const res = await fetch(`${baseUrl}/api/v1/destinations`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.data), "Destinations data must be an array");
    assert.ok(body.data.length >= 4, `Expected at least 4 destinations, got ${body.data.length}`);

    const india = body.data.find((d: any) => d.slug === "india");
    assert.ok(india, "India must be present in destinations catalog");
    assert.equal(india.country, "India");
  });

  test("4. GET /api/v1/destinations/:slug returns 200 for valid destination and 404 for unknown destination", async () => {
    const resValid = await fetch(`${baseUrl}/api/v1/destinations/india`);
    assert.equal(resValid.status, 200);
    const validBody = await resValid.json();
    assert.equal(validBody.data.slug, "india");
    assert.equal(validBody.data.name, "India");

    const resUnknown = await fetch(`${baseUrl}/api/v1/destinations/non-existent-country-xyz`);
    assert.equal(resUnknown.status, 404);
  });

  test("5. GET /api/v1/site returns siteSettings containing all 4 directory modules", async () => {
    const res = await fetch(`${baseUrl}/api/v1/site`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.data, "Site settings data must be returned");

    assert.ok(Array.isArray(body.data.directoryDoctors), "directoryDoctors must be an array");
    assert.ok(Array.isArray(body.data.directoryHospitals), "directoryHospitals must be an array");
    assert.ok(Array.isArray(body.data.directoryTreatments), "directoryTreatments must be an array");
    assert.ok(Array.isArray(body.data.directoryDestinations), "directoryDestinations must be an array");

    assert.ok(body.data.directoryTreatments.length > 0, "directoryTreatments must have items");
    assert.ok(body.data.directoryDestinations.length > 0, "directoryDestinations must have items");
  });

  test("6. GET /api/v1/route?path=/ returns home DTO with live revision payload", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.pageKind, "home");
    assert.equal(body.data.path, "/");
    assert.ok(body.data.payload.headline, "Home payload must contain headline");
    assert.ok(body.data.siteSettings.directoryTreatments, "siteSettings must contain directoryTreatments");
  });

  test("7. GET /api/v1/route?path=/treatments returns treatmentDirectory with dynamic treatments list", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/treatments`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.pageKind, "treatmentDirectory");
    assert.ok(Array.isArray(body.data.payload.treatments), "payload.treatments must be an array");
    assert.ok(body.data.payload.treatments.length >= 8, "Must contain all active treatments");
  });

  test("8. GET /api/v1/route?path=/treatments/cardiac-surgery returns treatmentDetail with treatment object", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/treatments/cardiac-surgery`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.pageKind, "treatmentDetail");
    assert.ok(body.data.payload.treatment, "payload must contain treatment object");
    assert.equal(body.data.payload.treatment.slug, "cardiac-surgery");
    assert.equal(body.data.payload.slug, "cardiac-surgery");
    assert.ok(body.data.seo.title.includes("Cardiac Surgery"), "SEO title must reflect treatment title");
  });

  test("9. GET /api/v1/route?path=/treatments/unknown-xyz returns 404 with notFound pageKind", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/treatments/unknown-xyz`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.data.pageKind, "notFound");
  });

  test("10. GET /api/v1/route?path=/destinations returns destinationDirectory with dynamic destinations", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/destinations`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.pageKind, "destinationDirectory");
    assert.ok(Array.isArray(body.data.payload.destinations), "payload.destinations must be an array");
    assert.ok(body.data.payload.destinations.length >= 4, "Must contain all active destinations");
  });

  test("11. GET /api/v1/route?path=/destinations/india returns destinationDetail with destination object", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/destinations/india`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.pageKind, "destinationDetail");
    assert.ok(body.data.payload.destination, "payload must contain destination object");
    assert.equal(body.data.payload.destination.slug, "india");
    assert.ok(body.data.seo.title.includes("India"), "SEO title must reflect destination name");
  });

  test("12. GET /api/v1/route?path=/destinations/unknown-xyz returns 404 with notFound pageKind", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/destinations/unknown-xyz`);
    assert.equal(res.status, 404);
    const body = await res.json();
    assert.equal(body.data.pageKind, "notFound");
  });

  test("13. GET /api/v1/route?path=/cost-calculator returns calculatorLanding DTO", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/cost-calculator`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.data.pageKind, "calculatorLanding");
    assert.ok(body.data.seo.title.includes("Cost Calculator"), "SEO title must mention Cost Calculator");
  });

  test("14. Two-Way Sync: Modifying a treatment in Page CMS immediately reflects in public APIs & route", async () => {
    if (!treatmentsRevId) {
      assert.fail("Treatments revision ID missing for test");
    }

    const testTreatmentSlug = "robotic-prostate-surgery-test";
    const newTestTreatment = {
      slug: testTreatmentSlug,
      title: "Robotic Prostate Surgery Test",
      category: "Urology",
      avgCostAbroad: "$4,500",
      avgCostHome: "$28,000",
      recoveryTime: "5 - 7 Days",
      isTopTreatment: true,
      active: true,
      description: "State-of-the-art robotic prostatectomy in India.",
    };

    // 1. Add new treatment to Page CMS revision payload
    const rev = await ContentRevision.findById(treatmentsRevId);
    assert.ok(rev, "Revision must exist");
    const currentList = Array.isArray((rev.payload as any)?.treatments) ? (rev.payload as any).treatments : [];
    rev.payload = {
      ...(rev.payload || {}),
      treatments: [newTestTreatment, ...currentList],
    };
    await rev.save();

    // 2. Verify GET /api/v1/treatments reflects the new item
    const listRes = await fetch(`${baseUrl}/api/v1/treatments`);
    assert.equal(listRes.status, 200);
    const listBody = await listRes.json();
    const foundInList = listBody.data.find((t: any) => t.slug === testTreatmentSlug);
    assert.ok(foundInList, "Newly added treatment must be returned by public GET /api/v1/treatments");
    assert.equal(foundInList.title, "Robotic Prostate Surgery Test");

    // 3. Verify GET /api/v1/treatments/:slug returns the new treatment
    const detailRes = await fetch(`${baseUrl}/api/v1/treatments/${testTreatmentSlug}`);
    assert.equal(detailRes.status, 200);
    const detailBody = await detailRes.json();
    assert.equal(detailBody.data.title, "Robotic Prostate Surgery Test");
    assert.equal(detailBody.data.category, "Urology");

    // 4. Verify GET /api/v1/route?path=/treatments/:slug returns treatmentDetail DTO
    const routeRes = await fetch(`${baseUrl}/api/v1/route?path=/treatments/${testTreatmentSlug}`);
    assert.equal(routeRes.status, 200);
    const routeBody = await routeRes.json();
    assert.equal(routeBody.data.pageKind, "treatmentDetail");
    assert.equal(routeBody.data.payload.treatment.title, "Robotic Prostate Surgery Test");
    assert.ok(routeBody.data.seo.title.includes("Robotic Prostate Surgery Test"));

    // 5. Cleanup: remove test item
    rev.payload = {
      ...(rev.payload || {}),
      treatments: currentList,
    };
    await rev.save();

    // 6. Verify detail route now returns 404
    const cleanRouteRes = await fetch(`${baseUrl}/api/v1/route?path=/treatments/${testTreatmentSlug}`);
    assert.equal(cleanRouteRes.status, 404);
  });

  test("15. SSR HTML Rendering: /treatments/cardiac-surgery returns 200 with treatment name and metadata", async () => {
    const res = await fetch(`${baseUrl}/treatments/cardiac-surgery`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("Cardiac Surgery"), "HTML must contain treatment title");
    assert.ok(html.includes("AKEEZO"), "HTML must contain brand name");
  });

  test("16. SSR HTML Rendering: /destinations/india returns 200 with destination name and healthcare highlights", async () => {
    const res = await fetch(`${baseUrl}/destinations/india`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);
    const html = await res.text();
    assert.ok(html.includes("India"), "HTML must contain destination name");
    assert.ok(html.includes("AKEEZO"), "HTML must contain brand name");
  });
});
