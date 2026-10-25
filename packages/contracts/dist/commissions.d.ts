import { z } from "zod";
export declare const HOSPITAL_COMMISSION_TYPES: readonly ["percent_of_billed", "flat_per_episode", "slab"];
export type HospitalCommissionType = (typeof HOSPITAL_COMMISSION_TYPES)[number];
export declare const PARTNER_SHARE_TYPES: readonly ["percent_of_akeezo_commission", "flat_per_episode", "flat_per_case"];
export type PartnerShareType = (typeof PARTNER_SHARE_TYPES)[number];
export declare const PAYOUT_TRIGGERS: readonly ["on_hospital_receipt", "on_invoice", "manual"];
export type PayoutTrigger = (typeof PAYOUT_TRIGGERS)[number];
export declare const COMMISSION_RECORD_STATUSES: readonly ["expected", "invoiced", "partially_received", "received", "partner_payable", "partially_paid", "paid", "disputed", "written_off"];
export type CommissionRecordStatus = (typeof COMMISSION_RECORD_STATUSES)[number];
export declare const PAYMENT_DIRECTIONS: readonly ["in_from_hospital", "out_to_partner"];
export type PaymentDirection = (typeof PAYMENT_DIRECTIONS)[number];
export declare const PAYMENT_METHODS: readonly ["bank_transfer", "upi", "cheque", "cash", "other"];
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];
export declare const AgreementSlabSchema: z.ZodObject<{
    fromMinor: z.ZodNumber;
    toMinor: z.ZodNumber;
    type: z.ZodEnum<["percent_of_billed", "flat_per_episode"]>;
    value: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    value: number;
    type: "percent_of_billed" | "flat_per_episode";
    fromMinor: number;
    toMinor: number;
}, {
    value: number;
    type: "percent_of_billed" | "flat_per_episode";
    fromMinor: number;
    toMinor: number;
}>;
export type AgreementSlab = z.infer<typeof AgreementSlabSchema>;
export declare const HospitalAgreementSchema: z.ZodObject<{
    id: z.ZodString;
    hospitalId: z.ZodString;
    commissionType: z.ZodEnum<["percent_of_billed", "flat_per_episode", "slab"]>;
    commissionValue: z.ZodNumber;
    slabs: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fromMinor: z.ZodNumber;
        toMinor: z.ZodNumber;
        type: z.ZodEnum<["percent_of_billed", "flat_per_episode"]>;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        type: "percent_of_billed" | "flat_per_episode";
        fromMinor: number;
        toMinor: number;
    }, {
        value: number;
        type: "percent_of_billed" | "flat_per_episode";
        fromMinor: number;
        toMinor: number;
    }>, "many">>;
    appliesTo: z.ZodDefault<z.ZodEnum<["all", "specialty", "procedure"]>>;
    scopeRef: z.ZodOptional<z.ZodString>;
    paymentTermsDays: z.ZodDefault<z.ZodNumber>;
    effectiveFrom: z.ZodString;
    effectiveTo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    documentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    hospitalId: string;
    commissionType: "percent_of_billed" | "flat_per_episode" | "slab";
    commissionValue: number;
    appliesTo: "specialty" | "all" | "procedure";
    paymentTermsDays: number;
    effectiveFrom: string;
    notes?: string | undefined;
    slabs?: {
        value: number;
        type: "percent_of_billed" | "flat_per_episode";
        fromMinor: number;
        toMinor: number;
    }[] | undefined;
    scopeRef?: string | undefined;
    effectiveTo?: string | null | undefined;
    documentId?: string | null | undefined;
}, {
    id: string;
    hospitalId: string;
    commissionType: "percent_of_billed" | "flat_per_episode" | "slab";
    commissionValue: number;
    effectiveFrom: string;
    notes?: string | undefined;
    slabs?: {
        value: number;
        type: "percent_of_billed" | "flat_per_episode";
        fromMinor: number;
        toMinor: number;
    }[] | undefined;
    appliesTo?: "specialty" | "all" | "procedure" | undefined;
    scopeRef?: string | undefined;
    paymentTermsDays?: number | undefined;
    effectiveTo?: string | null | undefined;
    documentId?: string | null | undefined;
}>;
export type HospitalAgreementDTO = z.infer<typeof HospitalAgreementSchema>;
export declare const PartnerAgreementSchema: z.ZodObject<{
    id: z.ZodString;
    partnerId: z.ZodString;
    shareType: z.ZodEnum<["percent_of_akeezo_commission", "flat_per_episode", "flat_per_case"]>;
    shareValue: z.ZodNumber;
    payoutTrigger: z.ZodDefault<z.ZodEnum<["on_hospital_receipt", "on_invoice", "manual"]>>;
    effectiveFrom: z.ZodString;
    effectiveTo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    documentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    partnerId: string;
    effectiveFrom: string;
    shareType: "flat_per_episode" | "percent_of_akeezo_commission" | "flat_per_case";
    shareValue: number;
    payoutTrigger: "on_hospital_receipt" | "on_invoice" | "manual";
    notes?: string | undefined;
    effectiveTo?: string | null | undefined;
    documentId?: string | null | undefined;
}, {
    id: string;
    partnerId: string;
    effectiveFrom: string;
    shareType: "flat_per_episode" | "percent_of_akeezo_commission" | "flat_per_case";
    shareValue: number;
    notes?: string | undefined;
    effectiveTo?: string | null | undefined;
    documentId?: string | null | undefined;
    payoutTrigger?: "on_hospital_receipt" | "on_invoice" | "manual" | undefined;
}>;
export type PartnerAgreementDTO = z.infer<typeof PartnerAgreementSchema>;
export declare const CommissionRecordSchema: z.ZodObject<{
    id: z.ZodString;
    episodeId: z.ZodString;
    caseId: z.ZodString;
    hospitalAgreementId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    partnerAgreementId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    hospitalRateSnapshot: z.ZodRecord<z.ZodString, z.ZodAny>;
    partnerShareSnapshot: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodAny>>>;
    billedAmountMinor: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    akeezoCommissionMinor: z.ZodNumber;
    partnerShareMinor: z.ZodNumber;
    akeezoNetMinor: z.ZodNumber;
    hospitalReceivedMinor: z.ZodDefault<z.ZodNumber>;
    partnerPaidMinor: z.ZodDefault<z.ZodNumber>;
    partnerPayableMinor: z.ZodDefault<z.ZodNumber>;
    recoveryDueMinor: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["expected", "invoiced", "partially_received", "received", "partner_payable", "partially_paid", "paid", "disputed", "written_off"]>>;
    invoiceRef: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    invoicedOn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    dueOn: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    tdsDeductedMinor: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    version: z.ZodDefault<z.ZodNumber>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    status: "expected" | "received" | "invoiced" | "partially_received" | "partner_payable" | "partially_paid" | "paid" | "disputed" | "written_off";
    id: string;
    caseId: string;
    createdAt: string;
    updatedAt: string;
    version: number;
    episodeId: string;
    hospitalRateSnapshot: Record<string, any>;
    billedAmountMinor: number;
    currency: string;
    akeezoCommissionMinor: number;
    partnerShareMinor: number;
    akeezoNetMinor: number;
    hospitalReceivedMinor: number;
    partnerPaidMinor: number;
    partnerPayableMinor: number;
    recoveryDueMinor: number;
    hospitalAgreementId?: string | null | undefined;
    partnerAgreementId?: string | null | undefined;
    partnerShareSnapshot?: Record<string, any> | null | undefined;
    invoiceRef?: string | null | undefined;
    invoicedOn?: string | null | undefined;
    dueOn?: string | null | undefined;
    tdsDeductedMinor?: number | null | undefined;
}, {
    id: string;
    caseId: string;
    createdAt: string;
    updatedAt: string;
    episodeId: string;
    hospitalRateSnapshot: Record<string, any>;
    billedAmountMinor: number;
    akeezoCommissionMinor: number;
    partnerShareMinor: number;
    akeezoNetMinor: number;
    status?: "expected" | "received" | "invoiced" | "partially_received" | "partner_payable" | "partially_paid" | "paid" | "disputed" | "written_off" | undefined;
    version?: number | undefined;
    hospitalAgreementId?: string | null | undefined;
    partnerAgreementId?: string | null | undefined;
    partnerShareSnapshot?: Record<string, any> | null | undefined;
    currency?: string | undefined;
    hospitalReceivedMinor?: number | undefined;
    partnerPaidMinor?: number | undefined;
    partnerPayableMinor?: number | undefined;
    recoveryDueMinor?: number | undefined;
    invoiceRef?: string | null | undefined;
    invoicedOn?: string | null | undefined;
    dueOn?: string | null | undefined;
    tdsDeductedMinor?: number | null | undefined;
}>;
export type CommissionRecordDTO = z.infer<typeof CommissionRecordSchema>;
export declare const CommissionAdjustmentSchema: z.ZodObject<{
    id: z.ZodString;
    commissionRecordId: z.ZodString;
    reason: z.ZodString;
    deltaBilledMinor: z.ZodNumber;
    deltaCommissionMinor: z.ZodNumber;
    deltaPartnerShareMinor: z.ZodNumber;
    approvedBy: z.ZodString;
    createdAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
    reason: string;
    createdAt: string;
    commissionRecordId: string;
    deltaBilledMinor: number;
    deltaCommissionMinor: number;
    deltaPartnerShareMinor: number;
    approvedBy: string;
}, {
    id: string;
    reason: string;
    createdAt: string;
    commissionRecordId: string;
    deltaBilledMinor: number;
    deltaCommissionMinor: number;
    deltaPartnerShareMinor: number;
    approvedBy: string;
}>;
export type CommissionAdjustmentDTO = z.infer<typeof CommissionAdjustmentSchema>;
export declare const PaymentAllocationItemSchema: z.ZodObject<{
    commissionRecordId: z.ZodString;
    amountMinor: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    commissionRecordId: string;
    amountMinor: number;
}, {
    commissionRecordId: string;
    amountMinor: number;
}>;
export declare const RecordPaymentSchema: z.ZodObject<{
    direction: z.ZodEnum<["in_from_hospital", "out_to_partner"]>;
    partyId: z.ZodString;
    amountMinor: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    fxRateToInr: z.ZodOptional<z.ZodNumber>;
    amountInrMinor: z.ZodOptional<z.ZodNumber>;
    paidOn: z.ZodString;
    method: z.ZodDefault<z.ZodEnum<["bank_transfer", "upi", "cheque", "cash", "other"]>>;
    reference: z.ZodString;
    proofDocumentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    allocations: z.ZodArray<z.ZodObject<{
        commissionRecordId: z.ZodString;
        amountMinor: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        commissionRecordId: string;
        amountMinor: number;
    }, {
        commissionRecordId: string;
        amountMinor: number;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    currency: string;
    amountMinor: number;
    direction: "in_from_hospital" | "out_to_partner";
    partyId: string;
    paidOn: string;
    method: "other" | "bank_transfer" | "upi" | "cheque" | "cash";
    reference: string;
    allocations: {
        commissionRecordId: string;
        amountMinor: number;
    }[];
    fxRateToInr?: number | undefined;
    amountInrMinor?: number | undefined;
    proofDocumentId?: string | null | undefined;
}, {
    amountMinor: number;
    direction: "in_from_hospital" | "out_to_partner";
    partyId: string;
    paidOn: string;
    reference: string;
    allocations: {
        commissionRecordId: string;
        amountMinor: number;
    }[];
    currency?: string | undefined;
    fxRateToInr?: number | undefined;
    amountInrMinor?: number | undefined;
    method?: "other" | "bank_transfer" | "upi" | "cheque" | "cash" | undefined;
    proofDocumentId?: string | null | undefined;
}>;
export type RecordPaymentDTO = z.infer<typeof RecordPaymentSchema>;
//# sourceMappingURL=commissions.d.ts.map