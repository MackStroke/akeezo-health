import React, { useState } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  Search,
  Award,
  Globe2,
  CheckCircle2,
  Phone,
  PhoneCall,
  BadgeCheck,
  ChevronRight,
  Calculator,
  Compass,
  Building2,
  User2
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

export const HomeTemplate: React.FC<HomeTemplateProps> = ({ data }) => {
  const { siteSettings } = data;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Cardiac Surgery");
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `https://wa.me/${phoneClean}?text=${encodeURIComponent(
        `Hello Akeezo Care Team, I would like to inquire about: ${searchQuery}`
      )}`;
    }
  };

  const suggestionChips = [
    "Cardiac Surgery",
    "Oncology & Cancer",
    "Orthopedics & Joint",
    "Neuro & Spine",
    "IVF & Fertility"
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-ink antialiased selection:bg-surface-teal selection:text-action">
      {/* Top Utility & Emergency Bar (Synchronized with Admin Settings) */}
      {siteSettings.showTopUtilityBar !== false && (
        <div className="hidden lg:block bg-black text-white">
          <div className="mx-auto flex max-w-[76rem] flex-wrap items-center justify-between gap-x-6 gap-y-1.5 px-4 py-1.5 text-[0.78rem]">
            <div className="flex items-center gap-2 font-bold flex-wrap">
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emergency opacity-75 motion-reduce:animate-none"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emergency"></span>
              </span>
              <span className="text-white/90 uppercase">{siteSettings.emergencyNotice || "EMERGENCY?"}</span>
              <a
                href={`tel:${emergencyPhoneClean}`}
                title={`Call: ${emergencyPhone}`}
                aria-label={`Call: ${emergencyPhone}`}
                className="inline-flex size-7 items-center justify-center rounded-full bg-emergency text-white hover:bg-emergency-strong hover:scale-105 transition-all shadow-xs"
              >
                <Phone className="size-3.5" aria-hidden="true" />
              </a>
              <a
                href={`https://wa.me/${whatsappPhoneClean}?text=Hello%20AKEEZO%2C%20I%20need%20help%20with%20a%20healthcare%20requirement.`}
                target="_blank"
                rel="noopener noreferrer"
                title={`WhatsApp: ${whatsappPhone}`}
                aria-label={`WhatsApp: ${whatsappPhone}`}
                className="inline-flex size-7 items-center justify-center rounded-full bg-[#25D366] text-white hover:bg-[#20bd5a] hover:scale-105 transition-all shadow-xs"
              >
                <svg className="size-3.5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"></path>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.373 0 0 5.373 0 12c0 2.119.553 4.11 1.519 5.842L.055 23.361l5.688-1.491A11.936 11.936 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.83 0-3.551-.482-5.05-1.325l-.362-.202-3.37.884.899-3.284-.236-.375A9.953 9.953 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path>
                </svg>
              </a>
            </div>
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setPartnerType("hospital");
                    setIsPartnerModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 font-bold hover:underline cursor-pointer bg-transparent border-0 text-inherit p-0 font-inherit"
                >
                  <Building2 className="size-3.5" aria-hidden="true" />
                  <span>List your hospital</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setPartnerType("agent");
                    setIsPartnerModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 font-bold hover:underline cursor-pointer bg-transparent border-0 text-inherit p-0 font-inherit"
                >
                  <Globe2 className="size-3.5" aria-hidden="true" />
                  <span>Agent portal</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsPatientModalOpen(true)}
                  className="flex items-center gap-1.5 font-bold hover:underline cursor-pointer bg-transparent border-0 text-inherit p-0 font-inherit"
                >
                  <User2 className="size-3.5" aria-hidden="true" />
                  <span>My journey / Patient Login</span>
                </button>
              </li>
              <li className="list-none">
                <button
                  type="button"
                  data-cy="country-lang-switcher"
                  data-testid="country-lang-switcher"
                  onClick={() => setIsCountryLangOpen(true)}
                  className="flex items-center gap-1.5 rounded-sm bg-white/15 px-2.5 py-1 text-[0.75rem] font-bold text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white cursor-pointer border-0"
                  aria-label={`Selected currency: ${selectedCountry.currencyCode}, language: ${selectedLanguage.name}`}
                  aria-haspopup="dialog"
                  aria-expanded={isCountryLangOpen}
                  data-state={isCountryLangOpen ? "open" : "closed"}
                  data-slot="popover-trigger"
                >
                  <span {...{ countrycode: selectedCountry.countryCode }} className="inline-flex items-center shrink-0">
                    <img
                      alt={selectedCountry.countryName}
                      className="h-3 w-4.5 rounded-[1px] object-cover shadow-xs"
                      srcSet={`https://flagcdn.com/w80/${selectedCountry.countryCode.toLowerCase()}.png 2x`}
                      src={selectedCountry.flagUrl}
                    />
                  </span>
                  <span className="font-extrabold uppercase tracking-tight">{selectedCountry.currencyCode}</span>
                  <span className="text-white/60">|</span>
                  <span className="font-medium text-white/90">{selectedLanguage.name}</span>
                  <ChevronDown
                    className={`size-3 text-white/80 transition-transform duration-200 ${isCountryLangOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* 1. Improved Header with Full Size Official Brand Logo */}
      <header className="sticky top-0 z-50 h-18 sm:h-20 border-b border-border/80 bg-white/95 backdrop-blur-md transition-shadow shadow-2xs">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-7 lg:gap-9">
            {/* Full Size Brand Logo */}
            <a href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-95 py-1">
              <img
                src="/logo/logo with tagline-dark.svg"
                alt="AKEEZO - Heal In India, Heal By Akeezo"
                width={190}
                height={60}
                className="h-10 sm:h-12 w-auto max-w-[170px] sm:max-w-[210px] md:max-w-[230px] object-contain"
              />
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13.5px] font-semibold text-ink-muted">
              <button
                type="button"
                onClick={() => setIsExploreOpen(true)}
                className="flex items-center gap-1 transition-colors hover:text-action cursor-pointer py-1"
              >
                <span>Treatments</span>
                <ChevronDown className="size-3.5 text-ink-muted/80" />
              </button>
              <a href="#hospitals" className="transition-colors hover:text-action py-1">
                Hospitals
              </a>
              <a href="#doctors" className="transition-colors hover:text-action py-1">
                Specialists
              </a>
              <a href="#destinations" className="transition-colors hover:text-action py-1">
                Destinations
              </a>
              <a href="/privacy" className="transition-colors hover:text-action py-1">
                Compliance
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Live WhatsApp / Phone Helpline with Active Pulse */}
            <a
              href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3.5 py-1.5 text-xs font-bold text-ink hover:border-action hover:bg-surface-teal hover:text-action transition-all min-h-[40px]"
            >
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <PhoneCall className="size-3.5 text-action" />
              <span>{phone}</span>
            </a>

            {/* Calculate Price Button */}
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="hidden sm:inline-flex h-10 min-h-[40px] items-center gap-1.5 justify-center rounded-full bg-surface-orange px-4 text-xs font-bold text-action-accent border border-[#ffd8bf] transition-all hover:bg-[#ffe8d9] cursor-pointer shadow-2xs"
            >
              <Calculator className="size-3.5" />
              <span>Calculate Price</span>
            </button>

            {/* Primary CTA: Plan Treatment */}
            <a
              href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20would%20like%20to%20plan%20my%20treatment`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 min-h-[40px] items-center gap-1 justify-center rounded-full bg-action px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-action-hover active:translate-y-px cursor-pointer"
            >
              <span>Plan Treatment</span>
              <ChevronRight className="size-3.5" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center rounded-xl p-2 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer min-h-[40px] min-w-[40px]"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer with Full Size Logo */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-white px-5 py-5 shadow-lg animate-in slide-in-from-top-2">
          {/* Brand header inside mobile menu */}
          <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-border">
            <img
              src="/logo/logo with tagline-dark.svg"
              alt="Akeezo Healthcare"
              width={150}
              height={45}
              className="h-8 w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => {
                setIsCountryLangOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 rounded-sm bg-surface-muted px-2.5 py-1 text-[0.75rem] font-bold text-ink border border-border cursor-pointer shadow-2xs hover:border-action"
              aria-label={`Selected currency: ${selectedCountry.currencyCode}, language: ${selectedLanguage.name}`}
            >
              <span {...{ countrycode: selectedCountry.countryCode }} className="inline-flex items-center shrink-0">
                <img
                  alt={selectedCountry.countryName}
                  className="h-3 w-4.5 rounded-[1px] object-cover shadow-xs"
                  srcSet={`https://flagcdn.com/w80/${selectedCountry.countryCode.toLowerCase()}.png 2x`}
                  src={selectedCountry.flagUrl}
                />
              </span>
              <span className="font-extrabold uppercase tracking-tight">{selectedCountry.currencyCode}</span>
              <span className="text-ink-muted/60">|</span>
              <span className="font-medium text-ink-muted">{selectedLanguage.name}</span>
            </button>
          </div>

          <nav className="flex flex-col space-y-2.5 text-sm font-semibold text-ink">
            <button
              type="button"
              onClick={() => {
                setIsExploreOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center justify-between py-2 text-left hover:text-action cursor-pointer"
            >
              <span>Explore Treatments & Specialties</span>
              <ChevronRight className="size-4 text-ink-muted" />
            </button>
            <a
              href="#hospitals"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 hover:text-action"
            >
              <span>Accredited Hospitals & Clinics</span>
              <ChevronRight className="size-4 text-ink-muted" />
            </a>
            <a
              href="#doctors"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 hover:text-action"
            >
              <span>Board-Certified Specialists</span>
              <ChevronRight className="size-4 text-ink-muted" />
            </a>
            <a
              href="#destinations"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 hover:text-action"
            >
              <span>Medical Tourism Destinations</span>
              <ChevronRight className="size-4 text-ink-muted" />
            </a>
            <a
              href="/privacy"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 hover:text-action"
            >
              <span>Compliance & Legal Policies</span>
              <ChevronRight className="size-4 text-ink-muted" />
            </a>
            <div className="pt-3.5 border-t border-border flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsCalculatorOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full inline-flex h-11 items-center justify-center rounded-full bg-surface-orange text-xs font-bold text-action-accent border border-[#ffd8bf] cursor-pointer"
              >
                <Calculator className="size-4 mr-2" />
                Calculate Treatment Price
              </button>
              <a
                href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex h-11 items-center justify-center rounded-full bg-surface-teal text-xs font-bold text-action border border-[#b2ebe4]"
              >
                <PhoneCall className="size-4 mr-2" />
                Call Care Desk ({phone})
              </a>
            </div>
          </nav>
        </div>
      )}

      {/* Main Landmark for Accessibility and SEO */}
      <main id="main-content">
        {/* Semantic H1 per design.md guidance */}
        <h1 className="sr-only">
          AKEEZO Healthcare Platform — Heal In India, Heal By Akeezo. Discover Accredited Hospitals, Top Doctors & Medical Tourism in India.
        </h1>

        {/* 2. Hero Centerpiece (CureMeAbroad: Centered brand centerpiece with generous whitespace) */}
        <section className="relative overflow-hidden pt-12 pb-14 sm:pt-16 sm:pb-20 text-center" aria-label="Akeezo Platform Hero">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
            {/* Official Akeezo Logo Centerpiece per design.md geometry with explicit dimensions to eliminate CLS */}
            <div className="mx-auto mb-6 flex justify-center items-center h-[72px] sm:h-[96px]">
              <img
                src="/logo/logo with tagline-dark.svg"
                alt="Akeezo - Heal In India, Heal By Akeezo"
                width={480}
                height={96}
                loading="eager"
                decoding="sync"
                className="h-[72px] sm:h-[96px] w-auto max-w-[340px] sm:max-w-[480px] object-contain"
              />
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search for "cardiac bypass", "apollo hospital", "dr. naresh trehan"...'
                  className="w-full bg-transparent px-3 text-sm text-ink placeholder:text-ink-muted/80 focus:outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 h-10 px-5 sm:px-6 rounded-full bg-brand-orange hover:bg-brand-orange-alt text-white text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[40px]"
                >
                  Search
                </button>
              </form>

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
                    className={`shrink-0 h-[38px] rounded-full px-4 text-xs font-bold transition-all duration-200 cursor-pointer ${
                      selectedSpecialty === chip
                        ? "bg-action text-white shadow-sm"
                        : "bg-surface-muted text-ink-muted hover:bg-surface-teal hover:text-action"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Feature Row (CureMeAbroad: 2 cards ~575×297px with 24px gap, 28px padding, 20px radius) */}
        <section className="py-4 sm:py-6" aria-label="Core Patient Tools">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Feature Card 1: Get Your Personalized Price */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-border bg-gradient-to-br from-white via-white to-surface-orange/40 p-7 shadow-[0_4px_20px_rgb(15_23_42/8%)] transition-transform duration-200 hover:-translate-y-1 min-h-[297px]">
                <div className="max-w-[360px] relative z-10">
                  <div className="inline-flex size-11 items-center justify-center rounded-full bg-surface-orange text-action-accent mb-4 border border-[#ffd8bf]">
                    <Calculator className="size-5" />
                  </div>
                  <h2 className="text-[22px] sm:text-[24px] font-bold text-ink mb-2 leading-[30px] font-heading">
                    Get Your Personalized Price
                  </h2>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    See the real price before you talk to anyone. Compare itemized hospital quotes, room categories, and physician fees with zero markups.
                  </p>
                </div>

                {/* Decorative Subtle Right Graphic per design.md */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none hidden sm:block">
                  <div className="size-36 rounded-full border-8 border-action-accent flex items-center justify-center">
                    <Calculator className="size-18 text-action-accent" />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between relative z-10">
                  <button
                    type="button"
                    onClick={() => setIsCalculatorOpen(true)}
                    className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-alt px-5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
                  >
                    Get Your Estimate in 1 Minute
                  </button>
                  <span className="text-xs font-bold text-brand-orange">
                    Save Up To 70%
                  </span>
                </div>
              </div>

              {/* Feature Card 2: Explore Options */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-border bg-gradient-to-br from-white via-white to-surface-teal/50 p-7 shadow-[0_4px_20px_rgb(15_23_42/8%)] transition-transform duration-200 hover:-translate-y-1 min-h-[297px]">
                <div className="max-w-[360px] relative z-10">
                  <div className="inline-flex size-11 items-center justify-center rounded-full bg-surface-teal text-action mb-4 border border-[#b2ebe4]">
                    <Compass className="size-5" />
                  </div>
                  <h2 className="text-[22px] sm:text-[24px] font-bold text-ink mb-2 leading-[30px] font-heading">
                    Explore Treatments & Hospitals
                  </h2>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Every accredited Indian healthcare destination, JCI-certified hospital, and world-renowned department chair organized in one directory.
                  </p>
                </div>

                {/* Decorative Subtle Right Graphic per design.md */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-15 transition-opacity pointer-events-none hidden sm:block">
                  <div className="size-36 rounded-full border-8 border-action flex items-center justify-center">
                    <Compass className="size-18 text-action" />
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between relative z-10">
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen(true)}
                    className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-full bg-action px-5 text-xs font-bold text-white shadow-sm transition-all hover:bg-action-hover cursor-pointer"
                  >
                    Explore All Specialities
                  </button>
                  <span className="text-xs font-bold text-action">
                    150+ Verified Hubs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

      {/* 4. Trust Strip (CureMeAbroad: Horizontal centered strip with vertical dividers) */}
      <section className="py-8" aria-label="Clinical Quality & Trust Accreditations">
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

              <div className="flex flex-col items-center pt-4 md:pt-0">
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
            <div className="rounded-[20px] border border-[#ffd8bf] bg-surface-orange p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-md bg-[#fff4ec] px-2.5 py-1 text-[11px] font-bold text-[#943a00] uppercase tracking-wider mb-3 border border-[#ffd8bf]">
                  Logistics Support
                </span>
                <h3 className="text-xl font-bold text-ink mb-2">
                  Free Airport & Hotel Stay
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Complimentary airport VIP reception, local 5G SIM card, and companion lodging for qualified surgical procedures.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#ffd8bf]/60 flex items-center justify-between">
                <span className="text-xs font-bold text-action-accent">Terms Apply</span>
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20tell%20me%20about%20Free%20Hotel%20and%20Flights%20benefit`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-action-accent hover:underline min-h-[38px] px-1"
                >
                  <span>Claim Now</span>
                  <ChevronRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Promo Card 2: Free Second Opinion */}
            <div className="rounded-[20px] border border-[#b2ebe4] bg-surface-teal p-6 sm:p-7 shadow-xs flex flex-col justify-between">
              <div>
                <span className="inline-block rounded-md bg-[#e6f8f6] px-2.5 py-1 text-[11px] font-bold text-[#005f54] uppercase tracking-wider mb-3 border border-[#b2ebe4]">
                  Clinical Care
                </span>
                <h3 className="text-xl font-bold text-ink mb-2">
                  Free Second Opinion in 48h
                </h3>
                <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Upload your MRI/CT scans. Receive comprehensive clinical reviews and treatment plans from senior department chairs at zero cost.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#b2ebe4]/60 flex items-center justify-between">
                <span className="text-xs font-bold text-action">Zero Obligation</span>
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20want%20a%20Free%20Second%20Opinion`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-action hover:underline min-h-[38px] px-1"
                >
                  <span>Upload Reports</span>
                  <ChevronRight className="size-3.5" />
                </a>
              </div>
            </div>

            {/* Promo Card 3: Best Price Guarantee */}
            <div className="rounded-[20px] border border-border bg-surface-muted p-6 sm:p-7 shadow-xs flex flex-col justify-between">
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
                  className="inline-flex items-center gap-1 text-xs font-bold text-action hover:underline cursor-pointer min-h-[38px] px-1"
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
      <section className="py-10" aria-label="Treatment Planning Coordination">
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-action via-[#009180] to-brand-teal p-8 sm:p-14 text-white shadow-lg">
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
                    <CheckCircle2 className="size-4 text-white" />
                    <span>Free Clinical Triage</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-white" />
                    <span>Medical Visa Support</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-white" />
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
                  className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-alt px-7 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
                >
                  Calculate Procedure Cost
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      {/* 7. Directory Tabbed Footer (CureMeAbroad signature layout) */}
      <footer className="border-t border-border bg-white pt-12 pb-8">
        <h2 className="sr-only">Healthcare Directory & Statutory Disclosures</h2>
        <div className="mx-auto max-w-[1280px] px-4 sm:px-8">
          {/* Top Footer Navigation Tabs */}
          <div className="mb-6 flex flex-wrap items-center gap-2 border-b border-border pb-4">
            {(["treatments", "hospitals", "doctors", "destinations"] as const).map((tabKey) => (
              <button
                key={tabKey}
                type="button"
                onClick={() => setActiveTab(tabKey)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer capitalize min-h-[38px] ${
                  activeTab === tabKey
                    ? "bg-action text-white shadow-xs"
                    : "bg-surface-muted text-ink-muted hover:bg-surface-teal hover:text-action"
                }`}
              >
                {tabKey}
              </button>
            ))}
          </div>

          {/* Active Tabbed Links Grid (4 columns) */}
          <div className="mb-12">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-muted mb-4">
              Featured {activeTab} in India
            </h3>

            {activeTab === "treatments" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {DIRECTORY_TABS.treatments.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                  >
                    <div className="text-xs text-action font-semibold mb-0.5">{item.category}</div>
                    <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                  </a>
                ))}
              </div>
            )}

            {activeTab === "hospitals" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {DIRECTORY_TABS.hospitals.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                  >
                    <div className="text-xs text-action-accent font-semibold mb-0.5">{item.location}</div>
                    <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                  </a>
                ))}
              </div>
            )}

            {activeTab === "doctors" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {DIRECTORY_TABS.doctors.map((item, idx) => (
                  <a
                    key={idx}
                    href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20would%20like%20to%20consult%20with%20${encodeURIComponent(item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                  >
                    <div className="text-xs text-ink-muted font-medium mb-0.5">{item.experience}</div>
                    <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                    <div className="text-xs text-action font-semibold mt-1">{item.role}</div>
                  </a>
                ))}
              </div>
            )}

            {activeTab === "destinations" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {DIRECTORY_TABS.destinations.map((item, idx) => (
                  <a
                    key={idx}
                    href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20am%20planning%20medical%20treatment%20in%20${encodeURIComponent(item.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-border p-3.5 hover:border-action hover:bg-surface-teal/30 transition-all cursor-pointer block"
                  >
                    <div className="text-lg mb-1">{item.flag}</div>
                    <div className="text-sm font-bold text-ink group-hover:text-action">{item.name}</div>
                    <div className="text-xs text-ink-muted mt-1">{item.count}</div>
                  </a>
                ))}
              </div>
            )}
          </div>

          <hr className="border-border my-8" />

          {/* 5 Information Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-xs text-ink-muted mb-10">
            <div>
              <h3 className="font-bold text-ink text-sm mb-3">About Akeezo</h3>
              <p className="leading-relaxed mb-3">
                India's verified medical tourism and healthcare navigation platform. Bridging global patients to accredited hospitals.
              </p>
              <div className="font-bold text-ink">ISO 9001:2015 Certified</div>
            </div>

            <div>
              <h3 className="font-bold text-ink text-sm mb-3">Patient Support</h3>
              <ul className="space-y-2">
                <li><a href="#opinion" onClick={() => setIsExploreOpen(true)} className="hover:text-action">Free Second Opinion</a></li>
                <li><a href="#calculator" onClick={() => setIsCalculatorOpen(true)} className="hover:text-action">Cost Calculator</a></li>
                <li><a href="#visa" className="hover:text-action">Medical Visa Assistance</a></li>
                <li><a href="#concierge" className="hover:text-action">Airport Concierge & Stay</a></li>
                <li><a href="#telehealth" className="hover:text-action">Video Consultation Desk</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-ink text-sm mb-3">Clinical Quality</h3>
              <ul className="space-y-2">
                <li><span className="text-action font-semibold">JCI & NABH Audited</span></li>
                <li><a href="/privacy" className="hover:text-action">Data Protection Policy</a></li>
                <li><a href="/terms" className="hover:text-action">Platform Terms & Scope</a></li>
                <li><a href="/consent" className="hover:text-action">Informed Patient Consent</a></li>
                <li><a href="/refund-policy" className="hover:text-action">Zero-Markup Billing</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-ink text-sm mb-3">Legal & Policies</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="hover:text-action">Privacy Policy (DPDP / GDPR)</a></li>
                <li><a href="/terms" className="hover:text-action">Terms of Service</a></li>
                <li><a href="/disclaimer" className="hover:text-action">Medical Disclaimer</a></li>
                <li><a href="/grievance-officer" className="hover:text-action">Grievance Officer</a></li>
                <li><a href="/refund-policy" className="hover:text-action">Refund Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-ink text-sm mb-3">Care Coordination</h3>
              <div className="space-y-2">
                <div><span className="font-bold text-ink">Helpline:</span> {phone}</div>
                <div><span className="font-bold text-ink">Care:</span> {siteSettings.careEmail}</div>
                <div><span className="font-bold text-ink">Office:</span> {siteSettings.officeAddress}</div>
                <div className="pt-2">
                  <a
                    href={`https://wa.me/${phoneClean}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-surface-teal px-3 py-1 font-bold text-action text-[11px]"
                  >
                    <span>💬 WhatsApp 24/7 Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-border my-6" />

          {/* Bottom Bar: Copyright, Country Switcher & Grievance */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <img src="/logo/favicon.svg" alt="Akeezo" className="size-5" />
              <span>© 2026 {siteSettings.legalEntityName}. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {/* Regional Country / Currency / Language Switcher Button in Footer */}
              <button
                type="button"
                data-cy="country-lang-switcher-footer"
                data-testid="country-lang-switcher-footer"
                onClick={() => setIsCountryLangOpen(true)}
                className="flex items-center gap-1.5 rounded-sm bg-surface-muted px-2.5 py-1 text-[0.75rem] font-bold text-ink border border-border transition-colors hover:bg-surface-teal/50 hover:text-action hover:border-action focus-visible:outline-2 focus-visible:outline-action cursor-pointer shadow-2xs"
                aria-label={`Selected currency: ${selectedCountry.currencyCode}, language: ${selectedLanguage.name}`}
                aria-haspopup="dialog"
                aria-expanded={isCountryLangOpen}
                data-state={isCountryLangOpen ? "open" : "closed"}
                data-slot="popover-trigger"
              >
                <span {...{ countrycode: selectedCountry.countryCode }} className="inline-flex items-center shrink-0">
                  <img
                    alt={selectedCountry.countryName}
                    className="h-3 w-4.5 rounded-[1px] object-cover shadow-xs"
                    srcSet={`https://flagcdn.com/w80/${selectedCountry.countryCode.toLowerCase()}.png 2x`}
                    src={selectedCountry.flagUrl}
                  />
                </span>
                <span className="font-extrabold uppercase tracking-tight">{selectedCountry.currencyCode}</span>
                <span className="text-ink-muted/60">|</span>
                <span className="font-medium text-ink-muted">{selectedLanguage.name}</span>
                <ChevronDown
                  className={`size-3 text-ink-muted/80 transition-transform duration-200 ${isCountryLangOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <span>Regulated under Indian Clinical Establishments Acts</span>
              <a href="/grievance-officer" className="hover:text-action font-bold">Grievance Desk</a>
            </div>
          </div>
        </div>
      </footer>

      {/* MODAL 1: Treatment Selector / Explore Modal */}
      {isExploreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">Explore Medical Specialities in India</h3>
                <p className="text-xs text-ink-muted mt-1">Select a department to view accredited procedures and specialists</p>
              </div>
              <button
                onClick={() => setIsExploreOpen(false)}
                className="rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {SPECIALTIES.map((spec) => (
                <div
                  key={spec.id}
                  className="rounded-2xl border border-border p-5 hover:border-action hover:bg-surface-teal/20 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{spec.icon}</span>
                    <div>
                      <h4 className="font-bold text-ink">{spec.name}</h4>
                      <span className="text-[11px] font-bold text-action">{spec.count}</span>
                    </div>
                  </div>
                  <p className="text-xs text-ink-muted mb-3">{spec.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {spec.procedures.map((p, pIdx) => (
                      <a
                        key={pIdx}
                        href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20am%20interested%20in%20${encodeURIComponent(p)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-surface-muted px-2 py-1 text-[11px] font-medium text-ink hover:bg-action hover:text-white transition-colors"
                      >
                        {p}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsExploreOpen(false)}
                className="rounded-full bg-surface-muted px-6 py-2 text-xs font-bold text-ink hover:bg-border cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Cost Calculator Modal */}
      {isCalculatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-action-accent" />
                <h3 className="text-xl font-bold text-ink">Personalized Procedure Estimate</h3>
              </div>
              <button
                onClick={() => setIsCalculatorOpen(false)}
                className="rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="calc-specialty" className="block text-xs font-bold text-ink mb-1.5">Select Medical Speciality</label>
                <select
                  id="calc-specialty"
                  name="specialty"
                  value={calcSpecialty}
                  onChange={(e) => setCalcSpecialty(e.target.value)}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-ink focus:border-action focus:outline-none"
                >
                  <option value="Cardiac Surgery">Cardiac Surgery (CABG / Valve)</option>
                  <option value="Oncology & Cancer Care">Oncology (Proton Beam / CAR-T)</option>
                  <option value="Orthopedics & Joint">Orthopedics (Robotic Knee / Hip)</option>
                  <option value="Neuro & Spine Surgery">Neuro & Spine (CyberKnife / DBS)</option>
                  <option value="Organ Transplants">Organ Transplants (Liver / Kidney)</option>
                  <option value="IVF & Fertility">IVF & Assisted Reproductive Tech</option>
                </select>
              </div>

              <div>
                <label htmlFor="calc-destination" className="block text-xs font-bold text-ink mb-1.5">Destination Hub in India</label>
                <select
                  id="calc-destination"
                  name="destination"
                  value={calcCountry}
                  onChange={(e) => setCalcCountry(e.target.value)}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-ink focus:border-action focus:outline-none"
                >
                  <option value="Delhi NCR">New Delhi & NCR (Apollo, Medanta, Max, Fortis)</option>
                  <option value="Bengaluru">Bengaluru (Narayana Health, Manipal)</option>
                  <option value="Mumbai">Mumbai (Kokilaben, Hinduja)</option>
                  <option value="Chennai">Chennai (Apollo Main, MGM Healthcare)</option>
                </select>
              </div>

              <div>
                <label htmlFor="calc-companion" className="block text-xs font-bold text-ink mb-1.5">Companion Assistance</label>
                <select
                  id="calc-companion"
                  name="companion"
                  value={calcCompanion}
                  onChange={(e) => setCalcCompanion(e.target.value)}
                  className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-ink focus:border-action focus:outline-none"
                >
                  <option value="1 Companion">1 Traveling Attendant (Included)</option>
                  <option value="2 Companions">2 Traveling Attendants (Suite Room)</option>
                  <option value="None">Traveling Solo (Full Dedicated Concierge)</option>
                </select>
              </div>

              <div className="rounded-2xl border border-[#b2ebe4] bg-surface-teal p-4 mt-6">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs font-bold text-action uppercase tracking-wider">
                    Indicative Package Range in India
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCalculatorOpen(false);
                      setIsCountryLangOpen(true);
                    }}
                    className="text-[11px] font-bold text-action underline cursor-pointer hover:text-action-hover"
                  >
                    Change Currency ({selectedCountry.currencyCode})
                  </button>
                </div>
                <div className="text-2xl font-black text-ink">
                  {formatEstimate(4200, 7800, selectedCountry)}
                </div>
                <div className="text-xs text-ink-muted mt-1 leading-relaxed">
                  {selectedCountry.currencyCode === "INR"
                    ? "Standard Indian Hospital Tariff (NABH / JCI Accredited). Save up to 75% compared to private treatment in US, UK, or Europe."
                    : `US / UK Benchmark: $38,000 – $65,000 USD (Save approx. 75% in India). Converted to ${selectedCountry.currencyCode}. `}
                  Includes hospital stay, surgeon fee, pre-op tests, airport transfers, and 7-day coordinator desk.
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                    `Hello Akeezo, I would like an itemized quote for: ${calcSpecialty} in ${calcCountry} with ${calcCompanion} in ${selectedCountry.currencyCode}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex h-11 items-center justify-center rounded-full bg-action px-6 text-xs font-bold text-white shadow-sm hover:bg-action-hover cursor-pointer"
                >
                  Request Itemized Quote on WhatsApp
                </a>
                <button
                  onClick={() => setIsCalculatorOpen(false)}
                  className="rounded-full bg-surface-muted px-6 py-2.5 text-xs font-bold text-ink hover:bg-border cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Regional Currency & Language Switcher Modal */}
      {isCountryLangOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="country-lang-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsCountryLangOpen(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-hidden rounded-[20px] bg-white p-6 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div>
                <h3 id="country-lang-dialog-title" className="text-lg font-bold text-ink">
                  Regional & Currency Settings
                </h3>
                <p className="text-xs text-ink-muted mt-0.5">
                  Select your home currency and language for customized medical packages
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCountryLangOpen(false)}
                className="rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mt-3">
              <button
                type="button"
                onClick={() => {
                  setSwitcherTab("currency");
                  setSwitcherSearch("");
                }}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                  switcherTab === "currency"
                    ? "border-action text-action"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                Currency ({selectedCountry.currencyCode})
              </button>
              <button
                type="button"
                onClick={() => {
                  setSwitcherTab("language");
                  setSwitcherSearch("");
                }}
                className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                  switcherTab === "language"
                    ? "border-action text-action"
                    : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                Language ({selectedLanguage.name})
              </button>
            </div>

            {/* Search Bar */}
            <div className="my-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
                <input
                  type="search"
                  value={switcherSearch}
                  onChange={(e) => setSwitcherSearch(e.target.value)}
                  placeholder={
                    switcherTab === "currency"
                      ? "Search currency by code, country, or name..."
                      : "Search language..."
                  }
                  className="w-full rounded-xl border border-border bg-surface-muted py-2 pl-9 pr-4 text-xs text-ink placeholder:text-ink-muted/70 focus:border-action focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto max-h-[300px] divide-y divide-border/60 pr-1">
              {switcherTab === "currency" ? (
                filteredCountries.length > 0 ? (
                  filteredCountries.map((c) => {
                    const isSelected = selectedCountry.countryCode === c.countryCode;
                    return (
                      <button
                        key={c.countryCode}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(c);
                          setIsCountryLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-colors cursor-pointer hover:bg-surface-teal/30 ${
                          isSelected ? "bg-surface-teal/50 font-bold" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            alt={c.countryName}
                            className="h-4 w-6 rounded-[2px] object-cover shadow-2xs border border-black/10"
                            src={c.flagUrl}
                          />
                          <div>
                            <div className="text-xs text-ink">
                              <span className="font-extrabold">{c.currencyCode}</span>
                              <span className="mx-1 text-ink-muted">·</span>
                              <span>{c.currencyName}</span>
                            </div>
                            <div className="text-[11px] text-ink-muted">
                              {c.countryName} ({c.currencySymbol})
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="size-4 text-action shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-6 text-center text-xs text-ink-muted">No currencies match your search</div>
                )
              ) : filteredLanguages.length > 0 ? (
                filteredLanguages.map((l) => {
                  const isSelected = selectedLanguage.code === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => {
                        setSelectedLanguage(l);
                        setIsCountryLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left rounded-lg transition-colors cursor-pointer hover:bg-surface-teal/30 ${
                        isSelected ? "bg-surface-teal/50 font-bold" : ""
                      }`}
                    >
                      <div>
                        <span className="text-xs text-ink font-bold">{l.name}</span>
                        <span className="ml-2 text-xs text-ink-muted">({l.local})</span>
                      </div>
                      {isSelected && <Check className="size-4 text-action shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-ink-muted">No languages match your search</div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-ink-muted">
                Active: <strong className="text-ink">{selectedCountry.currencyCode} ({selectedCountry.currencySymbol})</strong> · {selectedLanguage.name}
              </span>
              <button
                type="button"
                onClick={() => setIsCountryLangOpen(false)}
                className="rounded-full bg-action px-5 py-1.5 text-xs font-bold text-white hover:bg-action-hover cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Patient Journey / Login Modal */}
      {isPatientModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="patient-journey-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsPatientModalOpen(false)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-md overflow-hidden rounded-[20px] bg-white p-6 sm:p-7 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex size-9 items-center justify-center rounded-full bg-surface-teal text-action border border-[#b2ebe4]">
                  <User2 className="size-4" />
                </div>
                <div>
                  <h3 id="patient-journey-modal-title" className="text-base font-bold text-ink">
                    My Medical Journey
                  </h3>
                  <p className="text-[11px] text-ink-muted">Track treatment progress, visa letters & hospital quotes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPatientModalOpen(false)}
                className="rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label="Close patient journey dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="patient-lookup-id" className="block text-xs font-bold text-ink mb-1.5">
                  Case ID, Passport or WhatsApp Number
                </label>
                <input
                  id="patient-lookup-id"
                  type="text"
                  value={patientLookupId}
                  onChange={(e) => setPatientLookupId(e.target.value)}
                  placeholder="e.g. AKZ-2026-0842 or +971 50..."
                  className="w-full rounded-xl border border-border bg-surface-muted py-2.5 px-3.5 text-xs text-ink placeholder:text-ink-muted/70 focus:border-action focus:outline-none focus:bg-white font-medium"
                />
              </div>

              <div className="rounded-xl border border-[#b2ebe4] bg-surface-teal/40 p-3.5 text-xs text-ink space-y-2">
                <div className="font-bold text-action flex items-center gap-1.5">
                  <span>🔒 Patient Health Privacy Protected</span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  Your medical records and physician triage are secured under Indian DPDP & international health confidentiality rules.
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                    patientLookupId.trim()
                      ? `Hello Akeezo Patient Desk, I would like to track my medical case: ${patientLookupId}`
                      : `Hello Akeezo Patient Desk, I would like to access my medical journey and active case status.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex h-11 items-center justify-center rounded-full bg-action px-6 text-xs font-bold text-white shadow-sm hover:bg-action-hover cursor-pointer"
                >
                  Track Live on WhatsApp Care Desk
                </a>
                <a
                  href="/case-management"
                  className="w-full inline-flex h-10 items-center justify-center rounded-full bg-surface-muted px-4 text-xs font-bold text-ink hover:bg-border cursor-pointer text-center"
                >
                  Clinical Staff & Coordinator Login
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Hospital & Agent Partner Onboarding Modal */}
      {isPartnerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-onboarding-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
          onClick={() => setIsPartnerModalOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[20px] bg-white p-6 sm:p-7 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="inline-flex size-9 items-center justify-center rounded-full bg-surface-orange text-action-accent border border-[#ffd8bf]">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h3 id="partner-onboarding-modal-title" className="text-base font-bold text-ink">
                    {partnerType === "hospital" ? "List Your Hospital / Medical Center" : "Healthcare Tourism Agent Portal"}
                  </h3>
                  <p className="text-[11px] text-ink-muted">Join India&apos;s accredited medical travel network</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(false)}
                className="rounded-full p-2 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label="Close partnership dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 flex border-b border-border">
              <button
                type="button"
                onClick={() => setPartnerType("hospital")}
                className={`flex-1 py-2 text-center text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                  partnerType === "hospital" ? "border-action text-action" : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                Hospital / Clinic Partner
              </button>
              <button
                type="button"
                onClick={() => setPartnerType("agent")}
                className={`flex-1 py-2 text-center text-xs font-bold transition-colors border-b-2 cursor-pointer ${
                  partnerType === "agent" ? "border-action text-action" : "border-transparent text-ink-muted hover:text-ink"
                }`}
              >
                Travel Agent / Facilitator
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="rounded-xl border border-border bg-surface-muted p-4 text-xs text-ink space-y-2">
                <div className="font-bold text-ink">
                  {partnerType === "hospital"
                    ? "NABH / JCI Accreditation Requirement"
                    : "Official Medical Travel Partner Empanelment"}
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  {partnerType === "hospital"
                    ? "Akeezo empanels NABH, NABL, and JCI accredited healthcare institutions across India. Empaneled hospitals receive direct international patient referrals, verified clinical dossiers, and dedicated multilingual bedside coordinators."
                    : "International facilitators and medical tourism agents receive transparent zero-leakage commission tracking, priority doctor appointment slots, and fast-track Medical Visa assistance for traveling patients."}
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                    partnerType === "hospital"
                      ? "Hello Akeezo Partnership Team, I represent a hospital interested in listing on the Akeezo healthcare platform."
                      : "Hello Akeezo Partnership Team, I am a medical travel agent interested in partner empanelment."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex h-11 items-center justify-center rounded-full bg-action px-6 text-xs font-bold text-white shadow-sm hover:bg-action-hover cursor-pointer"
                >
                  Connect with Partnership Desk (WhatsApp)
                </a>
                <a
                  href={`mailto:${siteSettings.partnershipEmail || "partnership@akeezo.com"}?subject=${encodeURIComponent(
                    partnerType === "hospital" ? "Hospital Empanelment Application" : "Medical Tourism Agent Registration"
                  )}`}
                  className="w-full inline-flex h-10 items-center justify-center rounded-full bg-surface-muted px-4 text-xs font-bold text-ink hover:bg-border cursor-pointer text-center"
                >
                  Email Partnership Team ({siteSettings.partnershipEmail || "partnership@akeezo.com"})
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTemplate;
