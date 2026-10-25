import mongoose, { Schema } from "mongoose";
const ContentRevisionSchema = new Schema({
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    locale: { type: String, required: true, default: "en" },
    revisionNumber: { type: Number, required: true },
    schemaVersion: { type: String, default: "1.0.0" },
    payload: { type: Schema.Types.Mixed, default: {} },
    seo: {
        title: { type: String, required: true },
        description: { type: String, required: true },
        canonicalPath: { type: String, required: true },
        ogMediaId: { type: String },
        robots: { type: String, default: "index,follow" },
        schemaKind: { type: String, default: "MedicalWebPage" }
    },
    sourceReferences: [
        {
            urlOrId: { type: String, required: true },
            publisher: { type: String, required: true },
            checkedAt: { type: Date, required: true },
            claimScope: { type: String, required: true },
            evidenceOwner: { type: String, required: true }
        }
    ],
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
ContentRevisionSchema.index({ entityType: 1, entityId: 1, locale: 1, revisionNumber: 1 }, { unique: true });
export const ContentRevision = mongoose.models.ContentRevision ||
    mongoose.model("ContentRevision", ContentRevisionSchema);
