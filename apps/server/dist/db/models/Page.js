import mongoose, { Schema } from "mongoose";
const PageSchema = new Schema({
    entityType: { type: String, default: "page", required: true },
    slug: { type: String, required: true },
    locale: { type: String, default: "en", required: true },
    localeGroupId: { type: String, required: true },
    status: {
        type: String,
        enum: ["draft", "review", "published", "archived"],
        default: "draft",
        required: true
    },
    draftRevisionId: { type: Schema.Types.ObjectId, ref: "ContentRevision" },
    publishedRevisionId: { type: Schema.Types.ObjectId, ref: "ContentRevision" },
    version: { type: Number, default: 1 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    archivedAt: { type: Date }
}, {
    timestamps: true
});
PageSchema.index({ locale: 1, slug: 1 }, { unique: true });
export const Page = mongoose.models.Page || mongoose.model("Page", PageSchema);
