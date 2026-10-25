import { z } from "zod";
export declare const SiteSettingsSchema: z.ZodObject<{
    brandName: z.ZodDefault<z.ZodString>;
    tagline: z.ZodDefault<z.ZodString>;
    legalEntityName: z.ZodDefault<z.ZodString>;
    officeAddress: z.ZodDefault<z.ZodString>;
    headquartersAddress: z.ZodOptional<z.ZodString>;
    phone: z.ZodDefault<z.ZodString>;
    careEmail: z.ZodDefault<z.ZodString>;
    medicalEmail: z.ZodDefault<z.ZodString>;
    partnershipEmail: z.ZodDefault<z.ZodString>;
    grievanceEmail: z.ZodDefault<z.ZodString>;
    dpoEmail: z.ZodDefault<z.ZodString>;
    consentEmail: z.ZodDefault<z.ZodString>;
    supportEmail: z.ZodDefault<z.ZodString>;
    contactEmail: z.ZodOptional<z.ZodString>;
    emergencyHelpline: z.ZodOptional<z.ZodString>;
    whatsappHelpline: z.ZodOptional<z.ZodString>;
    showTopUtilityBar: z.ZodDefault<z.ZodBoolean>;
    emergencyNotice: z.ZodDefault<z.ZodString>;
    telegramChannel: z.ZodDefault<z.ZodString>;
    supportedLocales: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    primaryColor: z.ZodOptional<z.ZodString>;
    secondaryColor: z.ZodOptional<z.ZodString>;
    accentColor: z.ZodOptional<z.ZodString>;
    actionColor: z.ZodOptional<z.ZodString>;
    logoVariants: z.ZodOptional<z.ZodObject<{
        light: z.ZodOptional<z.ZodString>;
        dark: z.ZodOptional<z.ZodString>;
        mark: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        light?: string | undefined;
        dark?: string | undefined;
        mark?: string | undefined;
    }, {
        light?: string | undefined;
        dark?: string | undefined;
        mark?: string | undefined;
    }>>;
    grievanceOfficer: z.ZodOptional<z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        designation: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        helpline: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        name?: string | undefined;
        email?: string | undefined;
        designation?: string | undefined;
        helpline?: string | undefined;
        address?: string | undefined;
    }, {
        name?: string | undefined;
        email?: string | undefined;
        designation?: string | undefined;
        helpline?: string | undefined;
        address?: string | undefined;
    }>>;
    dpoContact: z.ZodOptional<z.ZodObject<{
        email: z.ZodOptional<z.ZodString>;
        address: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        address?: string | undefined;
    }, {
        email?: string | undefined;
        address?: string | undefined;
    }>>;
    socialLinks: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    brandName: string;
    tagline: string;
    legalEntityName: string;
    officeAddress: string;
    careEmail: string;
    medicalEmail: string;
    partnershipEmail: string;
    grievanceEmail: string;
    dpoEmail: string;
    consentEmail: string;
    supportEmail: string;
    showTopUtilityBar: boolean;
    emergencyNotice: string;
    telegramChannel: string;
    supportedLocales: string[];
    headquartersAddress?: string | undefined;
    contactEmail?: string | undefined;
    emergencyHelpline?: string | undefined;
    whatsappHelpline?: string | undefined;
    primaryColor?: string | undefined;
    secondaryColor?: string | undefined;
    accentColor?: string | undefined;
    actionColor?: string | undefined;
    logoVariants?: {
        light?: string | undefined;
        dark?: string | undefined;
        mark?: string | undefined;
    } | undefined;
    grievanceOfficer?: {
        name?: string | undefined;
        email?: string | undefined;
        designation?: string | undefined;
        helpline?: string | undefined;
        address?: string | undefined;
    } | undefined;
    dpoContact?: {
        email?: string | undefined;
        address?: string | undefined;
    } | undefined;
    socialLinks?: Record<string, string> | undefined;
}, {
    phone?: string | undefined;
    brandName?: string | undefined;
    tagline?: string | undefined;
    legalEntityName?: string | undefined;
    officeAddress?: string | undefined;
    headquartersAddress?: string | undefined;
    careEmail?: string | undefined;
    medicalEmail?: string | undefined;
    partnershipEmail?: string | undefined;
    grievanceEmail?: string | undefined;
    dpoEmail?: string | undefined;
    consentEmail?: string | undefined;
    supportEmail?: string | undefined;
    contactEmail?: string | undefined;
    emergencyHelpline?: string | undefined;
    whatsappHelpline?: string | undefined;
    showTopUtilityBar?: boolean | undefined;
    emergencyNotice?: string | undefined;
    telegramChannel?: string | undefined;
    supportedLocales?: string[] | undefined;
    primaryColor?: string | undefined;
    secondaryColor?: string | undefined;
    accentColor?: string | undefined;
    actionColor?: string | undefined;
    logoVariants?: {
        light?: string | undefined;
        dark?: string | undefined;
        mark?: string | undefined;
    } | undefined;
    grievanceOfficer?: {
        name?: string | undefined;
        email?: string | undefined;
        designation?: string | undefined;
        helpline?: string | undefined;
        address?: string | undefined;
    } | undefined;
    dpoContact?: {
        email?: string | undefined;
        address?: string | undefined;
    } | undefined;
    socialLinks?: Record<string, string> | undefined;
}>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
//# sourceMappingURL=settings.d.ts.map