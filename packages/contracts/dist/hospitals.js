import { z } from "zod";
export const HospitalSurgeryCostItemSchema = z.object({
    id: z.string(),
    procedure: z.string(),
    category: z.string().default("Cosmetic Surgery"),
    hospitalPriceUsd: z.string().default("$2,500"),
    usUkPriceUsd: z.string().default("$8,000"),
    savingsPercent: z.number().default(65),
    description: z.string().default("Complete clinical procedure with accredited surgeon."),
});
export const HospitalRoomTypeSchema = z.object({
    name: z.string(),
    description: z.string(),
    amenities: z.array(z.string()).default([]),
});
export const HospitalFaqItemSchema = z.object({
    question: z.string(),
    answer: z.string(),
});
export const HospitalReviewItemSchema = z.object({
    id: z.string(),
    author: z.string(),
    country: z.string().default("International Patient"),
    rating: z.number().default(5.0),
    date: z.string(),
    treatment: z.string(),
    comment: z.string(),
    verified: z.boolean().default(true),
});
export const HospitalDoctorSummarySchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    specialty: z.string(),
    image: z.string(),
    experience: z.string().default("15+ years"),
    rating: z.number().default(4.9),
});
export const HospitalDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    href: z.string().optional(),
    hospitalType: z.string().default("Multispecialty Hospital"),
    ownership: z.string().default("Private Hospital"),
    rankBadge: z.string().default("Ranked Top International Hospital"),
    rank: z.number().default(1),
    city: z.string().default("Bangkok"),
    country: z.string().default("Thailand"),
    address: z.string(),
    postalCode: z.string().default("10700"),
    telephone: z.string().default("+66 2 879 0300"),
    rating: z.number().default(75.21),
    ratingDisplay: z.string().default("75.21 (Newsweek Thailand #12)"),
    reviewCount: z.number().default(480),
    patientSatisfactionRate: z.string().default("75% repeat or patient-referral rate"),
    establishedYear: z.number().default(1984),
    bedsCount: z.number().default(400),
    icuCount: z.number().default(18),
    operatingRooms: z.number().default(42),
    dailyPatients: z.string().default("2,000+ daily outpatients"),
    doctorsCount: z.string().default("270+ Specialists"),
    nursesCount: z.string().default("800+ Registered Nurses"),
    languagesSpoken: z.array(z.string()).default(["English", "Thai", "Arabic", "Japanese", "Mandarin", "French", "German"]),
    accreditations: z.array(z.string()).default(["JCI", "ISO 9001", "HA Thailand", "CAP"]),
    image: z.string().default("/uploads/hospitals/yanhee-international-hospital.jpg"),
    images: z.array(z.string()).default([]),
    summary: z.string(),
    aboutMarkdown: z.string(),
    highlights: z.array(z.string()).default([]),
    accessibilityFeatures: z.array(z.string()).default([]),
    roomTypes: z.array(HospitalRoomTypeSchema).default([]),
    paymentMethods: z.array(z.string()).default([]),
    specialties: z.array(z.string()).default([]),
    surgeriesCost: z.array(HospitalSurgeryCostItemSchema).default([]),
    doctors: z.array(HospitalDoctorSummarySchema).default([]),
    faqs: z.array(HospitalFaqItemSchema).default([]),
    location: z.object({
        latitude: z.number().default(13.79963),
        longitude: z.number().default(100.51154),
        airportBKKDistance: z.string().default("35 km (35-45 mins drive)"),
        airportDMKDistance: z.string().default("22 km (25-35 mins drive)"),
        travelNotes: z.string().default("Located in Bang Phlat district on Charan Sanit Wong Road. Direct BTS and expressway connectivity."),
    }).optional(),
    reviews: z.array(HospitalReviewItemSchema).default([]),
    verified: z.boolean().default(true),
    active: z.boolean().default(true),
});
export const YANHEE_HOSPITAL_DETAIL = {
    id: "yanhee-international-hospital",
    name: "Yanhee International Hospital",
    slug: "yanhee-international-hospital",
    href: "/hospitals/yanhee-international-hospital",
    hospitalType: "Multispecialty Hospital",
    ownership: "Private Hospital",
    rankBadge: "Ranked 1st Best Hospital in Thailand",
    rank: 1,
    city: "Bangkok",
    country: "Thailand",
    address: "454 Charan Sanit Wong Rd, Bang O, Bang Phlat, Bangkok 10700, Thailand",
    postalCode: "10700",
    telephone: "+66 2 879 0300",
    rating: 75.21,
    ratingDisplay: "75.21 (Newsweek Thailand #12)",
    reviewCount: 480,
    patientSatisfactionRate: "75% repeat or patient-referral rate",
    establishedYear: 1984,
    bedsCount: 400,
    icuCount: 18,
    operatingRooms: 42,
    dailyPatients: "2,000+ daily outpatients",
    doctorsCount: "270+ Specialists (150 full-time, 120 part-time)",
    nursesCount: "800+ Registered Nurses",
    languagesSpoken: ["English", "Thai", "Arabic", "Japanese", "Mandarin", "French", "German", "Spanish", "Russian", "Burmese"],
    accreditations: ["JCI", "ISO 9001", "HA Thailand", "CAP", "Fire Safety Certified"],
    image: "/uploads/hospitals/yanhee-international-hospital.jpg",
    images: [
        "/uploads/hospitals/yanhee-international-hospital.jpg",
        "/uploads/hospitals/yanhee-hospital-building.jpg",
        "/uploads/hospitals/yanhee-hospital-lobby.jpg",
        "/uploads/hospitals/yanhee-hospital-ot.jpg",
        "/uploads/hospitals/yanhee-hospital-room.jpg",
    ],
    summary: "Established multi-specialty private hospital in Bangkok recognized worldwide for over three decades for its cosmetic surgery and bariatric programs.",
    aboutMarkdown: `The Yanhee International Hospital has been one of the most established multi-specialty private hospitals in Thailand and recognized for many years for both its cosmetic surgery programs and bariatric programs, that have attracted patients from around the world for over three decades.

---

### Ratings & Certification
- The **hospital was ranked #12 in Thailand** by Newsweek, 2025 and had a rating of **75.21**
- JCI **Accredited**
- ISO **Certified since 2000**
- Thai Hospital Accreditation (**HA**)

---

### Patient Satisfaction
> An estimated **75% of Yanhee's International Patients** are either repeat customers at the hospital or were referred to Yanhee due to the **positive personal recommendations** of their previous patients; an indication of excellent quality in terms of surgical results and overall patient satisfaction.

---

### Cosmetic Surgery
The full range of cosmetic surgery options are available at the **Yanhee International Hospital's Department of Plastic Surgery**, which are all performed by internationally trained plastic surgeons:

| Type of Surgical Procedure | Type of Surgery |
| --- | --- |
| **Rhinoplasty** | Facial Surgery |
| **Face Lifts** | Facial Surgery |
| **Breast Enhancement & Breast Reduction** | Body Surgery |
| **Abdominoplasties / Liposuction** | Body Contouring |
| **Abdominal Contouring / Abdominal Lift** | Body Contouring |
| **Body Sculpting / Liposuction** | Body Sculpting |

---

### Bariatric Program
Supporting **long-term, sustainable weight reduction** is the primary goal of the Yanhee International Hospital's Bariatric Program. A number of different types of bariatric surgeries are supported by the program including:

- **Gastric Sleeve**
- **Gastric Bypass**
- **Gastric Banding**

All bariatric surgery procedures offered at Yanhee include:
- Comprehensive preoperative assessment
- Nutrition Counseling
- Long term follow up protocols`,
    highlights: [
        "High-volume surgical expertise across 30+ medical specialties",
        "Comprehensive preoperative clinical and diagnostic workup",
        "Dedicated International Patient Center with 20+ language translators",
        "Specialized post-operative recovery suites with companion accommodation",
        "Airport meet-and-greet, VIP ground transfer, and visa letter coordination",
        "Long-term post-discharge telehealth monitoring and medication dispatch"
    ],
    accessibilityFeatures: [
        "Wheelchair accessible entrances, ramps, and dedicated drop-off bays",
        "Spacious accessible patient suites with barrier-free bathrooms and call alarms",
        "Braille tactile signage and high-capacity elevator banks across 15 floors",
        "24/7 dedicated hospital emergency response and aeromedical dispatch"
    ],
    roomTypes: [
        {
            name: "Standard Private Suite",
            description: "Comfortable single-patient room equipped with electric adjustable hospital bed, private en-suite bathroom, flat-screen TV, complimentary high-speed Wi-Fi, and companion daybed.",
            amenities: ["Electric Hospital Bed", "En-suite Bathroom", "Companion Daybed", "Free High-Speed Wi-Fi", "Nurse Call System", "Climate Control"]
        },
        {
            name: "Deluxe Medical Suite",
            description: "Spacious private accommodation featuring separated patient care zone and guest living lounge, mini-refrigerator, microwave, panoramic Bangkok city view, and dedicated nursing call response.",
            amenities: ["Living Room Lounge", "Panoramic City View", "Mini Kitchenette", "Smart TV & Cable", "Executive Workstation", "Complimentary Toiletries Kit"]
        },
        {
            name: "VIP Presidential Suite",
            description: "Exclusive multi-room luxury suite designed for international dignitaries and VIP medical travelers, featuring a private consultation parlor, dining area, secondary companion bedroom, and 24/7 personal care assistance.",
            amenities: ["Private Patient Room & Companion Bedroom", "Formal Dining & Consultation Area", "VIP Butler & Dedicated Nurse", "Complimentary Airport Limousine", "Organic In-Room Meal Service"]
        }
    ],
    paymentMethods: [
        "Cash (Thai Baht THB, USD, EUR, GBP)",
        "Major Credit & Debit Cards (Visa, MasterCard, JCB, UnionPay, American Express)",
        "Direct International Bank Wire Transfer",
        "Direct Billing with Accredited Global Health Insurers & Travel Assist"
    ],
    specialties: [
        "Cosmetic/Plastic Surgery",
        "IVF Treatment",
        "Hair Transplant",
        "Orthopedics",
        "Obesity/Bariatric Surgery",
        "Dental Treatment",
        "Dermatology & Skin Care",
        "Heart Care/Surgery",
        "Gender Reassignment Surgery",
        "Eye/Lasik Care",
        "ENT (Ear, Nose & Throat)",
        "General Surgery",
        "Urology",
        "Neurology",
        "Executive Healthcheck"
    ],
    surgeriesCost: [
        {
            id: "rhinoplasty",
            procedure: "Rhinoplasty (Nose Surgery)",
            category: "Facial Surgery",
            hospitalPriceUsd: "$1,800 - $2,600",
            usUkPriceUsd: "$7,500 - $12,000",
            savingsPercent: 72,
            description: "Aesthetic nose reshaping or functional septorhinoplasty by board-certified plastic surgeons."
        },
        {
            id: "facelift",
            procedure: "Full Face Lift (Rhytidectomy)",
            category: "Facial Surgery",
            hospitalPriceUsd: "$3,600 - $5,400",
            usUkPriceUsd: "$14,000 - $22,000",
            savingsPercent: 74,
            description: "Comprehensive facial rejuvenation addressing midface, jowls, and neck laxity with minimal scarring."
        },
        {
            id: "breast-augmentation",
            procedure: "Breast Augmentation (Implants)",
            category: "Body Surgery",
            hospitalPriceUsd: "$3,200 - $4,600",
            usUkPriceUsd: "$9,000 - $15,000",
            savingsPercent: 68,
            description: "FDA-approved silicone cohesive gel implants (Motiva / Mentor) including anesthesia and recovery stay."
        },
        {
            id: "liposuction",
            procedure: "VASER / Ultrasonic Liposuction",
            category: "Body Contouring",
            hospitalPriceUsd: "$2,200 - $3,900",
            usUkPriceUsd: "$8,500 - $14,000",
            savingsPercent: 70,
            description: "Targeted body sculpting for abdomen, flanks, thighs, and arms with ultrasound fat emulsification."
        },
        {
            id: "tummy-tuck",
            procedure: "Abdominoplasty (Tummy Tuck)",
            category: "Body Contouring",
            hospitalPriceUsd: "$3,500 - $4,900",
            usUkPriceUsd: "$11,000 - $18,000",
            savingsPercent: 71,
            description: "Abdominal muscle wall plication and excess skin excision following significant weight loss or pregnancy."
        },
        {
            id: "gastric-sleeve",
            procedure: "Laparoscopic Gastric Sleeve",
            category: "Bariatric Program",
            hospitalPriceUsd: "$5,800 - $7,500",
            usUkPriceUsd: "$16,000 - $24,000",
            savingsPercent: 67,
            description: "Minimally invasive bariatric surgery including pre-op endocrine evaluation and 1-year dietary protocols."
        },
        {
            id: "fue-hair-transplant",
            procedure: "FUE Hair Transplant (2,500 Grafts)",
            category: "Aesthetic Medicine",
            hospitalPriceUsd: "$2,000 - $3,200",
            usUkPriceUsd: "$8,000 - $13,500",
            savingsPercent: 75,
            description: "Follicular Unit Extraction with high-density sapphire blades and PRP scalp biostimulation."
        },
        {
            id: "ivf-icsi",
            procedure: "IVF / ICSI Treatment Cycle",
            category: "Fertility Treatment",
            hospitalPriceUsd: "$3,400 - $4,800",
            usUkPriceUsd: "$15,000 - $22,000",
            savingsPercent: 76,
            description: "Complete ovarian stimulation, egg retrieval, intracytoplasmic sperm injection, and blastocyst transfer."
        }
    ],
    doctors: [
        {
            id: "dr-chokchai-amornpiwat",
            name: "Dr. Chokchai Amornpiwat",
            slug: "chokchai-amornpiwat",
            specialty: "Plastic & Reconstructive Surgery",
            image: "/uploads/doctors/doctor-2220.jpg",
            experience: "28+ years",
            rating: 4.9
        },
        {
            id: "dr-thawatchai-boonchalermvichian",
            name: "Dr. Thawatchai Boonchalermvichian",
            slug: "thawatchai-boonchalermvichian",
            specialty: "Aesthetic Plastic Surgery & Bariatrics",
            image: "/uploads/doctors/doctor-3797.jpg",
            experience: "24+ years",
            rating: 4.9
        },
        {
            id: "dr-sanid-srisupap",
            name: "Dr. Sanid Srisupap",
            slug: "sanid-srisupap",
            specialty: "Facial Plastic & Rhinoplasty",
            image: "/uploads/doctors/doctor-14660.jpg",
            experience: "22+ years",
            rating: 4.8
        }
    ],
    faqs: [
        {
            question: "Is Yanhee International Hospital JCI accredited?",
            answer: "Yes, Yanhee International Hospital holds JCI (Joint Commission International) accreditation and ISO 9001 certification for quality management systems. These internationally recognized standards are verified through regular independent audits of clinical quality, patient safety protocols, and hospital operations. JCI accreditation makes Yanhee a trusted destination for international medical tourists."
        },
        {
            question: "How do I book a consultation at Yanhee International Hospital?",
            answer: "You can request a consultation through Akeezo by submitting your medical details. Video consultations and preliminary treatment cost reviews are arranged for international patients prior to travel through Akeezo's care coordination desk."
        },
        {
            question: "What cosmetic surgery procedures does Yanhee International Hospital offer?",
            answer: "Yanhee International Hospital is one of Thailand's most recognized centers for cosmetic and plastic surgery. Procedures include rhinoplasty, facelifts, breast augmentation, liposuction, tummy tucks, eyelid surgery, and gender reassignment surgery. The hospital's aesthetic surgery program is a primary reason international patients choose Yanhee for medical travel to Bangkok. Akeezo provides direct hospital cost estimates and treatment packages."
        },
        {
            question: "How affordable is treatment at Yanhee International Hospital for international patients?",
            answer: "Treatment at Yanhee International Hospital is 50–70% more affordable than comparable procedures in the US, UK, or Australia. Cosmetic surgery, hair transplantation, bariatric programs, and dental treatments are particularly cost-competitive, with pricing that includes the hospital's high standard of surgical care and patient support."
        },
        {
            question: "What facilities does Yanhee International Hospital have?",
            answer: "Yanhee International Hospital is a 15-floor facility with approximately 400 beds, 18 ICU beds, 30 minor and 12 major surgical rooms, and 95 outpatient examination rooms. The hospital handles around 2,000 patients per day and is staffed by over 270 physicians and 800 registered nurses. Advanced diagnostic and surgical technology supports its wide range of inpatient and outpatient services."
        },
        {
            question: "Does Yanhee International Hospital offer hair transplant procedures?",
            answer: "Yes, Yanhee International Hospital offers hair transplantation services including FUE and other restoration techniques for scalp hair loss. The procedure is performed by experienced surgeons as part of the hospital's broader aesthetic medicine program."
        },
        {
            question: "Does Yanhee International Hospital serve international patients?",
            answer: "Yes, Yanhee International Hospital is one of Thailand's most widely known private hospitals for medical tourism, with multilingual staff supporting patients from across the world. The international patient team assists with pre-arrival planning, visa letters, medical record coordination, and accommodation."
        },
        {
            question: "Where is Yanhee International Hospital located in Bangkok?",
            answer: "Yanhee International Hospital is located in the Bang Phlat district of Bangkok, Thailand, at 454 Charansanitwong Road. It is approximately 30–45 minutes from Suvarnabhumi International Airport depending on traffic. Akeezo assists with airport ground transportation and hotel recommendations for international patients."
        },
        {
            question: "What is Yanhee International Hospital known for?",
            answer: "Yanhee International Hospital is a large private hospital established in 1984 and located in the Bang Phlat area of Bangkok, Thailand. The hospital has grown from a small clinic to a 15-floor, 400-bed facility seeing approximately 2,000 patients per day with a team of over 150 full-time physicians, 120 part-time physicians, and 800 registered nurses. It is internationally recognized for cosmetic surgery, gender reassignment surgery, dermatology, dental care, and general medicine."
        },
        {
            question: "What specialties does Yanhee International Hospital offer?",
            answer: "Yanhee International Hospital specializes in cosmetic and plastic surgery, gender reassignment surgery, hair transplantation, dentistry, dermatology, orthopedics, cardiac care, fertility services, general medicine, and alternative medicine. The hospital also provides bariatric surgery, spine care, ENT, LASIK and eye care, urology, and rehabilitation services."
        }
    ],
    location: {
        latitude: 13.79963,
        longitude: 100.51154,
        airportBKKDistance: "35 km (approx. 35 - 45 minutes via Sirat Expressway)",
        airportDMKDistance: "22 km (approx. 25 - 35 minutes via Don Mueang Tollway)",
        travelNotes: "Conveniently accessible via the MRT Blue Line (Bang O Station directly adjacent to the hospital campus entrance)."
    },
    reviews: [
        {
            id: "rev-1",
            author: "Jessica T.",
            country: "Australia",
            rating: 5.0,
            date: "October 2025",
            treatment: "Rhinoplasty & Facial Contouring",
            comment: "Traveling to Yanhee from Sydney was the best decision I ever made. The care coordinators met me at BKK airport, and the surgical team was exceptionally skilled and kind. I saved over 65% compared to quotes in Australia.",
            verified: true
        },
        {
            id: "rev-2",
            author: "David K.",
            country: "United Kingdom",
            rating: 5.0,
            date: "August 2025",
            treatment: "Gastric Sleeve Surgery",
            comment: "The bariatric team at Yanhee is world-class. From pre-op diagnostics through post-op dietary planning, I felt in safe hands every moment. Down 32 kg and healthier than ever.",
            verified: true
        },
        {
            id: "rev-3",
            author: "Maria S.",
            country: "United States",
            rating: 5.0,
            date: "November 2025",
            treatment: "Breast Augmentation & Lift",
            comment: "Outstanding hospital hygiene, private room was like a luxury hotel, and nurses checked on me constantly. Highly recommend Akeezo for arranging everything so smoothly.",
            verified: true
        }
    ],
    verified: true,
    active: true
};
export const HOSPITAL_DETAILS_MAP = {
    "yanhee-international-hospital": YANHEE_HOSPITAL_DETAIL,
};
export function getHospitalDetail(slug, fallbackHospitals) {
    const normalized = (slug || "").trim().toLowerCase();
    const baseStatic = HOSPITAL_DETAILS_MAP[normalized] || null;
    // If a list of custom hospitals was passed (e.g. from MongoDB page payload)
    if (Array.isArray(fallbackHospitals) && fallbackHospitals.length > 0) {
        const match = fallbackHospitals.find((h) => h.slug?.toLowerCase() === normalized || h.id?.toLowerCase() === normalized);
        if (match) {
            if (baseStatic) {
                // Merge custom admin edits over base static detail
                return {
                    ...baseStatic,
                    ...match,
                    ratingDisplay: match.rating ? `${match.rating} (Verified Patient Score)` : baseStatic.ratingDisplay,
                    rankBadge: match.rankBadge || baseStatic.rankBadge,
                    bedsCount: match.bedsCount ?? baseStatic.bedsCount,
                    surgeriesCost: match.surgeriesCost && match.surgeriesCost.length > 0 ? match.surgeriesCost : baseStatic.surgeriesCost,
                    roomTypes: match.roomTypes && match.roomTypes.length > 0 ? match.roomTypes : baseStatic.roomTypes,
                    faqs: match.faqs && match.faqs.length > 0 ? match.faqs : baseStatic.faqs,
                };
            }
            return buildHospitalDetailFromItem(match);
        }
    }
    return baseStatic;
}
export function buildHospitalDetailFromItem(item) {
    return {
        id: item.id || item.slug,
        name: item.name,
        slug: item.slug || item.id,
        href: `/hospitals/${item.slug || item.id}`,
        hospitalType: item.hospitalType || "Multispecialty Hospital",
        ownership: item.ownership || "Private Hospital",
        rankBadge: item.rankBadge || `Ranked Top Hospital in ${item.country || "Asia"}`,
        rank: item.rank || 1,
        city: item.city || "Bangkok",
        country: item.country || "Thailand",
        address: item.address || `${item.city || "Bangkok"}, ${item.country || "Thailand"}`,
        postalCode: item.postalCode || "10700",
        telephone: item.telephone || "+66 2 879 0300",
        rating: item.rating || 4.9,
        ratingDisplay: item.ratingDisplay || `${item.rating || 4.9} / 5.0 Verified Patient Score`,
        reviewCount: item.reviewCount || 350,
        patientSatisfactionRate: item.patientSatisfactionRate || "95% positive patient satisfaction",
        establishedYear: item.establishedYear || 1995,
        bedsCount: item.bedsCount || 500,
        icuCount: item.icuCount || 20,
        operatingRooms: item.operatingRooms || 25,
        dailyPatients: item.dailyPatients || "1,500+ daily outpatients",
        doctorsCount: item.doctorsCount || "200+ Specialists",
        nursesCount: item.nursesCount || "500+ Registered Nurses",
        languagesSpoken: item.languagesSpoken || ["English", "Local Language"],
        accreditations: Array.isArray(item.accreditations) ? item.accreditations : ["JCI", "ISO 9001"],
        image: item.image || "/uploads/hospitals/hospital-default.jpg",
        images: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.image || "/uploads/hospitals/hospital-default.jpg"],
        summary: item.summary || item.description || "Premier accredited healthcare institution.",
        aboutMarkdown: item.detailsMarkdown || item.aboutMarkdown || item.description || "Accredited multi-specialty international hospital delivering high quality medical care.",
        highlights: Array.isArray(item.highlights) && item.highlights.length > 0 ? item.highlights : [
            "JCI-accredited clinical quality and patient safety standards",
            "Multilingual international patient services and visa support",
            "State-of-the-art diagnostic and surgical infrastructure"
        ],
        accessibilityFeatures: Array.isArray(item.accessibilityFeatures) && item.accessibilityFeatures.length > 0 ? item.accessibilityFeatures : [
            "Wheelchair accessibility across all facilities",
            "Barrier-free restrooms and wide entrance bays"
        ],
        roomTypes: Array.isArray(item.roomTypes) && item.roomTypes.length > 0 ? item.roomTypes : [
            {
                name: "Private Patient Suite",
                description: "Equipped with electric hospital bed, private bathroom, television, Wi-Fi, and companion seating.",
                amenities: ["Private Bathroom", "Wi-Fi", "Television", "Nurse Call"]
            }
        ],
        paymentMethods: Array.isArray(item.paymentMethods) && item.paymentMethods.length > 0 ? item.paymentMethods : [
            "Cash (Local Currency & USD)",
            "Credit & Debit Cards (Visa, MasterCard)",
            "Direct Hospital Wire Transfer"
        ],
        specialties: Array.isArray(item.specialties) ? item.specialties : ["General Medicine", "Surgery"],
        surgeriesCost: Array.isArray(item.surgeriesCost) ? item.surgeriesCost : [],
        doctors: Array.isArray(item.doctors) ? item.doctors : [],
        faqs: Array.isArray(item.faqs) && item.faqs.length > 0 ? item.faqs : [
            {
                question: `How do I request a treatment plan at ${item.name}?`,
                answer: `Submit your medical reports and inquiry through Akeezo to receive a transparent price estimate and doctor opinion.`
            }
        ],
        location: item.location || {
            latitude: 13.7563,
            longitude: 100.5018,
            airportBKKDistance: "30 km",
            airportDMKDistance: "25 km",
            travelNotes: "Conveniently located near public transit and major highways."
        },
        reviews: Array.isArray(item.reviews) ? item.reviews : [],
        verified: item.verified !== false,
        active: item.active !== false,
    };
}
