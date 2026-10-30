import { z } from "zod";
export declare const SeoMetadataSchema: z.ZodObject<{
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
}>;
export type SeoMetadata = z.infer<typeof SeoMetadataSchema>;
export declare const ContentSectionSchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodString;
    variant: z.ZodDefault<z.ZodString>;
    enabled: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
    data: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, "strip", z.ZodTypeAny, {
    type: string;
    id: string;
    variant: string;
    enabled: boolean;
    order: number;
    data: Record<string, unknown>;
}, {
    type: string;
    id: string;
    variant?: string | undefined;
    enabled?: boolean | undefined;
    order?: number | undefined;
    data?: Record<string, unknown> | undefined;
}>;
export type ContentSection = z.infer<typeof ContentSectionSchema>;
export declare const ContentRevisionSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    entityType: z.ZodString;
    entityId: z.ZodString;
    locale: z.ZodDefault<z.ZodString>;
    revisionNumber: z.ZodNumber;
    schemaVersion: z.ZodDefault<z.ZodNumber>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    seo: z.ZodObject<{
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
    }>;
    sourceReferences: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    reviewedBy: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    reviewedAt: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    createdBy: z.ZodDefault<z.ZodString>;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    seo: {
        title: string;
        description: string;
        canonicalPath: string;
        robots: string;
        schemaKind: string;
        ogMediaId?: string | null | undefined;
    };
    createdAt: string;
    entityType: string;
    entityId: string;
    locale: string;
    revisionNumber: number;
    schemaVersion: number;
    payload: Record<string, unknown>;
    sourceReferences: string[];
    createdBy: string;
    _id?: string | undefined;
    reviewedBy?: string | null | undefined;
    reviewedAt?: string | null | undefined;
}, {
    seo: {
        title: string;
        description: string;
        canonicalPath: string;
        ogMediaId?: string | null | undefined;
        robots?: string | undefined;
        schemaKind?: string | undefined;
    };
    createdAt: string;
    entityType: string;
    entityId: string;
    revisionNumber: number;
    payload: Record<string, unknown>;
    _id?: string | undefined;
    locale?: string | undefined;
    schemaVersion?: number | undefined;
    sourceReferences?: string[] | undefined;
    reviewedBy?: string | null | undefined;
    reviewedAt?: string | null | undefined;
    createdBy?: string | undefined;
}>;
export type ContentRevision = z.infer<typeof ContentRevisionSchema>;
export declare const PagePayloadSchema: z.ZodObject<{
    templateKey: z.ZodString;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    sections: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
        variant: z.ZodDefault<z.ZodString>;
        enabled: z.ZodDefault<z.ZodBoolean>;
        order: z.ZodDefault<z.ZodNumber>;
        data: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
        variant: string;
        enabled: boolean;
        order: number;
        data: Record<string, unknown>;
    }, {
        type: string;
        id: string;
        variant?: string | undefined;
        enabled?: boolean | undefined;
        order?: number | undefined;
        data?: Record<string, unknown> | undefined;
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    title: string;
    templateKey: string;
    sections: {
        type: string;
        id: string;
        variant: string;
        enabled: boolean;
        order: number;
        data: Record<string, unknown>;
    }[];
    subtitle?: string | undefined;
}, {
    title: string;
    templateKey: string;
    subtitle?: string | undefined;
    sections?: {
        type: string;
        id: string;
        variant?: string | undefined;
        enabled?: boolean | undefined;
        order?: number | undefined;
        data?: Record<string, unknown> | undefined;
    }[] | undefined;
}>;
export type PagePayload = z.infer<typeof PagePayloadSchema>;
//# sourceMappingURL=content.d.ts.map