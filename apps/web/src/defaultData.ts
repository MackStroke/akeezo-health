import type { PublicRouteResponseDTO, SiteSettings } from "@akeezo/contracts";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: "AKEEZO",
  tagline: "Heal In India, Heal By Akeezo",
  legalEntityName: "AKEEZO Healthcare Platform Private Limited",
  officeAddress: "Regus Elegance, Jasola District Centre, New Delhi, India 110025",
  headquartersAddress: "Regus Elegance, Jasola District Centre, New Delhi, India 110025",
  phone: "+91 82876 39443",
  careEmail: "care@akeezo.com",
  medicalEmail: "medical@akeezo.com",
  partnershipEmail: "partnership@akeezo.com",
  grievanceEmail: "grievance@akeezo.com",
  dpoEmail: "dpo@akeezo.com",
  consentEmail: "consent@akeezo.com",
  supportEmail: "support@akeezo.com",
  contactEmail: "care@akeezo.com",
  emergencyHelpline: "+91 82876 39443",
  whatsappHelpline: "+91 82876 39443",
  showTopUtilityBar: true,
  emergencyNotice: "EMERGENCY?",
  telegramChannel: "https://t.me/akeezohealth",
  supportedLocales: ["en"],
  primaryColor: "#00C7BE",
  secondaryColor: "#FF6B00",
  accentColor: "#FF6D1B",
  actionColor: "#007A6C",
  logoVariants: {
    light: "/logo/logo with tagline-light.svg",
    dark: "/logo/logo with tagline-dark.svg",
    mark: "/logo/favicon.svg"
  },
  grievanceOfficer: {
    name: "Yogesh Verma",
    designation: "Co-Founder & Chief Operating Officer",
    email: "grievance@akeezo.com",
    helpline: "+91 82876 39443",
    address: "Regus Elegance, Jasola District Centre, New Delhi, India 110025"
  },
  dpoContact: {
    email: "dpo@akeezo.com",
    address: "AKEEZO Healthcare Platform Private Limited, New Delhi, India 110001"
  }
};

export function getDefaultRouteData(path = "/"): PublicRouteResponseDTO {
  const normalized = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;

  if (normalized === "/500") {
    return {
      pageKind: "serverError",
      path: "/500",
      locale: "en",
      seo: {
        title: "Server Error | AKEEZO Healthcare Platform",
        description: "A temporary system error occurred. Our 24/7 care coordination desk is standing by.",
        canonicalPath: "/500",
        robots: "noindex,nofollow",
        schemaKind: "WebPage"
      },
      payload: {},
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 500
    };
  }

  const isLegal = [
    "/privacy",
    "/terms",
    "/disclaimer",
    "/consent",
    "/refund-policy",
    "/grievance-officer"
  ].includes(normalized);

  if (isLegal) {
    return {
      pageKind: "legal",
      path: normalized,
      locale: "en",
      seo: {
        title: `${normalized.slice(1).replace("-", " ").toUpperCase()} | AKEEZO Healthcare Platform`,
        description: "Official legal, governance and compliance policies for AKEEZO Healthcare Platform.",
        canonicalPath: normalized,
        robots: "index,follow",
        schemaKind: "WebPage"
      },
      payload: {},
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized === "/") {
    return {
      pageKind: "home",
      path: "/",
      locale: "en",
      seo: {
        title: "AKEEZO | Heal In India, Heal By Akeezo - Medical Tourism & Treatment in India",
        description:
          "Discover accredited Indian hospitals, consult top doctors, and receive guided care coordination and transparent cost estimates.",
        canonicalPath: "/",
        robots: "index,follow",
        schemaKind: "MedicalWebPage"
      },
      payload: {
        headline: "World-Class Medical Care in India, Simplified & Guided",
        tagline: "Heal In India, Heal By Akeezo"
      },
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  // Any unknown route defaults to 404 notFound
  return {
    pageKind: "notFound",
    path: normalized,
    locale: "en",
    seo: {
      title: "Page Not Found | AKEEZO Healthcare Platform",
      description: "The requested healthcare service or page could not be found.",
      canonicalPath: normalized,
      robots: "noindex,nofollow",
      schemaKind: "WebPage"
    },
    payload: {},
    siteSettings: DEFAULT_SITE_SETTINGS,
    statusCode: 404
  };
}
