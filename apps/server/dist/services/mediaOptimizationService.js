import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";
import { DEFAULT_MEDIA_OPTIMIZATION_SETTINGS } from "@akeezo/contracts";
import { SiteSettings } from "../db/models/SiteSettings.js";
/**
 * Sanitize SVG XML markup to prevent XSS / malicious code execution
 */
export function sanitizeSvg(svgBuffer) {
    let svgText = svgBuffer.toString("utf8");
    svgText = svgText
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/data:\s*text\/html/gi, "");
    return Buffer.from(svgText, "utf8");
}
/**
 * Retrieve current media optimization settings from SiteSettings or defaults
 */
export async function getActiveMediaSettings() {
    try {
        let settings = await SiteSettings.findOne({ environment: process.env.NODE_ENV || "development" }).lean();
        if (!settings) {
            settings = await SiteSettings.findOne().lean();
        }
        if (settings && settings.mediaSettings) {
            return {
                ...DEFAULT_MEDIA_OPTIMIZATION_SETTINGS,
                ...settings.mediaSettings,
            };
        }
    }
    catch (err) {
        // fallback
    }
    return DEFAULT_MEDIA_OPTIMIZATION_SETTINGS;
}
/**
 * Optimize an image or asset into modern WebP format with responsive variants and payload reduction metrics
 */
