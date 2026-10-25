import { z } from "zod";

export const QUOTE_REQUEST_STATUSES = ["open", "closed", "cancelled"] as const;
export type QuoteRequestStatus = (typeof QUOTE_REQUEST_STATUSES)[number];

export const QUOTE_RECIPIENT_STATUSES = [
  "requested",
  "awaiting_reply",
  "received",
  "declined",
  "no_response",
  "expired",
] as const;
export type QuoteRecipientStatus = (typeof QUOTE_RECIPIENT_STATUSES)[number];

export const QUOTE_TYPES = ["initial", "final"] as const;
export type QuoteType = (typeof QUOTE_TYPES)[number];

export const QuoteSchema = z.object({
  id: z.string(),
  recipientId: z.string(),
  caseId: z.string(),
  hospitalId: z.string(),
  hospitalName: z.string().optional(),
  hospitalCity: z.string().optional(),
  quoteType: z.enum(QUOTE_TYPES).default("initial"),
  amountMinMinor: z.number().int().nonnegative(),
  amountMaxMinor: z.number().int().nonnegative(),
  currency: z.string().default("INR"),
  inclusions: z.string().optional().nullable(),
  exclusions: z.string().optional().nullable(),
  estimatedStayDays: z.number().int().nonnegative().optional().nullable(),
  estimatedTreatmentDays: z.number().int().nonnegative().optional().nullable(),
  validityUntil: z.string(), // ISO date
  receivedAt: z.string().datetime(),
  documentId: z.string().optional().nullable(),
  sharedWithPartnerAt: z.string().datetime().optional().nullable(),
  sharedVia: z.string().optional().nullable(),
  isSelected: z.boolean().default(false),
  selectedAt: z.string().datetime().optional().nullable(),
  selectedVia: z.string().optional().nullable(),
  rejectionReason: z.string().optional().nullable(),
  isExpired: z.boolean().default(false),
  version: z.number().int().default(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type QuoteDTO = z.infer<typeof QuoteSchema>;

// Create Quote Request (RFQ)
export const CreateQuoteRequestSchema = z.object({
  caseId: z.string(),
  hospitalIds: z.array(z.string()).min(1),
  clinicalSummary: z.string().min(1),
  responseDueAt: z.string().optional(),
  notes: z.string().optional(),
  includedDocumentIds: z.array(z.string()).optional(),
});

export type CreateQuoteRequestDTO = z.infer<typeof CreateQuoteRequestSchema>;

// Log Hospital Reply Quote
export const LogHospitalQuoteSchema = z.object({
  recipientId: z.string(),
  caseId: z.string(),
  hospitalId: z.string(),
  quoteType: z.enum(QUOTE_TYPES).default("initial"),
  amountMinMinor: z.number().int().nonnegative(),
  amountMaxMinor: z.number().int().nonnegative(),
  currency: z.string().default("INR"),
  inclusions: z.string().optional(),
  exclusions: z.string().optional(),
  estimatedStayDays: z.number().int().nonnegative().optional(),
  estimatedTreatmentDays: z.number().int().nonnegative().optional(),
  validityUntil: z.string(), // YYYY-MM-DD
  documentId: z.string().optional(),
});

export type LogHospitalQuoteDTO = z.infer<typeof LogHospitalQuoteSchema>;

// Select Quote
export const SelectQuoteSchema = z.object({
  quoteId: z.string(),
  selectedVia: z.enum(["whatsapp", "email", "phone", "in_person"]).default("whatsapp"),
  notes: z.string().optional(),
});

export type SelectQuoteDTO = z.infer<typeof SelectQuoteSchema>;

// Quote Comparison Grid Item
export const QuoteComparisonItemSchema = z.object({
  hospitalId: z.string(),
  hospitalName: z.string(),
  hospitalCity: z.string(),
  recipientStatus: z.enum(QUOTE_RECIPIENT_STATUSES),
  quote: QuoteSchema.optional().nullable(),
  isLowestPrice: z.boolean().default(false),
});

export type QuoteComparisonItem = z.infer<typeof QuoteComparisonItemSchema>;
