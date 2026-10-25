import mongoose, { Schema, Document } from "mongoose";
import {
  DOCUMENT_TYPES,
  DOCUMENT_VISIBILITIES,
  DocumentType,
  DocumentVisibility,
} from "@akeezo/contracts";

// Document Model
export interface IDocumentRecord extends Document {
  caseId: mongoose.Types.ObjectId;
  episodeId?: mongoose.Types.ObjectId;
  docType: DocumentType;
  fileName: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  checksum?: string;
  versionNo: number;
  replacesDocumentId?: mongoose.Types.ObjectId;
  visibility: DocumentVisibility;
  scanStatus: "pending" | "clean" | "infected";
  description?: string;
  uploadedBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DocumentRecordSchema = new Schema<IDocumentRecord>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
    docType: { type: String, required: true, enum: DOCUMENT_TYPES },
    fileName: { type: String, required: true },
    storageKey: { type: String, required: true, unique: true },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    checksum: { type: String },
    versionNo: { type: Number, default: 1 },
    replacesDocumentId: { type: Schema.Types.ObjectId, ref: "DocumentRecord" },
    visibility: { type: String, required: true, enum: DOCUMENT_VISIBILITIES, default: "internal" },
    scanStatus: { type: String, enum: ["pending", "clean", "infected"], default: "clean" },
    description: { type: String },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const DocumentRecordModel =
  mongoose.models.DocumentRecord ||
  mongoose.model<IDocumentRecord>("DocumentRecord", DocumentRecordSchema);

// Patient Consent Model
export interface IConsent extends Document {
  patientId: mongoose.Types.ObjectId;
  caseId: mongoose.Types.ObjectId;
  purpose: "store_records" | "share_with_hospital" | "share_with_partner" | "cross_border_transfer";
  givenBy: "patient" | "guardian" | "partner_on_behalf";
  givenOn: Date;
  evidenceDocumentId?: mongoose.Types.ObjectId;
  withdrawnOn?: Date;
  createdAt: Date;
}

const ConsentSchema = new Schema<IConsent>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    purpose: {
      type: String,
      required: true,
      enum: ["store_records", "share_with_hospital", "share_with_partner", "cross_border_transfer"],
    },
    givenBy: {
      type: String,
      required: true,
      enum: ["patient", "guardian", "partner_on_behalf"],
      default: "patient",
    },
    givenOn: { type: Date, default: Date.now },
    evidenceDocumentId: { type: Schema.Types.ObjectId, ref: "DocumentRecord" },
    withdrawnOn: { type: Date },
  },
  { timestamps: true }
);

export const ConsentModel = mongoose.models.Consent || mongoose.model<IConsent>("Consent", ConsentSchema);

// Visa Record Model
export interface IVisaRecord extends Document {
  caseId: mongoose.Types.ObjectId;
  patientId: mongoose.Types.ObjectId;
  companionId?: mongoose.Types.ObjectId;
  visaType: "medical" | "medical_attendant" | "other";
  applicationRef?: string;
  invitationLetterRequestedAt?: Date;
  invitationLetterReceivedAt?: Date;
  invitationLetterSharedAt?: Date;
  appliedOn?: Date;
  status: "not_started" | "documents_pending" | "applied" | "approved" | "rejected" | "expired";
  decidedOn?: Date;
  validFrom?: Date;
  validTo?: Date;
  rejectionReason?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisaRecordSchema = new Schema<IVisaRecord>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    companionId: { type: Schema.Types.ObjectId, ref: "Companion" },
    visaType: { type: String, enum: ["medical", "medical_attendant", "other"], default: "medical" },
    applicationRef: { type: String },
    invitationLetterRequestedAt: { type: Date },
    invitationLetterReceivedAt: { type: Date },
    invitationLetterSharedAt: { type: Date },
    appliedOn: { type: Date },
    status: {
      type: String,
      enum: ["not_started", "documents_pending", "applied", "approved", "rejected", "expired"],
      default: "not_started",
    },
    decidedOn: { type: Date },
    validFrom: { type: Date },
    validTo: { type: Date },
    rejectionReason: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const VisaRecordModel =
  mongoose.models.VisaRecord || mongoose.model<IVisaRecord>("VisaRecord", VisaRecordSchema);

// Travel Record Model
export interface ITravelRecord extends Document {
  caseId: mongoose.Types.ObjectId;
  direction: "inbound" | "outbound";
  carrier?: string;
  flightNo?: string;
  fromAirport?: string;
  toAirport?: string;
  departAt?: Date;
  arriveAt?: Date;
  pnr?: string;
  ticketDocumentId?: mongoose.Types.ObjectId;
  status: "planned" | "confirmed" | "completed" | "cancelled";
  pickupRequired: boolean;
  pickupNotes?: string;
  accommodationNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TravelRecordSchema = new Schema<ITravelRecord>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    direction: { type: String, enum: ["inbound", "outbound"], default: "inbound" },
    carrier: { type: String },
    flightNo: { type: String },
    fromAirport: { type: String },
    toAirport: { type: String },
    departAt: { type: Date },
    arriveAt: { type: Date },
    pnr: { type: String },
    ticketDocumentId: { type: Schema.Types.ObjectId, ref: "DocumentRecord" },
    status: { type: String, enum: ["planned", "confirmed", "completed", "cancelled"], default: "planned" },
    pickupRequired: { type: Boolean, default: true },
    pickupNotes: { type: String },
    accommodationNotes: { type: String },
  },
  { timestamps: true }
);

