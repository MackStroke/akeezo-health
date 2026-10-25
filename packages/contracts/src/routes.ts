import { z } from "zod";

export const PageKindEnum = z.enum([
  "home",
  "treatmentDirectory",
  "treatmentDetail",
  "procedureDetail",
  "hospitalDirectory",
  "hospitalDetail",
  "doctorDirectory",
  "doctorDetail",
  "destinationDirectory",
  "destinationDetail",
  "cityDetail",
  "calculatorLanding",
  "calculatorWizard",
  "calculatorResult",
  "journeyPlanner",
  "blogDirectory",
  "article",
  "contributorProfile",
  "about",
  "missionVision",
  "partnerLanding",
  "partnerComparison",
  "partnerApplication",
  "contact",
  "faq",
  "helpCentre",
  "legal",
  "specializedGuide",
  "serviceDetail",
  "medicineEnquiry",
  "notFound",
  "serverError"
]);

export type PageKind = z.infer<typeof PageKindEnum>;

export const RouteEntrySchema = z.object({
  locale: z.string().default("en"),
  path: z.string(),
  pageKind: PageKindEnum,
  entityId: z.string(),
  publishedRevisionId: z.string().nullable().optional(),
  redirectTo: z.string().nullable().optional(),
  statusCode: z.number().int().default(200)
});

export type RouteEntry = z.infer<typeof RouteEntrySchema>;
