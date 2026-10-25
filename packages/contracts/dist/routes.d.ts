import { z } from "zod";
export declare const PageKindEnum: z.ZodEnum<["home", "treatmentDirectory", "treatmentDetail", "procedureDetail", "hospitalDirectory", "hospitalDetail", "doctorDirectory", "doctorDetail", "destinationDirectory", "destinationDetail", "cityDetail", "calculatorLanding", "calculatorWizard", "calculatorResult", "journeyPlanner", "blogDirectory", "article", "contributorProfile", "about", "missionVision", "partnerLanding", "partnerComparison", "partnerApplication", "contact", "faq", "helpCentre", "legal", "specializedGuide", "serviceDetail", "medicineEnquiry", "notFound", "serverError"]>;
export type PageKind = z.infer<typeof PageKindEnum>;
export declare const RouteEntrySchema: z.ZodObject<{
    locale: z.ZodDefault<z.ZodString>;
    path: z.ZodString;
    pageKind: z.ZodEnum<["home", "treatmentDirectory", "treatmentDetail", "procedureDetail", "hospitalDirectory", "hospitalDetail", "doctorDirectory", "doctorDetail", "destinationDirectory", "destinationDetail", "cityDetail", "calculatorLanding", "calculatorWizard", "calculatorResult", "journeyPlanner", "blogDirectory", "article", "contributorProfile", "about", "missionVision", "partnerLanding", "partnerComparison", "partnerApplication", "contact", "faq", "helpCentre", "legal", "specializedGuide", "serviceDetail", "medicineEnquiry", "notFound", "serverError"]>;
    entityId: z.ZodString;
    publishedRevisionId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    redirectTo: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    statusCode: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    path: string;
    entityId: string;
    locale: string;
    pageKind: "home" | "treatmentDirectory" | "treatmentDetail" | "procedureDetail" | "hospitalDirectory" | "hospitalDetail" | "doctorDirectory" | "doctorDetail" | "destinationDirectory" | "destinationDetail" | "cityDetail" | "calculatorLanding" | "calculatorWizard" | "calculatorResult" | "journeyPlanner" | "blogDirectory" | "article" | "contributorProfile" | "about" | "missionVision" | "partnerLanding" | "partnerComparison" | "partnerApplication" | "contact" | "faq" | "helpCentre" | "legal" | "specializedGuide" | "serviceDetail" | "medicineEnquiry" | "notFound" | "serverError";
    statusCode: number;
    publishedRevisionId?: string | null | undefined;
    redirectTo?: string | null | undefined;
}, {
    path: string;
    entityId: string;
    pageKind: "home" | "treatmentDirectory" | "treatmentDetail" | "procedureDetail" | "hospitalDirectory" | "hospitalDetail" | "doctorDirectory" | "doctorDetail" | "destinationDirectory" | "destinationDetail" | "cityDetail" | "calculatorLanding" | "calculatorWizard" | "calculatorResult" | "journeyPlanner" | "blogDirectory" | "article" | "contributorProfile" | "about" | "missionVision" | "partnerLanding" | "partnerComparison" | "partnerApplication" | "contact" | "faq" | "helpCentre" | "legal" | "specializedGuide" | "serviceDetail" | "medicineEnquiry" | "notFound" | "serverError";
    locale?: string | undefined;
    publishedRevisionId?: string | null | undefined;
    redirectTo?: string | null | undefined;
    statusCode?: number | undefined;
}>;
export type RouteEntry = z.infer<typeof RouteEntrySchema>;
//# sourceMappingURL=routes.d.ts.map