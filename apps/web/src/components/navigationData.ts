export interface CountryOption {
  countryCode: string;
  countryName: string;
  flagUrl: string;
  currencyCode: string;
  currencySymbol: string;
  currencyName: string;
  rateToUsd: number;
  language: string;
  languageLocal: string;
}

export const COUNTRIES: CountryOption[] = [
  {
    countryCode: "IN",
    countryName: "India",
    flagUrl: "https://flagcdn.com/w40/in.png",
    currencyCode: "INR",
    currencySymbol: "₹",
    currencyName: "Indian Rupee",
    rateToUsd: 83.5,
    language: "English",
    languageLocal: "English"
  },
  {
    countryCode: "US",
    countryName: "United States",
    flagUrl: "https://flagcdn.com/w40/us.png",
    currencyCode: "USD",
    currencySymbol: "$",
    currencyName: "US Dollar",
    rateToUsd: 1,
    language: "English",
    languageLocal: "English"
  },
  {
    countryCode: "GB",
    countryName: "United Kingdom",
    flagUrl: "https://flagcdn.com/w40/gb.png",
    currencyCode: "GBP",
    currencySymbol: "£",
    currencyName: "British Pound",
    rateToUsd: 0.79,
    language: "English",
    languageLocal: "English"
  },
  {
    countryCode: "AE",
    countryName: "United Arab Emirates",
    flagUrl: "https://flagcdn.com/w40/ae.png",
    currencyCode: "AED",
    currencySymbol: "د.إ",
    currencyName: "UAE Dirham",
    rateToUsd: 3.67,
    language: "Arabic",
    languageLocal: "العربية"
  },
  {
    countryCode: "SA",
    countryName: "Saudi Arabia",
    flagUrl: "https://flagcdn.com/w40/sa.png",
    currencyCode: "SAR",
    currencySymbol: "﷼",
    currencyName: "Saudi Riyal",
    rateToUsd: 3.75,
    language: "Arabic",
    languageLocal: "العربية"
  },
  {
    countryCode: "BD",
    countryName: "Bangladesh",
    flagUrl: "https://flagcdn.com/w40/bd.png",
    currencyCode: "BDT",
    currencySymbol: "৳",
    currencyName: "Bangladeshi Taka",
    rateToUsd: 118,
    language: "Bengali",
    languageLocal: "বাংলা"
  },
  {
    countryCode: "NG",
    countryName: "Nigeria",
    flagUrl: "https://flagcdn.com/w40/ng.png",
    currencyCode: "NGN",
    currencySymbol: "₦",
    currencyName: "Nigerian Naira",
    rateToUsd: 1450,
    language: "English",
    languageLocal: "English"
  },
  {
    countryCode: "KE",
    countryName: "Kenya",
    flagUrl: "https://flagcdn.com/w40/ke.png",
    currencyCode: "KES",
    currencySymbol: "KSh",
    currencyName: "Kenyan Shilling",
    rateToUsd: 130,
    language: "Swahili",
    languageLocal: "Kiswahili"
  },
  {
    countryCode: "EU",
    countryName: "European Union",
    flagUrl: "https://flagcdn.com/w40/eu.png",
    currencyCode: "EUR",
    currencySymbol: "€",
    currencyName: "Euro",
    rateToUsd: 0.92,
    language: "English",
    languageLocal: "English"
  },
  {
    countryCode: "OM",
    countryName: "Oman",
    flagUrl: "https://flagcdn.com/w40/om.png",
    currencyCode: "OMR",
    currencySymbol: "ر.ع.",
    currencyName: "Omani Rial",
    rateToUsd: 0.385,
    language: "Arabic",
    languageLocal: "العربية"
  },
  {
    countryCode: "AU",
    countryName: "Australia",
    flagUrl: "https://flagcdn.com/w40/au.png",
    currencyCode: "AUD",
    currencySymbol: "A$",
    currencyName: "Australian Dollar",
    rateToUsd: 1.52,
    language: "English",
    languageLocal: "English"
  },
  {
    countryCode: "CA",
    countryName: "Canada",
    flagUrl: "https://flagcdn.com/w40/ca.png",
    currencyCode: "CAD",
    currencySymbol: "C$",
    currencyName: "Canadian Dollar",
    rateToUsd: 1.38,
    language: "English",
    languageLocal: "English"
  }
];

