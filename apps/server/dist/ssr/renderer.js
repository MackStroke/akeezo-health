import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PassThrough } from "node:stream";
import { RouteEntry, ContentRevision, SiteSettings } from "../db/models/index.js";
import { SiteSettingsSchema } from "@akeezo/contracts";
import { env } from "../config/env.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
        primaryColor: doc?.primaryColor || "#00C7BE",
        actionColor: doc?.actionColor || "#007A6C",
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
        socialLinks: doc?.socialLinks
    });
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
        const settingsDoc = (await SiteSettings.findOne({ environment: env.NODE_ENV }).lean()) || (await SiteSettings.findOne().lean());
        const siteSettings = toSafeSiteSettings(settingsDoc);
        // 2. Resolve RouteEntry
        const routeEntry = await RouteEntry.findOne({ locale: "en", path: normalizedPath }).lean();
        let dto;
        let statusCode = 200;
        if (routeEntry) {
            if (routeEntry.redirectTo) {
                res.redirect(routeEntry.statusCode || 301, routeEntry.redirectTo);
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
        else {
            // Genuine 404
            statusCode = 404;
            dto = {
                pageKind: "notFound",
                path: normalizedPath,
                locale: "en",
                seo: {
                    title: "Page Not Found | AKEEZO Healthcare Platform",
                    description: "The requested healthcare service or page could not be found.",
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
        const safeInitialDataJson = JSON.stringify(dto).replace(/</g, "\\u003c");
        const headInjection = `
    <title>${escapeHtml(dto.seo.title)}</title>
    <meta name="description" content="${escapeHtml(dto.seo.description)}" />
    <meta name="robots" content="${escapeHtml(dto.seo.robots)}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(dto.seo.title)}" />
    <meta property="og:description" content="${escapeHtml(dto.seo.description)}" />
    <meta property="og:type" content="website" />
    <script>window.__INITIAL_DATA__ = ${safeInitialDataJson};</script>
`;
        const htmlWithHead = template.replace("<!--ssr-head-->", headInjection);
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
                    res.status(500).send("<!DOCTYPE html><html><body><h1>Internal Server Error</h1></body></html>");
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
        next(err);
    }
}
