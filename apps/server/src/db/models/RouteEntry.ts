import mongoose, { Schema, type Document, type Model } from "mongoose";
import { PageKindEnum, type PageKind } from "@akeezo/contracts";

export interface IRouteEntry extends Document {
  locale: string;
  path: string;
  pageKind: PageKind;
  entityId?: mongoose.Types.ObjectId;
  publishedRevisionId?: mongoose.Types.ObjectId;
  redirectTo?: string;
  statusCode?: number;
  createdAt: Date;
  updatedAt: Date;
}

const RouteEntrySchema = new Schema<IRouteEntry>(
  {
    locale: { type: String, required: true, default: "en" },
    path: { type: String, required: true },
    pageKind: {
      type: String,
      required: true,
      enum: PageKindEnum.options
    },
    entityId: { type: Schema.Types.ObjectId, ref: "Page" },
    publishedRevisionId: { type: Schema.Types.ObjectId, ref: "ContentRevision" },
    redirectTo: { type: String },
    statusCode: { type: Number, default: 200 }
  },
  {
    timestamps: true
  }
);

RouteEntrySchema.index({ locale: 1, path: 1 }, { unique: true });

export const RouteEntry: Model<IRouteEntry> =
  mongoose.models.RouteEntry || mongoose.model<IRouteEntry>("RouteEntry", RouteEntrySchema);
