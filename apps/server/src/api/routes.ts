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
  res.status(isDbConnected ? 200 : 503).json({
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
    const settingsDoc = await SiteSettings.findOne({ environment: "development" }).lean();
    const siteSettings = toSafeSiteSettings(settingsDoc);
    res.json({ data: siteSettings });
  } catch (err) {
    res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Failed to fetch site settings" } });
  }
});

// GET /api/v1/route?path=/&locale=en
apiRouter.get("/route", async (req: Request, res: Response) => {
  try {
    const rawPath = typeof req.query.path === "string" ? req.query.path : "/";
    const locale = typeof req.query.locale === "string" ? req.query.locale : "en";
    const normalizedPath = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;

    const settingsDoc = await SiteSettings.findOne({ environment: "development" }).lean();
    const siteSettings = toSafeSiteSettings(settingsDoc);

    const routeEntry = await RouteEntry.findOne({ locale, path: normalizedPath }).lean();

    if (!routeEntry) {
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
