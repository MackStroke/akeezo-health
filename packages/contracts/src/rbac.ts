import { z } from "zod";

export const PERMISSION_KEYS = [
  "case.view",
  "case.create",
  "case.edit",
  "case.stage_move",
  "case.close",
  "case.reassign",
  "document.view",
  "document.upload",
  "document.view_identity",
  "quote.manage",
  "travel.manage",
  "episode.manage",
  "commission.view",
  "commission.manage",
  "payment.record",
  "partner.manage",
  "partner.view_payout",
  "hospital.manage",
  "agreement.view",
  "agreement.manage",
  "user.manage",
  "report.view",
  "report.financial",
  "export.data",
  "audit.view",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const ROLE_KEYS = [
  "admin",
  "coordinator",
  "hospital_liaison",
  "finance",
  "viewer",
  "partner",
] as const;

export type RoleKey = (typeof ROLE_KEYS)[number];

export const DEFAULT_ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  admin: [...PERMISSION_KEYS],
  coordinator: [
    "case.view",
    "case.create",
    "case.edit",
    "case.stage_move",
    "case.close",
    "case.reassign",
    "document.view",
    "document.upload",
    "document.view_identity",
    "quote.manage",
    "travel.manage",
    "episode.manage",
    "partner.manage",
    "hospital.manage",
    "report.view",
    "export.data",
  ],
  hospital_liaison: [
    "case.view",
    "case.create",
    "case.edit",
    "case.stage_move",
    "case.close",
    "case.reassign",
    "document.view",
    "document.upload",
    "document.view_identity",
    "quote.manage",
    "travel.manage",
    "episode.manage",
    "partner.manage",
    "hospital.manage",
    "agreement.view",
    "report.view",
    "export.data",
  ],
  finance: [
    "case.view",
    "document.view",
    "commission.view",
    "commission.manage",
    "payment.record",
    "partner.view_payout",
    "agreement.view",
    "report.financial",
    "export.data",
  ],
  viewer: [
    "case.view",
    "report.view",
  ],
  partner: [
    "case.view",
    "document.view",
    "commission.view",
    "partner.view_payout",
  ],
};

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  role: z.enum(ROLE_KEYS),
  permissions: z.array(z.string()),
  status: z.enum(["active", "disabled"]).default("active"),
  phoneVerified: z.boolean().default(true),
  totpEnabled: z.boolean().default(false),
  lastLoginAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type UserDTO = z.infer<typeof UserSchema>;

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;

export const VerifyPhoneOtpRequestSchema = z.object({
  tempToken: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  code: z.string().min(4).max(8),
  firebaseIdToken: z.string().optional(),
});

export type VerifyPhoneOtpRequestDTO = z.infer<typeof VerifyPhoneOtpRequestSchema>;

// Alias for backwards compatibility
export const Verify2FARequestSchema = VerifyPhoneOtpRequestSchema;
export type Verify2FARequestDTO = VerifyPhoneOtpRequestDTO;

export const AuthResponseSchema = z.object({
  requiresPhoneOtp: z.boolean().default(false),
  requires2FA: z.boolean().default(false), // Backwards compatibility
  tempToken: z.string().optional(),
  phone: z.string().optional(),
  maskedPhone: z.string().optional(),
  token: z.string().optional(),
  user: UserSchema.optional(),
  message: z.string().optional(),
});

export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;
