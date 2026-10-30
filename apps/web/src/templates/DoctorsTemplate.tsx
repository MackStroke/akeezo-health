import React, { useState, useMemo, useRef } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  Search,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Heart,
  ArrowRight,
  Shield,
  CheckCircle2,
  X,
  Clock,
  Stethoscope,
  MapPin,
  Sparkles
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  ALL_DOCTORS,
  TOP_DOCTORS,
  RECENTLY_VIEWED_DOCTORS,
  DOCTOR_SPECIALTIES,
  DOCTOR_COUNTRIES,
  type DoctorItem
} from "../data/doctorsData.js";

export interface DoctorsTemplateProps {
  data: PublicRouteResponseDTO;
}

export function DoctorsTemplate({ data }: DoctorsTemplateProps) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [activeTab, setActiveTab] = useState<"top-doctors" | "recently-viewed" | "all-doctors" | "compare">("top-doctors");
  const [isSpecialtyDropdownOpen, setIsSpecialtyDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Top Doctors Slider state
  const [_topDoctorIndex, setTopDoctorIndex] = useState(0);
  const topSliderRef = useRef<HTMLDivElement>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Consultation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDoctor, setModalDoctor] = useState<DoctorItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "General Consultation",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenModal = (doctor?: DoctorItem) => {
    setModalDoctor(doctor || null);
    if (doctor) {
      setFormData((prev) => ({ ...prev, specialty: doctor.specialty }));
    }
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
  };

  // Filtered Doctors
  const filteredDoctors = useMemo(() => {
    return ALL_DOCTORS.filter((doc) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.name.toLowerCase().includes(q) ||
        doc.specialty.toLowerCase().includes(q) ||
        doc.hospital.toLowerCase().includes(q) ||
        doc.city.toLowerCase().includes(q) ||
        doc.country.toLowerCase().includes(q) ||
        doc.bio.toLowerCase().includes(q);

      const matchesCountry =
        selectedCountry === "All Countries" ||
        doc.country.toLowerCase() === selectedCountry.toLowerCase();

      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doc.specialty.toLowerCase() === selectedSpecialty.toLowerCase();

      return matchesSearch && matchesCountry && matchesSpecialty;
    });
  }, [searchQuery, selectedCountry, selectedSpecialty]);

  // Carousel navigation
  const scrollSlider = (direction: "left" | "right") => {
    if (!topSliderRef.current) return;
    const cardWidth = 270;
    const scrollAmount = direction === "left" ? -cardWidth * 2 : cardWidth * 2;
    topSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    setTopDoctorIndex((prev) =>
      direction === "left"
        ? Math.max(0, prev - 1)
        : Math.min(TOP_DOCTORS.length - 1, prev + 1)
    );
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-gray-900 selection:bg-brand-orange/20 selection:text-brand-orange-hover">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: data.seo.title || "World-Class Doctors | Find Best Specialists Worldwide | AKEEZO",
            description:
              data.seo.description ||
              "Search, compare, and connect with premier surgeons and medical specialists globally. Direct hospital pricing, accredited experts, and free assistance.",
            url: "https://akeezo.com/doctors",
            publisher: {
              "@type": "Organization",
              name: "AKEEZO Healthcare Platform",
              logo: {
                "@type": "ImageObject",
                url: "https://akeezo.com/logo/akeezo-logo.svg"
              }
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://akeezo.com/"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Doctors",
                item: "https://akeezo.com/doctors"
              }
            ]
          })
        }}
      />

      {/* Global Site Header */}
      <SiteHeader activePath="/doctors" />

      <main className="flex-1">
        <div className="max-w-[1324px] mx-auto px-4 md:px-10">
          {/* BREADCRUMB */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 py-4 md:py-5 text-sm">
            <div className="flex items-center">
              <a href="/" className="text-[#A8A8A8] hover:text-black transition">
                Home
              </a>
              <ChevronRight className="mx-1 shrink-0 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="flex items-center">
              <span className="text-gray-900 font-medium">Doctors</span>
            </div>
          </nav>

          {/* SECTION 1: HERO BANNER & SEARCH */}
          <section className="relative z-10 mb-8 md:mb-12">
            <div className="relative md:h-[450px] h-[380px] rounded-[31px] flex md:items-center items-end justify-center text-white overflow-hidden shadow-sm">
              <picture>
                <source
                  media="(min-width: 768px)"
                  srcSet="/uploads/doctors/hero-desktop.webp"
                  type="image/webp"
                />
                <img
                  draggable={false}
                  width={1200}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                  className="w-full h-full object-cover"
                  alt="World-Class Doctors, Personally Matched for You"
                  src="/uploads/doctors/hero-desktop.webp"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://d162jy5nwnavsz.cloudfront.net/webapp/all-doctor/hero-desktop.webp";
                  }}
                />
              </picture>
              <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/25 to-black/85" />

              <div className="absolute bottom-14 md:bottom-20 z-20 text-center px-4 md:px-8 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-medium mb-3 text-white border border-white/20">
                  <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                  <span>500+ Board-Certified International Specialists</span>
                </div>
                <h1 className="text-2xl md:text-[44px] leading-tight font-bold mb-3 tracking-tight">
                  World-Class Doctors, Personally Matched for You
                </h1>
                <p className="opacity-90 text-sm md:text-xl font-normal max-w-2xl mx-auto leading-relaxed">
                  Search, compare, and connect with leading surgeons and medical specialists across the globe.
                </p>
              </div>

              {/* FLOATING SEARCH BAR (DESKTOP) */}
              <div className="absolute h-[62px] z-30 w-[82%] max-w-4xl bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hidden lg:block">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    scrollToSection("all-doctors");
                  }}
                  className="bg-white rounded-full text-black shadow-xl border border-gray-100 flex items-center justify-between p-2 pl-6"
                >
                  <div className="flex-1 flex items-center gap-3">
                    <Search className="w-5 h-5 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Explore doctors by name, specialty, or condition..."
                      className="w-full outline-none bg-transparent text-sm placeholder:text-gray-400 font-medium"
                    />
                  </div>

                  {/* Country Selector in Bar */}
                  <div className="relative border-l border-gray-200 pl-4 pr-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer pr-3 py-1"
                    >
                      {DOCTOR_COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white px-7 py-3 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg shrink-0 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>

            {/* MOBILE FLOATING SEARCH */}
            <div className="lg:hidden mt-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  scrollToSection("all-doctors");
                }}
                className="bg-white rounded-2xl shadow-md border border-gray-200 p-3 flex flex-col gap-2.5"
              >
                <div className="flex items-center gap-2.5 px-2">
                  <Search className="w-4 h-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search doctor or specialty..."
                    className="w-full outline-none text-sm placeholder:text-gray-400 font-medium bg-transparent"
                  />
                </div>
                <div className="flex gap-2 pt-1 border-t border-gray-100">
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="flex-1 bg-gray-50 text-xs font-medium text-gray-700 rounded-lg px-2.5 py-2 outline-none border border-gray-200"
                  >
                    {DOCTOR_COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="bg-brand-orange text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* TRUST TAGLINE */}
            <div className="text-center mt-6 lg:mt-12 text-xs md:text-sm text-gray-500 font-medium">
              No sales. No commissions. Just verified doctor discovery so you can choose what&apos;s right for you.
            </div>
          </section>

          {/* SECTION 2: STICKY TAB NAVIGATION & FILTER PILLS */}
          <div className="sticky top-16 z-20 bg-[#FDFCFB]/95 backdrop-blur-md pt-3 pb-2 border-b border-gray-200">
            {/* Tabs */}
            <div className="flex items-center justify-between overflow-x-auto scrollbar-hide pb-2">
              <div className="flex gap-4 md:gap-8 shrink-0">
                <button
                  data-tab-id="top-doctors"
                  onClick={() => {
                    setActiveTab("top-doctors");
                    scrollToSection("top-doctors");
                  }}
                  className={`whitespace-nowrap relative text-sm md:text-base font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === "top-doctors"
                      ? "text-brand-orange border-brand-orange font-bold"
                      : "text-gray-500 hover:text-black border-transparent"
                  }`}
                >
                  Top Doctors
                </button>
                <button
                  data-tab-id="recently-viewed"
                  onClick={() => {
                    setActiveTab("recently-viewed");
                    scrollToSection("recently-viewed");
                  }}
                  className={`whitespace-nowrap relative text-sm md:text-base font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === "recently-viewed"
                      ? "text-brand-orange border-brand-orange font-bold"
                      : "text-gray-500 hover:text-black border-transparent"
                  }`}
                >
                  Recently Viewed
                </button>
                <button
                  data-tab-id="all-doctors"
                  onClick={() => {
                    setActiveTab("all-doctors");
                    scrollToSection("all-doctors");
                  }}
                  className={`whitespace-nowrap relative text-sm md:text-base font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === "all-doctors"
                      ? "text-brand-orange border-brand-orange font-bold"
                      : "text-gray-500 hover:text-black border-transparent"
                  }`}
                >
                  Top Doctors Globally
                </button>
                <button
                  data-tab-id="compare"
                  onClick={() => {
                    setActiveTab("compare");
                    handleOpenModal();
                  }}
                  className={`whitespace-nowrap relative text-sm md:text-base font-semibold pb-2 border-b-2 transition-colors cursor-pointer ${
                    activeTab === "compare"
                      ? "text-brand-orange border-brand-orange font-bold"
                      : "text-gray-500 hover:text-black border-transparent"
                  }`}
                >
                  Compare Doctors
                </button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto py-2 md:flex-wrap">
              <button
                onClick={() => {
                  setSelectedSpecialty("All Specialties");
                  setSelectedCountry("All Countries");
                  setSearchQuery("");
                }}
                className={`flex h-8 md:h-9 shrink-0 items-center rounded-full px-4 text-xs md:text-sm font-semibold transition-colors cursor-pointer ${
                  selectedSpecialty === "All Specialties" && selectedCountry === "All Countries" && !searchQuery
                    ? "bg-brand-orange text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Doctors
              </button>

              <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 self-center bg-gray-300" />

              {/* By Specialty Dropdown */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsSpecialtyDropdownOpen(!isSpecialtyDropdownOpen);
                    setIsCountryDropdownOpen(false);
                  }}
                  className={`flex h-8 md:h-9 items-center gap-2 rounded-full border px-3.5 text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                    selectedSpecialty !== "All Specialties"
                      ? "border-brand-orange bg-brand-orange/5 text-brand-orange font-bold"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <span className="truncate max-w-[150px]">
                    {selectedSpecialty === "All Specialties" ? "By Treatment" : selectedSpecialty}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                </button>

                {isSpecialtyDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 max-h-72 overflow-y-auto rounded-2xl bg-white p-2 shadow-xl border border-gray-100 z-50">
                    {DOCTOR_SPECIALTIES.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => {
                          setSelectedSpecialty(spec);
                          setIsSpecialtyDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          selectedSpecialty === spec
                            ? "bg-brand-orange text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* By Country Dropdown */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsCountryDropdownOpen(!isCountryDropdownOpen);
                    setIsSpecialtyDropdownOpen(false);
                  }}
                  className={`flex h-8 md:h-9 items-center gap-2 rounded-full border px-3.5 text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                    selectedCountry !== "All Countries"
                      ? "border-brand-orange bg-brand-orange/5 text-brand-orange font-bold"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <span className="truncate max-w-[130px]">
                    {selectedCountry === "All Countries" ? "By Country" : selectedCountry}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 shrink-0" />
                </button>

                {isCountryDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 max-h-72 overflow-y-auto rounded-2xl bg-white p-2 shadow-xl border border-gray-100 z-50">
                    {DOCTOR_COUNTRIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                          selectedCountry === c
                            ? "bg-brand-orange text-white"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(selectedSpecialty !== "All Specialties" || selectedCountry !== "All Countries" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSpecialty("All Specialties");
                    setSelectedCountry("All Countries");
                    setSearchQuery("");
                  }}
                  className="flex items-center gap-1 text-xs text-brand-orange hover:underline font-semibold ml-auto shrink-0 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* SECTION 3: TOP DOCTORS SLIDER (#top-doctors) */}
          <section id="top-doctors" className="pt-10 md:pt-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                  Premier Specialists
                </span>
                <h2 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                  Top Doctors Preferred by Patients on AKEEZO
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Internationally renowned leaders in complex surgeries, research pioneers, and award-winning practitioners.
                </p>
              </div>

              {/* Slider Arrows */}
              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => scrollSlider("left")}
                  aria-label="Previous slide"
                  className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-brand-orange hover:border-brand-orange hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollSlider("right")}
                  aria-label="Next slide"
                  className="w-9 h-9 rounded-full border border-gray-300 bg-white hover:bg-brand-orange hover:border-brand-orange hover:text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Carousel Container */}
            <div
              ref={topSliderRef}
              className="flex gap-4 md:gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 md:-mx-0 md:px-0 scroll-smooth"
            >
              {TOP_DOCTORS.map((doc) => (
                <div
                  key={doc.id}
                  className="w-[260px] md:w-[280px] shrink-0 group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative"
                >
                  {/* Hexagon Badge Overlay */}
                  <div className="absolute z-10 right-3.5 top-3.5 drop-shadow-md">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                      <img
                        alt="Hexagon Badge"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-contain"
                        src="/uploads/doctors/hexa-badge.png"
                        onError={(e) => {
                          e.currentTarget.src = "https://curemeabroad.com/v2/hexa-badge.png";
                        }}
                      />
                      <div className="relative z-10 text-[6px] font-bold text-center uppercase tracking-tight text-brand-orange leading-[1.1] px-1">
                        <div>Top</div>
                        <div className="line-clamp-1">{doc.specialty.split("/")[0]}</div>
                        <div>Doctor</div>
                      </div>
                    </div>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(doc.id, e)}
                    className="absolute z-10 left-3.5 top-3.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors cursor-pointer shadow-xs"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        wishlist[doc.id] ? "fill-red-500 text-red-500" : "text-gray-500"
                      }`}
                    />
                  </button>

                  {/* Doctor Profile Image */}
                  <div className="relative h-[210px] w-full bg-gradient-to-t from-gray-100 to-gray-50 overflow-hidden flex items-end justify-center">
                    <img
                      alt={doc.name}
                      src={doc.image}
                      draggable={false}
                      className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-500 ease-out"
                      onError={(e) => {
                        e.currentTarget.src = doc.imageFallback;
                      }}
                    />
                  </div>

                  {/* Doctor Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3 className="font-bold text-sm md:text-base text-gray-900 line-clamp-1 group-hover:text-brand-orange transition-colors">
                        {doc.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 font-medium line-clamp-1 mt-0.5">
                        {doc.hospital}
                      </p>

                      <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Stethoscope className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                          <span className="truncate">{doc.specialty}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span>Experience: {doc.experience}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{doc.city}, {doc.country}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenModal(doc)}
                        className="text-xs font-semibold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Consult</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={doc.href}
                        className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
                      >
                        <span>View Profile</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 4: PROMOTIONAL SPLIT BANNER (AKEEZO IS FREE) */}
          <section className="my-12 md:my-16">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#1E1B4B] text-white p-6 md:p-12 shadow-xl border border-gray-800">
              <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                <div>
                  <div className="inline-flex items-center gap-2 bg-brand-orange/20 text-brand-orange border border-brand-orange/30 text-xs font-bold px-3 py-1 rounded-full mb-4">
                    <Shield className="w-3.5 h-3.5" />
                    <span>100% Free Patient Assistance</span>
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-3">
                    AKEEZO Care Is Absolutely Free
                  </h2>
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
                    We connect you directly with world-class specialists and accredited hospitals without agency markups, agent fees, or hidden costs.
                  </p>

                  <div className="space-y-2.5 mb-8">
                    <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Zero fee guarantee — pay only direct hospital prices</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Free medical file review &amp; doctor recommendations</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs md:text-sm text-gray-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Dedicated patient coordinator from day one</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleOpenModal()}
                      className="bg-brand-orange hover:bg-brand-orange-hover text-white px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                    >
                      <span>Get Free Doctor Consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <a
                      href="/cost-calculator"
                      className="border border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-full text-sm font-semibold transition-all"
                    >
                      Surgery Cost Calculator
                    </a>
                  </div>
                </div>

                {/* Banner Graphics */}
                <div className="relative hidden md:flex items-center justify-center">
                  <div className="relative w-full max-w-[420px] h-[320px]">
                    <img
                      alt="Doctor Consultation Model"
                      draggable={false}
                      className="absolute bottom-0 right-0 max-h-full object-contain filter drop-shadow-2xl"
                      src="/uploads/treatments/free-banner-model-v2.png"
                      onError={(e) => {
                        e.currentTarget.src = "https://curemeabroad.com/v2/free-banner-model-v2.png";
                      }}
                    />
                    <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-lg text-white">
                      <div className="text-[11px] text-gray-300">Global Network</div>
                      <div className="text-lg font-bold">15,000+</div>
                      <div className="text-[10px] text-emerald-400">Patients Assisted</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-orange/15 rounded-full blur-3xl pointer-events-none" />
            </div>
          </section>

          {/* SECTION 5: RECENTLY VIEWED DOCTORS (#recently-viewed) */}
          <section id="recently-viewed" className="mb-12 md:mb-16">
            <div className="mb-6">
              <span className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                Your Browsing History
              </span>
              <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 mt-1">
                Recently Viewed Doctors
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {RECENTLY_VIEWED_DOCTORS.map((doc) => (
                <div
                  key={`recent-${doc.id}`}
                  className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      alt={doc.name}
                      src={doc.image}
                      className="w-16 h-16 rounded-xl object-contain bg-gray-50 border border-gray-100 shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = doc.imageFallback;
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-gray-900 truncate">
                        {doc.name}
                      </h4>
                      <p className="text-xs text-brand-orange font-medium truncate mt-0.5">
                        {doc.specialty}
                      </p>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {doc.hospital}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500 font-medium">
                      {doc.experience}
                    </span>
                    <a
                      href={doc.href}
                      className="text-xs font-semibold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1"
                    >
                      <span>View Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION 6: TOP DOCTORS GLOBALLY / EXPLORE ALL (#all-doctors) */}
          <section id="all-doctors" className="mb-16 md:mb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-brand-orange">
                  Directory &amp; Rankings
                </span>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 mt-1">
                  Top Doctors Globally
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Showing {filteredDoctors.length} accredited doctors matching your preferences.
                </p>
              </div>

              {/* Results pill */}
              <div className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 w-max">
                {selectedSpecialty} &bull; {selectedCountry}
              </div>
            </div>

            {filteredDoctors.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 shadow-xs">
                <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-800">No doctors found</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto mt-1 mb-6">
                  We could not find any doctors matching your current filters. Try searching for a different specialty or country.
                </p>
                <button
                  onClick={() => {
                    setSelectedSpecialty("All Specialties");
                    setSelectedCountry("All Countries");
                    setSearchQuery("");
                  }}
                  className="bg-brand-orange text-white text-xs font-semibold px-6 py-2.5 rounded-full hover:bg-brand-orange-hover transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredDoctors.map((doc) => (
                  <div
                    key={doc.id}
                    className="group bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                  >
                    {/* Hexagon Badge */}
                    <div className="absolute z-10 right-3 top-3 drop-shadow-md">
                      <div className="relative w-11 h-11 flex items-center justify-center">
                        <img
                          alt="Hexagon Badge"
                          draggable={false}
                          className="absolute inset-0 w-full h-full object-contain"
                          src="/uploads/doctors/hexa-badge.png"
                          onError={(e) => {
                            e.currentTarget.src = "https://curemeabroad.com/v2/hexa-badge.png";
                          }}
                        />
                        <div className="relative z-10 text-[5px] font-bold text-center uppercase tracking-tight text-brand-orange leading-[1.1] px-0.5">
                          <div>Top</div>
                          <div className="line-clamp-1">{doc.specialty.split("/")[0]}</div>
                          <div>Doctor</div>
                        </div>
                      </div>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(doc.id, e)}
                      className="absolute z-10 left-3 top-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-colors cursor-pointer shadow-xs"
                      aria-label="Add to wishlist"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          wishlist[doc.id] ? "fill-red-500 text-red-500" : "text-gray-500"
                        }`}
                      />
                    </button>

                    {/* Photo with subtle gradient */}
                    <div className="relative h-[190px] w-full bg-gradient-to-t from-gray-100 to-gray-50 flex items-end justify-center overflow-hidden">
                      <img
                        alt={doc.name}
                        src={doc.image}
                        draggable={false}
                        className="w-full h-full object-contain object-bottom group-hover:scale-105 transition-transform duration-500 ease-out"
                        onError={(e) => {
                          e.currentTarget.src = doc.imageFallback;
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-900 group-hover:text-brand-orange transition-colors truncate">
                          {doc.name}
                        </h3>
                        <p className="text-[11px] text-gray-500 truncate mt-0.5 font-medium">
                          {doc.hospital}
                        </p>

                        <div className="mt-2.5 space-y-1 text-xs text-gray-600">
                          <div className="flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-brand-orange shrink-0" />
                            <span className="truncate">{doc.specialty}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{doc.experience}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span className="truncate">{doc.city}, {doc.country}</span>
                          </div>
                        </div>

                        {/* Accreditations tags */}
                        {doc.accreditations.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3">
                            {doc.accreditations.map((acc) => (
                              <span
                                key={acc}
                                className="text-[10px] font-semibold bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded-md"
                              >
                                {acc}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Card Actions */}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => handleOpenModal(doc)}
                          className="text-xs font-semibold text-brand-orange hover:text-brand-orange-hover flex items-center gap-1 cursor-pointer"
                        >
                          <span>Consult</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={doc.href}
                          className="text-xs font-medium text-gray-500 hover:text-black flex items-center gap-1"
                        >
                          <span>Profile</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Global Site Footer */}
      <SiteFooter />

      {/* DOCTOR CONSULTATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Inquiry Received!
                </h3>
                <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-gray-900">{formData.name}</span>. An AKEEZO Senior Medical Coordinator will review your inquiry with {modalDoctor ? modalDoctor.name : "the doctor"} and contact you within 24 hours.
                </p>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-brand-orange text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-brand-orange-hover transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                    Free Consultation Request
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                    {modalDoctor ? `Consult ${modalDoctor.name}` : "Book a Medical Specialist Consultation"}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Receive expert clinical assessment and transparent hospital cost estimates directly.
                  </p>
                </div>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                        className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Specialty / Treatment
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2.5 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange bg-white"
                    >
                      {DOCTOR_SPECIALTIES.filter((s) => s !== "All Specialties").map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                      <option value="General Consultation">Other Medical Specialty</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Medical Notes / Symptoms (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe your symptoms, desired procedure, or medical history..."
                      className="w-full text-sm rounded-xl border border-gray-300 px-3.5 py-2 outline-none focus:border-brand-orange focus:ring-1 focus:ring-brand-orange resize-none"
                    />
                  </div>

                  <p className="text-[11px] text-gray-400">
                    By submitting, you agree to AKEEZO&apos;s privacy policy. Your medical data is strictly confidential and encrypted under DPDP standards.
                  </p>

                  <button
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-semibold py-3 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    Submit Consultation Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
