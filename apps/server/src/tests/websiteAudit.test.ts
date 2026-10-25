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
