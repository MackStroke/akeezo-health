import { z } from "zod";
export const CASE_STAGES = [
    "new_referral",
    "under_review",
    "quotes_requested",
    "quotes_shared",
    "partner_decision",
    "visa_travel",
    "arrival",
    "consultation",
    "final_quotation",
    "mapped",
    "in_treatment",
    "treatment_completed",
    "settlement",
    "closed",
];
export const CASE_CLOSURE_REASONS = [
    "dropped_by_partner",
    "patient_declined",
    "visa_rejected",
    "no_hospital_quote",
    "medically_unfit",
    "lost_to_other_provider",
    "duplicate",
    "completed",
    "other",
];
export const CASE_SOURCES = ["partner", "direct_family", "other"];
export const CASE_TYPES = ["treatment", "second_opinion_only"];
export const CASE_URGENCIES = ["routine", "priority", "critical"];
export const SPECIALTIES = [
    "oncology",
    "cardiology_cardiac_surgery",
    "orthopaedics_joint_replacement",
    "spine_surgery",
    "neurology_neurosurgery",
    "organ_transplant",
    "gastroenterology_hepatology",
    "urology_nephrology",
    "gynaecology_fertility",
    "ophthalmology",
    "ent",
    "plastic_reconstructive",
    "paediatrics",
    "bariatric_surgery",
    "dental",
    "other",
];
export const DOCUMENT_TYPES = [
    "medical_report",
    "imaging",
    "prescription",
    "passport_copy",
    "visa",
    "ticket",
    "invitation_letter",
    "quote",
    "final_quote",
    "invoice",
    "payment_proof",
    "agreement",
    "consent",
    "other",
];
export const DOCUMENT_VISIBILITIES = [
    "internal",
    "hospital_shareable",
    "partner_shareable",
];
// Duplicate Patient Detection
export const DuplicatePatientQuerySchema = z.object({
    name: z.string().optional(),
    dateOfBirth: z.string().optional(),
    passportNumber: z.string().optional(),
});
export const DuplicatePatientMatchSchema = z.object({
    id: z.string(),
    fullName: z.string(),
    dateOfBirth: z.string().optional(),
    nationality: z.string().optional(),
    passportNumberMasked: z.string().optional(),
    matchReason: z.enum(["passport_match", "name_and_dob_match"]),
    caseCount: z.number(),
});
// Case Stage Transition Request
export const CaseStageTransitionSchema = z.object({
    toStage: z.enum(CASE_STAGES),
    reason: z.string().optional(), // Mandatory for backward moves or closure
});
// Stage Guard Evaluation Result
export const StageGuardDetailSchema = z.object({
    field: z.string(),
    guard: z.string(),
    passed: z.boolean(),
    message: z.string(),
});
export const CaseReadinessResultSchema = z.object({
    caseId: z.string(),
    currentStage: z.enum(CASE_STAGES),
    targetStage: z.enum(CASE_STAGES),
    isReady: z.boolean(),
    guards: z.array(StageGuardDetailSchema),
});
// Patient DTO
export const PatientSchema = z.object({
    id: z.string(),
    fullName: z.string().min(1),
    dateOfBirth: z.string().optional(),
    sex: z.enum(["male", "female", "other", "unknown"]).default("unknown"),
    nationality: z.string().optional(),
    countryOfResidence: z.string().optional(),
    preferredLanguage: z.string().default("en"),
    phone: z.string().optional(),
    email: z.string().email().optional(),
    passportNumberMasked: z.string().optional(),
    passportExpiry: z.string().optional(),
    passportCountry: z.string().optional(),
    notes: z.string().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
// Case DTO
export const CaseSchema = z.object({
    id: z.string(),
    caseCode: z.string(),
    patientId: z.string(),
    patient: PatientSchema.optional(),
    partnerId: z.string().optional().nullable(),
    partnerName: z.string().optional(),
    source: z.enum(CASE_SOURCES),
    caseType: z.enum(CASE_TYPES),
    specialty: z.string(),
    diagnosisSummary: z.string().min(1),
    urgency: z.enum(CASE_URGENCIES),
    preferredCity: z.string().optional(),
    budgetMinMinor: z.number().int().nonnegative().optional(),
    budgetMaxMinor: z.number().int().nonnegative().optional(),
    budgetCurrency: z.string().default("INR"),
    patientInIndia: z.boolean().default(false),
    stage: z.enum(CASE_STAGES),
    stageChangedAt: z.string().datetime(),
    ownerId: z.string(),
    ownerName: z.string().optional(),
    status: z.enum(["open", "closed"]).default("open"),
    closedReason: z.enum(CASE_CLOSURE_REASONS).optional().nullable(),
    closedAt: z.string().datetime().optional().nullable(),
    feeDisclosedToPartner: z.boolean().default(false),
    feeDisclosedOn: z.string().optional().nullable(),
    referredOn: z.string(),
    version: z.number().int().default(1),
    activeEpisodeId: z.string().optional().nullable(),
    activeEpisodeHospitalName: z.string().optional().nullable(),
    totalCommissionMinor: z.number().int().default(0),
    totalPartnerShareMinor: z.number().int().default(0),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});
// Case Intake Form Request
export const CreateCaseIntakeSchema = z.object({
    // Patient Details
    patient: z.object({
        fullName: z.string().min(1),
        dateOfBirth: z.string().optional(),
        sex: z.enum(["male", "female", "other", "unknown"]).default("unknown"),
        nationality: z.string().optional(),
        countryOfResidence: z.string().optional(),
        preferredLanguage: z.string().default("en"),
        phone: z.string().optional(),
        email: z.string().email().optional(),
        passportNumber: z.string().optional(),
        passportExpiry: z.string().optional(),
        passportCountry: z.string().optional(),
    }),
    existingPatientId: z.string().optional(), // If user links to duplicate match
    // Partner & Origin
    partnerId: z.string().optional().nullable(),
    source: z.enum(CASE_SOURCES).default("partner"),
    caseType: z.enum(CASE_TYPES).default("treatment"),
    // Medical Details
    specialty: z.string().min(1),
    diagnosisSummary: z.string().min(1),
    urgency: z.enum(CASE_URGENCIES).default("routine"),
    preferredCity: z.string().optional(),
    budgetMinMinor: z.number().int().nonnegative().optional(),
    budgetMaxMinor: z.number().int().nonnegative().optional(),
    budgetCurrency: z.string().default("INR"),
    patientInIndia: z.boolean().default(false),
    ownerId: z.string(),
    referredOn: z.string().optional(),
    // Consents & Disclosure
    consentShareWithHospitals: z.boolean().default(false),
    feeDisclosedToPartner: z.boolean().default(false),
});
