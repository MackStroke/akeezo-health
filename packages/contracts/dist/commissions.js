import { z } from "zod";
export const HOSPITAL_COMMISSION_TYPES = [
    "percent_of_billed",
    "flat_per_episode",
    "slab",
];
export const PARTNER_SHARE_TYPES = [
    "percent_of_akeezo_commission",
    "flat_per_episode",
    "flat_per_case",
];
export const PAYOUT_TRIGGERS = [
    "on_hospital_receipt",
    "on_invoice",
    "manual",
];
export const COMMISSION_RECORD_STATUSES = [
    "expected",
    "invoiced",
    "partially_received",
    "received",
    "partner_payable",
    "partially_paid",
    "paid",
    "disputed",
    "written_off",
];
export const PAYMENT_DIRECTIONS = [
    "in_from_hospital",
    "out_to_partner",
];
export const PAYMENT_METHODS = [
    "bank_transfer",
    "upi",
    "cheque",
    "cash",
    "other",
];
// Slab definition for hospital agreements
export const AgreementSlabSchema = z.object({
    fromMinor: z.number().int().nonnegative(),
    toMinor: z.number().int().positive(), // Up to this value
    type: z.enum(["percent_of_billed", "flat_per_episode"]),
    value: z.number().positive(),
});
// Hospital Agreement
export const HospitalAgreementSchema = z.object({
    id: z.string(),
    hospitalId: z.string(),
    commissionType: z.enum(HOSPITAL_COMMISSION_TYPES),
    commissionValue: z.number().nonnegative(),
    slabs: z.array(AgreementSlabSchema).optional(),
    appliesTo: z.enum(["all", "specialty", "procedure"]).default("all"),
    scopeRef: z.string().optional(),
    paymentTermsDays: z.number().int().positive().default(30),
    effectiveFrom: z.string(),
    effectiveTo: z.string().optional().nullable(),
    documentId: z.string().optional().nullable(),
    notes: z.string().optional(),
});
// Partner Agreement
export const PartnerAgreementSchema = z.object({
    id: z.string(),
    partnerId: z.string(),
    shareType: z.enum(PARTNER_SHARE_TYPES),
    shareValue: z.number().nonnegative(),
    payoutTrigger: z.enum(PAYOUT_TRIGGERS).default("on_hospital_receipt"),
    effectiveFrom: z.string(),
    effectiveTo: z.string().optional().nullable(),
    documentId: z.string().optional().nullable(),
    notes: z.string().optional(),
});
// Commission Record
export const CommissionRecordSchema = z.object({
    id: z.string(),
    episodeId: z.string(),
    caseId: z.string(),
    hospitalAgreementId: z.string().optional().nullable(),
    partnerAgreementId: z.string().optional().nullable(),
    hospitalRateSnapshot: z.record(z.any()),
    partnerShareSnapshot: z.record(z.any()).optional().nullable(),
    billedAmountMinor: z.number().int().nonnegative(),
    currency: z.string().default("INR"),
    akeezoCommissionMinor: z.number().int().nonnegative(),
    partnerShareMinor: z.number().int().nonnegative(),
    akeezoNetMinor: z.number().int(),
    hospitalReceivedMinor: z.number().int().nonnegative().default(0),
    partnerPaidMinor: z.number().int().nonnegative().default(0),
    partnerPayableMinor: z.number().int().default(0), // Negative indicates recovery due
    recoveryDueMinor: z.number().int().nonnegative().default(0),
    status: z.enum(COMMISSION_RECORD_STATUSES).default("expected"),
    invoiceRef: z.string().optional().nullable(),
    invoicedOn: z.string().optional().nullable(),
    dueOn: z.string().optional().nullable(),
    tdsDeductedMinor: z.number().int().nonnegative().optional().nullable(),
    version: z.number().int().default(1),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
// Commission Adjustment (Revised Bill or Refund)
export const CommissionAdjustmentSchema = z.object({
    id: z.string(),
    commissionRecordId: z.string(),
    reason: z.string().min(1),
    deltaBilledMinor: z.number().int(),
    deltaCommissionMinor: z.number().int(),
    deltaPartnerShareMinor: z.number().int(),
    approvedBy: z.string(),
    createdAt: z.string().datetime(),
});
// Payment with Allocations
export const PaymentAllocationItemSchema = z.object({
    commissionRecordId: z.string(),
    amountMinor: z.number().int().positive(),
});
export const RecordPaymentSchema = z.object({
    direction: z.enum(PAYMENT_DIRECTIONS),
    partyId: z.string(), // Hospital ID or Partner ID
    amountMinor: z.number().int().positive(),
    currency: z.string().default("INR"),
    fxRateToInr: z.number().positive().optional(),
    amountInrMinor: z.number().int().positive().optional(),
    paidOn: z.string(), // ISO date, cannot be in future
    method: z.enum(PAYMENT_METHODS).default("bank_transfer"),
    reference: z.string().min(1), // e.g. UTR, Cheque No, Transaction ID
    proofDocumentId: z.string().optional().nullable(),
    allocations: z.array(PaymentAllocationItemSchema).min(1),
});
