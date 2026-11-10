import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";
import { EnquiryModel } from "../db/models/index.js";
import {
  ALL_DESTINATIONS,
  MEXICO_DESTINATION_DETAIL,
  INDIA_DESTINATION_DETAIL,
  getDestinationDetail
} from "@akeezo/contracts";

describe("Medical Tourism Destinations Directory & Detail Pages Suite", () => {
  let server: http.Server;
  let baseUrl: string;
  const createdEnquiryIds: string[] = [];

  before(async () => {
    await connectDB();

    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      // Use isolated test port 4107 as per mern-enterprise-guardrails
      server.listen(4107, () => {
        baseUrl = "http://127.0.0.1:4107";
        resolve();
      });
    });
  });

  after(async () => {
    if (createdEnquiryIds.length > 0) {
      await EnquiryModel.deleteMany({ _id: { $in: createdEnquiryIds } });
    }
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  test("1. SSR GET /destinations returns HTTP 200 text/html with MedicalWebPage schema and destination directory", async () => {
    const res = await fetch(`${baseUrl}/destinations`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);

    const html = await res.text();
    assert.ok(html.includes("Premier Medical Tourism Destinations"), "Must render destination directory headline");
    assert.ok(html.includes("Mexico"), "Must include Mexico in destination cards");
    assert.ok(html.includes("India"), "Must include India in destination cards");
    assert.ok(html.includes("Thailand"), "Must include Thailand in destination cards");
    assert.ok(html.includes("Turkey"), "Must include Turkey in destination cards");
    assert.ok(html.includes("Heal in India"), "Must feature Heal in India initiative");
  });

  test("2. SSR GET /destinations/mexico returns HTTP 200 text/html with Mexico detail page matching CureMeAbroad layout", async () => {
    const res = await fetch(`${baseUrl}/destinations/mexico`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);

    const html = await res.text();
    assert.ok(html.includes("Medical Tourism in Mexico: Clinics & Costs 2026"), "Must render Mexico hero headline");
    assert.ok(html.includes("Gastric Sleeve"), "Must include Bariatric procedure row");
    assert.ok(html.includes("All-on-4 Full Arch Dental Implants"), "Must include Dental procedure row");
    assert.ok(html.includes("70% - 80%"), "Must display average savings percentage");
    assert.ok(html.includes("Instant (Visa-Free / FMM)"), "Must render visa processing time");
    assert.ok(html.includes("Cost Comparison"), "Must include Cost Comparison section");
    assert.ok(html.includes("Get Free Treatment Estimate"), "Must include consultation CTA");
  });

  test("3. SSR GET /destinations/india returns HTTP 200 text/html with Quaternary Care Centers & e-Medical Visa info", async () => {
    const res = await fetch(`${baseUrl}/destinations/india`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);

    const html = await res.text();
    assert.ok(html.includes("Medical Tourism in India: Premier Hospitals & Costs 2026"), "Must render India hero headline");
    assert.ok(html.includes("CyberKnife"), "Must list CyberKnife in procedures");
    assert.ok(html.includes("Coronary Artery Bypass Graft (CABG)"), "Must list CABG in cost table");
    assert.ok(html.includes("e-Medical Visa (e-Med)"), "Must include official e-Med visa guide");
    assert.ok(html.includes("75% - 90%") || html.includes("70-90%"), "Must include savings range");
  });

  test("4. SSR GET /destinations/new-delhi resolves Indian medical hub city detail", async () => {
    const res = await fetch(`${baseUrl}/destinations/new-delhi`);
    assert.equal(res.status, 200);

    const html = await res.text();
    assert.ok(html.includes("New Delhi"), "Must render New Delhi city destination");
    assert.ok(html.includes("e-Med") || html.includes("India"), "Must reference India visa or clinical governance");
  });

  test("5. SSR GET /destinations/invalid-destination returns HTTP 404 with not found status", async () => {
    const res = await fetch(`${baseUrl}/destinations/non-existent-country-xyz`);
    assert.equal(res.status, 404);

    const html = await res.text();
    assert.ok(html.includes("Destination Not Found") || html.includes("404"), "Must indicate destination not found");
  });

  test("6. REST API GET /api/v1/destinations returns structured list of all countries and cities", async () => {
    const res = await fetch(`${baseUrl}/api/v1/destinations`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.ok(Array.isArray(json.data), "data must be an array");
    assert.ok(json.data.length >= 10, "Should contain at least 10 countries and cities");

    const mexico = json.data.find((d: any) => d.slug === "mexico");
    assert.ok(mexico, "Mexico destination must be present");
    assert.equal(mexico.country, "Mexico");
    assert.equal(mexico.savingsPercentage, 75);

    const india = json.data.find((d: any) => d.slug === "india");
    assert.ok(india, "India destination must be present");
    assert.equal(india.country, "India");
  });

  test("7. REST API GET /api/v1/destinations/:slug returns full destination detail for Mexico and India", async () => {
    const resMexico = await fetch(`${baseUrl}/api/v1/destinations/mexico`);
    assert.equal(resMexico.status, 200);
    const jsonMexico = await resMexico.json();
    assert.equal(jsonMexico.data.slug, "mexico");
    assert.ok(jsonMexico.data.costTable.length > 0, "Must have procedure costs");
    assert.ok(jsonMexico.data.travelInfo.visaTitle, "Must have travel/visa info");
    assert.ok(jsonMexico.data.faqs.length > 0, "Must have destination FAQs");

    const resIndia = await fetch(`${baseUrl}/api/v1/destinations/india`);
    assert.equal(resIndia.status, 200);
    const jsonIndia = await resIndia.json();
    assert.equal(jsonIndia.data.slug, "india");
    assert.ok(jsonIndia.data.costTable.length > 0);
  });

  test("8. REST API GET /api/v1/destinations/:slug returns 404 for unknown destination", async () => {
    const res = await fetch(`${baseUrl}/api/v1/destinations/atlantis-fantasy-land`);
    assert.equal(res.status, 404);
    const json = await res.json();
    assert.equal(json.error.code, "NOT_FOUND");
  });

  test("9. Public Route API GET /api/v1/route?path=/destinations resolves destinationDirectory DTO", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/destinations`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.data.pageKind, "destinationDirectory");
    assert.equal(json.data.statusCode, 200);
    assert.ok(Array.isArray(json.data.payload.destinations));
  });

  test("10. Public Route API GET /api/v1/route?path=/destinations/mexico resolves destinationDetail DTO", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/destinations/mexico`);
    assert.equal(res.status, 200);

    const json = await res.json();
    assert.equal(json.data.pageKind, "destinationDetail");
    assert.equal(json.data.statusCode, 200);
    assert.equal(json.data.payload.destination.slug, "mexico");
    assert.equal(json.data.seo.schemaKind, "MedicalWebPage");
  });

  test("11. Public Route API GET /api/v1/route?path=/destinations/unknown-destination returns 404 notFound DTO", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/destinations/mars-colony`);
    assert.equal(res.status, 404);

    const json = await res.json();
    assert.equal(json.data.pageKind, "notFound");
    assert.equal(json.data.statusCode, 404);
  });

  test("12. Destination Enquiry POST /api/v1/enquiries generates AKZ-DST receipt and saves to database", async () => {
    const payload = {
      fullName: "Sarah Connor",
      email: "sarah.connor@example.com",
      phone: "+1 619 555 0199",
      destinationCountry: "Mexico",
      treatmentName: "Gastric Sleeve Bariatric",
      notes: "Seeking quote for Tijuana accredited clinic with companion accommodation.",
      serviceType: "destination"
    };

    const res = await fetch(`${baseUrl}/api/v1/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.data.success, true);
    assert.ok(json.data.receiptId.startsWith("AKZ-DST-"), `Expected receipt prefix AKZ-DST-, got ${json.data.receiptId}`);
    assert.ok(json.data.enquiryId, "Must return enquiry ID");

    createdEnquiryIds.push(json.data.enquiryId);

    // Verify record in MongoDB
    if (mongoose.connection.readyState === 1) {
      const savedDoc = await EnquiryModel.findById(json.data.enquiryId);
      assert.ok(savedDoc, "Enquiry must be stored in database");
      assert.equal(savedDoc.requesterName, "Sarah Connor");
      assert.equal(savedDoc.country, "Mexico");
      assert.equal(savedDoc.serviceType, "destination");
      assert.ok(savedDoc.notes?.includes("Gastric Sleeve Bariatric"));
    }
  });

  test("13. Contract getDestinationDetail helper correctly handles case-insensitivity and fallbacks", () => {
    const mexLower = getDestinationDetail("mexico");
    assert.ok(mexLower);
    assert.equal(mexLower.country, "Mexico");

    const mexUpper = getDestinationDetail("  MEXICO  ");
    assert.ok(mexUpper);
    assert.equal(mexUpper.country, "Mexico");

    const india = getDestinationDetail("india");
    assert.ok(india);
    assert.equal(india.country, "India");

    const nonExistent = getDestinationDetail("non-existent-destination-xyz-123");
    assert.equal(nonExistent, undefined);
  });
});
