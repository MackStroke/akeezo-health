import mongoose, { Schema } from "mongoose";
const SiteSettingsSchema = new Schema({
    environment: { type: String, default: "development", unique: true, required: true },
    brandName: { type: String, default: "AKEEZO", required: true },
    tagline: { type: String, default: "Heal In India, Heal By Akeezo", required: true },
    logoVariants: {
        light: { type: String, default: "/logo/logo with tagline-light.svg" },
        dark: { type: String, default: "/logo/logo with tagline-dark.svg" },
        mark: { type: String, default: "/logo/favicon.svg" }
    },
    primaryColor: { type: String, default: "#00C7BE" },
    actionColor: { type: String, default: "#007A6C" },
    contactEmail: { type: String, default: "care@akeezo.com" },
    careEmail: { type: String, default: "care@akeezo.com" },
    medicalEmail: { type: String, default: "medical@akeezo.com" },
    partnershipEmail: { type: String, default: "partnership@akeezo.com" },
    emergencyHelpline: { type: String, default: "+91 82876 39443" },
    whatsappHelpline: { type: String, default: "+91 82876 39443" },
    showTopUtilityBar: { type: Boolean, default: true },
    emergencyNotice: { type: String, default: "EMERGENCY?" },
    headquartersAddress: {
        type: String,
        default: "Regus Elegance, Jasola District Centre, New Delhi, India 110025"
    },
    grievanceOfficer: {
        name: { type: String, default: "Yogesh Verma" },
        designation: { type: String, default: "Co-Founder & Chief Operating Officer" },
        email: { type: String, default: "grievance@akeezo.com" },
        helpline: { type: String, default: "+91 82876 39443" },
        address: {
            type: String,
            default: "Regus Elegance, Jasola District Centre, New Delhi, India 110025"
        }
    },
    dpoContact: {
        email: { type: String, default: "dpo@akeezo.com" },
        address: {
            type: String,
            default: "AKEEZO Healthcare Platform Private Limited, New Delhi, India 110001"
        }
    },
    socialLinks: {
        linkedin: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String },
        youtube: { type: String }
    },
    version: { type: Number, default: 1 }
}, {
    timestamps: true
});
export const SiteSettings = mongoose.models.SiteSettings ||
    mongoose.model("SiteSettings", SiteSettingsSchema);
