import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "@akeezo/web/src/App.js";
import { getDefaultRouteData } from "@akeezo/web/src/defaultData.js";
import { renderFallback500Html, toSafeSiteSettings } from "../ssr/renderer.js";

describe("Website Structure, Navigation & Error States Verification", () => {
  it("Route resolution: / returns home, /privacy returns legal, unknown returns 404, /500 returns serverError", () => {
    const homeData = getDefaultRouteData("/");
    assert.equal(homeData.pageKind, "home");
    assert.equal(homeData.statusCode, 200);

    const privacyData = getDefaultRouteData("/privacy");
    assert.equal(privacyData.pageKind, "legal");
    assert.equal(privacyData.statusCode, 200);

    const unknownData = getDefaultRouteData("/unknown-treatment-slug-xyz");
    assert.equal(unknownData.pageKind, "notFound");
    assert.equal(unknownData.statusCode, 404);

    const errorData = getDefaultRouteData("/500");
    assert.equal(errorData.pageKind, "serverError");
    assert.equal(errorData.statusCode, 500);
  });

  it("Header navbar consistency: /privacy is strictly REMOVED from header navbar on all pages", () => {
    const pages = ["/", "/privacy", "/terms", "/some-random-404", "/500"];

    for (const page of pages) {
      const data = getDefaultRouteData(page);
      const html = renderToString(React.createElement(App, { data }));

      // Extract the header tag
      const headerMatch = html.match(/<header[\s\S]*?<\/header>/);
      assert.ok(headerMatch, `Page ${page} must contain a <header> element`);
      const headerHtml = headerMatch[0];

      // Verify that header does NOT contain any link to /privacy
      assert.ok(
        !headerHtml.includes('href="/privacy"'),
        `Header on page "${page}" must NOT contain link to /privacy (Compliance / Privacy Policy)`
      );
      assert.ok(
        !headerHtml.includes("Compliance &amp; Legal Policies"),
        `Header on page "${page}" must NOT contain Compliance & Legal Policies link`
      );

      // Verify header contains required navigation and branding
      assert.ok(headerHtml.includes("/logo/logo with tagline-dark.svg"), `Header on page "${page}" must contain official dark logo with tagline`);
      assert.ok(headerHtml.includes("Treatments"), `Header on page "${page}" must contain Treatments`);
      assert.ok(headerHtml.includes("Hospitals"), `Header on page "${page}" must contain Hospitals`);
      assert.ok(headerHtml.includes("Specialists"), `Header on page "${page}" must contain Specialists`);
      assert.ok(headerHtml.includes("Destinations"), `Header on page "${page}" must contain Destinations`);
      assert.ok(headerHtml.includes("Calculate Price"), `Header on page "${page}" must contain Calculate Price`);
      assert.ok(headerHtml.includes("Get Free Quote"), `Header on page "${page}" must contain Get Free Quote button`);
      assert.ok(headerHtml.includes("24/7 Desk:"), `Header on page "${page}" must contain 24/7 Desk hotline`);
    }
  });

  it("Footer consistency: /privacy and legal policies remain properly available in footer across all pages", () => {
    const pages = ["/", "/privacy", "/terms", "/unknown-route", "/500"];

    for (const page of pages) {
      const data = getDefaultRouteData(page);
      const html = renderToString(React.createElement(App, { data }));

      // Extract the footer tag
      const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/);
      assert.ok(footerMatch, `Page ${page} must contain a <footer> element`);
      const footerHtml = footerMatch[0];

      // Footer must contain Privacy Policy, Terms, Disclaimer, Grievance, Refund
      assert.ok(footerHtml.includes('href="/privacy"'), `Footer on page "${page}" must contain Privacy Policy link`);
      assert.ok(footerHtml.includes('href="/terms"'), `Footer on page "${page}" must contain Terms of Service link`);
      assert.ok(footerHtml.includes('href="/disclaimer"'), `Footer on page "${page}" must contain Medical Disclaimer link`);
      assert.ok(footerHtml.includes('href="/grievance-officer"'), `Footer on page "${page}" must contain Grievance Officer link`);
      assert.ok(footerHtml.includes('href="/refund-policy"'), `Footer on page "${page}" must contain Refund Policy link`);
      assert.ok(footerHtml.includes("ISO 9001:2015 Certified"), `Footer on page "${page}" must display ISO certification`);
      assert.ok(footerHtml.includes("Directory of Accredited Indian Healthcare"), `Footer on page "${page}" must include directory exploration`);
    }
  });

  it("404 Error State Page: renders empathetic, helpful recovery experience with status 404", () => {
    const notFoundData = getDefaultRouteData("/non-existent-hospital-or-doc");
    assert.equal(notFoundData.pageKind, "notFound");
    assert.equal(notFoundData.statusCode, 404);

    const html = renderToString(React.createElement(App, { data: notFoundData }));

    assert.ok(html.includes("404"), "Must display 404 error code");
    assert.ok(html.includes("Healthcare Resource Not Found"), "Must display empathetic headline");
    assert.ok(html.includes("Return to Homepage"), "Must provide Return to Homepage button");
    assert.ok(html.includes("Chat with 24/7 Desk"), "Must provide direct WhatsApp 24/7 desk button");
    assert.ok(html.includes("Cardiac Surgery"), "Must provide popular recovery suggestion chips");
    assert.ok(html.includes("Need Immediate Medical Coordination?"), "Must include 24/7 coordinator assistance card");
  });

  it("500 Server Error State Page: renders reassuring, secure error state with status 500", () => {
    const errorData = getDefaultRouteData("/500");
    assert.equal(errorData.pageKind, "serverError");
    assert.equal(errorData.statusCode, 500);

    const html = renderToString(React.createElement(App, { data: errorData }));

    assert.ok(html.includes("500"), "Must display 500 error code");
    assert.ok(html.includes("Temporary System Interruption"), "Must display reassuring error headline");
    assert.ok(html.includes("Your Information is Safe"), "Must reassure patient of data security");
    assert.ok(html.includes("Try Again / Reload"), "Must provide Reload button");
    assert.ok(html.includes("Return to Homepage"), "Must provide Return to Homepage button");
    assert.ok(html.includes("WhatsApp 24/7 Desk"), "Must provide WhatsApp helpline");
    assert.ok(html.includes("Hotline:"), "Must display 24/7 Patient Emergency Hotline");
  });

  it("Fallback 500 HTML renderer produces resilient, branded emergency document", () => {
    const siteSettings = toSafeSiteSettings({
      brandName: "AKEEZO",
      phone: "+91 82876 39443",
      careEmail: "care@akeezo.com"
    });

    const fallbackHtml = renderFallback500Html(siteSettings);

    assert.ok(fallbackHtml.startsWith("<!DOCTYPE html>"), "Must be a valid full HTML document");
    assert.ok(fallbackHtml.includes("Temporary System Interruption"), "Must contain 500 error headline");
    assert.ok(fallbackHtml.includes("/logo/logo with tagline-dark.svg"), "Must include official logo");
    assert.ok(fallbackHtml.includes("+91 82876 39443"), "Must include helpline phone");
    assert.ok(fallbackHtml.includes("window.location.reload()"), "Must include reload trigger");
    assert.ok(fallbackHtml.includes("Protected Patient Health Information"), "Must include PHI privacy note");
  });
});
