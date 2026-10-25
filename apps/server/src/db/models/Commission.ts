import mongoose, { Schema, Document } from "mongoose";
import {
  COMMISSION_RECORD_STATUSES,
  PAYMENT_DIRECTIONS,
  PAYMENT_METHODS,
  CommissionRecordStatus,
  PaymentDirection,
  PaymentMethod,
} from "@akeezo/contracts";

export interface ICommissionRecord extends Document {
  episodeId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  hospitalAgreementId?: mongoose.Types.ObjectId;
  partnerAgreementId?: mongoose.Types.ObjectId;
  hospitalRateSnapshot: Record<string, any>;
  partnerShareSnapshot?: Record<string, any>;
  billedAmountMinor: number;
  currency: string;
  akeezoCommissionMinor: number;
  partnerShareMinor: number;
  akeezoNetMinor: number;
  hospitalReceivedMinor: number;
  partnerPaidMinor: number;
  partnerPayableMinor: number;
  recoveryDueMinor: number;
  status: CommissionRecordStatus;
  invoiceRef?: string;
  invoicedOn?: Date;
  dueOn?: Date;
  tdsDeductedMinor?: number;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionRecordSchema = new Schema<ICommissionRecord>(
  {
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
  },
  { timestamps: true }
);

export const CommissionRecordModel =
  mongoose.models.CommissionRecord ||
  mongoose.model<ICommissionRecord>("CommissionRecord", CommissionRecordSchema);

// Commission Adjustment
export interface ICommissionAdjustment extends Document {
  commissionRecordId: mongoose.Types.ObjectId;
  reason: string;
  deltaBilledMinor: number;
  deltaCommissionMinor: number;
  deltaPartnerShareMinor: number;
  approvedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CommissionAdjustmentSchema = new Schema<ICommissionAdjustment>(
  {
    commissionRecordId: { type: Schema.Types.ObjectId, ref: "CommissionRecord", required: true, index: true },
    reason: { type: String, required: true, trim: true },
    deltaBilledMinor: { type: Number, required: true },
    deltaCommissionMinor: { type: Number, required: true },
    deltaPartnerShareMinor: { type: Number, required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const CommissionAdjustmentModel =
  mongoose.models.CommissionAdjustment ||
  mongoose.model<ICommissionAdjustment>("CommissionAdjustment", CommissionAdjustmentSchema);

// Payment Model
export interface IPayment extends Document {
  direction: PaymentDirection;
  partyId: mongoose.Types.ObjectId; // Hospital or Partner ID
  amountMinor: number;
  currency: string;
  fxRateToInr?: number;
  amountInrMinor?: number;
  paidOn: Date;
  method: PaymentMethod;
  reference: string;
  proofDocumentId?: mongoose.Types.ObjectId;
  recordedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
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
  },
  { timestamps: true }
);

export const PaymentModel = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

// Payment Allocation Model
export interface IPaymentAllocation extends Document {
  paymentId: mongoose.Types.ObjectId;
  commissionRecordId: mongoose.Types.ObjectId;
  amountMinor: number;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentAllocationSchema = new Schema<IPaymentAllocation>(
  {
    paymentId: { type: Schema.Types.ObjectId, ref: "Payment", required: true, index: true },
    commissionRecordId: { type: Schema.Types.ObjectId, ref: "CommissionRecord", required: true, index: true },
    amountMinor: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

export const PaymentAllocationModel =
  mongoose.models.PaymentAllocation ||
  mongoose.model<IPaymentAllocation>("PaymentAllocation", PaymentAllocationSchema);
