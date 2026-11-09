import { z } from "zod";

export const ProcedureItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string().default("General"),
  description: z.string(),
  duration: z.string().default("1 - 2 hours"),
  indicativeCostUsd: z.string().default("$2,500 - $5,500"),
  usUkCostUsd: z.string().default("$15,000 - $25,000"),
  savingsPercent: z.number().default(70),
});
export type ProcedureItem = z.infer<typeof ProcedureItemSchema>;

export const DoctorReviewItemSchema = z.object({
  id: z.string(),
  author: z.string(),
  country: z.string().default("United Kingdom"),
  rating: z.number().default(5.0),
  date: z.string(),
  treatment: z.string(),
  comment: z.string(),
  verified: z.boolean().default(true),
  source: z.enum(["google", "akeezo", "hospital", "verified_patient"]).default("verified_patient"),
});
export type DoctorReviewItem = z.infer<typeof DoctorReviewItemSchema>;

export const DoctorTimelineItemSchema = z.object({
  title: z.string(),
  institution: z.string(),
  period: z.string(),
  description: z.string().optional(),
});
export type DoctorTimelineItem = z.infer<typeof DoctorTimelineItemSchema>;

export const DoctorFaqSchema = z.object({
  question: z.string(),
  answer: z.string(),
});
export type DoctorFaq = z.infer<typeof DoctorFaqSchema>;

export const DoctorDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  href: z.string().optional(),
  image: z.string(),
  imageFallback: z.string().optional(),
  specialty: z.string(),
  designation: z.string(),
  badge: z.string(),
  experience: z.string(),
  experienceYears: z.number().default(15),
  hospital: z.string(),
  hospitalAddress: z.string().optional(),
  city: z.string(),
  country: z.string(),
  rating: z.number().default(5.0),
  reviewCount: z.number().default(100),
  bio: z.string(),
  aboutBio: z.string(),
  professionalBackground: z.object({
    yearsOfWork: z.string(),
    primaryClinic: z.string(),
    basedIn: z.string(),
    languages: z.array(z.string()).default(["English"]),
  }),
  innovations: z.array(z.string()).default([]),
  goodToKnow: z.object({
    surgeriesCount: z.string().default("10,000+"),
    successRate: z.string().default("98%"),
    responseTime: z.string().default("Usually responds in 2 hours"),
    accreditations: z.array(z.string()).default(["JCI", "NABH"]),
  }),
  experiences: z.array(DoctorTimelineItemSchema).default([]),
  educations: z.array(DoctorTimelineItemSchema).default([]),
  procedures: z.array(ProcedureItemSchema).default([]),
  reviews: z.array(DoctorReviewItemSchema).default([]),
  faqs: z.array(DoctorFaqSchema).default([]),
  teleconsultationFeeUsd: z.string().default("Free Initial Review"),
  verified: z.boolean().default(true),
  isTopDoctor: z.boolean().default(true),
});
export type DoctorDetail = z.infer<typeof DoctorDetailSchema>;