export const LANGUAGES = [
  { code: "en", name: "English", local: "English" },
  { code: "ar", name: "Arabic", local: "العربية" },
  { code: "bn", name: "Bengali", local: "বাংলা" },
  { code: "fr", name: "French", local: "Français" },
  { code: "ru", name: "Russian", local: "Русский" },
  { code: "sw", name: "Swahili", local: "Kiswahili" },
  { code: "hi", name: "Hindi", local: "हिन्दी" }
];

export function formatEstimate(minUsd: number, maxUsd: number, country: CountryOption): string {
  if (country.currencyCode === "USD") {
    return `$${minUsd.toLocaleString()} – $${maxUsd.toLocaleString()} USD`;
  }
  if (country.currencyCode === "INR") {
    const minInr = 350000;
    const maxInr = 650000;
    return `₹${minInr.toLocaleString()} – ₹${maxInr.toLocaleString()} INR`;
  }
  const minConverted = Math.round((minUsd * country.rateToUsd) / 50) * 50;
  const maxConverted = Math.round((maxUsd * country.rateToUsd) / 50) * 50;
  return `${country.currencySymbol} ${minConverted.toLocaleString()} – ${country.currencySymbol} ${maxConverted.toLocaleString()} ${country.currencyCode}`;
}

export interface SpecialtyDef {
  id: string;
  name: string;
  count: string;
  description: string;
  icon: string;
  procedures: string[];
}

export const SPECIALTIES: SpecialtyDef[] = [
  {
    id: "cardiac",
    name: "Cardiac Surgery",
    count: "450+ Surgeries / Mo",
    description: "Minimally invasive bypass, valve repair, and pediatric cardiology",
    icon: "❤️",
    procedures: ["CABG (Heart Bypass)", "Heart Valve Replacement", "Angioplasty & Stenting", "TAVI / TAVR"]
  },
  {
    id: "oncology",
    name: "Oncology & Cancer Care",
    count: "CAR-T & Proton Beam",
    description: "Advanced precision radiation, surgical oncology, and immunotherapy",
    icon: "🎗️",
    procedures: ["Proton Beam Therapy", "CyberKnife Radiosurgery", "Bone Marrow Transplant", "CAR-T Cell Therapy"]
  },
  {
    id: "ortho",
    name: "Orthopedics & Joint",
    count: "Robotic Knee & Hip",
    description: "Computer-navigated joint reconstructions and spine stabilization",
    icon: "🦴",
    procedures: ["Robotic Knee Replacement", "Total Hip Arthroplasty", "Spine Decompression", "Arthroscopic Surgery"]
  },
  {
    id: "neuro",
    name: "Neuro & Spine Surgery",
    count: "CyberKnife & DBS",
    description: "Comprehensive care for brain tumors, Parkinson's DBS, and spinal deformities",
    icon: "🧠",
    procedures: ["Deep Brain Stimulation (DBS)", "Craniotomy for Brain Tumor", "Microdiscectomy", "Scoliosis Correction"]
  },
  {
    id: "transplant",
    name: "Organ Transplants",
    count: "95%+ Survival Rate",
    description: "Living-donor liver, kidney, heart, and bone marrow transplants",
    icon: "🩺",
    procedures: ["Living Donor Liver Transplant", "Kidney Transplant", "Corneal Transplant", "Pancreas Transplant"]
  },
  {
    id: "ivf",
    name: "IVF & Fertility",
    count: "High Success Rates",
    description: "Next-gen IVF, ICSI, egg freezing, and donor programs under clinical oversight",
    icon: "👶",
    procedures: ["IVF with ICSI", "Pre-implantation Genetic Testing (PGT)", "Blastocyst Culture", "Donor Oocyte Program"]
  }
];

