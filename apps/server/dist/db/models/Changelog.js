import mongoose, { Schema } from "mongoose";
const ChangelogItemSchema = new Schema({
    type: {
        type: String,
        enum: ["feature", "improvement", "fix", "security", "maintenance", "breaking"],
        default: "improvement",
    },
    text: { type: String, required: true, trim: true },
    badge: { type: String, trim: true },
}, { _id: true });
const ChangelogSchema = new Schema({
    version: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, trim: true, default: "" },
    releaseDate: { type: Date, required: true, default: Date.now },
    category: {
        type: String,
        enum: ["feature", "improvement", "fix", "security", "maintenance", "breaking"],
        default: "feature",
    },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "published",
    },
    audience: {
        type: String,
        enum: ["all", "public", "internal", "partners"],
        default: "all",
    },
    items: { type: [ChangelogItemSchema], default: [] },
    modules: { type: [String], default: [] },
    authorName: { type: String, default: "Akeezo Engineering" },
    authorId: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String, default: "" },
}, {
    timestamps: true,
});
ChangelogSchema.index({ releaseDate: -1 });
ChangelogSchema.index({ status: 1, releaseDate: -1 });
ChangelogSchema.index({ version: 1 });
ChangelogSchema.index({ category: 1 });
export const ChangelogModel = mongoose.models.Changelog || mongoose.model("Changelog", ChangelogSchema);
