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
  MapPin,
  Building2
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  ALL_HOSPITALS,
  TOP_HOSPITALS,
  RECENTLY_VIEWED_HOSPITALS,
  HOSPITAL_COUNTRIES,
  HOSPITAL_TREATMENTS
} from "../data/hospitalsData.js";

export interface HospitalsTemplateProps {
  data: PublicRouteResponseDTO;
}

export function HospitalsTemplate({ data }: HospitalsTemplateProps) {
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [selectedTreatment, setSelectedTreatment] = useState("All Treatments");
  const [activeTab, setActiveTab] = useState<"top-hospitals" | "recently-viewed" | "all-hospitals" | "compare">("top-hospitals");
  const [isTreatmentDropdownOpen, setIsTreatmentDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  // Top Hospitals Slider state
  const [topHospitalIndex, setTopHospitalIndex] = useState(0);
  const topSliderRef = useRef<HTMLDivElement>(null);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});

  // Consultation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalHospital, setModalHospital] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "India",
    treatment: "General Consultation",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenModal = (hospitalName?: string) => {
    setModalHospital(hospitalName || "Preferred International Hospital");
    setIsModalOpen(true);
    setIsSubmitted(false);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setIsSubmitted(true);
  };

  // Filtered Hospitals
  const filteredHospitals = useMemo(() => {
    return ALL_HOSPITALS.filter((h) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.city.toLowerCase().includes(q) ||
        h.country.toLowerCase().includes(q) ||
        h.summary.toLowerCase().includes(q) ||
        h.specialties.some((s) => s.toLowerCase().includes(q));

      const matchesCountry =
        selectedCountry === "All Countries" ||
        h.country.toLowerCase() === selectedCountry.toLowerCase();

      const matchesTreatment =
        selectedTreatment === "All Treatments" ||
        h.specialties.some((s) => s.toLowerCase().includes(selectedTreatment.toLowerCase()));

      return matchesSearch && matchesCountry && matchesTreatment;
    });
  }, [searchQuery, selectedCountry, selectedTreatment]);

  // Handle Tab Click
  const handleTabClick = (tabId: "top-hospitals" | "recently-viewed" | "all-hospitals" | "compare") => {
    setActiveTab(tabId);
    if (tabId === "compare") {
      handleOpenModal("Hospital Comparison Consultation");
      return;
    }
    const elem = document.getElementById(tabId);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePrevSlide = () => {
    setTopHospitalIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNextSlide = () => {
    setTopHospitalIndex((prev) => Math.min(TOP_HOSPITALS.length - 1, prev + 1));
  };

  // JSON-LD Schemas
  const medicalSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: "World-Class Hospitals | Personally Matched for You | AKEEZO",
    description:
      "Find and compare top accredited hospitals globally. Transparent estimates, verified patient satisfaction ratings, and complete care coordination with AKEEZO.",
    url: "https://akeezo.com/hospitals"
  };

  const breadcrumbSchema = {
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
        name: "Hospitals",
        item: "https://akeezo.com/hospitals"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-zinc-900 font-sans selection:bg-brand-orange/20 selection:text-brand-orange">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <SiteHeader siteSettings={data.siteSettings} />

      <main className="flex-1 min-h-0">
        <div className="max-w-[1324px] mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 md:py-5 py-4 text-sm md:px-10 px-4">
            <div className="flex items-center">
              <a className="flex items-center text-[#A8A8A8] hover:text-black transition" href="/">
                Home
              </a>
              <ChevronRight className="mx-1 shrink-0 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="flex items-center">
              <span className="text-gray-900 font-medium">Hospitals</span>
            </div>
          </nav>

          <div className="pt-0 space-y-8 md:space-y-16">
            {/* Hero Section */}
            <div className="md:px-10 px-4 space-y-12 md:space-y-16">
              <div className="w-full relative z-10">
                <div className="relative md:h-[450px] h-[400px] rounded-[31px] flex md:items-center items-end justify-center text-white">
                  <div className="absolute inset-0 rounded-[31px] overflow-hidden">
                    <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/25 to-black/80" />
                    <picture>
                      <source media="(min-width: 1024px)" srcSet="/uploads/hospitals/hero-desktop.webp" type="image/webp" />
                      <img
                        draggable={false}
                        width={1200}
                        height={600}
                        fetchPriority="high"
                        decoding="async"
                        className="w-full h-full object-cover"
                        alt="World-Class Hospitals, Personally Matched for You"
                        src="/uploads/hospitals/hero-mobile.webp"
                      />
                    </picture>
                  </div>

                  <div className="absolute bottom-16 z-[30] text-center md:px-4 px-8 max-w-4xl mx-auto">
                    <h1 className="md:text-[46px] text-[21px] leading-tight font-semibold mb-4 text-white drop-shadow-sm">
                      World-Class Hospitals, Personally Matched for You
                    </h1>
                    <p className="opacity-90 md:text-[24px] text-[14px] font-medium max-w-4xl mx-auto drop-shadow-sm">
                      Find the Best Hospitals for Your Treatment, Anywhere in the World
                    </p>
                  </div>

                  {/* Desktop Floating Search Pill */}
                  <div className="absolute h-[60px] z-[40] w-[75%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hidden lg:block">
                    <div className="relative h-[65px]">
                      <div className="bg-white rounded-full text-black shadow-xl border border-gray-100 flex items-center justify-between py-2 pr-2.5">
                        <div className="flex-1 flex flex-col lg:px-8">
                          <input
                            type="text"
                            aria-label="Search hospitals globally"
                            className="outline-none bg-transparent placeholder:text-[16px] placeholder:opacity-55 placeholder:font-normal py-2 border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-800"
                            placeholder="Explore Hospitals Globally (by name, city, country, or procedure)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <button
                          type="button"
                          aria-label="Search for hospitals"
                          onClick={() => {
                            const elem = document.getElementById("all-hospitals");
                            if (elem) elem.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-brand-orange hover:bg-brand-orange-hover flex items-center justify-center text-white rounded-full transition-colors font-medium text-base shrink-0 h-11 w-11 self-center shadow-md cursor-pointer"
                        >
                          <Search className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Floating Search Pill */}
                  <div className="absolute z-[40] w-[90%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 lg:hidden">
                    <div className="bg-white h-[62px] rounded-full text-black shadow-lg border border-gray-100 flex items-center justify-between px-[5px] py-[4px]">
                      <div className="flex pl-[20px] w-full items-center gap-2 overflow-hidden">
                        <input
                          type="text"
                          aria-label="Search hospitals globally"
                          className="outline-none bg-transparent placeholder:text-[14px] placeholder:opacity-55 py-2 border-none focus:outline-none focus:ring-0 text-xs font-medium text-gray-800 flex-1 truncate"
                          placeholder="Explore Hospitals Globally"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button
                          type="button"
                          aria-label="Search"
                          onClick={() => {
                            const elem = document.getElementById("all-hospitals");
                            if (elem) elem.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="bg-brand-orange p-3.5 flex items-center justify-center text-white rounded-full hover:bg-brand-orange-hover transition-colors shrink-0 cursor-pointer"
                        >
                          <Search className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="md:mt-[46px] mt-[47px] text-center opacity-60 md:text-[16px] text-[12px] font-light px-6 md:px-0">
                  No sales. No commissions. Just discovery so you can choose what's right for you
                </p>
              </div>
            </div>

            {/* Navigation Tabs and Filter Bar */}
            <div className="md:px-10 px-4">
              <div className="pt-2 pb-0 relative border-b border-gray-200">
                <div className="flex md:gap-8 gap-4 overflow-x-auto scrollbar-hide scroll-smooth" style={{ scrollbarWidth: "none" }}>
                  <button
                    onClick={() => handleTabClick("top-hospitals")}
                    data-tab-id="top-hospitals"
                    className={`whitespace-nowrap relative text-[14px] md:text-[16px] font-semibold transition-colors flex-shrink-0 pb-3 border-b-2 cursor-pointer ${
                      activeTab === "top-hospitals"
                        ? "text-brand-orange border-brand-orange"
                        : "text-zinc-600 hover:text-zinc-900 border-transparent"
                    }`}
                  >
                    Top Hospitals
                  </button>
                  <button
                    onClick={() => handleTabClick("recently-viewed")}
                    data-tab-id="recently-viewed"
                    className={`whitespace-nowrap relative text-[14px] md:text-[16px] font-semibold transition-colors flex-shrink-0 pb-3 border-b-2 cursor-pointer ${
                      activeTab === "recently-viewed"
                        ? "text-brand-orange border-brand-orange"
                        : "text-zinc-600 hover:text-zinc-900 border-transparent"
                    }`}
                  >
                    Recently Viewed
                  </button>
                  <button
                    onClick={() => handleTabClick("all-hospitals")}
                    data-tab-id="all-hospitals"
                    className={`whitespace-nowrap relative text-[14px] md:text-[16px] font-semibold transition-colors flex-shrink-0 pb-3 border-b-2 cursor-pointer ${
                      activeTab === "all-hospitals"
                        ? "text-brand-orange border-brand-orange"
                        : "text-zinc-600 hover:text-zinc-900 border-transparent"
                    }`}
                  >
                    Explore Hospitals
                  </button>
                  <button
                    onClick={() => handleTabClick("compare")}
                    data-tab-id="compare"
                    className="whitespace-nowrap relative text-[14px] md:text-[16px] font-semibold transition-colors flex-shrink-0 pb-3 border-b-2 text-zinc-600 hover:text-brand-orange border-transparent cursor-pointer"
                  >
                    Compare Hospitals
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="mt-6">
                <div className="flex flex-nowrap items-center gap-2 overflow-x-auto py-1 md:flex-wrap md:gap-3 md:overflow-visible">
                  <button
                    onClick={() => {
                      setSelectedCountry("All Countries");
                      setSelectedTreatment("All Treatments");
                      setSearchQuery("");
                    }}
                    className={`flex h-9 shrink-0 items-center rounded-full px-4 text-sm font-medium leading-none transition-colors cursor-pointer ${
                      selectedCountry === "All Countries" && selectedTreatment === "All Treatments" && !searchQuery
                        ? "bg-brand-orange text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    All Hospitals
                  </button>

                  <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 self-center bg-gray-300" />

                  {/* By Treatment Dropdown */}
                  <div className="relative inline-block shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTreatmentDropdownOpen(!isTreatmentDropdownOpen);
                        setIsCountryDropdownOpen(false);
                      }}
                      className="flex cursor-pointer select-none items-center justify-between rounded-full transition-colors duration-200 bg-white text-gray-800 border border-gray-300 hover:border-brand-orange h-9 px-4 text-sm gap-2"
                    >
                      <span className="truncate whitespace-nowrap text-left capitalize">
                        {selectedTreatment === "All Treatments" ? "By Treatment" : selectedTreatment}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    </button>

                    {isTreatmentDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {HOSPITAL_TREATMENTS.map((tr) => (
                          <button
                            key={tr}
                            type="button"
                            onClick={() => {
                              setSelectedTreatment(tr);
                              setIsTreatmentDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-orange-50 hover:text-brand-orange ${
                              selectedTreatment === tr ? "text-brand-orange font-bold bg-orange-50/50" : "text-gray-700"
                            }`}
                          >
                            {tr}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* By Country Dropdown */}
                  <div className="relative inline-block shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCountryDropdownOpen(!isCountryDropdownOpen);
                        setIsTreatmentDropdownOpen(false);
                      }}
                      className="flex cursor-pointer select-none items-center justify-between rounded-full transition-colors duration-200 bg-white text-gray-800 border border-gray-300 hover:border-brand-orange h-9 px-4 text-sm gap-2"
                    >
                      <span className="truncate whitespace-nowrap text-left capitalize">
                        {selectedCountry === "All Countries" ? "By Country" : selectedCountry}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                    </button>

                    {isCountryDropdownOpen && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        {HOSPITAL_COUNTRIES.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors hover:bg-orange-50 hover:text-brand-orange ${
                              selectedCountry === c ? "text-brand-orange font-bold bg-orange-50/50" : "text-gray-700"
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 1: Top Hospitals */}
            <section id="top-hospitals" className="pt-4 space-y-6">
              <div className="px-4 md:px-10 flex items-center justify-between">
                <div>
                  <h2 className="text-[20px] md:text-[32px] font-semibold leading-tight text-gray-900">
                    World's Top Hospitals
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    JCI-accredited global medical centers ranking highest in surgical precision and patient outcomes.
                  </p>
                </div>

                {/* Desktop Prev/Next Controls */}
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    disabled={topHospitalIndex === 0}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextSlide}
                    disabled={topHospitalIndex >= TOP_HOSPITALS.length - 1}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-brand-orange hover:text-white hover:border-brand-orange disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-xs"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Top Hospital Cards Slider */}
              <div className="px-4 md:px-10">
                <div
                  ref={topSliderRef}
                  className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-2 scroll-smooth"
                  style={{ scrollbarWidth: "none" }}
                >
                  {TOP_HOSPITALS.map((h, idx) => (
                    <div
                      key={h.id}
                      className="flex-shrink-0 w-[300px] sm:w-[360px] md:w-[420px] lg:w-[480px] bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                      {/* Image & Rank Badge */}
                      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-gray-100">
                        <img
                          src={h.image}
                          alt={h.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = h.fallbackImage;
                          }}
                        />
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                          <span className="text-2xl font-black text-white [text-shadow:2px_2px_6px_rgba(0,0,0,0.6)]">
                            #{h.rank || idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold bg-white/95 text-gray-800 px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs">
                            {h.rankBadge || `Top Ranked in ${h.country}`}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 text-xs text-white bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs">
                          <MapPin className="w-3.5 h-3.5 text-brand-orange" />
                          <span>
                            {h.city}, {h.country}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 md:p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {h.accreditations.map((acc) => (
                              <span
                                key={acc}
                                className="text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200/50 px-2 py-0.5 rounded-sm"
                              >
                                {acc}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-brand-orange transition-colors line-clamp-1">
                            {h.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                            {h.summary}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => handleOpenModal(h.name)}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-orange hover:text-brand-orange-hover cursor-pointer"
                          >
                            <span>Free Quote</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={h.href}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black transition-colors"
                          >
                            <span>Learn More</span>
                            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Promotional Split Banner: AKEEZO Is Absolutely Free */}
            <div className="px-4 md:px-10">
              <div className="rounded-3xl bg-gradient-to-r from-orange-50/80 via-white to-teal-50/70 border border-orange-200/60 p-6 md:p-10 shadow-sm relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
                    <span className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-semibold px-3 py-1.5 rounded-full mb-3">
                      <Shield className="w-3.5 h-3.5" />
                      100% Free Consultation & Coordination
                    </span>
                    <h2 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                      <span className="text-brand-orange">AKEEZO Care</span> Is Absolutely Free
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mt-3 max-w-lg leading-relaxed">
                      Just discovery so you can choose what's right for you! Transparent quotes, priority doctor appointments, and personalized hospital guidance with zero hidden agency markups.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleOpenModal("Free Hospital Guidance")}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white px-6 py-3 text-sm font-semibold shadow-md transition-all cursor-pointer"
                      >
                        Get In Touch
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <a
                        href="/cost-calculator"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-5 py-3 text-sm font-semibold transition-all"
                      >
                        Calculate Surgery Cost
                      </a>
                    </div>
                    <p className="mt-6 text-xs text-gray-500 font-medium">
                      <span className="font-bold text-gray-800">World's Leading</span> Medical Travel & Hospital Guidance Platform
                    </p>
                  </div>

                  <div className="lg:col-span-6 flex justify-center items-center">
                    <img
                      src="/uploads/hospitals/free-banner-model-v2.png"
                      alt="Get a free consultation with AKEEZO"
                      loading="lazy"
                      className="hidden lg:block max-h-[300px] object-contain drop-shadow-md hover:scale-102 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/uploads/treatments/free-banner-model-v2.png";
                      }}
                    />
                    <img
                      src="/uploads/hospitals/free-banner-girl.png"
                      alt="Get a free consultation with AKEEZO"
                      loading="lazy"
                      className="lg:hidden max-h-[220px] object-contain drop-shadow-md"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/uploads/treatments/free-banner-girl.png";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Recently Viewed Hospitals */}
            <section id="recently-viewed" className="px-4 md:px-10 space-y-4">
              <div>
                <h2 className="text-[18px] md:text-[28px] font-semibold leading-tight text-gray-900">
                  Recently Viewed Hospital
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-1">
                  Revisit accredited hospitals with premier international patient desks.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {RECENTLY_VIEWED_HOSPITALS.map((h) => (
                  <div
                    key={h.id}
                    className="relative flex items-stretch gap-3 rounded-2xl border border-[#EDEDED] bg-white p-3 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
                  >
                    <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img
                        src={h.image}
                        alt={h.name}
                        loading="lazy"
                        className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = h.fallbackImage;
                        }}
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center pr-2">
                      <span className="text-[10px] font-semibold text-brand-orange uppercase">
                        {h.city}, {h.country}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-zinc-900 mt-0.5 group-hover:text-brand-orange transition-colors">
                        {h.name}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {h.summary}
                      </p>
                      <a
                        href={h.href}
                        className="mt-2 text-[11px] font-semibold text-gray-700 hover:text-black inline-flex items-center gap-1"
                      >
                        Learn More <ChevronRight className="w-3 h-3 text-gray-400" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3: Explore All Hospitals Grid */}
            <section id="all-hospitals" className="px-4 md:px-10 space-y-6 pb-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-[20px] md:text-[32px] font-semibold leading-tight text-gray-900">
                    Explore Hospitals
                  </h2>
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Showing {filteredHospitals.length} accredited hospitals matching your search criteria.
                  </p>
                </div>

                <div className="text-xs text-gray-500">
                  Filters: <span className="font-semibold text-gray-800">{selectedCountry}</span> •{" "}
                  <span className="font-semibold text-gray-800">{selectedTreatment}</span>
                </div>
              </div>

              {filteredHospitals.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center max-w-md mx-auto my-8">
                  <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-gray-900">No Hospitals Found</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Try adjusting your search terms or clearing your country and treatment filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCountry("All Countries");
                      setSelectedTreatment("All Treatments");
                    }}
                    className="mt-4 px-4 py-2 bg-brand-orange text-white text-xs font-semibold rounded-full hover:bg-brand-orange-hover transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {filteredHospitals.map((h) => {
                    const isLiked = !!wishlist[h.id];
                    return (
                      <div
                        key={h.id}
                        className="bg-white rounded-2xl shadow-xs hover:shadow-xl border border-gray-200/90 transition-all duration-300 flex flex-col overflow-hidden group/hospital-card"
                      >
                        {/* Hospital Cover Image */}
                        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                          <img
                            src={h.image}
                            alt={h.name}
                            loading="lazy"
                            className="object-cover h-full w-full group-hover/hospital-card:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = h.fallbackImage;
                            }}
                          />
                          {/* Wishlist Heart Button */}
                          <div className="absolute right-2 top-2 z-20">
                            <button
                              type="button"
                              onClick={(e) => toggleWishlist(h.id, e)}
                              aria-label={`Save ${h.name} to wishlist`}
                              className="bg-white/90 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-xs transition hover:scale-110 cursor-pointer"
                            >
                              <Heart
                                className={`w-4 h-4 transition-colors ${
                                  isLiked ? "fill-red-500 text-red-500" : "text-gray-700 hover:text-red-500"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Country badge */}
                          <div className="absolute left-2.5 bottom-2.5 z-10 flex items-center gap-1 text-[11px] font-medium bg-black/60 text-white px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                            <MapPin className="w-3 h-3 text-brand-orange" />
                            <span>
                              {h.city}, {h.country}
                            </span>
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {h.accreditations.map((acc) => (
                                <span
                                  key={acc}
                                  className="text-[9px] font-bold uppercase tracking-wider bg-orange-50 text-brand-orange border border-orange-200/50 px-1.5 py-0.5 rounded-xs"
                                >
                                  {acc}
                                </span>
                              ))}
                            </div>
                            <h3 className="text-base font-bold text-gray-900 group-hover/hospital-card:text-brand-orange transition-colors line-clamp-1">
                              {h.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                              {h.summary}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => handleOpenModal(h.name)}
                              className="text-xs font-semibold text-brand-orange hover:text-brand-orange-hover cursor-pointer"
                            >
                              Get Quote
                            </button>
                            <a
                              href={h.href}
                              className="text-xs font-semibold text-gray-700 hover:text-black inline-flex items-center gap-1"
                            >
                              View Profile <ChevronRight className="w-3 h-3 text-gray-400" />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <SiteFooter siteSettings={data.siteSettings} />

      {/* Free Hospital Consultation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-1.5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Inquiry Received!</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Thank you, <span className="font-semibold text-gray-800">{formData.name}</span>. An AKEEZO medical coordinator has been assigned to your case for{" "}
                  <span className="font-semibold text-brand-orange">{modalHospital}</span>. We will contact you at{" "}
                  <span className="font-semibold text-gray-800">{formData.phone}</span> within 2 hours with doctor profiles and treatment quotes.
                </p>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-brand-orange text-white text-sm font-semibold rounded-full hover:bg-brand-orange-hover transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <span className="text-[11px] font-bold text-brand-orange uppercase tracking-wider bg-orange-50 px-2 py-0.5 rounded-sm">
                    Direct Hospital Coordination
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mt-1">
                    Free Consultation & Quote
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Inquire about <span className="font-medium text-gray-800">{modalHospital}</span>. 100% confidential under India DPDP Act.
                  </p>
                </div>

                <form onSubmit={handleSubmitInquiry} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone (with Country Code) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="you@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Preferred Country
                      </label>
                      <select
                        value={formData.destination}
                        onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none bg-white transition"
                      >
                        <option value="India">India</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Any Destination">Any Best Matching Destination</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Treatment Category
                      </label>
                      <select
                        value={formData.treatment}
                        onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-300 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none bg-white transition"
                      >
                        {HOSPITAL_TREATMENTS.map((tr) => (
                          <option key={tr} value={tr}>
                            {tr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Brief Medical Requirement / Question
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Doctor preference, surgery needed, medical history..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full text-xs px-3.5 py-2 rounded-xl border border-gray-300 focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none transition resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Request Free Quote & Hospital Estimate</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[10px] text-gray-400 text-center mt-2">
                      Zero consultation fee. No commitment required.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
