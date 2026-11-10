import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import mongoose from "mongoose";
import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "@akeezo/web/src/App.js";
import { getDefaultRouteData } from "@akeezo/web/src/defaultData.js";
import { SiteFooter } from "@akeezo/web/src/components/SiteFooter.js";
import { apiRouter } from "../api/routes.js";
import { EnquiryModel } from "../db/models/index.js";

const MONGODB_TEST_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local";

describe("Contact Us Page & Footer Integration Suite", () => {
  let server: http.Server;
  let baseUrl = "";

  before(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_TEST_URI);
    }

    const app = express();
    app.use(express.json());
    app.use("/api/v1", apiRouter);

    await new Promise<void>((resolve) => {
      server = app.listen(0, "127.0.0.1", () => {
        const address = server.address() as any;
        baseUrl = `http://127.0.0.1:${address.port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  });

  it("1. SSR: /contact resolves with pageKind 'contact' and renders ContactPage JSON-LD", () => {
    const data = getDefaultRouteData("/contact");
    assert.equal(data.pageKind, "contact");
    assert.equal(data.statusCode, 200);

    const html = renderToString(React.createElement(App, { data }));

    assert.ok(html.includes("Contact Us"), "Must render Contact Us title");
    assert.ok(html.includes("Send us a Message"), "Must render contact form heading");
    assert.ok(html.includes('schema.org'), "Must render JSON-LD schema");
    assert.ok(html.includes("ContactPage"), "Must render ContactPage schema");
    assert.ok(html.includes("Full Name"), "Must render Full Name input label");
    assert.ok(html.includes("Phone / WhatsApp Number"), "Must render Phone / WhatsApp field");
    assert.ok(html.includes("Call 24/7 Care Desk"), "Must render 24/7 care desk hotline card");
    assert.ok(html.includes("Chat with Us on WhatsApp"), "Must render WhatsApp chat card");
    assert.ok(html.includes("Our Headquarters Location"), "Must render headquarters location header");
  });

  it("2. Footer Integration: SiteFooter renders links to /contact across both Patient Support & Care Coordination", () => {
    const data = getDefaultRouteData("/");
    const footerHtml = renderToString(React.createElement(SiteFooter, { siteSettings: data.siteSettings }));

    assert.ok(footerHtml.includes('href="/contact"'), "SiteFooter must contain clickable link to /contact");
    assert.ok(footerHtml.includes("Contact Us &amp; Support") || footerHtml.includes("Contact Us"), "SiteFooter must display Contact Us text");
  });

  it("3. Public Route API: GET /api/v1/route?path=/contact returns status 200 and pageKind 'contact'", async () => {
    const res = await fetch(`${baseUrl}/api/v1/route?path=/contact`);
    assert.equal(res.status, 200);
    const json = await res.json();

    assert.equal(json.data?.pageKind, "contact");
    assert.equal(json.data?.seo?.canonicalPath, "/contact");
    assert.ok(json.data?.seo?.title.includes("Contact Us"), "SEO title must mention Contact Us");
  });

  it("4. Public API: POST /api/v1/enquiries processes contact message and generates receipt ID", async () => {
    const testEmail = `patient.contact.${Date.now()}@example.com`;
    const res = await fetch(`${baseUrl}/api/v1/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requesterName: "Sarah Connor",
        email: testEmail,
        phone: "+91 98765 43210",
        country: "United Kingdom",
        serviceType: "contact",
        message: "Inquiring about knee replacement surgery at Fortis Hospital Delhi for next month.",
        sourcePath: "/contact"
      })
    });

    assert.equal(res.status, 201);
    const json = await res.json();

    assert.ok(json.data?.success, "Response must indicate success");
    assert.ok(json.data?.receiptId, "Must return valid receiptId");
    assert.ok(json.data?.receiptId.startsWith("AKZ-ENQ-"), "Receipt must follow AKZ-ENQ prefix");

    // Verify persisted in MongoDB
    if (mongoose.connection.readyState === 1) {
      const persisted = (await EnquiryModel.findOne({ email: testEmail }).lean()) as any;
      assert.ok(persisted, "Contact enquiry must be stored in EnquiryModel");
      assert.equal(persisted?.serviceType, "contact");
      assert.equal(persisted?.requesterName, "Sarah Connor");
      assert.equal(persisted?.status, "received");
    }
  });

  it("5. Validation: POST /api/v1/enquiries rejects submissions without name or contact", async () => {
    const resNoName = await fetch(`${baseUrl}/api/v1/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "test@example.com",
        message: "Hello"
      })
    });
    assert.equal(resNoName.status, 400);

    const resNoContact = await fetch(`${baseUrl}/api/v1/enquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requesterName: "Anonymous",
        message: "Hello"
      })
    });
    assert.equal(resNoContact.status, 400);
  });

  it("6. Floating Action Buttons: Renders floating WhatsApp and Assistant buttons with unread badge", () => {
    const data = getDefaultRouteData("/");
    const html = renderToString(React.createElement(App, { data }));

    assert.ok(html.includes("fixed right-5 z-[9999]"), "Must render fixed floating buttons container");
    assert.ok(html.includes('aria-label="Chat on WhatsApp"'), "Must render WhatsApp floating button");
    assert.ok(html.includes("https://wa.me/"), "WhatsApp button must have direct wa.me link");
    assert.ok(html.includes('aria-label="Chat with CMA Assistant, 1 unread message"'), "Must render Assistant floating button with accessible label");
    assert.ok(html.includes(">1</span>"), "Must render unread notification badge with count 1");
  });
});
