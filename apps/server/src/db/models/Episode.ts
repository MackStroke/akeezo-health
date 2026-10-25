import mongoose, { Schema, Document } from "mongoose";
import {
  EPISODE_TYPES,
  EPISODE_STATUSES,
  EpisodeType,
  EpisodeStatus,
} from "@akeezo/contracts";

export interface IEpisode extends Document {
  caseId: mongoose.Types.ObjectId;
  seriesId?: mongoose.Types.ObjectId;
  sequenceNo: number;
  cycleNo?: number;
  episodeType: EpisodeType;
  hospitalId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  treatmentName: string;
  plannedStart?: Date;
  plannedEnd?: Date;
  actualStart?: Date;
  actualEnd?: Date;
  admissionDate?: Date;
  dischargeDate?: Date;
  status: EpisodeStatus;
  cancelReason?: string;
  finalQuoteId?: mongoose.Types.ObjectId;
  expectedAmountMinor?: number;
  billedAmountMinor?: number;
  billedCurrency: string;
  billingFinalisedAt?: Date;
  version: number;
  legacyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EpisodeSchema = new Schema<IEpisode>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true },
    legacyId: { type: String, sparse: true, index: true },
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
  },
  { timestamps: true }
);

// Compound unique index for ordering within case
EpisodeSchema.index({ caseId: 1, sequenceNo: 1 }, { unique: true });

// CRITICAL DATABASE GUARD EP-3: Only one episode per case can be active at any given moment
EpisodeSchema.index(
  { caseId: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

export const EpisodeModel = mongoose.models.Episode || mongoose.model<IEpisode>("Episode", EpisodeSchema);

// Episode Series Model (e.g. 7 Chemotherapy Cycles)
export interface IEpisodeSeries extends Document {
  caseId: mongoose.Types.ObjectId;
  label: string;
  plannedTotal: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EpisodeSeriesSchema = new Schema<IEpisodeSeries>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    label: { type: String, required: true, trim: true },
    plannedTotal: { type: Number, required: true, min: 1 },
    notes: { type: String },
  },
  { timestamps: true }
);

export const EpisodeSeriesModel =
  mongoose.models.EpisodeSeries ||
  mongoose.model<IEpisodeSeries>("EpisodeSeries", EpisodeSeriesSchema);
