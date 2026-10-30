import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IChangelogItem {
  id?: string;
  type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
  text: string;
  badge?: string;
}

export interface IChangelog extends Document {
  version: string;
  title: string;
  summary?: string;
  releaseDate: Date;
  category: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
  status: "draft" | "published" | "archived";
  audience: "all" | "public" | "internal" | "partners";
  items: IChangelogItem[];
  modules: string[];
  authorName: string;
  authorId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ChangelogItemSchema = new Schema<IChangelogItem>(
  {
    type: {
      type: String,
      enum: ["feature", "improvement", "fix", "security", "maintenance", "breaking"],
      default: "improvement",
    },
    text: { type: String, required: true, trim: true },
    badge: { type: String, trim: true },
  },
  { _id: true }
);

const ChangelogSchema = new Schema<IChangelog>(
  {
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
  },
  {
    timestamps: true,
  }
);

ChangelogSchema.index({ releaseDate: -1 });
ChangelogSchema.index({ status: 1, releaseDate: -1 });
ChangelogSchema.index({ version: 1 }, { unique: true });
ChangelogSchema.index({ category: 1 });

export const ChangelogModel: Model<IChangelog> =
  mongoose.models.Changelog || mongoose.model<IChangelog>("Changelog", ChangelogSchema);
