import { z } from "zod";
import { SeoMetadataSchema } from "./content.js";

// ==========================================
// 1. CALCULATOR / PLAN MY JOURNEY SCHEMA
// ==========================================
export const CalculatorProcedureSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.string().default("General"),
  avgCostAbroad: z.string().default("$2,500"),
  avgCostHome: z.string().default("$15,000"),
  recoveryDays: z.string().default("7 - 14 days"),
  savingsPercentage: z.number().default(75),
  popular: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type CalculatorProcedure = z.infer<typeof CalculatorProcedureSchema>;

export const DestinationCostMultiplierSchema = z.object({
  country: z.string(),
  multiplier: z.number().default(1.0),
  hotelPerNightUsd: z.number().default(45),
  visaFeeUsd: z.number().default(60),
});

export type DestinationCostMultiplier = z.infer<typeof DestinationCostMultiplierSchema>;

export const CalculatorPagePayloadSchema = z.object({
  headline: z.string().default("Surgery Cost Calculator Tool"),
  subheadline: z.string().default("Compare surgery costs across top medical destinations and accredited international hospitals."),
  badgeText: z.string().default("100% Free · No Commissions"),
  disclaimerText: z.string().default("All cost figures are indicative benchmarks verified across accredited partner hospitals."),
  procedures: z.array(CalculatorProcedureSchema).default([]),
  destinations: z.array(DestinationCostMultiplierSchema).default([]),
});

export type CalculatorPagePayload = z.infer<typeof CalculatorPagePayloadSchema>;

// ==========================================
// 2. DOCTORS & SPECIALISTS SCHEMA
// ==========================================
export const DoctorCatalogueItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  specialty: z.string().min(1),
  hospital: z.string().min(1),
  city: z.string().default("New Delhi"),
  country: z.string().default("India"),
  experienceYears: z.number().default(15),
  rating: z.number().default(4.9),
  reviewCount: z.number().default(120),
  consultationFeeUsd: z.string().default("$50 - $100"),
  procedures: z.array(z.string()).default([]),
  image: z.string().default("/uploads/doctors/doctor-default.jpg"),
  verified: z.boolean().default(true),
  active: z.boolean().default(true),
});

export type DoctorCatalogueItem = z.infer<typeof DoctorCatalogueItemSchema>;

export const DoctorsPagePayloadSchema = z.object({
  headline: z.string().default("World-Class Doctors, Personally Matched for You"),
  subheadline: z.string().default("Search, compare, and connect with premier surgeons and medical specialists globally."),
  searchPlaceholder: z.string().default("Search doctors by name, specialty, or hospital..."),
  featuredSpecialties: z.array(z.string()).default([]),
  doctors: z.array(DoctorCatalogueItemSchema).default([]),
});

export type DoctorsPagePayload = z.infer<typeof DoctorsPagePayloadSchema>;

// ==========================================
// 3. HOSPITALS SCHEMA
// ==========================================
export const HospitalCatalogueItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().min(1),
  city: z.string().default("New Delhi"),
  country: z.string().default("India"),
  accreditations: z.array(z.string()).default(["JCI", "NABH"]),
  bedsCount: z.number().default(500),
  rating: z.number().default(4.8),
  reviewCount: z.number().default(350),
  specialties: z.array(z.string()).default([]),
  image: z.string().default("/uploads/hospitals/hospital-default.jpg"),
  description: z.string().default("Premier multi-super-specialty healthcare facility."),
  verified: z.boolean().default(true),
  active: z.boolean().default(true),
});

export type HospitalCatalogueItem = z.infer<typeof HospitalCatalogueItemSchema>;

export const HospitalsPagePayloadSchema = z.object({
  headline: z.string().default("World-Class Hospitals, Personally Matched for You"),
  subheadline: z.string().default("Find the Best Hospitals for Your Treatment, Anywhere in the World"),
  searchPlaceholder: z.string().default("Search hospitals by name, city, or specialty..."),
  filterAccreditations: z.array(z.string()).default(["JCI", "NABH", "ISO", "NABL"]),
  hospitals: z.array(HospitalCatalogueItemSchema).default([]),
});

export type HospitalsPagePayload = z.infer<typeof HospitalsPagePayloadSchema>;

// ==========================================
// 4. TREATMENTS SCHEMA
// ==========================================
export const TreatmentCatalogueItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().default("Surgical"),
  description: z.string().default("Comprehensive clinical treatment with accredited international surgeons."),
  href: z.string().default("/treatments"),
  image: z.string().default("/uploads/treatments/default.webp"),
  fallbackImage: z.string().default("https://d162jy5nwnavsz.cloudfront.net/static/pages/treatments/treatments-banner.webp"),
  procedures: z.array(z.string()).default([]),
  avgCostAbroad: z.string().default("$2,500 - $6,500"),
  avgCostHome: z.string().default("$12,000 - $25,000"),
  recoveryTime: z.string().default("7 - 14 days"),
  isTopTreatment: z.boolean().default(false),
  active: z.boolean().default(true),
});

export type TreatmentCatalogueItem = z.infer<typeof TreatmentCatalogueItemSchema>;

