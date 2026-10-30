import React, { useState, useEffect, useRef, useCallback } from "react";
import { type PublicRouteResponseDTO, type CarouselSlide, DEFAULT_CAROUSEL_SLIDES } from "@akeezo/contracts";
import {
  Search,
  Award,
  Globe2,
  CheckCircle2,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Compass,
  Stethoscope,
  Shield,
  Heart,
  Activity,
  Sparkles
} from "lucide-react";
import {
  COUNTRIES,
  LANGUAGES,
  SPECIALTIES,
  DIRECTORY_TABS,
  formatEstimate,
  type CountryOption
} from "../components/navigationData.js";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";

export { COUNTRIES, LANGUAGES, SPECIALTIES, DIRECTORY_TABS, formatEstimate };
export type { CountryOption };

export interface HomeTemplateProps {
  data: PublicRouteResponseDTO;
}

function getCarouselIcon(iconName?: string) {
  switch (iconName?.toLowerCase()) {
    case "compass":
      return <Compass className="size-5" />;
    case "stethoscope":
      return <Stethoscope className="size-5" />;
    case "shield":
      return <Shield className="size-5" />;
    case "heart":
      return <Heart className="size-5" />;
    case "award":
      return <Award className="size-5" />;
    case "activity":
      return <Activity className="size-5" />;
    case "sparkles":
      return <Sparkles className="size-5" />;
    case "calculator":
    default:
      return <Calculator className="size-5" />;
  }
}

function getWatermarkIcon(iconName?: string, colorClass = "text-brand-orange") {
  switch (iconName?.toLowerCase()) {
    case "compass":
      return <Compass className={`size-18 ${colorClass}`} />;
    case "stethoscope":
      return <Stethoscope className={`size-18 ${colorClass}`} />;
    case "shield":
      return <Shield className={`size-18 ${colorClass}`} />;
    case "heart":
      return <Heart className={`size-18 ${colorClass}`} />;
    case "award":
      return <Award className={`size-18 ${colorClass}`} />;
    case "activity":
      return <Activity className={`size-18 ${colorClass}`} />;
    case "sparkles":
      return <Sparkles className={`size-18 ${colorClass}`} />;
    case "calculator":
    default:
      return <Calculator className={`size-18 ${colorClass}`} />;
  }
}

function getSlideThemeStyles(accentColor?: string) {
  switch (accentColor?.toLowerCase()) {
    case "teal":
      return {
        cardBorder: "border-border-teal",
        cardGradient: "from-white via-white to-surface-teal/60",
        iconContainer: "bg-surface-teal text-action border-border-teal",
        button: "bg-action hover:bg-action-hover text-white shadow-md shadow-action/20",
        badge: "text-action bg-surface-teal border-border-teal",
        watermarkBorder: "border-action",
        watermarkText: "text-action",
      };
    case "purple":
      return {
        cardBorder: "border-purple-200",
        cardGradient: "from-white via-white to-purple-50/60",
        iconContainer: "bg-purple-100 text-purple-700 border-purple-200",
        button: "bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/20",
        badge: "text-purple-700 bg-purple-50 border-purple-200",
        watermarkBorder: "border-purple-400",
        watermarkText: "text-purple-600",
      };
    case "emerald":
      return {
        cardBorder: "border-emerald-200",
        cardGradient: "from-white via-white to-emerald-50/60",
        iconContainer: "bg-emerald-100 text-emerald-700 border-emerald-200",
        button: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20",
        badge: "text-emerald-700 bg-emerald-50 border-emerald-200",
        watermarkBorder: "border-emerald-400",
        watermarkText: "text-emerald-600",
      };
    case "blue":
      return {
        cardBorder: "border-blue-200",
        cardGradient: "from-white via-white to-blue-50/60",
        iconContainer: "bg-blue-100 text-blue-700 border-blue-200",
        button: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20",
        badge: "text-blue-700 bg-blue-50 border-blue-200",
        watermarkBorder: "border-blue-400",
        watermarkText: "text-blue-600",
      };
    case "orange":
    default:
      return {
        cardBorder: "border-border-orange",
        cardGradient: "from-white via-white to-surface-orange/60",
        iconContainer: "bg-surface-orange text-brand-orange border-border-orange",
        button: "bg-brand-orange hover:bg-brand-orange-alt text-white shadow-md shadow-brand-orange/20",
        badge: "text-action-accent bg-surface-orange border-border-orange",
        watermarkBorder: "border-brand-orange",
        watermarkText: "text-brand-orange",
      };
  }
}

