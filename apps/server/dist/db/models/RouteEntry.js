import mongoose, { Schema } from "mongoose";
import { PageKindEnum } from "@akeezo/contracts";
const RouteEntrySchema = new Schema({
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
}, {
    timestamps: true
});
RouteEntrySchema.index({ locale: 1, path: 1 }, { unique: true });
export const RouteEntry = mongoose.models.RouteEntry || mongoose.model("RouteEntry", RouteEntrySchema);
