import { z } from "zod";
export declare const PERMISSION_KEYS: readonly ["case.view", "case.create", "case.edit", "case.stage_move", "case.close", "case.reassign", "document.view", "document.upload", "document.view_identity", "quote.manage", "travel.manage", "episode.manage", "commission.view", "commission.manage", "payment.record", "partner.manage", "partner.view_payout", "hospital.manage", "agreement.view", "agreement.manage", "user.manage", "report.view", "report.financial", "export.data", "audit.view"];
export type PermissionKey = (typeof PERMISSION_KEYS)[number];
export declare const ROLE_KEYS: readonly ["admin", "coordinator", "hospital_liaison", "finance", "viewer", "partner"];
export type RoleKey = (typeof ROLE_KEYS)[number];
export declare const DEFAULT_ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["admin", "coordinator", "hospital_liaison", "finance", "viewer", "partner"]>;
    permissions: z.ZodArray<z.ZodString, "many">;
    status: z.ZodDefault<z.ZodEnum<["active", "disabled"]>>;
    phoneVerified: z.ZodDefault<z.ZodBoolean>;
    totpEnabled: z.ZodDefault<z.ZodBoolean>;
    lastLoginAt: z.ZodOptional<z.ZodString>;
    createdAt: z.ZodString;
    updatedAt: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: "active" | "disabled";
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: "partner" | "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
    permissions: string[];
    phoneVerified: boolean;
    totpEnabled: boolean;
    phone?: string | undefined;
    lastLoginAt?: string | undefined;
}, {
    name: string;
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: "partner" | "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
    permissions: string[];
    status?: "active" | "disabled" | undefined;
    phone?: string | undefined;
    phoneVerified?: boolean | undefined;
    totpEnabled?: boolean | undefined;
    lastLoginAt?: string | undefined;
}>;
export type UserDTO = z.infer<typeof UserSchema>;
export declare const LoginRequestSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type LoginRequestDTO = z.infer<typeof LoginRequestSchema>;
export declare const RequestPhoneOtpSchema: z.ZodObject<{
    phone: z.ZodString;
}, "strip", z.ZodTypeAny, {
    phone: string;
}, {
    phone: string;
}>;
export type RequestPhoneOtpDTO = z.infer<typeof RequestPhoneOtpSchema>;
export declare const RequestEmailOtpSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export type RequestEmailOtpDTO = z.infer<typeof RequestEmailOtpSchema>;
export declare const FirebaseVerifySchema: z.ZodObject<{
    firebaseIdToken: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firebaseIdToken: string;
    phone?: string | undefined;
    email?: string | undefined;
}, {
    firebaseIdToken: string;
    phone?: string | undefined;
    email?: string | undefined;
}>;
export type FirebaseVerifyDTO = z.infer<typeof FirebaseVerifySchema>;
export declare const VerifyPhoneOtpRequestSchema: z.ZodObject<{
    tempToken: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    code: z.ZodString;
    firebaseIdToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    phone?: string | undefined;
    email?: string | undefined;
    firebaseIdToken?: string | undefined;
    tempToken?: string | undefined;
}, {
    code: string;
    phone?: string | undefined;
    email?: string | undefined;
    firebaseIdToken?: string | undefined;
    tempToken?: string | undefined;
}>;
export type VerifyPhoneOtpRequestDTO = z.infer<typeof VerifyPhoneOtpRequestSchema>;
export declare const Verify2FARequestSchema: z.ZodObject<{
    tempToken: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    code: z.ZodString;
    firebaseIdToken: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    code: string;
    phone?: string | undefined;
    email?: string | undefined;
    firebaseIdToken?: string | undefined;
    tempToken?: string | undefined;
}, {
    code: string;
    phone?: string | undefined;
    email?: string | undefined;
    firebaseIdToken?: string | undefined;
    tempToken?: string | undefined;
}>;
export type Verify2FARequestDTO = VerifyPhoneOtpRequestDTO;
export declare const AuthResponseSchema: z.ZodObject<{
    requiresPhoneOtp: z.ZodDefault<z.ZodBoolean>;
    requires2FA: z.ZodDefault<z.ZodBoolean>;
    tempToken: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    maskedPhone: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        role: z.ZodEnum<["admin", "coordinator", "hospital_liaison", "finance", "viewer", "partner"]>;
        permissions: z.ZodArray<z.ZodString, "many">;
        status: z.ZodDefault<z.ZodEnum<["active", "disabled"]>>;
        phoneVerified: z.ZodDefault<z.ZodBoolean>;
        totpEnabled: z.ZodDefault<z.ZodBoolean>;
        lastLoginAt: z.ZodOptional<z.ZodString>;
        createdAt: z.ZodString;
        updatedAt: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        status: "active" | "disabled";
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: "partner" | "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        phoneVerified: boolean;
        totpEnabled: boolean;
        phone?: string | undefined;
        lastLoginAt?: string | undefined;
    }, {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: "partner" | "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        status?: "active" | "disabled" | undefined;
        phone?: string | undefined;
        phoneVerified?: boolean | undefined;
        totpEnabled?: boolean | undefined;
        lastLoginAt?: string | undefined;
    }>>;
    message: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    requiresPhoneOtp: boolean;
    requires2FA: boolean;
    message?: string | undefined;
    phone?: string | undefined;
    tempToken?: string | undefined;
    maskedPhone?: string | undefined;
    token?: string | undefined;
    user?: {
        name: string;
        status: "active" | "disabled";
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: "partner" | "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        phoneVerified: boolean;
        totpEnabled: boolean;
        phone?: string | undefined;
        lastLoginAt?: string | undefined;
    } | undefined;
}, {
    message?: string | undefined;
    phone?: string | undefined;
    tempToken?: string | undefined;
    requiresPhoneOtp?: boolean | undefined;
    requires2FA?: boolean | undefined;
    maskedPhone?: string | undefined;
    token?: string | undefined;
    user?: {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: "partner" | "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        status?: "active" | "disabled" | undefined;
        phone?: string | undefined;
        phoneVerified?: boolean | undefined;
        totpEnabled?: boolean | undefined;
        lastLoginAt?: string | undefined;
    } | undefined;
}>;
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;
//# sourceMappingURL=rbac.d.ts.map