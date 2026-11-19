import mongoose from "mongoose";
import { Page, ContentRevision } from "../db/models/index.js";
import { SEED_TREATMENTS } from "./pageCmsSeedData.js";

export async function syncTreatmentsCatalog(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 1) return;

    const page = await Page.findOne({ slug: "treatments", locale: "en" });
    if (!page) return;

    const revId = page.publishedRevisionId || page.draftRevisionId;
    if (!revId) return;

    const rev = await ContentRevision.findById(revId);
    if (!rev) return;

    const existingTreatments = Array.isArray((rev.payload as any)?.treatments)
      ? (rev.payload as any).treatments
      : [];

    const existingSlugs = new Set(existingTreatments.map((t: any) => t.slug));
    const missingSeedTreatments = SEED_TREATMENTS.filter((t) => !existingSlugs.has(t.slug));

    const titleMismatch = existingTreatments.some((t: any) => {
      const seed = SEED_TREATMENTS.find((s) => s.slug === t.slug);
      return seed && seed.title !== t.title;
    });

    if (missingSeedTreatments.length > 0 || existingTreatments.length < 8 || titleMismatch) {
      // Merge: Keep custom edits, ensure all 8 core treatments exist
      const mergedTreatments = [...existingTreatments];
      for (const treatment of SEED_TREATMENTS) {
        const idx = mergedTreatments.findIndex((t: any) => t.slug === treatment.slug);
        if (idx >= 0) {
          mergedTreatments[idx] = { ...mergedTreatments[idx], ...treatment, title: treatment.title, category: treatment.category };
        } else {
          mergedTreatments.push(treatment);
        }
      }

      const priorityOrder = [
        "cosmetic-plastic-surgery",
        "dental-treatment",
        "hair-transplant",
        "orthopedic-surgery",
        "bariatric-weight-loss-surgery",
        "ivf-fertility-treatment",
        "cardiac-surgery",
        "oncology-cancer-care",
      ];
      mergedTreatments.sort((a: any, b: any) => {
        const idxA = priorityOrder.indexOf(a.slug);
        const idxB = priorityOrder.indexOf(b.slug);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });

      const updatedPayload = {
        ...(rev.payload || {}),
        treatments: mergedTreatments,
      };

      rev.payload = updatedPayload;
      await rev.save();
      console.log(`[Akeezo Treatments Sync] Synced ${mergedTreatments.length} treatments into Page CMS treatments catalog.`);
    }
  } catch (err: any) {
    console.warn("[Akeezo Treatments Sync] Non-critical warning:", err.message);
  }
}
