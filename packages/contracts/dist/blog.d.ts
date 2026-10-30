import { z } from "zod";
export declare const BlogCategoryEnum: z.ZodEnum<["Cardiology", "Orthopedics", "Oncology", "Neurology", "Organ Transplant", "Medical Travel Guide", "Patient Stories", "Wellness & Prevention", "Clinical Insights", "Healthcare Policy"]>;
export type BlogCategory = z.infer<typeof BlogCategoryEnum>;
export declare const BlogStatusEnum: z.ZodEnum<["draft", "review", "published", "archived"]>;
export type BlogStatus = z.infer<typeof BlogStatusEnum>;
export declare const SeoCheckSeveritySchema: z.ZodEnum<["error", "warning", "good"]>;
export type SeoCheckSeverity = z.infer<typeof SeoCheckSeveritySchema>;
export declare const SeoCheckItemSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    passed: z.ZodBoolean;
    severity: z.ZodEnum<["error", "warning", "good"]>;
    message: z.ZodString;
    suggestion: z.ZodOptional<z.ZodString>;
    value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
}, "strip", z.ZodTypeAny, {
    message: string;
    id: string;
    label: string;
    passed: boolean;
    severity: "error" | "warning" | "good";
    value?: string | number | undefined;
    suggestion?: string | undefined;
}, {
    message: string;
    id: string;
    label: string;
    passed: boolean;
    severity: "error" | "warning" | "good";
    value?: string | number | undefined;
    suggestion?: string | undefined;
}>;
export type SeoCheckItem = z.infer<typeof SeoCheckItemSchema>;
export declare const SeoAuditResultSchema: z.ZodObject<{
    score: z.ZodNumber;
    grade: z.ZodEnum<["poor", "fair", "good", "optimal"]>;
    focusKeyword: z.ZodString;
    wordCount: z.ZodNumber;
    readingTimeMinutes: z.ZodNumber;
    keywordDensity: z.ZodNumber;
    keywordOccurrences: z.ZodNumber;
    checks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        passed: z.ZodBoolean;
        severity: z.ZodEnum<["error", "warning", "good"]>;
        message: z.ZodString;
        suggestion: z.ZodOptional<z.ZodString>;
        value: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber]>>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        id: string;
        label: string;
        passed: boolean;
        severity: "error" | "warning" | "good";
        value?: string | number | undefined;
        suggestion?: string | undefined;
    }, {
        message: string;
        id: string;
        label: string;
        passed: boolean;
        severity: "error" | "warning" | "good";
        value?: string | number | undefined;
        suggestion?: string | undefined;
    }>, "many">;
    passedCount: z.ZodNumber;
    warningCount: z.ZodNumber;
    errorCount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    score: number;
    grade: "good" | "poor" | "fair" | "optimal";
    focusKeyword: string;
    wordCount: number;
    readingTimeMinutes: number;
    keywordDensity: number;
    keywordOccurrences: number;
    checks: {
        message: string;
        id: string;
        label: string;
        passed: boolean;
        severity: "error" | "warning" | "good";
        value?: string | number | undefined;
        suggestion?: string | undefined;
    }[];
    passedCount: number;
    warningCount: number;
    errorCount: number;
}, {
    score: number;
    grade: "good" | "poor" | "fair" | "optimal";
    focusKeyword: string;
    wordCount: number;
    readingTimeMinutes: number;
    keywordDensity: number;
    keywordOccurrences: number;
    checks: {
        message: string;
        id: string;
        label: string;
        passed: boolean;
        severity: "error" | "warning" | "good";
        value?: string | number | undefined;
        suggestion?: string | undefined;
    }[];
    passedCount: number;
    warningCount: number;
    errorCount: number;
}>;
export type SeoAuditResult = z.infer<typeof SeoAuditResultSchema>;
export declare const BlogPostSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    slug: z.ZodString;
    excerpt: z.ZodDefault<z.ZodString>;
    content: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["Cardiology", "Orthopedics", "Oncology", "Neurology", "Organ Transplant", "Medical Travel Guide", "Patient Stories", "Wellness & Prevention", "Clinical Insights", "Healthcare Policy"]>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    featuredImage: z.ZodDefault<z.ZodObject<{
        url: z.ZodDefault<z.ZodString>;
        alt: z.ZodDefault<z.ZodString>;
        caption: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        caption?: string | undefined;
    }, {
        url?: string | undefined;
        alt?: string | undefined;
        caption?: string | undefined;
    }>>;
    author: z.ZodDefault<z.ZodObject<{
        name: z.ZodDefault<z.ZodString>;
        role: z.ZodDefault<z.ZodString>;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        role: string;
        avatarUrl?: string | undefined;
    }, {
        name?: string | undefined;
        role?: string | undefined;
        avatarUrl?: string | undefined;
    }>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "review", "published", "archived"]>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    seo: z.ZodDefault<z.ZodObject<{
        focusKeyword: z.ZodDefault<z.ZodString>;
        seoTitle: z.ZodDefault<z.ZodString>;
        metaDescription: z.ZodDefault<z.ZodString>;
        canonicalUrl: z.ZodOptional<z.ZodString>;
        ogImage: z.ZodOptional<z.ZodString>;
        noIndex: z.ZodDefault<z.ZodBoolean>;
        seoScore: z.ZodDefault<z.ZodNumber>;
        schemaType: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        focusKeyword: string;
        seoTitle: string;
        metaDescription: string;
        noIndex: boolean;
        seoScore: number;
        schemaType: string;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
    }, {
        focusKeyword?: string | undefined;
        seoTitle?: string | undefined;
        metaDescription?: string | undefined;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
        noIndex?: boolean | undefined;
        seoScore?: number | undefined;
        schemaType?: string | undefined;
    }>>;
    estimatedReadTime: z.ZodDefault<z.ZodNumber>;
    medicalDisclaimerEnabled: z.ZodDefault<z.ZodBoolean>;
    viewsCount: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "review" | "published" | "archived";
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: "Cardiology" | "Orthopedics" | "Oncology" | "Neurology" | "Organ Transplant" | "Medical Travel Guide" | "Patient Stories" | "Wellness & Prevention" | "Clinical Insights" | "Healthcare Policy";
    tags: string[];
    featuredImage: {
        url: string;
        alt: string;
        caption?: string | undefined;
    };
    author: {
        name: string;
        role: string;
        avatarUrl?: string | undefined;
    };
    seo: {
        focusKeyword: string;
        seoTitle: string;
        metaDescription: string;
        noIndex: boolean;
        seoScore: number;
        schemaType: string;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
    };
    estimatedReadTime: number;
    medicalDisclaimerEnabled: boolean;
    viewsCount: number;
    _id?: string | undefined;
    publishedAt?: string | null | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    title: string;
    slug: string;
    content: string;
    status?: "draft" | "review" | "published" | "archived" | undefined;
    _id?: string | undefined;
    excerpt?: string | undefined;
    category?: "Cardiology" | "Orthopedics" | "Oncology" | "Neurology" | "Organ Transplant" | "Medical Travel Guide" | "Patient Stories" | "Wellness & Prevention" | "Clinical Insights" | "Healthcare Policy" | undefined;
    tags?: string[] | undefined;
    featuredImage?: {
        url?: string | undefined;
        alt?: string | undefined;
        caption?: string | undefined;
    } | undefined;
    author?: {
        name?: string | undefined;
        role?: string | undefined;
        avatarUrl?: string | undefined;
    } | undefined;
    publishedAt?: string | null | undefined;
    seo?: {
        focusKeyword?: string | undefined;
        seoTitle?: string | undefined;
        metaDescription?: string | undefined;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
        noIndex?: boolean | undefined;
        seoScore?: number | undefined;
        schemaType?: string | undefined;
    } | undefined;
    estimatedReadTime?: number | undefined;
    medicalDisclaimerEnabled?: boolean | undefined;
    viewsCount?: number | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}>;
