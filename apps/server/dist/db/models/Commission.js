import mongoose, { Schema } from "mongoose";
import { COMMISSION_RECORD_STATUSES, PAYMENT_DIRECTIONS, PAYMENT_METHODS, } from "@akeezo/contracts";
const CommissionRecordSchema = new Schema({
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode", required: true, unique: true, index: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    hospitalAgreementId: { type: Schema.Types.ObjectId, ref: "HospitalAgreement" },
    partnerAgreementId: { type: Schema.Types.ObjectId, ref: "PartnerAgreement" },
    hospitalRateSnapshot: { type: Schema.Types.Mixed, required: true },
    partnerShareSnapshot: { type: Schema.Types.Mixed },
    billedAmountMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    akeezoCommissionMinor: { type: Number, required: true, min: 0 },
    partnerShareMinor: { type: Number, required: true, min: 0 },
    akeezoNetMinor: { type: Number, required: true },
    hospitalReceivedMinor: { type: Number, default: 0, min: 0 },
    partnerPaidMinor: { type: Number, default: 0, min: 0 },
    partnerPayableMinor: { type: Number, default: 0 },
    recoveryDueMinor: { type: Number, default: 0, min: 0 },
    status: {
        type: String,
        required: true,
        enum: COMMISSION_RECORD_STATUSES,
        default: "expected",
        index: true,
    },
    invoiceRef: { type: String, trim: true },
    invoicedOn: { type: Date },
    dueOn: { type: Date },
    tdsDeductedMinor: { type: Number, min: 0 },
    version: { type: Number, default: 1 },
}, { timestamps: true });
export const CommissionRecordModel = mongoose.models.CommissionRecord ||
    mongoose.model("CommissionRecord", CommissionRecordSchema);
const CommissionAdjustmentSchema = new Schema({
    commissionRecordId: { type: Schema.Types.ObjectId, ref: "CommissionRecord", required: true, index: true },
    reason: { type: String, required: true, trim: true },
    deltaBilledMinor: { type: Number, required: true },
    deltaCommissionMinor: { type: Number, required: true },
    deltaPartnerShareMinor: { type: Number, required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
export const CommissionAdjustmentModel = mongoose.models.CommissionAdjustment ||
    mongoose.model("CommissionAdjustment", CommissionAdjustmentSchema);
const PaymentSchema = new Schema({
    direction: { type: String, required: true, enum: PAYMENT_DIRECTIONS },
    partyId: { type: Schema.Types.ObjectId, required: true, index: true },
    amountMinor: { type: Number, required: true, min: 1 },
    currency: { type: String, default: "INR" },
    fxRateToInr: { type: Number, min: 0 },
    amountInrMinor: { type: Number, min: 0 },
    paidOn: { type: Date, required: true },
    method: { type: String, required: true, enum: PAYMENT_METHODS, default: "bank_transfer" },
    reference: { type: String, required: true, trim: true },
    proofDocumentId: { type: Schema.Types.ObjectId, ref: "Document" },
    recordedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
export const PaymentModel = mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
const PaymentAllocationSchema = new Schema({
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true, index: true },
    commissionRecordId: { type: Schema.Types.ObjectId, ref: "CommissionRecord", required: true, index: true },
    amountMinor: { type: Number, required: true, min: 1 },
}, { timestamps: true });
export const PaymentAllocationModel = mongoose.models.PaymentAllocation ||
    mongoose.model("PaymentAllocation", PaymentAllocationSchema);
