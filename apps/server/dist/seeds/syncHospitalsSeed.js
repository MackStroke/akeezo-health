import mongoose from "mongoose";
import { Page, ContentRevision } from "../db/models/index.js";
import { SEED_HOSPITALS } from "./pageCmsSeedData.js";
export async function syncHospitalsCatalog() {
    try {
        if (mongoose.connection.readyState !== 1)
            return;
        const page = await Page.findOne({ slug: "hospitals", locale: "en" });
        if (!page)
            return;
        const revId = page.publishedRevisionId || page.draftRevisionId;
        if (!revId)
            return;
        const rev = await ContentRevision.findById(revId);
        if (!rev)
            return;
        const existingHospitals = Array.isArray(rev.payload?.hospitals)
            ? rev.payload.hospitals
            : [];
        const existingSlugs = new Set(existingHospitals.map((h) => h.slug));
        const missingSeedHospitals = SEED_HOSPITALS.filter((h) => !existingSlugs.has(h.slug));
        const nameMismatch = existingHospitals.some((h) => {
            const seed = SEED_HOSPITALS.find((s) => s.slug === h.slug);
            return seed && (seed.name !== h.name || (seed.location && seed.location !== h.location));
        });
        if (missingSeedHospitals.length > 0 || existingHospitals.length < 8 || nameMismatch) {
            // Merge: Keep any custom modifications made in admin, prepend the 8 prominent hospitals if missing
            const mergedHospitals = [...existingHospitals];
            for (const hosp of SEED_HOSPITALS) {
                const idx = mergedHospitals.findIndex((h) => h.slug === hosp.slug);
                if (idx >= 0) {
                    mergedHospitals[idx] = { ...mergedHospitals[idx], ...hosp, name: hosp.name, location: hosp.location || hosp.city };
                }
                else {
                    mergedHospitals.push(hosp);
                }
            }
            // Sort so prominent hospitals from the prompt appear first
            const priorityOrder = [
                "apollo-hospitals-delhi",
                "medanta-the-medicity",
                "fortis-memorial-research-institute",
                "max-super-speciality-hospital-saket",
                "manipal-hospital-bengaluru",
                "narayana-institute-cardiac-sciences",
                "kokilaben-dhirubhai-ambani-hospital",
                "artemis-hospital-gurugram",
            ];
            mergedHospitals.sort((a, b) => {
                const idxA = priorityOrder.indexOf(a.slug);
                const idxB = priorityOrder.indexOf(b.slug);
                if (idxA !== -1 && idxB !== -1)
                    return idxA - idxB;
                if (idxA !== -1)
                    return -1;
                if (idxB !== -1)
                    return 1;
                return 0;
            });
            const updatedPayload = {
                ...(rev.payload || {}),
                hospitals: mergedHospitals,
            };
            rev.payload = updatedPayload;
            await rev.save();
            console.log(`[Akeezo Hospitals Sync] Synced ${mergedHospitals.length} hospitals into Page CMS hospitals catalog.`);
        }
    }
    catch (err) {
        console.warn("[Akeezo Hospitals Sync] Non-critical warning:", err.message);
    }
}
