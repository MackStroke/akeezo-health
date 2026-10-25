import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IMediaAsset extends Document {
  originalFilename: string;
  storedFilename: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  url: string;
  altText: string;
  caption?: string;
  uploadedBy?: mongoose.Types.ObjectId;
  referencedIn: Array<{
    entityType: string;
    entityId: string;
    field: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<IMediaAsset>(
  {
    originalFilename: { type: String, required: true },
    storedFilename: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    width: { type: Number },
    height: { type: Number },
    url: { type: String, required: true },
    altText: { type: String, default: "" },
    caption: { type: String, default: "" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    referencedIn: [
      {
        entityType: { type: String, required: true },
        entityId: { type: String, required: true },
        field: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

MediaAssetSchema.index({ originalFilename: "text", altText: "text", caption: "text" });
MediaAssetSchema.index({ mimeType: 1, createdAt: -1 });

export const MediaAssetModel: Model<IMediaAsset> =
  mongoose.models.MediaAsset || mongoose.model<IMediaAsset>("MediaAsset", MediaAssetSchema);
