import { CommunityThreadModel } from "../db/models/index.js";
import { CURATED_COMMUNITY_THREADS } from "@akeezo/contracts";
export async function seedCommunity() {
    const count = await CommunityThreadModel.countDocuments();
    if (count > 0) {
        return;
    }
    console.log("[Akeezo Community Seed] Seeding initial curated medical travel threads & stories...");
    for (const thread of CURATED_COMMUNITY_THREADS) {
        await CommunityThreadModel.create({
            title: thread.title,
            slug: thread.slug,
            category: thread.category,
            tags: thread.tags,
            author: thread.author,
            content: thread.content,
            isStory: thread.isStory,
            storyDetails: thread.storyDetails,
            upvotes: thread.upvotes,
            viewsCount: thread.viewsCount,
            repliesCount: thread.replies.length,
            isDoctorAnswered: thread.isDoctorAnswered,
            doctorAnswerPreview: thread.doctorAnswerPreview,
            isPinned: thread.isPinned,
            status: thread.status,
            replies: thread.replies,
            createdAt: new Date(thread.createdAt),
            updatedAt: new Date(thread.createdAt),
        });
    }
    console.log(`[Akeezo Community Seed] Seeded ${CURATED_COMMUNITY_THREADS.length} threads successfully.`);
}
