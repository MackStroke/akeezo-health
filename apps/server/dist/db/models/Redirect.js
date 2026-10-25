import mongoose, { Schema } from "mongoose";
const RedirectSchema = new Schema({
    sourcePath: { type: String, required: true, unique: true, trim: true },
    destinationPath: { type: String, required: true, trim: true },
    statusCode: { type: Number, enum: [301, 302], default: 301 },
    enabled: { type: Boolean, default: true },
    hitsCount: { type: Number, default: 0 },
    lastHitAt: { type: Date },
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
}, {
    timestamps: true,
});
RedirectSchema.index({ enabled: 1 });
export const RedirectModel = mongoose.models.Redirect || mongoose.model("Redirect", RedirectSchema);
