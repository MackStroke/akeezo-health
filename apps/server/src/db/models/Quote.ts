import mongoose, { Schema, Document } from "mongoose";
import {
  QUOTE_REQUEST_STATUSES,
  QUOTE_RECIPIENT_STATUSES,
  QUOTE_TYPES,
  QuoteRequestStatus,
  QuoteRecipientStatus,
  QuoteType,
} from "@akeezo/contracts";

// Quote Request (RFQ)
export interface IQuoteRequest extends Document {
  caseId: mongoose.Types.ObjectId;
  roundNo: number;
  clinicalSummary: string;
  responseDueAt?: Date;
  status: QuoteRequestStatus;
  requestedBy: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    roundNo: { type: Number, required: true, default: 1 },
    clinicalSummary: { type: String, required: true },
    responseDueAt: { type: Date },
    status: { type: String, required: true, enum: QUOTE_REQUEST_STATUSES, default: "open" },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const QuoteRequestModel =
  mongoose.models.QuoteRequest || mongoose.model<IQuoteRequest>("QuoteRequest", QuoteRequestSchema);

// Quote Request Recipient (One per hospital sent)
export interface IQuoteRequestRecipient extends Document {
  quoteRequestId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  sentAt: Date;
  sentVia: string;
  status: QuoteRecipientStatus;
  lastFollowupAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestRecipientSchema = new Schema<IQuoteRequestRecipient>(
  {
    quoteRequestId: { type: Schema.Types.ObjectId, ref: "QuoteRequest", required: true, index: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    sentAt: { type: Date, default: Date.now },
    sentVia: { type: String, default: "email" },
    status: { type: String, required: true, enum: QUOTE_RECIPIENT_STATUSES, default: "requested" },
    lastFollowupAt: { type: Date },
  },
  { timestamps: true }
);

export const QuoteRequestRecipientModel =
  mongoose.models.QuoteRequestRecipient ||
  mongoose.model<IQuoteRequestRecipient>("QuoteRequestRecipient", QuoteRequestRecipientSchema);

// Quote Model
export interface IQuote {
  recipientId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  quoteType: QuoteType;
  amountMinMinor: number;
  amountMaxMinor: number;
  currency: string;
  inclusions?: string;
  exclusions?: string;
  estimatedStayDays?: number;
  estimatedTreatmentDays?: number;
  validityUntil: Date;
  receivedAt: Date;
  documentId?: mongoose.Types.ObjectId;
  sharedWithPartnerAt?: Date;
  sharedVia?: string;
  isSelected: boolean;
  selectedAt?: Date;
  selectedVia?: string;
  rejectionReason?: string;
  version: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: "QuoteRequestRecipient", required: true, index: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    quoteType: { type: String, required: true, enum: QUOTE_TYPES, default: "initial" },
    amountMinMinor: { type: Number, required: true, min: 0 },
    amountMaxMinor: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "INR" },
    inclusions: { type: String },
    exclusions: { type: String },
    estimatedStayDays: { type: Number, min: 0 },
    estimatedTreatmentDays: { type: Number, min: 0 },
    validityUntil: { type: Date, required: true },
    receivedAt: { type: Date, default: Date.now },
    documentId: { type: Schema.Types.ObjectId, ref: "Document" },
    sharedWithPartnerAt: { type: Date },
    sharedVia: { type: String },
    isSelected: { type: Boolean, default: false },
    selectedAt: { type: Date },
    selectedVia: { type: String },
    rejectionReason: { type: String },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export const QuoteModel = mongoose.models.Quote || mongoose.model<IQuote>("Quote", QuoteSchema);
