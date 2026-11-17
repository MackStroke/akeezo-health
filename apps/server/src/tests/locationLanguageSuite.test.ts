import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { App } from "@akeezo/web/src/App.js";
import { getDefaultRouteData } from "@akeezo/web/src/defaultData.js";
import {
  COUNTRY_LANGUAGE_MAP,
  TIMEZONE_TO_COUNTRY,
  countryFromTimezone,
  countryFromNavigatorLocale
} from "@akeezo/web/src/components/locationLanguage.js";
import { LANGUAGES } from "@akeezo/web/src/components/navigationData.js";
import { apiRouter } from "../api/routes.js";

describe("Location-Based Language Detection & Multi-Language Support Suite", () => {
  let server: http.Server;
  let baseUrl = "";

  before(async () => {
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
  });

  it("1. Public API: GET /api/v1/geo detects country from x-vercel-ip-country header", async () => {
    const res = await fetch(`${baseUrl}/api/v1/geo`, {
      headers: {
        "x-vercel-ip-country": "AE",
        "accept-language": "ar,en;q=0.9"
      }
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.countryCode, "AE");
    assert.ok(body.acceptLanguage.includes("ar"));
  });

  it("2. Public API: GET /api/v1/geo detects country from Cloudflare cf-ipcountry header", async () => {
    const res = await fetch(`${baseUrl}/api/v1/geo`, {
      headers: {
        "cf-ipcountry": "BD",
        "accept-language": "bn-BD,bn;q=0.9"
      }
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.countryCode, "BD");
  });

  it("3. Public API: GET /api/v1/geo handles missing geo headers gracefully", async () => {
    const res = await fetch(`${baseUrl}/api/v1/geo`);

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.countryCode, null);
  });

  it("4. Timezone resolution: Maps international medical tourism timezones accurately", () => {
    assert.equal(countryFromTimezone("Asia/Dubai"), "AE", "Dubai timezone must map to UAE");
    assert.equal(countryFromTimezone("Asia/Riyadh"), "SA", "Riyadh timezone must map to Saudi Arabia");
    assert.equal(countryFromTimezone("Asia/Dhaka"), "BD", "Dhaka timezone must map to Bangladesh");
    assert.equal(countryFromTimezone("Africa/Nairobi"), "KE", "Nairobi timezone must map to Kenya");
    assert.equal(countryFromTimezone("Europe/Paris"), "FR", "Paris timezone must map to France");
    assert.equal(countryFromTimezone("Europe/Moscow"), "RU", "Moscow timezone must map to Russia");
    assert.equal(countryFromTimezone("Asia/Kolkata"), "IN", "Kolkata timezone must map to India");
  });

  it("5. Navigator locale resolution: Maps browser locales to country codes", () => {
    assert.equal(countryFromNavigatorLocale("ar-AE"), "AE");
    assert.equal(countryFromNavigatorLocale("ar-SA"), "SA");
    assert.equal(countryFromNavigatorLocale("bn-BD"), "BD");
    assert.equal(countryFromNavigatorLocale("fr-FR"), "FR");
    assert.equal(countryFromNavigatorLocale("ru-RU"), "RU");
    assert.equal(countryFromNavigatorLocale("sw-KE"), "KE");
    assert.equal(countryFromNavigatorLocale("es-MX"), "MX");
    assert.equal(countryFromNavigatorLocale("es-ES"), "ES");
  });

  it("6. Country-to-Language Mapping: Contains major clinical travel markets", () => {
    assert.equal(COUNTRY_LANGUAGE_MAP.AE.lang, "ar", "UAE must map to Arabic");
    assert.equal(COUNTRY_LANGUAGE_MAP.SA.lang, "ar", "Saudi Arabia must map to Arabic");
    assert.equal(COUNTRY_LANGUAGE_MAP.BD.lang, "bn", "Bangladesh must map to Bengali");
    assert.equal(COUNTRY_LANGUAGE_MAP.KE.lang, "sw", "Kenya must map to Swahili");
    assert.equal(COUNTRY_LANGUAGE_MAP.FR.lang, "fr", "France must map to French");
    assert.equal(COUNTRY_LANGUAGE_MAP.RU.lang, "ru", "Russia must map to Russian");
    assert.equal(COUNTRY_LANGUAGE_MAP.MX.lang, "es", "Mexico must map to Spanish");
  });

  it("7. Supported Languages: Includes expanded language options in navigationData", () => {
    const codes = LANGUAGES.map((l) => l.code);
    assert.ok(codes.includes("en"), "Must support English");
    assert.ok(codes.includes("ar"), "Must support Arabic");
    assert.ok(codes.includes("bn"), "Must support Bengali");
    assert.ok(codes.includes("fr"), "Must support French");
    assert.ok(codes.includes("ru"), "Must support Russian");
    assert.ok(codes.includes("sw"), "Must support Swahili");
    assert.ok(codes.includes("hi"), "Must support Hindi");
    assert.ok(codes.includes("es"), "Must support Spanish");
    assert.ok(codes.includes("tr"), "Must support Turkish");
  });

  it("8. SSR Stability: Root App renders safely without client globals", () => {
    const routeData = getDefaultRouteData("/");
    const html = renderToString(React.createElement(App, { data: routeData }));

    assert.ok(html.includes("<!---->") || html.length > 500, "App must render HTML string");
    assert.ok(html.includes("AKEEZO"), "Must contain brand name in rendered HTML");
  });
});