export const TravelRecordModel =
  mongoose.models.TravelRecord || mongoose.model<ITravelRecord>("TravelRecord", TravelRecordSchema);

// Appointment Model
export interface IAppointment extends Document {
  caseId: mongoose.Types.ObjectId;
  episodeId?: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  doctorId?: mongoose.Types.ObjectId;
  appointmentType: "consultation" | "screening" | "diagnostic" | "follow_up" | "procedure_planning";
  scheduledAt: Date;
  durationMin: number;
  status: "scheduled" | "completed" | "missed" | "rescheduled" | "cancelled";
  outcomeNotes?: string;
  recommendedPlan?: string;
  rescheduledFromId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor" },
    appointmentType: {
      type: String,
      enum: ["consultation", "screening", "diagnostic", "follow_up", "procedure_planning"],
      default: "consultation",
    },
    scheduledAt: { type: Date, required: true },
    durationMin: { type: Number, default: 30 },
    status: {
      type: String,
      enum: ["scheduled", "completed", "missed", "rescheduled", "cancelled"],
      default: "scheduled",
    },
    outcomeNotes: { type: String },
    recommendedPlan: { type: String },
    rescheduledFromId: { type: Schema.Types.ObjectId, ref: "Appointment" },
  },
  { timestamps: true }
);

export const AppointmentModel =
  mongoose.models.Appointment || mongoose.model<IAppointment>("Appointment", AppointmentSchema);

// Case Note Model (Communication Log)
export interface ICaseNote extends Document {
  caseId: mongoose.Types.ObjectId;
  episodeId?: mongoose.Types.ObjectId;
  kind: "note" | "call" | "whatsapp" | "email" | "meeting";
  direction: "inbound" | "outbound" | "internal";
  withPartyType: "partner" | "hospital" | "patient" | "internal";
  withPartyId?: mongoose.Types.ObjectId;
  summary: string;
  occurredAt: Date;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CaseNoteSchema = new Schema<ICaseNote>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
    kind: { type: String, enum: ["note", "call", "whatsapp", "email", "meeting"], default: "note" },
    direction: { type: String, enum: ["inbound", "outbound", "internal"], default: "internal" },
    withPartyType: { type: String, enum: ["partner", "hospital", "patient", "internal"], default: "internal" },
    withPartyId: { type: Schema.Types.ObjectId },
    summary: { type: String, required: true },
    occurredAt: { type: Date, default: Date.now },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const CaseNoteModel = mongoose.models.CaseNote || mongoose.model<ICaseNote>("CaseNote", CaseNoteSchema);

// Case Task Model
export interface ICaseTask extends Document {
  caseId?: mongoose.Types.ObjectId;
  episodeId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  dueAt?: Date;
  assigneeId: mongoose.Types.ObjectId;
  status: "open" | "done" | "cancelled";
  priority: "normal" | "high";
  autoGenerated: boolean;
  ruleKey?: string;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CaseTaskSchema = new Schema<ICaseTask>(
  {
    caseId: { type: Schema.Types.ObjectId, ref: "Case", index: true },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
    title: { type: String, required: true },
    description: { type: String },
    dueAt: { type: Date },
    assigneeId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: ["open", "done", "cancelled"], default: "open", index: true },
    priority: { type: String, enum: ["normal", "high"], default: "normal" },
    autoGenerated: { type: Boolean, default: false },
    ruleKey: { type: String },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const CaseTaskModel = mongoose.models.CaseTask || mongoose.model<ICaseTask>("CaseTask", CaseTaskSchema);

// Case Audit Log Model (Append-Only)
export interface ICaseAuditLog extends Document {
  occurredAt: Date;
  actorId?: mongoose.Types.ObjectId;
  entityType: string;
  entityId: mongoose.Types.ObjectId;
  caseId?: mongoose.Types.ObjectId;
  action: "create" | "update" | "delete" | "stage_change" | "login" | "export" | "view_identity";
  changes?: Record<string, [any, any]>; // [oldValue, newValue]
  ip?: string;
  userAgent?: string;
}

const CaseAuditLogSchema = new Schema<ICaseAuditLog>(
  {
    occurredAt: { type: Date, default: Date.now, index: true },
    actorId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: Schema.Types.ObjectId, required: true, index: true },
    caseId: { type: Schema.Types.ObjectId, ref: "Case", index: true },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "stage_change", "login", "export", "view_identity"],
      index: true,
    },
    changes: { type: Schema.Types.Mixed },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: false }
);

export const CaseAuditLogModel =
  mongoose.models.CaseAuditLog || mongoose.model<ICaseAuditLog>("CaseAuditLog", CaseAuditLogSchema);
