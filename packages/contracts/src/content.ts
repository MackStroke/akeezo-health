import { z } from "zod";

export const SeoMetadataSchema = z.object({
  title: z.string().max(120),
  description: z.string().max(300),
  canonicalPath: z.string(),
  ogMediaId: z.string().nullable().optional(),
  robots: z.string().default("index, follow"),
  schemaKind: z.string().default("WebPage")
});

export type SeoMetadata = z.infer<typeof SeoMetadataSchema>;

export const ContentSectionSchema = z.object({
  id: z.string(),
  type: z.string(),
  variant: z.string().default("default"),
  enabled: z.boolean().default(true),
  order: z.number().int().default(0),
  data: z.record(z.unknown()).default({})
});

export type ContentSection = z.infer<typeof ContentSectionSchema>;

export const ContentRevisionSchema = z.object({
  _id: z.string().optional(),
  entityType: z.string(),
  entityId: z.string(),
  locale: z.string().default("en"),
  revisionNumber: z.number().int().min(1),
  schemaVersion: z.number().int().default(1),
  payload: z.record(z.unknown()),
  seo: SeoMetadataSchema,
  sourceReferences: z.array(z.string()).default([]),
  reviewedBy: z.string().nullable().optional(),
  reviewedAt: z.string().nullable().optional(),
  createdBy: z.string().default("system"),
  createdAt: z.string()
});

export type ContentRevision = z.infer<typeof ContentRevisionSchema>;

export const PagePayloadSchema = z.object({
  templateKey: z.string(),
  title: z.string(),
  subtitle: z.string().optional(),
  sections: z.array(ContentSectionSchema).default([])
});

export type PagePayload = z.infer<typeof PagePayloadSchema>;
