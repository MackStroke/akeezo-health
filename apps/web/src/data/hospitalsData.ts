export interface HospitalItem {
  id: string;
  name: string;
  slug: string;
  rank?: number;
  rankBadge?: string;
  city: string;
  country: string;
  rating?: number;
  accreditations: string[];
  specialties: string[];
  summary: string;
  detailsMarkdown: string;
  href: string;
  image: string;
  fallbackImage: string;
  isTopHospital?: boolean;
  isRecentlyViewed?: boolean;
}

export const ALL_HOSPITALS: HospitalItem[] = [
  {
    id: "yanhee-international-hospital",
    name: "Yanhee International Hospital",
    slug: "yanhee-international-hospital",
    rank: 1,
    rankBadge: "Ranked 1st Best Hospital in Thailand",
    city: "Bangkok",
    country: "Thailand",
    rating: 75.21,
    accreditations: ["JCI", "ISO", "HA Thailand"],
    specialties: ["Cosmetic & Plastic Surgery", "Bariatric Surgery", "Dermatology", "Facial Aesthetics"],
    summary: "Established multi-specialty private hospital recognized worldwide for over three decades for its cosmetic surgery and bariatric programs.",
    detailsMarkdown: "The Yanhee International Hospital has been one of the most established multi-specialty private hospitals in Thailand and recognized for many years for both its cosmetic surgery programs and bariatric programs, attracting international patients for over three decades.\n\n### Ratings & Certification\n- The hospital was ranked #12 in Thailand by Newsweek, 2025 (rating 75.21)\n- JCI Accredited\n- ISO Certified since 2000\n- Thai Hospital Accreditation (HA)\n\n### Patient Satisfaction\nAn estimated 75% of Yanhee's International Patients are either repeat customers or referred via positive personal recommendations of previous patients.\n\n### Centers of Excellence\n- Cosmetic & Plastic Surgery: Rhinoplasty, Facelifts, Breast Enhancement, Liposuction, Body Sculpting\n- Bariatric Program: Gastric Sleeve, Gastric Bypass, Gastric Banding with preoperative and long-term nutrition support",
    href: "/hospitals/yanhee-international-hospital",
    image: "/uploads/hospitals/yanhee-international-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/52/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: false
  },
  {
    id: "memorial-sisli-hospital",
    name: "Memorial \u015ei\u015fli Hospital",
    slug: "memorial-sisli-hospital",
    rank: 2,
    rankBadge: "Ranked 2nd Best Hospital in Turkey",
    city: "Istanbul",
    country: "Turkey",
    rating: 88.4,
    accreditations: ["JCI", "ISO 9001", "ECRI Partner"],
    specialties: ["Organ & Bone Marrow Transplant", "Oncology", "Cardiac Surgery", "IVF & Genetics", "Robotic Surgery"],
    summary: "First hospital in Turkey and 21st worldwide to achieve JCI accreditation, welcoming patients from over 167 countries across major surgical specialties.",
    detailsMarkdown: "One of the most prestigious hospitals in Istanbul's European district, Memorial \u015ei\u015fli has been the center of choice for international patients since 2000. It was the first hospital in Turkey to receive JCI accreditation.\n\n### Health Care Disciplines\n- Organ and bone marrow transplants (success rate up to 90%)\n- Oncology treatments aligned with NCCN and ESMO international guidelines\n- Cardiovascular surgery and robotic surgery\n- Assisted reproductive technologies (IVF and genetics)\n\n### Support Services for Foreign Patients\n- Travel arrangements, airport transfers, and visa facilitation\n- Dedicated multilingual care coordinators\n- Customized accommodation and tailored treatment plans",
    href: "/hospitals/memorial-sisli-hospital",
    image: "/uploads/hospitals/memorial-sisli-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/41/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: false
  },
  {
    id: "acibadem-international-hospital",
    name: "ACIBADEM International Hospital",
    slug: "acibadem-international-hospital",
    rank: 3,
    rankBadge: "Ranked 3rd Best Hospital in Turkey",
    city: "Istanbul",
    country: "Turkey",
    rating: 89.1,
    accreditations: ["JCI", "LEED Gold Certified", "ISO 9001"],
    specialties: ["Cardiology", "Oncology", "Neurosurgery", "Orthopedic Surgery", "Organ Transplant"],
    summary: "Private multi-disciplinary hospital in Istanbul's Ye\u015filk\u00f6y district featuring JCI accreditation and LEED Gold green healthcare certification.",
    detailsMarkdown: "Ac\u0131badem International Hospital provides comprehensive multidisciplinary care with modern equipment and collaborative specialist teams.\n\n### Medical Specializations\n- Centers of Excellence in cardiology, oncology, neurosurgery, orthopedics, and organ transplantation\n- Dedicated outpatient chemotherapy, catheterization laboratory, breast health center, and sleep lab\n\n### International Patient Services\n- Coordinating personalized treatment plans with top medical teams\n- Assistance in 25+ languages, airport pickup, and dedicated concierge\n- Complete visa and local stay coordination",
    href: "/hospitals/acibadem-international-hospital",
    image: "/uploads/hospitals/acibadem-international-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/36/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: false
  },
  {
    id: "bumrungrad-international-hospital",
    name: "Bumrungrad International Hospital",
    slug: "bumrungrad-international-hospital",
    rank: 4,
    rankBadge: "Ranked 4th Best Hospital in Thailand",
    city: "Bangkok",
    country: "Thailand",
    rating: 93.5,
    accreditations: ["JCI (7 Cycles)", "GHA Certified", "ISO 9001"],
    specialties: ["Oncology", "Robotic Surgery", "Cardiology", "Orthopedics", "Genomics"],
    summary: "World-famous 580-bed medical center in Bangkok. First hospital in Asia accredited by JCI in 2002 and ranked #1 in Thailand by Newsweek 2025.",
    detailsMarkdown: "Bumrungrad International Hospital is an internationally recognized multi-specialty institution serving over 1.1 million patients each year from 190+ countries.\n\n### Medical Staff & Expertise\n- Over 1,200 physicians, with 210+ board-certified in the US, UK, Australia, or Japan\n- Interpretation services in 30+ languages\n\n### Advanced Medical Technology\n- IBM Watson for Oncology & MAKOplasty Robotic Orthopedic Arm\n- TrueBeam STx radiation therapy and Hybrid Cardiac Catheterization Lab\n- 23 Global Referral Offices and direct billing with 100+ insurers",
    href: "/hospitals/bumrungrad-international-hospital",
    image: "/uploads/hospitals/bumrungrad-international-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/51/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: false
  },
  {
    id: "estetik-international-s-bursa-clinic",
    name: "Estetik International\u2019s Bursa Clinic",
    slug: "estetik-international-s-bursa-clinic",
    rank: 5,
    rankBadge: "Ranked 5th Best Hospital in Turkey",
    city: "Bursa",
    country: "Turkey",
    rating: 86.0,
    accreditations: ["ISO 9001", "ISO 27001", "ISO 10002"],
    specialties: ["Plastic Surgery", "Aesthetic Dermatology", "Hair Restoration", "Cosmetic Dentistry"],
    summary: "Founded in 1999 by Dr. B\u00fclent Cihantimur, offering 3,500 m\u00b2 across 7 floors with 3 fully equipped surgical theaters and luxury recovery suites.",
    detailsMarkdown: "Known for combining clinical precision with patient comfort, Estetik International Bursa welcomes over 5,000 patients annually.\n\n### Facilities & Standards\n- 12 inpatient recovery rooms including 5 intensive care beds\n- ISO 9001 quality management, ISO 27001 data security, and ISO 10002 customer satisfaction certifications\n- Multidisciplinary team of plastic surgeons, dermatologists, and dental specialists",
    href: "/hospitals/estetik-international-s-bursa-clinic",
    image: "/uploads/hospitals/estetik-international-s-bursa-clinic.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/50/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: false
  },
  {
    id: "medanta-the-medicity-gurugram",
    name: "Medanta \u2013 The Medicity Gurugram",
    slug: "medanta-the-medicity-gurugram",
    rank: 6,
    rankBadge: "Ranked 6th Best Hospital in India",
    city: "Gurugram",
    country: "India",
    rating: 91.2,
    accreditations: ["JCI", "NABH", "NABL"],
    specialties: ["Cardiac Surgery", "Liver Transplant", "Kidney Transplant", "Oncology", "Neurosciences"],
    summary: "Iconic 43-acre, 1,250+ bed quaternary healthcare institution founded by Dr. Naresh Trehan. Features 40+ advanced operation theaters and 270+ ICU beds.",
    detailsMarkdown: "Medanta \u2013 The Medicity is one of India's premier multi-super specialty institutes, internationally acclaimed for high-complexity surgical treatments.\n\n### Centers of Excellence\n- World-record high success rates in Living Donor Liver and Kidney Transplants\n- Advanced Robotic Surgery (da Vinci Xi) and minimally invasive cardiac operations\n- Dedicated International Patient Lounge, multilingual care team, and emergency aeromedical evacuation",
    href: "/hospitals/medanta-the-medicity-gurugram",
    image: "/uploads/hospitals/medanta-the-medicity-gurugram.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/3167/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: false
  },
  {
    id: "memorial-bahcelievler-hospital",
    name: "Memorial Bah\u00e7elievler Hospital",
    slug: "memorial-bahcelievler-hospital",
    rank: 7,
    rankBadge: "Ranked 7th Best Hospital in Turkey",
    city: "Istanbul",
    country: "Turkey",
    rating: 89.8,
    accreditations: ["JCI", "LEED Platinum Certified"],
    specialties: ["Oncology", "Cardiovascular Surgery", "Robotic Surgery", "Orthopedics", "Gynecology"],
    summary: "Opened in 2018 across 72,000 m\u00b2 with 320 beds and 15 surgical suites. The world's first full-scale hospital certified as LEED Platinum.",
    detailsMarkdown: "Memorial Bah\u00e7elievler combines high-technology clinical services with sustainable healing architecture, natural lighting, and green therapy gardens.\n\n### Advanced Oncology & Surgery\n- Top cancer treatment facility in Turkey with cutting-edge radiation oncology (Elekta Versa HD, TrueBeam)\n- Specialized international services with multilingual assistance, airport VIP transfers, and on-campus family suites",
    href: "/hospitals/memorial-bahcelievler-hospital",
    image: "/uploads/hospitals/memorial-bahcelievler-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/42/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: false
  },
  {
    id: "bangkok-hospital",
    name: "Bangkok Hospital",
    slug: "bangkok-hospital",
    rank: 8,
    rankBadge: "Ranked 8th Best Hospital in Thailand",
    city: "Bangkok",
    country: "Thailand",
    rating: 92.4,
    accreditations: ["JCI", "BDMS Network", "ISO Certified"],
    specialties: ["Wattanosoth Cancer Care", "Cardiac Surgery", "Neurosurgery", "Orthopedics", "Fertility"],
    summary: "Flagship quaternary care facility of BDMS Network (53 hospitals). Consistently rated among top 5 hospitals in Thailand by Newsweek.",
    detailsMarkdown: "Treating over 1 million patients annually, Bangkok Hospital is Southeast Asia's foremost medical travel center.\n\n### Specialized Centers\n- Wattanosoth Cancer Hospital: CyberKnife Radiosurgery, da Vinci Robotic Surgery, and PET-MRI imaging\n- Bangkok Heart Hospital: 24/7 emergency catheterization and complex coronary bypass\n- Dedicated International Medical Center with 30+ language translators and transparent package pricing",
    href: "/hospitals/bangkok-hospital",
    image: "/uploads/hospitals/bangkok-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/53/thumbnail.jpg",
    isTopHospital: true,
    isRecentlyViewed: true
  },
  {
    id: "medical-park-goztepe-hospital",
    name: "Medical Park Goztepe Hospital",
    slug: "medical-park-goztepe-hospital",
    city: "Istanbul",
    country: "Turkey",
    accreditations: ["JCI", "ISO 9001"],
    specialties: ["Cardiology", "Oncology", "Pediatrics", "General Surgery"],
    summary: "Private multi-specialty complex in Istanbul serving patients across Europe, the US, Canada, and Australia with high clinical excellence.",
    detailsMarkdown: "Medical Park Goztepe Hospital delivers full-spectrum inpatient and outpatient services with recognized excellence in adult and pediatric oncology and cardiovascular surgery.",
    href: "/hospitals/medical-park-goztepe-hospital",
    image: "/uploads/hospitals/medical-park-goztepe-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/38/thumbnail.jpg",
    isTopHospital: false,
    isRecentlyViewed: true
  },
  {
    id: "memorial-atasehir-hospital",
    name: "Memorial Ata\u015fehir Hospital",
    slug: "memorial-atasehir-hospital",
    city: "Istanbul",
    country: "Turkey",
    accreditations: ["JCI", "ISO 9001"],
    specialties: ["Oncology", "Cardiology", "Orthopedics", "Advanced Surgery"],
    summary: "State-of-the-art Memorial Healthcare Group facility on Istanbul's Asian side, acclaimed for robotic surgery, oncology, and personalized concierge care.",
    detailsMarkdown: "Memorial Ata\u015fehir Hospital is accredited by JCI and operates dedicated Centers of Excellence in cardiology, targeted oncology therapies, and orthopedic joint replacement.",
    href: "/hospitals/memorial-atasehir-hospital",
    image: "/uploads/hospitals/memorial-atasehir-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/43/thumbnail.jpg",
    isTopHospital: false,
    isRecentlyViewed: true
  },
  {
    id: "bnh-hospital",
    name: "BNH Hospital",
    slug: "bnh-hospital",
    city: "Bangkok",
    country: "Thailand",
    accreditations: ["JCI", "ISO Certified"],
    specialties: ["Fertility & IVF", "Cosmetic Surgery", "Dental Center", "Executive Health"],
    summary: "Founded in 1898 as the Bangkok Nursing Home, serving the Silom district for over 120 years with boutique luxury and English-speaking medical teams.",
    detailsMarkdown: "BNH Hospital offers a personalized, intimate healthcare experience favored by international patients seeking ART fertility treatments, cosmetic surgeries, and executive health screenings.",
    href: "/hospitals/bnh-hospital",
    image: "/uploads/hospitals/bnh-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/54/thumbnail.jpg",
    isTopHospital: false,
    isRecentlyViewed: true
  },
  {
    id: "samitivej-sukhumvit-hospital",
    name: "Samitivej Sukhumvit Hospital",
    slug: "samitivej-sukhumvit-hospital",
    city: "Bangkok",
    country: "Thailand",
    accreditations: ["JCI", "WHO/UNICEF Mother-Friendly"],
    specialties: ["Women's Health", "IVF & Fertility", "Oncology (MGH Collaboration)", "Pediatrics"],
    summary: "Ranked #2 hospital in Thailand by Newsweek 2025. Historic collaboration with Massachusetts General Hospital (MGH) for oncology clinical trials.",
    detailsMarkdown: "Samitivej Sukhumvit Hospital is internationally acclaimed for Women's and Family Health, comprehensive ART fertility services, and advanced oncology care.",
    href: "/hospitals/samitivej-sukhumvit-hospital",
    image: "/uploads/hospitals/samitivej-sukhumvit-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/55/thumbnail.jpg",
    isTopHospital: false,
    isRecentlyViewed: true
  },
  {
    id: "bangpakok-9-international-hospital",
    name: "Bangpakok 9 International Hospital",
    slug: "bangpakok-9-international-hospital",
    city: "Bangkok",
    country: "Thailand",
    accreditations: ["JCI", "HA Thailand"],
    specialties: ["Oncology", "Cardiovascular Programs", "Minimally Invasive Surgery", "Cardiac Rehab"],
    summary: "JCI-accredited medical center ranked #15 in Thailand by Newsweek 2025, equipped with Hybrid Operating Theaters and advanced PET-CT oncology imaging.",
    detailsMarkdown: "BPK-9 delivers multidisciplinary cancer care, angioplasty, open-heart surgery, and structured cardiac rehabilitation supported by dedicated international coordinators.",
    href: "/hospitals/bangpakok-9-international-hospital",
    image: "/uploads/hospitals/bangpakok-9-international-hospital.jpg",
    fallbackImage: "https://d162jy5nwnavsz.cloudfront.net/hospitals/57/thumbnail.jpg",
    isTopHospital: false,
    isRecentlyViewed: true
  },
];

export const TOP_HOSPITALS = ALL_HOSPITALS.filter(h => h.isTopHospital);

export const RECENTLY_VIEWED_HOSPITALS = ALL_HOSPITALS.filter(h => h.isRecentlyViewed);

export const HOSPITAL_COUNTRIES = ["All Countries", "Thailand", "Turkey", "India"];

export const HOSPITAL_TREATMENTS = [
  "All Treatments",
  "Oncology",
  "Cardiology",
  "Cosmetic & Plastic Surgery",
  "IVF & Fertility",
  "Orthopedics",
  "Robotic Surgery",
  "Organ Transplant",
  "Bariatric Surgery"
];

