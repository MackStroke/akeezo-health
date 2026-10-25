import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";
import { encryptSensitiveField, decryptSensitiveField, maskSensitiveValue } from "../../utils/crypto.js";

export interface IPatient extends Document {
  fullName: string;
  nameNormalized: string;
  dateOfBirth?: string; // YYYY-MM-DD
  sex: "male" | "female" | "other" | "unknown";
  nationality?: string;
  countryOfResidence?: string;
  preferredLanguage: string;
  phone?: string;
  email?: string;
  passportNumberEncrypted?: string;
  passportNumberHash?: string; // SHA-256 for exact index duplicate lookup
  passportExpiry?: string;
  passportCountry?: string;
  notes?: string;
  legacyId?: string;
  createdAt: Date;
  updatedAt: Date;

  getMaskedPassport(): string;
  getDecryptedPassport(): string;
}

const PatientSchema = new Schema<IPatient>(
  {
    fullName: { type: String, required: true, trim: true },
    legacyId: { type: String, sparse: true, index: true },
    nameNormalized: { type: String, index: true },
    dateOfBirth: { type: String, index: true },
    sex: { type: String, enum: ["male", "female", "other", "unknown"], default: "unknown" },
    nationality: { type: String, trim: true },
    countryOfResidence: { type: String, trim: true },
    preferredLanguage: { type: String, default: "en" },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    passportNumberEncrypted: { type: String },
    passportNumberHash: { type: String, index: true },
    passportExpiry: { type: String },
    passportCountry: { type: String, trim: true },
    notes: { type: String },
  },
  { timestamps: true }
);

PatientSchema.pre("save", function (next) {
  if (this.fullName) {
    this.nameNormalized = this.fullName.toLowerCase().replace(/\s+/g, " ").trim();
  }
  next();
});

PatientSchema.methods.getMaskedPassport = function (): string {
  if (!this.passportNumberEncrypted) return "";
  return maskSensitiveValue(this.passportNumberEncrypted, 3);
};

PatientSchema.methods.getDecryptedPassport = function (): string {
  if (!this.passportNumberEncrypted) return "";
  return decryptSensitiveField(this.passportNumberEncrypted);
};

// Static helper to hash passport
PatientSchema.statics.hashPassport = function (passportNumber: string): string {
  if (!passportNumber) return "";
  return crypto.createHash("sha256").update(passportNumber.trim().toUpperCase()).digest("hex");
};

export const PatientModel = mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

// Companion Model
export interface ICompanion extends Document {
  patientId: mongoose.Types.ObjectId;
  fullName: string;
  relationship?: string;
  nationality?: string;
  passportNumberEncrypted?: string;
  passportNumberHash?: string;
  passportExpiry?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanionSchema = new Schema<ICompanion>(
  {
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    relationship: { type: String, trim: true },
    nationality: { type: String, trim: true },
    passportNumberEncrypted: { type: String },
    passportNumberHash: { type: String, index: true },
    passportExpiry: { type: String },
    phone: { type: String, trim: true },
  },
  { timestamps: true }
);

export const CompanionModel = mongoose.models.Companion || mongoose.model<ICompanion>("Companion", CompanionSchema);
