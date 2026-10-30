import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import React from "react";
import { renderToString } from "react-dom/server";
import { app } from "../main.js";
import { UserModel } from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";
import { DEFAULT_CAROUSEL_SLIDES } from "@akeezo/contracts";
import { HomeTemplate } from "@akeezo/web/src/templates/HomeTemplate.js";
import { getDefaultRouteData } from "@akeezo/web/src/defaultData.js";
describe("Homepage Feature Carousel Suite (Admin CMS & Public Rendering)", async () => {
    let serverInstance;
    let baseUrl = "";
    let adminToken = "";
    before(async () => {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local");
        }
        let adminUser = await UserModel.findOne({ email: "priti@akeezo.com" });
        if (!adminUser) {
            adminUser = await UserModel.create({
                name: "Priti",
                email: "priti@akeezo.com",
                phone: "+91 82876 39443",
                role: "admin",
                passwordHash: hashPassword("Akeezo@2026!"),
                status: "active",
                phoneVerified: true,
            });
        }
        adminToken = signToken({ userId: adminUser._id.toString(), role: "admin" });
        await new Promise((resolve) => {
            serverInstance = app.listen(0, "127.0.0.1", () => {
                const port = serverInstance.address().port;
                baseUrl = `http://127.0.0.1:${port}`;
                resolve();
            });
        });
    });
    after(async () => {
        if (serverInstance) {
            await new Promise((resolve) => serverInstance.close(() => resolve()));
        }
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    });
    test("1. GET /api/v1/admin/carousel-slides returns default carousel cards", async () => {
        const res = await fetch(`${baseUrl}/api/v1/admin/carousel-slides`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(res.status, 200);
        const json = await res.json();
        assert.ok(Array.isArray(json.data), "Response data must be an array");
        assert.ok(json.data.length >= 4, "Must contain at least 4 default feature cards");
        const ids = json.data.map((c) => c.id);
        assert.ok(ids.includes("calculator"), "Must contain calculator card");
        assert.ok(ids.includes("destinations"), "Must contain destinations card");
        assert.ok(ids.includes("second-opinion"), "Must contain second-opinion card");
        assert.ok(ids.includes("medical-visa"), "Must contain medical-visa card");
    });
    test("2. PUT /api/v1/admin/carousel-slides updates and reorders carousel cards", async () => {
        const customizedSlides = [
            {
                id: "second-opinion",
                title: "Priority Clinical Second Opinion",
                description: "Evaluated directly by senior oncologists and neurosurgeons within 24 hours.",
                badgeText: "Fast Track",
                badgeStyle: "purple",
                buttonText: "Request Review",
                buttonAction: "whatsapp",
                buttonLink: "/#opinion",
                accentColor: "purple",
                iconName: "stethoscope",
                isActive: true,
                order: 1,
            },
            {
                id: "calculator",
                title: "Get Your Personalized Price",
                description: "Compare itemized hospital quotes with zero markups.",
                badgeText: "Save Up To 70%",
                badgeStyle: "orange",
                buttonText: "Calculate Now",
                buttonAction: "calculator",
                buttonLink: "/cost-calculator",
                accentColor: "orange",
                iconName: "calculator",
                isActive: true,
                order: 2,
            },
            {
                id: "destinations",
                title: "Explore Treatments & Hospitals",
                description: "150+ verified hospitals.",
                badgeText: "JCI Accredited",
                badgeStyle: "teal",
                buttonText: "Browse Hubs",
                buttonAction: "explore",
                buttonLink: "/hospitals",
                accentColor: "teal",
                iconName: "compass",
                isActive: false, // Inactive test
                order: 3,
            },
        ];
        const putRes = await fetch(`${baseUrl}/api/v1/admin/carousel-slides`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({ slides: customizedSlides }),
        });
        assert.equal(putRes.status, 200);
        const putJson = await putRes.json();
        assert.equal(putJson.data.length, 3);
        assert.equal(putJson.data[0].id, "second-opinion");
        assert.equal(putJson.data[0].title, "Priority Clinical Second Opinion");
        assert.equal(putJson.data[2].isActive, false);
        // Verify GET reflects the saved configuration
        const getRes = await fetch(`${baseUrl}/api/v1/admin/carousel-slides`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const getJson = await getRes.json();
        assert.equal(getJson.data[0].title, "Priority Clinical Second Opinion");
    });
    test("3. POST /api/v1/admin/carousel-slides/reset restores factory default slides", async () => {
        const resetRes = await fetch(`${baseUrl}/api/v1/admin/carousel-slides/reset`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(resetRes.status, 200);
        const resetJson = await resetRes.json();
        assert.equal(resetJson.data.length, DEFAULT_CAROUSEL_SLIDES.length);
        assert.equal(resetJson.data[0].id, "calculator");
    });
    test("4. HomeTemplate renders carousel with active slides, controls, and accessibility attributes", () => {
        const routeData = getDefaultRouteData("/");
        const html = renderToString(React.createElement(HomeTemplate, { data: routeData }));
        // Accessibility attributes
        assert.ok(html.includes('aria-label="Core Patient Tools"'), "Must have Core Patient Tools section aria-label");
        assert.ok(html.includes('aria-label="Previous slide"'), "Must render Previous slide control");
        assert.ok(html.includes('aria-label="Next slide"'), "Must render Next slide control");
        // Default card anchors preserved
        assert.ok(html.includes('id="calculator"'), "Must preserve id=calculator for navigation anchors");
        assert.ok(html.includes('id="destinations"'), "Must preserve id=destinations for navigation anchors");
        // Theming & styles
        assert.ok(html.includes("border-border-orange"), "Must render border-border-orange on calculator card");
        assert.ok(html.includes("border-border-teal"), "Must render border-border-teal on destinations card");
        assert.ok(html.includes("bg-brand-orange"), "Must render bg-brand-orange CTA button");
        // Badges
        assert.ok(html.includes("Save Up To 70%"), "Must render Save Up To 70% badge");
        assert.ok(html.includes("150+ Verified Hubs"), "Must render 150+ Verified Hubs badge");
    });
});
