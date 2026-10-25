import { z } from "zod";
export declare const PERMISSION_KEYS: readonly ["case.view", "case.create", "case.edit", "case.stage_move", "case.close", "case.reassign", "document.view", "document.upload", "document.view_identity", "quote.manage", "travel.manage", "episode.manage", "commission.view", "commission.manage", "payment.record", "partner.manage", "partner.view_payout", "hospital.manage", "agreement.view", "agreement.manage", "user.manage", "report.view", "report.financial", "export.data", "audit.view"];
export type PermissionKey = (typeof PERMISSION_KEYS)[number];
export declare const ROLE_KEYS: readonly ["admin", "coordinator", "hospital_liaison", "finance", "viewer"];
export type RoleKey = (typeof ROLE_KEYS)[number];
export declare const DEFAULT_ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodEnum<["admin", "coordinator", "hospital_liaison", "finance", "viewer"]>;
    permissions: z.ZodArray<z.ZodString, "many">;
    status: z.ZodDefault<z.ZodEnum<["active", "disabled"]>>;
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
    role: "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
    permissions: string[];
    totpEnabled: boolean;
    phone?: string | undefined;
    lastLoginAt?: string | undefined;
}, {
    name: string;
    id: string;
    email: string;
    createdAt: string;
    updatedAt: string;
    role: "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
    permissions: string[];
    status?: "active" | "disabled" | undefined;
    phone?: string | undefined;
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
export declare const Verify2FARequestSchema: z.ZodObject<{
    tempToken: z.ZodString;
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
    tempToken: string;
}, {
    code: string;
    tempToken: string;
}>;
export type Verify2FARequestDTO = z.infer<typeof Verify2FARequestSchema>;
export declare const AuthResponseSchema: z.ZodObject<{
    requires2FA: z.ZodDefault<z.ZodBoolean>;
    tempToken: z.ZodOptional<z.ZodString>;
    token: z.ZodOptional<z.ZodString>;
    user: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        role: z.ZodEnum<["admin", "coordinator", "hospital_liaison", "finance", "viewer"]>;
        permissions: z.ZodArray<z.ZodString, "many">;
        status: z.ZodDefault<z.ZodEnum<["active", "disabled"]>>;
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
        role: "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        totpEnabled: boolean;
        phone?: string | undefined;
        lastLoginAt?: string | undefined;
    }, {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        status?: "active" | "disabled" | undefined;
        phone?: string | undefined;
        totpEnabled?: boolean | undefined;
        lastLoginAt?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    requires2FA: boolean;
    tempToken?: string | undefined;
    token?: string | undefined;
    user?: {
        name: string;
        status: "active" | "disabled";
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        totpEnabled: boolean;
        phone?: string | undefined;
        lastLoginAt?: string | undefined;
    } | undefined;
}, {
    tempToken?: string | undefined;
    requires2FA?: boolean | undefined;
    token?: string | undefined;
    user?: {
        name: string;
        id: string;
        email: string;
        createdAt: string;
        updatedAt: string;
        role: "admin" | "coordinator" | "hospital_liaison" | "finance" | "viewer";
        permissions: string[];
        status?: "active" | "disabled" | undefined;
        phone?: string | undefined;
        totpEnabled?: boolean | undefined;
        lastLoginAt?: string | undefined;
    } | undefined;
}>;
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;
//# sourceMappingURL=rbac.d.ts.map