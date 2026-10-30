import { z } from "zod";

export const ThemeModeSchema = z.enum(["light", "dark", "auto"]);
export type ThemeMode = z.infer<typeof ThemeModeSchema>;

export const WebsiteThemeSchema = z.object({
  // Brand & Action Colors
  primaryColor: z.string().default("#00C7BE"),
  secondaryColor: z.string().default("#FF6B00"),
  accentColor: z.string().default("#FF6D1B"),
  actionColor: z.string().default("#007A6C"),
  actionHoverColor: z.string().default("#005F54"),
  actionAccentColor: z.string().default("#B54700"),

  // Surfaces & Backgrounds
  backgroundColor: z.string().default("#FFFFFF"),
  surfaceColor: z.string().default("#FFFFFF"),
  surfaceMutedColor: z.string().default("#F4F6F9"),
  surfaceTealColor: z.string().default("#E6F8F6"),
  surfaceOrangeColor: z.string().default("#FFF4EC"),
  cardColor: z.string().default("#FFFFFF"),

  // Typography & Inks
  textColor: z.string().default("#262626"),
  textMutedColor: z.string().default("#595959"),
  headingColor: z.string().default("#061E1B"),

  // Borders & Accents
  borderColor: z.string().default("#E2E8F0"),
  borderTealColor: z.string().default("#B2EBE4"),
  borderOrangeColor: z.string().default("#FFD8BF"),
  emergencyColor: z.string().default("#D92D20"),

  // Typography
  fontFamily: z.string().default("'Lato', system-ui, -apple-system, sans-serif"),
  headingFontFamily: z.string().default("'Lato', system-ui, -apple-system, sans-serif"),

  // Geometry / Radii
  radiusCard: z.string().default("20px"),
  radiusHero: z.string().default("30px"),
  radiusButton: z.string().default("12px"),
  radiusPill: z.string().default("999px"),

  // Display Mode & Preset
  mode: ThemeModeSchema.default("light"),
  activePreset: z.string().default("classic")
});

export type WebsiteTheme = z.infer<typeof WebsiteThemeSchema>;

export const AdminThemeSchema = z.object({
  // Admin Identity & Accents
  primaryColor: z.string().default("#007A6C"),
  accentColor: z.string().default("#00C7BE"),
  secondaryColor: z.string().default("#FF6B00"),

  // Shell Layout Colors
  sidebarBackground: z.string().default("#061E1B"),
  sidebarText: z.string().default("#F4F6F9"),
  sidebarActiveBackground: z.string().default("#0B2B27"),
  headerBackground: z.string().default("#FFFFFF"),
  headerText: z.string().default("#1E293B"),
  contentBackground: z.string().default("#F8FAFC"),
  cardBackground: z.string().default("#FFFFFF"),

  // Inks & Borders
  textColor: z.string().default("#1E293B"),
  textMutedColor: z.string().default("#64748B"),
  borderColor: z.string().default("#E2E8F0"),

  // Typography & Geometry
  fontFamily: z.string().default("'Lato', system-ui, -apple-system, sans-serif"),
  radiusCard: z.string().default("16px"),
  radiusButton: z.string().default("10px"),

  // Display Mode & Preset
  mode: ThemeModeSchema.default("light"),
  activePreset: z.string().default("classic")
});

export type AdminTheme = z.infer<typeof AdminThemeSchema>;

export const DEFAULT_WEBSITE_THEME: WebsiteTheme = {
  primaryColor: "#00C7BE",
  secondaryColor: "#FF6B00",
  accentColor: "#FF6D1B",
  actionColor: "#007A6C",
  actionHoverColor: "#005F54",
  actionAccentColor: "#B54700",
  backgroundColor: "#FFFFFF",
  surfaceColor: "#FFFFFF",
  surfaceMutedColor: "#F4F6F9",
  surfaceTealColor: "#E6F8F6",
  surfaceOrangeColor: "#FFF4EC",
  cardColor: "#FFFFFF",
  textColor: "#262626",
  textMutedColor: "#595959",
  headingColor: "#061E1B",
  borderColor: "#E2E8F0",
  borderTealColor: "#B2EBE4",
  borderOrangeColor: "#FFD8BF",
  emergencyColor: "#D92D20",
  fontFamily: "'Lato', system-ui, -apple-system, sans-serif",
  headingFontFamily: "'Lato', system-ui, -apple-system, sans-serif",
  radiusCard: "20px",
  radiusHero: "30px",
  radiusButton: "12px",
  radiusPill: "999px",
  mode: "light",
  activePreset: "classic"
};

