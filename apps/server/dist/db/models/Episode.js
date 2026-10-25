import mongoose, { Schema } from "mongoose";
import { EPISODE_TYPES, EPISODE_STATUSES, } from "@akeezo/contracts";
const EpisodeSchema = new Schema({
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    seriesId: { type: Schema.Types.ObjectId, ref: "EpisodeSeries", index: true },
    sequenceNo: { type: Number, required: true },
    cycleNo: { type: Number },
    episodeType: { type: String, required: true, enum: EPISODE_TYPES },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    treatmentName: { type: String, required: true, trim: true },
    plannedStart: { type: Date },
    plannedEnd: { type: Date },
    actualStart: { type: Date },
    actualEnd: { type: Date },
    admissionDate: { type: Date },
    dischargeDate: { type: Date },
    status: { type: String, required: true, enum: EPISODE_STATUSES, default: "planned", index: true },
    cancelReason: { type: String },
    finalQuoteId: { type: Schema.Types.ObjectId, ref: "Quote" },
    expectedAmountMinor: { type: Number, min: 0 },
    billedAmountMinor: { type: Number, min: 0 },
    billedCurrency: { type: String, default: "INR" },
    billingFinalisedAt: { type: Date },
    version: { type: Number, default: 1 },
}, { timestamps: true });
// Compound unique index for ordering within case
EpisodeSchema.index({ caseId: 1, sequenceNo: 1 }, { unique: true });
// CRITICAL DATABASE GUARD EP-3: Only one episode per case can be active at any given moment
EpisodeSchema.index({ caseId: 1 }, { unique: true, partialFilterExpression: { status: "active" } });
export const EpisodeModel = mongoose.models.Episode || mongoose.model("Episode", EpisodeSchema);
const EpisodeSeriesSchema = new Schema({
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    label: { type: String, required: true, trim: true },
    plannedTotal: { type: Number, required: true, min: 1 },
    notes: { type: String },
}, { timestamps: true });
export const EpisodeSeriesModel = mongoose.models.EpisodeSeries ||
    mongoose.model("EpisodeSeries", EpisodeSeriesSchema);