export const TreatmentsPagePayloadSchema = z.object({
  headline: z.string().default("Find The Best Treatments Worldwide"),
  subheadline: z.string().default("World-class care, anywhere in the world."),
  topTreatmentsTitle: z.string().default("Top Treatments on AKEEZO"),
  allTreatmentsTitle: z.string().default("All Treatments"),
  freeConsultationTitle: z.string().default("AKEEZO Care Is Absolutely Free"),
  freeConsultationSubtitle: z.string().default("Just discovery so you can choose what's right for you!"),
  confidentHealthcareTitle: z.string().default("Make Confident Healthcare Decisions"),
  confidentHealthcareSubtitle: z.string().default("Trusted information backed by real patient experiences."),
  treatments: z.array(TreatmentCatalogueItemSchema).default([]),
});

export type TreatmentsPagePayload = z.infer<typeof TreatmentsPagePayloadSchema>;

// ==========================================
// 5. DESTINATIONS SCHEMA
// ==========================================
export const DestinationCatalogueItemSchema = z.object({
  id: z.string(),
  country: z.string().min(1),
  slug: z.string().min(1),
  cityHighlights: z.string().default("Major healthcare hubs"),
  popularProcedures: z.array(z.string()).default([]),
  savingsPercentage: z.number().default(70),
  hospitalCount: z.number().default(25),
  visaProcessingDays: z.string().default("3 - 5 days"),
  flightConnectivity: z.string().default("Direct international flights"),
  image: z.string().default("/uploads/destinations/default.jpg"),
  tagline: z.string().default("World-class care at a fraction of the cost"),
  featured: z.boolean().default(true),
  active: z.boolean().default(true),
});

export type DestinationCatalogueItem = z.infer<typeof DestinationCatalogueItemSchema>;

export const DestinationsPagePayloadSchema = z.object({
  sectionTitle: z.string().default("Explore Premier Medical Travel Destinations"),
  sectionSubtitle: z.string().default("Top accredited global hubs offering cutting-edge clinical infrastructure and massive cost savings."),
  destinations: z.array(DestinationCatalogueItemSchema).default([]),
});

export type DestinationsPagePayload = z.infer<typeof DestinationsPagePayloadSchema>;

// ==========================================
// 6. COMMUNITY & PATIENT OPINIONS SCHEMA
// ==========================================
export const CommunityStoryItemSchema = z.object({
  id: z.string(),
  patientName: z.string().min(1),
  originCountry: z.string().default("United States"),
  destinationCountry: z.string().default("India"),
  hospitalName: z.string().default("Apollo Hospitals"),
  procedureName: z.string().default("Knee Replacement"),
  rating: z.number().min(1).max(5).default(5),
  reviewText: z.string().min(5),
  avatarUrl: z.string().default("/uploads/about/testi-review.webp"),
  verifiedPatient: z.boolean().default(true),
  reviewDate: z.string().default("2026-10-15"),
  active: z.boolean().default(true),
});

export type CommunityStoryItem = z.infer<typeof CommunityStoryItemSchema>;

export const CommunityPagePayloadSchema = z.object({
  sectionTitle: z.string().default("Real Stories, Real Recoveries"),
  sectionSubtitle: z.string().default("Verified patient experiences and honest reviews from across the globe."),
  testimonials: z.array(CommunityStoryItemSchema).default([]),
});

export type CommunityPagePayload = z.infer<typeof CommunityPagePayloadSchema>;

// ==========================================
// 7. ABOUT US SCHEMA
// ==========================================
export const AboutTeamMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  role: z.string().min(1),
  credentials: z.string().default("MD, FACP"),
  bio: z.string().default("Clinical coordinator and patient advocate with over a decade of international care management."),
  image: z.string().default("/uploads/about/team-0.webp"),
  active: z.boolean().default(true),
});

export type AboutTeamMember = z.infer<typeof AboutTeamMemberSchema>;

export const AboutPagePayloadSchema = z.object({
  headline: z.string().default("Hey! We're AKEEZO"),
  subheadline: z.string().default("We're a team of patient advocates, healthcare researchers, and travel experts — obsessed with one thing: making world-class medical care reachable for anyone, anywhere."),
  mission: z.string().default("Eliminate global health disparities by connecting patients directly with accredited world-class medical centers."),
  vision: z.string().default("A world where borders do not restrict access to lifesaving, compassionate medical care."),
  stats: z.object({
    patientsCoordinated: z.string().default("12,000+"),
    partnerHospitals: z.string().default("100+"),
    satisfactionRate: z.string().default("98.4%"),
    countriesServed: z.string().default("45+"),
  }).default({
    patientsCoordinated: "12,000+",
    partnerHospitals: "100+",
    satisfactionRate: "98.4%",
    countriesServed: "45+",
  }),
  teamMembers: z.array(AboutTeamMemberSchema).default([]),
});

export type AboutPagePayload = z.infer<typeof AboutPagePayloadSchema>;

// ==========================================
// 8. UNIFIED PAGE PAYLOAD & ITEM ACTIONS DTO
// ==========================================
export const UpdatePagePayloadDTO = z.object({
  title: z.string().optional(),
  payload: z.record(z.unknown()),
  seo: SeoMetadataSchema.optional(),
  publishImmediately: z.boolean().default(true),
});

export type UpdatePagePayloadDTO = z.infer<typeof UpdatePagePayloadDTO>;

export const ManageItemActionDTO = z.object({
  itemType: z.enum(["doctor", "hospital", "treatment", "destination", "community", "teamMember", "calculatorProcedure"]),
  action: z.enum(["create", "update", "delete", "toggleActive"]),
  item: z.record(z.unknown()),
  itemId: z.string().optional(),
});

export type ManageItemActionDTO = z.infer<typeof ManageItemActionDTO>;
