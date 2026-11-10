import { z } from "zod";
export declare const DestinationProcedureCostSchema: z.ZodObject<{
    procedureName: z.ZodString;
    specialty: z.ZodDefault<z.ZodString>;
    destinationPrice: z.ZodString;
    destinationPriceNum: z.ZodDefault<z.ZodNumber>;
    usUkBenchmarkPrice: z.ZodString;
    usUkBenchmarkPriceNum: z.ZodDefault<z.ZodNumber>;
    savingsPercentage: z.ZodDefault<z.ZodNumber>;
    hospitalStayDays: z.ZodDefault<z.ZodString>;
    totalRecoveryDays: z.ZodDefault<z.ZodString>;
    inclusiveNote: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    specialty: string;
    procedureName: string;
    destinationPrice: string;
    destinationPriceNum: number;
    usUkBenchmarkPrice: string;
    usUkBenchmarkPriceNum: number;
    savingsPercentage: number;
    hospitalStayDays: string;
    totalRecoveryDays: string;
    inclusiveNote: string;
}, {
    procedureName: string;
    destinationPrice: string;
    usUkBenchmarkPrice: string;
    specialty?: string | undefined;
    destinationPriceNum?: number | undefined;
    usUkBenchmarkPriceNum?: number | undefined;
    savingsPercentage?: number | undefined;
    hospitalStayDays?: string | undefined;
    totalRecoveryDays?: string | undefined;
    inclusiveNote?: string | undefined;
}>;
export type DestinationProcedureCost = z.infer<typeof DestinationProcedureCostSchema>;
export declare const DestinationTravelInfoSchema: z.ZodObject<{
    visaTitle: z.ZodDefault<z.ZodString>;
    visaDescription: z.ZodDefault<z.ZodString>;
    visaProcessingDays: z.ZodDefault<z.ZodString>;
    visaDocumentsNeeded: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    flightHubs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    airportPickup: z.ZodDefault<z.ZodString>;
    localTransport: z.ZodDefault<z.ZodString>;
    companionAccommodation: z.ZodDefault<z.ZodString>;
    languageAssistance: z.ZodDefault<z.ZodString>;
    currencyAndPayments: z.ZodDefault<z.ZodString>;
    bestTimeToVisit: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    visaTitle: string;
    visaDescription: string;
    visaProcessingDays: string;
    visaDocumentsNeeded: string[];
    flightHubs: string[];
    airportPickup: string;
    localTransport: string;
    companionAccommodation: string;
    languageAssistance: string;
    currencyAndPayments: string;
    bestTimeToVisit: string;
}, {
    visaTitle?: string | undefined;
    visaDescription?: string | undefined;
    visaProcessingDays?: string | undefined;
    visaDocumentsNeeded?: string[] | undefined;
    flightHubs?: string[] | undefined;
    airportPickup?: string | undefined;
    localTransport?: string | undefined;
    companionAccommodation?: string | undefined;
    languageAssistance?: string | undefined;
    currencyAndPayments?: string | undefined;
    bestTimeToVisit?: string | undefined;
}>;
export type DestinationTravelInfo = z.infer<typeof DestinationTravelInfoSchema>;
export declare const DestinationHospitalRefSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    city: z.ZodString;
    country: z.ZodString;
    image: z.ZodDefault<z.ZodString>;
    rating: z.ZodDefault<z.ZodNumber>;
    accreditations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    specialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    bedsCount: z.ZodDefault<z.ZodNumber>;
    rankBadge: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    country: string;
    rating: number;
    city: string;
    image: string;
    accreditations: string[];
    specialties: string[];
    bedsCount: number;
    rankBadge: string;
}, {
    id: string;
    slug: string;
    name: string;
    country: string;
    city: string;
    rating?: number | undefined;
    image?: string | undefined;
    accreditations?: string[] | undefined;
    specialties?: string[] | undefined;
    bedsCount?: number | undefined;
    rankBadge?: string | undefined;
}>;
export type DestinationHospitalRef = z.infer<typeof DestinationHospitalRefSchema>;
export declare const DestinationDoctorRefSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    specialty: z.ZodString;
    hospital: z.ZodString;
    experience: z.ZodDefault<z.ZodString>;
    rating: z.ZodDefault<z.ZodNumber>;
    image: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    rating: number;
    image: string;
    hospital: string;
    experience: string;
}, {
    id: string;
    slug: string;
    name: string;
    specialty: string;
    hospital: string;
    rating?: number | undefined;
    image?: string | undefined;
    experience?: string | undefined;
}>;
export type DestinationDoctorRef = z.infer<typeof DestinationDoctorRefSchema>;
export declare const DestinationFaqSchema: z.ZodObject<{
    question: z.ZodString;
    answer: z.ZodString;
}, "strip", z.ZodTypeAny, {
    question: string;
    answer: string;
}, {
    question: string;
    answer: string;
}>;
export type DestinationFaq = z.infer<typeof DestinationFaqSchema>;
export declare const DestinationDetailSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    country: z.ZodString;
    slug: z.ZodString;
    flag: z.ZodDefault<z.ZodString>;
    region: z.ZodDefault<z.ZodString>;
    heroImage: z.ZodDefault<z.ZodString>;
    galleryImages: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    title: z.ZodString;
    headline: z.ZodString;
    subheadline: z.ZodString;
    overviewMarkdown: z.ZodString;
    whyChoosePoints: z.ZodDefault<z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        icon: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        title: string;
        description: string;
        icon: string;
    }, {
        title: string;
        description: string;
        icon?: string | undefined;
    }>, "many">>;
    metrics: z.ZodObject<{
        accreditedHospitalsCount: z.ZodDefault<z.ZodString>;
        avgSavingsPercentage: z.ZodDefault<z.ZodString>;
        annualMedicalTourists: z.ZodDefault<z.ZodString>;
        visaProcessingTime: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        accreditedHospitalsCount: string;
        avgSavingsPercentage: string;
        annualMedicalTourists: string;
        visaProcessingTime: string;
    }, {
        accreditedHospitalsCount?: string | undefined;
        avgSavingsPercentage?: string | undefined;
        annualMedicalTourists?: string | undefined;
        visaProcessingTime?: string | undefined;
    }>;
    popularProcedures: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    costTable: z.ZodDefault<z.ZodArray<z.ZodObject<{
        procedureName: z.ZodString;
        specialty: z.ZodDefault<z.ZodString>;
        destinationPrice: z.ZodString;
        destinationPriceNum: z.ZodDefault<z.ZodNumber>;
        usUkBenchmarkPrice: z.ZodString;
        usUkBenchmarkPriceNum: z.ZodDefault<z.ZodNumber>;
        savingsPercentage: z.ZodDefault<z.ZodNumber>;
        hospitalStayDays: z.ZodDefault<z.ZodString>;
        totalRecoveryDays: z.ZodDefault<z.ZodString>;
        inclusiveNote: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        specialty: string;
        procedureName: string;
        destinationPrice: string;
        destinationPriceNum: number;
        usUkBenchmarkPrice: string;
        usUkBenchmarkPriceNum: number;
        savingsPercentage: number;
        hospitalStayDays: string;
        totalRecoveryDays: string;
        inclusiveNote: string;
    }, {
        procedureName: string;
        destinationPrice: string;
        usUkBenchmarkPrice: string;
        specialty?: string | undefined;
        destinationPriceNum?: number | undefined;
        usUkBenchmarkPriceNum?: number | undefined;
        savingsPercentage?: number | undefined;
        hospitalStayDays?: string | undefined;
        totalRecoveryDays?: string | undefined;
        inclusiveNote?: string | undefined;
    }>, "many">>;
    hospitals: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
        city: z.ZodString;
        country: z.ZodString;
        image: z.ZodDefault<z.ZodString>;
        rating: z.ZodDefault<z.ZodNumber>;
        accreditations: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        specialties: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        bedsCount: z.ZodDefault<z.ZodNumber>;
        rankBadge: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        slug: string;
        name: string;
        country: string;
        rating: number;
        city: string;
        image: string;
        accreditations: string[];
        specialties: string[];
        bedsCount: number;
        rankBadge: string;
    }, {
        id: string;
        slug: string;
        name: string;
        country: string;
        city: string;
        rating?: number | undefined;
        image?: string | undefined;
        accreditations?: string[] | undefined;
        specialties?: string[] | undefined;
        bedsCount?: number | undefined;
        rankBadge?: string | undefined;
    }>, "many">>;
    doctors: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
        specialty: z.ZodString;
        hospital: z.ZodString;
        experience: z.ZodDefault<z.ZodString>;
        rating: z.ZodDefault<z.ZodNumber>;
        image: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        rating: number;
        image: string;
        hospital: string;
        experience: string;
    }, {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        hospital: string;
        rating?: number | undefined;
        image?: string | undefined;
        experience?: string | undefined;
    }>, "many">>;
    travelInfo: z.ZodDefault<z.ZodObject<{
        visaTitle: z.ZodDefault<z.ZodString>;
        visaDescription: z.ZodDefault<z.ZodString>;
        visaProcessingDays: z.ZodDefault<z.ZodString>;
        visaDocumentsNeeded: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        flightHubs: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
        airportPickup: z.ZodDefault<z.ZodString>;
        localTransport: z.ZodDefault<z.ZodString>;
        companionAccommodation: z.ZodDefault<z.ZodString>;
        languageAssistance: z.ZodDefault<z.ZodString>;
        currencyAndPayments: z.ZodDefault<z.ZodString>;
        bestTimeToVisit: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        visaTitle: string;
        visaDescription: string;
        visaProcessingDays: string;
        visaDocumentsNeeded: string[];
        flightHubs: string[];
        airportPickup: string;
        localTransport: string;
        companionAccommodation: string;
        languageAssistance: string;
        currencyAndPayments: string;
        bestTimeToVisit: string;
    }, {
        visaTitle?: string | undefined;
        visaDescription?: string | undefined;
        visaProcessingDays?: string | undefined;
        visaDocumentsNeeded?: string[] | undefined;
        flightHubs?: string[] | undefined;
        airportPickup?: string | undefined;
        localTransport?: string | undefined;
        companionAccommodation?: string | undefined;
        languageAssistance?: string | undefined;
        currencyAndPayments?: string | undefined;
        bestTimeToVisit?: string | undefined;
    }>>;
    faqs: z.ZodDefault<z.ZodArray<z.ZodObject<{
        question: z.ZodString;
        answer: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        question: string;
        answer: string;
    }, {
        question: string;
        answer: string;
    }>, "many">>;
    active: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    id: string;
    title: string;
    slug: string;
    name: string;
    country: string;
    flag: string;
    region: string;
    heroImage: string;
    galleryImages: string[];
    headline: string;
    subheadline: string;
    overviewMarkdown: string;
    whyChoosePoints: {
        title: string;
        description: string;
        icon: string;
    }[];
    metrics: {
        accreditedHospitalsCount: string;
        avgSavingsPercentage: string;
        annualMedicalTourists: string;
        visaProcessingTime: string;
    };
    popularProcedures: string[];
    costTable: {
        specialty: string;
        procedureName: string;
        destinationPrice: string;
        destinationPriceNum: number;
        usUkBenchmarkPrice: string;
        usUkBenchmarkPriceNum: number;
        savingsPercentage: number;
        hospitalStayDays: string;
        totalRecoveryDays: string;
        inclusiveNote: string;
    }[];
    hospitals: {
        id: string;
        slug: string;
        name: string;
        country: string;
        rating: number;
        city: string;
        image: string;
        accreditations: string[];
        specialties: string[];
        bedsCount: number;
        rankBadge: string;
    }[];
    doctors: {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        rating: number;
        image: string;
        hospital: string;
        experience: string;
    }[];
    travelInfo: {
        visaTitle: string;
        visaDescription: string;
        visaProcessingDays: string;
        visaDocumentsNeeded: string[];
        flightHubs: string[];
        airportPickup: string;
        localTransport: string;
        companionAccommodation: string;
        languageAssistance: string;
        currencyAndPayments: string;
        bestTimeToVisit: string;
    };
    faqs: {
        question: string;
        answer: string;
    }[];
    active: boolean;
}, {
    id: string;
    title: string;
    slug: string;
    name: string;
    country: string;
    headline: string;
    subheadline: string;
    overviewMarkdown: string;
    metrics: {
        accreditedHospitalsCount?: string | undefined;
        avgSavingsPercentage?: string | undefined;
        annualMedicalTourists?: string | undefined;
        visaProcessingTime?: string | undefined;
    };
    flag?: string | undefined;
    region?: string | undefined;
    heroImage?: string | undefined;
    galleryImages?: string[] | undefined;
    whyChoosePoints?: {
        title: string;
        description: string;
        icon?: string | undefined;
    }[] | undefined;
    popularProcedures?: string[] | undefined;
    costTable?: {
        procedureName: string;
        destinationPrice: string;
        usUkBenchmarkPrice: string;
        specialty?: string | undefined;
        destinationPriceNum?: number | undefined;
        usUkBenchmarkPriceNum?: number | undefined;
        savingsPercentage?: number | undefined;
        hospitalStayDays?: string | undefined;
        totalRecoveryDays?: string | undefined;
        inclusiveNote?: string | undefined;
    }[] | undefined;
    hospitals?: {
        id: string;
        slug: string;
        name: string;
        country: string;
        city: string;
        rating?: number | undefined;
        image?: string | undefined;
        accreditations?: string[] | undefined;
        specialties?: string[] | undefined;
        bedsCount?: number | undefined;
        rankBadge?: string | undefined;
    }[] | undefined;
    doctors?: {
        id: string;
        slug: string;
        name: string;
        specialty: string;
        hospital: string;
        rating?: number | undefined;
        image?: string | undefined;
        experience?: string | undefined;
    }[] | undefined;
    travelInfo?: {
        visaTitle?: string | undefined;
        visaDescription?: string | undefined;
        visaProcessingDays?: string | undefined;
        visaDocumentsNeeded?: string[] | undefined;
        flightHubs?: string[] | undefined;
        airportPickup?: string | undefined;
        localTransport?: string | undefined;
        companionAccommodation?: string | undefined;
        languageAssistance?: string | undefined;
        currencyAndPayments?: string | undefined;
        bestTimeToVisit?: string | undefined;
    } | undefined;
    faqs?: {
        question: string;
        answer: string;
    }[] | undefined;
    active?: boolean | undefined;
}>;
export type DestinationDetail = z.infer<typeof DestinationDetailSchema>;
export declare const DestinationCardItemSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    country: z.ZodString;
    region: z.ZodEnum<["India Hubs", "Americas", "Asia", "Europe & Middle East"]>;
    flag: z.ZodString;
    image: z.ZodString;
    hospitalCount: z.ZodNumber;
    savingsPercentage: z.ZodNumber;
    visaProcessingDays: z.ZodString;
    flightConnectivity: z.ZodString;
    cityHighlights: z.ZodString;
    popularProcedures: z.ZodArray<z.ZodString, "many">;
    tagline: z.ZodString;
    featured: z.ZodBoolean;
    type: z.ZodEnum<["country", "city"]>;
}, "strip", z.ZodTypeAny, {
    type: "country" | "city";
    id: string;
    slug: string;
    name: string;
    country: string;
    savingsPercentage: number;
    visaProcessingDays: string;
    image: string;
    flag: string;
    region: "Asia" | "India Hubs" | "Americas" | "Europe & Middle East";
    popularProcedures: string[];
    hospitalCount: number;
    flightConnectivity: string;
    cityHighlights: string;
    tagline: string;
    featured: boolean;
}, {
    type: "country" | "city";
    id: string;
    slug: string;
    name: string;
    country: string;
    savingsPercentage: number;
    visaProcessingDays: string;
    image: string;
    flag: string;
    region: "Asia" | "India Hubs" | "Americas" | "Europe & Middle East";
    popularProcedures: string[];
    hospitalCount: number;
    flightConnectivity: string;
    cityHighlights: string;
    tagline: string;
    featured: boolean;
}>;
export interface DestinationCardItem {
    id: string;
    name: string;
    slug: string;
    country: string;
    region: "India Hubs" | "Americas" | "Asia" | "Europe & Middle East";
    flag: string;
    image: string;
    hospitalCount: number;
    savingsPercentage: number;
    visaProcessingDays: string;
    flightConnectivity: string;
    cityHighlights: string;
    popularProcedures: string[];
    tagline: string;
    featured: boolean;
    type: "country" | "city";
}
export declare const ALL_DESTINATIONS: DestinationCardItem[];
export declare const DESTINATION_REGIONS: readonly ["All Destinations", "India Hubs", "Americas", "Asia", "Europe & Middle East"];
export declare const MEXICO_DESTINATION_DETAIL: DestinationDetail;
export declare const INDIA_DESTINATION_DETAIL: DestinationDetail;
export declare const THAILAND_DESTINATION_DETAIL: DestinationDetail;
export declare const TURKEY_DESTINATION_DETAIL: DestinationDetail;
export declare function getDestinationDetail(slug: string, customList?: DestinationDetail[]): DestinationDetail | undefined;
//# sourceMappingURL=destinations.d.ts.map