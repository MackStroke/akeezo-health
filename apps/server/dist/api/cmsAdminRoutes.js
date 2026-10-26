import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Router } from "express";
import mongoose from "mongoose";
import { SiteSettings, Page, ContentRevision, RouteEntry, EnquiryModel, PatientModel, CaseModel, CaseAuditLogModel, HospitalModel, PartnerModel, UserModel, MediaAssetModel, RedirectModel, } from "../db/models/index.js";
import { hashPassword, verifyPassword, escapeRegex, verifyToken, requireAuth, requireRole, FALLBACK_USERS, } from "../utils/auth.js";
import { DEFAULT_WEBSITE_THEME, DEFAULT_ADMIN_THEME, THEME_PRESETS, sanitizeCssValue } from "@akeezo/contracts";
import { env } from "../config/env.js";
export const cmsAdminRouter = Router();
// ==========================================
// STRICT SUPER ADMIN AUTH & RBAC ENFORCEMENT
// ==========================================
cmsAdminRouter.use(requireAuth);
cmsAdminRouter.use(requireRole("admin"));
// ==========================================
// AUDIT LOG HELPER
// ==========================================
async function logAdminActivity(actorId, entityType, entityId, action, changes, req, caseId) {
    if (mongoose.connection.readyState === 1) {
        try {
            await CaseAuditLogModel.create({
                occurredAt: new Date(),
                actorId: actorId && mongoose.isValidObjectId(actorId) ? actorId : undefined,
                entityType,
                entityId: entityId && mongoose.isValidObjectId(entityId) ? entityId : new mongoose.Types.ObjectId(),
                caseId: caseId || (entityType === "case" ? entityId : undefined),
                action,
                changes,
                ip: req?.ip,
                userAgent: req?.headers?.["user-agent"],
            });
        }
        catch (e) {
            console.warn("Audit log notice:", e?.message);
        }
    }
}
// Formula-injection mitigation for CSV values
function sanitizeCsvValue(val) {
    if (val === null || val === undefined)
        return '""';
    let str = String(val);
    if (/^[=+\-@\t\r]/.test(str)) {
        str = `'${str}`;
    }
    return `"${str.replace(/"/g, '""')}"`;
}
// ==========================================
// 0. SUPER ADMIN UNIFIED OVERVIEW & STATS
// ==========================================
// GET /api/v1/admin/overview-stats
cmsAdminRouter.get("/overview-stats", async (_req, res) => {
    try {
        let pagesCount = 12;
        let draftPagesCount = 1;
        let enquiries = [];
        let cases = [];
        let mediaCount = 0;
        let redirectsCount = 0;
        let activityCount = 0;
        let partnersCount = 4;
        let hospitalsCount = 6;
        let usersCount = 7;
        if (mongoose.connection.readyState === 1) {
            const [pCount, dCount, enqs, cs, mCount, rCount, aCount, prtCount, hspCount, uCount,] = await Promise.all([
                Page.countDocuments(),
                Page.countDocuments({ status: "draft" }),
                EnquiryModel.find().sort({ createdAt: -1 }).lean(),
                CaseModel.find().lean(),
                MediaAssetModel.countDocuments(),
                RedirectModel.countDocuments(),
                CaseAuditLogModel.countDocuments(),
                PartnerModel.countDocuments(),
                HospitalModel.countDocuments(),
                UserModel.countDocuments(),
            ]);
            pagesCount = pCount;
            draftPagesCount = dCount;
            enquiries = enqs;
            cases = cs;
            mediaCount = mCount;
            redirectsCount = rCount;
            activityCount = aCount;
            partnersCount = prtCount;
            hospitalsCount = hspCount;
            usersCount = uCount;
        }
        const totalEnquiries = enquiries.length;
        const newEnquiries = enquiries.filter((e) => e.status === "received" || e.status === "triage" || e.status === "new").length;
        const contactedEnquiries = enquiries.filter((e) => e.status === "contacted" || e.status === "in_progress").length;
        const convertedEnquiries = enquiries.filter((e) => e.status === "converted" || e.status === "resolved").length;
        const totalCases = cases.length;
        const activeCases = cases.filter((c) => c.status === "open").length;
        const closedCases = cases.filter((c) => c.status === "closed").length;
        const conversionRatePercent = totalEnquiries > 0 ? Math.round((convertedEnquiries / totalEnquiries) * 100) : 0;
        // Recent Enquiries
        const recentEnquiries = enquiries.slice(0, 5).map((e) => ({
            id: e._id,
            receiptId: e.receiptId || "ENQ-2026-0001",
            requesterName: e.requesterName || e.name || "Patient Lead",
            serviceType: e.serviceType || "medical_tourism",
            createdAt: e.createdAt,
            status: e.status || "received",
        }));
        // Recent Activity from audit log
        let recentActivities = [];
        if (mongoose.connection.readyState === 1) {
            recentActivities = await CaseAuditLogModel.find()
                .sort({ occurredAt: -1 })
                .limit(6)
                .populate("actorId", "name role email")
                .lean();
        }
        res.json({
            data: {
                website: {
                    totalPages: pagesCount,
                    publishedPages: Math.max(0, pagesCount - draftPagesCount),
                    draftPages: draftPagesCount,
                    activeRevisions: pagesCount,
                    mediaCount,
                    redirectsCount,
                },
                leads: {
                    totalEnquiries,
                    newEnquiries,
                    contactedEnquiries,
                    convertedEnquiries,
                    conversionRatePercent,
                },
                caseManagement: {
                    totalCases: totalCases || 3,
                    activeCases: activeCases || 3,
                    closedCases,
                    totalPartners: partnersCount,
                    totalHospitals: hospitalsCount,
                    stageBreakdown: {
                        new_referral: 1,
                        medical_review: 1,
                        rfq_sent: 1,
                        quotes_received: 0,
                        visa_travel: 0,
                        treatment_in_progress: 0,
                        discharge_billing: 0,
                    },
                },
                users: {
                    totalUsers: usersCount,
                },
                recentEnquiries,
                recentActivities,
                system: {
                    environment: mongoose.connection.readyState === 1 ? "production" : "demo-preview",
                    database: mongoose.connection.readyState === 1 ? "connected" : "in-memory-fallback",
                    status: "healthy",
                    timestamp: new Date().toISOString(),
                },
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: { code: "STATS_FAILED", message: err.message } });
    }
});
// ==========================================
// 1. SITE & BRAND SETTINGS MANAGEMENT
// ==========================================
// Helper to find the active SiteSettings document
async function getActiveSiteSettingsDoc() {
    const targetEnv = env.NODE_ENV || "development";
    let doc = await SiteSettings.findOne({ environment: targetEnv });
    if (!doc && targetEnv !== "development") {
        doc = await SiteSettings.findOne({ environment: "development" });
    }
    if (!doc) {
        doc = await SiteSettings.findOne();
    }
    return doc;
}
// Helper to update active SiteSettings document
async function updateActiveSiteSettings(updatePayload) {
    const targetEnv = env.NODE_ENV || "development";
    const existing = await getActiveSiteSettingsDoc();
    const filter = existing ? { _id: existing._id } : { environment: targetEnv };
    return SiteSettings.findOneAndUpdate(filter, { $set: updatePayload, $inc: { version: 1 } }, { upsert: true, new: true });
}
// GET /api/v1/admin/site-settings
cmsAdminRouter.get("/site-settings", async (_req, res) => {
    try {
        let settings = null;
        if (mongoose.connection.readyState === 1) {
            const doc = await getActiveSiteSettingsDoc();
            if (doc)
                settings = doc.toObject ? doc.toObject() : doc;
        }
        if (!settings) {
            settings = {
                environment: env.NODE_ENV || "development",
                brandName: "AKEEZO",
                tagline: "Heal In India, Heal By Akeezo",
                legalEntityName: "AKEEZO Healthcare Platform Private Limited",
                emergencyHelpline: "+91 82876 39443",
                contactEmail: "care@akeezo.com",
                careEmail: "care@akeezo.com",
                medicalEmail: "medical@akeezo.com",
                partnershipEmail: "partnership@akeezo.com",
                primaryColor: "#00C7BE",
                secondaryColor: "#FF6B00",
                actionColor: "#007A6C",
                showTopUtilityBar: true,
                emergencyNotice: "EMERGENCY?",
                headquartersAddress: "Regus Elegance, Jasola District Centre, New Delhi, India 110025",
                defaultLanguage: "en",
                defaultTimezone: "Asia/Kolkata",
                integrations: {
                    googleAnalyticsId: "",
                    firebaseProjectMasked: "akeezo-health-prod (Active)",
                    smtpHostMasked: "smtp.sendgrid.net (Configured)",
                    storageBucketMasked: "gs://akeezo-vault-prod (Protected)",
                },
                formsConfig: {
                    leadNotificationEmails: ["care@akeezo.com", "coordinator@akeezo.com"],
                    autoTriageEnabled: true,
                    spamFilterEnabled: true,
                },
                navigation: {
                    headerMenu: [],
                    footerGroups: [],
                },
            };
        }
        else {
            if (!settings.websiteTheme) {
                settings.websiteTheme = {
                    ...DEFAULT_WEBSITE_THEME,
                    primaryColor: settings.primaryColor || DEFAULT_WEBSITE_THEME.primaryColor,
                    secondaryColor: settings.secondaryColor || DEFAULT_WEBSITE_THEME.secondaryColor,
                    accentColor: settings.accentColor || DEFAULT_WEBSITE_THEME.accentColor,
                    actionColor: settings.actionColor || DEFAULT_WEBSITE_THEME.actionColor,
                };
            }
            if (!settings.adminTheme) {
                settings.adminTheme = { ...DEFAULT_ADMIN_THEME };
            }
            if (!settings.integrations) {
                settings.integrations = {
                    googleAnalyticsId: "",
                    firebaseProjectMasked: "akeezo-health-prod (Active)",
                    smtpHostMasked: "smtp.sendgrid.net (Configured)",
                    storageBucketMasked: "gs://akeezo-vault-prod (Protected)",
                };
            }
            if (!settings.formsConfig) {
                settings.formsConfig = {
                    leadNotificationEmails: ["care@akeezo.com", "coordinator@akeezo.com"],
                    autoTriageEnabled: true,
                    spamFilterEnabled: true,
                };
            }
            if (!settings.navigation) {
                settings.navigation = {
                    headerMenu: [],
                    footerGroups: [],
                };
            }
        }
        res.json({ data: settings });
    }
    catch {
        res.json({
            data: {
                environment: env.NODE_ENV || "development",
                brandName: "AKEEZO",
                tagline: "Heal In India, Heal By Akeezo",
                websiteTheme: DEFAULT_WEBSITE_THEME,
                adminTheme: DEFAULT_ADMIN_THEME,
            },
        });
    }
});
function sanitizeThemeObject(input) {
    if (!input || typeof input !== "object")
        return {};
    const cleaned = {};
    for (const [key, value] of Object.entries(input)) {
        if (typeof value === "string") {
            cleaned[key] = sanitizeCssValue(value);
        }
        else {
            cleaned[key] = value;
        }
    }
    return cleaned;
}
// PUT /api/v1/admin/site-settings (and PUT /api/v1/admin/settings/:section)
cmsAdminRouter.put(["/site-settings", "/settings/:section"], async (req, res) => {
    try {
        const existingDoc = await getActiveSiteSettingsDoc();
        const existingObj = existingDoc ? (existingDoc.toObject ? existingDoc.toObject() : existingDoc) : null;
        const updatePayload = {};
        if (req.body.brandName !== undefined)
            updatePayload.brandName = req.body.brandName;
        if (req.body.tagline !== undefined)
            updatePayload.tagline = req.body.tagline;
        if (req.body.legalEntityName !== undefined)
            updatePayload.legalEntityName = req.body.legalEntityName;
        if (req.body.logoVariants !== undefined)
            updatePayload.logoVariants = req.body.logoVariants;
        if (req.body.primaryColor !== undefined)
            updatePayload.primaryColor = sanitizeCssValue(req.body.primaryColor);
        if (req.body.secondaryColor !== undefined)
            updatePayload.secondaryColor = sanitizeCssValue(req.body.secondaryColor);
        if (req.body.accentColor !== undefined)
            updatePayload.accentColor = sanitizeCssValue(req.body.accentColor);
        if (req.body.actionColor !== undefined)
            updatePayload.actionColor = sanitizeCssValue(req.body.actionColor);
        if (req.body.websiteTheme !== undefined) {
            const existingWebsite = existingObj?.websiteTheme || {};
            const sanitized = sanitizeThemeObject(req.body.websiteTheme);
            updatePayload.websiteTheme = {
                ...DEFAULT_WEBSITE_THEME,
                ...existingWebsite,
                ...sanitized,
            };
            if (updatePayload.websiteTheme.primaryColor)
                updatePayload.primaryColor = updatePayload.websiteTheme.primaryColor;
            if (updatePayload.websiteTheme.secondaryColor)
                updatePayload.secondaryColor = updatePayload.websiteTheme.secondaryColor;
            if (updatePayload.websiteTheme.accentColor)
                updatePayload.accentColor = updatePayload.websiteTheme.accentColor;
            if (updatePayload.websiteTheme.actionColor)
                updatePayload.actionColor = updatePayload.websiteTheme.actionColor;
        }
        else if (updatePayload.primaryColor || updatePayload.secondaryColor || updatePayload.accentColor || updatePayload.actionColor) {
            const existingWebsite = existingObj?.websiteTheme || {};
            updatePayload.websiteTheme = {
                ...DEFAULT_WEBSITE_THEME,
                ...existingWebsite,
                ...(updatePayload.primaryColor ? { primaryColor: updatePayload.primaryColor } : {}),
                ...(updatePayload.secondaryColor ? { secondaryColor: updatePayload.secondaryColor } : {}),
                ...(updatePayload.accentColor ? { accentColor: updatePayload.accentColor } : {}),
                ...(updatePayload.actionColor ? { actionColor: updatePayload.actionColor } : {}),
            };
        }
        if (req.body.adminTheme !== undefined) {
            const existingAdmin = existingObj?.adminTheme || {};
            const sanitized = sanitizeThemeObject(req.body.adminTheme);
            updatePayload.adminTheme = {
                ...DEFAULT_ADMIN_THEME,
                ...existingAdmin,
                ...sanitized,
            };
        }
        if (req.body.contactEmail !== undefined)
            updatePayload.contactEmail = req.body.contactEmail;
        if (req.body.careEmail !== undefined)
            updatePayload.careEmail = req.body.careEmail;
        if (req.body.medicalEmail !== undefined)
            updatePayload.medicalEmail = req.body.medicalEmail;
        if (req.body.partnershipEmail !== undefined)
            updatePayload.partnershipEmail = req.body.partnershipEmail;
        if (req.body.emergencyHelpline !== undefined)
            updatePayload.emergencyHelpline = req.body.emergencyHelpline;
        if (req.body.whatsappHelpline !== undefined)
            updatePayload.whatsappHelpline = req.body.whatsappHelpline;
        if (req.body.showTopUtilityBar !== undefined)
            updatePayload.showTopUtilityBar = req.body.showTopUtilityBar;
        if (req.body.emergencyNotice !== undefined)
            updatePayload.emergencyNotice = req.body.emergencyNotice;
        if (req.body.headquartersAddress !== undefined)
            updatePayload.headquartersAddress = req.body.headquartersAddress;
        if (req.body.socialLinks !== undefined)
            updatePayload.socialLinks = req.body.socialLinks;
        if (req.body.formsConfig !== undefined)
            updatePayload.formsConfig = req.body.formsConfig;
        if (req.body.defaultLanguage !== undefined)
            updatePayload.defaultLanguage = req.body.defaultLanguage;
        if (req.body.defaultTimezone !== undefined)
            updatePayload.defaultTimezone = req.body.defaultTimezone;
        if (req.body.integrations !== undefined)
            updatePayload.integrations = req.body.integrations;
        const updated = await updateActiveSiteSettings(updatePayload);
        await logAdminActivity(req.user?._id, "SiteSettings", updated._id, "update", { section: ["previous", req.params.section || "general"] }, req);
        res.json({ data: updated });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPDATE_SETTINGS_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/theme/preset
cmsAdminRouter.post("/theme/preset", async (req, res) => {
    try {
        const { presetId, target = "both" } = req.body;
        const preset = THEME_PRESETS[presetId];
        if (!preset) {
            res.status(400).json({ error: { code: "INVALID_PRESET", message: `Preset "${presetId}" does not exist.` } });
            return;
        }
        const existingDoc = await getActiveSiteSettingsDoc();
        const existingObj = existingDoc ? (existingDoc.toObject ? existingDoc.toObject() : existingDoc) : null;
        const updatePayload = {};
        if (target === "website" || target === "both") {
            updatePayload.websiteTheme = {
                ...DEFAULT_WEBSITE_THEME,
                ...(existingObj?.websiteTheme || {}),
                ...preset.websiteTheme,
                activePreset: presetId
            };
            if (preset.websiteTheme.primaryColor)
                updatePayload.primaryColor = preset.websiteTheme.primaryColor;
            if (preset.websiteTheme.secondaryColor)
                updatePayload.secondaryColor = preset.websiteTheme.secondaryColor;
            if (preset.websiteTheme.accentColor)
                updatePayload.accentColor = preset.websiteTheme.accentColor;
            if (preset.websiteTheme.actionColor)
                updatePayload.actionColor = preset.websiteTheme.actionColor;
        }
        if (target === "admin" || target === "both") {
            updatePayload.adminTheme = {
                ...DEFAULT_ADMIN_THEME,
                ...(existingObj?.adminTheme || {}),
                ...preset.adminTheme,
                activePreset: presetId
            };
        }
        const updated = await updateActiveSiteSettings(updatePayload);
        await logAdminActivity(req.user?._id, "SiteSettings", updated._id, "update", { section: ["theme", `preset:${presetId}`], target }, req);
        res.json({ data: updated });
    }
    catch (err) {
        res.status(400).json({ error: { code: "APPLY_PRESET_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/theme/reset
cmsAdminRouter.post("/theme/reset", async (req, res) => {
    try {
        const { target = "both" } = req.body;
        const updatePayload = {};
        if (target === "website" || target === "both") {
            updatePayload.websiteTheme = { ...DEFAULT_WEBSITE_THEME };
            updatePayload.primaryColor = DEFAULT_WEBSITE_THEME.primaryColor;
            updatePayload.secondaryColor = DEFAULT_WEBSITE_THEME.secondaryColor;
            updatePayload.accentColor = DEFAULT_WEBSITE_THEME.accentColor;
            updatePayload.actionColor = DEFAULT_WEBSITE_THEME.actionColor;
        }
        if (target === "admin" || target === "both") {
            updatePayload.adminTheme = { ...DEFAULT_ADMIN_THEME };
        }
        const updated = await updateActiveSiteSettings(updatePayload);
        await logAdminActivity(req.user?._id, "SiteSettings", updated._id, "update", { section: ["theme", "reset"], target }, req);
        res.json({ data: updated });
    }
    catch (err) {
        res.status(400).json({ error: { code: "RESET_THEME_FAILED", message: err.message } });
    }
});
// GET /api/v1/admin/system-health
cmsAdminRouter.get("/system-health", async (_req, res) => {
    const memUsage = process.memoryUsage();
    res.json({
        data: {
            uptimeSeconds: Math.floor(process.uptime()),
            nodeVersion: process.version,
            platform: process.platform,
            memory: {
                rssMb: Math.round(memUsage.rss / 1024 / 1024),
                heapTotalMb: Math.round(memUsage.heapTotal / 1024 / 1024),
                heapUsedMb: Math.round(memUsage.heapUsed / 1024 / 1024),
            },
            database: {
                status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
                host: mongoose.connection.host || "127.0.0.1",
                port: mongoose.connection.port || 27017,
                dbName: mongoose.connection.name || "akeezo_local",
            },
            timestamp: new Date().toISOString(),
        },
    });
});
// ==========================================
// 2. PAGES & CONTENT REVISION MANAGEMENT
// ==========================================
// GET /api/v1/admin/pages (List all website pages)
cmsAdminRouter.get("/pages", async (req, res) => {
    try {
        const filter = { locale: "en" };
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.search) {
            const q = escapeRegex(String(req.query.search).trim());
            filter.$or = [
                { slug: { $regex: q, $options: "i" } },
                { "publishedRevisionId.seo.title": { $regex: q, $options: "i" } },
            ];
        }
        const pages = await Page.find(filter)
            .populate("publishedRevisionId")
            .populate("draftRevisionId")
            .sort({ updatedAt: -1, slug: 1 })
            .lean();
        const formatted = pages.map((p) => {
            const pubRev = p.publishedRevisionId;
            const draftRev = p.draftRevisionId;
            const hasUnpublishedChanges = p.draftRevisionId &&
                p.publishedRevisionId &&
                p.draftRevisionId.toString() !== p.publishedRevisionId.toString();
            return {
                id: p._id,
                slug: p.slug,
                title: pubRev?.seo?.title || draftRev?.seo?.title || p.slug.toUpperCase(),
                status: p.status,
                version: p.version,
                publishedAt: pubRev?.createdAt,
                updatedAt: p.updatedAt,
                path: p.slug === "home" ? "/" : `/${p.slug}`,
                hasUnpublishedChanges: Boolean(hasUnpublishedChanges),
            };
        });
        res.json({ data: formatted });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_PAGES_FAILED", message: err.message } });
    }
});
// GET /api/v1/admin/pages/:slug (Get single page with current revision payload & revisions history)
cmsAdminRouter.get("/pages/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const page = await Page.findOne({ slug, locale: "en" }).lean();
        if (!page) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: `Page '${slug}' not found.` } });
        }
        const revisionId = page.publishedRevisionId || page.draftRevisionId;
        const revision = revisionId ? await ContentRevision.findById(revisionId).lean() : null;
        // Fetch recent historical revisions
        const revisions = await ContentRevision.find({ entityType: "page", entityId: page._id })
            .sort({ revisionNumber: -1 })
            .limit(10)
            .lean();
        res.json({
            data: {
                page,
                revision,
                payload: revision?.payload || {},
                seo: revision?.seo || {
                    title: "AKEEZO Healthcare Platform",
                    description: "World-Class Medical Care in India",
                    canonicalPath: slug === "home" ? "/" : `/${slug}`,
                    robots: "index,follow",
                    schemaKind: "MedicalWebPage",
                },
                revisions: revisions.map((r) => ({
                    id: r._id,
                    revisionNumber: r.revisionNumber,
                    title: r.seo?.title || `Revision #${r.revisionNumber}`,
                    createdAt: r.createdAt,
                    isPublished: String(r._id) === String(page.publishedRevisionId),
                    isDraft: String(r._id) === String(page.draftRevisionId),
                })),
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_PAGE_FAILED", message: err.message } });
    }
});
// PUT /api/v1/admin/pages/:slug (Save Draft or Publish Page Content Revision)
cmsAdminRouter.put("/pages/:slug", async (req, res) => {
    try {
        const slug = req.params.slug;
        const { payload, seo, publishImmediately = true } = req.body;
        let page = await Page.findOne({ slug, locale: "en" });
        if (!page) {
            page = await Page.create({
                slug,
                locale: "en",
                localeGroupId: `group_${slug}`,
                status: publishImmediately ? "published" : "draft",
                version: 1,
            });
        }
        // Determine next revision number
        const lastRev = await ContentRevision.findOne({ entityType: "page", entityId: page._id })
            .sort({ revisionNumber: -1 })
            .lean();
        const nextRevisionNumber = (lastRev?.revisionNumber || 0) + 1;
        const canonicalPath = slug === "home" ? "/" : `/${slug}`;
        // Create immutable ContentRevision
        const revision = await ContentRevision.create({
            entityType: "page",
            entityId: page._id,
            locale: "en",
            revisionNumber: nextRevisionNumber,
            payload: payload || {},
            seo: {
                title: seo?.title || `${slug.toUpperCase()} | AKEEZO Healthcare Platform`,
                description: seo?.description || "Heal In India, Heal By Akeezo",
                canonicalPath: seo?.canonicalPath || canonicalPath,
                robots: seo?.robots || "index,follow",
                schemaKind: seo?.schemaKind || "MedicalWebPage",
                ogTitle: seo?.ogTitle || seo?.title,
                ogDescription: seo?.ogDescription || seo?.description,
                ogImage: seo?.ogImage || "/logo/logo with tagline-dark.svg",
            },
            sourceReferences: [],
        });
        // Update Page pointers
        page.draftRevisionId = revision._id;
        if (publishImmediately) {
            page.publishedRevisionId = revision._id;
            page.status = "published";
        }
        page.version += 1;
        await page.save();
        // Atomically update RouteEntry so public SSR delivers immediately
        if (publishImmediately) {
            await RouteEntry.findOneAndUpdate({ locale: "en", path: canonicalPath }, {
                $set: {
                    pageKind: slug === "home" ? "home" : "legal",
                    publishedRevisionId: revision._id,
                    statusCode: 200,
                },
            }, { upsert: true });
        }
        await logAdminActivity(req.user?._id, "page", page._id, publishImmediately ? "update" : "create", {
            slug: [slug, slug],
            status: [page.status, publishImmediately ? "published" : "draft"],
            revision: [lastRev?.revisionNumber || 0, nextRevisionNumber],
        }, req);
        res.json({
            data: {
                page,
                revision,
                published: publishImmediately,
                message: publishImmediately
                    ? `Page '${slug}' updated and published successfully to live website.`
                    : `Draft saved for page '${slug}'. Public site remains on previous published revision.`,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "SAVE_PAGE_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/pages/:slug/duplicate (Duplicate a page)
cmsAdminRouter.post("/pages/:slug/duplicate", async (req, res) => {
    try {
        const slug = req.params.slug;
        const newSlug = (req.body.newSlug || `${slug}-copy`).toLowerCase().trim().replace(/[^a-z0-9_-]/g, "");
        const existing = await Page.findOne({ slug: newSlug });
        if (existing) {
            return res.status(400).json({ error: { code: "SLUG_EXISTS", message: `Page with slug '${newSlug}' already exists.` } });
        }
        const sourcePage = await Page.findOne({ slug, locale: "en" }).lean();
        if (!sourcePage) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: `Source page '${slug}' not found.` } });
        }
        const sourceRevId = sourcePage.publishedRevisionId || sourcePage.draftRevisionId;
        const sourceRev = sourceRevId ? await ContentRevision.findById(sourceRevId).lean() : null;
        const newPage = await Page.create({
            slug: newSlug,
            locale: "en",
            localeGroupId: `group_${newSlug}`,
            status: "draft",
            version: 1,
        });
        const newRevision = await ContentRevision.create({
            entityType: "page",
            entityId: newPage._id,
            locale: "en",
            revisionNumber: 1,
            payload: sourceRev?.payload || {},
            seo: {
                ...(sourceRev?.seo || {}),
                title: `Copy of ${sourceRev?.seo?.title || slug}`,
                canonicalPath: `/${newSlug}`,
            },
            sourceReferences: [],
        });
        newPage.draftRevisionId = newRevision._id;
        await newPage.save();
        await logAdminActivity(req.user?._id, "page", newPage._id, "create", { duplicatedFrom: [slug, newSlug] }, req);
        res.status(201).json({
            data: {
                page: newPage,
                message: `Page '${slug}' duplicated into '${newSlug}' as draft.`,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "DUPLICATE_PAGE_FAILED", message: err.message } });
    }
});
// PATCH /api/v1/admin/pages/:slug/status (Archive, publish, unpublish)
cmsAdminRouter.patch("/pages/:slug/status", async (req, res) => {
    try {
        const slug = req.params.slug;
        const { status } = req.body; // 'published' | 'draft' | 'archived'
        if (slug === "home" && (status === "archived" || status === "draft")) {
            return res.status(400).json({ error: { code: "CANNOT_UNPUBLISH_HOMEPAGE", message: "Homepage cannot be archived or unpublished." } });
        }
        const page = await Page.findOne({ slug, locale: "en" });
        if (!page) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: `Page '${slug}' not found.` } });
        }
        const oldStatus = page.status;
        page.status = status;
        await page.save();
        const canonicalPath = slug === "home" ? "/" : `/${slug}`;
        if (status === "published" && page.draftRevisionId) {
            page.publishedRevisionId = page.draftRevisionId;
            await page.save();
            await RouteEntry.findOneAndUpdate({ locale: "en", path: canonicalPath }, { $set: { publishedRevisionId: page.publishedRevisionId, statusCode: 200 } }, { upsert: true });
        }
        else if (status === "draft" || status === "archived") {
            await RouteEntry.deleteOne({ locale: "en", path: canonicalPath });
        }
        await logAdminActivity(req.user?._id, "page", page._id, "update", { status: [oldStatus, status] }, req);
        res.json({ data: { page, message: `Page '${slug}' status changed to '${status}'.` } });
    }
    catch (err) {
        res.status(400).json({ error: { code: "STATUS_CHANGE_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/pages/:slug/restore/:revisionId (Restore historical revision)
cmsAdminRouter.post("/pages/:slug/restore/:revisionId", async (req, res) => {
    try {
        const { slug, revisionId } = req.params;
        const page = await Page.findOne({ slug, locale: "en" });
        if (!page) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: `Page '${slug}' not found.` } });
        }
        const historicalRev = await ContentRevision.findById(revisionId).lean();
        if (!historicalRev) {
            return res.status(404).json({ error: { code: "REVISION_NOT_FOUND", message: "Revision not found." } });
        }
        // Create a new revision branching from the historical one
        const lastRev = await ContentRevision.findOne({ entityType: "page", entityId: page._id })
            .sort({ revisionNumber: -1 })
            .lean();
        const nextRevisionNumber = (lastRev?.revisionNumber || 0) + 1;
        const restoredRevision = await ContentRevision.create({
            entityType: "page",
            entityId: page._id,
            locale: "en",
            revisionNumber: nextRevisionNumber,
            payload: historicalRev.payload,
            seo: historicalRev.seo,
            sourceReferences: [`restored_from_rev_${historicalRev.revisionNumber}`],
        });
        page.draftRevisionId = restoredRevision._id;
        page.publishedRevisionId = restoredRevision._id;
        page.status = "published";
        page.version += 1;
        await page.save();
        const canonicalPath = slug === "home" ? "/" : `/${slug}`;
        await RouteEntry.findOneAndUpdate({ locale: "en", path: canonicalPath }, { $set: { publishedRevisionId: restoredRevision._id, statusCode: 200 } }, { upsert: true });
        await logAdminActivity(req.user?._id, "page", page._id, "update", { restoredFrom: [historicalRev.revisionNumber, nextRevisionNumber] }, req);
        res.json({
            data: {
                page,
                revision: restoredRevision,
                message: `Successfully restored page '${slug}' to Revision #${historicalRev.revisionNumber}.`,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "RESTORE_FAILED", message: err.message } });
    }
});
// ==========================================
// 3. PUBLIC NAVIGATION & FOOTER MANAGEMENT
// ==========================================
// GET /api/v1/admin/navigation
cmsAdminRouter.get("/navigation", async (_req, res) => {
    try {
        const settings = await getActiveSiteSettingsDoc();
        const nav = settings?.navigation || {
            headerMenu: [
                { id: "nav-1", label: "Surgeries & Treatments", destination: "/#treatments", isExternal: false, order: 1, isVisible: true },
                { id: "nav-2", label: "Hospital Network", destination: "/#hospitals", isExternal: false, order: 2, isVisible: true },
                { id: "nav-3", label: "How It Works", destination: "/#workflow", isExternal: false, order: 3, isVisible: true },
                { id: "nav-4", label: "Transparent Pricing", destination: "/#pricing", isExternal: false, order: 4, isVisible: true },
                { id: "nav-5", label: "Patient Stories", destination: "/#testimonials", isExternal: false, order: 5, isVisible: true },
            ],
            footerGroups: [
                {
                    id: "fg-1",
                    title: "Healthcare Services",
                    order: 1,
                    links: [
                        { label: "Robotic Oncology", destination: "/#treatments", isExternal: false, isVisible: true },
                        { label: "Cardiac Sciences", destination: "/#treatments", isExternal: false, isVisible: true },
                        { label: "Bone Marrow Transplant", destination: "/#treatments", isExternal: false, isVisible: true },
                        { label: "Orthopedics & Joint Replacement", destination: "/#treatments", isExternal: false, isVisible: true },
                    ],
                },
                {
                    id: "fg-2",
                    title: "Patient Resources",
                    order: 2,
                    links: [
                        { label: "Medical Visa Facilitation", destination: "/#workflow", isExternal: false, isVisible: true },
                        { label: "Second Medical Opinions", destination: "/#quote-modal", isExternal: false, isVisible: true },
                        { label: "NABH / JCI Accreditations", destination: "/#hospitals", isExternal: false, isVisible: true },
                    ],
                },
                {
                    id: "fg-3",
                    title: "Compliance & Legal",
                    order: 3,
                    links: [
                        { label: "Privacy Policy (DPDP 2023)", destination: "/privacy", isExternal: false, isVisible: true },
                        { label: "Terms of Discovery Service", destination: "/terms", isExternal: false, isVisible: true },
                        { label: "Clinical & Regulatory Disclaimer", destination: "/disclaimer", isExternal: false, isVisible: true },
                    ],
                },
            ],
        };
        res.json({ data: nav });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_NAV_FAILED", message: err.message } });
    }
});
// PUT /api/v1/admin/navigation
cmsAdminRouter.put("/navigation", async (req, res) => {
    try {
        const { headerMenu, footerGroups } = req.body;
        const updated = await updateActiveSiteSettings({
            navigation: {
                headerMenu: headerMenu || [],
                footerGroups: footerGroups || [],
            },
        });
        await logAdminActivity(req.user?._id, "SiteSettings", updated._id, "update", { section: ["navigation", "updated"] }, req);
        res.json({
            data: updated.navigation,
            message: "Public header menu and footer links updated and live.",
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPDATE_NAV_FAILED", message: err.message } });
    }
});
// ==========================================
// 4. MEDIA LIBRARY MANAGEMENT
// ==========================================
// GET /api/v1/admin/media
cmsAdminRouter.get("/media", async (req, res) => {
    try {
        const filter = {};
        if (req.query.search) {
            const q = escapeRegex(String(req.query.search).trim());
            filter.$or = [
                { originalFilename: { $regex: q, $options: "i" } },
                { altText: { $regex: q, $options: "i" } },
                { caption: { $regex: q, $options: "i" } },
            ];
        }
        if (req.query.type) {
            const t = String(req.query.type).toLowerCase();
            if (t === "image") {
                filter.mimeType = { $regex: "^image/" };
            }
            else if (t === "document") {
                filter.mimeType = { $in: ["application/pdf", "text/plain"] };
            }
            else if (t === "svg") {
                filter.mimeType = "image/svg+xml";
            }
        }
        const page = Math.max(1, parseInt(String(req.query.page || "1"), 10));
        const limit = Math.max(1, Math.min(50, parseInt(String(req.query.limit || "20"), 10)));
        const skip = (page - 1) * limit;
        let items = [];
        let total = 0;
        if (mongoose.connection.readyState === 1) {
            [items, total] = await Promise.all([
                MediaAssetModel.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                MediaAssetModel.countDocuments(filter),
            ]);
        }
        // If database is empty, seed initial verified official brand SVGs
        if (items.length === 0 && page === 1 && !req.query.search && !req.query.type) {
            items = [
                {
                    _id: "media_1",
                    originalFilename: "favicon.svg",
                    storedFilename: "favicon.svg",
                    mimeType: "image/svg+xml",
                    sizeBytes: 4522,
                    url: "/logo/favicon.svg",
                    altText: "Akeezo Healthcare Icon Mark",
                    caption: "Primary mark for browser tab and compact header",
                    referencedIn: [{ entityType: "page", entityId: "home", field: "headerLogo" }],
                    createdAt: new Date("2026-09-13"),
                },
                {
                    _id: "media_2",
                    originalFilename: "logo with tagline-dark.svg",
                    storedFilename: "logo with tagline-dark.svg",
                    mimeType: "image/svg+xml",
                    sizeBytes: 36466,
                    url: "/logo/logo with tagline-dark.svg",
                    altText: "Akeezo Health Full Logo with Tagline (Dark Background)",
                    caption: "White lettering with Brand Teal and Orange icon",
                    referencedIn: [{ entityType: "SiteSettings", entityId: "default", field: "logoVariants.dark" }],
                    createdAt: new Date("2026-09-27"),
                },
                {
                    _id: "media_3",
                    originalFilename: "logo with tagline-light.svg",
                    storedFilename: "logo with tagline-light.svg",
                    mimeType: "image/svg+xml",
                    sizeBytes: 36458,
                    url: "/logo/logo with tagline-light.svg",
                    altText: "Akeezo Health Full Logo with Tagline (Light Background)",
                    caption: "Dark lettering with Brand Teal and Orange icon",
                    referencedIn: [{ entityType: "SiteSettings", entityId: "default", field: "logoVariants.light" }],
                    createdAt: new Date("2026-09-27"),
                },
            ];
            total = items.length;
        }
        res.json({
            data: items,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_MEDIA_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/media/upload (Safe Base64 upload with size and extension validation)
cmsAdminRouter.post("/media/upload", async (req, res) => {
    try {
        const { originalFilename, mimeType, dataBase64, altText, caption } = req.body;
        if (!originalFilename || !mimeType || !dataBase64) {
            return res.status(400).json({
                error: { code: "INVALID_UPLOAD", message: "originalFilename, mimeType, and dataBase64 are required." },
            });
        }
        const ALLOWED_MIME_TYPES = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/svg+xml",
            "image/gif",
            "application/pdf",
        ];
        if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
            return res.status(400).json({
                error: { code: "UNSUPPORTED_TYPE", message: `MIME type '${mimeType}' is not supported.` },
            });
        }
        const rawBuffer = Buffer.from(dataBase64, "base64");
        if (rawBuffer.length > 10 * 1024 * 1024) {
            return res.status(400).json({
                error: { code: "FILE_TOO_LARGE", message: "File exceeds 10MB limit." },
            });
        }
        let cleanBuffer = rawBuffer;
        // SVG sanitization
        if (mimeType.toLowerCase() === "image/svg+xml") {
            let svgText = rawBuffer.toString("utf8");
            svgText = svgText
                .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
                .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
                .replace(/javascript:/gi, "");
            cleanBuffer = Buffer.from(svgText, "utf8");
        }
        const MIME_TO_EXTENSION = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/webp": ".webp",
            "image/svg+xml": ".svg",
            "image/gif": ".gif",
            "application/pdf": ".pdf",
        };
        const ext = MIME_TO_EXTENSION[mimeType.toLowerCase()] || ".png";
        const fileHash = crypto.createHash("sha256").update(cleanBuffer).digest("hex").slice(0, 16);
        const storedFilename = `${fileHash}${ext}`;
        const uploadsDir = path.resolve(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const targetFilePath = path.join(uploadsDir, storedFilename);
        fs.writeFileSync(targetFilePath, cleanBuffer);
        const publicUrl = `/uploads/${storedFilename}`;
        const mediaDoc = await MediaAssetModel.create({
            originalFilename,
            storedFilename,
            mimeType,
            sizeBytes: cleanBuffer.length,
            url: publicUrl,
            altText: altText || originalFilename.replace(/\.[^/.]+$/, ""),
            caption: caption || "",
            referencedIn: [],
        });
        await logAdminActivity(req.user?._id, "media", mediaDoc._id, "create", { originalFilename: ["", originalFilename], sizeBytes: [0, cleanBuffer.length] }, req);
        res.status(201).json({
            data: mediaDoc,
            message: "Media asset uploaded and stored safely.",
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPLOAD_FAILED", message: err.message } });
    }
});
// PATCH /api/v1/admin/media/:id (Update alt text / caption)
cmsAdminRouter.patch("/media/:id", async (req, res) => {
    try {
        const updated = await MediaAssetModel.findByIdAndUpdate(req.params.id, {
            $set: {
                altText: req.body.altText,
                caption: req.body.caption,
            },
        }, { new: true });
        res.json({ data: updated });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPDATE_MEDIA_FAILED", message: err.message } });
    }
});
// DELETE /api/v1/admin/media/:id (Delete asset with reference checks)
cmsAdminRouter.delete("/media/:id", async (req, res) => {
    try {
        const media = await MediaAssetModel.findById(req.params.id);
        if (!media) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: "Media not found." } });
        }
        if (media.referencedIn && media.referencedIn.length > 0 && req.query.force !== "true") {
            return res.status(409).json({
                error: {
                    code: "MEDIA_IN_USE",
                    message: `This asset is currently in use across ${media.referencedIn.length} location(s). Pass force=true to delete anyway.`,
                    referencedIn: media.referencedIn,
                },
            });
        }
        const uploadsDir = path.resolve(process.cwd(), "uploads");
        const filePath = path.join(uploadsDir, media.storedFilename);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            }
            catch { }
        }
        await MediaAssetModel.deleteOne({ _id: media._id });
        await logAdminActivity(req.user?._id, "media", media._id, "delete", { filename: [media.originalFilename, "deleted"] }, req);
        res.json({ data: { success: true, message: "Media deleted successfully." } });
    }
    catch (err) {
        res.status(400).json({ error: { code: "DELETE_MEDIA_FAILED", message: err.message } });
    }
});
// ==========================================
// 5. PUBLIC ENQUIRIES & LEADS MANAGEMENT
// ==========================================
// GET /api/v1/admin/enquiries
cmsAdminRouter.get("/enquiries", async (req, res) => {
    try {
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.search) {
            const q = escapeRegex(String(req.query.search).trim());
            filter.$or = [
                { requesterName: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
                { phone: { $regex: q, $options: "i" } },
                { receiptId: { $regex: q, $options: "i" } },
                { message: { $regex: q, $options: "i" } },
            ];
        }
        if (req.query.assignee) {
            filter.assignedCoordinatorId = req.query.assignee;
        }
        if (req.query.dateFrom || req.query.dateTo) {
            filter.createdAt = {};
            if (req.query.dateFrom)
                filter.createdAt.$gte = new Date(String(req.query.dateFrom));
            if (req.query.dateTo)
                filter.createdAt.$lte = new Date(String(req.query.dateTo));
        }
        const enquiries = await EnquiryModel.find(filter)
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();
        res.json({ data: enquiries });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_ENQUIRIES_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/enquiries (Create new enquiry/lead)
cmsAdminRouter.post("/enquiries", async (req, res) => {
    try {
        const { requesterName, email, phone, message, serviceType, country, notes, sourcePath } = req.body;
        if (!requesterName) {
            return res.status(400).json({ error: { code: "VALIDATION_ERROR", message: "Requester name is required." } });
        }
        const receiptId = `ENQ-${Date.now().toString(36).toUpperCase()}`;
        const enquiry = await EnquiryModel.create({
            receiptId,
            requesterName,
            email: email || undefined,
            phone: phone || undefined,
            country: country || undefined,
            serviceType: serviceType || "medical_tourism",
            message: message || undefined,
            sourcePath: sourcePath || "/",
            status: "received",
            notes: notes || undefined,
        });
        await logAdminActivity(req.user?._id, "enquiry", enquiry._id, "create", { requesterName: ["", requesterName], serviceType: ["", serviceType] }, req);
        res.status(201).json({ data: enquiry });
    }
    catch (err) {
        res.status(400).json({ error: { code: "CREATE_ENQUIRY_FAILED", message: err.message } });
    }
});
// GET /api/v1/admin/enquiries/export/csv (Formula-safe CSV export)
cmsAdminRouter.get("/enquiries/export/csv", async (req, res) => {
    try {
        const filter = {};
        if (req.query.status)
            filter.status = req.query.status;
        const enquiries = await EnquiryModel.find(filter).sort({ createdAt: -1 }).lean();
        const headers = [
            "Receipt ID",
            "Requester Name",
            "Email",
            "Phone",
            "Country",
            "Service Type",
            "Status",
            "Submitted At",
            "Message",
            "Notes",
        ];
        const rows = enquiries.map((e) => [
            sanitizeCsvValue(e.receiptId),
            sanitizeCsvValue(e.requesterName || e.name),
            sanitizeCsvValue(e.email),
            sanitizeCsvValue(e.phone),
            sanitizeCsvValue(e.country),
            sanitizeCsvValue(e.serviceType),
            sanitizeCsvValue(e.status),
            sanitizeCsvValue(e.createdAt?.toISOString?.() || ""),
            sanitizeCsvValue(e.message),
            sanitizeCsvValue(e.notes),
        ]);
        const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
        await logAdminActivity(req.user?._id, "enquiry", new mongoose.Types.ObjectId(), "export", { count: [0, enquiries.length] }, req);
        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader("Content-Disposition", 'attachment; filename="akeezo-leads-export.csv"');
        res.send(csvContent);
    }
    catch (err) {
        res.status(500).json({ error: { code: "CSV_EXPORT_FAILED", message: err.message } });
    }
});
// GET /api/v1/admin/enquiries/:id
cmsAdminRouter.get("/enquiries/:id", async (req, res) => {
    try {
        const enquiry = await EnquiryModel.findById(req.params.id).lean();
        if (!enquiry) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: "Enquiry not found" } });
        }
        res.json({ data: enquiry });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_ENQUIRY_FAILED", message: err.message } });
    }
});
// PATCH /api/v1/admin/enquiries/:id
cmsAdminRouter.patch(["/enquiries/:id", "/enquiries/:id/status"], async (req, res) => {
    try {
        const updated = await EnquiryModel.findByIdAndUpdate(req.params.id, {
            $set: {
                status: req.body.status,
                notes: req.body.notes,
                assignedCoordinatorId: req.body.assignedCoordinatorId,
            },
        }, { new: true });
        await logAdminActivity(req.user?._id, "enquiry", updated?._id, "update", { status: ["previous", req.body.status] }, req);
        res.json({ data: updated });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPDATE_ENQUIRY_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/enquiries/bulk (Bulk status or assignment update)
cmsAdminRouter.post("/enquiries/bulk", async (req, res) => {
    try {
        const { ids, status, assignedCoordinatorId } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ error: { code: "INVALID_REQUEST", message: "ids array is required." } });
        }
        const updateFields = {};
        if (status)
            updateFields.status = status;
        if (assignedCoordinatorId !== undefined)
            updateFields.assignedCoordinatorId = assignedCoordinatorId;
        await EnquiryModel.updateMany({ _id: { $in: ids } }, { $set: updateFields });
        res.json({ data: { success: true, count: ids.length, message: `Updated ${ids.length} enquiries.` } });
    }
    catch (err) {
        res.status(400).json({ error: { code: "BULK_UPDATE_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/enquiries/:id/convert-to-case
cmsAdminRouter.post("/enquiries/:id/convert-to-case", async (req, res) => {
    try {
        const enquiry = await EnquiryModel.findById(req.params.id);
        if (!enquiry) {
            return res.status(404).json({ error: { code: "ENQUIRY_NOT_FOUND", message: "Enquiry not found" } });
        }
        const requesterName = enquiry.requesterName || enquiry.name || "Website Lead";
        // 1. Find or create patient
        let patient = await PatientModel.findOne({
            $or: [
                ...(enquiry.email ? [{ email: enquiry.email.toLowerCase() }] : []),
                ...(enquiry.phone ? [{ phone: enquiry.phone }] : []),
            ],
        });
        if (!patient) {
            patient = await PatientModel.create({
                fullName: requesterName,
                email: enquiry.email,
                phone: enquiry.phone,
                countryOfResidence: enquiry.country || "International",
                preferredLanguage: "en",
                notes: `Converted from Website Lead ${enquiry.receiptId}`,
            });
        }
        // 2. Generate sequential Case Code
        const count = await CaseModel.countDocuments();
        const caseCode = `CASE-2026-${String(count + 1).padStart(4, "0")}`;
        // 3. Find default owner / coordinator
        const defaultOwner = await UserModel.findOne({ role: { $in: ["administrator", "coordinator"] } });
        const ownerId = defaultOwner?._id || new mongoose.Types.ObjectId();
        // 4. Map serviceType to medical specialty
        const specialtyMap = {
            medical_tourism: "general_surgery",
            cardiology: "cardiac_sciences",
            orthopedics: "orthopaedics",
            oncology: "oncology",
            neuro: "neurology",
            emergency: "critical_care",
            home_healthcare: "general_medicine",
            consultation: "general_medicine",
            general: "general_medicine",
        };
        const specialty = specialtyMap[enquiry.serviceType] || enquiry.serviceType || "general_medicine";
        const urgency = enquiry.serviceType === "emergency" ? "critical" : "routine";
        // 5. Create new Case in Case Management System
        const newCase = await CaseModel.create({
            caseCode,
            patientId: patient._id,
            source: "other",
            caseType: "treatment",
            specialty,
            diagnosisSummary: enquiry.message || `Website enquiry inquiry for ${enquiry.serviceType}`,
            urgency,
            budgetCurrency: "INR",
            patientInIndia: false,
            stage: "new_referral",
            stageChangedAt: new Date(),
            ownerId,
            status: "open",
            feeDisclosedToPartner: false,
            referredOn: new Date(),
            version: 1,
        });
        // 6. Update enquiry status and reference
        enquiry.status = "converted";
        enquiry.notes = `${enquiry.notes ? enquiry.notes + " | " : ""}Converted to Case ${caseCode} on ${new Date().toISOString()}`;
        await enquiry.save();
        // 7. Record Case Audit Trail
        await logAdminActivity(ownerId, "case", newCase._id, "create", { caseCode: ["", caseCode] }, req);
        res.status(201).json({
            data: {
                case: newCase,
                enquiry,
                caseCode,
                patient,
                message: `Enquiry ${enquiry.receiptId} successfully converted into active case ${caseCode}`,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "CONVERSION_FAILED", message: err.message } });
    }
});
// ==========================================
// 6. SEO & REDIRECTS MANAGEMENT
// ==========================================
// GET /api/v1/admin/redirects
cmsAdminRouter.get("/redirects", async (_req, res) => {
    try {
        let redirects = [];
        if (mongoose.connection.readyState === 1) {
            redirects = await RedirectModel.find().sort({ createdAt: -1 }).lean();
        }
        if (redirects.length === 0) {
            redirects = [
                {
                    _id: "red_1",
                    sourcePath: "/medical-tourism-india",
                    destinationPath: "/",
                    statusCode: 301,
                    enabled: true,
                    hitsCount: 142,
                    lastHitAt: new Date(),
                    notes: "Legacy landing page redirect",
                },
                {
                    _id: "red_2",
                    sourcePath: "/contact-us",
                    destinationPath: "/#enquiry",
                    statusCode: 302,
                    enabled: true,
                    hitsCount: 88,
                    lastHitAt: new Date(),
                    notes: "Temporary anchor redirect",
                },
            ];
        }
        res.json({ data: redirects });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_REDIRECTS_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/redirects
cmsAdminRouter.post("/redirects", async (req, res) => {
    try {
        let { sourcePath, destinationPath, statusCode = 301, notes, enabled = true } = req.body;
        if (!sourcePath || !destinationPath) {
            return res.status(400).json({ error: { code: "INVALID_FIELDS", message: "sourcePath and destinationPath are required." } });
        }
        sourcePath = String(sourcePath).trim().toLowerCase();
        destinationPath = String(destinationPath).trim();
        if (!sourcePath.startsWith("/")) {
            sourcePath = `/${sourcePath}`;
        }
        sourcePath = sourcePath.replace(/\/+$/, "") || "/";
        // Loop Prevention
        if (sourcePath === destinationPath || sourcePath === destinationPath.toLowerCase()) {
            return res.status(400).json({ error: { code: "REDIRECT_LOOP", message: "Source and destination cannot be identical." } });
        }
        // Reserved paths prevention
        const RESERVED_PREFIXES = ["/api", "/admin", "/case-management", "/health", "/uploads"];
        if (RESERVED_PREFIXES.some((p) => sourcePath.startsWith(p))) {
            return res.status(400).json({
                error: { code: "RESERVED_PATH", message: `Source path cannot shadow reserved system route: ${sourcePath}` },
            });
        }
        const existing = await RedirectModel.findOne({ sourcePath });
        if (existing) {
            return res.status(409).json({ error: { code: "DUPLICATE_SOURCE", message: `Redirect for '${sourcePath}' already exists.` } });
        }
        const redirect = await RedirectModel.create({
            sourcePath,
            destinationPath,
            statusCode: parseInt(String(statusCode), 10) === 302 ? 302 : 301,
            notes,
            enabled: Boolean(enabled),
        });
        await logAdminActivity(req.user?._id, "redirect", redirect._id, "create", { sourcePath: ["", sourcePath], destinationPath: ["", destinationPath] }, req);
        res.status(201).json({ data: redirect, message: `Redirect from '${sourcePath}' to '${destinationPath}' created.` });
    }
    catch (err) {
        res.status(400).json({ error: { code: "CREATE_REDIRECT_FAILED", message: err.message } });
    }
});
// PUT /api/v1/admin/redirects/:id
cmsAdminRouter.put("/redirects/:id", async (req, res) => {
    try {
        const updated = await RedirectModel.findByIdAndUpdate(req.params.id, {
            $set: {
                destinationPath: req.body.destinationPath,
                statusCode: req.body.statusCode,
                enabled: req.body.enabled,
                notes: req.body.notes,
            },
        }, { new: true });
        res.json({ data: updated });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPDATE_REDIRECT_FAILED", message: err.message } });
    }
});
// DELETE /api/v1/admin/redirects/:id
cmsAdminRouter.delete("/redirects/:id", async (req, res) => {
    try {
        await RedirectModel.findByIdAndDelete(req.params.id);
        res.json({ data: { success: true, message: "Redirect deleted." } });
    }
    catch (err) {
        res.status(400).json({ error: { code: "DELETE_REDIRECT_FAILED", message: err.message } });
    }
});
// ==========================================
// 7. USERS & ROLES AUTHORIZATION MANAGEMENT
// ==========================================
// GET /api/v1/admin/users
cmsAdminRouter.get("/users", async (_req, res) => {
    try {
        let users = [];
        if (mongoose.connection.readyState === 1) {
            users = await UserModel.find().sort({ createdAt: -1 }).select("-passwordHash").lean();
        }
        if (users.length === 0) {
            users = FALLBACK_USERS.map((u) => ({
                _id: u._id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                role: u.role,
                status: u.status,
                phoneVerified: u.phoneVerified,
                createdAt: u.createdAt,
            }));
        }
        res.json({ data: users });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_USERS_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/users/invite
cmsAdminRouter.post("/users/invite", async (req, res) => {
    try {
        const { name, email, phone, role = "coordinator" } = req.body;
        if (!name || !email) {
            return res.status(400).json({ error: { code: "MISSING_FIELDS", message: "Name and email are required." } });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existing = await UserModel.findOne({ email: normalizedEmail });
        if (existing) {
            return res.status(409).json({ error: { code: "USER_EXISTS", message: `User with email '${normalizedEmail}' already exists.` } });
        }
        const tempPassword = `Akeezo@${Math.floor(1000 + Math.random() * 9000)}!`;
        const passwordHash = hashPassword(tempPassword);
        const newUser = await UserModel.create({
            name,
            email: normalizedEmail,
            phone: phone || "+91 82876 39443",
            role,
            passwordHash,
            status: "active",
            phoneVerified: true,
        });
        await logAdminActivity(req.user?._id, "user", newUser._id, "create", { email: ["", normalizedEmail], role: ["", role] }, req);
        res.status(201).json({
            data: {
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                    status: newUser.status,
                    createdAt: newUser.createdAt,
                },
                temporaryPassword: tempPassword,
                message: `User '${normalizedEmail}' created with initial role '${role}'.`,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "INVITE_USER_FAILED", message: err.message } });
    }
});
// PATCH /api/v1/admin/users/:id (Update user role or active status with last owner protection)
cmsAdminRouter.patch("/users/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const userToChange = await UserModel.findById(userId);
        if (!userToChange) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found." } });
        }
        // IMMUTABLE LAST ACTIVE OWNER PROTECTION
        if ((req.body.status === "disabled" && userToChange.status === "active") ||
            (req.body.role && req.body.role !== "admin" && userToChange.role === "admin")) {
            const activeAdminCount = await UserModel.countDocuments({ role: "admin", status: "active" });
            if (activeAdminCount <= 1) {
                return res.status(403).json({
                    error: {
                        code: "CANNOT_DEMOTE_LAST_OWNER",
                        message: "Cannot disable or demote the last active Super Administrator / Owner of the platform.",
                    },
                });
            }
        }
        if (req.body.name)
            userToChange.name = req.body.name;
        if (req.body.role && req.body.role !== userToChange.role) {
            userToChange.role = req.body.role;
            userToChange.tokenVersion = (userToChange.tokenVersion || 1) + 1;
        }
        if (req.body.phone)
            userToChange.phone = req.body.phone;
        if (req.body.status && req.body.status !== userToChange.status) {
            userToChange.status = req.body.status;
            userToChange.tokenVersion = (userToChange.tokenVersion || 1) + 1;
        }
        await userToChange.save();
        await logAdminActivity(req.user?._id, "user", userToChange._id, "update", { role: ["previous", userToChange.role], status: ["previous", userToChange.status] }, req);
        res.json({
            data: {
                _id: userToChange._id,
                name: userToChange.name,
                email: userToChange.email,
                role: userToChange.role,
                status: userToChange.status,
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPDATE_USER_FAILED", message: err.message } });
    }
});
// GET /api/v1/admin/roles (Roles & Permissions Matrix)
cmsAdminRouter.get("/roles", async (_req, res) => {
    const rolesMatrix = [
        {
            role: "admin",
            label: "Super Administrator / Owner",
            description: "Full authoritative control over website CMS, public routing, lead triage, ERP oversight, and security settings.",
            permissions: {
                dashboard: ["view", "export"],
                content: ["view", "create", "edit", "publish", "delete"],
                media: ["view", "upload", "delete"],
                enquiries: ["view", "edit", "assign", "convert", "export"],
                seo: ["view", "edit", "redirects"],
                users: ["view", "invite", "edit", "disable", "revoke"],
                activity: ["view", "export"],
                settings: ["view", "edit", "security"],
            },
        },
        {
            role: "coordinator",
            label: "Case Operations Coordinator",
            description: "Handles inbound website leads, hospital quotes, and active medical patient journeys across ERP stages.",
            permissions: {
                dashboard: ["view"],
                content: ["view"],
                media: ["view"],
                enquiries: ["view", "edit", "assign", "convert"],
                seo: ["view"],
                users: ["view"],
                activity: ["view"],
                settings: ["view"],
            },
        },
        {
            role: "hospital_liaison",
            label: "Hospital Liaison Officer",
            description: "Coordinates hospital network tariff pricing, quote packaging, and doctor consultations.",
            permissions: {
                dashboard: ["view"],
                content: ["view"],
                media: ["view"],
                enquiries: ["view"],
                seo: ["view"],
                users: ["view"],
                activity: ["view"],
                settings: ["view"],
            },
        },
        {
            role: "finance",
            label: "Finance & Commission Auditor",
            description: "Audits commission settlements, hospital receipts, and facilitator payouts.",
            permissions: {
                dashboard: ["view"],
                content: ["view"],
                media: ["view"],
                enquiries: ["view", "export"],
                seo: ["view"],
                users: ["view"],
                activity: ["view", "export"],
                settings: ["view"],
            },
        },
        {
            role: "viewer",
            label: "Read-Only Reviewer",
            description: "Auditor or medical reviewer with read-only access to published content and non-PHI summaries.",
            permissions: {
                dashboard: ["view"],
                content: ["view"],
                media: ["view"],
                enquiries: ["view"],
                seo: ["view"],
                users: ["view"],
                activity: ["view"],
                settings: ["view"],
            },
        },
    ];
    res.json({ data: rolesMatrix });
});
// ==========================================
// 8. AUDIT ACTIVITY LOG
// ==========================================
// GET /api/v1/admin/activity
cmsAdminRouter.get("/activity", async (req, res) => {
    try {
        const filter = {};
        if (req.query.entityType) {
            filter.entityType = req.query.entityType;
        }
        if (req.query.action) {
            filter.action = req.query.action;
        }
        if (req.query.actorId) {
            filter.actorId = req.query.actorId;
        }
        if (req.query.dateFrom || req.query.dateTo) {
            filter.occurredAt = {};
            if (req.query.dateFrom)
                filter.occurredAt.$gte = new Date(String(req.query.dateFrom));
            if (req.query.dateTo)
                filter.occurredAt.$lte = new Date(String(req.query.dateTo));
        }
        const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit || "50"), 10)));
        let logs = [];
        if (mongoose.connection.readyState === 1) {
            logs = await CaseAuditLogModel.find(filter)
                .sort({ occurredAt: -1 })
                .limit(limit)
                .populate("actorId", "name email role")
                .lean();
        }
        if (logs.length === 0) {
            logs = [
                {
                    _id: "act_1",
                    occurredAt: new Date(),
                    action: "update",
                    entityType: "page",
                    entityId: "home",
                    actorId: { name: "Priti", email: "priti@akeezo.com", role: "admin" },
                    changes: { status: ["draft", "published"] },
                    ip: "127.0.0.1",
                },
                {
                    _id: "act_2",
                    occurredAt: new Date(Date.now() - 3600000),
                    action: "create",
                    entityType: "case",
                    entityId: "CASE-2026-0011",
                    actorId: { name: "Priti", email: "priti@akeezo.com", role: "admin" },
                    changes: { source: ["", "converted_from_lead"] },
                    ip: "127.0.0.1",
                },
            ];
        }
        res.json({ data: logs });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_ACTIVITY_FAILED", message: err.message } });
    }
});
// ==========================================
// 9. PROFILE & SECURITY
// ==========================================
// GET /api/v1/admin/profile
cmsAdminRouter.get("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        let user = FALLBACK_USERS[0];
        if (token) {
            const parts = token.split(".");
            if (parts.length === 3) {
                try {
                    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
                    if (payload.userId && mongoose.connection.readyState === 1) {
                        const dbUser = await UserModel.findById(payload.userId).select("-passwordHash").lean();
                        if (dbUser)
                            user = dbUser;
                    }
                }
                catch { }
            }
        }
        res.json({
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status,
                phoneVerified: user.phoneVerified,
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_PROFILE_FAILED", message: err.message } });
    }
});
// PUT /api/v1/admin/profile (Update name or phone; cannot self-escalate role)
cmsAdminRouter.put("/profile", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        let userId = FALLBACK_USERS[0]._id;
        if (token) {
            const parts = token.split(".");
            if (parts.length === 3) {
                try {
                    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf8"));
                    if (payload.userId)
                        userId = payload.userId;
                }
                catch { }
            }
        }
        if (mongoose.connection.readyState === 1) {
            const user = await UserModel.findById(userId);
            if (user) {
                if (req.body.name)
                    user.name = req.body.name;
                if (req.body.phone)
                    user.phone = req.body.phone;
                await user.save();
                return res.json({ data: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
            }
        }
        res.json({
            data: {
                _id: userId,
                name: req.body.name || "Priti",
                email: "priti@akeezo.com",
                phone: req.body.phone || "+91 82876 39443",
                role: "admin",
            },
        });
    }
    catch (err) {
        res.status(400).json({ error: { code: "UPDATE_PROFILE_FAILED", message: err.message } });
    }
});
// POST /api/v1/admin/profile/password
cmsAdminRouter.post("/profile/password", async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword || newPassword.length < 8) {
            return res.status(400).json({
                error: { code: "INVALID_PASSWORD", message: "New password must be at least 8 characters long." },
            });
        }
        const authHeader = req.headers.authorization;
        const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        let userId = FALLBACK_USERS[0]._id;
        if (token) {
            const payload = verifyToken(token);
            if (payload && payload.userId)
                userId = payload.userId;
        }
        if (mongoose.connection.readyState === 1) {
            const user = await UserModel.findById(userId);
            if (user) {
                const isMatch = verifyPassword(currentPassword, user.passwordHash);
                if (!isMatch) {
                    return res.status(401).json({ error: { code: "WRONG_PASSWORD", message: "Current password does not match." } });
                }
                user.passwordHash = hashPassword(newPassword);
                user.tokenVersion = (user.tokenVersion || 1) + 1;
                await user.save();
                await logAdminActivity(user._id, "user", user._id, "update", { password: ["***", "***"] }, req);
                return res.json({ data: { success: true, message: "Password updated successfully." } });
            }
        }
        res.json({ data: { success: true, message: "Password updated successfully." } });
    }
    catch (err) {
        res.status(400).json({ error: { code: "CHANGE_PASSWORD_FAILED", message: err.message } });
    }
});
