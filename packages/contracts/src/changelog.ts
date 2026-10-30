import { z } from "zod";

export const ChangelogCategorySchema = z.enum([
  "feature",
  "improvement",
  "fix",
  "security",
  "maintenance",
  "breaking",
]);
export type ChangelogCategory = z.infer<typeof ChangelogCategorySchema>;

export const ChangelogStatusSchema = z.enum(["draft", "published", "archived"]);
export type ChangelogStatus = z.infer<typeof ChangelogStatusSchema>;

export const ChangelogAudienceSchema = z.enum(["all", "public", "internal", "partners"]);
export type ChangelogAudience = z.infer<typeof ChangelogAudienceSchema>;

export const ChangelogItemSchema = z.object({
  id: z.string().optional(),
  type: ChangelogCategorySchema.default("improvement"),
  text: z.string().min(1, "Item description is required"),
  badge: z.string().optional(),
});
export type ChangelogItem = z.infer<typeof ChangelogItemSchema>;

export const ChangelogEntrySchema = z.object({
  _id: z.string().optional(),
  version: z.string().min(1, "Version is required"),
  title: z.string().min(1, "Title is required"),
  summary: z.string().optional().default(""),
  releaseDate: z.string(),
  category: ChangelogCategorySchema.default("feature"),
  status: ChangelogStatusSchema.default("published"),
  audience: ChangelogAudienceSchema.default("all"),
  items: z.array(ChangelogItemSchema).default([]),
  modules: z.array(z.string()).default([]),
  authorName: z.string().default("Akeezo Engineering"),
  authorId: z.string().optional(),
  notes: z.string().optional().default(""),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type ChangelogEntry = z.infer<typeof ChangelogEntrySchema>;

export const CreateChangelogDTO = ChangelogEntrySchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
});
export type CreateChangelogInput = z.infer<typeof CreateChangelogDTO>;

export const UpdateChangelogDTO = CreateChangelogDTO.partial();
export type UpdateChangelogInput = z.infer<typeof UpdateChangelogDTO>;
