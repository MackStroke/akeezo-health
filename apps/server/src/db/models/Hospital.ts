import mongoose, { Schema, Document } from "mongoose";
import { HOSPITAL_COMMISSION_TYPES, HospitalCommissionType } from "@akeezo/contracts";

export interface IHospitalContact {
  name: string;
  department?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
}

export interface IHospital extends Document {
  hospitalCode: string;
  name: string;
  city: string;
  state?: string;
  address?: string;
  accreditations: string[];
  specialties: string[];
  website?: string;
  status: "active" | "inactive";
  notes?: string;
  contacts: IHospitalContact[];
  createdAt: Date;
  updatedAt: Date;
}

const HospitalContactSchema = new Schema<IHospitalContact>(
  {
    name: { type: String, required: true, trim: true },
    department: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
  },
  { _id: true }
);

const HospitalSchema = new Schema<IHospital>(
  {
    hospitalCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
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
  },
  { timestamps: true }
);

HospitalSchema.index({ name: "text", city: "text" });

export const HospitalModel = mongoose.models.Hospital || mongoose.model<IHospital>("Hospital", HospitalSchema);

// Doctor Model
export interface IDoctor extends Document {
  hospitalId: mongoose.Types.ObjectId;
  name: string;
  specialty: string;
  qualifications?: string;
  experienceYears?: number;
  status: "active" | "inactive";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    qualifications: { type: String, trim: true },
    experienceYears: { type: Number, min: 0 },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    notes: { type: String },
  },
  { timestamps: true }
);

export const DoctorModel = mongoose.models.Doctor || mongoose.model<IDoctor>("Doctor", DoctorSchema);

// Hospital Agreement
export interface ISlab {
  fromMinor: number;
  toMinor: number;
  type: "percent_of_billed" | "flat_per_episode";
  value: number;
}

export interface IHospitalAgreement extends Document {
  hospitalId: mongoose.Types.ObjectId;
  commissionType: HospitalCommissionType;
  commissionValue: number;
  slabs?: ISlab[];
  appliesTo: "all" | "specialty" | "procedure";
  scopeRef?: string;
  paymentTermsDays: number;
  effectiveFrom: Date;
  effectiveTo?: Date;
  documentId?: mongoose.Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SlabSchema = new Schema<ISlab>(
  {
    fromMinor: { type: Number, required: true, min: 0 },
    toMinor: { type: Number, required: true, min: 0 },
    type: { type: String, required: true, enum: ["percent_of_billed", "flat_per_episode"] },
    value: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const HospitalAgreementSchema = new Schema<IHospitalAgreement>(
  {
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
  },
  { timestamps: true }
);

export const HospitalAgreementModel =
  mongoose.models.HospitalAgreement ||
  mongoose.model<IHospitalAgreement>("HospitalAgreement", HospitalAgreementSchema);