export const HomeTemplate: React.FC<HomeTemplateProps> = ({ data }) => {
  const { siteSettings } = data;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchError, setSearchError] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Cardiac Surgery");
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  // Active feature slides from site settings
  const rawSlides: CarouselSlide[] =
    siteSettings?.carouselSlides && siteSettings.carouselSlides.length > 0
      ? siteSettings.carouselSlides
      : DEFAULT_CAROUSEL_SLIDES;

  const slides = rawSlides
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const touchStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(typeof window !== "undefined" ? window.innerWidth >= 768 : true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleCards = isDesktop ? 2 : 1;
  const maxIndex = Math.max(0, slides.length - visibleCards);

  const handlePrevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const handleNextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const interval = setInterval(() => {
      handleNextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, maxIndex, handleNextSlide]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;
    if (deltaX > 40) {
      handleNextSlide();
    } else if (deltaX < -40) {
      handlePrevSlide();
    }
    touchStartXRef.current = null;
  };

  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchError("Please enter a medical condition, procedure, or hospital name to search.");
      return;
    }
    setSearchError("");
    window.location.href = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
      `Hello Akeezo Care Team, I would like to inquire about: ${searchQuery}`
    )}`;
  };

  const suggestionChips = [
    "Cardiac Surgery",
    "Oncology & Cancer",
    "Orthopedics & Joint",
    "Neuro & Spine",
    "IVF & Fertility"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-ink antialiased selection:bg-surface-teal selection:text-action overflow-x-hidden">
      <SiteHeader
        siteSettings={siteSettings}
        activePath={data.path}
        isCalculatorOpen={isCalculatorOpen}
        onCalculatorOpenChange={setIsCalculatorOpen}
        isExploreOpen={isExploreOpen}
        onExploreOpenChange={setIsExploreOpen}
      />

      {/* Main Landmark for Accessibility and SEO */}
      <main id="main-content">
        {/* Semantic H1 per design.md guidance */}
        <h1 className="sr-only">
          AKEEZO Healthcare Platform — Heal In India, Heal By Akeezo. Discover Accredited Hospitals, Top Doctors & Medical Tourism in India.
        </h1>

        {/* 2. Hero Centerpiece (CureMeAbroad: Centered brand centerpiece with generous whitespace) */}
        <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 text-center" aria-label="Akeezo Platform Hero">
          {/* Subtle dual-brand ambient glow (Brand Teal & Brand Orange) */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[720px] max-w-full h-[320px] bg-gradient-to-r from-brand-teal/15 via-surface-teal/30 to-brand-orange/12 rounded-full blur-3xl pointer-events-none -z-10"
            aria-hidden="true"
          />

          <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
            {/* Accreditation Badge Pill */}
            <div className="inline-flex items-center gap-2 rounded-full bg-surface-teal border border-border-teal px-4 py-1.5 text-xs font-bold text-action mb-5 shadow-2xs">
              <span className="size-2 rounded-full bg-brand-teal animate-pulse" />
              <span>Heal in India · Accredited Hospital & Specialist Network</span>
            </div>

            {/* Official Akeezo Logo Centerpiece per design.md geometry with explicit dimensions to eliminate CLS */}
            <div className="mx-auto mb-6 flex justify-center items-center h-[72px] sm:h-[96px]">
              <a
                href="/"
                aria-label="Akeezo Healthcare Platform Home"
                className="inline-block transition-opacity hover:opacity-90 cursor-pointer"
              >
                <img
                  src="/logo/logo with tagline-dark.svg"
                  alt="Akeezo - Heal In India, Heal By Akeezo"
                  width={480}
                  height={96}
                  loading="eager"
                  decoding="sync"
                  className="h-[72px] sm:h-[96px] w-auto max-w-[340px] sm:max-w-[480px] object-contain"
                />
              </a>
            </div>

            {/* Supporting line (18px, muted, centered) */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg font-medium text-ink-muted">
              Discover. Compare. Book. Accredited Treatments in India
            </p>

            {/* Search Box (~656px wide, ~56px high, fully rounded, right-inset action button) */}
            <div className="mx-auto mt-8 max-w-[656px]">
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="relative flex h-14 w-full items-center rounded-full border border-border bg-white px-3 sm:px-4 shadow-[0_4px_20px_rgb(15_23_42/7%)] transition-all focus-within:border-action focus-within:ring-2 focus-within:ring-action/20"
              >
                <label htmlFor="hero-search-input" className="sr-only">
                  Search medical treatments, hospitals, or doctors in India
                </label>
                <Search className="size-5 text-ink-muted shrink-0 ml-1.5" aria-hidden="true" />
                <input
                  id="hero-search-input"
                  name="query"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (searchError) setSearchError("");
                  }}
                  aria-invalid={!!searchError}
                  aria-describedby="hero-search-error"
                  placeholder='Search for "cardiac bypass", "apollo hospital", "dr. naresh trehan"...'
                  className="w-full bg-transparent px-3 text-sm text-ink placeholder:text-ink-muted/80 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 h-10 px-5 sm:px-6 rounded-full bg-brand-orange hover:bg-brand-orange-alt text-white text-xs font-bold transition-all shadow-md shadow-brand-orange/20 cursor-pointer min-h-[40px]"
                >
                  Search
                </button>
              </form>

              {/* Accessible error message */}
              {searchError && (
                <div
                  id="hero-search-error"
                  role="alert"
                  className="mt-2.5 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-xs font-bold text-red-700 text-left flex items-center gap-2"
                >
                  <span>⚠️</span>
                  <span>{searchError}</span>
                </div>
              )}

              {/* Suggestion Chips: swipeable on mobile, centered on desktop per design.md */}
              <div className="mt-4 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap no-scrollbar px-1">
                <span className="text-xs text-ink-muted mr-1 font-bold shrink-0">Popular:</span>
                {suggestionChips.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setSelectedSpecialty(chip);
                      setSearchQuery(chip);
                    }}
                    className={`shrink-0 h-[38px] rounded-full px-4 text-xs font-bold transition-all duration-200 cursor-pointer border ${
                      selectedSpecialty === chip
                        ? "bg-action text-white border-action shadow-xs"
                        : "bg-surface-muted text-ink-muted border-transparent hover:bg-surface-teal hover:text-action hover:border-border-teal"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Feature Carousel Section (Controlled via Admin Panel) */}
        <section className="py-4 sm:py-6" aria-label="Core Patient Tools">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
            {/* Carousel Navigation Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-brand-orange animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink-muted">
                  Personalized Care Tools &amp; Second Opinions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrevSlide}
                  disabled={maxIndex <= 0}
                  aria-label="Previous slide"
                  className="size-8 sm:size-9 rounded-full border border-border bg-white shadow-xs flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextSlide}
                  disabled={maxIndex <= 0}
                  aria-label="Next slide"
                  className="size-8 sm:size-9 rounded-full border border-border bg-white shadow-xs flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-muted transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>

            {/* Carousel Viewport & Track */}
            <div
              className="relative overflow-hidden"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex gap-6 transition-transform duration-500 ease-in-out"
                style={{
                  transform:
                    carouselIndex === 0
                      ? "translateX(0px)"
                      : isDesktop
                      ? `translateX(calc(-${carouselIndex} * (50% + 12px)))`
                      : `translateX(calc(-${carouselIndex} * (100% + 24px)))`
                }}
              >
                {slides.map((slide) => {
                  const styles = getSlideThemeStyles(slide.accentColor || slide.badgeStyle);
                  const handleAction = () => {
                    if (slide.buttonAction === "calculator") {
                      setIsCalculatorOpen(true);
                    } else if (slide.buttonAction === "explore") {
                      setIsExploreOpen(true);
                    } else if (slide.buttonAction === "whatsapp") {
                      window.location.href = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
                        `Hello Akeezo Care Team, I would like to inquire about: ${slide.title}`
                      )}`;
                    } else if (slide.buttonLink) {
                      window.location.href = slide.buttonLink;
                    }
                  };

                  return (
                    <div
                      key={slide.id}
                      id={slide.id}
                      className={`w-full md:w-[calc(50%-12px)] shrink-0 group relative flex flex-col justify-between overflow-hidden rounded-[20px] border ${styles.cardBorder} bg-gradient-to-br ${styles.cardGradient} p-7 shadow-[0_4px_20px_rgb(15_23_42/8%)] transition-transform duration-200 hover:-translate-y-1 min-h-[297px]`}
                    >
                      <div className="max-w-[380px] relative z-10">
                        <div
                          className={`inline-flex size-11 items-center justify-center rounded-full ${styles.iconContainer} mb-4 border`}
                        >
                          {getCarouselIcon(slide.iconName)}
                        </div>
                        <h2 className="text-[22px] sm:text-[24px] font-bold text-ink mb-2 leading-[30px] font-heading">
                          {slide.title}
                        </h2>
                        <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">
                          {slide.description}
                        </p>
                      </div>

                      {/* Decorative Subtle Right Graphic */}
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none hidden sm:block">
                        <div
                          className={`size-36 rounded-full border-8 ${styles.watermarkBorder} flex items-center justify-center`}
                        >
                          {getWatermarkIcon(slide.iconName, styles.watermarkText)}
                        </div>
                      </div>

                      <div className="mt-8 flex items-center justify-between relative z-10 gap-3">
                        <button
                          type="button"
                          onClick={handleAction}
                          className={`inline-flex h-11 min-h-[44px] items-center justify-center rounded-full ${styles.button} px-5 text-xs font-bold transition-all cursor-pointer`}
                        >
                          {slide.buttonText}
                        </button>
                        {slide.badgeText && (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${styles.badge} border shrink-0`}
                          >
                            {slide.badgeText}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pagination Dots */}
            {maxIndex > 0 && (
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCarouselIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      carouselIndex === idx ? "w-6 bg-brand-orange" : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

      {/* 4. Trust Strip (CureMeAbroad: Horizontal centered strip with vertical dividers) */}
      <section id="hospitals" className="py-8" aria-label="Clinical Quality & Trust Accreditations">
        <h2 className="sr-only">Clinical Quality & Healthcare Network Accreditations</h2>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="rounded-[20px] border border-border bg-surface-muted py-6 px-4 sm:px-8 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-action mb-1">
                  <BadgeCheck className="size-5" />
                  <span className="text-2xl sm:text-3xl font-black text-ink">150+</span>
                </div>
                <div className="text-xs text-ink-muted font-bold">NABH & JCI Hospitals</div>
              </div>

              <div id="doctors" className="flex flex-col items-center pt-4 md:pt-0">
                <div className="flex items-center gap-1.5 text-action-accent mb-1">
                  <Award className="size-5" />
                  <span className="text-2xl sm:text-3xl font-black text-ink">1,200+</span>
                </div>
                <div className="text-xs text-ink-muted font-bold">Board-Certified Specialists</div>
              </div>

              <div className="flex flex-col items-center pt-4 md:pt-0">
                <div className="flex items-center gap-1.5 text-brand-teal mb-1">
                  <Globe2 className="size-5" />
                  <span className="text-2xl sm:text-3xl font-black text-ink">18+</span>
                </div>
                <div className="text-xs text-ink-muted font-bold">Indian Healthcare Hubs</div>
              </div>

              <div className="flex flex-col items-center pt-4 md:pt-0">
                <div className="flex items-center gap-1.5 text-action mb-1">
                  <CheckCircle2 className="size-5" />
                  <span className="text-2xl sm:text-3xl font-black text-ink">4.8 / 5</span>
                </div>
                <div className="text-xs text-ink-muted font-bold">Verified Patient Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Promotional / Service Cards (CureMeAbroad: Three equal cards, 2:1 ratio, 20px corners) */}
      <section className="py-6" aria-label="Patient Travel Benefits and Price Guarantees">
        <h2 className="sr-only">Patient Travel Benefits and Price Guarantees</h2>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Promo Card 1: Free Hotel & Logistics */}
            <div id="concierge" className="rounded-[20px] border border-border-orange bg-gradient-to-b from-surface-orange via-surface-orange/60 to-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-action-accent uppercase tracking-wider mb-3 border border-border-orange">
                  Logistics Support
                </span>
                <h3 className="text-xl font-bold text-ink mb-2">
                  Free Airport & Hotel Stay
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Complimentary airport VIP reception, local 5G SIM card, and companion lodging for qualified surgical procedures.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-orange/60 flex items-center justify-between">
                <span className="text-xs font-bold text-action-accent">Terms Apply</span>
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20tell%20me%20about%20Free%20Hotel%20and%20Flights%20benefit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange hover:text-brand-orange-alt hover:underline min-h-[38px] px-1"
                >
                  <span>Claim Now</span>
                  <ChevronRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Promo Card 2: Free Second Opinion */}
            <div id="opinion" className="rounded-[20px] border border-border-teal bg-gradient-to-b from-surface-teal via-surface-teal/60 to-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-action uppercase tracking-wider mb-3 border border-border-teal">
                  Clinical Care
                </span>
                <h3 className="text-xl font-bold text-ink mb-2">
                  Free Second Opinion in 48h
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Upload your MRI/CT scans. Receive comprehensive clinical reviews and treatment plans from senior department chairs at zero cost.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border-teal/60 flex items-center justify-between">
                <span className="text-xs font-bold text-action">Zero Obligation</span>
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20want%20a%20Free%20Second%20Opinion`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-action hover:text-action-hover hover:underline min-h-[38px] px-1"
                >
                  <span>Upload Reports</span>
                  <ChevronRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Promo Card 3: Best Price Guarantee */}
            <div className="rounded-[20px] border border-border bg-gradient-to-b from-surface-muted via-surface-muted/60 to-white p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-md bg-white px-2.5 py-1 text-[11px] font-bold text-ink-muted uppercase tracking-wider mb-3 border border-border">
                  Price Transparency
                </span>
                <h3 className="text-xl font-bold text-ink mb-2">
                  Direct Hospital Billing
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Direct hospital billing with no hidden fees or agency commissions. Pay directly at the hospital billing desk upon admission.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs font-bold text-action">Transparent Quotes</span>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-action hover:text-action-hover hover:underline cursor-pointer min-h-[38px] px-1"
                >
                  <span>Check Pricing</span>
                  <ChevronRight className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Global Planning Banner (CureMeAbroad: Large teal rounded banner with 30px corners) */}
      <section id="visa" className="py-10" aria-label="Treatment Planning Coordination">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-navy via-action to-[#009180] p-8 sm:p-14 text-white shadow-xl">
            {/* Subtle decorative glow circle in corner */}
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-brand-teal/20 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="max-w-xl text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold leading-tight tracking-tight font-heading">
                  Help Me Plan My Treatment Abroad
                </h2>
                <p className="mt-4 text-base sm:text-lg text-white/90 leading-relaxed font-normal">
                  Connect with our dedicated medical travel coordinators. We assist with visa invitation letters, 
                  hospital admission, multilingual interpretation, and end-to-end travel logistics.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-bold text-white/95">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-brand-teal" />
                    <span>Free Clinical Triage</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-brand-teal" />
                    <span>Medical Visa Support</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-brand-teal" />
                    <span>Bedside Concierge</span>
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20please%20help%20me%20plan%20my%20treatment`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-action shadow-md transition-all hover:bg-surface-teal cursor-pointer"
                >
                  Request Free Consultation
                </a>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(true)}
                  className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-alt px-7 text-sm font-bold text-white shadow-lg shadow-brand-orange/30 transition-all cursor-pointer"
                >
                  Calculate Procedure Cost
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};

export default HomeTemplate;