export const DEFAULT_ADMIN_THEME: AdminTheme = {
  primaryColor: "#007A6C",
  accentColor: "#00C7BE",
  secondaryColor: "#FF6B00",
  sidebarBackground: "#061E1B",
  sidebarText: "#F4F6F9",
  sidebarActiveBackground: "#0B2B27",
  headerBackground: "#FFFFFF",
  headerText: "#1E293B",
  contentBackground: "#F8FAFC",
  cardBackground: "#FFFFFF",
  textColor: "#1E293B",
  textMutedColor: "#64748B",
  borderColor: "#E2E8F0",
  fontFamily: "'Lato', system-ui, -apple-system, sans-serif",
  radiusCard: "16px",
  radiusButton: "10px",
  mode: "light",
  activePreset: "classic"
};

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  websiteTheme: Partial<WebsiteTheme>;
  adminTheme: Partial<AdminTheme>;
}

export const THEME_PRESETS: Record<string, ThemePreset> = {
  classic: {
    id: "classic",
    name: "AKEEZO Classic (Teal & Orange)",
    description: "Official dual-palette brand identity with clinical dark teal action and vibrant orange accents.",
    websiteTheme: {
      primaryColor: "#00C7BE",
      secondaryColor: "#FF6B00",
      accentColor: "#FF6D1B",
      actionColor: "#007A6C",
      actionHoverColor: "#005F54",
      actionAccentColor: "#B54700",
      backgroundColor: "#FFFFFF",
      surfaceColor: "#FFFFFF",
      surfaceMutedColor: "#F4F6F9",
      surfaceTealColor: "#E6F8F6",
      surfaceOrangeColor: "#FFF4EC",
      cardColor: "#FFFFFF",
      textColor: "#262626",
      textMutedColor: "#595959",
      headingColor: "#061E1B",
      borderColor: "#E2E8F0",
      borderTealColor: "#B2EBE4",
      borderOrangeColor: "#FFD8BF",
      emergencyColor: "#D92D20",
      fontFamily: "'Lato', system-ui, -apple-system, sans-serif",
      headingFontFamily: "'Lato', system-ui, -apple-system, sans-serif",
      radiusCard: "20px",
      radiusHero: "30px",
      radiusButton: "12px",
      radiusPill: "999px",
      mode: "light",
      activePreset: "classic"
    },
    adminTheme: {
      primaryColor: "#007A6C",
      accentColor: "#00C7BE",
      secondaryColor: "#FF6B00",
      sidebarBackground: "#061E1B",
      sidebarText: "#F4F6F9",
      sidebarActiveBackground: "#0B2B27",
      headerBackground: "#FFFFFF",
      headerText: "#1E293B",
      contentBackground: "#F8FAFC",
      cardBackground: "#FFFFFF",
      textColor: "#1E293B",
      textMutedColor: "#64748B",
      borderColor: "#E2E8F0",
      fontFamily: "'Lato', system-ui, -apple-system, sans-serif",
      radiusCard: "16px",
      radiusButton: "10px",
      mode: "light",
      activePreset: "classic"
    }
  },
  emerald: {
    id: "emerald",
    name: "Emerald Vitality",
    description: "Invigorating healthcare green palette symbolizing renewal, wellness, and clinical trust.",
    websiteTheme: {
      primaryColor: "#10B981",
      secondaryColor: "#F59E0B",
      accentColor: "#D97706",
      actionColor: "#059669",
      actionHoverColor: "#047857",
      actionAccentColor: "#B45309",
      backgroundColor: "#FFFFFF",
      surfaceColor: "#FFFFFF",
      surfaceMutedColor: "#F0FDF4",
      surfaceTealColor: "#DCFCE7",
      surfaceOrangeColor: "#FEF3C7",
      cardColor: "#FFFFFF",
      textColor: "#1F2937",
      textMutedColor: "#4B5563",
      headingColor: "#064E3B",
      borderColor: "#E5E7EB",
      borderTealColor: "#A7F3D0",
      borderOrangeColor: "#FDE68A",
      emergencyColor: "#DC2626",
      fontFamily: "'Open Sans', system-ui, sans-serif",
      headingFontFamily: "'Open Sans', system-ui, sans-serif",
      radiusCard: "18px",
      radiusHero: "28px",
      radiusButton: "12px",
      radiusPill: "999px",
      mode: "light",
      activePreset: "emerald"
    },
    adminTheme: {
      primaryColor: "#059669",
      accentColor: "#10B981",
      secondaryColor: "#F59E0B",
      sidebarBackground: "#064E3B",
      sidebarText: "#ECFDF5",
      sidebarActiveBackground: "#065F46",
      headerBackground: "#FFFFFF",
      headerText: "#111827",
      contentBackground: "#F9FAFB",
      cardBackground: "#FFFFFF",
      textColor: "#111827",
      textMutedColor: "#6B7280",
      borderColor: "#E5E7EB",
      fontFamily: "'Open Sans', system-ui, sans-serif",
      radiusCard: "16px",
      radiusButton: "10px",
      mode: "light",
      activePreset: "emerald"
    }
  },
  sapphire: {
    id: "sapphire",
    name: "Ocean Sapphire Clinical",
    description: "Deep clinical oceanic blues conveying world-class hospital authority, reassurance, and precision.",
    websiteTheme: {
      primaryColor: "#0284C7",
      secondaryColor: "#F97316",
      accentColor: "#EA580C",
      actionColor: "#0369A1",
      actionHoverColor: "#075985",
      actionAccentColor: "#C2410C",
      backgroundColor: "#FFFFFF",
      surfaceColor: "#FFFFFF",
      surfaceMutedColor: "#F0F9FF",
      surfaceTealColor: "#E0F2FE",
      surfaceOrangeColor: "#FFEDD5",
      cardColor: "#FFFFFF",
      textColor: "#0F172A",
      textMutedColor: "#475569",
      headingColor: "#082F49",
      borderColor: "#E2E8F0",
      borderTealColor: "#BAE6FD",
      borderOrangeColor: "#FED7AA",
      emergencyColor: "#E11D48",
      fontFamily: "'Inter', system-ui, sans-serif",
      headingFontFamily: "'Inter', system-ui, sans-serif",
      radiusCard: "16px",
      radiusHero: "24px",
      radiusButton: "10px",
      radiusPill: "999px",
      mode: "light",
      activePreset: "sapphire"
    },
    adminTheme: {
      primaryColor: "#0369A1",
      accentColor: "#38BDF8",
      secondaryColor: "#F97316",
      sidebarBackground: "#082F49",
      sidebarText: "#F0F9FF",
      sidebarActiveBackground: "#0C4A6E",
      headerBackground: "#FFFFFF",
      headerText: "#0F172A",
      contentBackground: "#F8FAFC",
      cardBackground: "#FFFFFF",
      textColor: "#0F172A",
      textMutedColor: "#64748B",
      borderColor: "#E2E8F0",
      fontFamily: "'Inter', system-ui, sans-serif",
      radiusCard: "14px",
      radiusButton: "8px",
      mode: "light",
      activePreset: "sapphire"
    }
  },
  midnight: {
    id: "midnight",
    name: "Midnight Clinical (Dark)",
    description: "Sleek, eye-resting dark mode theme with neon cyan and warm amber contrast for night operation.",
    websiteTheme: {
      primaryColor: "#00C7BE",
      secondaryColor: "#FF8A3D",
      accentColor: "#FFA05C",
      actionColor: "#00A896",
      actionHoverColor: "#028073",
      actionAccentColor: "#D9681E",
      backgroundColor: "#061E1B",
      surfaceColor: "#0B2B27",
      surfaceMutedColor: "#0F3833",
      surfaceTealColor: "#134640",
      surfaceOrangeColor: "#3D2B1C",
      cardColor: "#0B2B27",
      textColor: "#F1F5F9",
      textMutedColor: "#94A3B8",
      headingColor: "#FFFFFF",
      borderColor: "#1E4B45",
      borderTealColor: "#00C7BE",
      borderOrangeColor: "#FF8A3D",
      emergencyColor: "#F43F5E",
      fontFamily: "'Poppins', system-ui, sans-serif",
      headingFontFamily: "'Poppins', system-ui, sans-serif",
      radiusCard: "20px",
      radiusHero: "30px",
      radiusButton: "12px",
      radiusPill: "999px",
      mode: "dark",
      activePreset: "midnight"
    },
    adminTheme: {
      primaryColor: "#00A896",
      accentColor: "#00C7BE",
      secondaryColor: "#FF8A3D",
      sidebarBackground: "#030E0D",
      sidebarText: "#F8FAFC",
      sidebarActiveBackground: "#092420",
      headerBackground: "#061E1B",
      headerText: "#F8FAFC",
      contentBackground: "#0B2B27",
      cardBackground: "#0F3833",
      textColor: "#F1F5F9",
      textMutedColor: "#94A3B8",
      borderColor: "#1E4B45",
      fontFamily: "'Poppins', system-ui, sans-serif",
      radiusCard: "16px",
      radiusButton: "10px",
      mode: "dark",
      activePreset: "midnight"
    }
  },
  warmCare: {
    id: "warmCare",
    name: "Warm Care (Coral & Violet)",
    description: "Gentle empathetic medical palette blending comforting coral warmth with royal healing violet.",
    websiteTheme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#FB923C",
      accentColor: "#F97316",
      actionColor: "#7C3AED",
      actionHoverColor: "#6D28D9",
      actionAccentColor: "#EA580C",
      backgroundColor: "#FFFFFF",
      surfaceColor: "#FFFFFF",
      surfaceMutedColor: "#FAF5FF",
      surfaceTealColor: "#F3E8FF",
      surfaceOrangeColor: "#FFF7ED",
      cardColor: "#FFFFFF",
      textColor: "#1E1B4B",
      textMutedColor: "#6B7280",
      headingColor: "#2E1065",
      borderColor: "#E9D5FF",
      borderTealColor: "#D8B4FE",
      borderOrangeColor: "#FED7AA",
      emergencyColor: "#E11D48",
      fontFamily: "'Lato', system-ui, -apple-system, sans-serif",
      headingFontFamily: "'Poppins', system-ui, sans-serif",
      radiusCard: "22px",
      radiusHero: "32px",
      radiusButton: "14px",
      radiusPill: "999px",
      mode: "light",
      activePreset: "warmCare"
    },
    adminTheme: {
      primaryColor: "#7C3AED",
      accentColor: "#A78BFA",
      secondaryColor: "#FB923C",
      sidebarBackground: "#2E1065",
      sidebarText: "#FAF5FF",
      sidebarActiveBackground: "#3B0764",
      headerBackground: "#FFFFFF",
      headerText: "#1E1B4B",
      contentBackground: "#FAF5FF",
      cardBackground: "#FFFFFF",
      textColor: "#1E1B4B",
      textMutedColor: "#6B7280",
      borderColor: "#E9D5FF",
      fontFamily: "'Lato', system-ui, -apple-system, sans-serif",
      radiusCard: "16px",
      radiusButton: "10px",
      mode: "light",
      activePreset: "warmCare"
    }
  }
};