export async function optimizeMediaBuffer(rawBuffer, originalFilename, mimeType, customOptions) {
    const options = {
        ...DEFAULT_MEDIA_OPTIMIZATION_SETTINGS,
        ...(customOptions || {}),
    };
    const isSvg = mimeType.toLowerCase() === "image/svg+xml" || originalFilename.toLowerCase().endsWith(".svg");
    const isDocument = mimeType.toLowerCase() === "application/pdf" ||
        mimeType.toLowerCase().includes("word") ||
        originalFilename.toLowerCase().endsWith(".pdf");
    // 1. Vector SVGs: Sanitize & mark as inherently web-optimized
    if (isSvg) {
        const cleanBuffer = sanitizeSvg(rawBuffer);
        const hash = crypto.createHash("sha256").update(cleanBuffer).digest("hex").slice(0, 12);
        const nonce = crypto.randomBytes(4).toString("hex");
        const storedFilename = `${hash}-${nonce}.svg`;
        return {
            optimizedBuffer: cleanBuffer,
            originalBuffer: rawBuffer,
            storedFilename,
            mimeType: "image/svg+xml",
            originalMimeType: mimeType,
            sizeBytes: cleanBuffer.length,
            originalSizeBytes: rawBuffer.length,
            url: `/uploads/${storedFilename}`,
            isWebOptimized: true,
            optimizationSavingsPercent: 0,
            variants: [],
            fileCategory: "svg",
        };
    }
    // 2. Documents (PDF / Office): Retain original safe format
    if (isDocument) {
        const ext = originalFilename.includes(".") ? path.extname(originalFilename) : ".pdf";
        const hash = crypto.createHash("sha256").update(rawBuffer).digest("hex").slice(0, 12);
        const nonce = crypto.randomBytes(4).toString("hex");
        const storedFilename = `${hash}-${nonce}${ext}`;
        return {
            optimizedBuffer: rawBuffer,
            originalBuffer: rawBuffer,
            storedFilename,
            mimeType,
            originalMimeType: mimeType,
            sizeBytes: rawBuffer.length,
            originalSizeBytes: rawBuffer.length,
            url: `/uploads/${storedFilename}`,
            isWebOptimized: false,
            optimizationSavingsPercent: 0,
            variants: [],
            fileCategory: "document",
        };
    }
    // 3. Bypass auto-optimization if disabled in settings
    if (options.autoOptimizeOnUpload === false) {
        const ext = path.extname(originalFilename) || (mimeType === "image/png" ? ".png" : ".jpg");
        const hash = crypto.createHash("sha256").update(rawBuffer).digest("hex").slice(0, 12);
        const nonce = crypto.randomBytes(4).toString("hex");
        const storedFilename = `${hash}-${nonce}${ext}`;
        let width;
        let height;
        try {
            const meta = await sharp(rawBuffer).metadata();
            width = meta.width;
            height = meta.height;
        }
        catch { }
        return {
            optimizedBuffer: rawBuffer,
            originalBuffer: rawBuffer,
            storedFilename,
            mimeType,
            originalMimeType: mimeType,
            sizeBytes: rawBuffer.length,
            originalSizeBytes: rawBuffer.length,
            width,
            height,
            url: `/uploads/${storedFilename}`,
            isWebOptimized: false,
            optimizationSavingsPercent: 0,
            variants: [],
            fileCategory: "image",
        };
    }
    // 4. Raster Images (JPEG, PNG, WebP, GIF, TIFF): Transcode to next-gen WebP
    try {
        const meta = await sharp(rawBuffer).metadata();
        const origWidth = meta.width || 0;
        const origHeight = meta.height || 0;
        const maxWidth = options.maxWidth || 1920;
        const maxHeight = options.maxHeight || 1920;
        const quality = Math.max(1, Math.min(100, options.quality || 80));
        // WebP pipeline with smart auto-rotation and dimensional bounding
        let pipeline = sharp(rawBuffer).rotate();
        if (origWidth > maxWidth || origHeight > maxHeight) {
            pipeline = pipeline.resize({
                width: origWidth > origHeight ? maxWidth : undefined,
                height: origHeight >= origWidth ? maxHeight : undefined,
                fit: "inside",
                withoutEnlargement: true,
            });
        }
        const webpBuffer = await pipeline.webp({ quality, effort: 4 }).toBuffer();
        const webpMeta = await sharp(webpBuffer).metadata();
        const originalSize = rawBuffer.length;
        const optimizedSize = webpBuffer.length;
        const savingsPercent = originalSize > optimizedSize
            ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
            : 0;
        const hash = crypto.createHash("sha256").update(webpBuffer).digest("hex").slice(0, 12);
        const nonce = crypto.randomBytes(4).toString("hex");
        const storedFilename = `${hash}-${nonce}.webp`;
        const publicUrl = `/uploads/${storedFilename}`;
        const variants = [];
        // Responsive Variant 1: Compact Thumbnail (320w WebP)
        if (options.generateVariants) {
            try {
                const thumbBuffer = await sharp(rawBuffer)
                    .rotate()
                    .resize({ width: 320, fit: "inside", withoutEnlargement: true })
                    .webp({ quality: 75 })
                    .toBuffer();
                const thumbMeta = await sharp(thumbBuffer).metadata();
                const thumbFilename = `${hash}-${nonce}-thumb.webp`;
                variants.push({
                    variant: "thumbnail",
                    storedFilename: thumbFilename,
                    url: `/uploads/${thumbFilename}`,
                    width: thumbMeta.width || 320,
                    height: thumbMeta.height || 320,
                    sizeBytes: thumbBuffer.length,
                    mimeType: "image/webp",
                    buffer: thumbBuffer,
                });
            }
            catch (thumbErr) {
                // non-blocking
            }
            // Responsive Variant 2: Medium Screen (768w WebP)
            if (origWidth > 768) {
                try {
                    const medBuffer = await sharp(rawBuffer)
                        .rotate()
                        .resize({ width: 768, fit: "inside", withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toBuffer();
                    const medMeta = await sharp(medBuffer).metadata();
                    const medFilename = `${hash}-${nonce}-medium.webp`;
                    variants.push({
                        variant: "medium",
                        storedFilename: medFilename,
                        url: `/uploads/${medFilename}`,
                        width: medMeta.width || 768,
                        height: medMeta.height || 768,
                        sizeBytes: medBuffer.length,
                        mimeType: "image/webp",
                        buffer: medBuffer,
                    });
                }
                catch (medErr) {
                    // non-blocking
                }
            }
        }
        // Preserve original format if requested
        let originalUrl = undefined;
        if (options.preserveOriginals && mimeType !== "image/webp") {
            const origExt = path.extname(originalFilename) || (mimeType === "image/png" ? ".png" : ".jpg");
            const origHash = crypto.createHash("sha256").update(rawBuffer).digest("hex").slice(0, 12);
            const origFilename = `${origHash}-${nonce}-orig${origExt}`;
            originalUrl = `/uploads/${origFilename}`;
            variants.push({
                variant: "original",
                storedFilename: origFilename,
                url: originalUrl,
                width: origWidth,
                height: origHeight,
                sizeBytes: rawBuffer.length,
                mimeType,
                buffer: rawBuffer,
            });
        }
        return {
            optimizedBuffer: webpBuffer,
            originalBuffer: rawBuffer,
            storedFilename,
            mimeType: "image/webp",
            originalMimeType: mimeType,
            sizeBytes: webpBuffer.length,
            originalSizeBytes: rawBuffer.length,
            width: webpMeta.width || origWidth,
            height: webpMeta.height || origHeight,
            url: publicUrl,
            originalUrl,
            isWebOptimized: true,
            optimizationSavingsPercent: savingsPercent,
            variants,
            fileCategory: "image",
        };
    }
    catch (err) {
        // If sharp fails to process (e.g. invalid raster header), store raw safely
        console.warn("[MediaOptimizer] Fallback to raw buffer due to processing error:", err.message);
        const ext = path.extname(originalFilename) || ".png";
        const hash = crypto.createHash("sha256").update(rawBuffer).digest("hex").slice(0, 12);
        const nonce = crypto.randomBytes(4).toString("hex");
        const storedFilename = `${hash}-${nonce}${ext}`;
        return {
            optimizedBuffer: rawBuffer,
            originalBuffer: rawBuffer,
            storedFilename,
            mimeType,
            originalMimeType: mimeType,
            sizeBytes: rawBuffer.length,
            originalSizeBytes: rawBuffer.length,
            url: `/uploads/${storedFilename}`,
            isWebOptimized: false,
            optimizationSavingsPercent: 0,
            variants: [],
            fileCategory: "image",
        };
    }
}
/**
 * Persist optimized buffers and all responsive variants to disk in uploads directory
 */
export function saveOptimizedFilesToDisk(uploadsDir, result) {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    // 1. Primary file (WebP or sanitized SVG or raw)
    const primaryPath = path.join(uploadsDir, result.storedFilename);
    fs.writeFileSync(primaryPath, result.optimizedBuffer);
    // 2. Responsive variants & original
    for (const v of result.variants) {
        const vPath = path.join(uploadsDir, v.storedFilename);
        fs.writeFileSync(vPath, v.buffer);
    }
}
/**
 * Optimize an existing unoptimized MediaAsset document in the database
 */
export async function optimizeExistingMediaDoc(doc, uploadsDir, options) {
    const currentPath = path.join(uploadsDir, doc.storedFilename);
    if (!fs.existsSync(currentPath)) {
        throw new Error(`Underlying file ${doc.storedFilename} not found on disk.`);
    }
    const rawBuffer = fs.readFileSync(currentPath);
    const optOptions = { ...(options || {}), autoOptimizeOnUpload: true };
    const result = await optimizeMediaBuffer(rawBuffer, doc.originalFilename, doc.originalMimeType || doc.mimeType, optOptions);
    saveOptimizedFilesToDisk(uploadsDir, result);
    doc.storedFilename = result.storedFilename;
    doc.mimeType = result.mimeType;
    doc.originalMimeType = doc.originalMimeType || result.originalMimeType;
    doc.originalSizeBytes = doc.originalSizeBytes || result.originalSizeBytes;
    doc.sizeBytes = result.sizeBytes;
    doc.width = result.width;
    doc.height = result.height;
    doc.url = result.url;
    doc.originalUrl = result.originalUrl || doc.originalUrl;
    doc.isWebOptimized = result.isWebOptimized;
    doc.optimizationSavingsPercent = result.optimizationSavingsPercent;
    doc.optimizedAt = new Date();
    doc.variants = result.variants.map((v) => ({
        variant: v.variant,
        url: v.url,
        width: v.width,
        height: v.height,
        sizeBytes: v.sizeBytes,
        mimeType: v.mimeType,
    }));
    await doc.save();
    return doc;
}
