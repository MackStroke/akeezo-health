import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface IRedirect extends Document {
  sourcePath: string;
  destinationPath: string;
  statusCode: number; // 301 or 302
  enabled: boolean;
  hitsCount: number;
  lastHitAt?: Date;
  notes?: string;
  createdBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RedirectSchema = new Schema<IRedirect>(
  {
    sourcePath: { type: String, required: true, unique: true, trim: true },
    destinationPath: { type: String, required: true, trim: true },
    statusCode: { type: Number, enum: [301, 302], default: 301 },
    enabled: { type: Boolean, default: true },
    hitsCount: { type: Number, default: 0 },
    lastHitAt: { type: Date },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

RedirectSchema.index({ enabled: 1 });

export const RedirectModel: Model<IRedirect> =
  mongoose.models.Redirect || mongoose.model<IRedirect>("Redirect", RedirectSchema);