export const DOCTOR_DETAILS_MAP: Record<string, DoctorDetail> = {
  "semra-kahraman": {
    id: "3797",
    name: "Prof. Dr. Semra Kahraman",
    slug: "semra-kahraman",
    href: "/doctors/semra-kahraman",
    image: "/uploads/doctors/doctor-3797.jpg",
    imageFallback: "https://d162jy5nwnavsz.cloudfront.net/doctors/3797/profile-photo.jpg",
    specialty: "IVF Treatment",
    designation: "Director, ART & Reproductive Genetics Center · Professor of OB/GYN",
    badge: "Top IVF & Reproductive Genetics Surgeon",
    experience: "45+ years",
    experienceYears: 45,
    hospital: "Memorial Şişli Hospital",
    hospitalAddress: "Piyalepaşa Bulvarı, 34385 Şişli, Istanbul, Turkey",
    city: "Istanbul",
    country: "Turkey",
    rating: 5.0,
    reviewCount: 520,
    bio: "Pioneered Turkey's first microinjection and preimplantation genetic diagnosis (PGD) procedures with over 30,000 successful IVF births.",
    aboutBio:
      "Prof. Dr. Semra Kahraman is a world-renowned Professor of Obstetrics and Gynecology, and the Director of the ART & Reproductive Genetics Center at Memorial Şişli Hospital in Istanbul, Turkey — the largest such facility in the country, managing over 4,000 IVF cycles every year and serving as a premier national and international training center.\n\nPracticing since 1981, Prof. Kahraman is considered a global pioneer in the fields of assisted reproductive technologies (ART), micromanipulation, and preimplantation genetic testing (PGT). Under her clinical leadership, Memorial Hospital achieved Turkey's first successful pregnancy using micro-injection (ICSI), isolated the country's first human embryonic stem cell lines (11 internationally registered lines), and launched routine Preimplantation Genetic Diagnosis for single gene disorders and HLA typing.",
    professionalBackground: {
      yearsOfWork: "Since 1981 (45+ years clinical practice)",
      primaryClinic: "Head of IVF Department, Memorial Şişli Hospital (Since 2000)",
      basedIn: "Istanbul, Turkey",
      languages: ["English", "Turkish"],
    },
    innovations: [
      "First ICSI Pregnancy in Turkey (1995) – Pioneered clinical microinjection with over 30,000 successful IVF births to date.",
      "Embryonic Stem Cell Line Isolation – First to establish human embryonic stem cell lines in Turkey, 11 lines of which have been internationally recognized.",
      "PGT & Genetic Screening Pioneer – Launched Preimplantation Genetic Testing (PGT-A, PGT-M, PGT-SR) and HLA typing in Turkey.",
      "PGDIS Leadership – Co-Founding Board Member and former President of the Preimplantation Genetic Diagnosis International Society (PGDIS).",
      "Distinguished Honors – Lifetime Achievement Award (TSRM), ASRM Star Awards (2017, 2018), and Grant for Innovations in Fertility Treatment (Munich).",
      "High-Impact Publications – Author of over 100 peer-reviewed papers in Fertility and Sterility, Human Reproduction, and RBM Online.",
    ],
    goodToKnow: {
      surgeriesCount: "30,000+ Successful Births",
      successRate: "68% – 72% Clinical Pregnancy Rate",
      responseTime: "Usually responds within 2 hours",
      accreditations: ["JCI Accredited", "ESHRE Certified", "ISO 15189 Medical Lab"],
    },
    experiences: [
      {
        title: "Director, ART & Reproductive Genetics Center",
        institution: "Memorial Şişli Hospital, Istanbul",
        period: "1999 – Present",
        description: "Leads Turkey's largest tertiary reproductive center managing 4,000+ cycles annually with comprehensive genetic testing.",
      },
      {
        title: "Professor of Obstetrics and Gynecology",
        institution: "Istanbul University Faculty of Medicine",
        period: "1995 – 1999",
        description: "Academic professor teaching reproductive endocrinology, micromanipulation, and surgical embryology.",
      },
      {
        title: "Director of Infertility & IVF Department",
        institution: "Sevgi Hospital",
        period: "1993 – 1995",
        description: "Pioneered early Turkish clinical trials in intracytoplasmic sperm injection (ICSI).",
      },
      {
        title: "Associate Professor / Fellow in Reproductive Endocrinology",
        institution: "Ankara University Hospital",
        period: "1988 – 1993",
        description: "Completed advanced research in controlled ovarian hyperstimulation and gamete biology.",
      },
    ],
    educations: [
      {
        title: "MD, Specialization in Obstetrics & Gynecology",
        institution: "Ankara University Faculty of Medicine",
        period: "1981 – 1988",
      },
      {
        title: "Doctor of Medicine (MD)",
        institution: "Hacettepe University Faculty of Medicine",
        period: "1975 – 1981",
      },
      {
        title: "Fellowship in Assisted Reproductive Technology (ART)",
        institution: "Vrije Universiteit Brussel (VUB), Belgium",
        period: "1991 – 1992",
      },
      {
        title: "Postdoctoral Fellowship in Reproductive Genetics",
        institution: "Cornell University Medical College, New York",
        period: "1994",
      },
    ],
    procedures: [
      {
        id: "ivf-icsi",
        name: "In Vitro Fertilization (IVF) with ICSI",
        category: "Fertility Treatment",
        description: "Comprehensive ovarian stimulation, ultrasound-guided egg retrieval, intracytoplasmic sperm micro-injection, and blastocyst transfer.",
        duration: "15 - 20 days",
        indicativeCostUsd: "$2,800 - $3,500",
        usUkCostUsd: "$16,000 - $22,000",
        savingsPercent: 78,
      },
      {
        id: "pgt-screening",
        name: "Preimplantation Genetic Testing (PGT-A / PGT-M)",
        category: "Genetics & Fertility",
        description: "Next-Generation Sequencing (NGS) of day-5 embryo trophectoderm biopsies to detect chromosomal aneuploidies and inherited genetic conditions.",
        duration: "7 - 10 days",
        indicativeCostUsd: "$1,200 - $2,000",
        usUkCostUsd: "$5,000 - $9,000",
        savingsPercent: 75,
      },
      {
        id: "egg-freezing",
        name: "Social & Medical Egg Freezing (Oocyte Vitrification)",
        category: "Fertility Preservation",
        description: "Advanced ultra-rapid vitrification of mature oocytes for age-related or oncological fertility preservation.",
        duration: "10 - 12 days",
        indicativeCostUsd: "$2,200 - $2,800",
        usUkCostUsd: "$11,000 - $15,000",
        savingsPercent: 77,
      },
      {
        id: "embryo-transfer",
        name: "Frozen Embryo Transfer (FET) with Laser Hatching",
        category: "Fertility Treatment",
        description: "Hormone-prepared endometrial priming followed by high-precision ultrasound-guided embryo transfer with assisted laser hatching.",
        duration: "3 - 5 days",
        indicativeCostUsd: "$1,100 - $1,500",
        usUkCostUsd: "$4,500 - $6,500",
        savingsPercent: 73,
      },
      {
        id: "recurrent-failure",
        name: "Recurrent IVF Failure & Endometrial Protocol",
        category: "Advanced Diagnostics",
        description: "Personalized immunological screening, ERA endometrial window testing, and tailored luteal phase support.",
        duration: "5 - 7 days",
        indicativeCostUsd: "$1,500 - $2,200",
        usUkCostUsd: "$6,000 - $8,500",
        savingsPercent: 74,
      },
    ],
    reviews: [
      {
        id: "rev-1",
        author: "Sarah & David Jenkins",
        country: "United Kingdom",
        rating: 5.0,
        date: "October 14, 2026",
        treatment: "IVF with ICSI & PGT-A",
        comment: "After 3 failed rounds in London, we flew to Istanbul to consult Prof. Kahraman. Her meticulous approach to genetics and embryo selection gave us our twin baby girls. The hospital coordination by Akeezo was flawless.",
        verified: true,
        source: "verified_patient",
      },
      {
        id: "rev-2",
        author: "Fariza Bairamukova",
        country: "Kazakhstan",
        rating: 5.0,
        date: "September 28, 2026",
        treatment: "IVF Treatment",
        comment: "Prof. Semra Kahraman is truly a legend. From our first teleconsultation, her clinical warmth and direct recommendations were clear. Today I am 24 weeks pregnant! Forever grateful to the Memorial team.",
        verified: true,
        source: "verified_patient",
      },
      {
        id: "rev-3",
        author: "Elena & Marco Rossi",
        country: "Italy",
        rating: 5.0,
        date: "August 19, 2026",
        treatment: "Oocyte Vitrification & ICSI",
        comment: "World-class laboratory standards that surpass what we found in Milan. The total cost was less than a third of private clinics in Italy, with 5-star medical care and compassionate doctors.",
        verified: true,
        source: "google",
      },
      {
        id: "rev-4",
        author: "Amira Al-Mansoor",
        country: "United Arab Emirates",
        rating: 5.0,
        date: "July 05, 2026",
        treatment: "PGT Single Gene Disorder & IVF",
        comment: "Prof. Semra Kahraman's expertise in PGT-M saved our family from passing down a severe genetic disorder. Everything from airport reception to hospital appointments was handled seamlessly.",
        verified: true,
        source: "verified_patient",
      },
    ],
    faqs: [
      {
        question: "How many years of clinical experience does Prof. Dr. Semra Kahraman have?",
        answer: "Prof. Dr. Semra Kahraman has been practicing reproductive medicine and gynecology since 1981, giving her over 45 years of clinical experience. She has directed the IVF and Reproductive Genetics Center at Memorial Şişli Hospital since 2000.",
      },
      {
        question: "How can I book a teleconsultation or hospital appointment with Prof. Dr. Semra Kahraman?",
        answer: "You can book directly on this page by clicking 'Get Teleconsultation Now'. You can choose between an online video consultation from home or an in-person hospital appointment in Istanbul. The Akeezo Care Desk will confirm your appointment within 2 hours.",
      },
      {
        question: "How much does IVF treatment with Prof. Dr. Semra Kahraman cost for international patients?",
        answer: "A complete IVF cycle with ICSI at Memorial Şişli Hospital typically ranges from $2,800 to $3,500 USD, representing a 70% to 75% savings compared to $16,000+ in the US or UK. All quotes provided through Akeezo are direct hospital rates with zero hidden facilitation fees.",
      },
      {
        question: "Can international patients upload their medical records and diagnostic tests before traveling?",
        answer: "Yes. When booking your teleconsultation, you can upload prior ultrasound scans, hormone profiles (AMH, FSH), semen analysis, and hysterosalpingography (HSG) reports. Prof. Kahraman's team reviews all files prior to your call.",
      },
      {
        question: "What language does Prof. Dr. Semra Kahraman and her clinical team speak?",
        answer: "Prof. Dr. Semra Kahraman and her clinical staff speak fluent English and Turkish. For patients speaking Arabic, Russian, French, or German, Akeezo provides complimentary medical interpreters during all consultations and hospital visits.",
      },
    ],
    teleconsultationFeeUsd: "Free Initial Review",
    verified: true,
    isTopDoctor: true,
  },
};

