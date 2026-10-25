import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IContentRevision extends Document {
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  locale: string;
  revisionNumber: number;
  schemaVersion: string;
  payload: Record<string, unknown>;
  seo: {
    title: string;
    description: string;
    canonicalPath: string;
    ogMediaId?: string;
    robots: string;
    schemaKind: string;
  };
  sourceReferences: Array<{
    urlOrId: string;
    publisher: string;
    checkedAt: Date;
    claimScope: string;
    evidenceOwner: string;
  }>;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ContentRevisionSchema = new Schema<IContentRevision>(
  {
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
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

ContentRevisionSchema.index(
  { entityType: 1, entityId: 1, locale: 1, revisionNumber: 1 },
  { unique: true }
);

export const ContentRevision: Model<IContentRevision> =
  mongoose.models.ContentRevision ||
  mongoose.model<IContentRevision>("ContentRevision", ContentRevisionSchema);
