import mongoose, { Schema, type Document, type Model } from "mongoose";

export interface ISiteSettings extends Document {
  environment: string;
  brandName: string;
  tagline: string;
  logoVariants: {
    light: string;
    dark: string;
    mark: string;
  };
  primaryColor: string;
  actionColor: string;
  contactEmail: string;
  careEmail: string;
  medicalEmail: string;
  partnershipEmail: string;
  emergencyHelpline: string;
  whatsappHelpline: string;
  headquartersAddress: string;
  grievanceOfficer: {
    name: string;
    designation: string;
    email: string;
    helpline: string;
    address: string;
  };
  dpoContact: {
    email: string;
    address: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
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
  },
  {
    timestamps: true
  }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