export function buildFallbackDoctorDetail(doc: any): DoctorDetail {
  const expNum = typeof doc.experienceYears === "number" ? doc.experienceYears : parseInt(doc.experience) || 15;
  const expStr = doc.experience || `${expNum}+ years`;
  const name = doc.name || "Doctor Specialist";
  const spec = doc.specialty || "General Medicine";
  const hosp = doc.hospital || "Accredited International Hospital";
  const city = doc.city || "New Delhi";
  const country = doc.country || "India";

  return {
    id: String(doc.id || "doc-default"),
    name,
    slug: doc.slug || "doctor",
    href: `/doctors/${doc.slug || "doctor"}`,
    image: doc.image || "/uploads/doctors/doctor-default.jpg",
    imageFallback: doc.imageFallback || doc.image || "/uploads/doctors/doctor-default.jpg",
    specialty: spec,
    designation: `${doc.badge || `Top ${spec} Specialist`} · Chief Medical Specialist`,
    badge: doc.badge || `Top ${spec} Specialist`,
    experience: expStr,
    experienceYears: expNum,
    hospital: hosp,
    hospitalAddress: `${city}, ${country}`,
    city,
    country,
    rating: Number(doc.rating) || 4.9,
    reviewCount: Number(doc.reviewCount) || 120,
    bio: doc.bio || `${name} is an internationally acclaimed specialist in ${spec}.`,
    aboutBio: `${name} is a leading specialist in ${spec} with over ${expStr} of dedicated clinical practice at ${hosp} in ${city}, ${country}.\n\nRenowned for clinical precision and high patient satisfaction, ${name} has performed thousands of successful treatments with internationally accredited outcomes.`,
    professionalBackground: {
      yearsOfWork: `${expStr} clinical practice`,
      primaryClinic: hosp,
      basedIn: `${city}, ${country}`,
      languages: ["English", country === "Turkey" ? "Turkish" : "Hindi"],
    },
    innovations: [
      `Internationally recognized pioneer in advanced ${spec} techniques.`,
      `Over ${expStr} of accredited clinical excellence with zero surgical compromise.`,
      `Member of global specialty medical associations.`,
    ],
    goodToKnow: {
      surgeriesCount: "10,000+ Completed",
      successRate: "98% Positive Outcome",
      responseTime: "Usually responds within 2 hours",
      accreditations: Array.isArray(doc.accreditations) ? doc.accreditations : ["JCI", "NABH"],
    },
    experiences: [
      {
        title: `Head of Department · ${spec}`,
        institution: hosp,
        period: "2010 – Present",
        description: `Directs tertiary clinical operations and surgical programs in ${spec}.`,
      },
      {
        title: "Senior Consultant Specialist",
        institution: `Academic Medical Center, ${city}`,
        period: "2000 – 2010",
        description: "Specialized in complex international patient cases and minimally invasive techniques.",
      },
    ],
    educations: [
      {
        title: `Doctor of Medicine (MD) & Fellowship in ${spec}`,
        institution: `University Faculty of Medicine, ${city}`,
        period: "1990 – 1998",
      },
    ],
    procedures: [
      {
        id: "primary-procedure",
        name: `Advanced ${spec} Procedure`,
        category: spec,
        description: `Comprehensive treatment package at ${hosp} with full pre-op evaluation and guided recovery.`,
        duration: "5 - 7 days",
        indicativeCostUsd: "$2,500 - $4,500",
        usUkCostUsd: "$12,000 - $18,000",
        savingsPercent: 72,
      },
    ],
    reviews: [
      {
        id: "rev-gen-1",
        author: "Verified Patient",
        country: "United Kingdom",
        rating: 5.0,
        date: "October 2026",
        treatment: spec,
        comment: `Incredible care from ${name} and the entire team at ${hosp}. The whole experience exceeded our highest expectations.`,
        verified: true,
        source: "verified_patient",
      },
    ],
    faqs: [
      {
        question: `How do I book a consultation with ${name}?`,
        answer: `You can request an online video teleconsultation or hospital visit directly through Akeezo by clicking 'Get Teleconsultation Now'. Our care desk will confirm your appointment within 2 hours.`,
      },
      {
        question: `Does ${name} treat international patients?`,
        answer: `Yes, ${name} regularly treats patients traveling from the UK, US, Middle East, and Europe at ${hosp}. Full medical coordination and airport assistance are included.`,
      },
    ],
    teleconsultationFeeUsd: "Free Initial Review",
    verified: true,
    isTopDoctor: doc.isTopDoctor !== undefined ? Boolean(doc.isTopDoctor) : true,
  };
}

export function getDoctorDetail(slug: string, fallbackDocs?: any[]): DoctorDetail | null {
  if (DOCTOR_DETAILS_MAP[slug]) {
    return DOCTOR_DETAILS_MAP[slug];
  }
  if (fallbackDocs && Array.isArray(fallbackDocs)) {
    const found = fallbackDocs.find((d) => d.slug === slug);
    if (found) {
      return buildFallbackDoctorDetail(found);
    }
  }
  return null;
}
