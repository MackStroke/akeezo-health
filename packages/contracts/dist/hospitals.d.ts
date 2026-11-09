import { z } from "zod";
export declare const HospitalSurgeryCostItemSchema: z.ZodObject<{
    id: z.ZodString;
    procedure: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    hospitalPriceUsd: z.ZodDefault<z.ZodString>;
    usUkPriceUsd: z.ZodDefault<z.ZodString>;
    savingsPercent: z.ZodDefault<z.ZodNumber>;
    description: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: string;
    procedure: string;
    description: string;
    savingsPercent: number;
    hospitalPriceUsd: string;
    usUkPriceUsd: string;
}, {
    id: string;
    procedure: string;
    category?: string | undefined;
    description?: string | undefined;
    savingsPercent?: number | undefined;
    hospitalPriceUsd?: string | undefined;
    usUkPriceUsd?: string | undefined;
}>;
export type HospitalSurgeryCostItem = z.infer<typeof HospitalSurgeryCostItemSchema>;
export declare const HospitalRoomTypeSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    amenities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    amenities: string[];
}, {
    name: string;
    description: string;
    amenities?: string[] | undefined;
}>;
export type HospitalRoomType = z.infer<typeof HospitalRoomTypeSchema>;
export declare const HospitalFaqItemSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
}, {
    question: string;
    answer: string;
}>;
export type HospitalFaqItem = z.infer<typeof HospitalFaqItemSchema>;
export declare const HospitalReviewItemSchema: z.ZodObject<{
    id: z.ZodString;
    author: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    rating: z.ZodDefault<z.ZodNumber>;
    date: z.ZodString;
    treatment: z.ZodString;
    comment: z.ZodString;
    verified: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    date: string;
    author: string;
    treatment: string;
    country: string;
    rating: number;
    comment: string;
    verified: boolean;
}, {
    id: string;
    date: string;
    author: string;
    treatment: string;
    comment: string;
    country?: string | undefined;
    rating?: number | undefined;
    verified?: boolean | undefined;
}>;
export type HospitalReviewItem = z.infer<typeof HospitalReviewItemSchema>;
export declare const HospitalDoctorSummarySchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    specialty: z.ZodString;
    image: z.ZodString;
    experience: z.ZodDefault<z.ZodString>;
    rating: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    rating: number;
    image: string;
    experience: string;
}, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    image: string;
    rating?: number | undefined;
    experience?: string | undefined;
}>;
export type HospitalDoctorSummary = z.infer<typeof HospitalDoctorSummarySchema>;
export declare const HospitalDetailSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    href: z.ZodOptional<z.ZodString>;
    hospitalType: z.ZodDefault<z.ZodString>;
    ownership: z.ZodDefault<z.ZodString>;
    rankBadge: z.ZodDefault<z.ZodString>;
    rank: z.ZodDefault<z.ZodNumber>;
    city: z.ZodDefault<z.ZodString>;
    country: z.ZodDefault<z.ZodString>;
    address: z.ZodString;
    postalCode: z.ZodDefault<z.ZodString>;
    telephone: z.ZodDefault<z.ZodString>;
    rating: z.ZodDefault<z.ZodNumber>;
    ratingDisplay: z.ZodDefault<z.ZodString>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    patientSatisfactionRate: z.ZodDefault<z.ZodString>;
    establishedYear: z.ZodDefault<z.ZodNumber>;
    bedsCount: z.ZodDefault<z.ZodNumber>;
    icuCount: z.ZodDefault<z.ZodNumber>;
    operatingRooms: z.ZodDefault<z.ZodNumber>;
    dailyPatients: z.ZodDefault<z.ZodString>;
    doctorsCount: z.ZodDefault<z.ZodString>;
    nursesCount: z.ZodDefault<z.ZodString>;
    languagesSpoken: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    accreditations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    image: z.ZodDefault<z.ZodString>;
    images: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    summary: z.ZodString;
    aboutMarkdown: z.ZodString;
    highlights: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    accessibilityFeatures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    roomTypes: z.ZodDefault<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        amenities: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        description: string;
        amenities: string[];
    }, {
        name: string;
        description: string;
        amenities?: string[] | undefined;
    }>, "many">>;
    paymentMethods: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    specialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    surgeriesCost: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        procedure: z.ZodString;
        category: z.ZodDefault<z.ZodString>;
        hospitalPriceUsd: z.ZodDefault<z.ZodString>;
        usUkPriceUsd: z.ZodDefault<z.ZodString>;
        savingsPercent: z.ZodDefault<z.ZodNumber>;
        description: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        category: string;
        procedure: string;
        description: string;
        savingsPercent: number;
        hospitalPriceUsd: string;
        usUkPriceUsd: string;
    }, {
        id: string;
        procedure: string;
        category?: string | undefined;
        description?: string | undefined;
        savingsPercent?: number | undefined;
        hospitalPriceUsd?: string | undefined;
        usUkPriceUsd?: string | undefined;
    }>, "many">>;
    doctors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
        specialty: z.ZodString;
        image: z.ZodString;
        experience: z.ZodDefault<z.ZodString>;
        rating: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        rating: number;
        image: string;
        experience: string;
    }, {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        image: string;
        rating?: number | undefined;
        experience?: string | undefined;
    }>, "many">>;
    faqs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        answer: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        question: string;
        answer: string;
    }, {
        question: string;
        answer: string;
    }>, "many">>;
    location: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodDefault<z.ZodNumber>;
        longitude: z.ZodDefault<z.ZodNumber>;
        airportBKKDistance: z.ZodDefault<z.ZodString>;
        airportDMKDistance: z.ZodDefault<z.ZodString>;
        travelNotes: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
        airportBKKDistance: string;
        airportDMKDistance: string;
        travelNotes: string;
    }, {
        latitude?: number | undefined;
        longitude?: number | undefined;
        airportBKKDistance?: string | undefined;
        airportDMKDistance?: string | undefined;
        travelNotes?: string | undefined;
    }>>;
    reviews: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        author: z.ZodString;
        country: z.ZodDefault<z.ZodString>;
        rating: z.ZodDefault<z.ZodNumber>;
        date: z.ZodString;
        treatment: z.ZodString;
        comment: z.ZodString;
        verified: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        date: string;
        author: string;
        treatment: string;
        country: string;
        rating: number;
        comment: string;
        verified: boolean;
    }, {
        id: string;
        date: string;
        author: string;
        treatment: string;
        comment: string;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
    }>, "many">>;
    verified: z.ZodDefault<z.ZodBoolean>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    summary: string;
    country: string;
    rating: number;
    verified: boolean;
    image: string;
    city: string;
    reviewCount: number;
    accreditations: string[];
    reviews: {
        id: string;
        date: string;
        author: string;
        treatment: string;
        country: string;
        rating: number;
        comment: string;
        verified: boolean;
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
    active: boolean;
    address: string;
    hospitalType: string;
    ownership: string;
    rankBadge: string;
    rank: number;
    postalCode: string;
    telephone: string;
    ratingDisplay: string;
    patientSatisfactionRate: string;
    establishedYear: number;
    bedsCount: number;
    icuCount: number;
    operatingRooms: number;
    dailyPatients: string;
    doctorsCount: string;
    nursesCount: string;
    languagesSpoken: string[];
    images: string[];
    aboutMarkdown: string;
    highlights: string[];
    accessibilityFeatures: string[];
    roomTypes: {
        name: string;
        description: string;
        amenities: string[];
    }[];
    paymentMethods: string[];
    specialties: string[];
    surgeriesCost: {
        id: string;
        category: string;
        procedure: string;
        description: string;
        savingsPercent: number;
        hospitalPriceUsd: string;
        usUkPriceUsd: string;
    }[];
    doctors: {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        rating: number;
        image: string;
        experience: string;
    }[];
    href?: string | undefined;
    location?: {
        latitude: number;
        longitude: number;
        airportBKKDistance: string;
        airportDMKDistance: string;
        travelNotes: string;
    } | undefined;
}, {
    id: string;
    slug: string;
    name: string;
    summary: string;
    address: string;
    aboutMarkdown: string;
    country?: string | undefined;
    rating?: number | undefined;
    verified?: boolean | undefined;
    href?: string | undefined;
    image?: string | undefined;
    city?: string | undefined;
    reviewCount?: number | undefined;
    accreditations?: string[] | undefined;
    reviews?: {
        id: string;
        date: string;
        author: string;
        treatment: string;
        comment: string;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
    }[] | undefined;
    faqs?: {
        question: string;
        answer: string;
    }[] | undefined;
    active?: boolean | undefined;
    hospitalType?: string | undefined;
    ownership?: string | undefined;
    rankBadge?: string | undefined;
    rank?: number | undefined;
    postalCode?: string | undefined;
    telephone?: string | undefined;
    ratingDisplay?: string | undefined;
    patientSatisfactionRate?: string | undefined;
    establishedYear?: number | undefined;
    bedsCount?: number | undefined;
    icuCount?: number | undefined;
    operatingRooms?: number | undefined;
    dailyPatients?: string | undefined;
    doctorsCount?: string | undefined;
    nursesCount?: string | undefined;
    languagesSpoken?: string[] | undefined;
    images?: string[] | undefined;
    highlights?: string[] | undefined;
    accessibilityFeatures?: string[] | undefined;
    roomTypes?: {
        name: string;
        description: string;
        amenities?: string[] | undefined;
    }[] | undefined;
    paymentMethods?: string[] | undefined;
    specialties?: string[] | undefined;
    surgeriesCost?: {
        id: string;
        procedure: string;
        category?: string | undefined;
        description?: string | undefined;
        savingsPercent?: number | undefined;
        hospitalPriceUsd?: string | undefined;
        usUkPriceUsd?: string | undefined;
    }[] | undefined;
    doctors?: {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        image: string;
        rating?: number | undefined;
        experience?: string | undefined;
    }[] | undefined;
    location?: {
        latitude?: number | undefined;
        longitude?: number | undefined;
        airportBKKDistance?: string | undefined;
        airportDMKDistance?: string | undefined;
        travelNotes?: string | undefined;
    } | undefined;
}>;
export type HospitalDetail = z.infer<typeof HospitalDetailSchema>;
export declare const YANHEE_HOSPITAL_DETAIL: HospitalDetail;
export declare const HOSPITAL_DETAILS_MAP: Record<string, HospitalDetail>;
export declare function getHospitalDetail(slug: string, fallbackHospitals?: any[]): HospitalDetail | null;
export declare function buildHospitalDetailFromItem(item: any): HospitalDetail;
//# sourceMappingURL=hospitals.d.ts.map