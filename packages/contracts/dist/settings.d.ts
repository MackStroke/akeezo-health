import { z } from "zod";
export declare const ThemeModeSchema: z.ZodEnum<["light", "dark", "auto"]>;
export type ThemeMode = z.infer<typeof ThemeModeSchema>;
export declare const WebsiteThemeSchema: z.ZodObject<{
    primaryColor: z.ZodDefault<z.ZodString>;
    secondaryColor: z.ZodDefault<z.ZodString>;
    accentColor: z.ZodDefault<z.ZodString>;
    actionColor: z.ZodDefault<z.ZodString>;
    actionHoverColor: z.ZodDefault<z.ZodString>;
    actionAccentColor: z.ZodDefault<z.ZodString>;
    backgroundColor: z.ZodDefault<z.ZodString>;
    surfaceColor: z.ZodDefault<z.ZodString>;
    surfaceMutedColor: z.ZodDefault<z.ZodString>;
    surfaceTealColor: z.ZodDefault<z.ZodString>;
    surfaceOrangeColor: z.ZodDefault<z.ZodString>;
    cardColor: z.ZodDefault<z.ZodString>;
    textColor: z.ZodDefault<z.ZodString>;
    textMutedColor: z.ZodDefault<z.ZodString>;
    headingColor: z.ZodDefault<z.ZodString>;
    borderColor: z.ZodDefault<z.ZodString>;
    borderTealColor: z.ZodDefault<z.ZodString>;
    borderOrangeColor: z.ZodDefault<z.ZodString>;
    emergencyColor: z.ZodDefault<z.ZodString>;
    fontFamily: z.ZodDefault<z.ZodString>;
    headingFontFamily: z.ZodDefault<z.ZodString>;
    radiusCard: z.ZodDefault<z.ZodString>;
    radiusHero: z.ZodDefault<z.ZodString>;
    radiusButton: z.ZodDefault<z.ZodString>;
    radiusPill: z.ZodDefault<z.ZodString>;
    mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
    activePreset: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    actionColor: string;
    actionHoverColor: string;
    actionAccentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    surfaceMutedColor: string;
    surfaceTealColor: string;
    surfaceOrangeColor: string;
    cardColor: string;
    textColor: string;
    textMutedColor: string;
    headingColor: string;
    borderColor: string;
    borderTealColor: string;
    borderOrangeColor: string;
    emergencyColor: string;
    fontFamily: string;
    headingFontFamily: string;
    radiusCard: string;
    radiusHero: string;
    radiusButton: string;
    radiusPill: string;
    mode: "light" | "dark" | "auto";
    activePreset: string;
}, {
    primaryColor?: string | undefined;
    secondaryColor?: string | undefined;
    accentColor?: string | undefined;
    actionColor?: string | undefined;
    actionHoverColor?: string | undefined;
    actionAccentColor?: string | undefined;
    backgroundColor?: string | undefined;
    surfaceColor?: string | undefined;
    surfaceMutedColor?: string | undefined;
    surfaceTealColor?: string | undefined;
    surfaceOrangeColor?: string | undefined;
    cardColor?: string | undefined;
    textColor?: string | undefined;
    textMutedColor?: string | undefined;
    headingColor?: string | undefined;
    borderColor?: string | undefined;
    borderTealColor?: string | undefined;
    borderOrangeColor?: string | undefined;
    emergencyColor?: string | undefined;
    fontFamily?: string | undefined;
    headingFontFamily?: string | undefined;
    radiusCard?: string | undefined;
    radiusHero?: string | undefined;
    radiusButton?: string | undefined;
    radiusPill?: string | undefined;
    mode?: "light" | "dark" | "auto" | undefined;
    activePreset?: string | undefined;
}>;
export type WebsiteTheme = z.infer<typeof WebsiteThemeSchema>;
export declare const AdminThemeSchema: z.ZodObject<{
    primaryColor: z.ZodDefault<z.ZodString>;
    accentColor: z.ZodDefault<z.ZodString>;
    secondaryColor: z.ZodDefault<z.ZodString>;
    sidebarBackground: z.ZodDefault<z.ZodString>;
    sidebarText: z.ZodDefault<z.ZodString>;
    sidebarActiveBackground: z.ZodDefault<z.ZodString>;
    headerBackground: z.ZodDefault<z.ZodString>;
    headerText: z.ZodDefault<z.ZodString>;
    contentBackground: z.ZodDefault<z.ZodString>;
    cardBackground: z.ZodDefault<z.ZodString>;
    textColor: z.ZodDefault<z.ZodString>;
    textMutedColor: z.ZodDefault<z.ZodString>;
    borderColor: z.ZodDefault<z.ZodString>;
    fontFamily: z.ZodDefault<z.ZodString>;
    radiusCard: z.ZodDefault<z.ZodString>;
    radiusButton: z.ZodDefault<z.ZodString>;
    mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
    activePreset: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    textColor: string;
    textMutedColor: string;
    borderColor: string;
    fontFamily: string;
    radiusCard: string;
    radiusButton: string;
    mode: "light" | "dark" | "auto";
    activePreset: string;
    sidebarBackground: string;
    sidebarText: string;
    sidebarActiveBackground: string;
    headerBackground: string;
    headerText: string;
    contentBackground: string;
    cardBackground: string;
}, {
    primaryColor?: string | undefined;
    secondaryColor?: string | undefined;
    accentColor?: string | undefined;
    textColor?: string | undefined;
    textMutedColor?: string | undefined;
    borderColor?: string | undefined;
    fontFamily?: string | undefined;
    radiusCard?: string | undefined;
    radiusButton?: string | undefined;
    mode?: "light" | "dark" | "auto" | undefined;
    activePreset?: string | undefined;
    sidebarBackground?: string | undefined;
    sidebarText?: string | undefined;
    sidebarActiveBackground?: string | undefined;
    headerBackground?: string | undefined;
    headerText?: string | undefined;
    contentBackground?: string | undefined;
    cardBackground?: string | undefined;
}>;
export type AdminTheme = z.infer<typeof AdminThemeSchema>;
export declare const DEFAULT_WEBSITE_THEME: WebsiteTheme;
export declare const DEFAULT_ADMIN_THEME: AdminTheme;
export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    websiteTheme: Partial<WebsiteTheme>;
    adminTheme: Partial<AdminTheme>;
}
export declare const THEME_PRESETS: Record<string, ThemePreset>;
export declare const MediaOptimizationSettingsSchema: z.ZodObject<{
    autoOptimizeOnUpload: z.ZodDefault<z.ZodBoolean>;
    quality: z.ZodDefault<z.ZodNumber>;
    maxWidth: z.ZodDefault<z.ZodNumber>;
    maxHeight: z.ZodDefault<z.ZodNumber>;
    generateVariants: z.ZodDefault<z.ZodBoolean>;
    format: z.ZodDefault<z.ZodEnum<["webp", "original"]>>;
    preserveOriginals: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    autoOptimizeOnUpload: boolean;
    quality: number;
    maxWidth: number;
    maxHeight: number;
    generateVariants: boolean;
    format: "webp" | "original";
    preserveOriginals: boolean;
}, {
    autoOptimizeOnUpload?: boolean | undefined;
    quality?: number | undefined;
    maxWidth?: number | undefined;
    maxHeight?: number | undefined;
    generateVariants?: boolean | undefined;
    format?: "webp" | "original" | undefined;
    preserveOriginals?: boolean | undefined;
}>;
export type MediaOptimizationSettings = z.infer<typeof MediaOptimizationSettingsSchema>;
export declare const DEFAULT_MEDIA_OPTIMIZATION_SETTINGS: MediaOptimizationSettings;
export declare const GoogleTagManagerConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    containerId: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    containerId: string;
}, {
    enabled?: boolean | undefined;
    containerId?: string | undefined;
}>;
export type GoogleTagManagerConfig = z.infer<typeof GoogleTagManagerConfigSchema>;
export declare const GoogleCloudConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    projectId: z.ZodDefault<z.ZodString>;
    clientEmail: z.ZodDefault<z.ZodString>;
    region: z.ZodDefault<z.ZodString>;
    storageBucket: z.ZodDefault<z.ZodString>;
    status: z.ZodDefault<z.ZodEnum<["connected", "unconfigured", "error"]>>;
}, "strip", z.ZodTypeAny, {
    status: "error" | "connected" | "unconfigured";
    enabled: boolean;
    projectId: string;
    clientEmail: string;
    region: string;
    storageBucket: string;
}, {
    status?: "error" | "connected" | "unconfigured" | undefined;
    enabled?: boolean | undefined;
    projectId?: string | undefined;
    clientEmail?: string | undefined;
    region?: string | undefined;
    storageBucket?: string | undefined;
}>;
export type GoogleCloudConfig = z.infer<typeof GoogleCloudConfigSchema>;
export declare const MetaPixelConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    pixelId: z.ZodDefault<z.ZodString>;
    testEventCode: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    pixelId: string;
    testEventCode: string;
}, {
    enabled?: boolean | undefined;
    pixelId?: string | undefined;
    testEventCode?: string | undefined;
}>;
export type MetaPixelConfig = z.infer<typeof MetaPixelConfigSchema>;
export declare const GeminiApiConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    apiKey: z.ZodDefault<z.ZodString>;
    apiKeyMasked: z.ZodDefault<z.ZodString>;
    model: z.ZodDefault<z.ZodString>;
    temperature: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<["active", "unconfigured", "error"]>>;
    lastTestedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "error" | "unconfigured" | "active";
    enabled: boolean;
    apiKey: string;
    apiKeyMasked: string;
    model: string;
    temperature: number;
    lastTestedAt?: string | undefined;
}, {
    status?: "error" | "unconfigured" | "active" | undefined;
    enabled?: boolean | undefined;
    apiKey?: string | undefined;
    apiKeyMasked?: string | undefined;
    model?: string | undefined;
    temperature?: number | undefined;
    lastTestedAt?: string | undefined;
}>;
export type GeminiApiConfig = z.infer<typeof GeminiApiConfigSchema>;
export declare const GoogleAnalyticsConfigSchema: z.ZodObject<{
    enabled: z.ZodDefault<z.ZodBoolean>;
    measurementId: z.ZodDefault<z.ZodString>;
    anonymizeIp: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    enabled: boolean;
    measurementId: string;
    anonymizeIp: boolean;
}, {
    enabled?: boolean | undefined;
    measurementId?: string | undefined;
    anonymizeIp?: boolean | undefined;
}>;
export type GoogleAnalyticsConfig = z.infer<typeof GoogleAnalyticsConfigSchema>;
export declare const PlatformIntegrationsSchema: z.ZodObject<{
    googleTagManager: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        containerId: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        containerId: string;
    }, {
        enabled?: boolean | undefined;
        containerId?: string | undefined;
    }>>;
    googleCloud: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        projectId: z.ZodDefault<z.ZodString>;
        clientEmail: z.ZodDefault<z.ZodString>;
        region: z.ZodDefault<z.ZodString>;
        storageBucket: z.ZodDefault<z.ZodString>;
        status: z.ZodDefault<z.ZodEnum<["connected", "unconfigured", "error"]>>;
    }, "strip", z.ZodTypeAny, {
        status: "error" | "connected" | "unconfigured";
        enabled: boolean;
        projectId: string;
        clientEmail: string;
        region: string;
        storageBucket: string;
    }, {
        status?: "error" | "connected" | "unconfigured" | undefined;
        enabled?: boolean | undefined;
        projectId?: string | undefined;
        clientEmail?: string | undefined;
        region?: string | undefined;
        storageBucket?: string | undefined;
    }>>;
    metaPixel: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        pixelId: z.ZodDefault<z.ZodString>;
        testEventCode: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        pixelId: string;
        testEventCode: string;
    }, {
        enabled?: boolean | undefined;
        pixelId?: string | undefined;
        testEventCode?: string | undefined;
    }>>;
    gemini: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        apiKey: z.ZodDefault<z.ZodString>;
        apiKeyMasked: z.ZodDefault<z.ZodString>;
        model: z.ZodDefault<z.ZodString>;
        temperature: z.ZodDefault<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<["active", "unconfigured", "error"]>>;
        lastTestedAt: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        status: "error" | "unconfigured" | "active";
        enabled: boolean;
        apiKey: string;
        apiKeyMasked: string;
        model: string;
        temperature: number;
        lastTestedAt?: string | undefined;
    }, {
        status?: "error" | "unconfigured" | "active" | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        apiKeyMasked?: string | undefined;
        model?: string | undefined;
        temperature?: number | undefined;
        lastTestedAt?: string | undefined;
    }>>;
    googleAnalytics: z.ZodDefault<z.ZodObject<{
        enabled: z.ZodDefault<z.ZodBoolean>;
        measurementId: z.ZodDefault<z.ZodString>;
        anonymizeIp: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        enabled: boolean;
        measurementId: string;
        anonymizeIp: boolean;
    }, {
        enabled?: boolean | undefined;
        measurementId?: string | undefined;
        anonymizeIp?: boolean | undefined;
    }>>;
    googleAnalyticsId: z.ZodOptional<z.ZodString>;
    firebaseProjectMasked: z.ZodOptional<z.ZodString>;
    smtpHostMasked: z.ZodOptional<z.ZodString>;
    storageBucketMasked: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    googleTagManager: {
        enabled: boolean;
        containerId: string;
    };
    googleCloud: {
        status: "error" | "connected" | "unconfigured";
        enabled: boolean;
        projectId: string;
        clientEmail: string;
        region: string;
        storageBucket: string;
    };
    metaPixel: {
        enabled: boolean;
        pixelId: string;
        testEventCode: string;
    };
    gemini: {
        status: "error" | "unconfigured" | "active";
        enabled: boolean;
        apiKey: string;
        apiKeyMasked: string;
        model: string;
        temperature: number;
        lastTestedAt?: string | undefined;
    };
    googleAnalytics: {
        enabled: boolean;
        measurementId: string;
        anonymizeIp: boolean;
    };
    googleAnalyticsId?: string | undefined;
    firebaseProjectMasked?: string | undefined;
    smtpHostMasked?: string | undefined;
    storageBucketMasked?: string | undefined;
}, {
    googleTagManager?: {
        enabled?: boolean | undefined;
        containerId?: string | undefined;
    } | undefined;
    googleCloud?: {
        status?: "error" | "connected" | "unconfigured" | undefined;
        enabled?: boolean | undefined;
        projectId?: string | undefined;
        clientEmail?: string | undefined;
        region?: string | undefined;
        storageBucket?: string | undefined;
    } | undefined;
    metaPixel?: {
        enabled?: boolean | undefined;
        pixelId?: string | undefined;
        testEventCode?: string | undefined;
    } | undefined;
    gemini?: {
        status?: "error" | "unconfigured" | "active" | undefined;
        enabled?: boolean | undefined;
        apiKey?: string | undefined;
        apiKeyMasked?: string | undefined;
        model?: string | undefined;
        temperature?: number | undefined;
        lastTestedAt?: string | undefined;
    } | undefined;
    googleAnalytics?: {
        enabled?: boolean | undefined;
        measurementId?: string | undefined;
        anonymizeIp?: boolean | undefined;
    } | undefined;
    googleAnalyticsId?: string | undefined;
    firebaseProjectMasked?: string | undefined;
    smtpHostMasked?: string | undefined;
    storageBucketMasked?: string | undefined;
}>;
export type PlatformIntegrations = z.infer<typeof PlatformIntegrationsSchema>;
export declare const DEFAULT_PLATFORM_INTEGRATIONS: PlatformIntegrations;
export declare const CarouselSlideSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    badgeText: z.ZodString;
    badgeStyle: z.ZodDefault<z.ZodString>;
    buttonText: z.ZodString;
    buttonAction: z.ZodDefault<z.ZodString>;
    buttonLink: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    accentColor: z.ZodDefault<z.ZodString>;
    iconName: z.ZodDefault<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    order: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    description: string;
    order: number;
    accentColor: string;
    badgeText: string;
    badgeStyle: string;
    buttonText: string;
    buttonAction: string;
    buttonLink: string;
    iconName: string;
    isActive: boolean;
}, {
    id: string;
    title: string;
    description: string;
    badgeText: string;
    buttonText: string;
    order?: number | undefined;
    accentColor?: string | undefined;
    badgeStyle?: string | undefined;
    buttonAction?: string | undefined;
    buttonLink?: string | undefined;
    iconName?: string | undefined;
    isActive?: boolean | undefined;
}>;
export type CarouselSlide = z.infer<typeof CarouselSlideSchema>;
export declare const DEFAULT_CAROUSEL_SLIDES: CarouselSlide[];
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
    websiteTheme: z.ZodDefault<z.ZodObject<{
        primaryColor: z.ZodDefault<z.ZodString>;
        secondaryColor: z.ZodDefault<z.ZodString>;
        accentColor: z.ZodDefault<z.ZodString>;
        actionColor: z.ZodDefault<z.ZodString>;
        actionHoverColor: z.ZodDefault<z.ZodString>;
        actionAccentColor: z.ZodDefault<z.ZodString>;
        backgroundColor: z.ZodDefault<z.ZodString>;
        surfaceColor: z.ZodDefault<z.ZodString>;
        surfaceMutedColor: z.ZodDefault<z.ZodString>;
        surfaceTealColor: z.ZodDefault<z.ZodString>;
        surfaceOrangeColor: z.ZodDefault<z.ZodString>;
        cardColor: z.ZodDefault<z.ZodString>;
        textColor: z.ZodDefault<z.ZodString>;
        textMutedColor: z.ZodDefault<z.ZodString>;
        headingColor: z.ZodDefault<z.ZodString>;
        borderColor: z.ZodDefault<z.ZodString>;
        borderTealColor: z.ZodDefault<z.ZodString>;
        borderOrangeColor: z.ZodDefault<z.ZodString>;
        emergencyColor: z.ZodDefault<z.ZodString>;
        fontFamily: z.ZodDefault<z.ZodString>;
        headingFontFamily: z.ZodDefault<z.ZodString>;
        radiusCard: z.ZodDefault<z.ZodString>;
        radiusHero: z.ZodDefault<z.ZodString>;
        radiusButton: z.ZodDefault<z.ZodString>;
        radiusPill: z.ZodDefault<z.ZodString>;
        mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
        activePreset: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        actionColor: string;
        actionHoverColor: string;
        actionAccentColor: string;
        backgroundColor: string;
        surfaceColor: string;
        surfaceMutedColor: string;
        surfaceTealColor: string;
        surfaceOrangeColor: string;
        cardColor: string;
        textColor: string;
        textMutedColor: string;
        headingColor: string;
        borderColor: string;
        borderTealColor: string;
        borderOrangeColor: string;
        emergencyColor: string;
        fontFamily: string;
        headingFontFamily: string;
        radiusCard: string;
        radiusHero: string;
        radiusButton: string;
        radiusPill: string;
        mode: "light" | "dark" | "auto";
        activePreset: string;
    }, {
        primaryColor?: string | undefined;
        secondaryColor?: string | undefined;
        accentColor?: string | undefined;
        actionColor?: string | undefined;
        actionHoverColor?: string | undefined;
        actionAccentColor?: string | undefined;
        backgroundColor?: string | undefined;
        surfaceColor?: string | undefined;
        surfaceMutedColor?: string | undefined;
        surfaceTealColor?: string | undefined;
        surfaceOrangeColor?: string | undefined;
        cardColor?: string | undefined;
        textColor?: string | undefined;
        textMutedColor?: string | undefined;
        headingColor?: string | undefined;
        borderColor?: string | undefined;
        borderTealColor?: string | undefined;
        borderOrangeColor?: string | undefined;
        emergencyColor?: string | undefined;
        fontFamily?: string | undefined;
        headingFontFamily?: string | undefined;
        radiusCard?: string | undefined;
        radiusHero?: string | undefined;
        radiusButton?: string | undefined;
        radiusPill?: string | undefined;
        mode?: "light" | "dark" | "auto" | undefined;
        activePreset?: string | undefined;
    }>>;
    adminTheme: z.ZodDefault<z.ZodObject<{
        primaryColor: z.ZodDefault<z.ZodString>;
        accentColor: z.ZodDefault<z.ZodString>;
        secondaryColor: z.ZodDefault<z.ZodString>;
        sidebarBackground: z.ZodDefault<z.ZodString>;
        sidebarText: z.ZodDefault<z.ZodString>;
        sidebarActiveBackground: z.ZodDefault<z.ZodString>;
        headerBackground: z.ZodDefault<z.ZodString>;
        headerText: z.ZodDefault<z.ZodString>;
        contentBackground: z.ZodDefault<z.ZodString>;
        cardBackground: z.ZodDefault<z.ZodString>;
        textColor: z.ZodDefault<z.ZodString>;
        textMutedColor: z.ZodDefault<z.ZodString>;
        borderColor: z.ZodDefault<z.ZodString>;
        fontFamily: z.ZodDefault<z.ZodString>;
        radiusCard: z.ZodDefault<z.ZodString>;
        radiusButton: z.ZodDefault<z.ZodString>;
        mode: z.ZodDefault<z.ZodEnum<["light", "dark", "auto"]>>;
        activePreset: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        textColor: string;
        textMutedColor: string;
        borderColor: string;
        fontFamily: string;
        radiusCard: string;
        radiusButton: string;
        mode: "light" | "dark" | "auto";
        activePreset: string;
        sidebarBackground: string;
        sidebarText: string;
        sidebarActiveBackground: string;
        headerBackground: string;
        headerText: string;
        contentBackground: string;
        cardBackground: string;
    }, {
        primaryColor?: string | undefined;
        secondaryColor?: string | undefined;
        accentColor?: string | undefined;
        textColor?: string | undefined;
        textMutedColor?: string | undefined;
        borderColor?: string | undefined;
        fontFamily?: string | undefined;
        radiusCard?: string | undefined;
        radiusButton?: string | undefined;
        mode?: "light" | "dark" | "auto" | undefined;
        activePreset?: string | undefined;
        sidebarBackground?: string | undefined;
        sidebarText?: string | undefined;
        sidebarActiveBackground?: string | undefined;
        headerBackground?: string | undefined;
        headerText?: string | undefined;
        contentBackground?: string | undefined;
        cardBackground?: string | undefined;
    }>>;
    integrations: z.ZodOptional<z.ZodObject<{
        googleTagManager: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            containerId: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            containerId: string;
        }, {
            enabled?: boolean | undefined;
            containerId?: string | undefined;
        }>>;
        googleCloud: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            projectId: z.ZodDefault<z.ZodString>;
            clientEmail: z.ZodDefault<z.ZodString>;
            region: z.ZodDefault<z.ZodString>;
            storageBucket: z.ZodDefault<z.ZodString>;
            status: z.ZodDefault<z.ZodEnum<["connected", "unconfigured", "error"]>>;
        }, "strip", z.ZodTypeAny, {
            status: "error" | "connected" | "unconfigured";
            enabled: boolean;
            projectId: string;
            clientEmail: string;
            region: string;
            storageBucket: string;
        }, {
            status?: "error" | "connected" | "unconfigured" | undefined;
            enabled?: boolean | undefined;
            projectId?: string | undefined;
            clientEmail?: string | undefined;
            region?: string | undefined;
            storageBucket?: string | undefined;
        }>>;
        metaPixel: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            pixelId: z.ZodDefault<z.ZodString>;
            testEventCode: z.ZodDefault<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            pixelId: string;
            testEventCode: string;
        }, {
            enabled?: boolean | undefined;
            pixelId?: string | undefined;
            testEventCode?: string | undefined;
        }>>;
        gemini: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            apiKey: z.ZodDefault<z.ZodString>;
            apiKeyMasked: z.ZodDefault<z.ZodString>;
            model: z.ZodDefault<z.ZodString>;
            temperature: z.ZodDefault<z.ZodNumber>;
            status: z.ZodDefault<z.ZodEnum<["active", "unconfigured", "error"]>>;
            lastTestedAt: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            status: "error" | "unconfigured" | "active";
            enabled: boolean;
            apiKey: string;
            apiKeyMasked: string;
            model: string;
            temperature: number;
            lastTestedAt?: string | undefined;
        }, {
            status?: "error" | "unconfigured" | "active" | undefined;
            enabled?: boolean | undefined;
            apiKey?: string | undefined;
            apiKeyMasked?: string | undefined;
            model?: string | undefined;
            temperature?: number | undefined;
            lastTestedAt?: string | undefined;
        }>>;
        googleAnalytics: z.ZodDefault<z.ZodObject<{
            enabled: z.ZodDefault<z.ZodBoolean>;
            measurementId: z.ZodDefault<z.ZodString>;
            anonymizeIp: z.ZodDefault<z.ZodBoolean>;
        }, "strip", z.ZodTypeAny, {
            enabled: boolean;
            measurementId: string;
            anonymizeIp: boolean;
        }, {
            enabled?: boolean | undefined;
            measurementId?: string | undefined;
            anonymizeIp?: boolean | undefined;
        }>>;
        googleAnalyticsId: z.ZodOptional<z.ZodString>;
        firebaseProjectMasked: z.ZodOptional<z.ZodString>;
        smtpHostMasked: z.ZodOptional<z.ZodString>;
        storageBucketMasked: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        googleTagManager: {
            enabled: boolean;
            containerId: string;
        };
        googleCloud: {
            status: "error" | "connected" | "unconfigured";
            enabled: boolean;
            projectId: string;
            clientEmail: string;
            region: string;
            storageBucket: string;
        };
        metaPixel: {
            enabled: boolean;
            pixelId: string;
            testEventCode: string;
        };
        gemini: {
            status: "error" | "unconfigured" | "active";
            enabled: boolean;
            apiKey: string;
            apiKeyMasked: string;
            model: string;
            temperature: number;
            lastTestedAt?: string | undefined;
        };
        googleAnalytics: {
            enabled: boolean;
            measurementId: string;
            anonymizeIp: boolean;
        };
        googleAnalyticsId?: string | undefined;
        firebaseProjectMasked?: string | undefined;
        smtpHostMasked?: string | undefined;
        storageBucketMasked?: string | undefined;
    }, {
        googleTagManager?: {
            enabled?: boolean | undefined;
            containerId?: string | undefined;
        } | undefined;
        googleCloud?: {
            status?: "error" | "connected" | "unconfigured" | undefined;
            enabled?: boolean | undefined;
            projectId?: string | undefined;
            clientEmail?: string | undefined;
            region?: string | undefined;
            storageBucket?: string | undefined;
        } | undefined;
        metaPixel?: {
            enabled?: boolean | undefined;
            pixelId?: string | undefined;
            testEventCode?: string | undefined;
        } | undefined;
        gemini?: {
            status?: "error" | "unconfigured" | "active" | undefined;
            enabled?: boolean | undefined;
            apiKey?: string | undefined;
            apiKeyMasked?: string | undefined;
            model?: string | undefined;
            temperature?: number | undefined;
            lastTestedAt?: string | undefined;
        } | undefined;
        googleAnalytics?: {
            enabled?: boolean | undefined;
            measurementId?: string | undefined;
            anonymizeIp?: boolean | undefined;
        } | undefined;
        googleAnalyticsId?: string | undefined;
        firebaseProjectMasked?: string | undefined;
        smtpHostMasked?: string | undefined;
        storageBucketMasked?: string | undefined;
    }>>;
    mediaSettings: z.ZodOptional<z.ZodObject<{
        autoOptimizeOnUpload: z.ZodDefault<z.ZodBoolean>;
        quality: z.ZodDefault<z.ZodNumber>;
        maxWidth: z.ZodDefault<z.ZodNumber>;
        maxHeight: z.ZodDefault<z.ZodNumber>;
        generateVariants: z.ZodDefault<z.ZodBoolean>;
        format: z.ZodDefault<z.ZodEnum<["webp", "original"]>>;
        preserveOriginals: z.ZodDefault<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        autoOptimizeOnUpload: boolean;
        quality: number;
        maxWidth: number;
        maxHeight: number;
        generateVariants: boolean;
        format: "webp" | "original";
        preserveOriginals: boolean;
    }, {
        autoOptimizeOnUpload?: boolean | undefined;
        quality?: number | undefined;
        maxWidth?: number | undefined;
        maxHeight?: number | undefined;
        generateVariants?: boolean | undefined;
        format?: "webp" | "original" | undefined;
        preserveOriginals?: boolean | undefined;
    }>>;
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
    carouselSlides: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        badgeText: z.ZodString;
        badgeStyle: z.ZodDefault<z.ZodString>;
        buttonText: z.ZodString;
        buttonAction: z.ZodDefault<z.ZodString>;
        buttonLink: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        accentColor: z.ZodDefault<z.ZodString>;
        iconName: z.ZodDefault<z.ZodString>;
        isActive: z.ZodDefault<z.ZodBoolean>;
        order: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        title: string;
        description: string;
        order: number;
        accentColor: string;
        badgeText: string;
        badgeStyle: string;
        buttonText: string;
        buttonAction: string;
        buttonLink: string;
        iconName: string;
        isActive: boolean;
    }, {
        id: string;
        title: string;
        description: string;
        badgeText: string;
        buttonText: string;
        order?: number | undefined;
        accentColor?: string | undefined;
        badgeStyle?: string | undefined;
        buttonAction?: string | undefined;
        buttonLink?: string | undefined;
        iconName?: string | undefined;
        isActive?: boolean | undefined;
    }>, "many">>>;
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
    websiteTheme: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        actionColor: string;
        actionHoverColor: string;
        actionAccentColor: string;
        backgroundColor: string;
        surfaceColor: string;
        surfaceMutedColor: string;
        surfaceTealColor: string;
        surfaceOrangeColor: string;
        cardColor: string;
        textColor: string;
        textMutedColor: string;
        headingColor: string;
        borderColor: string;
        borderTealColor: string;
        borderOrangeColor: string;
        emergencyColor: string;
        fontFamily: string;
        headingFontFamily: string;
        radiusCard: string;
        radiusHero: string;
        radiusButton: string;
        radiusPill: string;
        mode: "light" | "dark" | "auto";
        activePreset: string;
    };
    adminTheme: {
        primaryColor: string;
        secondaryColor: string;
        accentColor: string;
        textColor: string;
        textMutedColor: string;
        borderColor: string;
        fontFamily: string;
        radiusCard: string;
        radiusButton: string;
        mode: "light" | "dark" | "auto";
        activePreset: string;
        sidebarBackground: string;
        sidebarText: string;
        sidebarActiveBackground: string;
        headerBackground: string;
        headerText: string;
        contentBackground: string;
        cardBackground: string;
    };
    carouselSlides: {
        id: string;
        title: string;
        description: string;
        order: number;
        accentColor: string;
        badgeText: string;
        badgeStyle: string;
        buttonText: string;
        buttonAction: string;
        buttonLink: string;
        iconName: string;
        isActive: boolean;
    }[];
    primaryColor?: string | undefined;
    secondaryColor?: string | undefined;
    accentColor?: string | undefined;
    actionColor?: string | undefined;
    headquartersAddress?: string | undefined;
    contactEmail?: string | undefined;
    emergencyHelpline?: string | undefined;
    whatsappHelpline?: string | undefined;
    integrations?: {
        googleTagManager: {
            enabled: boolean;
            containerId: string;
        };
        googleCloud: {
            status: "error" | "connected" | "unconfigured";
            enabled: boolean;
            projectId: string;
            clientEmail: string;
            region: string;
            storageBucket: string;
        };
        metaPixel: {
            enabled: boolean;
            pixelId: string;
            testEventCode: string;
        };
        gemini: {
            status: "error" | "unconfigured" | "active";
            enabled: boolean;
            apiKey: string;
            apiKeyMasked: string;
            model: string;
            temperature: number;
            lastTestedAt?: string | undefined;
        };
        googleAnalytics: {
            enabled: boolean;
            measurementId: string;
            anonymizeIp: boolean;
        };
        googleAnalyticsId?: string | undefined;
        firebaseProjectMasked?: string | undefined;
        smtpHostMasked?: string | undefined;
        storageBucketMasked?: string | undefined;
    } | undefined;
    mediaSettings?: {
        autoOptimizeOnUpload: boolean;
        quality: number;
        maxWidth: number;
        maxHeight: number;
        generateVariants: boolean;
        format: "webp" | "original";
        preserveOriginals: boolean;
    } | undefined;
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
    primaryColor?: string | undefined;
    secondaryColor?: string | undefined;
    accentColor?: string | undefined;
    actionColor?: string | undefined;
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
    websiteTheme?: {
        primaryColor?: string | undefined;
        secondaryColor?: string | undefined;
        accentColor?: string | undefined;
        actionColor?: string | undefined;
        actionHoverColor?: string | undefined;
        actionAccentColor?: string | undefined;
        backgroundColor?: string | undefined;
        surfaceColor?: string | undefined;
        surfaceMutedColor?: string | undefined;
        surfaceTealColor?: string | undefined;
        surfaceOrangeColor?: string | undefined;
        cardColor?: string | undefined;
        textColor?: string | undefined;
        textMutedColor?: string | undefined;
        headingColor?: string | undefined;
        borderColor?: string | undefined;
        borderTealColor?: string | undefined;
        borderOrangeColor?: string | undefined;
        emergencyColor?: string | undefined;
        fontFamily?: string | undefined;
        headingFontFamily?: string | undefined;
        radiusCard?: string | undefined;
        radiusHero?: string | undefined;
        radiusButton?: string | undefined;
        radiusPill?: string | undefined;
        mode?: "light" | "dark" | "auto" | undefined;
        activePreset?: string | undefined;
    } | undefined;
    adminTheme?: {
        primaryColor?: string | undefined;
        secondaryColor?: string | undefined;
        accentColor?: string | undefined;
        textColor?: string | undefined;
        textMutedColor?: string | undefined;
        borderColor?: string | undefined;
        fontFamily?: string | undefined;
        radiusCard?: string | undefined;
        radiusButton?: string | undefined;
        mode?: "light" | "dark" | "auto" | undefined;
        activePreset?: string | undefined;
        sidebarBackground?: string | undefined;
        sidebarText?: string | undefined;
        sidebarActiveBackground?: string | undefined;
        headerBackground?: string | undefined;
        headerText?: string | undefined;
        contentBackground?: string | undefined;
        cardBackground?: string | undefined;
    } | undefined;
    integrations?: {
        googleTagManager?: {
            enabled?: boolean | undefined;
            containerId?: string | undefined;
        } | undefined;
        googleCloud?: {
            status?: "error" | "connected" | "unconfigured" | undefined;
            enabled?: boolean | undefined;
            projectId?: string | undefined;
            clientEmail?: string | undefined;
            region?: string | undefined;
            storageBucket?: string | undefined;
        } | undefined;
        metaPixel?: {
            enabled?: boolean | undefined;
            pixelId?: string | undefined;
            testEventCode?: string | undefined;
        } | undefined;
        gemini?: {
            status?: "error" | "unconfigured" | "active" | undefined;
            enabled?: boolean | undefined;
            apiKey?: string | undefined;
            apiKeyMasked?: string | undefined;
            model?: string | undefined;
            temperature?: number | undefined;
            lastTestedAt?: string | undefined;
        } | undefined;
        googleAnalytics?: {
            enabled?: boolean | undefined;
            measurementId?: string | undefined;
            anonymizeIp?: boolean | undefined;
        } | undefined;
        googleAnalyticsId?: string | undefined;
        firebaseProjectMasked?: string | undefined;
        smtpHostMasked?: string | undefined;
        storageBucketMasked?: string | undefined;
    } | undefined;
    mediaSettings?: {
        autoOptimizeOnUpload?: boolean | undefined;
        quality?: number | undefined;
        maxWidth?: number | undefined;
        maxHeight?: number | undefined;
        generateVariants?: boolean | undefined;
        format?: "webp" | "original" | undefined;
        preserveOriginals?: boolean | undefined;
    } | undefined;
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
    carouselSlides?: {
        id: string;
        title: string;
        description: string;
        badgeText: string;
        buttonText: string;
        order?: number | undefined;
        accentColor?: string | undefined;
        badgeStyle?: string | undefined;
        buttonAction?: string | undefined;
        buttonLink?: string | undefined;
        iconName?: string | undefined;
        isActive?: boolean | undefined;
    }[] | undefined;
}>;
export type SiteSettings = z.infer<typeof SiteSettingsSchema>;
export declare function sanitizeCssValue(val?: string): string;
export declare function websiteThemeToCssVariables(theme?: Partial<WebsiteTheme>): Record<string, string>;
export declare function adminThemeToCssVariables(theme?: Partial<AdminTheme>): Record<string, string>;
export declare function generateWebsiteThemeCss(theme?: Partial<WebsiteTheme>): string;
export declare function generateAdminThemeCss(theme?: Partial<AdminTheme>): string;
export declare function extractPrimaryFontName(fontFamily?: string): string | null;
export declare function getGoogleFontUrl(fontFamily?: string): string | null;
//# sourceMappingURL=settings.d.ts.map