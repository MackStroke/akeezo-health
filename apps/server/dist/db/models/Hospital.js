import mongoose, { Schema } from "mongoose";
import { HOSPITAL_COMMISSION_TYPES } from "@akeezo/contracts";
const HospitalContactSchema = new Schema({
    name: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
}, { _id: true });
const HospitalSchema = new Schema({
    hospitalCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    legacyId: { type: String, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    address: { type: String, trim: true },
    accreditations: [{ type: String }],
    specialties: [{ type: String }],
    website: { type: String, trim: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String },
    contacts: [HospitalContactSchema],
}, { timestamps: true });
HospitalSchema.index({ name: "text", city: "text" });
export const HospitalModel = mongoose.models.Hospital || mongoose.model("Hospital", HospitalSchema);
const DoctorSchema = new Schema({
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    qualifications: { type: String, trim: true },
    experienceYears: { type: Number, min: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String },
}, { timestamps: true });
export const DoctorModel = mongoose.models.Doctor || mongoose.model("Doctor", DoctorSchema);
const SlabSchema = new Schema({
    fromMinor: { type: Number, required: true, min: 0 },
    toMinor: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ["percent_of_billed", "flat_per_episode"] },
    value: { type: Number, required: true, min: 0 },
}, { _id: false });
const HospitalAgreementSchema = new Schema({
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    commissionType: { type: String, required: true, enum: HOSPITAL_COMMISSION_TYPES },
    commissionValue: { type: Number, required: true, min: 0 },
    slabs: [SlabSchema],
    appliesTo: { type: String, required: true, enum: ["all", "specialty", "procedure"], default: "all" },
    scopeRef: { type: String },
    paymentTermsDays: { type: Number, default: 30 },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date },
    documentId: { type: Schema.Types.ObjectId, ref: "Document" },
    notes: { type: String },
}, { timestamps: true });
export const HospitalAgreementModel = mongoose.models.HospitalAgreement ||
    mongoose.model("HospitalAgreement", HospitalAgreementSchema);
