import {
  type PublicRouteResponseDTO,
  type SiteSettings,
  DEFAULT_WEBSITE_THEME,
  DEFAULT_ADMIN_THEME,
  DEFAULT_CAROUSEL_SLIDES,
  getDoctorDetail
} from "@akeezo/contracts";
import { ALL_BLOG_ARTICLES } from "./data/blogData.js";
import { ALL_DOCTORS } from "./data/doctorsData.js";

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
  },
  carouselSlides: DEFAULT_CAROUSEL_SLIDES
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

  if (normalized === "/cost-calculator" || normalized === "/calculator" || normalized === "/cma-planner") {
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
    const slug = normalized.startsWith("/treatments/")
      ? normalized.replace(/^\/treatments\/?/, "").split("/")[0]
      : "";
    const isDetail = Boolean(slug);
    const formattedTitle = slug
      ? slug
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "Medical Treatments Worldwide";

    return {
      pageKind: isDetail ? "treatmentDetail" : "treatmentDirectory",
      path: normalized,
      locale: "en",
      seo: {
        title: isDetail
          ? `${formattedTitle} Abroad | Find Best Treatment Options | AKEEZO`
          : "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO",
        description: isDetail
          ? `Discover accredited international hospitals and pricing for ${formattedTitle}. Compare options and plan your treatment abroad with AKEEZO.`
          : "Discover comprehensive medical treatments worldwide. Compare prices, read reviews, and find accredited international healthcare options with AKEEZO.",
        canonicalPath: normalized,
        robots: "index,follow",
        schemaKind: "MedicalWebPage"
      },
      payload: {
        slug: slug || undefined,
        headline: isDetail ? formattedTitle : "Find The Best Treatments Worldwide",
        subheadline: "World-class care, anywhere in the world."
      },
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized === "/hospitals" || normalized.startsWith("/hospitals/")) {
    return {
      pageKind: "hospitalDirectory",
      path: normalized,
      locale: "en",
      seo: {
        title: "World-Class Hospitals | Personally Matched for You | AKEEZO",
        description:
          "Find and compare top accredited hospitals globally. Transparent estimates, verified patient satisfaction ratings, and complete care coordination with AKEEZO.",
        canonicalPath: "/hospitals",
        robots: "index,follow",
        schemaKind: "MedicalWebPage"
      },
      payload: {
        headline: "World-Class Hospitals, Personally Matched for You",
        subheadline: "Find the Best Hospitals for Your Treatment, Anywhere in the World"
      },
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized === "/doctors" || normalized.startsWith("/doctors/")) {
    const slug = normalized.startsWith("/doctors/") ? normalized.replace(/^\/doctors\/?/, "").split("/")[0] : "";
    if (slug) {
      const doctor = getDoctorDetail(slug, ALL_DOCTORS);
      if (doctor) {
        return {
          pageKind: "doctorDetail",
          path: normalized,
          locale: "en",
          seo: {
            title: `${doctor.name} | ${doctor.specialty} · ${doctor.hospital} | AKEEZO`,
            description: `${doctor.name} is a leading ${doctor.specialty} specialist at ${doctor.hospital} with ${doctor.experience} of experience. Read patient reviews, compare procedure costs, and book teleconsultations.`,
            canonicalPath: `/doctors/${doctor.slug}`,
            robots: "index,follow",
            schemaKind: "MedicalWebPage"
          },
          payload: {
            doctor,
            slug: doctor.slug,
            headline: doctor.name,
            subheadline: `${doctor.designation} · ${doctor.hospital}`
          },
          siteSettings: DEFAULT_SITE_SETTINGS,
          statusCode: 200
        };
      }
    }

    return {
      pageKind: "doctorDirectory",
      path: normalized,
      locale: "en",
      seo: {
        title: "World-Class Doctors | Find Best Specialists Worldwide | AKEEZO",
        description:
          "Search, compare, and connect with premier surgeons and medical specialists globally. Direct hospital pricing, accredited experts, and free assistance.",
        canonicalPath: "/doctors",
        robots: "index,follow",
        schemaKind: "MedicalWebPage"
      },
      payload: {
        headline: "World-Class Doctors, Personally Matched for You",
        subheadline: "Search, compare, and connect with leading specialists across the globe."
      },
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized === "/about" || normalized === "/about-us") {
    return {
      pageKind: "about",
      path: normalized,
      locale: "en",
      seo: {
        title: "About Us | Hey! We're AKEEZO Healthcare Platform",
        description:
          "Meet the team behind AKEEZO. A dedicated group of patient advocates, healthcare researchers, and travel experts making world-class medical care reachable for anyone, anywhere.",
        canonicalPath: "/about",
        robots: "index,follow",
        schemaKind: "AboutPage"
      },
      payload: {
        headline: "Hey! We're AKEEZO",
        subheadline:
          "We're a team of patient advocates, healthcare researchers, and travel experts — obsessed with one thing: making world-class medical care reachable for anyone, anywhere."
      },
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized === "/blog" || normalized === "/blogs" || normalized === "/articles") {
    return {
      pageKind: "blogDirectory",
      path: normalized,
      locale: "en",
      seo: {
        title: "Medical Travel & Healthcare Insights Blog | AKEEZO",
        description:
          "Authoritative clinical insights, hospital selection guides, treatment cost comparisons, and patient recovery stories for medical travel in India.",
        canonicalPath: "/blogs",
        robots: "index,follow",
        schemaKind: "CollectionPage"
      },
      payload: {
        documentId: "blog",
        title: "Medical Travel & Healthcare Insights",
        category: "Clinical Editorial",
        articles: ALL_BLOG_ARTICLES
      },
      siteSettings: DEFAULT_SITE_SETTINGS,
      statusCode: 200
    };
  }

  if (normalized.startsWith("/blog/") || normalized.startsWith("/blogs/") || normalized.startsWith("/articles/")) {
    const slug = normalized.replace(/^\/(?:blog|blogs|articles)\//, "").replace(/\/$/, "").toLowerCase();
    const foundArticle = ALL_BLOG_ARTICLES.find((a) => a.slug === slug);
    const article = foundArticle || {
      slug,
      title: slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
      date: "2026-10-25",
      excerpt: "Comprehensive medical travel guide detailing treatment protocols, accredited hospital selection, and patient recovery.",
      image: "https://luxora-cms.s3.ap-south-1.amazonaws.com/cma-blogs/1793289557843-3of8glinqdt.jpg",
      category: "Clinical Editorial",
      author: { name: "Akeezo Medical Advisory Board", role: "Specialist Reviewer" }
    };

    return {
      pageKind: "legal",
      path: normalized,
      locale: "en",
      seo: {
        title: `${article.title} | AKEEZO`,
        description: article.excerpt || article.title,
        canonicalPath: `/blogs/${article.slug}`,
        robots: "index,follow",
        schemaKind: "MedicalWebPage"
      },
      payload: {
        documentId: "blog-article",
        title: article.title,
        category: article.category,
        article: {
          ...article,
          content: `## Executive Clinical Overview\n\n${article.excerpt}\n\n## Medical Guidelines & Protocols\n\nWhen evaluating cross-border treatment options, ensuring hospital accreditation (NABH, JCI) and consulting board-certified surgeons is essential. Review our cost benchmarks and connect with clinical experts for personalized care plans.`,
          medicalDisclaimerEnabled: true
        },
        relatedArticles: ALL_BLOG_ARTICLES.filter((a) => a.slug !== slug).slice(0, 3)
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