// ==========================================
// MEDIA WEB OPTIMIZATION SETTINGS SCHEMA
// ==========================================
export const MediaOptimizationSettingsSchema = z.object({
  autoOptimizeOnUpload: z.boolean().default(true),
  quality: z.number().min(1).max(100).default(80),
  maxWidth: z.number().min(100).max(4096).default(1920),
  maxHeight: z.number().min(100).max(4096).default(1920),
  generateVariants: z.boolean().default(true),
  format: z.enum(["webp", "original"]).default("webp"),
  preserveOriginals: z.boolean().default(true),
});

export type MediaOptimizationSettings = z.infer<typeof MediaOptimizationSettingsSchema>;

export const DEFAULT_MEDIA_OPTIMIZATION_SETTINGS: MediaOptimizationSettings = {
  autoOptimizeOnUpload: true,
  quality: 80,
  maxWidth: 1920,
  maxHeight: 1920,
  generateVariants: true,
  format: "webp",
  preserveOriginals: true,
};

// ==========================================
// 5 CORE THIRD-PARTY CLOUD & MARKETING INTEGRATIONS
// ==========================================

export const GoogleTagManagerConfigSchema = z.object({
  enabled: z.boolean().default(false),
  containerId: z.string().default(""), // e.g. GTM-XXXXXXX
});
export type GoogleTagManagerConfig = z.infer<typeof GoogleTagManagerConfigSchema>;

