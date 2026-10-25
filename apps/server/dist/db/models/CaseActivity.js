import mongoose, { Schema } from "mongoose";
import { DOCUMENT_TYPES, DOCUMENT_VISIBILITIES, } from "@akeezo/contracts";
const DocumentRecordSchema = new Schema({
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
}, { timestamps: true });
export const DocumentRecordModel = mongoose.models.DocumentRecord ||
    mongoose.model("DocumentRecord", DocumentRecordSchema);
const ConsentSchema = new Schema({
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
}, { timestamps: true });
export const ConsentModel = mongoose.models.Consent || mongoose.model("Consent", ConsentSchema);
const VisaRecordSchema = new Schema({
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
}, { timestamps: true });
export const VisaRecordModel = mongoose.models.VisaRecord || mongoose.model("VisaRecord", VisaRecordSchema);
const TravelRecordSchema = new Schema({
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
}, { timestamps: true });
export const TravelRecordModel = mongoose.models.TravelRecord || mongoose.model("TravelRecord", TravelRecordSchema);
const AppointmentSchema = new Schema({
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
}, { timestamps: true });
export const AppointmentModel = mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);
const CaseNoteSchema = new Schema({
    caseId: { type: Schema.Types.ObjectId, ref: "Case", required: true, index: true },
    episodeId: { type: Schema.Types.ObjectId, ref: "Episode" },
    kind: { type: String, enum: ["note", "call", "whatsapp", "email", "meeting"], default: "note" },
    direction: { type: String, enum: ["inbound", "outbound", "internal"], default: "internal" },
    withPartyType: { type: String, enum: ["partner", "hospital", "patient", "internal"], default: "internal" },
    withPartyId: { type: Schema.Types.ObjectId },
    summary: { type: String, required: true },
    occurredAt: { type: Date, default: Date.now },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });
export const CaseNoteModel = mongoose.models.CaseNote || mongoose.model("CaseNote", CaseNoteSchema);
const CaseTaskSchema = new Schema({
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
}, { timestamps: true });
export const CaseTaskModel = mongoose.models.CaseTask || mongoose.model("CaseTask", CaseTaskSchema);
const CaseAuditLogSchema = new Schema({
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
}, { timestamps: false });
export const CaseAuditLogModel = mongoose.models.CaseAuditLog || mongoose.model("CaseAuditLog", CaseAuditLogSchema);
