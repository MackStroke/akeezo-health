import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PassThrough } from "node:stream";
import mongoose from "mongoose";
import { RouteEntry, ContentRevision, SiteSettings, ChangelogModel } from "../db/models/index.js";
import { SiteSettingsSchema, generateWebsiteThemeCss, getGoogleFontUrl } from "@akeezo/contracts";
import { env } from "../config/env.js";
function getSafePaths() {
    try {
        if (typeof import.meta !== "undefined" && import.meta?.url && import.meta.url.startsWith("file:")) {
            const fn = fileURLToPath(import.meta.url);
            return { filename: fn, dirname: path.dirname(fn) };
        }
    }
    catch { }
    const cwd = typeof process !== "undefined" && process.cwd ? process.cwd() : "/";
    return { filename: path.join(cwd, "index.js"), dirname: cwd };
}
const safePaths = getSafePaths();
const __filename = safePaths.filename;
const __dirname = safePaths.dirname;
const webRoot = path.resolve(__dirname, "../../../web");
let viteDevServer = null;
export async function getViteServer() {
    if (env.NODE_ENV === "production") {
        return null;
    }
    if (!viteDevServer) {
        try {
            const { createServer } = await import("vite");
            viteDevServer = await createServer({
                root: webRoot,
                server: { middlewareMode: true },
                appType: "custom",
                configFile: false
            });
        }
        catch (err) {
            console.warn("[Vite Dev Server] Could not create dev server, falling back to prebuilt bundle:", err);
            return null;
        }
    }
    return viteDevServer;
}
export function toSafeSiteSettings(doc) {
    return SiteSettingsSchema.parse({
        brandName: doc?.brandName || "AKEEZO",
        tagline: doc?.tagline || "Heal In India, Heal By Akeezo",
        legalEntityName: doc?.legalEntityName || "AKEEZO Healthcare Platform Private Limited",
        officeAddress: doc?.officeAddress || doc?.headquartersAddress || "Regus Elegance, Jasola District Centre, New Delhi, India 110025",
        headquartersAddress: doc?.headquartersAddress || "Regus Elegance, Jasola District Centre, New Delhi, India 110025",
        phone: doc?.phone || doc?.emergencyHelpline || "+91 82876 39443",
        careEmail: doc?.careEmail || doc?.contactEmail || "care@akeezo.com",
        medicalEmail: doc?.medicalEmail || "medical@akeezo.com",
        partnershipEmail: doc?.partnershipEmail || "partnership@akeezo.com",
        grievanceEmail: doc?.grievanceEmail || doc?.grievanceOfficer?.email || "grievance@akeezo.com",
        dpoEmail: doc?.dpoEmail || doc?.dpoContact?.email || "dpo@akeezo.com",
        consentEmail: doc?.consentEmail || "consent@akeezo.com",
        supportEmail: doc?.supportEmail || "support@akeezo.com",
        emergencyHelpline: doc?.emergencyHelpline || doc?.phone || "+91 82876 39443",
        whatsappHelpline: doc?.whatsappHelpline || doc?.phone || "+91 82876 39443",
        showTopUtilityBar: doc?.showTopUtilityBar !== false,
        emergencyNotice: doc?.emergencyNotice || "EMERGENCY?",
        contactEmail: doc?.contactEmail || doc?.careEmail || "care@akeezo.com",
        telegramChannel: doc?.telegramChannel || "https://t.me/akeezohealth",
        supportedLocales: doc?.supportedLocales || ["en"],
        primaryColor: doc?.websiteTheme?.primaryColor || doc?.primaryColor || "#00C7BE",
        secondaryColor: doc?.websiteTheme?.secondaryColor || doc?.secondaryColor || "#FF6B00",
        accentColor: doc?.websiteTheme?.accentColor || doc?.accentColor || "#FF6D1B",
        actionColor: doc?.websiteTheme?.actionColor || doc?.actionColor || "#007A6C",
        websiteTheme: doc?.websiteTheme || {
            primaryColor: doc?.primaryColor || "#00C7BE",
            secondaryColor: doc?.secondaryColor || "#FF6B00",
            accentColor: doc?.accentColor || "#FF6D1B",
            actionColor: doc?.actionColor || "#007A6C"
        },
        adminTheme: doc?.adminTheme || undefined,
        logoVariants: doc?.logoVariants || {
            light: "/logo/logo with tagline-light.svg",
            dark: "/logo/logo with tagline-dark.svg",
            mark: "/logo/favicon.svg"
        },
        grievanceOfficer: doc?.grievanceOfficer || {
            name: "Yogesh Verma",
            designation: "Co-Founder & Chief Operating Officer",
            email: "grievance@akeezo.com",
            helpline: "+91 82876 39443",
            address: "Regus Elegance, Jasola District Centre, New Delhi, India 110025"
        },
        dpoContact: doc?.dpoContact || {
            email: "dpo@akeezo.com",
            address: "AKEEZO Healthcare Platform Private Limited, New Delhi, India 110001"
        },
        socialLinks: doc?.socialLinks,
        integrations: doc?.integrations
    });
}
export function renderFallback500Html(siteSettings) {
    const phone = siteSettings.phone || "+91 82876 39443";
    const phoneClean = phone.replace(/[^0-9]/g, "");
    const careEmail = siteSettings.careEmail || "care@akeezo.com";
    const legalEntity = siteSettings.legalEntityName || "AKEEZO Healthcare Platform Private Limited";
    const currentYear = new Date().getFullYear();
    const dynamicThemeCss = generateWebsiteThemeCss(siteSettings.websiteTheme);
    const fontUrl = getGoogleFontUrl(siteSettings.websiteTheme?.fontFamily) ||
        getGoogleFontUrl(siteSettings.websiteTheme?.headingFontFamily);
    const fontLinkHtml = fontUrl
        ? `  <link rel="preconnect" href="https://fonts.googleapis.com" />\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n  <link rel="stylesheet" href="${fontUrl}" />\n`
        : "";
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Server Error (500) | AKEEZO Healthcare Platform</title>
  <link rel="icon" type="image/svg+xml" href="/logo/favicon.svg" />
${fontLinkHtml}  <style id="akeezo-dynamic-theme">
${dynamicThemeCss}
  </style>
  <style>
    :root { --action: #007a6c; --action-hover: #005f54; --ink: #262626; --ink-muted: #595959; --border: #e2e8f0; --surface-teal: #e6f8f6; --surface-orange: #fff4ec; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f8fafc; color: var(--ink); min-height: 100vh; display: flex; flex-direction: column; }
    header { height: 72px; background: #ffffff; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 50; }
    .header-logo { height: 42px; width: auto; object-fit: contain; }
    main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 48px 16px; }
    .card { background: #ffffff; border: 1px solid var(--border); border-radius: 24px; max-width: 720px; width: 100%; padding: 48px 32px; text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .badge { display: inline-flex; align-items: center; gap: 8px; background: #fef3c7; border: 1px solid #fde68a; color: #92400e; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: 700; margin-bottom: 24px; }
    .hero-icon { width: 72px; height: 72px; background: #fee2e2; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; color: #dc2626; }
    h1 { font-size: 28px; font-weight: 800; color: var(--ink); margin-bottom: 12px; }
    p { font-size: 15px; color: var(--ink-muted); line-height: 1.6; margin-bottom: 24px; }
    .security-note { background: #f1f5f9; border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; text-align: left; font-size: 13px; color: var(--ink); margin-bottom: 32px; }
    .btn-group { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-bottom: 36px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; padding: 12px 24px; border-radius: 999px; font-size: 14px; font-weight: 700; text-decoration: none; cursor: pointer; transition: all 0.2s; border: none; }
    .btn-primary { background: var(--action); color: #ffffff; }
    .btn-primary:hover { background: var(--action-hover); }
    .btn-outline { background: #ffffff; color: var(--ink); border: 1px solid var(--border); }
    .btn-outline:hover { border-color: var(--action); color: var(--action); background: var(--surface-teal); }
    .btn-orange { background: var(--surface-orange); color: #b54700; border: 1px solid #ffd8bf; }
    .btn-orange:hover { background: #ffe8d9; }
    .contact-box { background: #f8fafc; border: 1px solid var(--border); border-radius: 16px; padding: 20px; text-align: left; display: flex; flex-direction: column; gap: 6px; }
    footer { background: #ffffff; border-top: 1px solid var(--border); padding: 32px 24px; font-size: 13px; color: var(--ink-muted); text-align: center; }
  </style>
</head>
<body>
  <header>
    <a href="/"><img src="/logo/logo with tagline-dark.svg" alt="AKEEZO" class="header-logo" /></a>
    <a href="https://wa.me/${phoneClean}" class="btn btn-outline" style="font-size: 12px; padding: 8px 16px;">💬 24/7 Desk: ${phone}</a>
  </header>

  <main>
    <div class="card">
      <div class="badge">HTTP 500 · System Interruption</div>
      <div class="hero-icon">⚠️</div>
      <h1>Temporary System Interruption</h1>
      <p>Our server encountered a temporary technical issue. Our engineering team has been alerted and is restoring full operations. All patient records, doctor consultation requests, and quotes are securely saved.</p>
      
      <div class="security-note">
        <strong>🔒 Protected Patient Health Information:</strong> Your submitted files and diagnostic data remain encrypted and completely safe in our clinical database.
      </div>

      <div class="btn-group">
        <button onclick="window.location.reload()" class="btn btn-primary">Try Again / Reload</button>
        <a href="/" class="btn btn-outline">Return to Homepage</a>
        <a href="https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk,%20I%20experienced%20a%20500%20server%20error" class="btn btn-orange">WhatsApp 24/7 Desk</a>
      </div>

      <div class="contact-box">
        <div style="font-size: 11px; font-weight: 700; color: var(--action); text-transform: uppercase;">Urgent Medical Inquiries</div>
        <div style="font-size: 14px; font-weight: 700;">Hotline: <a href="tel:${phoneClean}" style="color: var(--action);">${phone}</a> · Care: <a href="mailto:${careEmail}" style="color: var(--ink);">${careEmail}</a></div>
      </div>
    </div>
  </main>

  <footer>
    <p>© ${currentYear} ${legalEntity}. All rights reserved. · Regulated under Indian Clinical Establishments Acts</p>
  </footer>
</body>
</html>`;
}
function escapeHtml(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
export async function handleSsr(req, res, next) {
    const url = req.originalUrl || req.url;
    // Skip static assets or API routes if any slip through
    if (url.startsWith("/api") ||
        url.startsWith("/@") ||
        url.startsWith("/node_modules") ||
        url.includes(".")) {
        return next();
    }
    try {
        const rawPath = req.path;
        const normalizedPath = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;
        // 1. Fetch SiteSettings
        const settingsDoc = (await SiteSettings.findOne({ environment: env.NODE_ENV }).lean()) ||
            (await SiteSettings.findOne({ environment: "development" }).lean()) ||
            (await SiteSettings.findOne().lean());
        const siteSettings = toSafeSiteSettings(settingsDoc);
        // 2. Resolve RouteEntry
        const routeEntry = await RouteEntry.findOne({ locale: "en", path: normalizedPath }).lean();
        let dto;
        let statusCode = 200;
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
        if (normalizedPath === "/500") {
            statusCode = 500;
            dto = {
                pageKind: "serverError",
                path: "/500",
                locale: "en",
                seo: {
                    title: "500 - Server Error | AKEEZO Healthcare Platform",
                    description: "A temporary system interruption occurred. Our clinical records and patient data remain secure. Contact our 24/7 care desk for assistance.",
                    canonicalPath: "/500",
                    robots: "noindex,nofollow",
                    schemaKind: "WebPage"
                },
                payload: {},
                siteSettings,
                statusCode: 500
            };
        }
        else if (routeEntry) {
            if (routeEntry.redirectTo) {
                res.redirect(routeEntry.statusCode || 301, routeEntry.redirectTo);
                return;
            }
            const revision = routeEntry.publishedRevisionId
                ? await ContentRevision.findById(routeEntry.publishedRevisionId).lean()
                : null;
            const defaultSeo = LEGAL_SEO_MAP[normalizedPath] || {
                title: "AKEEZO | Heal In India, Heal By Akeezo - Medical Tourism & Treatment in India",
                description: "Discover accredited Indian hospitals, consult top doctors, and receive guided care coordination and transparent cost estimates."
            };
            const seo = revision?.seo || {
                title: defaultSeo.title,
                description: defaultSeo.description,
                canonicalPath: normalizedPath,
                robots: "index,follow",
                schemaKind: "MedicalWebPage"
            };
            dto = {
                pageKind: routeEntry.pageKind,
                path: routeEntry.path,
                locale: routeEntry.locale || "en",
                seo,
                payload: revision?.payload || {},
                revisionId: revision?._id?.toString(),
                siteSettings,
                statusCode: routeEntry.statusCode || 200
            };
            statusCode = dto.statusCode;
        }
        else if (normalizedPath === "/cost-calculator" || normalizedPath === "/calculator") {
            statusCode = 200;
            dto = {
                pageKind: "calculatorLanding",
                path: normalizedPath,
                locale: "en",
                seo: {
                    title: "Surgery Cost Calculator Tool | Save up to 70% | AKEEZO",
                    description: "Compare surgery costs across top medical destinations and accredited international hospitals. Get transparent estimates and connect with world-class surgeons.",
                    canonicalPath: "/cost-calculator",
                    robots: "index,follow",
                    schemaKind: "MedicalWebPage"
                },
                payload: {},
                siteSettings,
                statusCode: 200
            };
        }
        else if (normalizedPath === "/treatments" || normalizedPath.startsWith("/treatments/")) {
            statusCode = 200;
            dto = {
                pageKind: "treatmentDirectory",
                path: normalizedPath,
                locale: "en",
                seo: {
                    title: "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO",
                    description: "Discover comprehensive medical treatments worldwide. Compare prices, read reviews, and find accredited international healthcare options with AKEEZO.",
                    canonicalPath: "/treatments",
                    robots: "index,follow",
                    schemaKind: "MedicalWebPage"
                },
                payload: {
                    headline: "Find The Best Treatments Worldwide",
                    subheadline: "World-class care, anywhere in the world."
                },
                siteSettings,
                statusCode: 200
            };
        }
        else if (normalizedPath === "/hospitals" || normalizedPath.startsWith("/hospitals/")) {
            statusCode = 200;
            dto = {
                pageKind: "hospitalDirectory",
                path: normalizedPath,
                locale: "en",
                seo: {
                    title: "World-Class Hospitals | Personally Matched for You | AKEEZO",
                    description: "Find and compare top accredited hospitals globally. Transparent estimates, verified patient satisfaction ratings, and complete care coordination with AKEEZO.",
                    canonicalPath: "/hospitals",
                    robots: "index,follow",
                    schemaKind: "MedicalWebPage"
                },
                payload: {
                    headline: "World-Class Hospitals, Personally Matched for You",
                    subheadline: "Find the Best Hospitals for Your Treatment, Anywhere in the World"
                },
                siteSettings,
                statusCode: 200
            };
        }
        else if (normalizedPath === "/doctors" || normalizedPath.startsWith("/doctors/")) {
            statusCode = 200;
            dto = {
                pageKind: "doctorDirectory",
                path: normalizedPath,
                locale: "en",
                seo: {
                    title: "World-Class Doctors | Find Best Specialists Worldwide | AKEEZO",
                    description: "Search, compare, and connect with premier surgeons and medical specialists globally. Direct hospital pricing, accredited experts, and free assistance.",
                    canonicalPath: "/doctors",
                    robots: "index,follow",
                    schemaKind: "MedicalWebPage"
                },
                payload: {
                    headline: "World-Class Doctors, Personally Matched for You",
                    subheadline: "Search, compare, and connect with leading specialists across the globe."
                },
                siteSettings,
                statusCode: 200
            };
        }
        else if (normalizedPath === "/about" || normalizedPath === "/about-us") {
            statusCode = 200;
            dto = {
                pageKind: "about",
                path: normalizedPath,
                locale: "en",
                seo: {
                    title: "About Us | Hey! We're AKEEZO Healthcare Platform",
                    description: "Meet the team behind AKEEZO. A dedicated group of patient advocates, healthcare researchers, and travel experts making world-class medical care reachable for anyone, anywhere.",
                    canonicalPath: "/about",
                    robots: "index,follow",
                    schemaKind: "AboutPage"
                },
                payload: {
                    headline: "Hey! We're AKEEZO",
                    subheadline: "We're a team of patient advocates, healthcare researchers, and travel experts — obsessed with one thing: making world-class medical care reachable for anyone, anywhere."
                },
                siteSettings,
                statusCode: 200
            };
        }
        else if (LEGAL_SEO_MAP[normalizedPath]) {
            const legalSeo = LEGAL_SEO_MAP[normalizedPath];
            statusCode = 200;
            dto = {
                pageKind: "legal",
                path: normalizedPath,
                locale: "en",
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
        }
        else if (normalizedPath === "/changelog" || normalizedPath === "/changelogs") {
            statusCode = 200;
            let changelogs = [];
            if (mongoose.connection.readyState === 1) {
                changelogs = await ChangelogModel.find({
                    status: "published",
                    audience: { $in: ["all", "public"] },
                })
                    .sort({ releaseDate: -1 })
                    .limit(30)
                    .lean();
            }
            dto = {
                pageKind: "legal",
                path: "/changelog",
                locale: "en",
                seo: {
                    title: "Platform Changelog & Release Notes | AKEEZO Healthcare Platform",
                    description: "Follow the latest updates, clinical feature additions, integrations, and security releases across the AKEEZO Healthcare Platform.",
                    canonicalPath: "/changelog",
                    robots: "index,follow",
                    schemaKind: "WebPage",
                },
                payload: {
                    documentId: "changelog",
                    title: "Platform Changelog & Release Notes",
                    category: "System Updates",
                    changelogs,
                },
                siteSettings,
                statusCode: 200,
            };
        }
        else {
            // Genuine 404
            statusCode = 404;
            dto = {
                pageKind: "notFound",
                path: normalizedPath,
                locale: "en",
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
        }
        // 3. Load HTML Template and Server Render Function
        let template = "";
        let render = null;
        const clientDist = path.resolve(webRoot, "dist/client");
        const serverDist = path.resolve(webRoot, "dist/server");
        let loadedViaVite = false;
        const vite = await getViteServer();
        if (vite) {
            try {
                const rawHtml = await fs.readFile(path.join(webRoot, "index.html"), "utf-8");
                template = await vite.transformIndexHtml(url, rawHtml);
                const mod = await vite.ssrLoadModule("/src/entry-server.tsx");
                render = mod.render;
                loadedViaVite = true;
            }
            catch (err) {
                console.warn("[Akeezo SSR] Vite transform/load failed, falling back to prebuilt bundle:", err);
            }
        }
        if (!loadedViaVite) {
            template = await fs.readFile(path.join(clientDist, "index.html"), "utf-8");
            const serverEntryUrl = pathToFileURL(path.join(serverDist, "entry-server.js")).href;
            const mod = await import(serverEntryUrl);
            render = mod.render;
        }
        if (!render || !template) {
            res.status(500).send("<!DOCTYPE html><html><body><h1>SSR Render Initialization Error</h1></body></html>");
            return;
        }
        // 4. Inject Head tags & window.__INITIAL_DATA__
        const origin = req.protocol + "://" + (req.get("host") || "akeezo.com");
        const canonicalUrl = dto.seo.canonicalPath.startsWith("http")
            ? dto.seo.canonicalPath
            : `${origin}${dto.seo.canonicalPath.startsWith("/") ? "" : "/"}${dto.seo.canonicalPath}`;
        // 4a. Third-Party Integrations Injection
        const integrations = dto.siteSettings?.integrations;
        // Google Tag Manager
        let gtmHeadSnippet = "";
        let gtmBodySnippet = "";
        if (integrations?.googleTagManager?.enabled && integrations.googleTagManager.containerId) {
            const gtmId = escapeHtml(integrations.googleTagManager.containerId.trim());
            gtmHeadSnippet = `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');</script>
    <!-- End Google Tag Manager -->\n`;
            gtmBodySnippet = `
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->\n`;
        }
        // Google Analytics (GA4)
        let gaHeadSnippet = "";
        const gaMeasurementId = (integrations?.googleAnalytics?.measurementId ||
            integrations?.googleAnalyticsId ||
            "").trim();
        if (integrations?.googleAnalytics?.enabled && gaMeasurementId) {
            const gaId = escapeHtml(gaMeasurementId);
            const anonymize = integrations.googleAnalytics.anonymizeIp !== false;
            const configOpts = anonymize ? ", { 'anonymize_ip': true }" : "";
            gaHeadSnippet = `
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${gaId}'${configOpts});
    </script>
    <!-- End Google Analytics -->\n`;
        }
        // Meta Pixel
        let metaPixelHeadSnippet = "";
        if (integrations?.metaPixel?.enabled && integrations.metaPixel.pixelId) {
            const pixelId = escapeHtml(integrations.metaPixel.pixelId.trim());
            metaPixelHeadSnippet = `
    <!-- Meta Pixel Code -->
    <script>
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');
    </script>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->\n`;
        }
        const safeInitialDataJson = JSON.stringify(dto).replace(/</g, "\\u003c");
        const dynamicThemeCss = generateWebsiteThemeCss(dto.siteSettings?.websiteTheme);
        const isDark = dto.siteSettings?.websiteTheme?.mode === "dark";
        if (isDark && !template.includes('class="dark"')) {
            template = template.replace("<html", '<html class="dark"');
        }
        const fontUrl = getGoogleFontUrl(dto.siteSettings?.websiteTheme?.fontFamily) ||
            getGoogleFontUrl(dto.siteSettings?.websiteTheme?.headingFontFamily);
        const fontLinkHtml = fontUrl
            ? `    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link rel="stylesheet" href="${fontUrl}">\n`
            : "";
        const headInjection = `
    <title>${escapeHtml(dto.seo.title)}</title>
    <meta name="description" content="${escapeHtml(dto.seo.description)}" />
    <meta name="robots" content="${escapeHtml(dto.seo.robots)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <link rel="icon" type="image/svg+xml" href="/logo/favicon.svg" />
    <link rel="apple-touch-icon" href="/logo/favicon.svg" />
    <meta property="og:title" content="${escapeHtml(dto.seo.title)}" />
    <meta property="og:description" content="${escapeHtml(dto.seo.description)}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(dto.seo.title)}" />
    <meta name="twitter:description" content="${escapeHtml(dto.seo.description)}" />
${fontLinkHtml}    <style id="akeezo-dynamic-theme">
${dynamicThemeCss}
    </style>
${gtmHeadSnippet}${gaHeadSnippet}${metaPixelHeadSnippet}    <script>window.__INITIAL_DATA__ = ${safeInitialDataJson};</script>
`;
        let htmlWithHead = template.replace("<!--ssr-head-->", headInjection);
        if (gtmBodySnippet) {
            htmlWithHead = htmlWithHead.replace(/<body[^>]*>/i, (bodyMatch) => `${bodyMatch}\n${gtmBodySnippet}`);
        }
        const [htmlStart, htmlEnd] = htmlWithHead.split("<!--ssr-outlet-->");
        if (!htmlEnd) {
            res.status(500).send("Template missing <!--ssr-outlet-->");
            return;
        }
        // 5. Stream React SSR output via renderToPipeableStream
        const transformStream = new PassThrough();
        const { pipe, abort } = render(url, dto, {
            onShellReady() {
                res.status(statusCode);
                res.setHeader("Content-Type", "text/html; charset=utf-8");
                res.write(htmlStart);
                pipe(transformStream);
            },
            onShellError(err) {
                console.error("[Akeezo SSR Shell Error]:", err);
                if (!res.headersSent) {
                    res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(renderFallback500Html(siteSettings));
                }
            },
            onError(err) {
                console.error("[Akeezo SSR Error]:", err);
            }
        });
        transformStream.on("data", (chunk) => {
            res.write(chunk);
        });
        transformStream.on("end", () => {
            res.write(htmlEnd);
            res.end();
        });
        // Abort stream if taking too long
        setTimeout(() => {
            abort();
        }, 10000);
    }
    catch (err) {
        console.error("[Akeezo SSR Handler Exception]:", err);
        if (!res.headersSent) {
            try {
                const settingsDoc = await SiteSettings.findOne().lean().catch(() => null);
                const siteSettings = toSafeSiteSettings(settingsDoc);
                res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(renderFallback500Html(siteSettings));
                return;
            }
            catch (_fallbackErr) {
                // Continue to next error handler if fallback extraction fails
            }
        }
        next(err);
    }
}
