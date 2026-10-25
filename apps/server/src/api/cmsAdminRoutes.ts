import { Router, type Request, type Response } from "express";
import mongoose from "mongoose";
import {
  SiteSettings,
  Page,
  ContentRevision,
  RouteEntry,
  EnquiryModel,
} from "../db/models/index.js";

export const cmsAdminRouter = Router();

// ==========================================
// 1. SITE & BRAND SETTINGS MANAGEMENT
// ==========================================

// GET /api/v1/admin/site-settings
cmsAdminRouter.get("/site-settings", async (_req: Request, res: Response) => {
  try {
    let settings: any = await SiteSettings.findOne({ environment: "development" }).lean();
    if (!settings) {
      settings = await SiteSettings.create({
        environment: "development",
        brandName: "AKEEZO",
        tagline: "Heal In India, Heal By Akeezo",
      });
    }
    res.json({ data: settings });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_SETTINGS_FAILED", message: err.message } });
  }
});

// PUT /api/v1/admin/site-settings
cmsAdminRouter.put("/site-settings", async (req: Request, res: Response) => {
  try {
    const updated = await SiteSettings.findOneAndUpdate(
      { environment: "development" },
      {
        $set: {
          brandName: req.body.brandName,
          tagline: req.body.tagline,
          logoVariants: req.body.logoVariants,
          primaryColor: req.body.primaryColor,
          actionColor: req.body.actionColor,
          contactEmail: req.body.contactEmail,
          careEmail: req.body.careEmail,
          medicalEmail: req.body.medicalEmail,
          partnershipEmail: req.body.partnershipEmail,
          emergencyHelpline: req.body.emergencyHelpline,
          whatsappHelpline: req.body.whatsappHelpline,
          showTopUtilityBar: req.body.showTopUtilityBar,
          emergencyNotice: req.body.emergencyNotice,
          headquartersAddress: req.body.headquartersAddress,
          socialLinks: req.body.socialLinks,
        },
        $inc: { version: 1 },
      },
      { upsert: true, new: true }
    );
    res.json({ data: updated });
  } catch (err: any) {
    res.status(400).json({ error: { code: "UPDATE_SETTINGS_FAILED", message: err.message } });
  }
});

// ==========================================
// 2. PAGES & CONTENT REVISION MANAGEMENT
// ==========================================

// GET /api/v1/admin/pages (List all editable website pages)
cmsAdminRouter.get("/pages", async (_req: Request, res: Response) => {
  try {
    const pages = await Page.find({ locale: "en" })
      .populate("publishedRevisionId")
      .populate("draftRevisionId")
      .sort({ slug: 1 })
      .lean();

    const formatted = pages.map((p) => {
      const pubRev = p.publishedRevisionId as any;
      return {
        id: p._id,
        slug: p.slug,
        title: pubRev?.seo?.title || p.slug.toUpperCase(),
        status: p.status,
        version: p.version,
        publishedAt: pubRev?.createdAt,
        path: p.slug === "home" ? "/" : `/${p.slug}`,
      };
    });

    res.json({ data: formatted });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_PAGES_FAILED", message: err.message } });
  }
});

// GET /api/v1/admin/pages/:slug (Get single page with current revision payload)
cmsAdminRouter.get("/pages/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const page = await Page.findOne({ slug, locale: "en" }).lean();
    if (!page) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: `Page '${slug}' not found.` } });
    }

    const revisionId = page.publishedRevisionId || page.draftRevisionId;
    const revision = revisionId ? await ContentRevision.findById(revisionId).lean() : null;

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
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_PAGE_FAILED", message: err.message } });
  }
});

// PUT /api/v1/admin/pages/:slug (Save & Publish Page Content Revision)
cmsAdminRouter.put("/pages/:slug", async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const { payload, seo, publishImmediately = true } = req.body;

    let page = await Page.findOne({ slug, locale: "en" });
    if (!page) {
      page = await Page.create({
        slug,
        locale: "en",
        localeGroupId: `group_${slug}`,
        status: "draft",
        version: 1,
      });
    }

    // Determine next revision number
    const prevRev = page.publishedRevisionId
      ? await ContentRevision.findById(page.publishedRevisionId)
      : null;
    const nextRevisionNumber = (prevRev?.revisionNumber || 0) + 1;

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
      await RouteEntry.findOneAndUpdate(
        { locale: "en", path: canonicalPath },
        {
          $set: {
            pageKind: slug === "home" ? "home" : "legal",
            publishedRevisionId: revision._id,
            statusCode: 200,
          },
        },
        { upsert: true }
      );
    }

    res.json({
      data: {
        page,
        revision,
        published: publishImmediately,
        message: `Page '${slug}' updated and published successfully to live website.`,
      },
    });
  } catch (err: any) {
    res.status(400).json({ error: { code: "SAVE_PAGE_FAILED", message: err.message } });
  }
});

// ==========================================
// 3. PUBLIC ENQUIRIES & LEADS MANAGEMENT
// ==========================================

// GET /api/v1/admin/enquiries
cmsAdminRouter.get("/enquiries", async (req: Request, res: Response) => {
  try {
    const filter: Record<string, any> = {};
    if (req.query.status) filter.status = req.query.status;

    const enquiries = await EnquiryModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({ data: enquiries });
  } catch (err: any) {
    res.status(500).json({ error: { code: "FETCH_ENQUIRIES_FAILED", message: err.message } });
  }
});

// POST /api/v1/admin/enquiries (Mock or test enquiry creation)
cmsAdminRouter.post("/enquiries", async (req: Request, res: Response) => {
  try {
    const count = await EnquiryModel.countDocuments();
    const receiptId = `ENQ-2026-${String(count + 1).padStart(4, "0")}`;

    const validServices = ["medical_tourism", "emergency", "home_healthcare", "consultation", "general"];
    const serviceType = validServices.includes(req.body.serviceType) ? req.body.serviceType : "medical_tourism";
    const requesterName = req.body.requesterName || req.body.name || "Anonymous Lead";

    const enquiry = await EnquiryModel.create({
      receiptId,
      requesterName,
      email: req.body.email,
      phone: req.body.phone,
      serviceType,
      message: req.body.message,
      sourcePath: req.body.sourcePath || "/",
      status: req.body.status || "received",
      notes: req.body.notes,
    });

    res.status(201).json({ data: enquiry });
  } catch (err: any) {
    res.status(400).json({ error: { code: "CREATE_ENQUIRY_FAILED", message: err.message } });
  }
});

// PATCH /api/v1/admin/enquiries/:id (and /enquiries/:id/status)
cmsAdminRouter.patch(["/enquiries/:id", "/enquiries/:id/status"], async (req: Request, res: Response) => {
  try {
    const updated = await EnquiryModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status: req.body.status,
          notes: req.body.notes,
          assignedCoordinatorId: req.body.assignedCoordinatorId,
        },
      },
      { new: true }
    );
    res.json({ data: updated });
  } catch (err: any) {
    res.status(400).json({ error: { code: "UPDATE_ENQUIRY_FAILED", message: err.message } });
  }
});
