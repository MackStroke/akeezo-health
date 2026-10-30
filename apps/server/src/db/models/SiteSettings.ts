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
  secondaryColor: string;
  accentColor: string;
  actionColor: string;
  websiteTheme?: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    actionColor: string;
    actionHoverColor: string;
    actionAccentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    surfaceMutedColor: string;
    surfaceTealColor: string;
    surfaceOrangeColor: string;
    cardColor: string;
    textColor: string;
    textMutedColor: string;
    headingColor: string;
    borderColor: string;
    borderTealColor: string;
    borderOrangeColor: string;
    emergencyColor: string;
    fontFamily: string;
    headingFontFamily: string;
    radiusCard: string;
    radiusHero: string;
    radiusButton: string;
    radiusPill: string;
    mode: "light" | "dark" | "auto";
    activePreset: string;
  };
  adminTheme?: {
    primaryColor: string;
    accentColor: string;
    secondaryColor: string;
    sidebarBackground: string;
    sidebarText: string;
    sidebarActiveBackground: string;
    headerBackground: string;
    headerText: string;
    contentBackground: string;
    cardBackground: string;
    textColor: string;
    textMutedColor: string;
    borderColor: string;
    fontFamily: string;
    radiusCard: string;
    radiusButton: string;
    mode: "light" | "dark" | "auto";
    activePreset: string;
  };
  contactEmail: string;
  careEmail: string;
  medicalEmail: string;
  partnershipEmail: string;
  emergencyHelpline: string;
  whatsappHelpline: string;
  showTopUtilityBar?: boolean;
  emergencyNotice?: string;
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
  navigation?: {
    headerMenu: Array<{
      id: string;
      label: string;
      destination: string;
      isExternal: boolean;
      order: number;
      isVisible: boolean;
    }>;
    footerGroups: Array<{
      id: string;
      title: string;
      order: number;
      links: Array<{
        label: string;
        destination: string;
        isExternal: boolean;
        isVisible: boolean;
      }>;
    }>;
  };
  formsConfig?: {
    leadNotificationEmails?: string[];
    autoTriageEnabled?: boolean;
    spamFilterEnabled?: boolean;
  };
  integrations?: {
    googleTagManager?: {
      enabled: boolean;
      containerId: string;
    };
    googleCloud?: {
      enabled: boolean;
      projectId: string;
      clientEmail: string;
      region: string;
      storageBucket: string;
      status: string;
    };
    metaPixel?: {
      enabled: boolean;
      pixelId: string;
      testEventCode?: string;
    };
    gemini?: {
      enabled: boolean;
      apiKey?: string;
      model: string;
      temperature: number;
      status: string;
      lastTestedAt?: Date | string;
    };
    googleAnalytics?: {
      enabled: boolean;
      measurementId: string;
      anonymizeIp: boolean;
    };
    googleAnalyticsId?: string;
    firebaseProjectMasked?: string;
    smtpHostMasked?: string;
    storageBucketMasked?: string;
  };
  mediaSettings?: {
    autoOptimizeOnUpload: boolean;
    quality: number;
    maxWidth: number;
    maxHeight: number;
    generateVariants: boolean;
    format: "webp" | "original";
    preserveOriginals: boolean;
  };
  defaultLanguage?: string;
  defaultTimezone?: string;
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
    secondaryColor: { type: String, default: "#FF6B00" },
    accentColor: { type: String, default: "#FF6D1B" },
    actionColor: { type: String, default: "#007A6C" },
    websiteTheme: {
      primaryColor: { type: String, default: "#00C7BE" },
      secondaryColor: { type: String, default: "#FF6B00" },
      accentColor: { type: String, default: "#FF6D1B" },
      actionColor: { type: String, default: "#007A6C" },
      actionHoverColor: { type: String, default: "#005F54" },
      actionAccentColor: { type: String, default: "#B54700" },
      backgroundColor: { type: String, default: "#FFFFFF" },
      surfaceColor: { type: String, default: "#FFFFFF" },
      surfaceMutedColor: { type: String, default: "#F4F6F9" },
      surfaceTealColor: { type: String, default: "#E6F8F6" },
      surfaceOrangeColor: { type: String, default: "#FFF4EC" },
      cardColor: { type: String, default: "#FFFFFF" },
      textColor: { type: String, default: "#262626" },
      textMutedColor: { type: String, default: "#595959" },
      headingColor: { type: String, default: "#061E1B" },
      borderColor: { type: String, default: "#E2E8F0" },
      borderTealColor: { type: String, default: "#B2EBE4" },
      borderOrangeColor: { type: String, default: "#FFD8BF" },
      emergencyColor: { type: String, default: "#D92D20" },
      fontFamily: { type: String, default: "'Lato', system-ui, -apple-system, sans-serif" },
      headingFontFamily: { type: String, default: "'Lato', system-ui, -apple-system, sans-serif" },
      radiusCard: { type: String, default: "20px" },
      radiusHero: { type: String, default: "30px" },
      radiusButton: { type: String, default: "12px" },
      radiusPill: { type: String, default: "999px" },
      mode: { type: String, default: "light" },
      activePreset: { type: String, default: "classic" }
    },
    adminTheme: {
      primaryColor: { type: String, default: "#007A6C" },
      accentColor: { type: String, default: "#00C7BE" },
      secondaryColor: { type: String, default: "#FF6B00" },
      sidebarBackground: { type: String, default: "#061E1B" },
      sidebarText: { type: String, default: "#F4F6F9" },
      sidebarActiveBackground: { type: String, default: "#0B2B27" },
      headerBackground: { type: String, default: "#FFFFFF" },
      headerText: { type: String, default: "#1E293B" },
      contentBackground: { type: String, default: "#F8FAFC" },
      cardBackground: { type: String, default: "#FFFFFF" },
      textColor: { type: String, default: "#1E293B" },
      textMutedColor: { type: String, default: "#64748B" },
      borderColor: { type: String, default: "#E2E8F0" },
      fontFamily: { type: String, default: "'Lato', system-ui, -apple-system, sans-serif" },
      radiusCard: { type: String, default: "16px" },
      radiusButton: { type: String, default: "10px" },
      mode: { type: String, default: "light" },
      activePreset: { type: String, default: "classic" }
    },
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
    navigation: {
      headerMenu: [
        {
          id: { type: String, required: true },
          label: { type: String, required: true },
          destination: { type: String, required: true },
          isExternal: { type: Boolean, default: false },
          order: { type: Number, default: 0 },
          isVisible: { type: Boolean, default: true }
        }
      ],
      footerGroups: [
        {
          id: { type: String, required: true },
          title: { type: String, required: true },
          order: { type: Number, default: 0 },
          links: [
            {
              label: { type: String, required: true },
              destination: { type: String, required: true },
              isExternal: { type: Boolean, default: false },
              isVisible: { type: Boolean, default: true }
            }
          ]
        }
      ]
    },
    formsConfig: {
      leadNotificationEmails: [{ type: String }],
      autoTriageEnabled: { type: Boolean, default: true },
      spamFilterEnabled: { type: Boolean, default: true }
    },
    integrations: {
      googleTagManager: {
        enabled: { type: Boolean, default: false },
        containerId: { type: String, default: "GTM-AKZ89P4" },
      },
      googleCloud: {
        enabled: { type: Boolean, default: true },
        projectId: { type: String, default: "akeezo-health-prod" },
        clientEmail: { type: String, default: "service-account@akeezo-health-prod.iam.gserviceaccount.com" },
        region: { type: String, default: "asia-south1" },
        storageBucket: { type: String, default: "gs://akeezo-vault-prod" },
        status: { type: String, default: "connected" },
      },
      metaPixel: {
        enabled: { type: Boolean, default: false },
        pixelId: { type: String, default: "982347109283471" },
        testEventCode: { type: String, default: "" },
      },
      gemini: {
        enabled: { type: Boolean, default: true },
        apiKey: { type: String, default: "" },
        model: { type: String, default: "gemini-2.0-flash" },
        temperature: { type: Number, default: 0.2 },
        status: { type: String, default: "active" },
        lastTestedAt: { type: Date },
      },
      googleAnalytics: {
        enabled: { type: Boolean, default: true },
        measurementId: { type: String, default: "G-AKEEZO2026X" },
        anonymizeIp: { type: Boolean, default: true },
      },
      googleAnalyticsId: { type: String, default: "G-AKEEZO2026X" },
      firebaseProjectMasked: { type: String, default: "akeezo-health-prod (Active)" },
      smtpHostMasked: { type: String, default: "smtp.sendgrid.net (Configured)" },
      storageBucketMasked: { type: String, default: "gs://akeezo-vault-prod (Protected)" },
    },
    mediaSettings: {
      autoOptimizeOnUpload: { type: Boolean, default: true },
      quality: { type: Number, default: 80 },
      maxWidth: { type: Number, default: 1920 },
      maxHeight: { type: Number, default: 1920 },
      generateVariants: { type: Boolean, default: true },
      format: { type: String, default: "webp" },
      preserveOriginals: { type: Boolean, default: true }
    },
    defaultLanguage: { type: String, default: "en" },
    defaultTimezone: { type: String, default: "Asia/Kolkata" },
    version: { type: Number, default: 1 }
  },
  {
    timestamps: true
  }
);

export const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);
