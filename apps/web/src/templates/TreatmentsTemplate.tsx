import React, { useState, useMemo, useRef } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Shield,
  Sparkles,
  CheckCircle2,
  X
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  ALL_TREATMENTS,
  TOP_TREATMENTS
} from "../data/treatmentsData.js";

export interface TreatmentsTemplateProps {
  data: PublicRouteResponseDTO;
}

const CATEGORIES = [
  "All",
  "Surgical",
  "Fertility & Reproductive",
  "Specialized Care",
  "Wellness & Holistic",
  "Dermatology & Aesthetics"
] as const;

export const TreatmentsTemplate: React.FC<TreatmentsTemplateProps> = ({ data }) => {
  const { siteSettings } = data;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Header & Consultation Modals
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultProcedure, setConsultProcedure] = useState("Cosmetic / Plastic Surgery");
  const [consultName, setConsultName] = useState("");
  const [consultContact, setConsultContact] = useState("");
  const [consultSuccess, setConsultSuccess] = useState(false);
  const [consultError, setConsultError] = useState("");

  // Top Treatments Horizontal Carousel Scroll
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 260 * 2;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
      setActiveDot((prev) => (direction === "left" ? Math.max(0, prev - 1) : Math.min(1, prev + 1)));
    }
  };

  // Filtered treatments for "All Treatments" section
  const filteredTreatments = useMemo(() => {
    return ALL_TREATMENTS.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleConsultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultName.trim()) {
      setConsultError("Please enter your full name.");
      return;
    }
    if (!consultContact.trim() || consultContact.trim().length < 5) {
      setConsultError("Please enter a valid phone number or email address.");
      return;
    }
    setConsultError("");
    setConsultSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFC] font-sans text-ink antialiased overflow-x-clip">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalWebPage",
            name: "Medical Treatments Worldwide | Find Best Treatment Options | AKEEZO",
            description:
              "Discover comprehensive medical treatments worldwide. Compare prices, read reviews, and find the best healthcare options for your needs.",
            url: "https://akeezo.com/treatments"
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
                name: "Treatments",
                item: "https://akeezo.com/treatments"
              }
            ]
          })
        }}
      />

      {/* Global Header */}
      <SiteHeader
        siteSettings={siteSettings}
        activePath={data.path}
        isCalculatorOpen={isCalculatorOpen}
        onCalculatorOpenChange={setIsCalculatorOpen}
        isExploreOpen={isExploreOpen}
        onExploreOpenChange={setIsExploreOpen}
      />

      <main className="flex-1 min-h-0">
        <div className="min-h-screen space-y-5 md:space-y-10 overflow-x-clip">
          <div className="max-w-[1324px] mx-auto">
            <div className="md:pt-6 pt-4 space-y-12 md:space-y-16">
              
              {/* SECTION 1: HERO BANNER & SEARCH */}
              <div className="md:px-10 px-4 space-y-12 md:space-y-16">
                <div className="w-full relative z-10">
                  <div className="relative md:h-[450px] h-[400px] rounded-3xl flex md:items-center items-end justify-center text-white">
                    {/* Background Hero Image */}
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-black/25 to-black/85" />
                      <img
                        draggable={false}
                        alt="Find The Best Treatments Worldwide"
                        fetchPriority="high"
                        width={1200}
                        height={600}
                        decoding="async"
                        className="w-full h-full object-cover"
                        src="/uploads/treatments/treatments-banner.webp"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://d162jy5nwnavsz.cloudfront.net/static/pages/treatments/treatments-banner.webp";
                        }}
                      />
                    </div>

                    {/* Hero Title & Subtitle */}
                    <div className="absolute bottom-16 z-[30] text-center md:px-4 px-8">
                      <h1 className="md:text-4xl text-[28px] leading-tight font-semibold mb-3 tracking-tight drop-shadow-sm">
                        Find The Best Treatments Worldwide
                      </h1>
                      <p className="opacity-90 md:text-base text-[15px] font-medium max-w-4xl mx-auto drop-shadow-xs">
                        World-class care, anywhere in the world.
                      </p>
                    </div>

                    {/* Desktop Floating Search Pill */}
                    <div className="absolute h-[60px] z-[40] w-[75%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hidden lg:block">
                      <div className="relative h-[65px]">
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const el = document.getElementById("all-treatments-section");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                          }}
                        >
                          <div className="bg-white rounded-full text-black shadow-xl flex items-center justify-between py-2 pr-2 border border-gray-100">
                            <div className="flex-1 hover:bg-white transition-all duration-500 rounded-full flex flex-col lg:px-8">
                              <input
                                className="outline-none bg-transparent placeholder:text-[16px] lg:pl-0 md:pl-6 pl-1 placeholder:opacity-55 placeholder:font-normal py-2 border-none focus:outline-none focus:ring-0 text-sm font-medium text-gray-900"
                                placeholder="Search treatments, surgeries, or procedures..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                              />
                            </div>
                            <button
                              type="submit"
                              aria-label="Search for treatments"
                              className="bg-[#8B5CF6] flex items-center justify-center text-white rounded-full hover:bg-[#7C3AED] transition-colors font-medium text-base leading-none shrink-0 px-7 py-4 cursor-pointer shadow-sm"
                            >
                              <span>Search</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    {/* Mobile Floating Search Pill */}
                    <div className="absolute z-[40] w-[90%] bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 lg:hidden">
                      <div className="bg-white h-[62px] rounded-full text-black shadow-lg flex items-center justify-between px-[5px] py-[4px] border border-gray-100">
                        <div className="flex pl-[20px] w-full items-center gap-2 overflow-hidden">
                          <input
                            type="text"
                            className="text-[14px] flex-1 text-gray-800 placeholder:text-gray-400 outline-none bg-transparent"
                            placeholder="Search treatments..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          <button
                            type="button"
                            aria-label="Search"
                            onClick={() => {
                              const el = document.getElementById("all-treatments-section");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-[#8B5CF6] p-3.5 flex items-center justify-center text-white rounded-full hover:bg-[#7C3AED] transition-colors shrink-0 cursor-pointer"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="md:mt-[55px] mt-[40px] text-center opacity-65 text-sm font-light text-gray-600">
                    No sales. No commissions. Just discovery so you can choose what's right for you
                  </p>
                </div>
              </div>

              {/* SECTION 2: TOP TREATMENTS ON AKEEZO (HORIZONTAL SLIDER) */}
              <div className="px-4 md:px-0">
                <div className="md:overflow-x-clip">
                  <div>
                    <div className="md:px-10 md:pb-5 pb-4 gap-10 w-full flex items-start justify-between">
                      <div className="md:text-[32px] md:font-semibold text-[20px] leading-tight font-semibold md:w-full whitespace-pre-line md:whitespace-normal text-gray-900">
                        Top Treatments on AKEEZO
                      </div>
                    </div>
                  </div>

                  <div className="md:-mx-2 relative">
                    <div className="flex relative flex-1 mb-2 md:px-12 items-center w-full">
                      {/* Previous Slide Button */}
                      <button
                        type="button"
                        onClick={() => scrollCarousel("left")}
                        className="absolute w-[34px] h-[34px] md:flex items-center justify-center group hidden z-[9] rounded-full p-1 bg-white border border-gray-200 hover:bg-[#8B5CF6] hover:border-[#8B5CF6] shadow-sm hover:shadow-md transition-all duration-200 left-[10px] md:left-[9px] cursor-pointer"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" />
                      </button>

                      {/* Next Slide Button */}
                      <button
                        type="button"
                        onClick={() => scrollCarousel("right")}
                        className="absolute w-[34px] h-[34px] md:flex items-center justify-center group hidden z-[9] rounded-full p-1 bg-white border border-gray-200 hover:bg-[#8B5CF6] hover:border-[#8B5CF6] shadow-sm hover:shadow-md transition-all duration-200 right-[10px] md:right-[9px] cursor-pointer"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="h-4 w-4 text-gray-700 group-hover:text-white transition-colors" />
                      </button>

                      {/* Scrollable Container */}
                      <div
                        ref={carouselRef}
                        className="flex overflow-x-auto no-scrollbar gap-4 py-2 px-2 scroll-smooth w-full"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {TOP_TREATMENTS.map((treatment) => (
                          <div
                            key={treatment.id}
                            className="shrink-0 w-[220px] md:w-[230px]"
                          >
                            <div className="relative group cursor-pointer shadow-xs hover:shadow-md md:rounded-2xl rounded-2xl border border-gray-100 bg-white transition-all duration-200">
                              <div className="rounded-2xl group hover:bg-[#F3F0FF] transition-colors duration-200 bg-white md:h-[265px] h-[275px] flex flex-col md:space-y-[6px] space-y-[10px] md:p-3 p-[11px] md:pb-3">
                                <div className="rounded-lg overflow-hidden w-full h-[131px] shrink-0 mb-1 bg-gray-50">
                                  <img
                                    draggable={false}
                                    alt={treatment.title}
                                    loading="lazy"
                                    width={300}
                                    height={240}
                                    decoding="async"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    src={treatment.image}
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src = treatment.fallbackImage;
                                    }}
                                  />
                                </div>
                                <div className="flex-1 min-w-0 transition-all duration-200 md:space-y-[6px] space-y-[10px]">
                                  <h3 className="text-[16px] whitespace-nowrap truncate font-semibold text-gray-900">
                                    {treatment.title}
                                  </h3>
                                  <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">
                                    {treatment.description}
                                  </p>
                                </div>
                                <div className="pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setConsultProcedure(treatment.title);
                                      setIsConsultModalOpen(true);
                                    }}
                                    className="group/btn inline-flex items-center gap-1.5 whitespace-nowrap transition-all duration-150 text-[12px] md:text-xs font-semibold text-gray-900 hover:text-[#8B5CF6] cursor-pointer"
                                  >
                                    <span>Learn More</span>
                                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination Indicator Dots */}
                    <div className="mx-auto md:mt-4 mt-2">
                      <div className="flex justify-center gap-1.5">
                        <button
                          type="button"
                          aria-label="Go to slide 1"
                          onClick={() => {
                            if (carouselRef.current) carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
                            setActiveDot(0);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            activeDot === 0 ? "bg-[#8B5CF6] scale-125" : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                        <button
                          type="button"
                          aria-label="Go to slide 2"
                          onClick={() => {
                            if (carouselRef.current) carouselRef.current.scrollTo({ left: 600, behavior: "smooth" });
                            setActiveDot(1);
                          }}
                          className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                            activeDot === 1 ? "bg-[#8B5CF6] scale-125" : "bg-gray-300 hover:bg-gray-400"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PROMOTIONAL BANNER (AKEEZO IS ABSOLUTELY FREE) */}
              <div className="px-4 md:px-10 space-y-12 md:space-y-16">
                <div className="group flex flex-col lg:flex-row lg:items-stretch gap-6 lg:gap-8 relative overflow-hidden bg-gradient-to-br from-[#F5F3FF] via-white to-[#F0FDFA] p-6 md:p-12 rounded-3xl border border-gray-100 shadow-xs">
                  <div className="order-1 flex flex-col items-center text-center lg:w-[42%] lg:items-start lg:justify-between lg:text-left">
                    <div className="flex flex-col items-center lg:items-start">
                      <h2 className="text-[28px] lg:text-[clamp(22px,4vw,44px)] leading-tight font-bold text-gray-900">
                        <span className="flex flex-row items-center justify-center lg:justify-start">
                          <span className="text-[#8B5CF6] mr-1">AKEEZO</span>
                          <span className="font-medium text-gray-800">Care</span>
                        </span>
                        Is Absolutely Free
                      </h2>
                      <p className="mt-3 text-[14px] lg:text-[clamp(14px,2.5vw,17px)] text-gray-600 lg:max-w-[92%] leading-relaxed">
                        Just discovery so you can choose what's right for you!
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsConsultModalOpen(true)}
                        className="group/btn items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] h-12 px-7 text-sm mt-6 hidden lg:flex shadow-md shadow-purple-200 cursor-pointer"
                      >
                        <span>Get In Touch</span>
                        <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                    <p className="mt-8 hidden font-light text-gray-500 lg:block text-sm">
                      <span className="font-semibold text-gray-900">World's Leading</span> Medical Travel & Hospital Guidance Platform
                    </p>
                  </div>

                  <div className="order-2 flex cursor-pointer justify-center lg:flex-1 lg:items-center">
                    <img
                      alt="Get a free consultation with AKEEZO"
                      loading="lazy"
                      width={600}
                      height={400}
                      decoding="async"
                      className="h-auto max-w-[420px] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02] lg:hidden"
                      src="/uploads/treatments/free-banner-girl.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://curemeabroad.com/v2/free-banner-girl.png";
                      }}
                    />
                    <img
                      alt="Get a free consultation with AKEEZO"
                      loading="lazy"
                      width={600}
                      height={400}
                      decoding="async"
                      className="hidden h-auto w-full max-w-[560px] object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02] lg:block"
                      src="/uploads/treatments/free-banner-model-v2.png"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://curemeabroad.com/v2/free-banner-model-v2.png";
                      }}
                    />
                  </div>

                  <div className="order-3 flex flex-col items-center gap-4 lg:hidden">
                    <p className="text-center text-[12px] font-light text-gray-500">
                      <span className="font-semibold text-gray-900">World's Leading</span> Medical Travel & Hospital Guidance Platform
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsConsultModalOpen(true)}
                      className="group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] h-11 px-6 text-sm shadow-md shadow-purple-200 cursor-pointer"
                    >
                      <span>Get In Touch</span>
                      <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </div>

                {/* SECTION 4: ALL TREATMENTS DIRECTORY */}
                <div id="all-treatments-section" className="space-y-6 pt-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
                    <div>
                      <h2 className="md:text-[32px] md:font-bold text-[22px] leading-tight font-bold text-gray-900">
                        All Treatments
                      </h2>
                      <p className="text-xs md:text-sm text-gray-500 mt-1">
                        Showing {filteredTreatments.length} accredited procedures & specialties
                        {searchQuery ? ` matching "${searchQuery}"` : ""}
                      </p>
                    </div>

                    {/* Category Filter Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setSelectedCategory(cat)}
                          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
                            selectedCategory === cat
                              ? "bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-xs"
                              : "bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Treatments Grid */}
                  {filteredTreatments.length > 0 ? (
                    <div className="grid gap-4 md:gap-5 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-1">
                      {filteredTreatments.map((treatment) => (
                        <div
                          key={treatment.id}
                          className="relative group cursor-pointer shadow-xs hover:shadow-md rounded-2xl border border-gray-100 bg-white transition-all duration-200 flex flex-col"
                        >
                          <div className="rounded-2xl group hover:bg-[#F3F0FF] transition-colors duration-200 bg-white h-full flex flex-col p-3 pb-3">
                            <div className="rounded-lg overflow-hidden w-full h-[135px] shrink-0 mb-2 bg-gray-50">
                              <img
                                draggable={false}
                                alt={treatment.title}
                                loading="lazy"
                                width={300}
                                height={240}
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                src={treatment.image}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = treatment.fallbackImage;
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0 space-y-1.5">
                              <h3 className="text-[15px] font-semibold text-gray-900 truncate">
                                {treatment.title}
                              </h3>
                              <p className="text-xs leading-relaxed text-gray-500 line-clamp-2">
                                {treatment.description}
                              </p>
                            </div>
                            <div className="pt-3 border-t border-gray-100/60 mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setConsultProcedure(treatment.title);
                                  setIsConsultModalOpen(true);
                                }}
                                className="group/btn inline-flex items-center gap-1.5 text-xs font-semibold text-gray-900 hover:text-[#8B5CF6] transition-colors cursor-pointer"
                              >
                                <span>Learn More</span>
                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center max-w-lg mx-auto">
                      <Search className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-gray-900 mb-1">No treatments found</h3>
                      <p className="text-xs text-gray-500 mb-4">
                        We could not find treatments matching "{searchQuery}". Try searching for another medical condition or clear filters.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("All");
                        }}
                        className="rounded-full bg-[#8B5CF6] text-white px-5 py-2 text-xs font-semibold hover:bg-[#7C3AED] transition-colors cursor-pointer"
                      >
                        Clear Search & Filters
                      </button>
                    </div>
                  )}

                  {/* SECTION 5: MID-PAGE CTA BANNER (MAKE CONFIDENT HEALTHCARE DECISIONS) */}
                  <div className="w-full my-12 relative bg-white overflow-hidden flex md:gap-4 gap-6 md:rounded-3xl rounded-2xl md:flex-row flex-col items-center md:justify-between justify-center text-xl font-semibold border border-gray-100 shadow-xs">
                    <div className="md:text-left text-center md:pl-10 md:space-y-6 space-y-4 md:py-10 p-6">
                      <div className="mb-2">
                        <h2 className="md:text-4xl text-2xl font-bold leading-tight text-gray-900">
                          Make Confident
                        </h2>
                        <h2 className="md:text-4xl text-2xl font-bold leading-tight text-gray-900">
                          Healthcare Decisions
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsConsultModalOpen(true)}
                        className="group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-all duration-200 bg-[#8B5CF6] text-white hover:bg-[#7C3AED] h-12 px-7 text-sm shadow-md shadow-purple-200 cursor-pointer"
                      >
                        <span>Get Started</span>
                        <ArrowRight className="size-4 shrink-0 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>

                    {/* Desktop Right Curved Element */}
                    <div className="md:absolute md:flex hidden right-0 top-1/2 md:-translate-y-1/2 bg-[#8B5CF6] md:p-6 p-4 items-center justify-between md:gap-10 gap-6 text-white md:pr-10 font-normal md:w-[58%] w-full overflow-hidden md:rounded-r-3xl rounded-r-2xl md:rounded-l-full rounded-l-full shadow-inner">
                      <div className="md:w-[220px] md:h-[220px] w-full aspect-square bg-white rounded-full overflow-hidden shrink-0 border-4 border-white/20">
                        <img
                          draggable={false}
                          alt="Confident Healthcare"
                          loading="lazy"
                          width={220}
                          height={220}
                          decoding="async"
                          className="w-full h-full object-cover rounded-full"
                          src="/uploads/treatments/confident-banner.jpg"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://curemeabroad.com/v2/all-treatment/banner.jpg";
                          }}
                        />
                      </div>
                      <p className="md:text-xl text-base leading-snug font-medium pr-4">
                        Trusted information backed by real patient experiences.
                      </p>
                    </div>

                    {/* Mobile Curved Element */}
                    <div
                      style={{ borderRadius: "100px 20px 20px 100px" }}
                      className="md:hidden bg-[#8B5CF6] p-4 flex items-center justify-between gap-[20px] text-white font-normal w-full overflow-hidden"
                    >
                      <div className="w-[120px] h-[120px] aspect-square bg-white rounded-full overflow-hidden shrink-0 border-2 border-white/20">
                        <img
                          draggable={false}
                          alt="Confident Healthcare"
                          loading="lazy"
                          width={120}
                          height={120}
                          decoding="async"
                          className="w-full h-full object-cover rounded-full"
                          src="/uploads/treatments/confident-banner.jpg"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              "https://curemeabroad.com/v2/all-treatment/banner.jpg";
                          }}
                        />
                      </div>
                      <p className="text-[15px] leading-tight font-medium">
                        Trusted information backed by real patient experiences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL: Treatment Consultation & Price Inquiry */}
      {isConsultModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Treatment Consultation</h3>
                  <p className="text-xs text-gray-500">Free, unbiased quotes from accredited hospitals</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsConsultModalOpen(false);
                  setConsultSuccess(false);
                  setConsultError("");
                }}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {consultSuccess ? (
              <div className="py-8 text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h4 className="text-xl font-bold text-gray-900">Inquiry Received</h4>
                <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{consultName}</strong>. Our clinical coordinators have received your inquiry for{" "}
                  <strong>{consultProcedure}</strong>. A dedicated medical advisor will reach out to you within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsConsultModalOpen(false);
                    setConsultSuccess(false);
                  }}
                  className="rounded-full bg-[#8B5CF6] text-white px-7 py-3 text-sm font-semibold hover:bg-[#7C3AED] transition-colors cursor-pointer shadow-md shadow-purple-200"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleConsultSubmit} className="space-y-4 mt-5">
                {consultError && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 border border-red-100">
                    {consultError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Selected Specialty or Procedure
                  </label>
                  <select
                    value={consultProcedure}
                    onChange={(e) => setConsultProcedure(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 p-3 text-sm font-medium text-gray-900 focus:border-[#8B5CF6] focus:bg-white focus:outline-none"
                  >
                    {ALL_TREATMENTS.map((t) => (
                      <option key={t.id} value={t.title}>
                        {t.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={consultName}
                    onChange={(e) => setConsultName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    WhatsApp Phone Number or Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210 or patient@email.com"
                    value={consultContact}
                    onChange={(e) => setConsultContact(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center gap-2.5 text-xs text-purple-900">
                  <Shield className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                  <span>100% Free Service · No Commissions · HIPAA & DPDP Protected</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsConsultModalOpen(false)}
                    className="rounded-full bg-gray-100 px-5 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-purple-200 transition-all cursor-pointer"
                  >
                    Submit Consultation Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Global Footer */}
      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};

export default TreatmentsTemplate;
