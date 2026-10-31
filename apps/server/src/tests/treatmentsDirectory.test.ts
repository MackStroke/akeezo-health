import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";

describe("Treatments Directory & Reference Composition Suite", () => {
  let server: http.Server;
  let baseUrl: string;

  before(async () => {
    await connectDB();
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      // Use an isolated port (e.g. 4098) as per mern-enterprise-guardrails
      server.listen(4098, () => {
        baseUrl = "http://127.0.0.1:4098";
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

  test("1. SSR GET /treatments returns HTTP 200 text/html with schema markup", async () => {
    const res = await fetch(`${baseUrl}/treatments`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);

    const html = await res.text();
    // JSON-LD Schemas
    assert.ok(html.includes('"@type":"WebPage"'), "Must include WebPage schema");
    assert.ok(html.includes('"@type":"BreadcrumbList"'), "Must include BreadcrumbList schema");
    assert.ok(html.includes("https://akeezo.com/treatments"), "Must reference official canonical URL");
  });

  test("2. Hero section renders headline, subheadline, and floating search bar", async () => {
    const res = await fetch(`${baseUrl}/treatments`);
    const html = await res.text();

    assert.ok(
      html.includes("Find The Best Treatments Worldwide"),
      "Hero must contain audited headline"
    );
    assert.ok(
      html.includes("World-class care, anywhere in the world."),
      "Hero must contain audited subheadline"
    );
    assert.ok(
      html.includes("Search treatments"),
      "Hero must contain floating search input"
    );
    assert.ok(
      html.includes("No sales. No commissions. Just discovery"),
      "Hero must contain reassurance microcopy"
    );
  });

  test("3. Top Treatments carousel renders with horizontal navigation controls", async () => {
    const res = await fetch(`${baseUrl}/treatments`);
    const html = await res.text();

    assert.ok(
      html.includes("Top Treatments on AKEEZO"),
      "Must render Top Treatments section heading"
    );
    assert.ok(
      html.includes("Previous slide") && html.includes("Next slide"),
      "Must include accessible carousel navigation buttons"
    );
    assert.ok(
      html.includes("Cosmetic/Plastic Surgery"),
      "Must list primary specialty card"
    );
  });

  test("4. Promotional Free Consultation Banner renders model assets and CTA", async () => {
    const res = await fetch(`${baseUrl}/treatments`);
    const html = await res.text();

    assert.ok(
      html.includes("Is Absolutely Free"),
      "Must render free consultation banner"
    );
    assert.ok(
      html.includes("Just discovery so you can choose") && html.includes("right for you!"),
      "Must render discovery assurance"
    );
    assert.ok(
      html.includes("free-banner-girl.png") || html.includes("free-banner-model-v2.png"),
      "Must render responsive promotional assets"
    );
    assert.ok(
      html.includes("Get In Touch"),
      "Must render consultation trigger CTA button"
    );
  });

  test("5. All Treatments directory and embedded Make Confident Decisions banner render", async () => {
    const res = await fetch(`${baseUrl}/treatments`);
    const html = await res.text();

    assert.ok(
      html.includes("All Treatments"),
      "Must render All Treatments heading"
    );
    assert.ok(
      html.includes("Make Confident") && html.includes("Healthcare Decisions"),
      "Must render mid-grid decision callout banner"
    );
    assert.ok(
      html.includes("Trusted information backed by real patient experiences."),
      "Must render patient experience testimonial copy"
    );
    assert.ok(
      html.includes("Get Started"),
      "Must render Get Started button"
    );
  });

  test("6. Treatment Detail SSR route GET /treatments/:slug serves deep-dive procedure page", async () => {
    const res = await fetch(`${baseUrl}/treatments/cosmetic-plastic-surgery`);
    assert.equal(res.status, 200);

    const html = await res.text();
    assert.ok(html.includes("Cosmetic/Plastic Surgery"), "Must render procedure title");
    assert.ok(html.includes("Estimated Cost Comparison"), "Must render pricing comparison");
    assert.ok(html.includes("Rhinoplasty"), "Must list sub-procedures");
    assert.ok(html.includes("Request a Customized Treatment Plan"), "Must include inquiry card");
  });

  test("7. Multiple distinct specialty routes resolve and render properly", async () => {
    const testCases = [
      { slug: "hair-transplant", keyword: "Sapphire FUE" },
      { slug: "dental-treatment", keyword: "All-on-4" },
      { slug: "ivf-treatment", keyword: "ICSI" },
      { slug: "cancer-treatment", keyword: "CyberKnife" }
    ];

    for (const tc of testCases) {
      const res = await fetch(`${baseUrl}/treatments/${tc.slug}`);
      assert.equal(res.status, 200, `Route /treatments/${tc.slug} must return 200`);
      const html = await res.text();
      assert.ok(
        html.includes(tc.keyword),
        `Route /treatments/${tc.slug} must include keyword ${tc.keyword}`
      );
    }
  });
});