export type BlogPost = z.infer<typeof BlogPostSchema>;
export declare const CreateBlogPostDTO: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    slug: z.ZodString;
    excerpt: z.ZodDefault<z.ZodString>;
    content: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["Cardiology", "Orthopedics", "Oncology", "Neurology", "Organ Transplant", "Medical Travel Guide", "Patient Stories", "Wellness & Prevention", "Clinical Insights", "Healthcare Policy"]>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    featuredImage: z.ZodDefault<z.ZodObject<{
        url: z.ZodDefault<z.ZodString>;
        alt: z.ZodDefault<z.ZodString>;
        caption: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        caption?: string | undefined;
    }, {
        url?: string | undefined;
        alt?: string | undefined;
        caption?: string | undefined;
    }>>;
    author: z.ZodDefault<z.ZodObject<{
        name: z.ZodDefault<z.ZodString>;
        role: z.ZodDefault<z.ZodString>;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        role: string;
        avatarUrl?: string | undefined;
    }, {
        name?: string | undefined;
        role?: string | undefined;
        avatarUrl?: string | undefined;
    }>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "review", "published", "archived"]>>;
    publishedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    seo: z.ZodDefault<z.ZodObject<{
        focusKeyword: z.ZodDefault<z.ZodString>;
        seoTitle: z.ZodDefault<z.ZodString>;
        metaDescription: z.ZodDefault<z.ZodString>;
        canonicalUrl: z.ZodOptional<z.ZodString>;
        ogImage: z.ZodOptional<z.ZodString>;
        noIndex: z.ZodDefault<z.ZodBoolean>;
        seoScore: z.ZodDefault<z.ZodNumber>;
        schemaType: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        focusKeyword: string;
        seoTitle: string;
        metaDescription: string;
        noIndex: boolean;
        seoScore: number;
        schemaType: string;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
    }, {
        focusKeyword?: string | undefined;
        seoTitle?: string | undefined;
        metaDescription?: string | undefined;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
        noIndex?: boolean | undefined;
        seoScore?: number | undefined;
        schemaType?: string | undefined;
    }>>;
    estimatedReadTime: z.ZodDefault<z.ZodNumber>;
    medicalDisclaimerEnabled: z.ZodDefault<z.ZodBoolean>;
    viewsCount: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "_id" | "viewsCount" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    status: "draft" | "review" | "published" | "archived";
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: "Cardiology" | "Orthopedics" | "Oncology" | "Neurology" | "Organ Transplant" | "Medical Travel Guide" | "Patient Stories" | "Wellness & Prevention" | "Clinical Insights" | "Healthcare Policy";
    tags: string[];
    featuredImage: {
        url: string;
        alt: string;
        caption?: string | undefined;
    };
    author: {
        name: string;
        role: string;
        avatarUrl?: string | undefined;
    };
    seo: {
        focusKeyword: string;
        seoTitle: string;
        metaDescription: string;
        noIndex: boolean;
        seoScore: number;
        schemaType: string;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
    };
    estimatedReadTime: number;
    medicalDisclaimerEnabled: boolean;
    publishedAt?: string | null | undefined;
}, {
    title: string;
    slug: string;
    content: string;
    status?: "draft" | "review" | "published" | "archived" | undefined;
    excerpt?: string | undefined;
    category?: "Cardiology" | "Orthopedics" | "Oncology" | "Neurology" | "Organ Transplant" | "Medical Travel Guide" | "Patient Stories" | "Wellness & Prevention" | "Clinical Insights" | "Healthcare Policy" | undefined;
    tags?: string[] | undefined;
    featuredImage?: {
        url?: string | undefined;
        alt?: string | undefined;
        caption?: string | undefined;
    } | undefined;
    author?: {
        name?: string | undefined;
        role?: string | undefined;
        avatarUrl?: string | undefined;
    } | undefined;
    publishedAt?: string | null | undefined;
    seo?: {
        focusKeyword?: string | undefined;
        seoTitle?: string | undefined;
        metaDescription?: string | undefined;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
        noIndex?: boolean | undefined;
        seoScore?: number | undefined;
        schemaType?: string | undefined;
    } | undefined;
    estimatedReadTime?: number | undefined;
    medicalDisclaimerEnabled?: boolean | undefined;
}>;
export type CreateBlogPostDTO = z.infer<typeof CreateBlogPostDTO>;
export declare const UpdateBlogPostDTO: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["draft", "review", "published", "archived"]>>>;
    title: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    content: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodDefault<z.ZodEnum<["Cardiology", "Orthopedics", "Oncology", "Neurology", "Organ Transplant", "Medical Travel Guide", "Patient Stories", "Wellness & Prevention", "Clinical Insights", "Healthcare Policy"]>>>;
    tags: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    featuredImage: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        url: z.ZodDefault<z.ZodString>;
        alt: z.ZodDefault<z.ZodString>;
        caption: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        alt: string;
        caption?: string | undefined;
    }, {
        url?: string | undefined;
        alt?: string | undefined;
        caption?: string | undefined;
    }>>>;
    author: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        name: z.ZodDefault<z.ZodString>;
        role: z.ZodDefault<z.ZodString>;
        avatarUrl: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        role: string;
        avatarUrl?: string | undefined;
    }, {
        name?: string | undefined;
        role?: string | undefined;
        avatarUrl?: string | undefined;
    }>>>;
    publishedAt: z.ZodOptional<z.ZodOptional<z.ZodNullable<z.ZodString>>>;
    seo: z.ZodOptional<z.ZodDefault<z.ZodObject<{
        focusKeyword: z.ZodDefault<z.ZodString>;
        seoTitle: z.ZodDefault<z.ZodString>;
        metaDescription: z.ZodDefault<z.ZodString>;
        canonicalUrl: z.ZodOptional<z.ZodString>;
        ogImage: z.ZodOptional<z.ZodString>;
        noIndex: z.ZodDefault<z.ZodBoolean>;
        seoScore: z.ZodDefault<z.ZodNumber>;
        schemaType: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        focusKeyword: string;
        seoTitle: string;
        metaDescription: string;
        noIndex: boolean;
        seoScore: number;
        schemaType: string;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
    }, {
        focusKeyword?: string | undefined;
        seoTitle?: string | undefined;
        metaDescription?: string | undefined;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
        noIndex?: boolean | undefined;
        seoScore?: number | undefined;
        schemaType?: string | undefined;
    }>>>;
    estimatedReadTime: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    medicalDisclaimerEnabled: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "review" | "published" | "archived" | undefined;
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    category?: "Cardiology" | "Orthopedics" | "Oncology" | "Neurology" | "Organ Transplant" | "Medical Travel Guide" | "Patient Stories" | "Wellness & Prevention" | "Clinical Insights" | "Healthcare Policy" | undefined;
    tags?: string[] | undefined;
    featuredImage?: {
        url: string;
        alt: string;
        caption?: string | undefined;
    } | undefined;
    author?: {
        name: string;
        role: string;
        avatarUrl?: string | undefined;
    } | undefined;
    publishedAt?: string | null | undefined;
    seo?: {
        focusKeyword: string;
        seoTitle: string;
        metaDescription: string;
        noIndex: boolean;
        seoScore: number;
        schemaType: string;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
    } | undefined;
    estimatedReadTime?: number | undefined;
    medicalDisclaimerEnabled?: boolean | undefined;
}, {
    status?: "draft" | "review" | "published" | "archived" | undefined;
    title?: string | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    content?: string | undefined;
    category?: "Cardiology" | "Orthopedics" | "Oncology" | "Neurology" | "Organ Transplant" | "Medical Travel Guide" | "Patient Stories" | "Wellness & Prevention" | "Clinical Insights" | "Healthcare Policy" | undefined;
    tags?: string[] | undefined;
    featuredImage?: {
        url?: string | undefined;
        alt?: string | undefined;
        caption?: string | undefined;
    } | undefined;
    author?: {
        name?: string | undefined;
        role?: string | undefined;
        avatarUrl?: string | undefined;
    } | undefined;
    publishedAt?: string | null | undefined;
    seo?: {
        focusKeyword?: string | undefined;
        seoTitle?: string | undefined;
        metaDescription?: string | undefined;
        canonicalUrl?: string | undefined;
        ogImage?: string | undefined;
        noIndex?: boolean | undefined;
        seoScore?: number | undefined;
        schemaType?: string | undefined;
    } | undefined;
    estimatedReadTime?: number | undefined;
    medicalDisclaimerEnabled?: boolean | undefined;
}>;
export type UpdateBlogPostDTO = z.infer<typeof UpdateBlogPostDTO>;
/**
 * Intelligent Real-Time SEO Content Score & Tracker Engine
 * Computes a weighted 0-100 score based on 13 critical on-page SEO signals.
 */
export declare function calculateSeoContentScore(input: {
    title: string;
    slug: string;
    content: string;
    focusKeyword: string;
    seoTitle?: string;
    metaDescription?: string;
    featuredImageAlt?: string;
}): SeoAuditResult;
//# sourceMappingURL=blog.d.ts.map