import { z } from "zod";
import { PageKindEnum } from "./routes.js";
import { SeoMetadataSchema } from "./content.js";
import { SiteSettingsSchema, type SiteSettings } from "./settings.js";

export type SiteSettingsDTO = SiteSettings;

export const PublicRouteResponseSchema = z.object({
  pageKind: PageKindEnum,
  path: z.string(),
  locale: z.string().default("en"),
  seo: SeoMetadataSchema,
  payload: z.record(z.unknown()),
  revisionId: z.string().optional(),
  siteSettings: SiteSettingsSchema,
  statusCode: z.number().int().default(200)
});

export type PublicRouteResponseDTO = z.infer<typeof PublicRouteResponseSchema>;
