import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import sharp from "sharp";
import { app } from "../main.js";
import { MediaAssetModel, UserModel } from "../db/models/index.js";
import { hashPassword, signToken } from "../utils/auth.js";
import { optimizeMediaBuffer, sanitizeSvg, saveOptimizedFilesToDisk, } from "../services/mediaOptimizationService.js";
describe("Media Library Web-Optimized Format & Asset Engine Suite", async () => {
    let serverInstance;
    let baseUrl = "";
    let adminToken = "";
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    before(async () => {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/akeezo_local");
        }
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
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
    test("1. SVG Vector Sanitization strips malicious JavaScript handlers", async () => {
        const maliciousSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><script>alert("xss")</script><rect width="100" height="100" onload="alert(1)" fill="#007A6C"/></svg>', "utf8");
        const cleanSvgBuffer = sanitizeSvg(maliciousSvg);
        const cleanText = cleanSvgBuffer.toString("utf8");
        assert.ok(!cleanText.includes("<script>"), "Should strip <script> tag");
        assert.ok(!cleanText.includes("onload="), "Should strip onload handler");
        assert.ok(cleanText.includes('fill="#007A6C"'), "Should preserve valid SVG attributes");
        const result = await optimizeMediaBuffer(maliciousSvg, "icon.svg", "image/svg+xml");
        assert.equal(result.isWebOptimized, true);
        assert.equal(result.mimeType, "image/svg+xml");
        assert.equal(result.fileCategory, "svg");
    });
    test("2. optimizeMediaBuffer transcodes uncompressed PNG to modern WebP with size reduction", async () => {
        // Generate an uncompressed 1000x800 test PNG
        const rawPng = await sharp({
            create: {
                width: 1000,
                height: 800,
                channels: 4,
                background: { r: 0, g: 122, b: 108, alpha: 1 },
            },
        })
            .png({ compressionLevel: 0 })
            .toBuffer();
        const result = await optimizeMediaBuffer(rawPng, "hospital-exterior.png", "image/png", {
            quality: 80,
            generateVariants: true,
            preserveOriginals: true,
        });
        assert.equal(result.mimeType, "image/webp");
        assert.equal(result.isWebOptimized, true);
        assert.ok(result.sizeBytes < result.originalSizeBytes, "Optimized WebP must be smaller than raw PNG");
        assert.ok(result.optimizationSavingsPercent > 0, "Optimization savings percentage must be > 0");
        // Check responsive variants
        assert.ok(result.variants.length >= 2, "Should generate responsive variants");
        const thumb = result.variants.find((v) => v.variant === "thumbnail");
        assert.ok(thumb, "Thumbnail variant must exist");
        assert.equal(thumb.mimeType, "image/webp");
        // Test saving files to disk
        saveOptimizedFilesToDisk(uploadsDir, result);
        const diskPath = path.join(uploadsDir, result.storedFilename);
        assert.ok(fs.existsSync(diskPath), "Optimized WebP file must exist on disk");
    });
    test("3. GET /api/v1/admin/media/settings and PUT /api/v1/admin/media/settings", async () => {
        // GET default settings
        const getRes = await fetch(`${baseUrl}/api/v1/admin/media/settings`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(getRes.status, 200);
        const getJson = await getRes.json();
        assert.ok(getJson.data);
        assert.equal(typeof getJson.data.quality, "number");
        // PUT updated settings
        const putRes = await fetch(`${baseUrl}/api/v1/admin/media/settings`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                autoOptimizeOnUpload: true,
                quality: 85,
                maxWidth: 1920,
                maxHeight: 1920,
                generateVariants: true,
                format: "webp",
                preserveOriginals: true,
            }),
        });
        assert.equal(putRes.status, 200);
        const putJson = await putRes.json();
        assert.equal(putJson.data.quality, 85);
    });
    test("4. POST /api/v1/admin/media/upload converts image to WebP automatically", async () => {
        const rawPng = await sharp({
            create: {
                width: 600,
                height: 400,
                channels: 4,
                background: { r: 255, g: 107, b: 0, alpha: 1 },
            },
        })
            .png()
            .toBuffer();
        const base64Data = `data:image/png;base64,${rawPng.toString("base64")}`;
        const uploadRes = await fetch(`${baseUrl}/api/v1/admin/media/upload`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
                originalFilename: "apollo-delhi-consultation.png",
                mimeType: "image/png",
                fileData: base64Data,
                altText: "Apollo Delhi Consultation Suite",
            }),
        });
        const uploadJson = await uploadRes.json();
        assert.equal(uploadRes.status, 201);
        assert.ok(uploadJson.data);
        assert.equal(uploadJson.data.mimeType, "image/webp");
        assert.equal(uploadJson.data.isWebOptimized, true);
        assert.ok(uploadJson.data.storageUrl.endsWith(".webp"));
        assert.ok(uploadJson.data.variants.length > 0);
    });
    test("5. Single Asset Optimization: POST /api/v1/admin/media/:id/optimize", async () => {
        // 1. Create a dummy unoptimized file on disk and document in DB
        const dummyPng = await sharp({
            create: {
                width: 400,
                height: 300,
                channels: 4,
                background: { r: 0, g: 199, b: 190, alpha: 1 },
            },
        })
            .png({ compressionLevel: 0 })
            .toBuffer();
        const storedFilename = `test-legacy-${Date.now()}.png`;
        fs.writeFileSync(path.join(uploadsDir, storedFilename), dummyPng);
        const doc = await MediaAssetModel.create({
            originalFilename: "fortis-cardiology-lab.png",
            storedFilename,
            mimeType: "image/png",
            sizeBytes: dummyPng.length,
            url: `/uploads/${storedFilename}`,
            isWebOptimized: false,
            optimizationSavingsPercent: 0,
            altText: "Fortis Cardiology Lab",
            referencedIn: [],
        });
        // 2. Call optimize endpoint
        const optRes = await fetch(`${baseUrl}/api/v1/admin/media/${doc._id}/optimize`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const optJson = await optRes.json();
        assert.equal(optRes.status, 200);
        assert.equal(optJson.data.mimeType, "image/webp");
        assert.equal(optJson.data.isWebOptimized, true);
        assert.ok(optJson.data.optimizationSavingsPercent > 0);
        assert.ok(optJson.data.storageUrl.endsWith(".webp"));
    });
    test("6. Batch Optimization: POST /api/v1/admin/media/optimize-all", async () => {
        // 1. Create another unoptimized asset
        const dummyPng = await sharp({
            create: {
                width: 500,
                height: 350,
                channels: 4,
                background: { r: 6, g: 30, b: 27, alpha: 1 },
            },
        })
            .png({ compressionLevel: 0 })
            .toBuffer();
        const storedFilename = `test-batch-${Date.now()}.png`;
        fs.writeFileSync(path.join(uploadsDir, storedFilename), dummyPng);
        await MediaAssetModel.create({
            originalFilename: "max-hospital-icu.png",
            storedFilename,
            mimeType: "image/png",
            sizeBytes: dummyPng.length,
            url: `/uploads/${storedFilename}`,
            isWebOptimized: false,
            optimizationSavingsPercent: 0,
            altText: "Max Hospital ICU Suite",
            referencedIn: [],
        });
        // 2. Call batch optimize endpoint
        const batchRes = await fetch(`${baseUrl}/api/v1/admin/media/optimize-all`, {
            method: "POST",
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(batchRes.status, 200);
        const batchJson = await batchRes.json();
        assert.ok(batchJson.data.processedCount >= 1, "Should process at least 1 asset");
        assert.ok(batchJson.data.totalSavedBytes > 0, "Should save bytes");
    });
    test("7. GET /api/v1/admin/media/stats returns comprehensive metrics", async () => {
        const statsRes = await fetch(`${baseUrl}/api/v1/admin/media/stats`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        assert.equal(statsRes.status, 200);
        const statsJson = await statsRes.json();
        assert.ok(statsJson.data);
        assert.ok(statsJson.data.totalAssets >= 3);
        assert.ok(statsJson.data.optimizedAssets >= 2);
        assert.ok(statsJson.data.totalSavedBytes > 0);
        assert.ok(statsJson.data.formatBreakdown.webp >= 2);
    });
});
