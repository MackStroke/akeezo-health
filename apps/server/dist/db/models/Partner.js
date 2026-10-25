import mongoose, { Schema } from "mongoose";
import { PARTNER_SHARE_TYPES, PAYOUT_TRIGGERS } from "@akeezo/contracts";
const PartnerContactSchema = new Schema({
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    usesWhatsapp: { type: Boolean, default: true },
    isPrimary: { type: Boolean, default: false },
}, { _id: true });
const PartnerPayoutDetailsSchema = new Schema({
    accountHolder: { type: String, trim: true },
    bankName: { type: String, trim: true },
    accountNumberEncrypted: { type: String },
    ifscOrSwift: { type: String, trim: true },
    currency: { type: String, default: "INR" },
    country: { type: String, default: "IN" },
}, { _id: false });
const PartnerSchema = new Schema({
    partnerCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
    legacyId: { type: String, sparse: true, index: true },
    name: { type: String, required: true, trim: true },
    type: {
        type: String,
        required: true,
        enum: ["individual", "agency", "doctor", "ngo", "other"],
        default: "agency",
    },
    country: { type: String, trim: true },
    city: { type: String, trim: true },
    status: {
        type: String,
        required: true,
        enum: ["active", "on_hold", "blacklisted"],
        default: "active",
    },
    statusReason: { type: String },
    onboardedOn: { type: Date, default: Date.now },
    contacts: [PartnerContactSchema],
    payoutDetails: PartnerPayoutDetailsSchema,
    notes: { type: String },
}, { timestamps: true });
export const PartnerModel = mongoose.models.Partner || mongoose.model("Partner", PartnerSchema);
const PartnerAgreementSchema = new Schema({
    partnerId: { type: Schema.Types.ObjectId, ref: "Partner", required: true, index: true },
    shareType: { type: String, required: true, enum: PARTNER_SHARE_TYPES },
    shareValue: { type: Number, required: true, min: 0 },
    payoutTrigger: { type: String, required: true, enum: PAYOUT_TRIGGERS, default: "on_hospital_receipt" },
    effectiveFrom: { type: Date, required: true },
    effectiveTo: { type: Date },
    documentId: { type: Schema.Types.ObjectId, ref: "Document" },
    notes: { type: String },
}, { timestamps: true });
export const PartnerAgreementModel = mongoose.models.PartnerAgreement ||
    mongoose.model("PartnerAgreement", PartnerAgreementSchema);
