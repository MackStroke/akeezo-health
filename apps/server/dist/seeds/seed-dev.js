import { connectDB, disconnectDB } from "../db/connection.js";
import { SiteSettings, Page, ContentRevision, RouteEntry } from "../db/models/index.js";
const SEED_PAGES = [
    {
        slug: "home",
        path: "/",
        pageKind: "home",
        title: "AKEEZO | Heal In India, Heal By Akeezo - Medical Tourism & Treatment in India",
        description: "Discover accredited Indian hospitals, consult top doctors, and receive guided care coordination and transparent cost estimates.",
        payload: {
            headline: "World-Class Medical Care in India, Simplified & Guided",
            tagline: "Heal In India, Heal By Akeezo"
        }
    },
    {
        slug: "privacy",
        path: "/privacy",
        pageKind: "legal",
        title: "Privacy Policy | AKEEZO Healthcare Platform",
        description: "How AKEEZO protects health data under GDPR, HIPAA, and the Indian Digital Personal Data Protection (DPDP) Act 2023.",
        payload: {
            documentId: "privacy",
            category: "Data Protection"
        }
    },
    {
        slug: "terms",
        path: "/terms",
        pageKind: "legal",
        title: "Terms of Service | AKEEZO Healthcare Platform",
        description: "Terms and conditions governing healthcare discovery and coordination services by AKEEZO Healthcare Platform Private Limited.",
        payload: {
            documentId: "terms",
            category: "Legal Agreement"
        }
    },
    {
        slug: "disclaimer",
        path: "/disclaimer",
        pageKind: "legal",
        title: "Medical Disclaimer | AKEEZO Healthcare Platform",
        description: "Important medical disclaimer regarding platform scope, non-clinical role, and emergency medical procedures.",
        payload: {
            documentId: "disclaimer",
            category: "Medical Notice"
        }
    },
    {
        slug: "consent",
        path: "/consent",
        pageKind: "legal",
        title: "Patient Consent & Teleconsultation Agreement | AKEEZO",
        description: "Informed patient consent for medical coordination, record sharing, and cross-border data transfer under Standard Contractual Clauses.",
        payload: {
            documentId: "consent",
            category: "Patient Authorization"
        }
    },
    {
        slug: "refund-policy",
        path: "/refund-policy",
        pageKind: "legal",
        title: "Refund Policy | AKEEZO Healthcare Platform",
        description: "AKEEZO Service Surety money-back commitment and advisory fee cancellation terms.",
        payload: {
            documentId: "refund-policy",
            category: "Financial Policy"
        }
    },
    {
        slug: "grievance-officer",
        path: "/grievance-officer",
        pageKind: "legal",
        title: "Grievance Redressal Officer | AKEEZO Healthcare Platform",
        description: "Designated Grievance Redressal Officer details under IT Intermediary Guidelines and DPDP Act 2023.",
        payload: {
            documentId: "grievance-officer",
            category: "Compliance & Governance"
        }
    },
    {
        slug: "cost-calculator",
        path: "/cost-calculator",
        pageKind: "calculatorLanding",
        title: "Surgery Cost Calculator Tool | Save up to 70% | AKEEZO",
        description: "Compare surgery costs across top medical destinations and accredited international hospitals. Get transparent estimates and connect with world-class surgeons.",
        payload: {}
    },
    {
        slug: "treatments",
        path: "/treatments",
        pageKind: "treatmentDirectory",
        title: "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO",
        description: "Discover comprehensive medical treatments worldwide. Compare prices, read reviews, and find accredited international healthcare options with AKEEZO.",
        payload: {
            headline: "Find The Best Treatments Worldwide",
            subheadline: "World-class care, anywhere in the world."
        }
    },
    {
        slug: "hospitals",
        path: "/hospitals",
        pageKind: "hospitalDirectory",
        title: "World-Class Hospitals | Personally Matched for You | AKEEZO",
        description: "Find and compare top accredited hospitals globally. Transparent estimates, verified patient satisfaction ratings, and complete care coordination with AKEEZO.",
        payload: {
            headline: "World-Class Hospitals, Personally Matched for You",
            subheadline: "Find the Best Hospitals for Your Treatment, Anywhere in the World"
        }
    },
    {
        slug: "doctors",
        path: "/doctors",
        pageKind: "doctorDirectory",
        title: "World-Class Doctors | Find Best Specialists Worldwide | AKEEZO",
        description: "Search, compare, and connect with premier surgeons and medical specialists globally. Direct hospital pricing, accredited experts, and free assistance.",
        payload: {
            headline: "World-Class Doctors, Personally Matched for You",
            subheadline: "Search, compare, and connect with leading specialists across the globe."
        }
    }
];
export async function seedDev() {
    console.log("[Seed] Starting development data seed...");
    await connectDB();
    // 1. Upsert SiteSettings
    console.log("[Seed] Upserting SiteSettings singleton...");
    const siteSettings = await SiteSettings.findOneAndUpdate({ environment: "development" }, {
        $set: {
            environment: "development",
            brandName: "AKEEZO",
            tagline: "Heal In India, Heal By Akeezo",
            logoVariants: {
                light: "/logo/logo with tagline-light.svg",
                dark: "/logo/logo with tagline-dark.svg",
                mark: "/logo/favicon.svg"
            },
            primaryColor: "#00C7BE",
            secondaryColor: "#FF6B00",
            accentColor: "#FF6D1B",
            actionColor: "#007A6C",
            contactEmail: "care@akeezo.com",
            careEmail: "care@akeezo.com",
            medicalEmail: "medical@akeezo.com",
            partnershipEmail: "partnership@akeezo.com",
            emergencyHelpline: "+91 82876 39443",
            whatsappHelpline: "+91 82876 39443",
            headquartersAddress: "Regus Elegance, Jasola District Centre, New Delhi, India 110025",
            grievanceOfficer: {
                name: "Yogesh Verma",
                designation: "Co-Founder & Chief Operating Officer",
                email: "grievance@akeezo.com",
                helpline: "+91 82876 39443",
                address: "Regus Elegance, Jasola District Centre, New Delhi, India 110025"
            },
            dpoContact: {
                email: "dpo@akeezo.com",
                address: "AKEEZO Healthcare Platform Private Limited, New Delhi, India 110001"
            },
            socialLinks: {
                linkedin: "https://www.linkedin.com/company/akeezo",
                twitter: "https://twitter.com/akeezohealth",
                facebook: "https://www.facebook.com/akeezohealth",
                instagram: "https://www.instagram.com/akeezohealth",
                youtube: "https://www.youtube.com/@akeezo"
            },
            version: 1
        }
    }, { upsert: true, new: true });
    console.log(`[Seed] SiteSettings configured (ID: ${siteSettings._id}).`);
    // 2. Upsert Pages, ContentRevisions, and RouteEntries
    for (const item of SEED_PAGES) {
        console.log(`[Seed] Seeding route ${item.path}...`);
        // A. Upsert Page
        let page = await Page.findOne({ slug: item.slug, locale: "en" });
        if (!page) {
            page = new Page({
                entityType: "page",
                slug: item.slug,
                locale: "en",
                localeGroupId: `group_${item.slug}`,
                status: "published",
                version: 1
            });
            await page.save();
        }
        // B. Upsert ContentRevision
        let revision = await ContentRevision.findOne({
            entityType: "page",
            entityId: page._id,
            locale: "en",
            revisionNumber: 1
        });
        if (!revision) {
            revision = new ContentRevision({
                entityType: "page",
                entityId: page._id,
                locale: "en",
                revisionNumber: 1,
                schemaVersion: "1.0.0",
                payload: item.payload || {},
                seo: {
                    title: item.title,
                    description: item.description,
                    canonicalPath: item.path,
                    robots: "index,follow",
                    schemaKind: item.pageKind === "legal" ? "MedicalWebPage" : "WebPage"
                },
                sourceReferences: [
                    {
                        urlOrId: `https://akeezo.com${item.path}`,
                        publisher: "AKEEZO Healthcare Platform Private Limited",
                        checkedAt: new Date("2026-09-13T00:00:00Z"),
                        claimScope: "Audited production baseline",
                        evidenceOwner: "Legal and Compliance Department"
                    }
                ]
            });
            await revision.save();
        }
        // Link publishedRevisionId on Page
        page.publishedRevisionId = revision._id;
        page.status = "published";
        await page.save();
        // C. Upsert RouteEntry
        await RouteEntry.findOneAndUpdate({ locale: "en", path: item.path }, {
            $set: {
                locale: "en",
                path: item.path,
                pageKind: item.pageKind,
                entityId: page._id,
                publishedRevisionId: revision._id,
                statusCode: 200
            }
        }, { upsert: true, new: true });
        console.log(`[Seed] Route ${item.path} linked to Revision ${revision._id}`);
    }
    console.log("[Seed] Development seeding completed successfully.");
    await disconnectDB();
}
// Self-invoking when run as script
if (process.argv[1] &&
    (process.argv[1].endsWith("seed-dev.ts") || process.argv[1].endsWith("seed-dev.js"))) {
    seedDev()
        .then(() => process.exit(0))
        .catch((err) => {
        console.error("[Seed] Error executing seed script:", err);
        process.exit(1);
    });
}
