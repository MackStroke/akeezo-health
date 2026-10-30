import mongoose, { Schema } from "mongoose";
const BlogPostSchema = new Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, unique: true },
    excerpt: { type: String, default: "", trim: true },
    content: { type: String, required: true },
    category: { type: String, required: true, default: "Medical Travel Guide" },
    tags: { type: [String], default: [] },
    featuredImage: {
        url: { type: String, default: "" },
        alt: { type: String, default: "" },
        caption: { type: String, default: "" },
    },
    author: {
        name: { type: String, default: "Akeezo Medical Editorial Board" },
        role: { type: String, default: "Clinical Content Specialist" },
        avatarUrl: { type: String, default: "" },
    },
    status: {
        type: String,
        enum: ["draft", "review", "published", "archived"],
        default: "draft",
    },
    publishedAt: { type: Date },
    seo: {
        focusKeyword: { type: String, default: "", trim: true },
        seoTitle: { type: String, default: "", trim: true },
        metaDescription: { type: String, default: "", trim: true },
        canonicalUrl: { type: String, default: "" },
        ogImage: { type: String, default: "" },
        noIndex: { type: Boolean, default: false },
        seoScore: { type: Number, default: 0, min: 0, max: 100 },
        schemaType: { type: String, default: "MedicalWebPage" },
    },
    estimatedReadTime: { type: Number, default: 3 },
    medicalDisclaimerEnabled: { type: Boolean, default: true },
    viewsCount: { type: Number, default: 0 },
}, {
    timestamps: true,
});
BlogPostSchema.index({ slug: 1 }, { unique: true });
BlogPostSchema.index({ status: 1, publishedAt: -1 });
BlogPostSchema.index({ category: 1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ "seo.seoScore": -1 });
export const BlogPostModel = mongoose.models.BlogPost || mongoose.model("BlogPost", BlogPostSchema);
