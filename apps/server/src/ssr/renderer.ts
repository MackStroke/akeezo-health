import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PassThrough } from "node:stream";
import type { Request, Response, NextFunction } from "express";
import { RouteEntry, ContentRevision, SiteSettings } from "../db/models/index.js";
import {
  type PublicRouteResponseDTO,
  type SiteSettings as SiteSettingsDTO,
  SiteSettingsSchema,
  type SeoMetadata
} from "@akeezo/contracts";
import { env } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "../../../web");

let viteDevServer: any = null;

export async function getViteServer(): Promise<any> {
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
    } catch (err) {
      console.warn("[Vite Dev Server] Could not create dev server, falling back to prebuilt bundle:", err);
      return null;
    }
  }
  return viteDevServer;
}

export function toSafeSiteSettings(doc: any): SiteSettingsDTO {
  return SiteSettingsSchema.parse({
    brandName: doc?.brandName || "AKEEZO",
    tagline: doc?.tagline || "Heal In India, Heal By Akeezo",
    legalEntityName: doc?.legalEntityName || "AKEEZO Healthcare Platform Private Limited",
    officeAddress:
      doc?.officeAddress || doc?.headquartersAddress || "Regus Elegance, Jasola District Centre, New Delhi, India 110025",
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
    secondaryColor: doc?.secondaryColor || "#FF6B00",
    accentColor: doc?.accentColor || "#FF6D1B",
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

export function renderFallback500Html(siteSettings: SiteSettingsDTO): string {
  const phone = siteSettings.phone || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");
  const careEmail = siteSettings.careEmail || "care@akeezo.com";
  const legalEntity = siteSettings.legalEntityName || "AKEEZO Healthcare Platform Private Limited";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Server Error (500) | AKEEZO Healthcare Platform</title>
  <link rel="icon" type="image/svg+xml" href="/logo/favicon.svg" />
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
    <p>© 2026 ${legalEntity}. All rights reserved. · Regulated under Indian Clinical Establishments Acts</p>
  </footer>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function handleSsr(req: Request, res: Response, next: NextFunction): Promise<void> {
  const url = req.originalUrl || req.url;

  // Skip static assets or API routes if any slip through
  if (
    url.startsWith("/api") ||
    url.startsWith("/@") ||
    url.startsWith("/node_modules") ||
    url.includes(".")
  ) {
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

    let dto: PublicRouteResponseDTO;
    let statusCode = 200;

    if (routeEntry) {
      if (routeEntry.redirectTo) {
        res.redirect(routeEntry.statusCode || 301, routeEntry.redirectTo);
        return;
      }

      const revision = routeEntry.publishedRevisionId
        ? await ContentRevision.findById(routeEntry.publishedRevisionId).lean()
        : null;

      const seo: SeoMetadata = revision?.seo || {
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
        payload: (revision?.payload as Record<string, unknown>) || {},
        revisionId: revision?._id?.toString(),
        siteSettings,
        statusCode: routeEntry.statusCode || 200
      };
      statusCode = dto.statusCode;
    } else {
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
    let render:
      | ((url: string, data: PublicRouteResponseDTO, options: any) => {
          pipe: (dest: any) => void;
          abort: () => void;
        })
      | null = null;

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
      } catch (err) {
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
      onShellError(err: unknown) {
        console.error("[Akeezo SSR Shell Error]:", err);
        if (!res.headersSent) {
          res.status(500).send("<!DOCTYPE html><html><body><h1>Internal Server Error</h1></body></html>");
        }
      },
      onError(err: unknown) {
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
  } catch (err) {
    console.error("[Akeezo SSR Handler Exception]:", err);
    next(err);
  }
}