export const GoogleCloudConfigSchema = z.object({
  enabled: z.boolean().default(true),
  projectId: z.string().default("akeezo-health-prod"),
  clientEmail: z.string().default("service-account@akeezo-health-prod.iam.gserviceaccount.com"),
  region: z.string().default("asia-south1"),
  storageBucket: z.string().default("gs://akeezo-vault-prod"),
  status: z.enum(["connected", "unconfigured", "error"]).default("connected"),
});
export type GoogleCloudConfig = z.infer<typeof GoogleCloudConfigSchema>;

export const MetaPixelConfigSchema = z.object({
  enabled: z.boolean().default(false),
  pixelId: z.string().default(""), // e.g. 123456789012345
  testEventCode: z.string().default(""),
});
export type MetaPixelConfig = z.infer<typeof MetaPixelConfigSchema>;

export const GeminiApiConfigSchema = z.object({
  enabled: z.boolean().default(true),
  apiKey: z.string().default(""),
  apiKeyMasked: z.string().default(""),
  model: z.string().default("gemini-2.0-flash"),
  temperature: z.number().min(0).max(1).default(0.2),
  status: z.enum(["active", "unconfigured", "error"]).default("active"),
  lastTestedAt: z.string().optional(),
});
export type GeminiApiConfig = z.infer<typeof GeminiApiConfigSchema>;

