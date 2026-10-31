import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import mongoose from "mongoose";
import { app } from "../main.js";
import { connectDB } from "../db/connection.js";

describe("Blog Directory Audited Composition Suite", () => {
  let server: http.Server;
  let baseUrl: string;

  before(async () => {
    await connectDB();
    server = http.createServer(app);
    await new Promise<void>((resolve) => {
      // Use an isolated port as per mern-enterprise-guardrails
      server.listen(4097, () => {
        baseUrl = "http://127.0.0.1:4097";
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

  test("1. SSR GET /blogs returns HTTP 200 text/html with CollectionPage schema", async () => {
    const res = await fetch(`${baseUrl}/blogs`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type") || "", /text\/html/);

    const html = await res.text();
    assert.ok(html.includes('"@type":"CollectionPage"'), "Must include CollectionPage schema");
    assert.ok(html.includes("https://akeezo.com/blogs"), "Must reference official canonical URL");
  });

  test("2. SSR GET /blog alias returns HTTP 200 and renders blog directory", async () => {
    const res = await fetch(`${baseUrl}/blog`);
    assert.equal(res.status, 200);
    const html = await res.text();
    assert.ok(
      html.includes("Healthcare Insights &amp; Patient Guides") ||
        html.includes("Healthcare Insights & Patient Guides"),
      "Must contain blog directory headline"
    );
  });

  test("3. Top Section renders Featured Hero Article (col-span-7)", async () => {
    const res = await fetch(`${baseUrl}/blogs`);
    const html = await res.text();

    assert.ok(
      html.includes("How to Get Surgery Abroad Without Getting Scammed: 7 Red Flags You Must Know"),
      "Must include audited featured article headline"
    );
    assert.ok(
      html.includes("surgery-abroad-red-flags-avoid-scams"),
      "Must link to featured article slug"
    );
    assert.ok(
      html.includes("Published On: 2025-07-29") || html.includes("2025-07-29"),
      "Must display publication date"
    );
  });

  test("4. Top Section renders Latest Posts sidebar (col-span-5) with thumbnails", async () => {
    const res = await fetch(`${baseUrl}/blogs`);
    const html = await res.text();

    assert.ok(html.includes("Latest Posts"), "Must include Latest Posts heading");
    assert.ok(
      html.includes("How to Fix Knock Knees in Adults Without Surgery") ||
        html.includes("Which Surgery Is Worse: Knee or Shoulder?"),
      "Must list recent articles in sidebar"
    );
  });

  test("5. Grid of Articles renders 3-column layout with arrow icons and excerpts", async () => {
    const res = await fetch(`${baseUrl}/blogs`);
    const html = await res.text();

    assert.ok(
      html.includes("grid-cols-1 sm:grid-cols-2 md:grid-cols-3"),
      "Must render responsive 3-column article grid"
    );
    assert.ok(
      html.includes("lucide-arrow-up-right"),
      "Must render arrow-up-right icons on article cards"
    );
    assert.ok(
      html.includes("Published On :"),
      "Must display Published On date prefix on cards"
    );
  });

  test("6. Category navigation and search controls are present", async () => {
    const res = await fetch(`${baseUrl}/blogs`);
    const html = await res.text();

    assert.ok(html.includes("Search clinical topics..."), "Must include search input placeholder");
    assert.ok(html.includes("Orthopedics"), "Must include Orthopedics category pill");
  });

  test("7. Individual article resolution at /blogs/:slug renders full article", async () => {
    const res = await fetch(`${baseUrl}/blogs/surgery-abroad-red-flags-avoid-scams`);
    assert.equal(res.status, 200);
    const html = await res.text();

    assert.ok(
      html.includes("Clinical Information Disclaimer"),
      "Must render clinical information disclaimer"
    );
    assert.ok(
      html.includes("Need a Free Clinical Assessment &amp; Hospital Estimate?") ||
        html.includes("Need a Free Clinical Assessment & Hospital Estimate?"),
      "Must render inbound care assessment CTA"
    );
  });
});
