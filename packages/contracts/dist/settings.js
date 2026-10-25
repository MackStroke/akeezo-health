import { z } from "zod";
export const SiteSettingsSchema = z.object({
    brandName: z.string().default("AKEEZO"),
    tagline: z.string().default("Heal In India, Heal By Akeezo"),
    legalEntityName: z.string().default("AKEEZO Healthcare Platform Private Limited"),
    officeAddress: z.string().default("Regus Elegance, Jasola District Centre, New Delhi, India 110025"),
    headquartersAddress: z.string().optional(),
    phone: z.string().default("+91 82876 39443"),
    careEmail: z.string().default("care@akeezo.com"),
    medicalEmail: z.string().default("medical@akeezo.com"),
    partnershipEmail: z.string().default("partnership@akeezo.com"),
    grievanceEmail: z.string().default("grievance@akeezo.com"),
    dpoEmail: z.string().default("dpo@akeezo.com"),
    consentEmail: z.string().default("consent@akeezo.com"),
    supportEmail: z.string().default("support@akeezo.com"),
    contactEmail: z.string().optional(),
    emergencyHelpline: z.string().optional(),
    whatsappHelpline: z.string().optional(),
    showTopUtilityBar: z.boolean().default(true),
    emergencyNotice: z.string().default("EMERGENCY?"),
    telegramChannel: z.string().default("https://t.me/akeezohealth"),
    supportedLocales: z.array(z.string()).default(["en"]),
    primaryColor: z.string().optional(),
    secondaryColor: z.string().optional(),
    accentColor: z.string().optional(),
    actionColor: z.string().optional(),
    logoVariants: z
        .object({
        light: z.string().optional(),
        dark: z.string().optional(),
        mark: z.string().optional()
    })
        .optional(),
    grievanceOfficer: z
        .object({
        name: z.string().optional(),
        designation: z.string().optional(),
        email: z.string().optional(),
        helpline: z.string().optional(),
        address: z.string().optional()
    })
        .optional(),
    dpoContact: z
        .object({
        email: z.string().optional(),
        address: z.string().optional()
    })
        .optional(),
    socialLinks: z.record(z.string()).optional()
});
