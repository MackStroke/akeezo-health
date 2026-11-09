import mongoose, { Schema } from "mongoose";
const CommunityReplySchema = new Schema({
    id: { type: String, required: true },
    author: {
        name: { type: String, required: true },
        role: { type: String, enum: ["patient", "doctor", "care_coordinator", "admin"], default: "patient" },
        doctorId: { type: String },
        specialty: { type: String },
        hospitalName: { type: String },
        avatar: { type: String, default: "/uploads/about/testi-review.webp" },
    },
    content: { type: String, required: true, trim: true },
    upvotes: { type: Number, default: 0 },
    isVerifiedDoctorResponse: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
}, { _id: false });
const CommunityThreadSchema = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: "Cosmetic & Plastic Surgery" },
    tags: { type: [String], default: [] },
    author: {
        name: { type: String, required: true, default: "International Patient" },
        country: { type: String, default: "International Patient" },
        countryCode: { type: String, default: "US" },
        avatar: { type: String, default: "/uploads/about/testi-review.webp" },
        isAnonymous: { type: Boolean, default: false },
        isVerifiedPatient: { type: Boolean, default: true },
    },
    content: { type: String, required: true },
    isStory: { type: Boolean, default: false },
    storyDetails: {
        hospitalName: { type: String },
        procedure: { type: String },
        costUsd: { type: String },
        recoveryDays: { type: Number },
        rating: { type: Number, default: 5 },
    },
    upvotes: { type: Number, default: 0 },
    viewsCount: { type: Number, default: 0 },
    repliesCount: { type: Number, default: 0 },
    isDoctorAnswered: { type: Boolean, default: false },
    doctorAnswerPreview: {
        doctorId: { type: String },
        doctorName: { type: String },
        doctorSpecialty: { type: String },
        hospitalName: { type: String },
        doctorImage: { type: String },
        answerSnippet: { type: String },
    },
    isPinned: { type: Boolean, default: false },
    status: { type: String, enum: ["published", "pending_review", "hidden"], default: "published" },
    replies: { type: [CommunityReplySchema], default: [] },
}, { timestamps: true });
// Search indexes
CommunityThreadSchema.index({ slug: 1 }, { unique: true });
CommunityThreadSchema.index({ category: 1, status: 1 });
CommunityThreadSchema.index({ isPinned: -1, upvotes: -1, createdAt: -1 });
CommunityThreadSchema.index({ title: "text", content: "text", tags: "text" });
export const CommunityThreadModel = mongoose.models.CommunityThread ||
    mongoose.model("CommunityThread", CommunityThreadSchema);