export const GoogleAnalyticsConfigSchema = z.object({
  enabled: z.boolean().default(true),
  measurementId: z.string().default("G-AKEEZO2026X"),
  anonymizeIp: z.boolean().default(true),
});
export type GoogleAnalyticsConfig = z.infer<typeof GoogleAnalyticsConfigSchema>;

export const PlatformIntegrationsSchema = z.object({
  googleTagManager: GoogleTagManagerConfigSchema.default({}),
  googleCloud: GoogleCloudConfigSchema.default({}),
  metaPixel: MetaPixelConfigSchema.default({}),
  gemini: GeminiApiConfigSchema.default({}),
  googleAnalytics: GoogleAnalyticsConfigSchema.default({}),
  // Legacy / mask backward-compatibility fields
  googleAnalyticsId: z.string().optional(),
  firebaseProjectMasked: z.string().optional(),
  smtpHostMasked: z.string().optional(),
  storageBucketMasked: z.string().optional(),
});
export type PlatformIntegrations = z.infer<typeof PlatformIntegrationsSchema>;

export const DEFAULT_PLATFORM_INTEGRATIONS: PlatformIntegrations = {
  googleTagManager: {
    enabled: false,
    containerId: "GTM-AKZ89P4",
  },
  googleCloud: {
    enabled: true,
    projectId: "akeezo-health-prod",
    clientEmail: "service-account@akeezo-health-prod.iam.gserviceaccount.com",
    region: "asia-south1",
    storageBucket: "gs://akeezo-vault-prod",
    status: "connected",
  },
  metaPixel: {
    enabled: false,
    pixelId: "982347109283471",
    testEventCode: "",
  },
  gemini: {
    enabled: true,
    apiKey: "",
    apiKeyMasked: "AIzaSy••••••••••••••••••••••••••••",
    model: "gemini-2.0-flash",
    temperature: 0.2,
    status: "active",
  },
  googleAnalytics: {
    enabled: true,
    measurementId: "G-AKEEZO2026X",
    anonymizeIp: true,
  },
  googleAnalyticsId: "G-AKEEZO2026X",
  firebaseProjectMasked: "akeezo-health-prod (Active)",
  smtpHostMasked: "smtp.sendgrid.net (Configured)",
  storageBucketMasked: "gs://akeezo-vault-prod (Protected)",
};

