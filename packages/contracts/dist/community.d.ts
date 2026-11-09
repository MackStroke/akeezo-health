import { z } from "zod";
export declare const CommunityCategoryEnum: z.ZodEnum<["All Topics", "Cosmetic & Plastic Surgery", "IVF & Fertility Treatment", "Hair Transplant", "Dental Care", "Orthopedics & Spine", "Bariatric & Weight Loss", "Cardiac & Oncology", "Travel, Visa & Logistics"]>;
export type CommunityCategory = z.infer<typeof CommunityCategoryEnum>;
export declare const CommunityAuthorSchema: z.ZodObject<{
    name: z.ZodString;
    country: z.ZodDefault<z.ZodString>;
    countryCode: z.ZodDefault<z.ZodString>;
    avatar: z.ZodDefault<z.ZodString>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
    isVerifiedPatient: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name: string;
    country: string;
    countryCode: string;
    avatar: string;
    isAnonymous: boolean;
    isVerifiedPatient: boolean;
}, {
    name: string;
    country?: string | undefined;
    countryCode?: string | undefined;
    avatar?: string | undefined;
    isAnonymous?: boolean | undefined;
    isVerifiedPatient?: boolean | undefined;
}>;
export type CommunityAuthor = z.infer<typeof CommunityAuthorSchema>;
export declare const CommunityReplySchema: z.ZodObject<{
    id: z.ZodString;
    threadId: z.ZodString;
    author: z.ZodObject<{
        name: z.ZodString;
        role: z.ZodDefault<z.ZodEnum<["patient", "doctor", "care_coordinator", "admin"]>>;
        doctorId: z.ZodOptional<z.ZodString>;
        specialty: z.ZodOptional<z.ZodString>;
        hospitalName: z.ZodOptional<z.ZodString>;
        avatar: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        role: "patient" | "doctor" | "care_coordinator" | "admin";
        avatar: string;
        specialty?: string | undefined;
        doctorId?: string | undefined;
        hospitalName?: string | undefined;
    }, {
        name: string;
        role?: "patient" | "doctor" | "care_coordinator" | "admin" | undefined;
        specialty?: string | undefined;
        avatar?: string | undefined;
        doctorId?: string | undefined;
        hospitalName?: string | undefined;
    }>;
    content: z.ZodString;
    upvotes: z.ZodDefault<z.ZodNumber>;
    isVerifiedDoctorResponse: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    content: string;
    author: {
        name: string;
        role: "patient" | "doctor" | "care_coordinator" | "admin";
        avatar: string;
        specialty?: string | undefined;
        doctorId?: string | undefined;
        hospitalName?: string | undefined;
    };
    createdAt: string;
    threadId: string;
    upvotes: number;
    isVerifiedDoctorResponse: boolean;
}, {
    id: string;
    content: string;
    author: {
        name: string;
        role?: "patient" | "doctor" | "care_coordinator" | "admin" | undefined;
        specialty?: string | undefined;
        avatar?: string | undefined;
        doctorId?: string | undefined;
        hospitalName?: string | undefined;
    };
    createdAt: string;
    threadId: string;
    upvotes?: number | undefined;
    isVerifiedDoctorResponse?: boolean | undefined;
}>;
export type CommunityReply = z.infer<typeof CommunityReplySchema>;
export declare const CommunityStoryDetailsSchema: z.ZodObject<{
    hospitalName: z.ZodString;
    procedure: z.ZodString;
    costUsd: z.ZodString;
    recoveryDays: z.ZodNumber;
    rating: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    procedure: string;
    hospitalName: string;
    costUsd: string;
    recoveryDays: number;
    rating: number;
}, {
    procedure: string;
    hospitalName: string;
    costUsd: string;
    recoveryDays: number;
    rating?: number | undefined;
}>;
export type CommunityStoryDetails = z.infer<typeof CommunityStoryDetailsSchema>;
export declare const DoctorAnswerPreviewSchema: z.ZodObject<{
    doctorId: z.ZodOptional<z.ZodString>;
    doctorName: z.ZodString;
    doctorSpecialty: z.ZodString;
    hospitalName: z.ZodString;
    doctorImage: z.ZodDefault<z.ZodString>;
    answerSnippet: z.ZodString;
}, "strip", z.ZodTypeAny, {
    hospitalName: string;
    doctorName: string;
    doctorSpecialty: string;
    doctorImage: string;
    answerSnippet: string;
    doctorId?: string | undefined;
}, {
    hospitalName: string;
    doctorName: string;
    doctorSpecialty: string;
    answerSnippet: string;
    doctorId?: string | undefined;
    doctorImage?: string | undefined;
}>;
export type DoctorAnswerPreview = z.infer<typeof DoctorAnswerPreviewSchema>;
export declare const CommunityThreadSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    slug: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    author: z.ZodObject<{
        name: z.ZodString;
        country: z.ZodDefault<z.ZodString>;
        countryCode: z.ZodDefault<z.ZodString>;
        avatar: z.ZodDefault<z.ZodString>;
        isAnonymous: z.ZodDefault<z.ZodBoolean>;
        isVerifiedPatient: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        country: string;
        countryCode: string;
        avatar: string;
        isAnonymous: boolean;
        isVerifiedPatient: boolean;
    }, {
        name: string;
        country?: string | undefined;
        countryCode?: string | undefined;
        avatar?: string | undefined;
        isAnonymous?: boolean | undefined;
        isVerifiedPatient?: boolean | undefined;
    }>;
    content: z.ZodString;
    isStory: z.ZodDefault<z.ZodBoolean>;
    storyDetails: z.ZodOptional<z.ZodObject<{
        hospitalName: z.ZodString;
        procedure: z.ZodString;
        costUsd: z.ZodString;
        recoveryDays: z.ZodNumber;
        rating: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating: number;
    }, {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating?: number | undefined;
    }>>;
    upvotes: z.ZodDefault<z.ZodNumber>;
    viewsCount: z.ZodDefault<z.ZodNumber>;
    repliesCount: z.ZodDefault<z.ZodNumber>;
    isDoctorAnswered: z.ZodDefault<z.ZodBoolean>;
    doctorAnswerPreview: z.ZodOptional<z.ZodObject<{
        doctorId: z.ZodOptional<z.ZodString>;
        doctorName: z.ZodString;
        doctorSpecialty: z.ZodString;
        hospitalName: z.ZodString;
        doctorImage: z.ZodDefault<z.ZodString>;
        answerSnippet: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        hospitalName: string;
        doctorName: string;
        doctorSpecialty: string;
        doctorImage: string;
        answerSnippet: string;
        doctorId?: string | undefined;
    }, {
        hospitalName: string;
        doctorName: string;
        doctorSpecialty: string;
        answerSnippet: string;
        doctorId?: string | undefined;
        doctorImage?: string | undefined;
    }>>;
    isPinned: z.ZodDefault<z.ZodBoolean>;
    status: z.ZodDefault<z.ZodEnum<["published", "pending_review", "hidden"]>>;
    createdAt: z.ZodString;
    replies: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        threadId: z.ZodString;
        author: z.ZodObject<{
            name: z.ZodString;
            role: z.ZodDefault<z.ZodEnum<["patient", "doctor", "care_coordinator", "admin"]>>;
            doctorId: z.ZodOptional<z.ZodString>;
            specialty: z.ZodOptional<z.ZodString>;
            hospitalName: z.ZodOptional<z.ZodString>;
            avatar: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            name: string;
            role: "patient" | "doctor" | "care_coordinator" | "admin";
            avatar: string;
            specialty?: string | undefined;
            doctorId?: string | undefined;
            hospitalName?: string | undefined;
        }, {
            name: string;
            role?: "patient" | "doctor" | "care_coordinator" | "admin" | undefined;
            specialty?: string | undefined;
            avatar?: string | undefined;
            doctorId?: string | undefined;
            hospitalName?: string | undefined;
        }>;
        content: z.ZodString;
        upvotes: z.ZodDefault<z.ZodNumber>;
        isVerifiedDoctorResponse: z.ZodDefault<z.ZodBoolean>;
        createdAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        id: string;
        content: string;
        author: {
            name: string;
            role: "patient" | "doctor" | "care_coordinator" | "admin";
            avatar: string;
            specialty?: string | undefined;
            doctorId?: string | undefined;
            hospitalName?: string | undefined;
        };
        createdAt: string;
        threadId: string;
        upvotes: number;
        isVerifiedDoctorResponse: boolean;
    }, {
        id: string;
        content: string;
        author: {
            name: string;
            role?: "patient" | "doctor" | "care_coordinator" | "admin" | undefined;
            specialty?: string | undefined;
            avatar?: string | undefined;
            doctorId?: string | undefined;
            hospitalName?: string | undefined;
        };
        createdAt: string;
        threadId: string;
        upvotes?: number | undefined;
        isVerifiedDoctorResponse?: boolean | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    status: "published" | "pending_review" | "hidden";
    id: string;
    title: string;
    slug: string;
    content: string;
    category: string;
    tags: string[];
    author: {
        name: string;
        country: string;
        countryCode: string;
        avatar: string;
        isAnonymous: boolean;
        isVerifiedPatient: boolean;
    };
    viewsCount: number;
    createdAt: string;
    upvotes: number;
    isStory: boolean;
    repliesCount: number;
    isDoctorAnswered: boolean;
    isPinned: boolean;
    replies: {
        id: string;
        content: string;
        author: {
            name: string;
            role: "patient" | "doctor" | "care_coordinator" | "admin";
            avatar: string;
            specialty?: string | undefined;
            doctorId?: string | undefined;
            hospitalName?: string | undefined;
        };
        createdAt: string;
        threadId: string;
        upvotes: number;
        isVerifiedDoctorResponse: boolean;
    }[];
    storyDetails?: {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating: number;
    } | undefined;
    doctorAnswerPreview?: {
        hospitalName: string;
        doctorName: string;
        doctorSpecialty: string;
        doctorImage: string;
        answerSnippet: string;
        doctorId?: string | undefined;
    } | undefined;
}, {
    id: string;
    title: string;
    slug: string;
    content: string;
    author: {
        name: string;
        country?: string | undefined;
        countryCode?: string | undefined;
        avatar?: string | undefined;
        isAnonymous?: boolean | undefined;
        isVerifiedPatient?: boolean | undefined;
    };
    createdAt: string;
    status?: "published" | "pending_review" | "hidden" | undefined;
    category?: string | undefined;
    tags?: string[] | undefined;
    viewsCount?: number | undefined;
    upvotes?: number | undefined;
    isStory?: boolean | undefined;
    storyDetails?: {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating?: number | undefined;
    } | undefined;
    repliesCount?: number | undefined;
    isDoctorAnswered?: boolean | undefined;
    doctorAnswerPreview?: {
        hospitalName: string;
        doctorName: string;
        doctorSpecialty: string;
        answerSnippet: string;
        doctorId?: string | undefined;
        doctorImage?: string | undefined;
    } | undefined;
    isPinned?: boolean | undefined;
    replies?: {
        id: string;
        content: string;
        author: {
            name: string;
            role?: "patient" | "doctor" | "care_coordinator" | "admin" | undefined;
            specialty?: string | undefined;
            avatar?: string | undefined;
            doctorId?: string | undefined;
            hospitalName?: string | undefined;
        };
        createdAt: string;
        threadId: string;
        upvotes?: number | undefined;
        isVerifiedDoctorResponse?: boolean | undefined;
    }[] | undefined;
}>;
export type CommunityThread = z.infer<typeof CommunityThreadSchema>;
export declare const CreateCommunityThreadInputSchema: z.ZodObject<{
    title: z.ZodString;
    category: z.ZodString;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    content: z.ZodString;
    authorName: z.ZodDefault<z.ZodString>;
    authorCountry: z.ZodDefault<z.ZodString>;
    authorCountryCode: z.ZodDefault<z.ZodString>;
    isAnonymous: z.ZodDefault<z.ZodBoolean>;
    isStory: z.ZodDefault<z.ZodBoolean>;
    storyDetails: z.ZodOptional<z.ZodObject<{
        hospitalName: z.ZodString;
        procedure: z.ZodString;
        costUsd: z.ZodString;
        recoveryDays: z.ZodNumber;
        rating: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating: number;
    }, {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating?: number | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
    category: string;
    tags: string[];
    authorName: string;
    isAnonymous: boolean;
    isStory: boolean;
    authorCountry: string;
    authorCountryCode: string;
    storyDetails?: {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating: number;
    } | undefined;
}, {
    title: string;
    content: string;
    category: string;
    tags?: string[] | undefined;
    authorName?: string | undefined;
    isAnonymous?: boolean | undefined;
    isStory?: boolean | undefined;
    storyDetails?: {
        procedure: string;
        hospitalName: string;
        costUsd: string;
        recoveryDays: number;
        rating?: number | undefined;
    } | undefined;
    authorCountry?: string | undefined;
    authorCountryCode?: string | undefined;
}>;
export type CreateCommunityThreadInput = z.infer<typeof CreateCommunityThreadInputSchema>;
export declare const CreateCommunityReplyInputSchema: z.ZodObject<{
    threadId: z.ZodString;
    authorName: z.ZodDefault<z.ZodString>;
    authorRole: z.ZodDefault<z.ZodEnum<["patient", "doctor", "care_coordinator", "admin"]>>;
    doctorId: z.ZodOptional<z.ZodString>;
    specialty: z.ZodOptional<z.ZodString>;
    hospitalName: z.ZodOptional<z.ZodString>;
    content: z.ZodString;
    isVerifiedDoctorResponse: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    content: string;
    authorName: string;
    threadId: string;
    isVerifiedDoctorResponse: boolean;
    authorRole: "patient" | "doctor" | "care_coordinator" | "admin";
    specialty?: string | undefined;
    doctorId?: string | undefined;
    hospitalName?: string | undefined;
}, {
    content: string;
    threadId: string;
    specialty?: string | undefined;
    authorName?: string | undefined;
    doctorId?: string | undefined;
    hospitalName?: string | undefined;
    isVerifiedDoctorResponse?: boolean | undefined;
    authorRole?: "patient" | "doctor" | "care_coordinator" | "admin" | undefined;
}>;
export type CreateCommunityReplyInput = z.infer<typeof CreateCommunityReplyInputSchema>;
export declare const CURATED_COMMUNITY_THREADS: CommunityThread[];
export declare function getCommunityThreadBySlug(slug: string, fallbackThreads?: CommunityThread[]): CommunityThread | null;
//# sourceMappingURL=community.d.ts.map