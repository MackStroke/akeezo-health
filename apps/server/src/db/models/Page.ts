import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IPage extends Document {
  entityType: string;
  slug: string;
  locale: string;
  localeGroupId: string;
  status: "draft" | "review" | "published" | "archived";
  draftRevisionId?: mongoose.Types.ObjectId;
  publishedRevisionId?: mongoose.Types.ObjectId;
  version: number;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date;
}

const PageSchema = new Schema<IPage>(
  {
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
  },
  {
    timestamps: true
  }
);

PageSchema.index({ locale: 1, slug: 1 }, { unique: true });

export const Page: Model<IPage> =
  mongoose.models.Page || mongoose.model<IPage>("Page", PageSchema);