export const CarouselSlideSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  badgeText: z.string(),
  badgeStyle: z.string().default("orange"), // "orange" | "teal" | "purple" | "blue" | "emerald"
  buttonText: z.string(),
  buttonAction: z.string().default("calculator"), // "calculator" | "explore" | "link" | "whatsapp"
  buttonLink: z.string().optional().default(""),
  accentColor: z.string().default("orange"), // "orange" | "teal" | "purple" | "blue" | "emerald"
  iconName: z.string().default("calculator"), // "calculator" | "compass" | "shield" | "heart" | "stethoscope" | "award" | "activity"
  isActive: z.boolean().default(true),
  order: z.number().default(0)
});

export type CarouselSlide = z.infer<typeof CarouselSlideSchema>;

export const DEFAULT_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: "calculator",
    title: "Get Your Personalized Price",
    description: "See the real price before you talk to anyone. Compare itemized hospital quotes, room categories, and physician fees with zero markups.",
    badgeText: "Save Up To 70%",
    badgeStyle: "orange",
    buttonText: "Get Your Estimate in 1 Minute",
    buttonAction: "calculator",
    buttonLink: "/cost-calculator",
    accentColor: "orange",
    iconName: "calculator",
    isActive: true,
    order: 1
  },
  {
    id: "destinations",
    title: "Explore Treatments & Hospitals",
    description: "Every accredited Indian healthcare destination, JCI-certified hospital, and world-renowned department chair organized in one directory.",
    badgeText: "150+ Verified Hubs",
    badgeStyle: "teal",
    buttonText: "Explore All Specialities",
    buttonAction: "explore",
    buttonLink: "/hospitals",
    accentColor: "teal",
    iconName: "compass",
    isActive: true,
    order: 2
  },
  {
    id: "second-opinion",
    title: "Free Clinical Second Opinion",
    description: "Upload diagnostic scans or pathology reports to receive independent treatment evaluations from top Indian department chairs within 24-48 hours.",
    badgeText: "100% Free & Confidential",
    badgeStyle: "purple",
    buttonText: "Get Free Second Opinion",
    buttonAction: "whatsapp",
    buttonLink: "/#opinion",
    accentColor: "purple",
    iconName: "stethoscope",
    isActive: true,
    order: 3
  },
  {
    id: "medical-visa",
    title: "Fast-Track Medical Visa (FRRO)",
    description: "Official hospital invitation letters dispatched in under 24 hours. Complete airport reception, private transport, and local language concierge.",
    badgeText: "24-48h Visa Letter",
    badgeStyle: "emerald",
    buttonText: "Learn About Visa Support",
    buttonAction: "link",
    buttonLink: "/#visa",
    accentColor: "emerald",
    iconName: "shield",
    isActive: true,
    order: 4
  }
];

