import { z } from "zod";
import { type SiteSettings } from "./settings.js";
export type SiteSettingsDTO = SiteSettings;
export declare const PublicRouteResponseSchema: z.ZodObject<{
    pageKind: z.ZodEnum<["home", "treatmentDirectory", "treatmentDetail", "procedureDetail", "hospitalDirectory", "hospitalDetail", "doctorDirectory", "doctorDetail", "destinationDirectory", "destinationDetail", "cityDetail", "calculatorLanding", "calculatorWizard", "calculatorResult", "journeyPlanner", "blogDirectory", "article", "contributorProfile", "about", "missionVision", "partnerLanding", "partnerComparison", "partnerApplication", "contact", "faq", "helpCentre", "legal", "specializedGuide", "serviceDetail", "medicineEnquiry", "notFound", "serverError"]>;
    path: z.ZodString;
    locale: z.ZodDefault<z.ZodString>;
    seo: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        canonicalPath: z.ZodString;
        ogMediaId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        robots: z.ZodDefault<z.ZodString>;
        schemaKind: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        canonicalPath: string;
        robots: string;
        schemaKind: string;
        ogMediaId?: string | null | undefined;
    }, {
        title: string;
        description: string;
        canonicalPath: string;
        ogMediaId?: string | null | undefined;
        robots?: string | undefined;
        schemaKind?: string | undefined;
    }>;
    payload: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    revisionId: z.ZodOptional<z.ZodString>;
    siteSettings: z.ZodObject<{
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
    statusCode: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    path: string;
    seo: {
        title: string;
        description: string;
        canonicalPath: string;
        robots: string;
        schemaKind: string;
        ogMediaId?: string | null | undefined;
    };
    locale: string;
    payload: Record<string, unknown>;
    pageKind: "home" | "treatmentDirectory" | "treatmentDetail" | "procedureDetail" | "hospitalDirectory" | "hospitalDetail" | "doctorDirectory" | "doctorDetail" | "destinationDirectory" | "destinationDetail" | "cityDetail" | "calculatorLanding" | "calculatorWizard" | "calculatorResult" | "journeyPlanner" | "blogDirectory" | "article" | "contributorProfile" | "about" | "missionVision" | "partnerLanding" | "partnerComparison" | "partnerApplication" | "contact" | "faq" | "helpCentre" | "legal" | "specializedGuide" | "serviceDetail" | "medicineEnquiry" | "notFound" | "serverError";
    statusCode: number;
    siteSettings: {
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
    };
    revisionId?: string | undefined;
}, {
    path: string;
    seo: {
        title: string;
        description: string;
        canonicalPath: string;
        ogMediaId?: string | null | undefined;
        robots?: string | undefined;
        schemaKind?: string | undefined;
    };
    payload: Record<string, unknown>;
    pageKind: "home" | "treatmentDirectory" | "treatmentDetail" | "procedureDetail" | "hospitalDirectory" | "hospitalDetail" | "doctorDirectory" | "doctorDetail" | "destinationDirectory" | "destinationDetail" | "cityDetail" | "calculatorLanding" | "calculatorWizard" | "calculatorResult" | "journeyPlanner" | "blogDirectory" | "article" | "contributorProfile" | "about" | "missionVision" | "partnerLanding" | "partnerComparison" | "partnerApplication" | "contact" | "faq" | "helpCentre" | "legal" | "specializedGuide" | "serviceDetail" | "medicineEnquiry" | "notFound" | "serverError";
    siteSettings: {
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
    };
    locale?: string | undefined;
    statusCode?: number | undefined;
    revisionId?: string | undefined;
}>;
export type PublicRouteResponseDTO = z.infer<typeof PublicRouteResponseSchema>;
//# sourceMappingURL=dto.d.ts.map