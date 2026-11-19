import { Router } from "express";
import mongoose from "mongoose";
import { RouteEntry, ContentRevision, Page, SiteSettings, ChangelogModel, BlogPostModel, EnquiryModel, CommunityThreadModel } from "../db/models/index.js";
import { getDoctorDetail, getHospitalDetail, CURATED_COMMUNITY_THREADS, getCommunityThreadBySlug, ALL_DESTINATIONS, getDestinationDetail } from "@akeezo/contracts";
import { toSafeSiteSettings } from "../ssr/renderer.js";
import { SEED_TREATMENTS } from "../seeds/pageCmsSeedData.js";
import { caseManagementRouter } from "./caseManagementRoutes.js";
import { authRouter } from "./authRoutes.js";
import { cmsAdminRouter } from "./cmsAdminRoutes.js";
import { communityRouter } from "./communityRoutes.js";
export const apiRouter = Router();
// Authentication Router
apiRouter.use("/auth", authRouter);
// CMS & Website Frontend Administration Router
apiRouter.use("/admin", cmsAdminRouter);
// Public Community Discussions Router
apiRouter.use("/community", communityRouter);
// Health check
apiRouter.get("/health", (_req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.status(200).json({
        data: {
            status: isDbConnected ? "healthy" : "degraded",
            service: "akeezo-server",
            database: isDbConnected ? "connected" : "disconnected",
            timestamp: new Date().toISOString()
        }
    });
});
// Location and Geo IP resolution endpoint
apiRouter.get("/geo", (req, res) => {
    const countryHeader = req.headers["x-vercel-ip-country"] ||
        req.headers["cf-ipcountry"] ||
        req.headers["x-country-code"] ||
        req.headers["x-real-ip-country"] ||
        "";
    const acceptLang = req.headers["accept-language"] || "";
    const clientIp = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.socket.remoteAddress ||
        "";
    res.status(200).json({
        countryCode: countryHeader ? countryHeader.toUpperCase() : null,
        acceptLanguage: acceptLang,
        clientIp
    });
});
// Helper to fetch directory doctors from Page CMS for siteSettings
async function getDirectoryDoctorsFromDb() {
    if (mongoose.connection.readyState !== 1)
        return undefined;
    try {
        const docPage = await Page.findOne({ slug: "doctors", locale: "en" }).lean();
        if (docPage) {
            const revId = docPage.publishedRevisionId || docPage.draftRevisionId;
            if (revId) {
                const rev = await ContentRevision.findById(revId).lean();
                const docList = rev?.payload?.doctors;
                if (Array.isArray(docList) && docList.length > 0) {
                    return docList
                        .filter((d) => d.active !== false)
                        .slice(0, 8)
                        .map((d) => ({
                        name: d.name,
                        role: d.role || d.designation || d.specialty || "Medical Specialist",
                        experience: d.experience || (d.experienceYears ? `${d.experienceYears}+ Years Exp` : "15+ Years Exp"),
                        slug: d.slug,
                        hospital: d.hospital,
                        image: d.image
                    }));
                }
            }
        }
    }
    catch { }
    return undefined;
}
// Helper to fetch directory hospitals from Page CMS for siteSettings
async function getDirectoryHospitalsFromDb() {
    if (mongoose.connection.readyState !== 1)
        return undefined;
    try {
        const hospPage = await Page.findOne({ slug: "hospitals", locale: "en" }).lean();
        if (hospPage) {
            const revId = hospPage.publishedRevisionId || hospPage.draftRevisionId;
            if (revId) {
                const rev = await ContentRevision.findById(revId).lean();
                const hospList = rev?.payload?.hospitals;
                if (Array.isArray(hospList) && hospList.length > 0) {
                    return hospList
                        .filter((h) => h.active !== false)
                        .slice(0, 8)
                        .map((h) => ({
                        name: h.name,
                        location: h.location || h.city || "New Delhi",
                        city: h.city,
                        country: h.country,
                        accreditation: h.accreditationText || (Array.isArray(h.accreditations) && h.accreditations.length > 0 ? `${h.accreditations.join(" / ")} Accredited Quaternary` : "NABH / JCI Accredited Quaternary"),
                        slug: h.slug,
                        image: h.image
                    }));
                }
            }
        }
    }
    catch { }
    return undefined;
}
// Helper to fetch directory treatments from Page CMS for siteSettings
async function getDirectoryTreatmentsFromDb() {
    if (mongoose.connection.readyState !== 1)
        return undefined;
    try {
        const page = await Page.findOne({ slug: "treatments", locale: "en" }).lean();
        if (page) {
            const revId = page.publishedRevisionId || page.draftRevisionId;
            if (revId) {
                const rev = await ContentRevision.findById(revId).lean();
                const list = rev?.payload?.treatments;
                if (Array.isArray(list) && list.length > 0) {
                    return list
                        .filter((t) => t.active !== false)
                        .slice(0, 8)
                        .map((t) => ({
                        name: t.title || t.name,
                        category: t.category || "Speciality",
                        slug: t.slug,
                        avgCostAbroad: t.avgCostAbroad,
                        avgCostHome: t.avgCostHome,
                        recoveryTime: t.recoveryTime,
                        isTopTreatment: Boolean(t.isTopTreatment),
                        image: t.image
                    }));
                }
            }
        }
    }
    catch { }
    return undefined;
}
// Helper to fetch directory destinations from Page CMS for siteSettings
async function getDirectoryDestinationsFromDb() {
    if (mongoose.connection.readyState !== 1)
        return undefined;
    try {
        const page = await Page.findOne({ slug: "destinations", locale: "en" }).lean();
        if (page) {
            const revId = page.publishedRevisionId || page.draftRevisionId;
            if (revId) {
                const rev = await ContentRevision.findById(revId).lean();
                const list = rev?.payload?.destinations;
                if (Array.isArray(list) && list.length > 0) {
                    return list
                        .filter((d) => d.active !== false)
                        .slice(0, 8)
                        .map((d) => ({
                        country: d.country || d.name,
                        name: d.country || d.name,
                        cityHighlights: d.cityHighlights,
                        savingsPercentage: d.savingsPercentage,
                        hospitalCount: d.hospitalCount,
                        tagline: d.tagline,
                        slug: d.slug,
                        image: d.image
                    }));
                }
            }
        }
    }
    catch { }
    return undefined;
}
// GET /api/v1/site
apiRouter.get("/site", async (_req, res) => {
    try {
        const settingsDoc = mongoose.connection.readyState === 1
            ? (await SiteSettings.findOne({ environment: "development" }).lean()) ||
                (await SiteSettings.findOne().lean())
            : null;
        const [directoryDoctors, directoryHospitals, directoryTreatments, directoryDestinations] = await Promise.all([
            getDirectoryDoctorsFromDb(),
            getDirectoryHospitalsFromDb(),
            getDirectoryTreatmentsFromDb(),
            getDirectoryDestinationsFromDb()
        ]);
        const siteSettings = toSafeSiteSettings({
            ...settingsDoc,
            directoryDoctors,
            directoryHospitals,
            directoryTreatments,
            directoryDestinations
        });
        res.json({ data: siteSettings });
    }
    catch (err) {
        res.json({ data: toSafeSiteSettings(null) });
    }
});
// GET /api/v1/treatments (public directory list synced with Admin CMS)
apiRouter.get("/treatments", async (_req, res) => {
    try {
        let list = [];
        if (mongoose.connection.readyState === 1) {
            const page = await Page.findOne({ slug: "treatments", locale: "en" }).lean();
            if (page) {
                const revId = page.publishedRevisionId || page.draftRevisionId;
                if (revId) {
                    const rev = await ContentRevision.findById(revId).lean();
                    const rawList = rev?.payload?.treatments;
                    if (Array.isArray(rawList) && rawList.length > 0) {
                        list = rawList.filter((t) => t.active !== false);
                    }
                }
            }
        }
        if (list.length === 0) {
            list = SEED_TREATMENTS;
        }
        res.json({ data: list });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_TREATMENTS_FAILED", message: err.message } });
    }
});
export const TREATMENT_SLUG_ALIASES = {
    "ivf-treatment": "ivf-fertility-treatment",
    "cancer-treatment": "oncology-cancer-care",
    "bariatric-surgery": "bariatric-weight-loss-surgery",
    "obesity-bariatric-surgery": "bariatric-weight-loss-surgery",
    "orthopedics": "orthopedic-surgery",
    "dental": "dental-treatment",
};
// GET /api/v1/treatments/:slug (public treatment detail synced with Admin CMS)
apiRouter.get("/treatments/:slug", async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase().trim();
        const aliasSlug = TREATMENT_SLUG_ALIASES[slug] || slug;
        let treatment = null;
        if (mongoose.connection.readyState === 1) {
            const page = await Page.findOne({ slug: "treatments", locale: "en" }).lean();
            if (page) {
                const revId = page.publishedRevisionId || page.draftRevisionId;
                if (revId) {
                    const rev = await ContentRevision.findById(revId).lean();
                    const list = rev?.payload?.treatments;
                    if (Array.isArray(list)) {
                        treatment = list.find((t) => (t.slug === slug || t.slug === aliasSlug || TREATMENT_SLUG_ALIASES[t.slug] === slug) && t.active !== false) || null;
                    }
                }
            }
        }
        if (!treatment) {
            treatment = SEED_TREATMENTS.find((t) => (t.slug === slug || t.slug === aliasSlug || TREATMENT_SLUG_ALIASES[t.slug] === slug)) || null;
        }
        if (!treatment) {
            return res.status(404).json({ error: { code: "NOT_FOUND", message: "Treatment not found" } });
        }
        res.json({ data: treatment });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_TREATMENT_FAILED", message: err.message } });
    }
});
// GET /api/v1/doctors (public directory list)
apiRouter.get("/doctors", async (_req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ data: [] });
        }
        const docPage = await Page.findOne({ slug: "doctors", locale: "en" }).lean();
        let docList = [];
        if (docPage) {
            const revId = docPage.publishedRevisionId || docPage.draftRevisionId;
            if (revId) {
                const rev = await ContentRevision.findById(revId).lean();
                const rawList = rev?.payload?.doctors;
                if (Array.isArray(rawList)) {
                    docList = rawList.filter((d) => d.active !== false);
                }
            }
        }
        res.json({ data: docList });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_DOCTORS_FAILED", message: err.message } });
    }
});
// GET /api/v1/hospitals (public directory list)
apiRouter.get("/hospitals", async (_req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ data: [] });
        }
        const hospPage = await Page.findOne({ slug: "hospitals", locale: "en" }).lean();
        let hospList = [];
        if (hospPage) {
            const revId = hospPage.publishedRevisionId || hospPage.draftRevisionId;
            if (revId) {
                const rev = await ContentRevision.findById(revId).lean();
                const rawList = rev?.payload?.hospitals;
                if (Array.isArray(rawList)) {
                    hospList = rawList.filter((h) => h.active !== false);
                }
            }
        }
        res.json({ data: hospList });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_HOSPITALS_FAILED", message: err.message } });
    }
});
// GET /api/v1/changelogs (public read-only)
apiRouter.get('/changelogs', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ data: [] });
        }
        const filter = {
            status: 'published',
            audience: { $in: ['all', 'public'] },
        };
        if (req.query.category && req.query.category !== 'all') {
            filter.category = req.query.category;
        }
        const limit = Math.max(1, Math.min(50, parseInt(String(req.query.limit || '20'), 10)));
        const items = await ChangelogModel.find(filter)
            .sort({ releaseDate: -1 })
            .limit(limit)
            .lean();
        res.json({ data: items });
    }
    catch (err) {
        res.status(500).json({ error: { code: 'FETCH_PUBLIC_CHANGELOGS_FAILED', message: err.message } });
    }
});
// GET /api/v1/blog (public read-only)
apiRouter.get('/blog', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.json({ data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } });
        }
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;
        const filter = { status: "published" };
        if (req.query.category && req.query.category !== "all") {
            filter.category = req.query.category;
        }
        if (req.query.tag) {
            filter.tags = req.query.tag;
        }
        if (req.query.search) {
            const q = String(req.query.search).trim();
            filter.$or = [
                { title: { $regex: q, $options: "i" } },
                { excerpt: { $regex: q, $options: "i" } },
                { "seo.focusKeyword": { $regex: q, $options: "i" } },
            ];
        }
        const [docs, total] = await Promise.all([
            BlogPostModel.find(filter)
                .select("-content")
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            BlogPostModel.countDocuments(filter),
        ]);
        res.json({
            data: docs,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
        });
    }
    catch (err) {
        res.status(500).json({ error: { code: 'FETCH_BLOG_FAILED', message: err.message } });
    }
});
// GET /api/v1/blog/:slug (public single article)
apiRouter.get('/blog/:slug', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ error: { code: 'DATABASE_UNAVAILABLE', message: 'Database disconnected' } });
        }
        const slug = req.params.slug.trim().toLowerCase();
        const doc = await BlogPostModel.findOneAndUpdate({ slug, status: "published" }, { $inc: { viewsCount: 1 } }, { new: true }).lean();
        if (!doc) {
            return res.status(404).json({ error: { code: 'ARTICLE_NOT_FOUND', message: 'Article not found or not published' } });
        }
        const related = await BlogPostModel.find({
            _id: { $ne: doc._id },
            category: doc.category,
            status: "published",
        })
            .select("title slug excerpt category featuredImage publishedAt estimatedReadTime")
            .limit(3)
            .lean();
        res.json({ data: doc, related });
    }
    catch (err) {
        res.status(500).json({ error: { code: 'FETCH_ARTICLE_FAILED', message: err.message } });
    }
});
// GET /api/v1/route?path=/&locale=en
apiRouter.get("/route", async (req, res) => {
    try {
        const rawPath = typeof req.query.path === "string" ? req.query.path : "/";
        const locale = typeof req.query.locale === "string" ? req.query.locale : "en";
        const normalizedPath = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
        let settingsDoc = null;
        let routeEntry = null;
        let directoryDoctors = undefined;
        let directoryHospitals = undefined;
        let directoryTreatments = undefined;
        let directoryDestinations = undefined;
        if (mongoose.connection.readyState === 1) {
            settingsDoc =
                (await SiteSettings.findOne({ environment: "development" }).lean()) ||
                    (await SiteSettings.findOne().lean());
            routeEntry = await RouteEntry.findOne({ locale, path: normalizedPath }).lean();
            [directoryDoctors, directoryHospitals, directoryTreatments, directoryDestinations] = await Promise.all([
                getDirectoryDoctorsFromDb(),
                getDirectoryHospitalsFromDb(),
                getDirectoryTreatmentsFromDb(),
                getDirectoryDestinationsFromDb()
            ]);
        }
        const siteSettings = toSafeSiteSettings({
            ...settingsDoc,
            directoryDoctors,
            directoryHospitals,
            directoryTreatments,
            directoryDestinations
        });
        if (!routeEntry) {
            if (normalizedPath === "/500") {
                const serverErrorDto = {
                    pageKind: "serverError",
                    path: "/500",
                    locale,
                    seo: {
                        title: "Server Error (500) | AKEEZO Healthcare Platform",
                        description: "Temporary system interruption. Our 24/7 care coordination desk is standing by.",
                        canonicalPath: "/500",
                        robots: "noindex,nofollow",
                        schemaKind: "WebPage"
                    },
                    payload: {},
                    siteSettings,
                    statusCode: 500
                };
                res.status(500).json({ error: { code: "INTERNAL_SERVER_ERROR", message: "Server error state" }, data: serverErrorDto });
                return;
            }
            // Default home route response
            if (normalizedPath === "/") {
                let homePayload = {
                    headline: "World-Class Medical Care in India, Simplified & Guided",
                    tagline: "Heal In India, Heal By Akeezo"
                };
                let homeRevisionId = undefined;
                let homeSeo = {
                    title: "AKEEZO | Heal In India, Heal By Akeezo - Medical Tourism & Treatment in India",
                    description: "Discover accredited Indian hospitals, consult top doctors, and receive guided care coordination and transparent cost estimates.",
                    canonicalPath: "/",
                    robots: "index,follow",
                    schemaKind: "MedicalWebPage"
                };
                if (mongoose.connection.readyState === 1) {
                    try {
                        const homePage = await Page.findOne({ slug: "home", locale: "en" }).lean();
                        if (homePage) {
                            const revId = homePage.publishedRevisionId || homePage.draftRevisionId;
                            if (revId) {
                                const rev = await ContentRevision.findById(revId).lean();
                                if (rev) {
                                    homeRevisionId = rev._id.toString();
                                    if (rev.payload)
                                        homePayload = { ...homePayload, ...rev.payload };
                                    if (rev.seo)
                                        homeSeo = { ...homeSeo, ...rev.seo };
                                }
                            }
                        }
                    }
                    catch { }
                }
                const homeDto = {
                    pageKind: "home",
                    path: "/",
                    locale,
                    seo: homeSeo,
                    payload: homePayload,
                    revisionId: homeRevisionId,
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: homeDto });
                return;
            }
            if (normalizedPath === "/cost-calculator" || normalizedPath === "/calculator") {
                let calcPayload = {};
                let calcRevisionId = undefined;
                let calcSeo = {
                    title: "Surgery Cost Calculator Tool | Save up to 70% | AKEEZO",
                    description: "Compare surgery costs across top medical destinations and accredited international hospitals. Get transparent estimates and connect with world-class surgeons.",
                    canonicalPath: "/cost-calculator",
                    robots: "index,follow",
                    schemaKind: "MedicalWebPage"
                };
                if (mongoose.connection.readyState === 1) {
                    try {
                        const calcPage = await Page.findOne({ slug: "cost-calculator", locale: "en" }).lean();
                        if (calcPage) {
                            const revId = calcPage.publishedRevisionId || calcPage.draftRevisionId;
                            if (revId) {
                                const rev = await ContentRevision.findById(revId).lean();
                                if (rev) {
                                    calcRevisionId = rev._id.toString();
                                    if (rev.payload)
                                        calcPayload = { ...calcPayload, ...rev.payload };
                                    if (rev.seo)
                                        calcSeo = { ...calcSeo, ...rev.seo };
                                }
                            }
                        }
                    }
                    catch { }
                }
                const calculatorDto = {
                    pageKind: "calculatorLanding",
                    path: normalizedPath,
                    locale,
                    seo: calcSeo,
                    payload: calcPayload,
                    revisionId: calcRevisionId,
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: calculatorDto });
                return;
            }
            if (normalizedPath === "/treatments" || normalizedPath.startsWith("/treatments/")) {
                const slug = normalizedPath.startsWith("/treatments/")
                    ? normalizedPath.replace(/^\/treatments\/?/, "").split("/")[0]
                    : "";
                const isDetail = Boolean(slug);
                let fallbackTreatments = [];
                let treatmentsPageRev = null;
                if (mongoose.connection.readyState === 1) {
                    try {
                        const page = await Page.findOne({ slug: "treatments", locale: "en" }).lean();
                        if (page) {
                            const revId = page.publishedRevisionId || page.draftRevisionId;
                            if (revId) {
                                treatmentsPageRev = await ContentRevision.findById(revId).lean();
                                const rawList = treatmentsPageRev?.payload?.treatments;
                                if (Array.isArray(rawList) && rawList.length > 0) {
                                    fallbackTreatments = rawList.filter((t) => t.active !== false);
                                }
                            }
                        }
                    }
                    catch { }
                }
                if (fallbackTreatments.length === 0) {
                    fallbackTreatments = SEED_TREATMENTS;
                }
                if (isDetail) {
                    const aliasSlug = TREATMENT_SLUG_ALIASES[slug] || slug;
                    const treatment = fallbackTreatments.find((t) => t.slug === slug || t.slug === aliasSlug || TREATMENT_SLUG_ALIASES[t.slug] === slug);
                    if (treatment) {
                        const detailDto = {
                            pageKind: "treatmentDetail",
                            path: normalizedPath,
                            locale,
                            seo: {
                                title: `${treatment.title || treatment.name} | Medical Treatment in India | AKEEZO`,
                                description: treatment.description ||
                                    `Explore ${treatment.title || treatment.name} in India. Cost savings up to 70%, top accredited hospitals, and experienced surgeons with AKEEZO.`,
                                canonicalPath: `/treatments/${treatment.slug || slug}`,
                                robots: "index,follow",
                                schemaKind: "MedicalWebPage"
                            },
                            payload: {
                                treatment,
                                slug: treatment.slug || slug,
                                headline: treatment.title || treatment.name,
                                subheadline: treatment.category || "World-class care in India"
                            },
                            siteSettings,
                            statusCode: 200
                        };
                        res.json({ data: detailDto });
                        return;
                    }
                    const notFoundDto = {
                        pageKind: "notFound",
                        path: normalizedPath,
                        locale,
                        seo: {
                            title: "Treatment Not Found | AKEEZO Healthcare Platform",
                            description: "The requested medical treatment could not be located. Explore our comprehensive medical treatments directory.",
                            canonicalPath: "/treatments",
                            robots: "noindex,nofollow",
                            schemaKind: "WebPage"
                        },
                        payload: {},
                        siteSettings,
                        statusCode: 404
                    };
                    res.status(404).json({ error: { code: "NOT_FOUND", message: "Treatment not found" }, data: notFoundDto });
                    return;
                }
                const treatmentsDto = {
                    pageKind: "treatmentDirectory",
                    path: normalizedPath,
                    locale,
                    seo: {
                        title: "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO",
                        description: "Discover comprehensive medical treatments worldwide. Compare prices, read reviews, and find accredited international healthcare options with AKEEZO.",
                        canonicalPath: "/treatments",
                        robots: "index,follow",
                        schemaKind: "MedicalWebPage"
                    },
                    payload: {
                        headline: treatmentsPageRev?.payload?.headline || "Find The Best Treatments Worldwide",
                        subheadline: treatmentsPageRev?.payload?.subheadline || "World-class care, anywhere in the world.",
                        treatments: fallbackTreatments
                    },
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: treatmentsDto });
                return;
            }
            if (normalizedPath === "/hospitals" || normalizedPath.startsWith("/hospitals/")) {
                const slug = normalizedPath.startsWith("/hospitals/")
                    ? normalizedPath.replace(/^\/hospitals\/?/, "").split("/")[0]
                    : "";
                const isDetail = Boolean(slug);
                let fallbackHospitals = undefined;
                try {
                    const hospPage = await Page.findOne({ slug: "hospitals", locale: "en" }).lean();
                    if (hospPage) {
                        const revId = hospPage.publishedRevisionId || hospPage.draftRevisionId;
                        if (revId) {
                            const rev = await ContentRevision.findById(revId).lean();
                            fallbackHospitals = rev?.payload?.hospitals;
                        }
                    }
                }
                catch { }
                if (isDetail) {
                    const hospital = getHospitalDetail(slug, fallbackHospitals);
                    if (hospital) {
                        const detailDto = {
                            pageKind: "hospitalDetail",
                            path: normalizedPath,
                            locale,
                            seo: {
                                title: `${hospital.name} in ${hospital.city}, ${hospital.country} | Hospital Details | AKEEZO`,
                                description: hospital.summary ||
                                    `Explore ${hospital.name} in ${hospital.city}, ${hospital.country}. Compare surgery costs, view accredited facilities, read verified patient reviews, and book free consultations.`,
                                canonicalPath: `/hospitals/${hospital.slug}`,
                                robots: "index,follow",
                                schemaKind: "MedicalWebPage"
                            },
                            payload: {
                                hospital,
                                slug: hospital.slug,
                                headline: hospital.name,
                                subheadline: `${hospital.city}, ${hospital.country}`
                            },
                            siteSettings,
                            statusCode: 200
                        };
                        res.json({ data: detailDto });
                        return;
                    }
                    res.status(404).json({
                        data: {
                            pageKind: "notFound",
                            path: normalizedPath,
                            locale,
                            seo: {
                                title: "Hospital Not Found | AKEEZO Healthcare Platform",
                                description: "The requested hospital profile could not be located. Explore our accredited international hospitals directory.",
                                canonicalPath: "/hospitals",
                                robots: "noindex,nofollow",
                                schemaKind: "WebPage"
                            },
                            payload: {},
                            siteSettings,
                            statusCode: 404
                        }
                    });
                    return;
                }
                const hospitalsDto = {
                    pageKind: "hospitalDirectory",
                    path: normalizedPath,
                    locale,
                    seo: {
                        title: "World-Class Hospitals | Personally Matched for You | AKEEZO",
                        description: "Find and compare top accredited hospitals globally. Transparent estimates, verified patient satisfaction ratings, and complete care coordination with AKEEZO.",
                        canonicalPath: "/hospitals",
                        robots: "index,follow",
                        schemaKind: "MedicalWebPage"
                    },
                    payload: {
                        headline: "World-Class Hospitals, Personally Matched for You",
                        subheadline: "Find the Best Hospitals for Your Treatment, Anywhere in the World",
                        hospitals: fallbackHospitals || undefined
                    },
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: hospitalsDto });
                return;
            }
            if (normalizedPath === "/doctors" || normalizedPath.startsWith("/doctors/")) {
                const slug = normalizedPath.startsWith("/doctors/")
                    ? normalizedPath.replace(/^\/doctors\/?/, "").split("/")[0]
                    : "";
                const isDetail = Boolean(slug);
                let fallbackDoctors = undefined;
                try {
                    const docPage = await Page.findOne({ slug: "doctors", locale: "en" }).lean();
                    if (docPage) {
                        const revId = docPage.publishedRevisionId || docPage.draftRevisionId;
                        if (revId) {
                            const rev = await ContentRevision.findById(revId).lean();
                            fallbackDoctors = rev?.payload?.doctors;
                        }
                    }
                }
                catch { }
                if (isDetail) {
                    const doctor = getDoctorDetail(slug, fallbackDoctors);
                    if (doctor) {
                        const detailDto = {
                            pageKind: "doctorDetail",
                            path: normalizedPath,
                            locale,
                            seo: {
                                title: `${doctor.name} | ${doctor.specialty} · ${doctor.hospital} | AKEEZO`,
                                description: `${doctor.name} is a leading ${doctor.specialty} specialist at ${doctor.hospital} with ${doctor.experience} of experience. Read patient reviews, compare procedure costs, and book teleconsultations.`,
                                canonicalPath: `/doctors/${doctor.slug}`,
                                robots: "index,follow",
                                schemaKind: "MedicalWebPage"
                            },
                            payload: {
                                doctor,
                                slug: doctor.slug,
                                headline: doctor.name,
                                subheadline: `${doctor.designation} · ${doctor.hospital}`
                            },
                            siteSettings,
                            statusCode: 200
                        };
                        res.json({ data: detailDto });
                        return;
                    }
                    const notFoundDto = {
                        pageKind: "notFound",
                        path: normalizedPath,
                        locale,
                        seo: {
                            title: "Doctor Not Found | AKEEZO Healthcare Platform",
                            description: "The requested medical specialist profile could not be located. Explore our accredited international doctors directory.",
                            canonicalPath: "/doctors",
                            robots: "noindex,nofollow",
                            schemaKind: "WebPage"
                        },
                        payload: {},
                        siteSettings,
                        statusCode: 404
                    };
                    res.status(404).json({ error: { code: "NOT_FOUND", message: "Doctor not found" }, data: notFoundDto });
                    return;
                }
                const doctorsDto = {
                    pageKind: "doctorDirectory",
                    path: normalizedPath,
                    locale,
                    seo: {
                        title: "World-Class Doctors | Find Best Specialists Worldwide | AKEEZO",
                        description: "Search, compare, and connect with premier surgeons and medical specialists globally. Direct hospital pricing, accredited experts, and free assistance.",
                        canonicalPath: "/doctors",
                        robots: "index,follow",
                        schemaKind: "MedicalWebPage"
                    },
                    payload: {
                        headline: "World-Class Doctors, Personally Matched for You",
                        subheadline: "Search, compare, and connect with leading specialists across the globe.",
                        doctors: fallbackDoctors || undefined
                    },
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: doctorsDto });
                return;
            }
            if (normalizedPath === "/about" || normalizedPath === "/about-us") {
                let aboutPayload = {
                    headline: "Hey! We're AKEEZO",
                    subheadline: "We're a team of patient advocates, healthcare researchers, and travel experts — obsessed with one thing: making world-class medical care reachable for anyone, anywhere."
                };
                let aboutRevisionId = undefined;
                let aboutSeo = {
                    title: "About Us | Hey! We're AKEEZO Healthcare Platform",
                    description: "Meet the team behind AKEEZO. A dedicated group of patient advocates, healthcare researchers, and travel experts making world-class medical care reachable for anyone, anywhere.",
                    canonicalPath: "/about",
                    robots: "index,follow",
                    schemaKind: "AboutPage"
                };
                if (mongoose.connection.readyState === 1) {
                    try {
                        const page = await Page.findOne({ slug: "about", locale: "en" }).lean();
                        if (page) {
                            const revId = page.publishedRevisionId || page.draftRevisionId;
                            if (revId) {
                                const rev = await ContentRevision.findById(revId).lean();
                                if (rev) {
                                    aboutRevisionId = rev._id.toString();
                                    if (rev.payload)
                                        aboutPayload = { ...aboutPayload, ...rev.payload };
                                    if (rev.seo)
                                        aboutSeo = { ...aboutSeo, ...rev.seo };
                                }
                            }
                        }
                    }
                    catch { }
                }
                const aboutDto = {
                    pageKind: "about",
                    path: normalizedPath,
                    locale,
                    seo: aboutSeo,
                    payload: aboutPayload,
                    revisionId: aboutRevisionId,
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: aboutDto });
                return;
            }
            if (normalizedPath === "/contact" || normalizedPath === "/contact-us") {
                let contactPayload = {
                    headline: "Contact Us",
                    subheadline: "AKEEZO – Your trusted global platform to discover and compare world-class medical treatments in India."
                };
                let contactRevisionId = undefined;
                let contactSeo = {
                    title: "Contact Us - Medical Tourism & Patient Support | AKEEZO",
                    description: "Get in touch with AKEEZO for personalized medical tourism assistance in India. Contact our care team for hospital quotes, specialist consultations, and travel guidance.",
                    canonicalPath: "/contact",
                    robots: "index,follow",
                    schemaKind: "ContactPage"
                };
                if (mongoose.connection.readyState === 1) {
                    try {
                        const page = await Page.findOne({ slug: "contact", locale: "en" }).lean();
                        if (page) {
                            const revId = page.publishedRevisionId || page.draftRevisionId;
                            if (revId) {
                                const rev = await ContentRevision.findById(revId).lean();
                                if (rev) {
                                    contactRevisionId = rev._id.toString();
                                    if (rev.payload)
                                        contactPayload = { ...contactPayload, ...rev.payload };
                                    if (rev.seo)
                                        contactSeo = { ...contactSeo, ...rev.seo };
                                }
                            }
                        }
                    }
                    catch { }
                }
                const contactDto = {
                    pageKind: "contact",
                    path: normalizedPath,
                    locale,
                    seo: contactSeo,
                    payload: contactPayload,
                    revisionId: contactRevisionId,
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: contactDto });
                return;
            }
            if (normalizedPath === "/destinations" || normalizedPath.startsWith("/destinations/")) {
                const slug = normalizedPath.startsWith("/destinations/")
                    ? normalizedPath.replace(/^\/destinations\/?/, "").split("/")[0]
                    : "";
                const isDetail = Boolean(slug);
                let fallbackDestinations = undefined;
                let destinationsPageRev = null;
                if (mongoose.connection.readyState === 1) {
                    try {
                        const page = await Page.findOne({ slug: "destinations", locale: "en" }).lean();
                        if (page) {
                            const revId = page.publishedRevisionId || page.draftRevisionId;
                            if (revId) {
                                destinationsPageRev = await ContentRevision.findById(revId).lean();
                                const rawList = destinationsPageRev?.payload?.destinations;
                                if (Array.isArray(rawList) && rawList.length > 0) {
                                    fallbackDestinations = rawList.filter((d) => d.active !== false);
                                }
                            }
                        }
                    }
                    catch { }
                }
                if (!fallbackDestinations || fallbackDestinations.length === 0) {
                    fallbackDestinations = ALL_DESTINATIONS;
                }
                if (isDetail) {
                    const destination = getDestinationDetail(slug, fallbackDestinations);
                    if (destination) {
                        const detailDto = {
                            pageKind: "destinationDetail",
                            path: normalizedPath,
                            locale,
                            seo: {
                                title: destination.title,
                                description: destination.subheadline,
                                canonicalPath: `/destinations/${destination.slug || slug}`,
                                robots: "index,follow",
                                schemaKind: "MedicalWebPage"
                            },
                            payload: {
                                destination,
                                slug: destination.slug || slug,
                                headline: destination.headline,
                                subheadline: destination.subheadline
                            },
                            siteSettings,
                            statusCode: 200
                        };
                        res.json({ data: detailDto });
                        return;
                    }
                    const notFoundDto = {
                        pageKind: "notFound",
                        path: normalizedPath,
                        locale,
                        seo: {
                            title: "Destination Not Found | AKEEZO Healthcare Platform",
                            description: "The requested medical tourism destination could not be located. Explore our premier global medical tourism destinations directory.",
                            canonicalPath: "/destinations",
                            robots: "noindex,nofollow",
                            schemaKind: "WebPage"
                        },
                        payload: {},
                        siteSettings,
                        statusCode: 404
                    };
                    res.status(404).json({ error: { code: "NOT_FOUND", message: "Destination not found" }, data: notFoundDto });
                    return;
                }
                const destinationsDto = {
                    pageKind: "destinationDirectory",
                    path: normalizedPath,
                    locale,
                    seo: {
                        title: "All Destinations - Medical Tourism & Treatment in India | AKEEZO",
                        description: "Explore premier global medical tourism destinations and Indian healthcare hub cities. Compare hospital accreditations, treatment costs, and save up to 85% with AKEEZO.",
                        canonicalPath: "/destinations",
                        robots: "index,follow",
                        schemaKind: "MedicalWebPage"
                    },
                    payload: {
                        headline: destinationsPageRev?.payload?.headline || "Premier Medical Tourism Destinations",
                        subheadline: destinationsPageRev?.payload?.subheadline || "Discover world-class accredited hospitals, board-certified surgeons, and up to 85% cost savings across premier healthcare destinations.",
                        destinations: fallbackDestinations
                    },
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: destinationsDto });
                return;
            }
            if (normalizedPath === "/ask-cma" || normalizedPath === "/ask-akeezo") {
                res.status(301).json({
                    data: {
                        redirectTo: "/community",
                        statusCode: 301,
                    },
                });
                return;
            }
            if (normalizedPath === "/community" || normalizedPath.startsWith("/community/")) {
                const slug = normalizedPath.startsWith("/community/")
                    ? normalizedPath.replace(/^\/community\/?/, "").split("/")[0]
                    : "";
                const isDetail = Boolean(slug);
                if (isDetail) {
                    let thread = null;
                    if (mongoose.connection.readyState === 1) {
                        const doc = await CommunityThreadModel.findOne({ slug, status: "published" }).lean();
                        if (doc)
                            thread = doc;
                    }
                    if (!thread) {
                        thread = getCommunityThreadBySlug(slug);
                    }
                    if (thread) {
                        const threadDto = {
                            pageKind: "communityThread",
                            path: normalizedPath,
                            locale,
                            seo: {
                                title: `${thread.title} | Ask Akeezo Community`,
                                description: thread.content.slice(0, 160),
                                canonicalPath: `/community/${thread.slug}`,
                                robots: "index,follow",
                                schemaKind: "QAPage",
                            },
                            payload: {
                                thread,
                                slug: thread.slug,
                            },
                            siteSettings,
                            statusCode: 200,
                        };
                        res.json({ data: threadDto });
                        return;
                    }
                    const notFoundDto = {
                        pageKind: "notFound",
                        path: normalizedPath,
                        locale,
                        seo: {
                            title: "Discussion Not Found | AKEEZO Healthcare Community",
                            description: "The requested medical travel discussion thread could not be located.",
                            canonicalPath: "/community",
                            robots: "noindex,nofollow",
                            schemaKind: "WebPage",
                        },
                        payload: {},
                        siteSettings,
                        statusCode: 404,
                    };
                    res.status(404).json({ error: { code: "NOT_FOUND", message: "Thread not found" }, data: notFoundDto });
                    return;
                }
                let threads = [];
                if (mongoose.connection.readyState === 1) {
                    const docs = await CommunityThreadModel.find({ status: "published" })
                        .sort({ isPinned: -1, upvotes: -1, createdAt: -1 })
                        .lean();
                    if (docs && docs.length > 0)
                        threads = docs;
                }
                if (threads.length === 0) {
                    threads = CURATED_COMMUNITY_THREADS;
                }
                const communityDto = {
                    pageKind: "community",
                    path: normalizedPath,
                    locale,
                    seo: {
                        title: "Medical Travel Q&A & Real Patient Stories | Ask Akeezo Community",
                        description: "Browse transparent surgical costs, hospital experiences, post-op recovery advice, and doctor-verified answers from 45+ countries.",
                        canonicalPath: "/community",
                        robots: "index,follow",
                        schemaKind: "MedicalWebPage",
                    },
                    payload: {
                        threads,
                        headline: "Medical Travel Q&A & Real Patient Stories",
                        subheadline: "Transparent surgical costs, hospital experiences, post-op recovery advice, and doctor-verified answers from 45+ countries.",
                    },
                    siteSettings,
                    statusCode: 200,
                };
                res.json({ data: communityDto });
                return;
            }
            // Check legal compliance pages
            const LEGAL_SEO_MAP = {
                "/privacy": {
                    title: "Privacy Policy | AKEEZO Healthcare Platform",
                    description: "Learn how AKEEZO protects patient health information (PHI) and clinical records under GDPR, HIPAA, and India DPDP Act 2023."
                },
                "/terms": {
                    title: "Terms of Service | AKEEZO Healthcare Platform",
                    description: "Terms and conditions governing healthcare discovery, hospital facilitation, and medical travel coordination with AKEEZO."
                },
                "/disclaimer": {
                    title: "Medical Disclaimer | AKEEZO Healthcare Platform",
                    description: "Critical medical notice outlining AKEEZO's non-clinical facilitation scope, physician independence, and emergency care advisory."
                },
                "/consent": {
                    title: "Informed Patient Consent | AKEEZO Healthcare Platform",
                    description: "Explicit consent framework for cross-border medical record transmission, hospital referral, and teleconsultation coordination."
                },
                "/refund-policy": {
                    title: "Refund Policy & Service Surety | AKEEZO Healthcare Platform",
                    description: "Read AKEEZO's 100% Service Surety commitment and transparent refund guidelines for medical travel coordination."
                },
                "/grievance-officer": {
                    title: "Grievance Redressal Officer | AKEEZO Healthcare Platform",
                    description: "Contact AKEEZO's designated Grievance Officer under the IT Intermediary Rules 2021 and Digital Personal Data Protection Act 2023."
                }
            };
            const legalSeo = LEGAL_SEO_MAP[normalizedPath];
            if (legalSeo) {
                const legalDto = {
                    pageKind: "legal",
                    path: normalizedPath,
                    locale,
                    seo: {
                        title: legalSeo.title,
                        description: legalSeo.description,
                        canonicalPath: normalizedPath,
                        robots: "index,follow",
                        schemaKind: "WebPage"
                    },
                    payload: {},
                    siteSettings,
                    statusCode: 200
                };
                res.json({ data: legalDto });
                return;
            }
            const notFoundDto = {
                pageKind: "notFound",
                path: normalizedPath,
                locale,
                seo: {
                    title: "404 - Healthcare Resource Not Found | AKEEZO Healthcare Platform",
                    description: "The requested medical procedure, hospital, or specialist could not be found. Contact our 24/7 care coordination desk for immediate assistance.",
                    canonicalPath: normalizedPath,
                    robots: "noindex,nofollow",
                    schemaKind: "WebPage"
                },
                payload: {},
                siteSettings,
                statusCode: 404
            };
            res.status(404).json({ error: { code: "NOT_FOUND", message: "Route entry not found" }, data: notFoundDto });
            return;
        }
        if (routeEntry.redirectTo) {
            res.status(routeEntry.statusCode || 301).json({
                data: {
                    redirectTo: routeEntry.redirectTo,
                    statusCode: routeEntry.statusCode || 301
                }
            });
            return;
        }
        const revision = routeEntry.publishedRevisionId
            ? await ContentRevision.findById(routeEntry.publishedRevisionId).lean()
            : null;
        const seo = revision?.seo || {
            title: "AKEEZO Healthcare Platform",
            description: "Heal In India, Heal By Akeezo - Medical Tourism & Healthcare Coordination",
            canonicalPath: normalizedPath,
            robots: "index,follow",
            schemaKind: "MedicalWebPage"
        };
        const dto = {
            pageKind: routeEntry.pageKind,
            path: routeEntry.path,
            locale: routeEntry.locale || "en",
            seo,
            payload: revision?.payload || {},
            revisionId: revision?._id?.toString(),
            siteSettings,
            statusCode: routeEntry.statusCode || 200
        };
        res.json({ data: dto });
    }
    catch (err) {
        res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to resolve route" } });
    }
});
// GET /api/v1/doctors/:slug (Public Doctor Detail API)
apiRouter.get("/doctors/:slug", async (req, res) => {
    let fallbackDoctors = undefined;
    if (mongoose.connection.readyState === 1) {
        try {
            const docPage = await Page.findOne({ slug: "doctors", locale: "en" }).lean();
            if (docPage) {
                const revId = docPage.publishedRevisionId || docPage.draftRevisionId;
                if (revId) {
                    const rev = await ContentRevision.findById(revId).lean();
                    fallbackDoctors = rev?.payload?.doctors;
                }
            }
        }
        catch { }
    }
    const doctor = getDoctorDetail(req.params.slug, fallbackDoctors);
    if (!doctor) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Doctor not found" } });
        return;
    }
    res.json({ data: doctor });
});
// GET /api/v1/hospitals/:slug (Public Hospital Detail API)
apiRouter.get("/hospitals/:slug", async (req, res) => {
    let fallbackHospitals = undefined;
    if (mongoose.connection.readyState === 1) {
        try {
            const hospPage = await Page.findOne({ slug: "hospitals", locale: "en" }).lean();
            if (hospPage) {
                const revId = hospPage.publishedRevisionId || hospPage.draftRevisionId;
                if (revId) {
                    const rev = await ContentRevision.findById(revId).lean();
                    fallbackHospitals = rev?.payload?.hospitals;
                }
            }
        }
        catch { }
    }
    const hospital = getHospitalDetail(req.params.slug, fallbackHospitals);
    if (!hospital) {
        res.status(404).json({ error: { code: "NOT_FOUND", message: "Hospital not found" } });
        return;
    }
    res.json({ data: hospital });
});
// GET /api/v1/destinations (Public Destinations Directory API synced with Admin CMS)
apiRouter.get("/destinations", async (_req, res) => {
    try {
        let list = [];
        if (mongoose.connection.readyState === 1) {
            const page = await Page.findOne({ slug: "destinations", locale: "en" }).lean();
            if (page) {
                const revId = page.publishedRevisionId || page.draftRevisionId;
                if (revId) {
                    const rev = await ContentRevision.findById(revId).lean();
                    const rawList = rev?.payload?.destinations;
                    if (Array.isArray(rawList) && rawList.length > 0) {
                        list = rawList.filter((d) => d.active !== false);
                    }
                }
            }
        }
        // Merge database list with ALL_DESTINATIONS so custom CMS edits apply while preserving all countries & hub cities
        const mergedMap = new Map();
        for (const item of ALL_DESTINATIONS) {
            mergedMap.set(item.slug, item);
        }
        for (const item of list) {
            const existing = mergedMap.get(item.slug);
            mergedMap.set(item.slug, existing ? { ...existing, ...item } : item);
        }
        const result = Array.from(mergedMap.values());
        res.json({ data: result });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_DESTINATIONS_FAILED", message: err.message } });
    }
});
// GET /api/v1/destinations/:slug (Public Destination Detail API synced with Admin CMS)
apiRouter.get("/destinations/:slug", async (req, res) => {
    try {
        let fallbackDestinations = undefined;
        if (mongoose.connection.readyState === 1) {
            const page = await Page.findOne({ slug: "destinations", locale: "en" }).lean();
            if (page) {
                const revId = page.publishedRevisionId || page.draftRevisionId;
                if (revId) {
                    const rev = await ContentRevision.findById(revId).lean();
                    fallbackDestinations = rev?.payload?.destinations;
                }
            }
        }
        const destination = getDestinationDetail(req.params.slug, fallbackDestinations);
        if (!destination) {
            res.status(404).json({ error: { code: "NOT_FOUND", message: "Destination not found" } });
            return;
        }
        res.json({ data: destination });
    }
    catch (err) {
        res.status(500).json({ error: { code: "FETCH_DESTINATION_FAILED", message: err.message } });
    }
});
// POST /api/v1/enquiries (Public Consultation & Lead Submission)
apiRouter.post("/enquiries", async (req, res) => {
    try {
        const { requesterName, fullName, phone, email, country, destinationCountry, treatmentName, serviceType = "consultation", message, notes, sourcePath, doctorName, doctorSlug, hospital, hospitalName, hospitalSlug, procedure, consultationType, preferredDate, preferredSlot, } = req.body;
        const patientName = (requesterName || fullName || "").trim();
        if (!patientName) {
            res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Patient name is required" } });
            return;
        }
        if ((!phone || !phone.trim()) && (!email || !email.trim())) {
            res.status(400).json({ error: { code: "VALIDATION_FAILED", message: "Either phone or email is required" } });
            return;
        }
        const receiptSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
        const prefix = hospitalSlug
            ? "AKZ-HSP"
            : doctorSlug
                ? "AKZ-DOC"
                : destinationCountry || serviceType === "destination"
                    ? "AKZ-DST"
                    : "AKZ-ENQ";
        const receiptId = `${prefix}-${Date.now().toString(36).toUpperCase()}-${receiptSuffix}`;
        const targetHospital = hospitalName || hospital;
        const procedureVal = procedure || treatmentName;
        const combinedNotes = [
            notes,
            destinationCountry ? `Destination: ${destinationCountry}` : null,
            doctorName ? `Doctor: ${doctorName} (${doctorSlug || ""})` : null,
            targetHospital ? `Hospital: ${targetHospital} (${hospitalSlug || ""})` : null,
            procedureVal ? `Procedure: ${procedureVal}` : null,
            consultationType ? `Mode: ${consultationType}` : null,
            preferredDate ? `Preferred Date: ${preferredDate}` : null,
            preferredSlot ? `Preferred Slot: ${preferredSlot}` : null,
        ].filter(Boolean).join(" | ");
        let enquiryId = new mongoose.Types.ObjectId();
        if (mongoose.connection.readyState === 1) {
            const enquiry = await EnquiryModel.create({
                receiptId,
                requesterName: patientName,
                email: email?.trim(),
                phone: phone?.trim(),
                country: country?.trim() || destinationCountry?.trim() || "International",
                serviceType: serviceType || (destinationCountry ? "destination" : "consultation"),
                message: message?.trim() ||
                    `Consultation request for ${destinationCountry || targetHospital || doctorName || "Specialist"}`,
                notes: combinedNotes,
                sourcePath: sourcePath ||
                    (destinationCountry
                        ? `/destinations/${destinationCountry.toLowerCase()}`
                        : hospitalSlug
                            ? `/hospitals/${hospitalSlug}`
                            : doctorSlug
                                ? `/doctors/${doctorSlug}`
                                : "/enquiries"),
                status: "received",
            });
            enquiryId = enquiry._id;
        }
        res.status(201).json({
            data: {
                success: true,
                receiptId,
                enquiryId,
                message: "Your teleconsultation request has been registered. Our care team will contact you within 2 hours.",
            },
        });
    }
    catch (err) {
        console.error("[Enquiry Submission Error]:", err);
        res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to submit enquiry" } });
    }
});
// Case Management & Operations Router (Guarded by requireAuth)
apiRouter.use(caseManagementRouter);
