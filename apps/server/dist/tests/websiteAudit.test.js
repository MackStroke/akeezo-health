import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { getDefaultRouteData } from "@akeezo/web/src/defaultData.js";
import { HomeTemplate } from "@akeezo/web/src/templates/HomeTemplate.js";
import { LegalTemplate } from "@akeezo/web/src/templates/LegalTemplate.js";
import { NotFoundTemplate } from "@akeezo/web/src/templates/NotFoundTemplate.js";
import { ServerErrorTemplate } from "@akeezo/web/src/templates/ServerErrorTemplate.js";
import { CalculatorTemplate } from "@akeezo/web/src/templates/CalculatorTemplate.js";
import { TreatmentsTemplate } from "@akeezo/web/src/templates/TreatmentsTemplate.js";
import { SiteHeader } from "@akeezo/web/src/components/SiteHeader.js";
import { SiteFooter } from "@akeezo/web/src/components/SiteFooter.js";
import { renderFallback500Html } from "../ssr/renderer.js";
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
        assert.ok(homeHtml.includes('href="/"') && homeHtml.includes('aria-label="Akeezo Healthcare Platform Home"'), "Hero brand logo must be wrapped in a clickable link pointing to home");
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
        assert.ok(footerHtml.includes('href="/"') && footerHtml.includes('aria-label="Akeezo Healthcare Platform Home"'), "Footer brand logo must be wrapped in a link pointing to home");
    });
    it("SiteHeader mobile menu and modals render clickable logo, clickable phone, and accessible forms", () => {
        const data = getDefaultRouteData("/");
        const headerHtml = renderToString(React.createElement(SiteHeader, { siteSettings: data.siteSettings }));
        assert.ok(headerHtml.includes('aria-label="Toggle navigation menu"'), "Mobile menu button must have accessible label");
        assert.ok(headerHtml.includes('href="tel:'), "Header must contain clickable tel: helpline");
        assert.ok(headerHtml.includes('aria-label="Close menu"'), "Mobile menu must contain accessible close button");
    });
});
describe("Website Audit Task 5: Error Templates Polish & Client Document Title Sync", () => {
    it("404 and 500 error templates render clickable phone, clickable email, and accessible search validation", () => {
        const notFoundData = getDefaultRouteData("/unknown-treatment-path");
        const html404 = renderToString(React.createElement(NotFoundTemplate, { data: notFoundData }));
        assert.ok(html404.includes('href="tel:'), "404 page must render clickable phone link");
        assert.ok(html404.includes('href="mailto:'), "404 page must render clickable email link");
        assert.ok(html404.includes('aria-describedby="notfound-search-error"'), "404 search input must link to accessible error container");
        const errorData = getDefaultRouteData("/500");
        const html500 = renderToString(React.createElement(ServerErrorTemplate, { data: errorData }));
        assert.ok(html500.includes('href="tel:'), "500 page must render clickable phone link");
        assert.ok(html500.includes('href="mailto:'), "500 page must render clickable email link");
    });
});
describe("Website Audit Task 6: Server SSR Renderer Head Injection, Favicon, & Images", () => {
    it("Fallback 500 HTML renderer contains favicon and dynamic current copyright year", () => {
        const data = getDefaultRouteData("/500");
        const fallbackHtml = renderFallback500Html(data.siteSettings);
        const currentYear = new Date().getFullYear().toString();
        assert.ok(fallbackHtml.includes("/logo/favicon.svg"), "Fallback 500 must include favicon link");
        assert.ok(fallbackHtml.includes(`© ${currentYear}`), `Fallback 500 must include dynamic current year ${currentYear}`);
    });
});
describe("Website Audit Task 7: Brand Color Theme Consistency", () => {
    it("HomeTemplate and SiteHeader reflect verified brand color tokens and dual-brand visual identity", () => {
        const data = getDefaultRouteData("/");
        const homeHtml = renderToString(React.createElement(HomeTemplate, { data }));
        const headerHtml = renderToString(React.createElement(SiteHeader, { siteSettings: data.siteSettings }));
        // Dual-brand ambient glow
        assert.ok(homeHtml.includes("from-brand-teal/15"), "HomeTemplate must include brand teal in hero glow");
        assert.ok(homeHtml.includes("to-brand-orange/12"), "HomeTemplate must include brand orange in hero glow");
        // Brand conversion CTAs
        assert.ok(homeHtml.includes("bg-brand-orange"), "HomeTemplate must render brand orange conversion buttons");
        assert.ok(headerHtml.includes("bg-brand-orange"), "SiteHeader must render brand orange for Get Free Quote CTA");
        assert.ok(headerHtml.includes("text-brand-orange"), "SiteHeader must highlight Calculate Price with brand orange");
        // Dual-theme feature cards
        assert.ok(homeHtml.includes("border-border-orange"), "HomeTemplate must render brand orange border on price card");
        assert.ok(homeHtml.includes("border-border-teal"), "HomeTemplate must render brand teal border on explore card");
    });
});
describe("Website Audit Task 8: Calculator Page Structure", () => {
    it("Calculator page resolves with calculatorLanding and renders requested structure, breadcrumb, 4 steps, success stories, and FAQs", () => {
        const data = getDefaultRouteData("/cost-calculator");
        assert.equal(data.pageKind, "calculatorLanding");
        assert.equal(data.seo.title, "Surgery Cost Calculator Tool | Save up to 70% | AKEEZO");
        const html = renderToString(React.createElement(CalculatorTemplate, { data }));
        assert.ok(html.includes("Surgery Cost"), "Must render surgery cost headline");
        assert.ok(html.includes("Save up to 70%"), "Must render Save up to 70% gradient text");
        assert.ok(html.includes("Trusted by 15,000+ International Patients"), "Must render trust badge");
        assert.ok(html.includes("Patient Success Stories"), "Must render patient success stories section");
        assert.ok(html.includes("Sarah M."), "Must render Sarah M. review");
        assert.ok(html.includes("James L."), "Must render James L. review");
        assert.ok(html.includes("Elena K."), "Must render Elena K. review");
        assert.ok(html.includes("How to Use Our Surgery Cost Calculator Tool"), "Must render 4 steps section");
        assert.ok(html.includes("Select Treatment"), "Must render step 1");
        assert.ok(html.includes("Choose Country"), "Must render step 2");
        assert.ok(html.includes("Patient Details"), "Must render step 3");
        assert.ok(html.includes("Preferences"), "Must render step 4");
        assert.ok(html.includes("Try the Calculator Now"), "Must render Try the Calculator banner");
        assert.ok(html.includes("Frequently Asked Questions"), "Must render FAQ section");
        assert.ok(html.includes("All Questions"), "Must render FAQ category filters");
        assert.ok(html.includes("How accurate are the cost estimates"), "Must render FAQ questions");
    });
});
describe("Website Audit Task 9: Treatments Directory Page Structure", () => {
    it("Treatments page resolves with treatmentDirectory and renders hero, search, top treatments, all treatments, and promotional banners", () => {
        const data = getDefaultRouteData("/treatments");
        assert.equal(data.pageKind, "treatmentDirectory");
        assert.equal(data.seo.title, "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO");
        const html = renderToString(React.createElement(TreatmentsTemplate, { data }));
        assert.ok(html.includes("Find The Best Treatments Worldwide"), "Must render hero headline");
        assert.ok(html.includes("Top Treatments on AKEEZO"), "Must render top treatments section");
        assert.ok(html.includes("AKEEZO"), "Must render AKEEZO branding");
        assert.ok(html.includes("Is Absolutely Free"), "Must render free banner headline");
        assert.ok(html.includes("All Treatments"), "Must render All Treatments directory");
        assert.ok(html.includes("Cosmetic/Plastic Surgery"), "Must render treatment cards");
        assert.ok(html.includes("Make Confident"), "Must render confident decision banner");
    });
});
