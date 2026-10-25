import { z } from "zod";
export const EPISODE_TYPES = [
    "consultation_only",
    "opd_cycle",
    "day_care",
    "ipd",
    "diagnostic",
    "follow_up",
    "other",
];
export const EPISODE_STATUSES = [
    "planned",
    "active",
    "paused",
    "completed",
    "cancelled",
];
export const EpisodeSchema = z.object({
    id: z.string(),
    caseId: z.string(),
    seriesId: z.string().optional().nullable(),
    sequenceNo: z.number().int().positive(),
    cycleNo: z.number().int().positive().optional().nullable(),
    episodeType: z.enum(EPISODE_TYPES),
    hospitalId: z.string(),
    hospitalName: z.string().optional(),
    hospitalCity: z.string().optional(),
    doctorId: z.string().optional().nullable(),
    doctorName: z.string().optional().nullable(),
    treatmentName: z.string().min(1),
    plannedStart: z.string().optional().nullable(),
    plannedEnd: z.string().optional().nullable(),
    actualStart: z.string().optional().nullable(),
    actualEnd: z.string().optional().nullable(),
    admissionDate: z.string().optional().nullable(),
    dischargeDate: z.string().optional().nullable(),
    status: z.enum(EPISODE_STATUSES).default("planned"),
    cancelReason: z.string().optional().nullable(),
    finalQuoteId: z.string().optional().nullable(),
    expectedAmountMinor: z.number().int().nonnegative().optional().nullable(),
    billedAmountMinor: z.number().int().nonnegative().optional().nullable(),
    billedCurrency: z.string().default("INR"),
    billingFinalisedAt: z.string().datetime().optional().nullable(),
    version: z.number().int().default(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
// Create Single Episode
export const CreateEpisodeSchema = z.object({
    caseId: z.string(),
    episodeType: z.enum(EPISODE_TYPES),
    hospitalId: z.string(),
    doctorId: z.string().optional().nullable(),
    treatmentName: z.string().min(1),
    plannedStart: z.string().optional().nullable(),
    plannedEnd: z.string().optional().nullable(),
    expectedAmountMinor: z.number().int().nonnegative().optional().nullable(),
    billedCurrency: z.string().default("INR"),
});
// Create Series (e.g. 7 Chemotherapy Cycles)
export const CreateEpisodeSeriesSchema = z.object({
    caseId: z.string(),
    label: z.string().min(1), // e.g. "Chemotherapy Protocol"
    plannedTotal: z.number().int().min(2).max(50), // e.g. 7 cycles
    defaultHospitalId: z.string(),
    defaultDoctorId: z.string().optional().nullable(),
    episodeType: z.enum(EPISODE_TYPES).default("opd_cycle"),
    firstCycleDate: z.string(), // ISO date
    intervalDays: z.number().int().positive().default(21), // e.g. every 21 days
    expectedAmountPerCycleMinor: z.number().int().nonnegative().optional().nullable(),
    notes: z.string().optional(),
});
// Finalise Billing DTO
export const FinaliseEpisodeBillingSchema = z.object({
    billedAmountMinor: z.number().int().positive(),
    billedCurrency: z.string().default("INR"),
    billingFinalisedAt: z.string().datetime().optional(),
    invoiceRef: z.string().optional(),
});
