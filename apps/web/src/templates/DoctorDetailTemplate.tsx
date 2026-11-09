import React, { useState, useMemo } from "react";
import type { PublicRouteResponseDTO, DoctorDetail } from "@akeezo/contracts";
import {
  Star,
  MapPin,
  Building2,
  Clock,
  Award,
  BookOpen,
  Share2,
  Heart,
  ChevronDown,
  ArrowRight,
  Stethoscope,
  Video,
  CheckCircle2,
  Sparkles,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import { DoctorBookingModal } from "../components/DoctorBookingModal.js";
import { DoctorStickyBottomBar } from "../components/DoctorStickyBottomBar.js";
import { ALL_DOCTORS, getDoctorDetail } from "../data/doctorsData.js";

export interface DoctorDetailTemplateProps {
  data: PublicRouteResponseDTO;
}

export function DoctorDetailTemplate({ data }: DoctorDetailTemplateProps) {
  const payload = (data.payload as any) || {};
  const slug = payload.slug || "semra-kahraman";

  // Resolve doctor detail
  const doctor: DoctorDetail = useMemo(() => {
    if (payload.doctor && payload.doctor.name) {
      return payload.doctor as DoctorDetail;
    }
    const resolved = getDoctorDetail(slug);
    if (resolved) return resolved;
    // Fallback default
    return {
      id: "3797",
      name: "Prof. Dr. Semra Kahraman",
      slug: "semra-kahraman",
      href: "/doctors/semra-kahraman",
      image: "/uploads/doctors/doctor-3797.jpg",
      specialty: "IVF Treatment",
      designation: "Director, ART & Reproductive Genetics Center",
      badge: "Top IVF & Reproductive Genetics Surgeon",
      experience: "45+ years",
      experienceYears: 45,
      hospital: "Memorial Şişli Hospital",
      hospitalAddress: "Piyalepaşa Bulvarı, 34385 Şişli, Istanbul, Turkey",
      city: "Istanbul",
      country: "Turkey",
      rating: 5.0,
      reviewCount: 520,
      bio: "Pioneered Turkey's first microinjection and preimplantation genetic diagnosis (PGD) procedures.",
      aboutBio:
        "Prof. Dr. Semra Kahraman is a world-renowned Professor of Obstetrics and Gynecology, and the Director of the ART & Reproductive Genetics Center at Memorial Şişli Hospital in Istanbul, Turkey.",
      professionalBackground: {
        yearsOfWork: "Since 1981 (45+ years clinical practice)",
        primaryClinic: "Head of IVF Department, Memorial Şişli Hospital",
        basedIn: "Istanbul, Turkey",
        languages: ["English", "Turkish"],
      },
      innovations: [
        "First ICSI Pregnancy in Turkey (1995)",
        "First embryonic stem cell lines in Turkey",
        "Preimplantation Genetic Testing pioneer",
      ],
      goodToKnow: {
        surgeriesCount: "30,000+ Successful Births",
        successRate: "68% – 72% Clinical Pregnancy Rate",
        responseTime: "Usually responds within 2 hours",
        accreditations: ["JCI Accredited", "ESHRE Certified"],
      },
      experiences: [],
      educations: [],
      procedures: [],
      reviews: [],
      faqs: [],
      teleconsultationFeeUsd: "Free Initial Review",
      verified: true,
      isTopDoctor: true,
    };
  }, [payload.doctor, slug]);

  // Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedProcedureForModal, setSelectedProcedureForModal] = useState<string | undefined>(undefined);

  // Wishlist & Share state
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  // Active review filter
  const [reviewFilter, setReviewFilter] = useState<"all" | "verified" | "google">("all");

  // Open FAQ accordion items
  const [openFaqIndices, setOpenFaqIndices] = useState<Record<number, boolean>>({ 0: true });

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${doctor.name} | ${doctor.specialty} at ${doctor.hospital}`,
          text: `Consult with ${doctor.name}, world-class ${doctor.specialty} specialist.`,
          url: typeof window !== "undefined" ? window.location.href : `/doctors/${doctor.slug}`,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(typeof window !== "undefined" ? window.location.href : "");
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2500);
    }
  };

  const handleOpenBooking = (procedureName?: string) => {
    setSelectedProcedureForModal(procedureName);
    setIsBookingOpen(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Filter reviews
  const filteredReviews = useMemo(() => {
    if (!doctor.reviews || doctor.reviews.length === 0) return [];
    if (reviewFilter === "verified") {
      return doctor.reviews.filter((r) => r.verified && r.source !== "google");
    }
    if (reviewFilter === "google") {
      return doctor.reviews.filter((r) => r.source === "google");
    }
    return doctor.reviews;
  }, [doctor.reviews, reviewFilter]);

  // Similar Doctors list
  const similarDoctors = useMemo(() => {
    return ALL_DOCTORS.filter((d) => d.slug !== doctor.slug && (d.specialty === doctor.specialty || d.country === doctor.country)).slice(0, 3);
  }, [doctor.slug, doctor.specialty, doctor.country]);

  // Breadcrumbs items
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: doctor.specialty, href: `/doctors?specialty=${encodeURIComponent(doctor.specialty)}` },
    { label: doctor.name, href: `/doctors/${doctor.slug}` },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-slate-900 selection:bg-brand-orange/20 selection:text-brand-orange-hover">
      {/* Schema.org JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Physician",
            name: doctor.name,
            description: doctor.aboutBio || doctor.bio,
            url: `https://akeezo.com/doctors/${doctor.slug}`,
            image: doctor.image,
            medicalSpecialty: doctor.specialty,
            yearsInPractice: doctor.experienceYears,
            hasCredential: doctor.educations?.map((edu) => ({
              "@type": "EducationalOccupationalCredential",
              credentialCategory: "Education",
              educationalLevel: edu.title,
              recognizedBy: {
                "@type": "Organization",
                name: edu.institution,
              },
            })),
            worksFor: {
              "@type": "Hospital",
              name: doctor.hospital,
              address: {
                "@type": "PostalAddress",
                addressLocality: doctor.city,
                addressCountry: doctor.country,
              },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breadcrumbs.map((bc, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: bc.label,
              item: `https://akeezo.com${bc.href}`,
            })),
          }),
        }}
      />
      {doctor.faqs && doctor.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: doctor.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      {/* Global Navigation Header */}
      <SiteHeader />

      <main className="flex-1">
        {/* Breadcrumb Navigation Bar */}
        <div className="bg-white border-b border-slate-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 overflow-x-auto whitespace-nowrap">
              {breadcrumbs.map((bc, i) => (
                <React.Fragment key={bc.href}>
                  {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-semibold text-slate-900 truncate">{bc.label}</span>
                  ) : (
                    <a href={bc.href} className="hover:text-[#007A6C] transition">
                      {bc.label}
                    </a>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>
        </div>

        {/* Doctor Hero Profile Header */}
        <div className="bg-gradient-to-b from-white to-slate-50/60 border-b border-slate-200/80 pt-6 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start gap-6 lg:gap-8">
              {/* Doctor Avatar with Verified Ring */}
              <div className="relative shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden shadow-xl ring-4 ring-white border-2 border-[#00C7BE]">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div
                  className="absolute bottom-1 right-2 bg-[#007A6C] text-white p-1.5 rounded-full shadow-md"
                  title="Verified Healthcare Specialist"
                >
                  <BadgeCheck className="w-5 h-5 text-[#00C7BE]" />
                </div>
              </div>

              {/* Doctor Overview & Telemetry Badges */}
              <div className="flex-1 text-center md:text-left min-w-0">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-50 text-[#007A6C] border border-teal-200">
                    <Stethoscope className="w-3.5 h-3.5" />
                    <span>{doctor.specialty}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Specialist</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {doctor.name}
                </h1>
                <p className="text-sm sm:text-base font-semibold text-slate-600 mt-1">
                  {doctor.designation} · {doctor.hospital}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-xs text-slate-500 mt-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#007A6C]" />
                    <span>
                      {doctor.hospital}, {doctor.city}, {doctor.country}
                    </span>
                  </span>
                </div>

                {/* Telemetry Counter Cards (Matching Reference: Experience, Reviews, Rating) */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mt-5 mx-auto md:mx-0">
                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                    <div className="text-lg sm:text-2xl font-black text-[#007A6C] leading-none">
                      {doctor.experienceYears}+
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-1">
                      Years of Experience
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                    <div className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
                      {doctor.reviewCount}+
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-1">
                      Reviews Across Web
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs text-center">
                    <div className="text-lg sm:text-2xl font-black text-amber-500 flex items-center justify-center gap-1 leading-none">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                      <span>{doctor.rating}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-slate-500 mt-1">
                      Average Rating
                    </div>
                  </div>
                </div>

                {/* Action Buttons: Wishlist & Share */}
                <div className="flex items-center justify-center md:justify-start gap-3 mt-5">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                      isWishlisted
                        ? "bg-rose-50 text-rose-600 border-rose-200"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                    <span>{isWishlisted ? "Saved to Wishlist" : "Save Doctor"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition flex items-center gap-1.5"
                  >
                    <Share2 className="w-4 h-4 text-slate-500" />
                    <span>Share Profile</span>
                  </button>

                  {shareToast && (
                    <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fade-in">
                      Link copied to clipboard!
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Anchor Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6 overflow-x-auto py-3 text-xs sm:text-sm font-semibold text-slate-600 no-scrollbar">
              <button
                type="button"
                onClick={() => scrollToSection("overview")}
                className="hover:text-[#007A6C] transition whitespace-nowrap active:text-[#007A6C]"
              >
                Overview
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("procedures")}
                className="hover:text-[#007A6C] transition whitespace-nowrap"
              >
                Procedures ({doctor.procedures?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("experience")}
                className="hover:text-[#007A6C] transition whitespace-nowrap"
              >
                Experience & Credentials
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("reviews")}
                className="hover:text-[#007A6C] transition whitespace-nowrap"
              >
                Reviews ({doctor.reviews?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("similar-doctors")}
                className="hover:text-[#007A6C] transition whitespace-nowrap"
              >
                Similar Doctors
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("faqs")}
                className="hover:text-[#007A6C] transition whitespace-nowrap"
              >
                FAQs
              </button>
            </div>
          </div>
        </div>

        {/* Main Two-Column Layout Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT MAIN CONTENT COLUMN (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Promotional Offer Banner Card */}
              <div className="bg-gradient-to-r from-teal-900 to-[#061E1B] text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-teal-950 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-[#FF6B00] text-white px-2.5 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" />
                    <span>Akeezo Patient Surety</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg">
                    Free International Patient Concierge & Travel Coordination
                  </h3>
                  <p className="text-xs text-teal-200/90 max-w-md">
                    Zero consultation booking fees. Direct hospital pricing guaranteed with complimentary airport pickup
                    and translation assistance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="px-5 py-2.5 bg-[#00C7BE] hover:bg-[#00b0a8] text-[#061E1B] text-xs font-bold rounded-xl transition shrink-0 shadow-sm"
                >
                  Claim Offer
                </button>
              </div>

              {/* SECTION: Overview / About Bio */}
              <section id="overview" className="space-y-6">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    About {doctor.name}
                  </h2>
                </div>

                <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed whitespace-pre-line">
                  {doctor.aboutBio || doctor.bio}
                </div>

                {/* Professional Background Card (Matching Reference Specs) */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#007A6C] flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>Professional Background</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="text-slate-400 font-medium">Years of Active Practice</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {doctor.professionalBackground?.yearsOfWork || `${doctor.experienceYears}+ years`}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="text-slate-400 font-medium">Clinical Department</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {doctor.professionalBackground?.primaryClinic || doctor.hospital}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="text-slate-400 font-medium">Practicing Location</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {doctor.professionalBackground?.basedIn || `${doctor.city}, ${doctor.country}`}
                      </div>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="text-slate-400 font-medium">Consultation Languages</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">
                        {doctor.professionalBackground?.languages?.join(", ") || "English, Turkish"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Innovations & Clinical Milestones Card */}
                {doctor.innovations && doctor.innovations.length > 0 && (
                  <div className="bg-teal-50/40 rounded-3xl p-6 border border-teal-100/80 space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#007A6C] flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      <span>Clinical Innovations & Key Contributions</span>
                    </h3>

                    <ul className="space-y-2 text-xs text-slate-700">
                      {doctor.innovations.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#007A6C] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* SECTION: Procedures & Pricing Comparison */}
              <section id="procedures" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Procedures Performed by {doctor.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Direct hospital pricing with verified international savings up to 78%
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {doctor.procedures && doctor.procedures.length > 0 ? (
                    doctor.procedures.map((proc) => (
                      <div
                        key={proc.id}
                        className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs hover:shadow-md transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#007A6C] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                              {proc.category}
                            </span>
                            <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">{proc.name}</h3>
                          </div>

                          <div className="text-right sm:text-right shrink-0">
                            <div className="text-lg font-black text-[#007A6C]">{proc.indicativeCostUsd}</div>
                            <div className="text-[11px] text-slate-400 line-through">
                              US / UK avg: {proc.usUkCostUsd}
                            </div>
                            <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                              Save up to {proc.savingsPercent}%
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed mt-3">{proc.description}</p>

                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Estimated Treatment Duration: {proc.duration}</span>
                          </span>

                          <button
                            type="button"
                            onClick={() => handleOpenBooking(proc.name)}
                            className="px-4 py-2 bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>Request Procedure Quote</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-2xl">
                      Detailed procedure catalogue available upon consultation request.
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION: Experience & Education Timeline */}
              <section id="experience" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Experience & Medical Credentials
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Experience Timeline */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#007A6C] flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Career Appointments</span>
                    </h3>

                    <div className="space-y-4 text-xs">
                      {doctor.experiences && doctor.experiences.length > 0 ? (
                        doctor.experiences.map((exp, idx) => (
                          <div key={idx} className="relative pl-5 border-l-2 border-teal-200/80 space-y-0.5">
                            <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-[#007A6C] ring-4 ring-white" />
                            <div className="font-bold text-slate-900">{exp.title}</div>
                            <div className="text-slate-600 font-medium">{exp.institution}</div>
                            <div className="text-[11px] text-teal-700 font-semibold">{exp.period}</div>
                            {exp.description && (
                              <p className="text-[11px] text-slate-500 pt-1">{exp.description}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400">Chief medical consultant at accredited hospital.</div>
                      )}
                    </div>
                  </div>

                  {/* Education Timeline */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#007A6C] flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Education & Fellowships</span>
                    </h3>

                    <div className="space-y-4 text-xs">
                      {doctor.educations && doctor.educations.length > 0 ? (
                        doctor.educations.map((edu, idx) => (
                          <div key={idx} className="relative pl-5 border-l-2 border-emerald-200/80 space-y-0.5">
                            <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-600 ring-4 ring-white" />
                            <div className="font-bold text-slate-900">{edu.title}</div>
                            <div className="text-slate-600 font-medium">{edu.institution}</div>
                            <div className="text-[11px] text-emerald-700 font-semibold">{edu.period}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400">Accredited medical faculty qualifications.</div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION: Patient Reviews */}
              <section id="reviews" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      Patient Stories & Verified Reviews
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verified testimonials from international patients treated by {doctor.name}
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setReviewFilter("all")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        reviewFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                      }`}
                    >
                      All ({doctor.reviews?.length || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter("verified")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        reviewFilter === "verified" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                      }`}
                    >
                      Verified
                    </button>
                    <button
                      type="button"
                      onClick={() => setReviewFilter("google")}
                      className={`px-2.5 py-1 rounded-lg transition ${
                        reviewFilter === "google" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                      }`}
                    >
                      Google
                    </button>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-teal-100 text-[#007A6C] font-bold text-xs flex items-center justify-center">
                              {rev.author.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-xs text-slate-900">{rev.author}</div>
                              <div className="text-[10px] text-slate-400">
                                {rev.country} · {rev.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{rev.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Treatment: {rev.treatment}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs bg-slate-50 rounded-2xl">
                      No reviews found under this filter.
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION: Similar Doctors */}
              <section id="similar-doctors" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Similar Top Specialists in {doctor.specialty}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similarDoctors.map((doc) => (
                    <a
                      key={doc.id}
                      href={`/doctors/${doc.slug}`}
                      className="group bg-white rounded-3xl p-4 border border-slate-200/80 shadow-2xs hover:shadow-md transition block text-center"
                    >
                      <div className="w-20 h-20 rounded-full overflow-hidden mx-auto border-2 border-slate-100 group-hover:border-[#00C7BE] transition mb-3">
                        <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="font-bold text-xs text-slate-900 truncate group-hover:text-[#007A6C] transition">
                        {doc.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">{doc.hospital}</div>
                      <div className="text-[10px] font-bold text-amber-500 flex items-center justify-center gap-1 mt-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400">({doc.experience})</span>
                      </div>
                    </a>
                  ))}
                </div>
              </section>

              {/* SECTION: FAQs Accordion */}
              <section id="faqs" className="space-y-6 pt-4 border-t border-slate-200">
                <div className="border-b border-slate-200 pb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Frequently Asked Questions (FAQs)
                  </h2>
                </div>

                <div className="space-y-3">
                  {doctor.faqs && doctor.faqs.length > 0 ? (
                    doctor.faqs.map((faq, idx) => {
                      const isOpen = Boolean(openFaqIndices[idx]);
                      return (
                        <div
                          key={idx}
                          className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition"
                        >
                          <button
                            type="button"
                            onClick={() => toggleFaq(idx)}
                            className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-[#007A6C] transition"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                                isOpen ? "rotate-180 text-[#007A6C]" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 pt-2.5">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-slate-400 text-xs">FAQs available upon appointment booking.</div>
                  )}
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR COLUMN (4 cols) - Sticky Teleconsultation Booking Card */}
            <div className="lg:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#007A6C] bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    <Video className="w-3 h-3" />
                    <span>Instant Booking</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-2 leading-tight">
                    Book Teleconsultation / Appointment
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Direct confirmation from Dr. {doctor.name}&apos;s clinical team
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                      Initial Evaluation
                    </div>
                    <div className="text-base font-black text-[#007A6C] mt-0.5">
                      {doctor.teleconsultationFeeUsd || "Free Initial Review"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Response Time</div>
                    <div className="text-xs font-bold text-emerald-600 mt-0.5">Usually in 2 hrs</div>
                  </div>
                </div>

                {/* Included Checklist */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#007A6C] shrink-0" />
                    <span>Pre-consultation clinical records triage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#007A6C] shrink-0" />
                    <span>Direct hospital rate card with no hidden fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#007A6C] shrink-0" />
                    <span>Dedicated multilingual patient coordinator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#007A6C] shrink-0" />
                    <span>100% Privacy & DPDP Act 2023 Compliant</span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="w-full py-3.5 bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs sm:text-sm font-bold rounded-2xl transition flex items-center justify-center gap-2 shadow-sm active:scale-98"
                >
                  <Video className="w-4 h-4" />
                  <span>Get Teleconsultation Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Accreditations Trust Badges */}
                <div className="pt-3 border-t border-slate-100 text-center space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Hospital Quality Accreditations
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {doctor.goodToKnow?.accreditations?.map((acc, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <SiteFooter />

      {/* Mobile Sticky Bottom Rail */}
      <DoctorStickyBottomBar doctor={doctor} onOpenBooking={() => handleOpenBooking()} />

      {/* Booking & Lead Collection Modal */}
      <DoctorBookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        doctor={doctor}
        initialProcedure={selectedProcedureForModal}
      />
    </div>
  );
}
