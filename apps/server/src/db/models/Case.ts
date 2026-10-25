import mongoose, { Schema, Document } from "mongoose";
import {
  CASE_STAGES,
  CASE_CLOSURE_REASONS,
  CASE_SOURCES,
  CASE_TYPES,
  CASE_URGENCIES,
  CaseStage,
  CaseClosureReason,
  CaseSource,
  CaseType,
  CaseUrgency,
} from "@akeezo/contracts";

export interface ICase extends Document {
  caseCode: string;
  patientId: mongoose.Types.ObjectId;
  partnerId?: mongoose.Types.ObjectId;
  source: CaseSource;
  caseType: CaseType;
  specialty: string;
  diagnosisSummary: string;
  urgency: CaseUrgency;
  preferredCity?: string;
  budgetMinMinor?: number;
  budgetMaxMinor?: number;
  budgetCurrency: string;
  patientInIndia: boolean;
  stage: CaseStage;
  stageChangedAt: Date;
  ownerId: mongoose.Types.ObjectId;
  status: "open" | "closed";
  closedReason?: CaseClosureReason;
  closedAt?: Date;
  feeDisclosedToPartner: boolean;
  feeDisclosedOn?: Date;
  referredOn: Date;
  version: number;
  activeEpisodeId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CaseSchema = new Schema<ICase>(
  {
    caseCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", index: true },
    source: { type: String, required: true, enum: CASE_SOURCES, default: "partner" },
    caseType: { type: String, required: true, enum: CASE_TYPES, default: "treatment" },
    specialty: { type: String, required: true, trim: true },
    diagnosisSummary: { type: String, required: true, trim: true },
    urgency: { type: String, required: true, enum: CASE_URGENCIES, default: "routine" },
    preferredCity: { type: String, trim: true },
    budgetMinMinor: { type: Number, min: 0 },
    budgetMaxMinor: { type: Number, min: 0 },
    budgetCurrency: { type: String, default: "INR" },
    patientInIndia: { type: Boolean, default: false },
    stage: { type: String, required: true, enum: CASE_STAGES, default: "new_referral", index: true },
    stageChangedAt: { type: Date, default: Date.now },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["open", "closed"], default: "open", index: true },
    closedReason: { type: String, enum: CASE_CLOSURE_REASONS },
    closedAt: { type: Date },
    feeDisclosedToPartner: { type: Boolean, default: false },
    feeDisclosedOn: { type: Date },
    referredOn: { type: Date, default: Date.now },
    version: { type: Number, default: 1 },
    activeEpisodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
  },
  { timestamps: true }
);

CaseSchema.index({ caseCode: "text", diagnosisSummary: "text", specialty: "text" });

// Static helper to generate next running case code
CaseSchema.statics.generateNextCaseCode = async function (): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `AKZ-${year}-`;
  const latest = await this.findOne({ caseCode: new RegExp(`^${prefix}`) })
    .sort({ caseCode: -1 })
    .lean();
  let nextSeq = 1;
  if (latest && latest.caseCode) {
    const parts = latest.caseCode.split("-");
    const num = parseInt(parts[2], 10);
    if (!isNaN(num)) nextSeq = num + 1;
  }
  return `${prefix}${String(nextSeq).padStart(5, "0")}`;
};

export const CaseModel = mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema);

// Case Stage History
export interface ICaseStageHistory extends Document {
  caseId: mongoose.Types.ObjectId;
  fromStage: CaseStage;
  toStage: CaseStage;
  reason?: string;
  movedBy: mongoose.Types.ObjectId;
  movedAt: Date;
}

const CaseStageHistorySchema = new Schema<ICaseStageHistory>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    fromStage: { type: String, required: true, enum: CASE_STAGES },
    toStage: { type: String, required: true, enum: CASE_STAGES },
    reason: { type: String },
    movedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

export const CaseStageHistoryModel =
  mongoose.models.CaseStageHistory ||
  mongoose.model<ICaseStageHistory>("CaseStageHistory", CaseStageHistorySchema);