export const SiteSettingsSchema = z.object({
  brandName: z.string().default("AKEEZO"),
  tagline: z.string().default("Heal In India, Heal By Akeezo"),
  legalEntityName: z.string().default("AKEEZO Healthcare Platform Private Limited"),
  officeAddress: z.string().default("Regus Elegance, Jasola District Centre, New Delhi, India 110025"),
  headquartersAddress: z.string().optional(),
  phone: z.string().default("+91 82876 39443"),
  careEmail: z.string().default("care@akeezo.com"),
  medicalEmail: z.string().default("medical@akeezo.com"),
  partnershipEmail: z.string().default("partnership@akeezo.com"),
  grievanceEmail: z.string().default("grievance@akeezo.com"),
  dpoEmail: z.string().default("dpo@akeezo.com"),
  consentEmail: z.string().default("consent@akeezo.com"),
  supportEmail: z.string().default("support@akeezo.com"),
  contactEmail: z.string().optional(),
  emergencyHelpline: z.string().optional(),
  whatsappHelpline: z.string().optional(),
  showTopUtilityBar: z.boolean().default(true),
  emergencyNotice: z.string().default("EMERGENCY?"),
  telegramChannel: z.string().default("https://t.me/akeezohealth"),
  supportedLocales: z.array(z.string()).default(["en"]),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  actionColor: z.string().optional(),
  websiteTheme: WebsiteThemeSchema.default(DEFAULT_WEBSITE_THEME),
  adminTheme: AdminThemeSchema.default(DEFAULT_ADMIN_THEME),
  integrations: PlatformIntegrationsSchema.optional(),
  mediaSettings: MediaOptimizationSettingsSchema.optional(),
  logoVariants: z
    .object({
      light: z.string().optional(),
      dark: z.string().optional(),
      mark: z.string().optional()
    })
    .optional(),
  grievanceOfficer: z
    .object({
      name: z.string().optional(),
      designation: z.string().optional(),
      email: z.string().optional(),
      helpline: z.string().optional(),
      address: z.string().optional()
    })
    .optional(),
  dpoContact: z
    .object({
      email: z.string().optional(),
      address: z.string().optional()
    })
    .optional(),
  socialLinks: z.record(z.string()).optional(),
  carouselSlides: z.array(CarouselSlideSchema).optional().default(DEFAULT_CAROUSEL_SLIDES)
});

export type SiteSettings = z.infer<typeof SiteSettingsSchema>;

// Helper functions for CSS variable generation
export function sanitizeCssValue(val?: string): string {
  if (!val) return "";
  // Strip characters that could terminate CSS rules or inject tags
  return val.replace(/[<>{};]/g, "").trim();
}

export function websiteThemeToCssVariables(theme?: Partial<WebsiteTheme>): Record<string, string> {
  const merged: WebsiteTheme = { ...DEFAULT_WEBSITE_THEME, ...(theme || {}) };
  return {
    "--brand-teal": sanitizeCssValue(merged.primaryColor),
    "--brand-orange": sanitizeCssValue(merged.secondaryColor),
    "--brand-orange-alt": sanitizeCssValue(merged.accentColor),
    "--action": sanitizeCssValue(merged.actionColor),
    "--action-hover": sanitizeCssValue(merged.actionHoverColor),
    "--action-accent": sanitizeCssValue(merged.actionAccentColor),
    "--action-orange": sanitizeCssValue(merged.secondaryColor),
    "--action-orange-alt": sanitizeCssValue(merged.accentColor),
    "--surface": sanitizeCssValue(merged.surfaceColor),
    "--surface-muted": sanitizeCssValue(merged.surfaceMutedColor),
    "--surface-teal": sanitizeCssValue(merged.surfaceTealColor),
    "--surface-orange": sanitizeCssValue(merged.surfaceOrangeColor),
    "--ink": sanitizeCssValue(merged.textColor),
    "--ink-muted": sanitizeCssValue(merged.textMutedColor),
    "--border": sanitizeCssValue(merged.borderColor),
    "--border-teal": sanitizeCssValue(merged.borderTealColor),
    "--border-orange": sanitizeCssValue(merged.borderOrangeColor),
    "--emergency": sanitizeCssValue(merged.emergencyColor),
    "--navy": sanitizeCssValue(merged.headingColor),
    "--font-ui": sanitizeCssValue(merged.fontFamily),
    "--font-heading": sanitizeCssValue(merged.headingFontFamily),
    "--radius-card": sanitizeCssValue(merged.radiusCard),
    "--radius-hero": sanitizeCssValue(merged.radiusHero),
    "--radius-pill": sanitizeCssValue(merged.radiusPill),
    "--radius-sm": "8px",
    "--radius-md": sanitizeCssValue(merged.radiusButton),
    "--radius-lg": "16px",
    "--radius-xl": sanitizeCssValue(merged.radiusCard),
    "--radius-2xl": "24px",
    "--radius-3xl": sanitizeCssValue(merged.radiusHero),
    "--radius-full": sanitizeCssValue(merged.radiusPill),
    "--radius": sanitizeCssValue(merged.radiusButton),
    "--background": sanitizeCssValue(merged.backgroundColor),
    "--foreground": sanitizeCssValue(merged.textColor),
    "--card": sanitizeCssValue(merged.cardColor),
    "--card-foreground": sanitizeCssValue(merged.textColor),
    "--popover": sanitizeCssValue(merged.cardColor),
    "--popover-foreground": sanitizeCssValue(merged.textColor),
    "--primary": sanitizeCssValue(merged.actionColor),
    "--primary-foreground": "#ffffff",
    "--secondary": sanitizeCssValue(merged.surfaceTealColor),
    "--secondary-foreground": sanitizeCssValue(merged.actionColor),
    "--muted": sanitizeCssValue(merged.surfaceMutedColor),
    "--muted-foreground": sanitizeCssValue(merged.textMutedColor),
    "--accent": sanitizeCssValue(merged.surfaceOrangeColor),
    "--accent-foreground": sanitizeCssValue(merged.actionAccentColor),
    "--destructive": sanitizeCssValue(merged.emergencyColor),
    "--destructive-foreground": "#ffffff",
    "--ring": sanitizeCssValue(merged.actionColor)
  };
}

