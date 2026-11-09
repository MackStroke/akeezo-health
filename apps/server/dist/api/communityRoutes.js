import { Router } from "express";
import mongoose from "mongoose";
import { CreateCommunityThreadInputSchema, CreateCommunityReplyInputSchema, CURATED_COMMUNITY_THREADS, getCommunityThreadBySlug, } from "@akeezo/contracts";
import { CommunityThreadModel } from "../db/models/index.js";
export const communityRouter = Router();
function slugify(text) {
    const base = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
}
// In-memory fallback array when DB is offline or in test mock
const fallbackThreads = [...CURATED_COMMUNITY_THREADS];
// GET /api/v1/community
communityRouter.get("/", async (req, res) => {
    try {
        const category = req.query.category || "All Topics";
        const tab = req.query.tab || "trending";
        const search = (req.query.search || "").trim().toLowerCase();
        const page = Math.max(1, parseInt(req.query.page || "1", 10));
        const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || "10", 10)));
        if (mongoose.connection.readyState === 1) {
            const filter = { status: "published" };
            if (category && category !== "All Topics") {
                filter.category = category;
            }
            if (tab === "doctor_answered") {
                filter.isDoctorAnswered = true;
            }
            else if (tab === "stories") {
                filter.isStory = true;
            }
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { content: { $regex: search, $options: "i" } },
                    { tags: { $regex: search, $options: "i" } },
                    { "author.country": { $regex: search, $options: "i" } },
                ];
            }
            let sort = { isPinned: -1, upvotes: -1, createdAt: -1 };
            if (tab === "recent") {
                sort = { isPinned: -1, createdAt: -1 };
            }
            const total = await CommunityThreadModel.countDocuments(filter);
            const threads = await CommunityThreadModel.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();
            return res.json({
                data: {
                    threads,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit) || 1,
                },
            });
        }
        // In-memory fallback
        let filtered = fallbackThreads.filter((t) => t.status === "published");
        if (category && category !== "All Topics") {
            filtered = filtered.filter((t) => t.category === category);
        }
        if (tab === "doctor_answered") {
            filtered = filtered.filter((t) => t.isDoctorAnswered);
        }
        else if (tab === "stories") {
            filtered = filtered.filter((t) => t.isStory);
        }
        if (search) {
            filtered = filtered.filter((t) => t.title.toLowerCase().includes(search) ||
                t.content.toLowerCase().includes(search) ||
                t.tags.some((tag) => tag.toLowerCase().includes(search)));
        }
        if (tab === "recent") {
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        else {
            filtered.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0) || b.upvotes - a.upvotes);
        }
        const total = filtered.length;
        const paginated = filtered.slice((page - 1) * limit, page * limit);
        return res.json({
            data: {
                threads: paginated,
                total,
                page,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    }
    catch (err) {
        console.error("[Community GET Error]:", err);
        return res.status(500).json({ error: "Failed to fetch community discussions" });
    }
});
// GET /api/v1/community/:slug
communityRouter.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        if (mongoose.connection.readyState === 1) {
            const thread = await CommunityThreadModel.findOneAndUpdate({ slug, status: "published" }, { $inc: { viewsCount: 1 } }, { new: true }).lean();
            if (thread) {
                return res.json({ data: thread });
            }
        }
        const fallback = getCommunityThreadBySlug(slug, fallbackThreads);
        if (!fallback || fallback.status !== "published") {
            return res.status(404).json({ error: "Community discussion thread not found" });
        }
        fallback.viewsCount += 1;
        return res.json({ data: fallback });
    }
    catch (err) {
        console.error("[Community GET by Slug Error]:", err);
        return res.status(500).json({ error: "Failed to fetch thread details" });
    }
});
// POST /api/v1/community
communityRouter.post("/", async (req, res) => {
    try {
        const parsed = CreateCommunityThreadInputSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ error: "Validation failed", details: parsed.error.format() });
        }
        const input = parsed.data;
        const slug = slugify(input.title);
        const id = `thread-${Date.now()}`;
        const newThread = {
            id,
            title: input.title,
            slug,
            category: input.category,
            tags: input.tags || [],
            author: {
                name: input.isAnonymous ? "Anonymous Patient" : input.authorName,
                country: input.authorCountry,
                countryCode: input.authorCountryCode,
                avatar: "/uploads/about/testi-review.webp",
                isAnonymous: input.isAnonymous,
                isVerifiedPatient: true,
            },
            content: input.content,
            isStory: input.isStory,
            storyDetails: input.storyDetails,
            upvotes: 1,
            viewsCount: 1,
            repliesCount: 0,
            isDoctorAnswered: false,
            isPinned: false,
            status: "published",
            createdAt: new Date().toISOString(),
            replies: [],
        };
        if (mongoose.connection.readyState === 1) {
            const created = await CommunityThreadModel.create({
                ...newThread,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            return res.status(201).json({
                data: created.toObject(),
                message: "Your question has been posted to the community!",
            });
        }
        fallbackThreads.unshift(newThread);
        return res.status(201).json({
            data: newThread,
            message: "Your question has been posted to the community!",
        });
    }
    catch (err) {
        console.error("[Community POST Error]:", err);
        return res.status(500).json({ error: "Failed to submit community discussion" });
    }
});
// POST /api/v1/community/:threadId/replies
communityRouter.post("/:threadId/replies", async (req, res) => {
    try {
        const { threadId } = req.params;
        const parsed = CreateCommunityReplyInputSchema.safeParse({ ...req.body, threadId });
        if (!parsed.success) {
            return res.status(400).json({ error: "Validation failed", details: parsed.error.format() });
        }
        const input = parsed.data;
        const replyId = `rep-${Date.now()}`;
        const newReply = {
            id: replyId,
            threadId,
            author: {
                name: input.authorName,
                role: input.authorRole,
                doctorId: input.doctorId,
                specialty: input.specialty,
                hospitalName: input.hospitalName,
                avatar: input.authorRole === "doctor" ? "/uploads/doctors/doctor-2220.jpg" : "/uploads/about/testi-review.webp",
            },
            content: input.content,
            upvotes: 0,
            isVerifiedDoctorResponse: input.isVerifiedDoctorResponse || input.authorRole === "doctor",
            createdAt: new Date().toISOString(),
        };
        if (mongoose.connection.readyState === 1) {
            const updateData = {
                $push: { replies: newReply },
                $inc: { repliesCount: 1 },
            };
            if (newReply.isVerifiedDoctorResponse) {
                updateData.$set = {
                    isDoctorAnswered: true,
                    doctorAnswerPreview: {
                        doctorId: input.doctorId,
                        doctorName: input.authorName,
                        doctorSpecialty: input.specialty || "Specialist Physician",
                        hospitalName: input.hospitalName || "Partner Hospital",
                        doctorImage: "/uploads/doctors/doctor-2220.jpg",
                        answerSnippet: input.content.slice(0, 160) + (input.content.length > 160 ? "..." : ""),
                    },
                };
            }
            const updated = await CommunityThreadModel.findOneAndUpdate({ $or: [{ _id: mongoose.isValidObjectId(threadId) ? threadId : undefined }, { id: threadId }, { slug: threadId }] }, updateData, { new: true }).lean();
            if (!updated) {
                return res.status(404).json({ error: "Thread not found" });
            }
            return res.status(201).json({ data: newReply });
        }
        const thread = fallbackThreads.find((t) => t.id === threadId || t.slug === threadId);
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }
        thread.replies.push(newReply);
        thread.repliesCount += 1;
        if (newReply.isVerifiedDoctorResponse) {
            thread.isDoctorAnswered = true;
            thread.doctorAnswerPreview = {
                doctorId: input.doctorId,
                doctorName: input.authorName,
                doctorSpecialty: input.specialty || "Specialist Physician",
                hospitalName: input.hospitalName || "Partner Hospital",
                doctorImage: "/uploads/doctors/doctor-2220.jpg",
                answerSnippet: input.content.slice(0, 160) + "...",
            };
        }
        return res.status(201).json({ data: newReply });
    }
    catch (err) {
        console.error("[Community Reply Error]:", err);
        return res.status(500).json({ error: "Failed to submit reply" });
    }
});
// POST /api/v1/community/:threadId/upvote
communityRouter.post("/:threadId/upvote", async (req, res) => {
    try {
        const { threadId } = req.params;
        if (mongoose.connection.readyState === 1) {
            const updated = await CommunityThreadModel.findOneAndUpdate({ $or: [{ _id: mongoose.isValidObjectId(threadId) ? threadId : undefined }, { id: threadId }, { slug: threadId }] }, { $inc: { upvotes: 1 } }, { new: true }).lean();
            if (updated) {
                return res.json({ data: { upvotes: updated.upvotes } });
            }
        }
        const thread = fallbackThreads.find((t) => t.id === threadId || t.slug === threadId);
        if (thread) {
            thread.upvotes += 1;
            return res.json({ data: { upvotes: thread.upvotes } });
        }
        return res.status(404).json({ error: "Thread not found" });
    }
    catch (err) {
        console.error("[Community Upvote Error]:", err);
        return res.status(500).json({ error: "Failed to upvote" });
    }
});
