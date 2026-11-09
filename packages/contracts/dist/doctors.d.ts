import { z } from "zod";
export declare const ProcedureItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    description: z.ZodString;
    duration: z.ZodDefault<z.ZodString>;
    indicativeCostUsd: z.ZodDefault<z.ZodString>;
    usUkCostUsd: z.ZodDefault<z.ZodString>;
    savingsPercent: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    category: string;
    name: string;
    description: string;
    duration: string;
    indicativeCostUsd: string;
    usUkCostUsd: string;
    savingsPercent: number;
}, {
    id: string;
    name: string;
    description: string;
    category?: string | undefined;
    duration?: string | undefined;
    indicativeCostUsd?: string | undefined;
    usUkCostUsd?: string | undefined;
    savingsPercent?: number | undefined;
}>;
export type ProcedureItem = z.infer<typeof ProcedureItemSchema>;
export declare const DoctorReviewItemSchema: z.ZodObject<{
    id: z.ZodString;
    author: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    rating: z.ZodDefault<z.ZodNumber>;
    date: z.ZodString;
    treatment: z.ZodString;
    comment: z.ZodString;
    verified: z.ZodDefault<z.ZodBoolean>;
    source: z.ZodDefault<z.ZodEnum<["google", "akeezo", "hospital", "verified_patient"]>>;
}, "strip", z.ZodTypeAny, {
    id: string;
    date: string;
    author: string;
    treatment: string;
    source: "google" | "akeezo" | "hospital" | "verified_patient";
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
    source?: "google" | "akeezo" | "hospital" | "verified_patient" | undefined;
    country?: string | undefined;
    rating?: number | undefined;
    verified?: boolean | undefined;
}>;
export type DoctorReviewItem = z.infer<typeof DoctorReviewItemSchema>;
export declare const DoctorTimelineItemSchema: z.ZodObject<{
    title: z.ZodString;
    institution: z.ZodString;
    period: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    title: string;
    institution: string;
    period: string;
    description?: string | undefined;
}, {
    title: string;
    institution: string;
    period: string;
    description?: string | undefined;
}>;
export type DoctorTimelineItem = z.infer<typeof DoctorTimelineItemSchema>;
export declare const DoctorFaqSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
}, {
    question: string;
    answer: string;
}>;
export type DoctorFaq = z.infer<typeof DoctorFaqSchema>;
export declare const DoctorDetailSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    href: z.ZodOptional<z.ZodString>;
    image: z.ZodString;
    imageFallback: z.ZodOptional<z.ZodString>;
    specialty: z.ZodString;
    designation: z.ZodString;
    badge: z.ZodString;
    experience: z.ZodString;
    experienceYears: z.ZodDefault<z.ZodNumber>;
    hospital: z.ZodString;
    hospitalAddress: z.ZodOptional<z.ZodString>;
    city: z.ZodString;
    country: z.ZodString;
    rating: z.ZodDefault<z.ZodNumber>;
    reviewCount: z.ZodDefault<z.ZodNumber>;
    bio: z.ZodString;
    aboutBio: z.ZodString;
    professionalBackground: z.ZodObject<{
        yearsOfWork: z.ZodString;
        primaryClinic: z.ZodString;
        basedIn: z.ZodString;
        languages: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        yearsOfWork: string;
        primaryClinic: string;
        basedIn: string;
        languages: string[];
    }, {
        yearsOfWork: string;
        primaryClinic: string;
        basedIn: string;
        languages?: string[] | undefined;
    }>;
    innovations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    goodToKnow: z.ZodObject<{
        surgeriesCount: z.ZodDefault<z.ZodString>;
        successRate: z.ZodDefault<z.ZodString>;
        responseTime: z.ZodDefault<z.ZodString>;
        accreditations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        surgeriesCount: string;
        successRate: string;
        responseTime: string;
        accreditations: string[];
    }, {
        surgeriesCount?: string | undefined;
        successRate?: string | undefined;
        responseTime?: string | undefined;
        accreditations?: string[] | undefined;
    }>;
    experiences: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        institution: z.ZodString;
        period: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }, {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }>, "many">>;
    educations: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        institution: z.ZodString;
        period: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }, {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }>, "many">>;
    procedures: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        category: z.ZodDefault<z.ZodString>;
        description: z.ZodString;
        duration: z.ZodDefault<z.ZodString>;
        indicativeCostUsd: z.ZodDefault<z.ZodString>;
        usUkCostUsd: z.ZodDefault<z.ZodString>;
        savingsPercent: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        category: string;
        name: string;
        description: string;
        duration: string;
        indicativeCostUsd: string;
        usUkCostUsd: string;
        savingsPercent: number;
    }, {
        id: string;
        name: string;
        description: string;
        category?: string | undefined;
        duration?: string | undefined;
        indicativeCostUsd?: string | undefined;
        usUkCostUsd?: string | undefined;
        savingsPercent?: number | undefined;
    }>, "many">>;
    reviews: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        author: z.ZodString;
        country: z.ZodDefault<z.ZodString>;
        rating: z.ZodDefault<z.ZodNumber>;
        date: z.ZodString;
        treatment: z.ZodString;
        comment: z.ZodString;
        verified: z.ZodDefault<z.ZodBoolean>;
        source: z.ZodDefault<z.ZodEnum<["google", "akeezo", "hospital", "verified_patient"]>>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        date: string;
        author: string;
        treatment: string;
        source: "google" | "akeezo" | "hospital" | "verified_patient";
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
        source?: "google" | "akeezo" | "hospital" | "verified_patient" | undefined;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
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
    teleconsultationFeeUsd: z.ZodDefault<z.ZodString>;
    verified: z.ZodDefault<z.ZodBoolean>;
    isTopDoctor: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    badge: string;
    country: string;
    rating: number;
    verified: boolean;
    hospital: string;
    image: string;
    designation: string;
    experience: string;
    experienceYears: number;
    city: string;
    reviewCount: number;
    bio: string;
    aboutBio: string;
    professionalBackground: {
        yearsOfWork: string;
        primaryClinic: string;
        basedIn: string;
        languages: string[];
    };
    innovations: string[];
    goodToKnow: {
        surgeriesCount: string;
        successRate: string;
        responseTime: string;
        accreditations: string[];
    };
    experiences: {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }[];
    educations: {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }[];
    procedures: {
        id: string;
        category: string;
        name: string;
        description: string;
        duration: string;
        indicativeCostUsd: string;
        usUkCostUsd: string;
        savingsPercent: number;
    }[];
    reviews: {
        id: string;
        date: string;
        author: string;
        treatment: string;
        source: "google" | "akeezo" | "hospital" | "verified_patient";
        country: string;
        rating: number;
        comment: string;
        verified: boolean;
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
    teleconsultationFeeUsd: string;
    isTopDoctor: boolean;
    href?: string | undefined;
    imageFallback?: string | undefined;
    hospitalAddress?: string | undefined;
}, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    badge: string;
    country: string;
    hospital: string;
    image: string;
    designation: string;
    experience: string;
    city: string;
    bio: string;
    aboutBio: string;
    professionalBackground: {
        yearsOfWork: string;
        primaryClinic: string;
        basedIn: string;
        languages?: string[] | undefined;
    };
    goodToKnow: {
        surgeriesCount?: string | undefined;
        successRate?: string | undefined;
        responseTime?: string | undefined;
        accreditations?: string[] | undefined;
    };
    rating?: number | undefined;
    verified?: boolean | undefined;
    href?: string | undefined;
    imageFallback?: string | undefined;
    experienceYears?: number | undefined;
    hospitalAddress?: string | undefined;
    reviewCount?: number | undefined;
    innovations?: string[] | undefined;
    experiences?: {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }[] | undefined;
    educations?: {
        title: string;
        institution: string;
        period: string;
        description?: string | undefined;
    }[] | undefined;
    procedures?: {
        id: string;
        name: string;
        description: string;
        category?: string | undefined;
        duration?: string | undefined;
        indicativeCostUsd?: string | undefined;
        usUkCostUsd?: string | undefined;
        savingsPercent?: number | undefined;
    }[] | undefined;
    reviews?: {
        id: string;
        date: string;
        author: string;
        treatment: string;
        comment: string;
        source?: "google" | "akeezo" | "hospital" | "verified_patient" | undefined;
        country?: string | undefined;
        rating?: number | undefined;
        verified?: boolean | undefined;
    }[] | undefined;
    faqs?: {
        question: string;
        answer: string;
    }[] | undefined;
    teleconsultationFeeUsd?: string | undefined;
    isTopDoctor?: boolean | undefined;
}>;
export type DoctorDetail = z.infer<typeof DoctorDetailSchema>;
export declare const DOCTOR_DETAILS_MAP: Record<string, DoctorDetail>;
export declare function buildFallbackDoctorDetail(doc: any): DoctorDetail;
export declare function getDoctorDetail(slug: string, fallbackDocs?: any[]): DoctorDetail | null;
//# sourceMappingURL=doctors.d.ts.map