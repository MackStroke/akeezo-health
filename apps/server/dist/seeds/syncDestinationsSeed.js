import mongoose from "mongoose";
import { Page, ContentRevision } from "../db/models/index.js";
import { SEED_DESTINATIONS } from "./pageCmsSeedData.js";
export async function syncDestinationsCatalog() {
    try {
        if (mongoose.connection.readyState !== 1)
            return;
        const page = await Page.findOne({ slug: "destinations", locale: "en" });
        if (!page)
            return;
        const revId = page.publishedRevisionId || page.draftRevisionId;
        if (!revId)
            return;
        const rev = await ContentRevision.findById(revId);
        if (!rev)
            return;
        const existingDestinations = Array.isArray(rev.payload?.destinations)
            ? rev.payload.destinations
            : [];
        const existingSlugs = new Set(existingDestinations.map((d) => d.slug));
        const missingSeedDestinations = SEED_DESTINATIONS.filter((d) => !existingSlugs.has(d.slug));
        if (missingSeedDestinations.length > 0 || existingDestinations.length < 4) {
            const mergedDestinations = [...existingDestinations];
            for (const dest of SEED_DESTINATIONS) {
                const idx = mergedDestinations.findIndex((d) => d.slug === dest.slug);
                if (idx >= 0) {
                    mergedDestinations[idx] = { ...mergedDestinations[idx], ...dest };
                }
                else {
                    mergedDestinations.push(dest);
                }
            }
            const priorityOrder = ["india", "turkey", "thailand", "united-arab-emirates", "mexico"];
            mergedDestinations.sort((a, b) => {
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
                destinations: mergedDestinations,
            };
            rev.payload = updatedPayload;
            await rev.save();
            console.log(`[Akeezo Destinations Sync] Synced ${mergedDestinations.length} destinations into Page CMS destinations catalog.`);
        }
    }
    catch (err) {
        console.warn("[Akeezo Destinations Sync] Non-critical warning:", err.message);
    }
}
