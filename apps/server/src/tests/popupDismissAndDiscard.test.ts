import { describe, it } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToString } from "react-dom/server";
import { SiteHeader } from "@akeezo/web/src/components/SiteHeader.js";
import { DiscardConfirmDialog } from "@akeezo/web/src/components/DiscardConfirmDialog.js";
import { App } from "@akeezo/web/src/App.js";
import { getDefaultRouteData } from "@akeezo/web/src/defaultData.js";

describe("Popup Dismiss & Discard Confirmation Verification Suite", () => {
  it("1. DiscardConfirmDialog renders accessible alertdialog with Complete and Discard options", () => {
    const html = renderToString(
      React.createElement(DiscardConfirmDialog, {
        isOpen: true,
        onComplete: () => {},
        onDiscard: () => {},
        title: "Discard unsaved entries?",
        description: "You have entered information in this form. Would you like to complete your entry or discard it?",
      })
    );

    assert.ok(html.includes('role="alertdialog"'), "Must render alertdialog role");
    assert.ok(html.includes('aria-modal="true"'), "Must declare aria-modal");
    assert.ok(html.includes("Discard unsaved entries?"), "Must render title");
    assert.ok(html.includes("Discard"), "Must provide Discard action");
    assert.ok(html.includes("Complete"), "Must provide Complete action");
    assert.ok(html.includes("data-testid=\"discard-confirm-discard-btn\""), "Must include discard test id");
    assert.ok(html.includes("data-testid=\"discard-confirm-complete-btn\""), "Must include complete test id");
  });

  it("2. DiscardConfirmDialog returns null when closed", () => {
    const html = renderToString(
      React.createElement(DiscardConfirmDialog, {
        isOpen: false,
        onComplete: () => {},
        onDiscard: () => {},
      })
    );

    assert.equal(html, "", "Closed dialog should render empty output");
  });

  it("3. SiteHeader Cost Calculator popup renders dialog role and includes discard dialog wiring", () => {
    const html = renderToString(
      React.createElement(SiteHeader, {
        isCalculatorOpen: true,
      })
    );

    assert.ok(html.includes('role="dialog"'), "Calculator modal must have role='dialog'");
    assert.ok(html.includes('id="calculator-modal-title"'), "Calculator modal must have title");
    assert.ok(html.includes("Personalized Procedure Estimate"), "Must render calculator heading");
    assert.ok(html.includes("Cancel"), "Must have Cancel button");
    // Verify that neither #8b5cf6 nor #7c4de8 appears in SiteHeader
    assert.ok(!html.includes("#8b5cf6"), "SiteHeader must not have hardcoded #8b5cf6");
    assert.ok(!html.includes("#7c4de8"), "SiteHeader must not have hardcoded #7c4de8");
  });

  it("4. Treatments page rendered SSR contains modal and click-outside backdrop dialogs", () => {
    const data = getDefaultRouteData("/treatments");
    const html = renderToString(React.createElement(App, { data }));

    assert.ok(html.includes("Treatments"), "Must render treatments page");
    // Ensure zero purple/violet in header navigation
    assert.ok(!html.includes('text-[#8b5cf6]'), "Must not have hardcoded text-[#8b5cf6]");
    assert.ok(!html.includes('hover:text-[#7c4de8]'), "Must not have hardcoded hover:text-[#7c4de8]");
  });

  it("5. Hospitals page rendered SSR has zero navigation purple and clean structure", () => {
    const data = getDefaultRouteData("/hospitals");
    const html = renderToString(React.createElement(App, { data }));

    assert.ok(html.includes("Hospitals"), "Must render hospitals page");
    assert.ok(!html.includes('text-[#8b5cf6]'), "Must not have hardcoded text-[#8b5cf6]");
  });

  it("6. Calculator template rendered SSR has zero purple/violet #8B5CF6", () => {
    const data = getDefaultRouteData("/calculator");
    const html = renderToString(React.createElement(App, { data }));

    assert.ok(html.includes("Surgery Cost Calculator"), "Must render calculator page");
    assert.ok(!html.includes("#8b5cf6") && !html.includes("#8B5CF6"), "Must not have hardcoded #8B5CF6");
    assert.ok(!html.includes("#6d28d9") && !html.includes("#6D28D9"), "Must not have hardcoded #6D28D9");
  });
});
