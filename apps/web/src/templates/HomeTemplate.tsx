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
  User2,
  ChevronDown,
  Check,
  X,
  Menu
} from "lucide-react";
import {
  COUNTRIES,
  LANGUAGES,
  SPECIALTIES,
  DIRECTORY_TABS,
  formatEstimate,
  type CountryOption
} from "../components/navigationData.js";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCountryLangOpen, setIsCountryLangOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [partnerType, setPartnerType] = useState<"hospital" | "agent">("hospital");
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);

  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");
  const emergencyPhone = siteSettings.emergencyHelpline || siteSettings.phone || "+91 82876 39443";
  const emergencyPhoneClean = emergencyPhone.startsWith("+")
    ? emergencyPhone.replace(/[^0-9+]/g, "")
    : `+${emergencyPhone.replace(/[^0-9]/g, "")}`;
  const whatsappPhone = siteSettings.whatsappHelpline || siteSettings.phone || "+91 82876 39443";
  const whatsappPhoneClean = whatsappPhone.replace(/[^0-9]/g, "");

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
                  className="shrink-0 h-10 px-5 sm:px-6 rounded-full bg-action-accent hover:bg-[#943a00] text-white text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[40px]"
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
                    className="inline-flex h-11 min-h-[44px] items-center justify-center rounded-full bg-action-accent hover:bg-[#943a00] px-5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
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
                  className="inline-flex h-12 min-h-[48px] items-center justify-center rounded-full bg-action-accent hover:bg-[#943a00] px-7 text-sm font-bold text-white shadow-md transition-all cursor-pointer"
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
