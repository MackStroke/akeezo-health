import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import { RouteEntry, ContentRevision, SiteSettings } from "../db/models/index.js";
import type { PublicRouteResponseDTO, SeoMetadata } from "@akeezo/contracts";
import { toSafeSiteSettings } from "../ssr/renderer.js";
import { caseManagementRouter } from "./caseManagementRoutes.js";
import { authRouter } from "./authRoutes.js";
import { cmsAdminRouter } from "./cmsAdminRoutes.js";

export const apiRouter = Router();

// Authentication Router
apiRouter.use("/auth", authRouter);

// CMS & Website Frontend Administration Router
apiRouter.use("/admin", cmsAdminRouter);

// Case Management & Operations Router
apiRouter.use(caseManagementRouter);

// Health check
apiRouter.get("/health", (_req: Request, res: Response) => {
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

// GET /api/v1/site
apiRouter.get("/site", async (_req: Request, res: Response) => {
  try {
    const settingsDoc =
      mongoose.connection.readyState === 1
        ? (await SiteSettings.findOne({ environment: "development" }).lean()) ||
          (await SiteSettings.findOne().lean())
        : null;
    const siteSettings = toSafeSiteSettings(settingsDoc);
    res.json({ data: siteSettings });
  } catch (err) {
    res.json({ data: toSafeSiteSettings(null) });
  }
});

// GET /api/v1/route?path=/&locale=en
apiRouter.get("/route", async (req: Request, res: Response) => {
  try {
    const rawPath = typeof req.query.path === "string" ? req.query.path : "/";
    const locale = typeof req.query.locale === "string" ? req.query.locale : "en";
    const normalizedPath = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;

    let settingsDoc = null;
    let routeEntry = null;

    if (mongoose.connection.readyState === 1) {
      settingsDoc =
        (await SiteSettings.findOne({ environment: "development" }).lean()) ||
        (await SiteSettings.findOne().lean());
      routeEntry = await RouteEntry.findOne({ locale, path: normalizedPath }).lean();
    }

    const siteSettings = toSafeSiteSettings(settingsDoc);

    if (!routeEntry) {
      // Default home route response
      if (normalizedPath === "/") {
        const homeDto: PublicRouteResponseDTO = {
          pageKind: "home",
          path: "/",
          locale,
          seo: {
            title: "AKEEZO | Heal In India, Heal By Akeezo - Medical Tourism & Treatment in India",
            description:
              "Discover accredited Indian hospitals, consult top doctors, and receive guided care coordination and transparent cost estimates.",
            canonicalPath: "/",
            robots: "index,follow",
            schemaKind: "MedicalWebPage"
          },
          payload: {
            headline: "World-Class Medical Care in India, Simplified & Guided",
            tagline: "Heal In India, Heal By Akeezo"
          },
          siteSettings,
          statusCode: 200
        };
        res.json({ data: homeDto });
        return;
      }

      // Check legal compliance pages
      if (
        ["/privacy", "/terms", "/disclaimer", "/consent", "/refund-policy", "/grievance-officer"].includes(
          normalizedPath
        )
      ) {
        const legalDto: PublicRouteResponseDTO = {
          pageKind: "legal",
          path: normalizedPath,
          locale,
          seo: {
            title: `${normalizedPath.slice(1).replace("-", " ").toUpperCase()} | AKEEZO Healthcare Platform`,
            description: "Official legal, governance and compliance policies for AKEEZO Healthcare Platform.",
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

      const notFoundDto: PublicRouteResponseDTO = {
        pageKind: "notFound",
        path: normalizedPath,
        locale,
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

    const seo: SeoMetadata = revision?.seo || {
      title: "AKEEZO Healthcare Platform",
      description: "Heal In India, Heal By Akeezo - Medical Tourism & Healthcare Coordination",
      canonicalPath: normalizedPath,
      robots: "index,follow",
      schemaKind: "MedicalWebPage"
    };

    const dto: PublicRouteResponseDTO = {
      pageKind: routeEntry.pageKind,
      path: routeEntry.path,
      locale: routeEntry.locale || "en",
      seo,
      payload: (revision?.payload as Record<string, unknown>) || {},
      revisionId: revision?._id?.toString(),
      siteSettings,
      statusCode: routeEntry.statusCode || 200
    };

    res.json({ data: dto });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to resolve route" } });
  }
});
