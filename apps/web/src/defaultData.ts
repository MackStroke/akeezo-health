import {
  type PublicRouteResponseDTO,
  type SiteSettings,
  DEFAULT_WEBSITE_THEME,
  DEFAULT_ADMIN_THEME
} from "@akeezo/contracts";

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
  websiteTheme: DEFAULT_WEBSITE_THEME,
  adminTheme: DEFAULT_ADMIN_THEME,
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

  const LEGAL_SEO_MAP: Record<string, { title: string; description: string }> = {
    "/privacy": {
      title: "Privacy Policy | AKEEZO Healthcare Platform",
      description: "Learn how AKEEZO protects patient health information (PHI) and clinical records under GDPR, HIPAA, and India DPDP Act 2023."
    },
    "/terms": {
      title: "Terms of Service | AKEEZO Healthcare Platform",
      description: "Terms and conditions governing healthcare discovery, hospital facilitation, and medical travel coordination with AKEEZO."
    },
    "/disclaimer": {
      title: "Medical Disclaimer | AKEEZO Healthcare Platform",
      description: "Critical medical notice outlining AKEEZO's non-clinical facilitation scope, physician independence, and emergency care advisory."
    },
    "/consent": {
      title: "Informed Patient Consent | AKEEZO Healthcare Platform",
      description: "Explicit consent framework for cross-border medical record transmission, hospital referral, and teleconsultation coordination."
    },
    "/refund-policy": {
      title: "Refund Policy & Service Surety | AKEEZO Healthcare Platform",
      description: "Read AKEEZO's 100% Service Surety commitment and transparent refund guidelines for medical travel coordination."
    },
    "/grievance-officer": {
      title: "Grievance Redressal Officer | AKEEZO Healthcare Platform",
      description: "Contact AKEEZO's designated Grievance Officer under the IT Intermediary Rules 2021 and Digital Personal Data Protection Act 2023."
    }
  };

  if (normalized === "/500") {
    return {
      pageKind: "serverError",
      path: "/500",
      locale: "en",
      seo: {
        title: "500 - Server Error | AKEEZO Healthcare Platform",
        description: "A temporary system interruption occurred. Our clinical records and patient data remain secure. Contact our 24/7 care desk for assistance.",
        canonicalPath: "/500",
        robots: "noindex,nofollow",
        schemaKind: "WebPage"
      },
      payload: {},
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 500
    };
  }

  const legalSeo = LEGAL_SEO_MAP[normalized];
  if (legalSeo) {
    return {
      pageKind: "legal",
      path: normalized,
      locale: "en",
      seo: {
        title: legalSeo.title,
        description: legalSeo.description,
        canonicalPath: normalized,
        robots: "index,follow",
        schemaKind: "WebPage"
      },
      payload: {},
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized === "/cost-calculator" || normalized === "/calculator") {
    return {
      pageKind: "calculatorLanding",
      path: normalized,
      locale: "en",
      seo: {
        title: "Surgery Cost Calculator Tool | Save up to 70% | AKEEZO",
        description:
          "Compare surgery costs across top medical destinations and accredited international hospitals. Get transparent estimates and connect with world-class surgeons.",
        canonicalPath: "/cost-calculator",
        robots: "index,follow",
        schemaKind: "MedicalWebPage"
      },
      payload: {
        headline: "Surgery Cost Calculator Tool",
        tagline: "Save up to 70%"
      },
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized === "/treatments" || normalized.startsWith("/treatments/")) {
    return {
      pageKind: "treatmentDirectory",
      path: normalized,
      locale: "en",
      seo: {
        title: "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO",
        description:
          "Discover comprehensive medical treatments worldwide. Compare prices, read reviews, and find accredited international healthcare options with AKEEZO.",
        canonicalPath: "/treatments",
        robots: "index,follow",
        schemaKind: "MedicalWebPage"
      },
      payload: {
        headline: "Find The Best Treatments Worldwide",
        subheadline: "World-class care, anywhere in the world."
      },
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
      title: "404 - Healthcare Resource Not Found | AKEEZO Healthcare Platform",
      description: "The requested medical procedure, hospital, or specialist could not be found. Contact our 24/7 care coordination desk for immediate assistance.",
      canonicalPath: normalized,
      robots: "noindex,nofollow",
      schemaKind: "WebPage"
    },
    payload: {},
    siteSettings: DEFAULT_SITE_SETTINGS,
    statusCode: 404
  };
}
