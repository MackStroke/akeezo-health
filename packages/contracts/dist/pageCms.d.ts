import { z } from "zod";
export declare const CalculatorProcedureSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    avgCostAbroad: z.ZodDefault<z.ZodString>;
    avgCostHome: z.ZodDefault<z.ZodString>;
    recoveryDays: z.ZodDefault<z.ZodString>;
    savingsPercentage: z.ZodDefault<z.ZodNumber>;
    popular: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: string;
    name: string;
    active: boolean;
    avgCostAbroad: string;
    avgCostHome: string;
    recoveryDays: string;
    savingsPercentage: number;
    popular: boolean;
}, {
    id: string;
    name: string;
    category?: string | undefined;
    active?: boolean | undefined;
    avgCostAbroad?: string | undefined;
    avgCostHome?: string | undefined;
    recoveryDays?: string | undefined;
    savingsPercentage?: number | undefined;
    popular?: boolean | undefined;
}>;
export type CalculatorProcedure = z.infer<typeof CalculatorProcedureSchema>;
export declare const DestinationCostMultiplierSchema: z.ZodObject<{
    country: z.ZodString;
    multiplier: z.ZodDefault<z.ZodNumber>;
    hotelPerNightUsd: z.ZodDefault<z.ZodNumber>;
    visaFeeUsd: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    country: string;
    multiplier: number;
    hotelPerNightUsd: number;
    visaFeeUsd: number;
}, {
    country: string;
    multiplier?: number | undefined;
    hotelPerNightUsd?: number | undefined;
    visaFeeUsd?: number | undefined;
}>;
export type DestinationCostMultiplier = z.infer<typeof DestinationCostMultiplierSchema>;
export declare const CalculatorPagePayloadSchema: z.ZodObject<{
    headline: z.ZodDefault<z.ZodString>;
    subheadline: z.ZodDefault<z.ZodString>;
    badgeText: z.ZodDefault<z.ZodString>;
    disclaimerText: z.ZodDefault<z.ZodString>;
    procedures: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        category: z.ZodDefault<z.ZodString>;
        avgCostAbroad: z.ZodDefault<z.ZodString>;
        avgCostHome: z.ZodDefault<z.ZodString>;
        recoveryDays: z.ZodDefault<z.ZodString>;
        savingsPercentage: z.ZodDefault<z.ZodNumber>;
        popular: z.ZodDefault<z.ZodBoolean>;
        active: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        category: string;
        name: string;
        active: boolean;
        avgCostAbroad: string;
        avgCostHome: string;
        recoveryDays: string;
        savingsPercentage: number;
        popular: boolean;
    }, {
        id: string;
        name: string;
        category?: string | undefined;
        active?: boolean | undefined;
        avgCostAbroad?: string | undefined;
        avgCostHome?: string | undefined;
        recoveryDays?: string | undefined;
        savingsPercentage?: number | undefined;
        popular?: boolean | undefined;
    }>, "many">>;
    destinations: z.ZodDefault<z.ZodArray<z.ZodObject<{
        country: z.ZodString;
        multiplier: z.ZodDefault<z.ZodNumber>;
        hotelPerNightUsd: z.ZodDefault<z.ZodNumber>;
        visaFeeUsd: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        country: string;
        multiplier: number;
        hotelPerNightUsd: number;
        visaFeeUsd: number;
    }, {
        country: string;
        multiplier?: number | undefined;
        hotelPerNightUsd?: number | undefined;
        visaFeeUsd?: number | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    procedures: {
        id: string;
        category: string;
        name: string;
        active: boolean;
        avgCostAbroad: string;
        avgCostHome: string;
        recoveryDays: string;
        savingsPercentage: number;
        popular: boolean;
    }[];
    badgeText: string;
    destinations: {
        country: string;
        multiplier: number;
        hotelPerNightUsd: number;
        visaFeeUsd: number;
    }[];
    headline: string;
    subheadline: string;
    disclaimerText: string;
}, {
    procedures?: {
        id: string;
        name: string;
        category?: string | undefined;
        active?: boolean | undefined;
        avgCostAbroad?: string | undefined;
        avgCostHome?: string | undefined;
        recoveryDays?: string | undefined;
        savingsPercentage?: number | undefined;
        popular?: boolean | undefined;
    }[] | undefined;
    badgeText?: string | undefined;
    destinations?: {
        country: string;
        multiplier?: number | undefined;
        hotelPerNightUsd?: number | undefined;
        visaFeeUsd?: number | undefined;
    }[] | undefined;
    headline?: string | undefined;
    subheadline?: string | undefined;
    disclaimerText?: string | undefined;
}>;
export type CalculatorPagePayload = z.infer<typeof CalculatorPagePayloadSchema>;
export declare const DoctorCatalogueItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    specialty: z.ZodString;
    hospital: z.ZodString;
    city: z.ZodDefault<z.ZodString>;
    country: z.ZodDefault<z.ZodString>;
    experienceYears: z.ZodDefault<z.ZodNumber>;
    rating: z.ZodDefault<z.ZodNumber>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    consultationFeeUsd: z.ZodDefault<z.ZodString>;
    procedures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    image: z.ZodDefault<z.ZodString>;
    verified: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    country: string;
    rating: number;
    verified: boolean;
    hospital: string;
    image: string;
    experienceYears: number;
    city: string;
    reviewCount: number;
    procedures: string[];
    active: boolean;
    consultationFeeUsd: string;
}, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    hospital: string;
    country?: string | undefined;
    rating?: number | undefined;
    verified?: boolean | undefined;
    image?: string | undefined;
    experienceYears?: number | undefined;
    city?: string | undefined;
    reviewCount?: number | undefined;
    procedures?: string[] | undefined;
    active?: boolean | undefined;
    consultationFeeUsd?: string | undefined;
}>;
export type DoctorCatalogueItem = z.infer<typeof DoctorCatalogueItemSchema>;
export declare const DoctorsPagePayloadSchema: z.ZodObject<{
    headline: z.ZodDefault<z.ZodString>;
    subheadline: z.ZodDefault<z.ZodString>;
    searchPlaceholder: z.ZodDefault<z.ZodString>;
    featuredSpecialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    doctors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
        specialty: z.ZodString;
        hospital: z.ZodString;
        city: z.ZodDefault<z.ZodString>;
        country: z.ZodDefault<z.ZodString>;
        experienceYears: z.ZodDefault<z.ZodNumber>;
        rating: z.ZodDefault<z.ZodNumber>;
        reviewCount: z.ZodDefault<z.ZodNumber>;
        consultationFeeUsd: z.ZodDefault<z.ZodString>;
        procedures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        image: z.ZodDefault<z.ZodString>;
        verified: z.ZodDefault<z.ZodBoolean>;
        active: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        country: string;
        rating: number;
        verified: boolean;
        hospital: string;
        image: string;
        experienceYears: number;
        city: string;
        reviewCount: number;
        procedures: string[];
        active: boolean;
        consultationFeeUsd: string;
    }, {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        hospital: string;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
        image?: string | undefined;
        experienceYears?: number | undefined;
        city?: string | undefined;
        reviewCount?: number | undefined;
        procedures?: string[] | undefined;
        active?: boolean | undefined;
        consultationFeeUsd?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    doctors: {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        country: string;
        rating: number;
        verified: boolean;
        hospital: string;
        image: string;
        experienceYears: number;
        city: string;
        reviewCount: number;
        procedures: string[];
        active: boolean;
        consultationFeeUsd: string;
    }[];
    headline: string;
    subheadline: string;
    searchPlaceholder: string;
    featuredSpecialties: string[];
}, {
    doctors?: {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        hospital: string;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
        image?: string | undefined;
        experienceYears?: number | undefined;
        city?: string | undefined;
        reviewCount?: number | undefined;
        procedures?: string[] | undefined;
        active?: boolean | undefined;
        consultationFeeUsd?: string | undefined;
    }[] | undefined;
    headline?: string | undefined;
    subheadline?: string | undefined;
    searchPlaceholder?: string | undefined;
    featuredSpecialties?: string[] | undefined;
}>;
export type DoctorsPagePayload = z.infer<typeof DoctorsPagePayloadSchema>;
export declare const HospitalCatalogueItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    city: z.ZodDefault<z.ZodString>;
    country: z.ZodDefault<z.ZodString>;
    accreditations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    bedsCount: z.ZodDefault<z.ZodNumber>;
    rating: z.ZodDefault<z.ZodNumber>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    specialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    image: z.ZodDefault<z.ZodString>;
    description: z.ZodDefault<z.ZodString>;
    verified: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    description: string;
    country: string;
    rating: number;
    verified: boolean;
    image: string;
    city: string;
    reviewCount: number;
    accreditations: string[];
    active: boolean;
    bedsCount: number;
    specialties: string[];
}, {
    id: string;
    slug: string;
    name: string;
    description?: string | undefined;
    country?: string | undefined;
    rating?: number | undefined;
    verified?: boolean | undefined;
    image?: string | undefined;
    city?: string | undefined;
    reviewCount?: number | undefined;
    accreditations?: string[] | undefined;
    active?: boolean | undefined;
    bedsCount?: number | undefined;
    specialties?: string[] | undefined;
}>;
export type HospitalCatalogueItem = z.infer<typeof HospitalCatalogueItemSchema>;
export declare const HospitalsPagePayloadSchema: z.ZodObject<{
    headline: z.ZodDefault<z.ZodString>;
    subheadline: z.ZodDefault<z.ZodString>;
    searchPlaceholder: z.ZodDefault<z.ZodString>;
    filterAccreditations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    hospitals: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
        city: z.ZodDefault<z.ZodString>;
        country: z.ZodDefault<z.ZodString>;
        accreditations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        bedsCount: z.ZodDefault<z.ZodNumber>;
        rating: z.ZodDefault<z.ZodNumber>;
        reviewCount: z.ZodDefault<z.ZodNumber>;
        specialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        image: z.ZodDefault<z.ZodString>;
        description: z.ZodDefault<z.ZodString>;
        verified: z.ZodDefault<z.ZodBoolean>;
        active: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        slug: string;
        name: string;
        description: string;
        country: string;
        rating: number;
        verified: boolean;
        image: string;
        city: string;
        reviewCount: number;
        accreditations: string[];
        active: boolean;
        bedsCount: number;
        specialties: string[];
    }, {
        id: string;
        slug: string;
        name: string;
        description?: string | undefined;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
        image?: string | undefined;
        city?: string | undefined;
        reviewCount?: number | undefined;
        accreditations?: string[] | undefined;
        active?: boolean | undefined;
        bedsCount?: number | undefined;
        specialties?: string[] | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    headline: string;
    subheadline: string;
    searchPlaceholder: string;
    filterAccreditations: string[];
    hospitals: {
        id: string;
        slug: string;
        name: string;
        description: string;
        country: string;
        rating: number;
        verified: boolean;
        image: string;
        city: string;
        reviewCount: number;
        accreditations: string[];
        active: boolean;
        bedsCount: number;
        specialties: string[];
    }[];
}, {
    headline?: string | undefined;
    subheadline?: string | undefined;
    searchPlaceholder?: string | undefined;
    filterAccreditations?: string[] | undefined;
    hospitals?: {
        id: string;
        slug: string;
        name: string;
        description?: string | undefined;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
        image?: string | undefined;
        city?: string | undefined;
        reviewCount?: number | undefined;
        accreditations?: string[] | undefined;
        active?: boolean | undefined;
        bedsCount?: number | undefined;
        specialties?: string[] | undefined;
    }[] | undefined;
}>;
export type HospitalsPagePayload = z.infer<typeof HospitalsPagePayloadSchema>;
export declare const TreatmentCatalogueItemSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    slug: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    description: z.ZodDefault<z.ZodString>;
    href: z.ZodDefault<z.ZodString>;
    image: z.ZodDefault<z.ZodString>;
    fallbackImage: z.ZodDefault<z.ZodString>;
    procedures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    avgCostAbroad: z.ZodDefault<z.ZodString>;
    avgCostHome: z.ZodDefault<z.ZodString>;
    recoveryTime: z.ZodDefault<z.ZodString>;
    isTopTreatment: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    slug: string;
    category: string;
    description: string;
    href: string;
    image: string;
    procedures: string[];
    active: boolean;
    avgCostAbroad: string;
    avgCostHome: string;
    fallbackImage: string;
    recoveryTime: string;
    isTopTreatment: boolean;
}, {
    id: string;
    title: string;
    slug: string;
    category?: string | undefined;
    description?: string | undefined;
    href?: string | undefined;
    image?: string | undefined;
    procedures?: string[] | undefined;
    active?: boolean | undefined;
    avgCostAbroad?: string | undefined;
    avgCostHome?: string | undefined;
    fallbackImage?: string | undefined;
    recoveryTime?: string | undefined;
    isTopTreatment?: boolean | undefined;
}>;
export type TreatmentCatalogueItem = z.infer<typeof TreatmentCatalogueItemSchema>;
export declare const TreatmentsPagePayloadSchema: z.ZodObject<{
    headline: z.ZodDefault<z.ZodString>;
    subheadline: z.ZodDefault<z.ZodString>;
    topTreatmentsTitle: z.ZodDefault<z.ZodString>;
    allTreatmentsTitle: z.ZodDefault<z.ZodString>;
    freeConsultationTitle: z.ZodDefault<z.ZodString>;
    freeConsultationSubtitle: z.ZodDefault<z.ZodString>;
    confidentHealthcareTitle: z.ZodDefault<z.ZodString>;
    confidentHealthcareSubtitle: z.ZodDefault<z.ZodString>;
    treatments: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        slug: z.ZodString;
        category: z.ZodDefault<z.ZodString>;
        description: z.ZodDefault<z.ZodString>;
        href: z.ZodDefault<z.ZodString>;
        image: z.ZodDefault<z.ZodString>;
        fallbackImage: z.ZodDefault<z.ZodString>;
        procedures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        avgCostAbroad: z.ZodDefault<z.ZodString>;
        avgCostHome: z.ZodDefault<z.ZodString>;
        recoveryTime: z.ZodDefault<z.ZodString>;
        isTopTreatment: z.ZodDefault<z.ZodBoolean>;
        active: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        slug: string;
        category: string;
        description: string;
        href: string;
        image: string;
        procedures: string[];
        active: boolean;
        avgCostAbroad: string;
        avgCostHome: string;
        fallbackImage: string;
        recoveryTime: string;
        isTopTreatment: boolean;
    }, {
        id: string;
        title: string;
        slug: string;
        category?: string | undefined;
        description?: string | undefined;
        href?: string | undefined;
        image?: string | undefined;
        procedures?: string[] | undefined;
        active?: boolean | undefined;
        avgCostAbroad?: string | undefined;
        avgCostHome?: string | undefined;
        fallbackImage?: string | undefined;
        recoveryTime?: string | undefined;
        isTopTreatment?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    headline: string;
    subheadline: string;
    topTreatmentsTitle: string;
    allTreatmentsTitle: string;
    freeConsultationTitle: string;
    freeConsultationSubtitle: string;
    confidentHealthcareTitle: string;
    confidentHealthcareSubtitle: string;
    treatments: {
        id: string;
        title: string;
        slug: string;
        category: string;
        description: string;
        href: string;
        image: string;
        procedures: string[];
        active: boolean;
        avgCostAbroad: string;
        avgCostHome: string;
        fallbackImage: string;
        recoveryTime: string;
        isTopTreatment: boolean;
    }[];
}, {
    headline?: string | undefined;
    subheadline?: string | undefined;
    topTreatmentsTitle?: string | undefined;
    allTreatmentsTitle?: string | undefined;
    freeConsultationTitle?: string | undefined;
    freeConsultationSubtitle?: string | undefined;
    confidentHealthcareTitle?: string | undefined;
    confidentHealthcareSubtitle?: string | undefined;
    treatments?: {
        id: string;
        title: string;
        slug: string;
        category?: string | undefined;
        description?: string | undefined;
        href?: string | undefined;
        image?: string | undefined;
        procedures?: string[] | undefined;
        active?: boolean | undefined;
        avgCostAbroad?: string | undefined;
        avgCostHome?: string | undefined;
        fallbackImage?: string | undefined;
        recoveryTime?: string | undefined;
        isTopTreatment?: boolean | undefined;
    }[] | undefined;
}>;
export type TreatmentsPagePayload = z.infer<typeof TreatmentsPagePayloadSchema>;
export declare const DestinationCatalogueItemSchema: z.ZodObject<{
    id: z.ZodString;
    country: z.ZodString;
    slug: z.ZodString;
    cityHighlights: z.ZodDefault<z.ZodString>;
    popularProcedures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    savingsPercentage: z.ZodDefault<z.ZodNumber>;
    hospitalCount: z.ZodDefault<z.ZodNumber>;
    visaProcessingDays: z.ZodDefault<z.ZodString>;
    flightConnectivity: z.ZodDefault<z.ZodString>;
    image: z.ZodDefault<z.ZodString>;
    tagline: z.ZodDefault<z.ZodString>;
    featured: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    country: string;
    image: string;
    active: boolean;
    tagline: string;
    savingsPercentage: number;
    cityHighlights: string;
    popularProcedures: string[];
    hospitalCount: number;
    visaProcessingDays: string;
    flightConnectivity: string;
    featured: boolean;
}, {
    id: string;
    slug: string;
    country: string;
    image?: string | undefined;
    active?: boolean | undefined;
    tagline?: string | undefined;
    savingsPercentage?: number | undefined;
    cityHighlights?: string | undefined;
    popularProcedures?: string[] | undefined;
    hospitalCount?: number | undefined;
    visaProcessingDays?: string | undefined;
    flightConnectivity?: string | undefined;
    featured?: boolean | undefined;
}>;
export type DestinationCatalogueItem = z.infer<typeof DestinationCatalogueItemSchema>;
export declare const DestinationsPagePayloadSchema: z.ZodObject<{
    sectionTitle: z.ZodDefault<z.ZodString>;
    sectionSubtitle: z.ZodDefault<z.ZodString>;
    destinations: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        country: z.ZodString;
        slug: z.ZodString;
        cityHighlights: z.ZodDefault<z.ZodString>;
        popularProcedures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        savingsPercentage: z.ZodDefault<z.ZodNumber>;
        hospitalCount: z.ZodDefault<z.ZodNumber>;
        visaProcessingDays: z.ZodDefault<z.ZodString>;
        flightConnectivity: z.ZodDefault<z.ZodString>;
        image: z.ZodDefault<z.ZodString>;
        tagline: z.ZodDefault<z.ZodString>;
        featured: z.ZodDefault<z.ZodBoolean>;
        active: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        slug: string;
        country: string;
        image: string;
        active: boolean;
        tagline: string;
        savingsPercentage: number;
        cityHighlights: string;
        popularProcedures: string[];
        hospitalCount: number;
        visaProcessingDays: string;
        flightConnectivity: string;
        featured: boolean;
    }, {
        id: string;
        slug: string;
        country: string;
        image?: string | undefined;
        active?: boolean | undefined;
        tagline?: string | undefined;
        savingsPercentage?: number | undefined;
        cityHighlights?: string | undefined;
        popularProcedures?: string[] | undefined;
        hospitalCount?: number | undefined;
        visaProcessingDays?: string | undefined;
        flightConnectivity?: string | undefined;
        featured?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    destinations: {
        id: string;
        slug: string;
        country: string;
        image: string;
        active: boolean;
        tagline: string;
        savingsPercentage: number;
        cityHighlights: string;
        popularProcedures: string[];
        hospitalCount: number;
        visaProcessingDays: string;
        flightConnectivity: string;
        featured: boolean;
    }[];
    sectionTitle: string;
    sectionSubtitle: string;
}, {
    destinations?: {
        id: string;
        slug: string;
        country: string;
        image?: string | undefined;
        active?: boolean | undefined;
        tagline?: string | undefined;
        savingsPercentage?: number | undefined;
        cityHighlights?: string | undefined;
        popularProcedures?: string[] | undefined;
        hospitalCount?: number | undefined;
        visaProcessingDays?: string | undefined;
        flightConnectivity?: string | undefined;
        featured?: boolean | undefined;
    }[] | undefined;
    sectionTitle?: string | undefined;
    sectionSubtitle?: string | undefined;
}>;
export type DestinationsPagePayload = z.infer<typeof DestinationsPagePayloadSchema>;
export declare const CommunityStoryItemSchema: z.ZodObject<{
    id: z.ZodString;
    patientName: z.ZodString;
    originCountry: z.ZodDefault<z.ZodString>;
    destinationCountry: z.ZodDefault<z.ZodString>;
    hospitalName: z.ZodDefault<z.ZodString>;
    procedureName: z.ZodDefault<z.ZodString>;
    rating: z.ZodDefault<z.ZodNumber>;
    reviewText: z.ZodString;
    avatarUrl: z.ZodDefault<z.ZodString>;
    verifiedPatient: z.ZodDefault<z.ZodBoolean>;
    reviewDate: z.ZodDefault<z.ZodString>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    avatarUrl: string;
    rating: number;
    active: boolean;
    hospitalName: string;
    patientName: string;
    originCountry: string;
    destinationCountry: string;
    procedureName: string;
    reviewText: string;
    verifiedPatient: boolean;
    reviewDate: string;
}, {
    id: string;
    patientName: string;
    reviewText: string;
    avatarUrl?: string | undefined;
    rating?: number | undefined;
    active?: boolean | undefined;
    hospitalName?: string | undefined;
    originCountry?: string | undefined;
    destinationCountry?: string | undefined;
    procedureName?: string | undefined;
    verifiedPatient?: boolean | undefined;
    reviewDate?: string | undefined;
}>;
export type CommunityStoryItem = z.infer<typeof CommunityStoryItemSchema>;
export declare const CommunityPagePayloadSchema: z.ZodObject<{
    sectionTitle: z.ZodDefault<z.ZodString>;
    sectionSubtitle: z.ZodDefault<z.ZodString>;
    testimonials: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        patientName: z.ZodString;
        originCountry: z.ZodDefault<z.ZodString>;
        destinationCountry: z.ZodDefault<z.ZodString>;
        hospitalName: z.ZodDefault<z.ZodString>;
        procedureName: z.ZodDefault<z.ZodString>;
        rating: z.ZodDefault<z.ZodNumber>;
        reviewText: z.ZodString;
        avatarUrl: z.ZodDefault<z.ZodString>;
        verifiedPatient: z.ZodDefault<z.ZodBoolean>;
        reviewDate: z.ZodDefault<z.ZodString>;
        active: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        avatarUrl: string;
        rating: number;
        active: boolean;
        hospitalName: string;
        patientName: string;
        originCountry: string;
        destinationCountry: string;
        procedureName: string;
        reviewText: string;
        verifiedPatient: boolean;
        reviewDate: string;
    }, {
        id: string;
        patientName: string;
        reviewText: string;
        avatarUrl?: string | undefined;
        rating?: number | undefined;
        active?: boolean | undefined;
        hospitalName?: string | undefined;
        originCountry?: string | undefined;
        destinationCountry?: string | undefined;
        procedureName?: string | undefined;
        verifiedPatient?: boolean | undefined;
        reviewDate?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    sectionTitle: string;
    sectionSubtitle: string;
    testimonials: {
        id: string;
        avatarUrl: string;
        rating: number;
        active: boolean;
        hospitalName: string;
        patientName: string;
        originCountry: string;
        destinationCountry: string;
        procedureName: string;
        reviewText: string;
        verifiedPatient: boolean;
        reviewDate: string;
    }[];
}, {
    sectionTitle?: string | undefined;
    sectionSubtitle?: string | undefined;
    testimonials?: {
        id: string;
        patientName: string;
        reviewText: string;
        avatarUrl?: string | undefined;
        rating?: number | undefined;
        active?: boolean | undefined;
        hospitalName?: string | undefined;
        originCountry?: string | undefined;
        destinationCountry?: string | undefined;
        procedureName?: string | undefined;
        verifiedPatient?: boolean | undefined;
        reviewDate?: string | undefined;
    }[] | undefined;
}>;
export type CommunityPagePayload = z.infer<typeof CommunityPagePayloadSchema>;
export declare const AboutTeamMemberSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    role: z.ZodString;
    credentials: z.ZodDefault<z.ZodString>;
    bio: z.ZodDefault<z.ZodString>;
    image: z.ZodDefault<z.ZodString>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    name: string;
    role: string;
    image: string;
    bio: string;
    active: boolean;
    credentials: string;
}, {
    id: string;
    name: string;
    role: string;
    image?: string | undefined;
    bio?: string | undefined;
    active?: boolean | undefined;
    credentials?: string | undefined;
}>;
export type AboutTeamMember = z.infer<typeof AboutTeamMemberSchema>;
export declare const AboutPagePayloadSchema: z.ZodObject<{
    headline: z.ZodDefault<z.ZodString>;
    subheadline: z.ZodDefault<z.ZodString>;
    mission: z.ZodDefault<z.ZodString>;
    vision: z.ZodDefault<z.ZodString>;
    stats: z.ZodDefault<z.ZodObject<{
        patientsCoordinated: z.ZodDefault<z.ZodString>;
        partnerHospitals: z.ZodDefault<z.ZodString>;
        satisfactionRate: z.ZodDefault<z.ZodString>;
        countriesServed: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        patientsCoordinated: string;
        partnerHospitals: string;
        satisfactionRate: string;
        countriesServed: string;
    }, {
        patientsCoordinated?: string | undefined;
        partnerHospitals?: string | undefined;
        satisfactionRate?: string | undefined;
        countriesServed?: string | undefined;
    }>>;
    teamMembers: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        role: z.ZodString;
        credentials: z.ZodDefault<z.ZodString>;
        bio: z.ZodDefault<z.ZodString>;
        image: z.ZodDefault<z.ZodString>;
        active: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        name: string;
        role: string;
        image: string;
        bio: string;
        active: boolean;
        credentials: string;
    }, {
        id: string;
        name: string;
        role: string;
        image?: string | undefined;
        bio?: string | undefined;
        active?: boolean | undefined;
        credentials?: string | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    headline: string;
    subheadline: string;
    mission: string;
    vision: string;
    stats: {
        patientsCoordinated: string;
        partnerHospitals: string;
        satisfactionRate: string;
        countriesServed: string;
    };
    teamMembers: {
        id: string;
        name: string;
        role: string;
        image: string;
        bio: string;
        active: boolean;
        credentials: string;
    }[];
}, {
    headline?: string | undefined;
    subheadline?: string | undefined;
    mission?: string | undefined;
    vision?: string | undefined;
    stats?: {
        patientsCoordinated?: string | undefined;
        partnerHospitals?: string | undefined;
        satisfactionRate?: string | undefined;
        countriesServed?: string | undefined;
    } | undefined;
    teamMembers?: {
        id: string;
        name: string;
        role: string;
        image?: string | undefined;
        bio?: string | undefined;
        active?: boolean | undefined;
        credentials?: string | undefined;
    }[] | undefined;
}>;
export type AboutPagePayload = z.infer<typeof AboutPagePayloadSchema>;
export declare const UpdatePagePayloadDTO: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    seo: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        canonicalPath: z.ZodString;
        ogMediaId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        robots: z.ZodDefault<z.ZodString>;
        schemaKind: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        canonicalPath: string;
        robots: string;
        schemaKind: string;
        ogMediaId?: string | null | undefined;
    }, {
        title: string;
        description: string;
        canonicalPath: string;
        ogMediaId?: string | null | undefined;
        robots?: string | undefined;
        schemaKind?: string | undefined;
    }>>;
    publishImmediately: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    payload: Record<string, unknown>;
    publishImmediately: boolean;
    title?: string | undefined;
    seo?: {
        title: string;
        description: string;
        canonicalPath: string;
        robots: string;
        schemaKind: string;
        ogMediaId?: string | null | undefined;
    } | undefined;
}, {
    payload: Record<string, unknown>;
    title?: string | undefined;
    seo?: {
        title: string;
        description: string;
        canonicalPath: string;
        ogMediaId?: string | null | undefined;
        robots?: string | undefined;
        schemaKind?: string | undefined;
    } | undefined;
    publishImmediately?: boolean | undefined;
}>;
export type UpdatePagePayloadDTO = z.infer<typeof UpdatePagePayloadDTO>;
export declare const ManageItemActionDTO: z.ZodObject<{
    itemType: z.ZodEnum<["doctor", "hospital", "treatment", "destination", "community", "teamMember", "calculatorProcedure"]>;
    action: z.ZodEnum<["create", "update", "delete", "toggleActive"]>;
    item: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    itemId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    itemType: "treatment" | "hospital" | "doctor" | "destination" | "community" | "teamMember" | "calculatorProcedure";
    action: "create" | "update" | "delete" | "toggleActive";
    item: Record<string, unknown>;
    itemId?: string | undefined;
}, {
    itemType: "treatment" | "hospital" | "doctor" | "destination" | "community" | "teamMember" | "calculatorProcedure";
    action: "create" | "update" | "delete" | "toggleActive";
    item: Record<string, unknown>;
    itemId?: string | undefined;
}>;
export type ManageItemActionDTO = z.infer<typeof ManageItemActionDTO>;
//# sourceMappingURL=pageCms.d.ts.map