export function adminThemeToCssVariables(theme?: Partial<AdminTheme>): Record<string, string> {
  const merged: AdminTheme = { ...DEFAULT_ADMIN_THEME, ...(theme || {}) };
  return {
    "--admin-primary": sanitizeCssValue(merged.primaryColor),
    "--admin-accent": sanitizeCssValue(merged.accentColor),
    "--admin-secondary": sanitizeCssValue(merged.secondaryColor),
    "--admin-sidebar-bg": sanitizeCssValue(merged.sidebarBackground),
    "--admin-sidebar-text": sanitizeCssValue(merged.sidebarText),
    "--admin-sidebar-active": sanitizeCssValue(merged.sidebarActiveBackground),
    "--admin-header-bg": sanitizeCssValue(merged.headerBackground),
    "--admin-header-text": sanitizeCssValue(merged.headerText),
    "--admin-content-bg": sanitizeCssValue(merged.contentBackground),
    "--admin-card-bg": sanitizeCssValue(merged.cardBackground),
    "--admin-text": sanitizeCssValue(merged.textColor),
    "--admin-text-muted": sanitizeCssValue(merged.textMutedColor),
    "--admin-border": sanitizeCssValue(merged.borderColor),
    "--admin-font": sanitizeCssValue(merged.fontFamily),
    "--admin-radius-card": sanitizeCssValue(merged.radiusCard),
    "--admin-radius-button": sanitizeCssValue(merged.radiusButton)
  };
}

export function generateWebsiteThemeCss(theme?: Partial<WebsiteTheme>): string {
  const vars = websiteThemeToCssVariables(theme);
  const rules = Object.entries(vars)
    .map(([key, val]) => `  ${key}: ${val};`)
    .join("\n");
  return `:root {\n${rules}\n}`;
}

export function generateAdminThemeCss(theme?: Partial<AdminTheme>): string {
  const vars = adminThemeToCssVariables(theme);
  const rules = Object.entries(vars)
    .map(([key, val]) => `  ${key}: ${val};`)
    .join("\n");
  return `:root {\n${rules}\n}`;
}

export function extractPrimaryFontName(fontFamily?: string): string | null {
  if (!fontFamily) return null;
  const cleaned = sanitizeCssValue(fontFamily);
  const first = cleaned.split(",")[0].trim().replace(/^['"]|['"]$/g, "").trim();
  if (!first) return null;
  const generic = [
    "system-ui",
    "-apple-system",
    "blinkmacsystemfont",
    "segoe ui",
    "sans-serif",
    "serif",
    "monospace",
    "cursive",
    "fantasy",
    "inherit",
    "initial"
  ];
  if (generic.includes(first.toLowerCase())) {
    return null;
  }
  return first;
}

export function getGoogleFontUrl(fontFamily?: string): string | null {
  const fontName = extractPrimaryFontName(fontFamily);
  if (!fontName) return null;
  // Lato is bundled locally via @fontsource/lato in index.css
  if (fontName.toLowerCase() === "lato") return null;
  const encoded = fontName.replace(/\s+/g, "+");
  return `https://fonts.googleapis.com/css2?family=${encoded}:wght@300;400;500;600;700;800;900&display=swap`;
}




