import mongoose, { Schema } from "mongoose";
import { CASE_STAGES, CASE_CLOSURE_REASONS, CASE_SOURCES, CASE_TYPES, CASE_URGENCIES, } from "@akeezo/contracts";
const CaseSchema = new Schema({
    caseCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    legacyId: { type: String, sparse: true, index: true },
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
}, { timestamps: true });
CaseSchema.index({ caseCode: "text", diagnosisSummary: "text", specialty: "text" });
// Static helper to generate next running case code
CaseSchema.statics.generateNextCaseCode = async function () {
    const year = new Date().getFullYear();
    const prefix = `AKZ-${year}-`;
    const latest = await this.findOne({ caseCode: new RegExp(`^${prefix}`) })
        .sort({ caseCode: -1 })
        .lean();
    let nextSeq = 1;
    if (latest && latest.caseCode) {
        const parts = latest.caseCode.split("-");
        const num = parseInt(parts[2], 10);
        if (!isNaN(num))
            nextSeq = num + 1;
    }
    return `${prefix}${String(nextSeq).padStart(5, "0")}`;
};
export const CaseModel = mongoose.models.Case || mongoose.model("Case", CaseSchema);
const CaseStageHistorySchema = new Schema({
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    fromStage: { type: String, required: true, enum: CASE_STAGES },
    toStage: { type: String, required: true, enum: CASE_STAGES },
    reason: { type: String },
    movedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    movedAt: { type: Date, default: Date.now },
}, { timestamps: false });
export const CaseStageHistoryModel = mongoose.models.CaseStageHistory ||
    mongoose.model("CaseStageHistory", CaseStageHistorySchema);
