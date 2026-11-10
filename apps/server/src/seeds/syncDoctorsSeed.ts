import mongoose from "mongoose";
import { Page, ContentRevision } from "../db/models/index.js";
import { SEED_DOCTORS } from "./pageCmsSeedData.js";

export async function syncDoctorsCatalog(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 1) return;

    const page = await Page.findOne({ slug: "doctors", locale: "en" });
    if (!page) return;

    const revId = page.publishedRevisionId || page.draftRevisionId;
    if (!revId) return;

    const rev = await ContentRevision.findById(revId);
    if (!rev) return;

    const existingDoctors = Array.isArray((rev.payload as any)?.doctors)
      ? (rev.payload as any).doctors
      : [];

    const existingSlugs = new Set(existingDoctors.map((d: any) => d.slug));
    const missingSeedDoctors = SEED_DOCTORS.filter((d) => !existingSlugs.has(d.slug));

    if (missingSeedDoctors.length > 0 || existingDoctors.length < 8) {
      // Merge: Keep any custom modifications made in admin, prepend the 8 prominent doctors if missing
      const mergedDoctors = [...existingDoctors];
      for (const doc of SEED_DOCTORS) {
        const idx = mergedDoctors.findIndex((d: any) => d.slug === doc.slug);
        if (idx >= 0) {
          mergedDoctors[idx] = { ...doc, ...mergedDoctors[idx] };
        } else {
          mergedDoctors.push(doc);
        }
      }

      // Sort so prominent doctors from the prompt appear first
      const priorityOrder = [
        "ashok-rajgopal",
        "dr-naresh-trehan",
        "arvinder-singh-soin",
        "sandeep-vaishya",
        "vinod-raina",
        "bs-murthy",
        "subhash-gupta",
        "zs-meharwal",
      ];
      mergedDoctors.sort((a: any, b: any) => {
        const idxA = priorityOrder.indexOf(a.slug);
        const idxB = priorityOrder.indexOf(b.slug);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        return 0;
      });

      const updatedPayload = {
        ...(rev.payload || {}),
        doctors: mergedDoctors,
      };

      rev.payload = updatedPayload;
      await rev.save();
      console.log(`[Akeezo Doctors Sync] Synced ${mergedDoctors.length} doctors into Page CMS doctors catalog.`);
    }
  } catch (err: any) {
    console.warn("[Akeezo Doctors Sync] Non-critical warning:", err.message);
  }
}
