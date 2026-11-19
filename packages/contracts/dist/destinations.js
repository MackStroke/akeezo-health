import { z } from "zod";
export const DestinationProcedureCostSchema = z.object({
    procedureName: z.string().min(1),
    specialty: z.string().default("General Surgery"),
    destinationPrice: z.string().min(1),
    destinationPriceNum: z.number().default(0),
    usUkBenchmarkPrice: z.string().min(1),
    usUkBenchmarkPriceNum: z.number().default(0),
    savingsPercentage: z.number().default(70),
    hospitalStayDays: z.string().default("2 - 3 days"),
    totalRecoveryDays: z.string().default("7 - 10 days"),
    inclusiveNote: z.string().default("Includes surgeon fees, anesthesia, hospital stay, pre-op diagnostics, and medication."),
});
export const DestinationTravelInfoSchema = z.object({
    visaTitle: z.string().default("e-Medical Visa (e-Med)"),
    visaDescription: z.string().default("Fast-track online medical visa valid for 60-180 days with multiple entries for patients and up to two medical attendants."),
    visaProcessingDays: z.string().default("3 - 5 business days"),
    visaDocumentsNeeded: z.array(z.string()).default([
        "Valid passport with at least 6 months validity",
        "Official hospital invitation & treatment letter from treating institution",
        "Recent medical records and diagnosis reports",
        "Passport size color photographs"
    ]),
    flightHubs: z.array(z.string()).default(["Direct flights from North America, Europe, Middle East, and Africa"]),
    airportPickup: z.string().default("Complimentary VIP ambulance / airport car pickup coordinated by AKEEZO Care Desks"),
    localTransport: z.string().default("Metro networks, verified app cabs (Uber), and private hospital concierge shuttles"),
    companionAccommodation: z.string().default("3-star to 5-star patient companion suites and guest houses within 1-2 km of hospitals ($25 - $80/night)"),
    languageAssistance: z.string().default("All treating doctors speak fluent English. Multi-lingual interpreters available for Arabic, French, Russian, and Spanish"),
    currencyAndPayments: z.string().default("Major credit cards, wire transfers, and cash accepted. Transparent hospital itemised billing with zero markups"),
    bestTimeToVisit: z.string().default("October through March offers pleasant, moderate weather across most clinical hubs")
});
export const DestinationHospitalRefSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    city: z.string(),
    country: z.string(),
    image: z.string().default("/uploads/hospitals/hospital-default.jpg"),
    rating: z.number().default(4.9),
    accreditations: z.array(z.string()).default(["JCI", "NABH"]),
    specialties: z.array(z.string()).default(["Cardiology", "Oncology", "Orthopedics"]),
    bedsCount: z.number().default(500),
    rankBadge: z.string().default("JCI & NABH Accredited Center of Excellence"),
});
export const DestinationDoctorRefSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    specialty: z.string(),
    hospital: z.string(),
    experience: z.string().default("20+ Years"),
    rating: z.number().default(4.9),
    image: z.string().default("/uploads/doctors/doctor-default.jpg"),
});
export const DestinationFaqSchema = z.object({
    question: z.string().min(1),
    answer: z.string().min(1),
});
export const DestinationDetailSchema = z.object({
    id: z.string(),
    name: z.string(),
    country: z.string(),
    slug: z.string(),
    flag: z.string().default("🇮🇳"),
    region: z.string().default("Asia"),
    heroImage: z.string().default("/uploads/destinations/hero-default.jpg"),
    galleryImages: z.array(z.string()).default([]),
    title: z.string(),
    headline: z.string(),
    subheadline: z.string(),
    overviewMarkdown: z.string(),
    whyChoosePoints: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string().default("ShieldCheck"),
    })).default([]),
    metrics: z.object({
        accreditedHospitalsCount: z.string().default("45+"),
        avgSavingsPercentage: z.string().default("70% - 85%"),
        annualMedicalTourists: z.string().default("1.4M+"),
        visaProcessingTime: z.string().default("3 - 5 Days"),
    }),
    popularProcedures: z.array(z.string()).default([]),
    costTable: z.array(DestinationProcedureCostSchema).default([]),
    hospitals: z.array(DestinationHospitalRefSchema).default([]),
    doctors: z.array(DestinationDoctorRefSchema).default([]),
    travelInfo: DestinationTravelInfoSchema.default({}),
    faqs: z.array(DestinationFaqSchema).default([]),
    active: z.boolean().default(true),
});
export const DestinationCardItemSchema = z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    country: z.string(),
    region: z.enum(["India Hubs", "Americas", "Asia", "Europe & Middle East"]),
    flag: z.string(),
    image: z.string(),
    hospitalCount: z.number(),
    savingsPercentage: z.number(),
    visaProcessingDays: z.string(),
    flightConnectivity: z.string(),
    cityHighlights: z.string(),
    popularProcedures: z.array(z.string()),
    tagline: z.string(),
    featured: z.boolean(),
    type: z.enum(["country", "city"]),
});
export const ALL_DESTINATIONS = [
    // --- PRIMARY COUNTRIES ---
    {
        id: "india",
        name: "India",
        slug: "india",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/delhi.webp",
        hospitalCount: 45,
        savingsPercentage: 85,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Direct from US, UK, Europe, Middle East & Africa",
        cityHighlights: "New Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Kochi",
        popularProcedures: ["Cardiology (CABG)", "Oncology & CyberKnife", "Joint Replacement", "Organ Transplants"],
        tagline: "Heal in India: Global Gold Standard in Complex Quaternary Surgery",
        featured: true,
        type: "country"
    },
    {
        id: "mexico",
        name: "Mexico",
        slug: "mexico",
        country: "Mexico",
        region: "Americas",
        flag: "🇲🇽",
        image: "/v2/home-page/destination/mumbai.webp",
        hospitalCount: 32,
        savingsPercentage: 75,
        visaProcessingDays: "Visa-Free / Instant FMM for US & Canada",
        flightConnectivity: "Drive-across border or 2-4 hr direct flights from US cities",
        cityHighlights: "Tijuana, Los Algodones, Cancun, Guadalajara, Monterrey, Mexico City",
        popularProcedures: ["Bariatric Surgery", "All-on-4 Dental Implants", "Cosmetic Surgery", "Orthopedics"],
        tagline: "Premier Healthcare Destination for North American Patients",
        featured: true,
        type: "country"
    },
    {
        id: "thailand",
        name: "Thailand",
        slug: "thailand",
        country: "Thailand",
        region: "Asia",
        flag: "🇹🇭",
        image: "/v2/home-page/destination/chennai.webp",
        hospitalCount: 28,
        savingsPercentage: 70,
        visaProcessingDays: "Visa on arrival / 3-5 days online",
        flightConnectivity: "Suvarnabhumi Airport (BKK) connecting worldwide",
        cityHighlights: "Bangkok, Phuket, Chiang Mai",
        popularProcedures: ["Plastic Surgery", "Gender Affirmation", "Executive Checkups", "Dental Care"],
        tagline: "World-Renowned Hospitality & JCI-Accredited Medical Wellness",
        featured: true,
        type: "country"
    },
    {
        id: "turkey",
        name: "Turkey",
        slug: "turkey",
        country: "Turkey",
        region: "Europe & Middle East",
        flag: "🇹🇷",
        image: "/v2/home-page/destination/kerala.webp",
        hospitalCount: 35,
        savingsPercentage: 70,
        visaProcessingDays: "Instant e-Visa online (24-48 hrs)",
        flightConnectivity: "Istanbul Airport (IST) connecting 300+ global destinations",
        cityHighlights: "Istanbul, Ankara, Antalya, Izmir",
        popularProcedures: ["Hair Restoration (FUE/DHI)", "Rhinoplasty", "Smile Makeover", "Laser Eye Surgery"],
        tagline: "Europe & Middle East's Hub for Aesthetic & Regenerative Surgery",
        featured: true,
        type: "country"
    },
    {
        id: "malaysia",
        name: "Malaysia",
        slug: "malaysia",
        country: "Malaysia",
        region: "Asia",
        flag: "🇲🇾",
        image: "/v2/home-page/destination/bangalore.webp",
        hospitalCount: 22,
        savingsPercentage: 65,
        visaProcessingDays: "Visa on arrival / 30-day visa-free for 160+ countries",
        flightConnectivity: "Kuala Lumpur International (KUL) direct flights",
        cityHighlights: "Kuala Lumpur, Penang, Melaka",
        popularProcedures: ["IVF & Fertility", "Cardiology", "Orthopedic Surgery", "Health Screening"],
        tagline: "Government-Regulated Medical Tourism with English-Speaking Specialists",
        featured: false,
        type: "country"
    },
    {
        id: "singapore",
        name: "Singapore",
        slug: "singapore",
        country: "Singapore",
        region: "Asia",
        flag: "🇸🇬",
        image: "/v2/home-page/destination/hyderabad.webp",
        hospitalCount: 18,
        savingsPercentage: 45,
        visaProcessingDays: "Visa-free for 90 days for most nationalities",
        flightConnectivity: "Changi International Airport (SIN)",
        cityHighlights: "Singapore Central, Novena Medical Hub",
        popularProcedures: ["Complex Oncology", "Pediatric Cardiac Surgery", "Neurology", "Clinical Trials"],
        tagline: "Asia's Premier Academic Medical Centers & Robotic Surgery Hub",
        featured: false,
        type: "country"
    },
    {
        id: "uae",
        name: "United Arab Emirates",
        slug: "uae",
        country: "UAE",
        region: "Europe & Middle East",
        flag: "🇦🇪",
        image: "/v2/home-page/destination/kolkata.webp",
        hospitalCount: 20,
        savingsPercentage: 50,
        visaProcessingDays: "Instant 30/90 days entry permit online",
        flightConnectivity: "Dubai (DXB) & Abu Dhabi (AUH) global airline gateways",
        cityHighlights: "Dubai Healthcare City, Abu Dhabi",
        popularProcedures: ["Aesthetic Medicine", "Sports Medicine", "Executive Health", "Orthopedics"],
        tagline: "Luxury Patient Suites & High-Tech Middle East Healthcare",
        featured: false,
        type: "country"
    },
    {
        id: "costa-rica",
        name: "Costa Rica",
        slug: "costa-rica",
        country: "Costa Rica",
        region: "Americas",
        flag: "🇨🇷",
        image: "/v2/home-page/destination/delhi.webp",
        hospitalCount: 14,
        savingsPercentage: 65,
        visaProcessingDays: "90-day visa-free for US, Canada, EU",
        flightConnectivity: "San José (SJO) & Liberia (LIR) nonstop from US",
        cityHighlights: "San José, Escazú",
        popularProcedures: ["Dental Implants", "Bariatric Surgery", "Recovery Eco-Retreats"],
        tagline: "Eco-Friendly Recuperation & High-Quality Dental and Cosmetic Care",
        featured: false,
        type: "country"
    },
    // --- INDIAN MEDICAL HUBS (CITIES) ---
    {
        id: "new-delhi",
        name: "New Delhi & NCR",
        slug: "new-delhi",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/delhi.webp",
        hospitalCount: 25,
        savingsPercentage: 85,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Indira Gandhi International Airport (DEL) with direct flights globally",
        cityHighlights: "Delhi, Gurugram, Noida, Faridabad",
        popularProcedures: ["Cardiology & TAVR", "CyberKnife Radiosurgery", "Liver Transplant", "Robotic Knee"],
        tagline: "India's Capital Healthcare Epicenter & Quaternary Referral Hub",
        featured: true,
        type: "city"
    },
    {
        id: "mumbai",
        name: "Mumbai",
        slug: "mumbai",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/mumbai.webp",
        hospitalCount: 20,
        savingsPercentage: 80,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Chhatrapati Shivaji Maharaj International (BOM)",
        cityHighlights: "South Mumbai, Bandra, Andheri",
        popularProcedures: ["Advanced Oncology", "Bone Marrow Transplant", "Neurosurgery", "Cosmetic Surgery"],
        tagline: "Commercial Capital with Renowned Private Super-Specialty Hospitals",
        featured: true,
        type: "city"
    },
    {
        id: "bangalore",
        name: "Bengaluru (Bangalore)",
        slug: "bangalore",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/bangalore.webp",
        hospitalCount: 18,
        savingsPercentage: 80,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Kempegowda International Airport (BLR)",
        cityHighlights: "Whitefield, Electronic City, Bannerghatta",
        popularProcedures: ["Pediatric Cardiac", "Spine Surgery", "Robotic Oncology", "IVF & Fertility"],
        tagline: "Silicon Valley of India: Technology-Driven Robotic Surgery Hub",
        featured: true,
        type: "city"
    },
    {
        id: "chennai",
        name: "Chennai",
        slug: "chennai",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/chennai.webp",
        hospitalCount: 19,
        savingsPercentage: 85,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Chennai International Airport (MAA)",
        cityHighlights: "Greams Road, Anna Nagar, Adyar",
        popularProcedures: ["Organ Transplantation", "Complex Joint Replacement", "Ophthalmology", "Cancer Care"],
        tagline: "The Healthcare Capital of South India & Global Transplant Epicenter",
        featured: true,
        type: "city"
    },
    {
        id: "hyderabad",
        name: "Hyderabad",
        slug: "hyderabad",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/hyderabad.webp",
        hospitalCount: 16,
        savingsPercentage: 80,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Rajiv Gandhi International Airport (HYD)",
        cityHighlights: "Banjara Hills, Jubilee Hills, Gachibowli",
        popularProcedures: ["Gastroenterology (AIG)", "Cardiology", "Neurology", "Minimally Invasive Surgery"],
        tagline: "World-Class GI, Transplant & Cardiac Super-Specialties",
        featured: false,
        type: "city"
    },
    {
        id: "kerala",
        name: "Kerala (Kochi & Trivandrum)",
        slug: "kerala",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/kerala.webp",
        hospitalCount: 15,
        savingsPercentage: 75,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Cochin International (COK) & Trivandrum (TRV)",
        cityHighlights: "Kochi, Thiruvananthapuram, Calicut",
        popularProcedures: ["Ayurveda & Integrative Post-Op", "Cardiology", "Transplants", "Wellness Recuperation"],
        tagline: "Holistic Medical Recuperation in God's Own Country",
        featured: false,
        type: "city"
    },
    {
        id: "kolkata",
        name: "Kolkata",
        slug: "kolkata",
        country: "India",
        region: "India Hubs",
        flag: "🇮🇳",
        image: "/v2/home-page/destination/kolkata.webp",
        hospitalCount: 12,
        savingsPercentage: 85,
        visaProcessingDays: "3 - 5 days (e-Med)",
        flightConnectivity: "Netaji Subhash Chandra Bose International (CCU)",
        cityHighlights: "EM Bypass, Salt Lake, Alipore",
        popularProcedures: ["Oncology", "General Surgery", "Cardiology", "Ophthalmology"],
        tagline: "Eastern India Gateway for International & Regional Care",
        featured: false,
        type: "city"
    }
];
export const DESTINATION_REGIONS = [
    "All Destinations",
    "India Hubs",
    "Americas",
    "Asia",
    "Europe & Middle East"
];
// =========================================================================
// MEXICO DESTINATION DETAIL (Matching curemeabroad.com/destinations/mexico)
// =========================================================================
export const MEXICO_DESTINATION_DETAIL = {
    id: "mexico",
    name: "Mexico",
    country: "Mexico",
    slug: "mexico",
    flag: "🇲🇽",
    region: "Americas",
    heroImage: "/v2/home-page/destination/mumbai.webp",
    galleryImages: [
        "/v2/home-page/destination/mumbai.webp",
        "/v2/home-page/destination/delhi.webp",
        "/v2/home-page/destination/bangalore.webp",
        "/v2/home-page/destination/chennai.webp"
    ],
    title: "Medical Tourism in Mexico: Clinics & Costs 2026 | AKEEZO",
    headline: "Medical Tourism in Mexico: Clinics & Costs 2026",
    subheadline: "Accredited JCI & CSG Medical Centers, US-Trained Board-Certified Surgeons, and Transparent 70-80% Savings Across Border & Resort Cities",
    overviewMarkdown: `Mexico stands as the premier destination for North American patients seeking high-quality healthcare at a fraction of US and Canadian prices. Over 1.2 million international travelers cross into Mexico annually for dental procedures, bariatric surgery, plastic and reconstructive surgery, orthopedics, and executive health assessments.

With state-of-the-art hospitals accredited by Joint Commission International (JCI) and Mexico's General Health Council (CSG), clinics in Tijuana, Los Algodones, Monterrey, Guadalajara, and Cancun feature American-standard medical technology. Many leading department chiefs and surgical specialists completed fellowship training in the United States, maintaining active memberships in international medical societies (such as the American College of Surgeons, ASPS, and ASMBS).`,
    whyChoosePoints: [
        {
            title: "Direct Geographic Proximity",
            description: "Drive across from San Diego, Arizona, or Texas, or board 2 to 4-hour direct flights from major US and Canadian airline hubs with zero timezone jet lag.",
            icon: "MapPin"
        },
        {
            title: "Massive 70% to 80% Cost Savings",
            description: "Receive the exact same FDA-approved prosthetics, dental implants, and laparoscopic devices at 20-30% of US hospital bill amounts.",
            icon: "DollarSign"
        },
        {
            title: "Bilingual Medical Teams & US Standards",
            description: "Physicians, anesthesiologists, and patient coordinators are fluent in English, often with dual US/Mexican clinical credentials.",
            icon: "Languages"
        },
        {
            title: "No Waiting Lists for Surgery",
            description: "Schedule consultations and elective surgical procedures within 7-14 days rather than enduring multi-month delays in national healthcare systems.",
            icon: "Calendar"
        }
    ],
    metrics: {
        accreditedHospitalsCount: "32+ Clinics",
        avgSavingsPercentage: "70% - 80%",
        annualMedicalTourists: "1.2M+ Patients",
        visaProcessingTime: "Instant (Visa-Free / FMM)",
    },
    popularProcedures: [
        "Gastric Sleeve Bariatric",
        "All-on-4 Dental Implants",
        "Rhinoplasty & Facelifts",
        "Total Knee Replacement",
        "Breast Augmentation",
        "Full Mouth Restoration"
    ],
    costTable: [
        {
            procedureName: "Gastric Sleeve Surgery (Laparoscopic)",
            specialty: "Bariatric Surgery",
            destinationPrice: "$4,200",
            destinationPriceNum: 4200,
            usUkBenchmarkPrice: "$18,500",
            usUkBenchmarkPriceNum: 18500,
            savingsPercentage: 77,
            hospitalStayDays: "2 days",
            totalRecoveryDays: "10 - 14 days",
            inclusiveNote: "Includes surgeon fees, anesthesia, 2 nights hospital, leak test, nutritional consultation, and airport transfers."
        },
        {
            procedureName: "All-on-4 Full Arch Dental Implants (per arch)",
            specialty: "Dental Surgery",
            destinationPrice: "$8,500",
            destinationPriceNum: 8500,
            usUkBenchmarkPrice: "$28,000",
            usUkBenchmarkPriceNum: 28000,
            savingsPercentage: 70,
            hospitalStayDays: "Outpatient",
            totalRecoveryDays: "5 - 7 days",
            inclusiveNote: "Includes 4 titanium implants (Nobel Biocare/Straumann), temporary hybrid denture, 3D CT scan, and sedation."
        },
        {
            procedureName: "Total Knee Replacement (Unilateral)",
            specialty: "Orthopedic Surgery",
            destinationPrice: "$7,800",
            destinationPriceNum: 7800,
            usUkBenchmarkPrice: "$38,000",
            usUkBenchmarkPriceNum: 38000,
            savingsPercentage: 79,
            hospitalStayDays: "3 days",
            totalRecoveryDays: "14 - 21 days",
            inclusiveNote: "Includes FDA-approved Stryker/Zimmer implant, pre-op tests, 3 nights stay, physical therapy, and medication."
        },
        {
            procedureName: "Rhinoplasty (Nose Reshaping)",
            specialty: "Cosmetic & Plastic Surgery",
            destinationPrice: "$3,400",
            destinationPriceNum: 3400,
            usUkBenchmarkPrice: "$11,500",
            usUkBenchmarkPriceNum: 11500,
            savingsPercentage: 70,
            hospitalStayDays: "1 day",
            totalRecoveryDays: "7 - 10 days",
            inclusiveNote: "Includes board-certified plastic surgeon, operating room fees, splint removal, and post-op follow-ups."
        },
        {
            procedureName: "Gastric Bypass (Roux-en-Y)",
            specialty: "Bariatric Surgery",
            destinationPrice: "$5,500",
            destinationPriceNum: 5500,
            usUkBenchmarkPrice: "$24,000",
            usUkBenchmarkPriceNum: 24000,
            savingsPercentage: 77,
            hospitalStayDays: "3 days",
            totalRecoveryDays: "14 days",
            inclusiveNote: "Includes 3 nights hospital stay, specialist multidisciplinary care, barium swallow test, and 1-year dietary monitoring."
        },
        {
            procedureName: "Total Hip Replacement (Anterior Approach)",
            specialty: "Orthopedic Surgery",
            destinationPrice: "$8,500",
            destinationPriceNum: 8500,
            usUkBenchmarkPrice: "$42,000",
            usUkBenchmarkPriceNum: 42000,
            savingsPercentage: 80,
            hospitalStayDays: "3 - 4 days",
            totalRecoveryDays: "21 days",
            inclusiveNote: "Includes ceramic/polyethylene hip joint prosthesis, hospital private room, pre-op clearance, and in-hospital rehab."
        },
        {
            procedureName: "Porcelain Dental Veneers (per tooth)",
            specialty: "Cosmetic Dentistry",
            destinationPrice: "$380",
            destinationPriceNum: 380,
            usUkBenchmarkPrice: "$1,600",
            usUkBenchmarkPriceNum: 1600,
            savingsPercentage: 76,
            hospitalStayDays: "Outpatient",
            totalRecoveryDays: "3 - 5 days",
            inclusiveNote: "Includes E-max porcelain veneer, digital smile design, local anesthesia, and custom shading."
        }
    ],
    hospitals: [
        {
            id: "hospital-angeles-tijuana",
            name: "Hospital Ángeles Tijuana",
            slug: "hospital-angeles-tijuana",
            city: "Tijuana",
            country: "Mexico",
            image: "/v2/home-page/destination/mumbai.webp",
            rating: 4.8,
            accreditations: ["JCI", "CSG Accredited"],
            specialties: ["Bariatric Surgery", "Orthopedics", "Cardiology", "Cosmetic Surgery"],
            bedsCount: 120,
            rankBadge: "Leading JCI Border Hospital for North American Patients"
        },
        {
            id: "galenia-hospital-cancun",
            name: "Galenia Hospital Cancún",
            slug: "galenia-hospital-cancun",
            city: "Cancun",
            country: "Mexico",
            image: "/v2/home-page/destination/delhi.webp",
            rating: 4.9,
            accreditations: ["JCI", "Accreditation Canada", "CSG"],
            specialties: ["Joint Replacement", "Spine Surgery", "Oncology", "Executive Wellness"],
            bedsCount: 85,
            rankBadge: "Triple-Accredited Medical Center in the Riviera Maya"
        },
        {
            id: "christus-muguerza-monterrey",
            name: "Christus Muguerza Alta Especialidad",
            slug: "christus-muguerza-monterrey",
            city: "Monterrey",
            country: "Mexico",
            image: "/v2/home-page/destination/bangalore.webp",
            rating: 4.8,
            accreditations: ["JCI", "CSG"],
            specialties: ["Cardiovascular Surgery", "Neurosciences", "Organ Transplants"],
            bedsCount: 220,
            rankBadge: "Quaternary Academic Medical Center in Northern Mexico"
        }
    ],
    doctors: [
        {
            id: "dr-alejandro-lopez",
            name: "Dr. Alejandro Lopez",
            slug: "dr-alejandro-lopez",
            specialty: "Bariatric & Metabolic Surgeon",
            hospital: "Hospital Ángeles Tijuana",
            experience: "18+ Years",
            rating: 4.9,
            image: "/v2/home-page/specialities/oncology.webp"
        },
        {
            id: "dr-carlos-morales",
            name: "Dr. Carlos Morales",
            slug: "dr-carlos-morales",
            specialty: "Orthopedic & Joint Replacement Surgeon",
            hospital: "Galenia Hospital Cancún",
            experience: "22+ Years",
            rating: 4.8,
            image: "/v2/home-page/specialities/cardiac.webp"
        }
    ],
    travelInfo: {
        visaTitle: "Entry Requirements & FMM Tourist Card",
        visaDescription: "Citizens of the United States, Canada, the European Union, the UK, and Australia do not require a pre-arranged visa for medical treatment in Mexico. A standard FMM (Forma Migratoria Múltiple) tourist card is issued free of charge or for a nominal fee upon arrival.",
        visaProcessingDays: "Instant upon arrival / 24 hrs online",
        visaDocumentsNeeded: [
            "Valid passport with at least 6 months validity from date of entry",
            "Completed FMM entry card (issued at airport or land border crossing)",
            "Hospital confirmation letter stating appointment date and estimated stay duration",
            "Return flight ticket or land border transit documentation"
        ],
        flightHubs: [
            "Tijuana International Airport (TIJ) via the Cross Border Xpress (CBX) skybridge from San Diego",
            "Cancun International Airport (CUN) with direct flights from 40+ North American cities",
            "Mexico City (MEX), Monterrey (MTY), and Guadalajara (GDL) international gateways"
        ],
        airportPickup: "AKEEZO coordinates seamless private chauffeur and bilingual escort pickup directly from San Diego Airport (SAN) or Cancun International (CUN) to your clinic.",
        localTransport: "Private medical transport, Uber, and secure clinic-affiliated shuttles provide safe transit between accredited hotels and recovery centers.",
        companionAccommodation: "Partner luxury recovery hotels and recovery villas in Tijuana, Cancun, and Monterrey ($60 - $140/night) equipped with 24/7 nursing and dietary services.",
        languageAssistance: "All treating doctors, head nurses, and administrative desks are fully bilingual in English and Spanish.",
        currencyAndPayments: "US Dollars (USD) are widely accepted across all border and resort clinics. Major credit cards (Visa, MasterCard, Amex) and bank wire transfers supported.",
        bestTimeToVisit: "November through April provides optimal, mild weather for surgical recuperation in both coastal and highland medical centers."
    },
    faqs: [
        {
            question: "Is it safe to travel to Mexico for medical and surgical treatment?",
            answer: "Yes, medical tourism in Mexico takes place within modern, private hospital districts and specialized healthcare facilities in safe, monitored zones such as the Tijuana Zona Río medical district, Cancun Hotel Zone, and San Pedro Garza García in Monterrey. AKEEZO provides private door-to-door escort shuttles from airport/border crossings to ensure complete peace of mind."
        },
        {
            question: "How do surgeons in Mexico compare to US and Canadian doctors?",
            answer: "Leading Mexican surgeons are certified by national specialty boards (such as CMCOEM for bariatrics or CMCPER for plastic surgery) and many hold international memberships with the American College of Surgeons (ACS), ASMBS, or ISAPS. Many doctors completed fellowships or postgraduate clinical training in the United States, Europe, or top Latin American university hospitals."
        },
        {
            question: "What is the Cross Border Xpress (CBX) for Tijuana patients?",
            answer: "The Cross Border Xpress (CBX) is a secure, enclosed pedestrian bridge that connects the San Diego terminal directly to Tijuana International Airport. US patients can park on the San Diego side, walk across border customs in 15 minutes, and be met on the other side by their AKEEZO private hospital driver."
        },
        {
            question: "What happens if I experience complications after returning home?",
            answer: "AKEEZO coordinates structured post-operative virtual follow-ups with your treating surgeon. Patients receive complete medical records, operative notes, pathology reports, and discharge summaries in English to share with their primary care physician at home. Optional medical travel complication insurance policies are also available for complete surety."
        },
        {
            question: "How much can I realistically save on surgeries in Mexico?",
            answer: "Patients typically save between 70% and 80% compared to private, out-of-pocket costs in the United States and Canada. For example, a gastric sleeve costs approximately $4,200 in Mexico compared to $18,500+ in the US, and an All-on-4 dental restoration costs around $8,500 compared to $28,000+ in the US."
        }
    ],
    active: true
};
// =========================================================================
// INDIA DESTINATION DETAIL (Heal in India / Core Akeezo Destination)
// =========================================================================
export const INDIA_DESTINATION_DETAIL = {
    id: "india",
    name: "India",
    country: "India",
    slug: "india",
    flag: "🇮🇳",
    region: "India Hubs",
    heroImage: "/v2/home-page/destination/delhi.webp",
    galleryImages: [
        "/v2/home-page/destination/delhi.webp",
        "/v2/home-page/destination/mumbai.webp",
        "/v2/home-page/destination/chennai.webp",
        "/v2/home-page/destination/bangalore.webp"
    ],
    title: "Medical Tourism in India: Premier Hospitals & Costs 2026 | AKEEZO",
    headline: "Medical Tourism in India: Premier Hospitals & Costs 2026",
    subheadline: "Heal In India with AKEEZO — 45+ JCI & NABH Quaternary Care Centers, Zero-Markup Hospital Billing & 70-90% Cost Savings on Advanced Surgeries",
    overviewMarkdown: `India has emerged as the world's most trusted capital for complex, life-saving quaternary medical treatments. Welcoming over 1.4 million international patients each year from North America, the UK, Europe, the Middle East, Central Asia, and Africa, India pairs globally certified clinical excellence with unmatched affordability.

Home to world-renowned healthcare networks like Apollo Hospitals, Fortis Healthcare, Medanta The Medicity, Max Healthcare, and Narayana Health, India offers advanced technological capabilities including CyberKnife robotic radiosurgery, Proton Beam Therapy, minimally invasive Da Vinci robotic cardiac bypass, living donor liver transplants, and CAR-T cell immunotherapies. Over 40,000 physicians in India hold international credentials from the UK (FRCS/MRCP) and the United States (US Board Certified/FACP), practicing with fluent English communication.`,
    whyChoosePoints: [
        {
            title: "Quaternary Clinical Excellence",
            description: "Perform high-complexity procedures (multi-organ transplants, pediatric cardiac surgeries, brain tumor resections) with surgical success rates matching or exceeding Mayo Clinic and Cleveland Clinic benchmarks.",
            icon: "ShieldCheck"
        },
        {
            title: "Up to 85% - 90% Cost Savings",
            description: "Direct zero-markup hospital billing allows patients to save up to $100,000+ on complex open heart surgeries, oncology protocols, and orthopedic reconstructions.",
            icon: "DollarSign"
        },
        {
            title: "Streamlined e-Medical Visa in 3-5 Days",
            description: "Government of India fast-track online e-Med visa issued in 72 hours for patients and up to two attendants, valid for up to 180 days with multiple entries.",
            icon: "Award"
        },
        {
            title: "Zero Waiting Times & VIP Care",
            description: "Immediate hospital admission, private international patient suites, dedicated multilingual navigators, and complimentary airport transfers.",
            icon: "CheckCircle2"
        }
    ],
    metrics: {
        accreditedHospitalsCount: "45+ JCI/NABH",
        avgSavingsPercentage: "75% - 90%",
        annualMedicalTourists: "1.4M+ Patients",
        visaProcessingTime: "3 - 5 Days (e-Med)",
    },
    popularProcedures: [
        "CABG Heart Bypass & Valve Replacement",
        "CyberKnife & Proton Beam Oncology",
        "Living Donor Liver & Kidney Transplant",
        "Robotic Total Knee & Hip Replacement",
        "Allogeneic Bone Marrow Transplant (BMT)",
        "IVF with PGT-A Genetic Screening"
    ],
    costTable: [
        {
            procedureName: "Coronary Artery Bypass Graft (CABG)",
            specialty: "Cardiac Surgery",
            destinationPrice: "$5,200",
            destinationPriceNum: 5200,
            usUkBenchmarkPrice: "$125,000",
            usUkBenchmarkPriceNum: 125000,
            savingsPercentage: 96,
            hospitalStayDays: "7 days",
            totalRecoveryDays: "14 - 21 days",
            inclusiveNote: "Includes surgeon fees, cardiopulmonary bypass, 3 days ICU stay, 4 days private room, post-op angiography, and rehabilitation."
        },
        {
            procedureName: "Robotic Total Knee Replacement (Unilateral)",
            specialty: "Orthopedic Surgery",
            destinationPrice: "$4,200",
            destinationPriceNum: 4200,
            usUkBenchmarkPrice: "$45,000",
            usUkBenchmarkPriceNum: 45000,
            savingsPercentage: 91,
            hospitalStayDays: "4 days",
            totalRecoveryDays: "14 days",
            inclusiveNote: "Includes robotic MAKO precision alignment, US FDA-approved Stryker implant, pre-op CT, in-hospital physiotherapy, and medicines."
        },
        {
            procedureName: "CyberKnife Robotic Radiosurgery (Complete Protocol)",
            specialty: "Oncology & Radiosurgery",
            destinationPrice: "$6,500",
            destinationPriceNum: 6500,
            usUkBenchmarkPrice: "$65,000",
            usUkBenchmarkPriceNum: 65000,
            savingsPercentage: 90,
            hospitalStayDays: "Outpatient",
            totalRecoveryDays: "3 - 5 days",
            inclusiveNote: "Includes 3-5 sub-millimeter CyberKnife stereotactic radiation sessions, 3D tumor mapping, immobilization mask, and oncologist reviews."
        },
        {
            procedureName: "Living Donor Liver Transplant (Adult)",
            specialty: "Organ Transplantation",
            destinationPrice: "$32,000",
            destinationPriceNum: 32000,
            usUkBenchmarkPrice: "$350,000",
            usUkBenchmarkPriceNum: 35000,
            savingsPercentage: 91,
            hospitalStayDays: "18 days",
            totalRecoveryDays: "30 - 45 days",
            inclusiveNote: "Includes donor and recipient surgeries, 7 days dedicated liver ICU, 11 days private rooms, surgical team fees, and authorization committee clearances."
        },
        {
            procedureName: "Allogeneic Bone Marrow Transplant (BMT)",
            specialty: "Hematology & Oncology",
            destinationPrice: "$24,000",
            destinationPriceNum: 24000,
            usUkBenchmarkPrice: "$220,000",
            usUkBenchmarkPriceNum: 220000,
            savingsPercentage: 89,
            hospitalStayDays: "25 days",
            totalRecoveryDays: "60 - 90 days",
            inclusiveNote: "Includes conditioning chemotherapy, HEPA-filtered positive pressure BMT isolation suite, stem cell infusion, and graft monitoring."
        },
        {
            procedureName: "IVF Cycle with ICSI & Blastocyst Culture",
            specialty: "Fertility & Reproductive Health",
            destinationPrice: "$3,200",
            destinationPriceNum: 3200,
            usUkBenchmarkPrice: "$16,500",
            usUkBenchmarkPriceNum: 16500,
            savingsPercentage: 81,
            hospitalStayDays: "Outpatient",
            totalRecoveryDays: "10 - 14 days",
            inclusiveNote: "Includes ovarian stimulation monitoring, egg retrieval, ICSI fertilization, embryology lab culture, and fresh/frozen embryo transfer."
        },
        {
            procedureName: "Total Hip Replacement (Ceramic-on-Polyethylene)",
            specialty: "Orthopedic Surgery",
            destinationPrice: "$4,800",
            destinationPriceNum: 4800,
            usUkBenchmarkPrice: "$42,000",
            usUkBenchmarkPriceNum: 42000,
            savingsPercentage: 89,
            hospitalStayDays: "4 days",
            totalRecoveryDays: "14 - 21 days",
            inclusiveNote: "Includes Zimmer/DePuy implant, 4 nights private suite, physical therapy sessions, post-op imaging, and walking frame."
        }
    ],
    hospitals: [
        {
            id: "medanta-the-medicity",
            name: "Medanta - The Medicity",
            slug: "medanta-the-medicity",
            city: "Gurugram (New Delhi NCR)",
            country: "India",
            image: "/v2/home-page/destination/delhi.webp",
            rating: 4.9,
            accreditations: ["JCI", "NABH", "NABL"],
            specialties: ["Cardiology", "Liver Transplant", "Neurology", "Robotic Urology"],
            bedsCount: 1250,
            rankBadge: "Ranked India's #1 Private Hospital for 4 Consecutive Years"
        },
        {
            id: "apollo-hospitals-greams-road",
            name: "Apollo Hospitals, Greams Road",
            slug: "apollo-hospitals-greams-road",
            city: "Chennai",
            country: "India",
            image: "/v2/home-page/destination/chennai.webp",
            rating: 4.9,
            accreditations: ["JCI", "NABH"],
            specialties: ["Cardiothoracic Surgery", "Oncology", "Orthopedics", "Transplants"],
            bedsCount: 650,
            rankBadge: "Flagship Pioneer Hospital of the Apollo Healthcare Network"
        },
        {
            id: "fortis-memorial-research-institute",
            name: "Fortis Memorial Research Institute (FMRI)",
            slug: "fortis-memorial-research-institute",
            city: "Gurugram (New Delhi NCR)",
            country: "India",
            image: "/v2/home-page/destination/delhi.webp",
            rating: 4.8,
            accreditations: ["JCI", "NABH"],
            specialties: ["CyberKnife Oncology", "Pediatric Cardiac", "Bone Marrow Transplant"],
            bedsCount: 1000,
            rankBadge: "Ranked Among Top 30 Most Technologically Advanced Hospitals in the World"
        },
        {
            id: "kokilaben-dhirubhai-ambani",
            name: "Kokilaben Dhirubhai Ambani Hospital",
            slug: "kokilaben-dhirubhai-ambani",
            city: "Mumbai",
            country: "India",
            image: "/v2/home-page/destination/mumbai.webp",
            rating: 4.8,
            accreditations: ["JCI", "NABH", "CAP"],
            specialties: ["Full Time Specialist System", "Robotic Surgery", "Neurosciences"],
            bedsCount: 750,
            rankBadge: "Western India's Premier Multi-Specialty Quaternary Center"
        }
    ],
    doctors: [
        {
            id: "dr-naresh-trehan",
            name: "Dr. Naresh Trehan",
            slug: "dr-naresh-trehan",
            specialty: "Chief Cardiovascular & Cardiothoracic Surgeon",
            hospital: "Medanta - The Medicity, Gurugram",
            experience: "42+ Years",
            rating: 4.9,
            image: "/v2/home-page/specialities/cardiac.webp"
        },
        {
            id: "dr-arvinder-singh-soin",
            name: "Dr. Arvinder Singh Soin",
            slug: "dr-arvinder-singh-soin",
            specialty: "Chairman of Liver Transplantation & Regenerative Medicine",
            hospital: "Medanta - The Medicity, Gurugram",
            experience: "32+ Years",
            rating: 5.0,
            image: "/v2/home-page/specialities/oncology.webp"
        },
        {
            id: "dr-ashok-seth",
            name: "Dr. Ashok Seth",
            slug: "dr-ashok-seth",
            specialty: "Chairman, Fortis Escorts Heart Institute",
            hospital: "Fortis Escorts, New Delhi",
            experience: "38+ Years",
            rating: 4.9,
            image: "/v2/home-page/specialities/cardiac.webp"
        }
    ],
    travelInfo: {
        visaTitle: "India e-Medical Visa (e-Med) Process",
        visaDescription: "The Government of India provides an expedited, 100% online e-Medical visa facility for international travelers from 165+ countries. The e-Med visa is issued within 72 to 96 hours, valid for 60 to 180 days with multiple entries for the patient and up to two attendants on e-Medical Attendant visas.",
        visaProcessingDays: "3 - 5 business days online",
        visaDocumentsNeeded: [
            "Passport scan with at least 6 months validity and two blank pages",
            "Formal Medical Visa Invitation Letter from an accredited Indian treating hospital (arranged by AKEEZO within 24 hours)",
            "Recent diagnostic scans, pathology reports, and medical summary",
            "Digital passport photograph with white background"
        ],
        flightHubs: [
            "New Delhi Indira Gandhi International (DEL): Non-stop flights from New York, Chicago, San Francisco, London, Frankfurt, Dubai",
            "Mumbai Chhatrapati Shivaji Maharaj International (BOM): Non-stop connections to Americas, Europe, Middle East",
            "Bengaluru (BLR) & Chennai (MAA): Direct flights from Europe, SE Asia, Australia, and Middle East"
        ],
        airportPickup: "Complimentary VIP ambulance or executive private air-conditioned vehicle meets patient and attendants directly at the aerobridge/terminal.",
        localTransport: "Hospital-managed private concierge fleets, app-based Uber Premier, and dedicated hotel shuttles.",
        companionAccommodation: "4-star and 5-star patient companion apartments and hotels located within 1 km of partner hospitals with in-house dietary chefs ($30 - $70/night).",
        languageAssistance: "English is the official language of Indian medical education and practice; all doctors, nurses, and technicians speak fluent English. Dedicated Arabic, Russian, French, and Bengali interpreters provided free of charge.",
        currencyAndPayments: "Indian Rupee (INR), US Dollars (USD), Euros (EUR), and GBP accepted. Direct SWIFT wire transfers, international credit cards, and online payment gateways supported.",
        bestTimeToVisit: "October through March offers pleasant, cool temperatures ideal for healing across northern and central clinical hubs."
    },
    faqs: [
        {
            question: "Why should international patients choose India for major surgery?",
            answer: "India offers world-class quaternary clinical outcomes comparable to top US and European medical centers at 70% to 90% lower costs. Indian hospitals boast the world's highest volumes of complex heart bypasses, living-donor liver transplants, and robotic joint surgeries, meaning Indian surgeons possess unparalleled clinical experience."
        },
        {
            question: "How does AKEEZO help international patients coming to India?",
            answer: "AKEEZO coordinates the entire journey: review of your diagnostic reports by top specialists, multi-hospital quote comparisons with zero-markups, issuance of official hospital medical visa letters, complimentary airport transfers, translation services, hotel bookings for companions, and ongoing bedside care navigation."
        },
        {
            question: "Are Indian hospital standards accredited by international bodies?",
            answer: "Yes, all premier Indian hospitals partnering with AKEEZO hold Joint Commission International (JCI) USA accreditation, National Accreditation Board for Hospitals & Healthcare Providers (NABH), and NABL for laboratory diagnostics. These ensure rigorous sterile operating protocols, infection control, and patient safety."
        },
        {
            question: "How do I get an Indian Medical Visa?",
            answer: "AKEEZO collects your passport copy and sends your case to our accredited hospital partner. Within 24-48 hours, the hospital issues an official Medical Visa Invitation Letter. You then submit your application on the Indian government e-Visa portal; approval is typically granted within 3 to 5 business days."
        },
        {
            question: "Will language be a barrier during my treatment in India?",
            answer: "Not at all. English is the universal language of medical practice and instruction in India. All doctors, nurses, and administrative coordinators speak English fluently. In addition, AKEEZO provides dedicated on-ground interpreters for Arabic, French, Russian, Spanish, and regional languages at no additional fee."
        }
    ],
    active: true
};
export const THAILAND_DESTINATION_DETAIL = {
    id: "thailand",
    name: "Thailand",
    country: "Thailand",
    slug: "thailand",
    flag: "🇹🇭",
    region: "Asia",
    heroImage: "/v2/home-page/destination/chennai.webp",
    galleryImages: [
        "/v2/home-page/destination/chennai.webp",
        "/v2/home-page/destination/bangalore.webp",
        "/v2/home-page/destination/delhi.webp"
    ],
    title: "Medical Tourism in Thailand: JCI Hospitals & Costs 2026 | AKEEZO",
    headline: "Medical Tourism in Thailand: JCI Hospitals & Costs 2026",
    subheadline: "World-Class Hospital Hospitality, Internationally Trained Specialists & Up to 70% Savings in Bangkok & Phuket",
    overviewMarkdown: `Thailand is a pioneer in global medical tourism, renowned for blending five-star hospital hospitality with internationally accredited clinical excellence. The Kingdom was the first country in Asia to earn JCI accreditation, and today features over 60 JCI-accredited medical facilities.

Specializing in plastic and aesthetic surgery, gender affirmation surgery, dental transformations, orthopedic reconstructions, and comprehensive wellness screenings, Thailand welcomes over 2 million international medical and wellness travelers annually. Bangkok's private hospitals resemble luxury hotels while housing state-of-the-art hybrid operating theaters and robotic surgery suites.`,
    whyChoosePoints: [
        {
            title: "World's First-Class Hospital Hospitality",
            description: "Private patient suites with personalized concierge services, international menus, and English/multilingual translation desks.",
            icon: "ShieldCheck"
        },
        {
            title: "Pioneering Aesthetic & Plastic Surgery",
            description: "Globally recognized board-certified plastic surgeons leading in cosmetic transformations and gender confirmation procedures.",
            icon: "Award"
        },
        {
            title: "Significant 65% - 75% Cost Savings",
            description: "Affordable procedures with all-inclusive transparent surgical packages including hospital stay and medications.",
            icon: "DollarSign"
        },
        {
            title: "Seamless Visa on Arrival for 90+ Countries",
            description: "Easy entry with 30 to 60-day visa exemptions and specialized 90-day medical visas for treatment programs.",
            icon: "CheckCircle2"
        }
    ],
    metrics: {
        accreditedHospitalsCount: "28+ JCI",
        avgSavingsPercentage: "65% - 75%",
        annualMedicalTourists: "2.1M+ Patients",
        visaProcessingTime: "Visa on Arrival / 3 Days",
    },
    popularProcedures: [
        "Rhinoplasty & Facial Feminization",
        "Breast Augmentation & Lift",
        "Total Hip & Knee Replacement",
        "All-on-4 Dental Implants",
        "Gender Affirmation Surgery",
        "Executive Health Screening"
    ],
    costTable: [
        {
            procedureName: "Rhinoplasty (Aesthetic & Functional)",
            specialty: "Plastic Surgery",
            destinationPrice: "$2,800",
            destinationPriceNum: 2800,
            usUkBenchmarkPrice: "$11,500",
            usUkBenchmarkPriceNum: 11500,
            savingsPercentage: 75,
            hospitalStayDays: "1 day",
            totalRecoveryDays: "7 days",
            inclusiveNote: "Includes surgeon fees, operating room, general anesthesia, and post-op checkups."
        },
        {
            procedureName: "Breast Augmentation (Mentor Implants)",
            specialty: "Plastic Surgery",
            destinationPrice: "$3,600",
            destinationPriceNum: 3600,
            usUkBenchmarkPrice: "$12,000",
            usUkBenchmarkPriceNum: 12000,
            savingsPercentage: 70,
            hospitalStayDays: "1 day",
            totalRecoveryDays: "7 - 10 days",
            inclusiveNote: "Includes FDA-approved silicone implants, overnight hospital stay, and compression garments."
        },
        {
            procedureName: "Total Knee Replacement",
            specialty: "Orthopedic Surgery",
            destinationPrice: "$8,500",
            destinationPriceNum: 8500,
            usUkBenchmarkPrice: "$45,000",
            usUkBenchmarkPriceNum: 45000,
            savingsPercentage: 81,
            hospitalStayDays: "4 days",
            totalRecoveryDays: "14 days",
            inclusiveNote: "Includes computer-navigated surgery, Stryker implant, 4 nights private suite, and rehab."
        }
    ],
    hospitals: [
        {
            id: "yanhee-international-hospital",
            name: "Yanhee International Hospital",
            slug: "yanhee-international-hospital",
            city: "Bangkok",
            country: "Thailand",
            image: "/v2/home-page/destination/chennai.webp",
            rating: 4.8,
            accreditations: ["JCI", "ISO 9001"],
            specialties: ["Plastic Surgery", "Gender Confirmation", "Dental", "General Surgery"],
            bedsCount: 400,
            rankBadge: "World Destination for Cosmetic & Aesthetic Healthcare"
        }
    ],
    doctors: [
        {
            id: "dr-greet-yanhee",
            name: "Dr. Somboon Thamrongrat",
            slug: "dr-somboon-thamrongrat",
            specialty: "Senior Board-Certified Plastic Surgeon",
            hospital: "Yanhee International Hospital",
            experience: "25+ Years",
            rating: 4.9,
            image: "/v2/home-page/specialities/oncology.webp"
        }
    ],
    travelInfo: {
        visaTitle: "Thailand Tourist & Medical Visa",
        visaDescription: "Citizens from 93 countries can enter Thailand visa-free for up to 60 days. A dedicated Non-Immigrant (MT) 90-day medical visa is available for patients undergoing prolonged treatment protocols.",
        visaProcessingDays: "Instant visa exemption upon arrival",
        visaDocumentsNeeded: [
            "Valid passport with at least 6 months validity",
            "Confirmed round-trip flight ticket",
            "Hospital appointment confirmation letter",
            "Sufficient proof of travel funds"
        ],
        flightHubs: [
            "Bangkok Suvarnabhumi Airport (BKK): Non-stop flights from Europe, Australia, Middle East, and Asia",
            "Phuket International Airport (HKT): Direct international connections to beach recovery destinations"
        ],
        airportPickup: "AKEEZO coordinates private hospital limousine pickup with bilingual greeter directly at the arrivals hall.",
        localTransport: "Bangkok SkyTrain (BTS), MRT subway, and private Grab/hospital cars provide efficient city travel.",
        companionAccommodation: "Adjacent 4-star and 5-star serviced apartments ($40 - $90/night) with kitchenettes and room service.",
        languageAssistance: "English is universally spoken across international hospital departments; interpreters for 30+ languages on site.",
        currencyAndPayments: "Thai Baht (THB). Credit cards, bank transfers, and cash accepted.",
        bestTimeToVisit: "November through February offers cool, dry weather ideal for recuperation and local sightseeing."
    },
    faqs: [
        {
            question: "Why is Thailand known for cosmetic and plastic surgery?",
            answer: "Thailand has cultivated world-leading expertise in aesthetic, reconstructive, and gender affirmation surgery over five decades. Thai surgeons perform thousands of cases each year, refining minimally invasive techniques that yield natural results with minimal scarring."
        },
        {
            question: "Can I combine medical treatment with a holiday in Thailand?",
            answer: "Yes, many patients spend a few days relaxing in Bangkok, Phuket, or Chiang Mai prior to their surgery, or enjoy a tranquil recuperative stay at a beach resort once cleared by their attending physician."
        }
    ],
    active: true
};
export const TURKEY_DESTINATION_DETAIL = {
    id: "turkey",
    name: "Turkey",
    country: "Turkey",
    slug: "turkey",
    flag: "🇹🇷",
    region: "Europe & Middle East",
    heroImage: "/v2/home-page/destination/kerala.webp",
    galleryImages: [
        "/v2/home-page/destination/kerala.webp",
        "/v2/home-page/destination/mumbai.webp",
        "/v2/home-page/destination/delhi.webp"
    ],
    title: "Medical Tourism in Turkey: Clinics & Costs 2026 | AKEEZO",
    headline: "Medical Tourism in Turkey: Clinics & Costs 2026",
    subheadline: "Europe & Middle East's Hub for Hair Transplants, Aesthetic Surgery, Dental Transformations & JCI Quaternary Care",
    overviewMarkdown: `Turkey has cemented its reputation as a global juggernaut in medical travel, serving over 1.5 million international patients every year. Situated uniquely at the crossroads of Europe and Asia, Istanbul boasts the highest concentration of JCI-accredited private hospitals in any single metropolitan area worldwide.

While renowned worldwide as the undisputed capital for Sapphire FUE and DHI hair restoration and Hollywood smile makeovers, Turkey also excels in advanced quaternary oncology, robotic cardiac surgery, and neurosurgery at major academic medical centers like Acıbadem, Memorial Healthcare, and Florence Nightingale.`,
    whyChoosePoints: [
        {
            title: "Global Capital for Hair & Aesthetics",
            description: "Pioneering Sapphire FUE, DHI hair restoration, rhinoplasty, and dental veneers with high-density, guaranteed results.",
            icon: "Award"
        },
        {
            title: "70% Savings with All-Inclusive Packages",
            description: "Fixed-price surgery packages covering procedure, 4/5-star hotel stay, VIP airport transfers, and medications.",
            icon: "DollarSign"
        },
        {
            title: "Over 35 JCI-Accredited Medical Centers",
            description: "Cutting-edge robotic da Vinci systems, CyberKnife, and Gamma Knife technologies meeting European medical standards.",
            icon: "ShieldCheck"
        },
        {
            title: "Direct Flights from 300+ Global Cities",
            description: "Istanbul Airport is a premier global airline hub, offering convenient 2 to 4-hour flights from European and Middle Eastern capitals.",
            icon: "CheckCircle2"
        }
    ],
    metrics: {
        accreditedHospitalsCount: "35+ JCI",
        avgSavingsPercentage: "70% - 80%",
        annualMedicalTourists: "1.5M+ Patients",
        visaProcessingTime: "Instant (e-Visa in 5 mins)",
    },
    popularProcedures: [
        "FUE & DHI Hair Transplantation",
        "Hollywood Smile & Dental Veneers",
        "Rhinoplasty (Closed Technique)",
        "Laser Eye Surgery (SMILE / LASIK)",
        "Gastric Sleeve Bariatric",
        "Oncology & Gamma Knife"
    ],
    costTable: [
        {
            procedureName: "Sapphire FUE Hair Transplant (Up to 4,500 Grafts)",
            specialty: "Hair Restoration",
            destinationPrice: "$2,200",
            destinationPriceNum: 2200,
            usUkBenchmarkPrice: "$12,000",
            usUkBenchmarkPriceNum: 12000,
            savingsPercentage: 82,
            hospitalStayDays: "Outpatient",
            totalRecoveryDays: "3 - 5 days",
            inclusiveNote: "All-inclusive: 4,500 grafts, PRP treatment, 3 nights 5-star hotel, VIP transfers, and post-op care kit."
        },
        {
            procedureName: "Full Mouth Dental Makeover (20 E-Max Veneers)",
            specialty: "Cosmetic Dentistry",
            destinationPrice: "$5,800",
            destinationPriceNum: 5800,
            usUkBenchmarkPrice: "$24,000",
            usUkBenchmarkPriceNum: 24000,
            savingsPercentage: 76,
            hospitalStayDays: "Outpatient",
            totalRecoveryDays: "6 days",
            inclusiveNote: "Includes 20 premium E-max porcelain veneers, 3D digital smile simulation, temporary crowns, and hotel transfers."
        },
        {
            procedureName: "Preservation Rhinoplasty",
            specialty: "Plastic Surgery",
            destinationPrice: "$3,200",
            destinationPriceNum: 3200,
            usUkBenchmarkPrice: "$10,500",
            usUkBenchmarkPriceNum: 10500,
            savingsPercentage: 70,
            hospitalStayDays: "1 day",
            totalRecoveryDays: "7 days",
            inclusiveNote: "Includes surgeon fee, hospital stay, anesthesia, splint and silicone packing removal, and 4-star hotel stay."
        }
    ],
    hospitals: [
        {
            id: "acibadem-healthcare-group",
            name: "Acıbadem Healthcare Group",
            slug: "acibadem-healthcare-group",
            city: "Istanbul",
            country: "Turkey",
            image: "/v2/home-page/destination/kerala.webp",
            rating: 4.9,
            accreditations: ["JCI", "ISO 15189"],
            specialties: ["Oncology", "Cardiology", "Robotic Surgery", "Neurosciences"],
            bedsCount: 800,
            rankBadge: "Turkey's Leading Quaternary Healthcare Network"
        }
    ],
    doctors: [
        {
            id: "dr-emre-istanbul",
            name: "Dr. Emre Demir",
            slug: "dr-emre-demir",
            specialty: "Chief Hair Restoration & Plastic Surgeon",
            hospital: "Acıbadem Altunizade Hospital",
            experience: "19+ Years",
            rating: 4.9,
            image: "/v2/home-page/specialities/cardiac.webp"
        }
    ],
    travelInfo: {
        visaTitle: "Turkey e-Visa Online Application",
        visaDescription: "Citizens from over 100 countries can obtain an e-Visa online within 5 minutes at evisa.gov.tr. Many European and GCC citizens enjoy 90-day visa-free entry.",
        visaProcessingDays: "Instant online approval (5 - 15 minutes)",
        visaDocumentsNeeded: [
            "Passport valid for at least 6 months from entry date",
            "Credit card for e-Visa fee payment (if applicable)",
            "Confirmed hotel reservation and flight ticket"
        ],
        flightHubs: [
            "Istanbul Airport (IST): Modern mega-hub connecting 300+ destinations on Turkish Airlines",
            "Sabiha Gökçen Airport (SAW): Convenient Asian-side hub with budget and full-service carriers"
        ],
        airportPickup: "VIP Mercedes Vito / Sprinter transfer from airport directly to partner 5-star hotel included with treatment packages.",
        localTransport: "Metro, Marmaray cross-continental rail, Istanbulkart transit card, and hotel concierge cars.",
        companionAccommodation: "Partner 4-star and 5-star luxury hotels in Sisli, Taksim, and Besiktas ($50 - $110/night).",
        languageAssistance: "International patient coordinators speak fluent English, Arabic, German, Russian, and French.",
        currencyAndPayments: "Turkish Lira (TRY), US Dollars (USD), and Euros (EUR) accepted. Credit cards widely taken.",
        bestTimeToVisit: "April to June and September to November provide ideal, comfortable weather for recovery."
    },
    faqs: [
        {
            question: "Why are hair transplants so popular and affordable in Turkey?",
            answer: "Turkey benefits from highly specialized clinics performing high volumes of hair restorations, lower operational costs, and favorable exchange rates, allowing clinics to bundle VIP hotel stays and transfers while maintaining surgeon-led, internationally accredited standards."
        },
        {
            question: "Are treatments in Turkey performed in certified hospitals?",
            answer: "Yes, AKEEZO exclusively partners with Turkish Ministry of Health-licensed clinics and Joint Commission International (JCI)-accredited hospitals that adhere to strict European sterile hygiene and safety guidelines."
        }
    ],
    active: true
};
// Helper function to resolve any destination detail
export function getDestinationDetail(slug, customList) {
    const normalizedSlug = slug.toLowerCase().trim();
    // 1. Identify baseline detailed destination if available
    let baseDetail = undefined;
    if (normalizedSlug === "mexico")
        baseDetail = MEXICO_DESTINATION_DETAIL;
    else if (normalizedSlug === "india")
        baseDetail = INDIA_DESTINATION_DETAIL;
    else if (normalizedSlug === "thailand")
        baseDetail = THAILAND_DESTINATION_DETAIL;
    else if (normalizedSlug === "turkey")
        baseDetail = TURKEY_DESTINATION_DETAIL;
    // 2. If a custom record exists from Page CMS, merge with base detail or hydrate full schema
    if (customList && customList.length > 0) {
        const found = customList.find((d) => d.slug && d.slug.toLowerCase() === normalizedSlug);
        if (found) {
            if (found.overviewMarkdown && found.title) {
                return found;
            }
            const fallbackBase = baseDetail || INDIA_DESTINATION_DETAIL;
            return {
                ...fallbackBase,
                id: found.id || fallbackBase.id,
                name: found.name || found.country || fallbackBase.name,
                country: found.country || fallbackBase.country,
                slug: found.slug || fallbackBase.slug,
                title: found.title || (baseDetail ? baseDetail.title : `Medical Tourism in ${found.country || found.name || fallbackBase.country}: Clinics & Costs 2026 | AKEEZO`),
                headline: found.headline || (baseDetail ? baseDetail.headline : `Medical Tourism in ${found.country || found.name || fallbackBase.country}: Clinics & Costs 2026`),
                subheadline: found.subheadline || (baseDetail ? baseDetail.subheadline : found.tagline || fallbackBase.subheadline),
                heroImage: found.image || found.heroImage || fallbackBase.heroImage,
                popularProcedures: found.popularProcedures || fallbackBase.popularProcedures,
                active: found.active !== false
            };
        }
    }
    if (baseDetail)
        return baseDetail;
    // Check if it's an Indian city slug
    const matchedCity = ALL_DESTINATIONS.find((d) => d.slug === normalizedSlug && d.type === "city");
    if (matchedCity) {
        return {
            ...INDIA_DESTINATION_DETAIL,
            id: matchedCity.id,
            name: `${matchedCity.name}, India`,
            country: "India",
            slug: matchedCity.slug,
            title: `Medical Tourism in ${matchedCity.name}: Hospitals & Costs 2026 | AKEEZO`,
            headline: `Medical Tourism in ${matchedCity.name}: Hospitals & Costs 2026`,
            subheadline: `${matchedCity.tagline} — Accredited Multi-Specialty Quaternary Hospitals & Personalized Care Coordination`,
            heroImage: matchedCity.image,
            popularProcedures: matchedCity.popularProcedures,
            metrics: {
                accreditedHospitalsCount: `${matchedCity.hospitalCount}+ Hospitals`,
                avgSavingsPercentage: `${matchedCity.savingsPercentage}% Savings`,
                annualMedicalTourists: "250K+ Patients",
                visaProcessingTime: "3 - 5 Days (e-Med)"
            }
        };
    }
    // Check generic country in ALL_DESTINATIONS
    const matchedCountry = ALL_DESTINATIONS.find((d) => d.slug === normalizedSlug);
    if (matchedCountry) {
        return {
            ...INDIA_DESTINATION_DETAIL,
            id: matchedCountry.id,
            name: matchedCountry.name,
            country: matchedCountry.country,
            slug: matchedCountry.slug,
            flag: matchedCountry.flag,
            title: `Medical Tourism in ${matchedCountry.name}: Clinics & Costs 2026 | AKEEZO`,
            headline: `Medical Tourism in ${matchedCountry.name}: Clinics & Costs 2026`,
            subheadline: `${matchedCountry.tagline} — Top JCI & Internationally Accredited Medical Centers`,
            heroImage: matchedCountry.image,
            popularProcedures: matchedCountry.popularProcedures,
            metrics: {
                accreditedHospitalsCount: `${matchedCountry.hospitalCount}+ Clinics`,
                avgSavingsPercentage: `${matchedCountry.savingsPercentage}% Savings`,
                annualMedicalTourists: "500K+ Patients",
                visaProcessingTime: matchedCountry.visaProcessingDays
            }
        };
    }
    return undefined;
}
