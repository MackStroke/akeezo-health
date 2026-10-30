import { z } from "zod";
export declare const ChangelogCategorySchema: z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>;
export type ChangelogCategory = z.infer<typeof ChangelogCategorySchema>;
export declare const ChangelogStatusSchema: z.ZodEnum<["draft", "published", "archived"]>;
export type ChangelogStatus = z.infer<typeof ChangelogStatusSchema>;
export declare const ChangelogAudienceSchema: z.ZodEnum<["all", "public", "internal", "partners"]>;
export type ChangelogAudience = z.infer<typeof ChangelogAudienceSchema>;
export declare const ChangelogItemSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    type: z.ZodDefault<z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>>;
    text: z.ZodString;
    badge: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
    text: string;
    id?: string | undefined;
    badge?: string | undefined;
}, {
    text: string;
    type?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
    id?: string | undefined;
    badge?: string | undefined;
}>;
export type ChangelogItem = z.infer<typeof ChangelogItemSchema>;
export declare const ChangelogEntrySchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    title: z.ZodString;
    summary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    releaseDate: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "published", "archived"]>>;
    audience: z.ZodDefault<z.ZodEnum<["all", "public", "internal", "partners"]>>;
    items: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>>;
        text: z.ZodString;
        badge: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
        text: string;
        id?: string | undefined;
        badge?: string | undefined;
    }, {
        text: string;
        type?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
        id?: string | undefined;
        badge?: string | undefined;
    }>, "many">>;
    modules: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    authorName: z.ZodDefault<z.ZodString>;
    authorId: z.ZodOptional<z.ZodString>;
    notes: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "published" | "archived";
    title: string;
    category: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
    notes: string;
    version: string;
    summary: string;
    releaseDate: string;
    audience: "internal" | "all" | "public" | "partners";
    items: {
        type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
        text: string;
        id?: string | undefined;
        badge?: string | undefined;
    }[];
    modules: string[];
    authorName: string;
    _id?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    authorId?: string | undefined;
}, {
    title: string;
    version: string;
    releaseDate: string;
    status?: "draft" | "published" | "archived" | undefined;
    _id?: string | undefined;
    category?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    notes?: string | undefined;
    summary?: string | undefined;
    audience?: "internal" | "all" | "public" | "partners" | undefined;
    items?: {
        text: string;
        type?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
        id?: string | undefined;
        badge?: string | undefined;
    }[] | undefined;
    modules?: string[] | undefined;
    authorName?: string | undefined;
    authorId?: string | undefined;
}>;
export type ChangelogEntry = z.infer<typeof ChangelogEntrySchema>;
export declare const CreateChangelogDTO: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodString>;
    version: z.ZodString;
    title: z.ZodString;
    summary: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    releaseDate: z.ZodString;
    category: z.ZodDefault<z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>>;
    status: z.ZodDefault<z.ZodEnum<["draft", "published", "archived"]>>;
    audience: z.ZodDefault<z.ZodEnum<["all", "public", "internal", "partners"]>>;
    items: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>>;
        text: z.ZodString;
        badge: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
        text: string;
        id?: string | undefined;
        badge?: string | undefined;
    }, {
        text: string;
        type?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
        id?: string | undefined;
        badge?: string | undefined;
    }>, "many">>;
    modules: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    authorName: z.ZodDefault<z.ZodString>;
    authorId: z.ZodOptional<z.ZodString>;
    notes: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "_id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    status: "draft" | "published" | "archived";
    title: string;
    category: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
    notes: string;
    version: string;
    summary: string;
    releaseDate: string;
    audience: "internal" | "all" | "public" | "partners";
    items: {
        type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
        text: string;
        id?: string | undefined;
        badge?: string | undefined;
    }[];
    modules: string[];
    authorName: string;
    authorId?: string | undefined;
}, {
    title: string;
    version: string;
    releaseDate: string;
    status?: "draft" | "published" | "archived" | undefined;
    category?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
    notes?: string | undefined;
    summary?: string | undefined;
    audience?: "internal" | "all" | "public" | "partners" | undefined;
    items?: {
        text: string;
        type?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
        id?: string | undefined;
        badge?: string | undefined;
    }[] | undefined;
    modules?: string[] | undefined;
    authorName?: string | undefined;
    authorId?: string | undefined;
}>;
export type CreateChangelogInput = z.infer<typeof CreateChangelogDTO>;
export declare const UpdateChangelogDTO: z.ZodObject<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["draft", "published", "archived"]>>>;
    title: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodDefault<z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>>>;
    notes: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    version: z.ZodOptional<z.ZodString>;
    summary: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodString>>>;
    releaseDate: z.ZodOptional<z.ZodString>;
    audience: z.ZodOptional<z.ZodDefault<z.ZodEnum<["all", "public", "internal", "partners"]>>>;
    items: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        type: z.ZodDefault<z.ZodEnum<["feature", "improvement", "fix", "security", "maintenance", "breaking"]>>;
        text: z.ZodString;
        badge: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
        text: string;
        id?: string | undefined;
        badge?: string | undefined;
    }, {
        text: string;
        type?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
        id?: string | undefined;
        badge?: string | undefined;
    }>, "many">>>;
    modules: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
    authorName: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    authorId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | "archived" | undefined;
    title?: string | undefined;
    category?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
    notes?: string | undefined;
    version?: string | undefined;
    summary?: string | undefined;
    releaseDate?: string | undefined;
    audience?: "internal" | "all" | "public" | "partners" | undefined;
    items?: {
        type: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking";
        text: string;
        id?: string | undefined;
        badge?: string | undefined;
    }[] | undefined;
    modules?: string[] | undefined;
    authorName?: string | undefined;
    authorId?: string | undefined;
}, {
    status?: "draft" | "published" | "archived" | undefined;
    title?: string | undefined;
    category?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
    notes?: string | undefined;
    version?: string | undefined;
    summary?: string | undefined;
    releaseDate?: string | undefined;
    audience?: "internal" | "all" | "public" | "partners" | undefined;
    items?: {
        text: string;
        type?: "feature" | "improvement" | "fix" | "security" | "maintenance" | "breaking" | undefined;
        id?: string | undefined;
        badge?: string | undefined;
    }[] | undefined;
    modules?: string[] | undefined;
    authorName?: string | undefined;
    authorId?: string | undefined;
}>;
export type UpdateChangelogInput = z.infer<typeof UpdateChangelogDTO>;
//# sourceMappingURL=changelog.d.ts.map