export const DIRECTORY_TABS = {
  treatments: [
    { name: "Robotic Knee Replacement", href: "/#opinion", category: "Orthopedics" },
    { name: "Heart Bypass Surgery (CABG)", href: "/#opinion", category: "Cardiac" },
    { name: "Living Donor Liver Transplant", href: "/#opinion", category: "Transplants" },
    { name: "CyberKnife Radiosurgery", href: "/#opinion", category: "Oncology" },
    { name: "Deep Brain Stimulation (DBS)", href: "/#opinion", category: "Neurology" },
    { name: "Bone Marrow Transplant (BMT)", href: "/#opinion", category: "Hematology" },
    { name: "Total Hip Replacement", href: "/#opinion", category: "Orthopedics" },
    { name: "Dental Implants & All-on-4", href: "/#opinion", category: "Dental Care" }
  ],
  hospitals: [
    { name: "Apollo Hospitals, New Delhi (JCI)", href: "/#hospitals", location: "New Delhi" },
    { name: "Medanta - The Medicity (JCI/NABH)", href: "/#hospitals", location: "Gurugram" },
    { name: "Fortis Memorial Research Institute", href: "/#hospitals", location: "Gurugram" },
    { name: "Max Super Speciality Hospital", href: "/#hospitals", location: "Saket, Delhi" },
    { name: "Manipal Hospital", href: "/#hospitals", location: "Bengaluru" },
    { name: "Narayana Institute of Cardiac Sciences", href: "/#hospitals", location: "Bengaluru" },
    { name: "Kokilaben Dhirubhai Ambani Hospital", href: "/#hospitals", location: "Mumbai" },
    { name: "Artemis Hospital (JCI)", href: "/#hospitals", location: "Gurugram" }
  ],
  doctors: [
    { name: "Dr. Ashok Rajgopal", role: "Orthopedic & Joint Surgeon", experience: "40+ Years Exp" },
    { name: "Dr. Naresh Trehan", role: "Chairman & Chief Cardiovascular Surgeon", experience: "45+ Years Exp" },
    { name: "Dr. Arvinder Singh Soin", role: "Chairman of Liver Transplantation", experience: "32+ Years Exp" },
    { name: "Dr. Sandeep Vaishya", role: "Executive Director - Neurosurgery", experience: "28+ Years Exp" },
    { name: "Dr. Vinod Raina", role: "Director - Medical Oncology", experience: "35+ Years Exp" },
    { name: "Dr. B.S. Murthy", role: "Senior Director - Robotic Joint Replacement", experience: "30+ Years Exp" },
    { name: "Dr. Subhash Gupta", role: "Chief of Liver Transplant Surgery", experience: "31+ Years Exp" },
    { name: "Dr. Z.S. Meharwal", role: "Executive Director - Adult Cardiac Surgery", experience: "33+ Years Exp" }
  ],
  destinations: [
    { name: "New Delhi & National Capital Region", count: "45+ Accredited Hospitals", flag: "🏛️" },
    { name: "Gurugram (Medical Technology Hub)", count: "18+ Multi-Specialty Quaternary Hubs", flag: "🏙️" },
    { name: "Bengaluru (Cardiac & Robotics Capital)", count: "25+ Premier Medical Institutes", flag: "🌿" },
    { name: "Mumbai (Advanced Oncology & Pediatrics)", count: "22+ Tertiary Care Hospitals", flag: "🌊" },
    { name: "Chennai (International Healthcare Gateway)", count: "30+ Quaternary Centers", flag: "🌴" },
    { name: "Hyderabad (HITEC City Healthcare)", count: "20+ JCI Quaternary Institutes", flag: "🏰" },
    { name: "Kolkata (Eastern India Medical Gateway)", count: "15+ JCI/NABH Hospitals", flag: "⚓" },
    { name: "Kochi (Kerala Health & Ayush Hub)", count: "14+ Accredited Wellness Centers", flag: "⛵" }
  ]
};
