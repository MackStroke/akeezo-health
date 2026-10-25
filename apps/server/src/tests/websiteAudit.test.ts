import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { getDefaultRouteData } from "@akeezo/web/src/defaultData.js";
import { HomeTemplate } from "@akeezo/web/src/templates/HomeTemplate.js";
import { LegalTemplate } from "@akeezo/web/src/templates/LegalTemplate.js";
import { NotFoundTemplate } from "@akeezo/web/src/templates/NotFoundTemplate.js";
import { ServerErrorTemplate } from "@akeezo/web/src/templates/ServerErrorTemplate.js";
import { SiteHeader } from "@akeezo/web/src/components/SiteHeader.js";
import { SiteFooter } from "@akeezo/web/src/components/SiteFooter.js";

describe("Website Audit Task 1: Route SEO Metadata Definitions", () => {
  it("Every legal and error route has Title Case titles and rich meta descriptions", () => {
    const privacy = getDefaultRouteData("/privacy");
    assert.equal(privacy.seo.title, "Privacy Policy | AKEEZO Healthcare Platform");
    assert.ok(privacy.seo.description.includes("GDPR, HIPAA, and India DPDP"));

    const terms = getDefaultRouteData("/terms");
    assert.equal(terms.seo.title, "Terms of Service | AKEEZO Healthcare Platform");
    assert.ok(terms.seo.description.includes("coordination"));

    const disclaimer = getDefaultRouteData("/disclaimer");
    assert.equal(disclaimer.seo.title, "Medical Disclaimer | AKEEZO Healthcare Platform");

    const consent = getDefaultRouteData("/consent");
    assert.equal(consent.seo.title, "Informed Patient Consent | AKEEZO Healthcare Platform");

    const refund = getDefaultRouteData("/refund-policy");
    assert.equal(refund.seo.title, "Refund Policy & Service Surety | AKEEZO Healthcare Platform");

    const grievance = getDefaultRouteData("/grievance-officer");
    assert.equal(grievance.seo.title, "Grievance Redressal Officer | AKEEZO Healthcare Platform");

    const notFound = getDefaultRouteData("/unknown-treatment-slug-xyz");
    assert.equal(notFound.seo.title, "404 - Healthcare Resource Not Found | AKEEZO Healthcare Platform");
    assert.ok(notFound.seo.description.includes("care coordination desk"));

    const serverError = getDefaultRouteData("/500");
    assert.equal(serverError.seo.title, "500 - Server Error | AKEEZO Healthcare Platform");
  });
});

describe("Website Audit Task 2: Responsive LegalLayout & Mobile Optimization", () => {
  it("Legal layout renders clickable DPO email and phone numbers without layout overflow", () => {
    const privacyData = getDefaultRouteData("/privacy");
    const privacyHtml = renderToString(React.createElement(LegalTemplate, { data: privacyData }));

    assert.ok(privacyHtml.includes('href="mailto:dpo@akeezo.com"'), "DPO email must be clickable mailto");
    assert.ok(!privacyHtml.includes("grid-template-columns"), "Legal layout must use responsive classes instead of inline grid-template-columns");

    const grievanceData = getDefaultRouteData("/grievance-officer");
    const grievanceHtml = renderToString(React.createElement(LegalTemplate, { data: grievanceData }));
    assert.ok(grievanceHtml.includes('<a href="tel:+918287639443"'), "Grievance Officer designated contact must have clickable tel link");
    assert.ok(grievanceHtml.includes('href="mailto:grievance@akeezo.com"'), "Grievance Officer email must be clickable mailto link");

    const termsData = getDefaultRouteData("/terms");
    const termsHtml = renderToString(React.createElement(LegalTemplate, { data: termsData }));
    assert.ok(termsHtml.includes('<a href="tel:+918287639443"'), "Terms of Service contact section must have clickable tel link");
  });
});

describe("Website Audit Task 3: HomeTemplate Section IDs & Form Validation", () => {
  it("HomeTemplate contains valid section IDs matching navbar and footer anchor links", () => {
    const homeData = getDefaultRouteData("/");
    const homeHtml = renderToString(React.createElement(HomeTemplate, { data: homeData }));

    assert.ok(homeHtml.includes('id="hospitals"'), "Must provide id=hospitals anchor");
    assert.ok(homeHtml.includes('id="doctors"'), "Must provide id=doctors anchor");
    assert.ok(homeHtml.includes('id="destinations"'), "Must provide id=destinations anchor");
    assert.ok(homeHtml.includes('id="calculator"'), "Must provide id=calculator anchor");
    assert.ok(homeHtml.includes('id="opinion"'), "Must provide id=opinion anchor");
    assert.ok(homeHtml.includes('id="visa"'), "Must provide id=visa anchor");
    assert.ok(homeHtml.includes('id="concierge"'), "Must provide id=concierge anchor");

    // Hero logo must be clickable
    assert.ok(
      homeHtml.includes('href="/"') && homeHtml.includes('aria-label="Akeezo Healthcare Platform Home"'),
      "Hero brand logo must be wrapped in a clickable link pointing to home"
    );

    // Search bar error validation accessibility
    assert.ok(homeHtml.includes('aria-describedby="hero-search-error"'), "Search bar must link to accessible error alert");
    assert.ok(homeHtml.includes('overflow-x-hidden'), "Outer page container must have overflow-x-hidden to prevent mobile overflow");
  });
});

describe("Website Audit Task 4: SiteHeader & SiteFooter Audit & Feedback Messages", () => {
  it("Footer renders dynamic current year, clickable phone and care email, and clickable footer logo", () => {
    const data = getDefaultRouteData("/");
    const footerHtml = renderToString(React.createElement(SiteFooter, { siteSettings: data.siteSettings }));

    const currentYear = new Date().getFullYear().toString();
    assert.ok(footerHtml.includes(`© ${currentYear}`), `Footer must display dynamic current year ${currentYear}`);
    assert.ok(footerHtml.includes('href="tel:'), "Footer helpline must be clickable tel: link");
    assert.ok(footerHtml.includes('href="mailto:'), "Footer care email must be clickable mailto: link");
    assert.ok(
      footerHtml.includes('href="/"') && footerHtml.includes('aria-label="Akeezo Healthcare Platform Home"'),
      "Footer brand logo must be wrapped in a link pointing to home"
    );
  });

  it("SiteHeader mobile menu and modals render clickable logo, clickable phone, and accessible forms", () => {
    const data = getDefaultRouteData("/");
    const headerHtml = renderToString(React.createElement(SiteHeader, { siteSettings: data.siteSettings }));

    assert.ok(headerHtml.includes('aria-label="Toggle navigation menu"'), "Mobile menu button must have accessible label");
    assert.ok(headerHtml.includes('href="tel:'), "Header must contain clickable tel: helpline");
    assert.ok(headerHtml.includes('aria-label="Close menu"'), "Mobile menu must contain accessible close button");
  });
});
