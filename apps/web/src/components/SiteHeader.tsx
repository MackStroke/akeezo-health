import React, { useState, useEffect } from "react";
import type { SiteSettings } from "@akeezo/contracts";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Calculator,
  Check,
  PhoneCall,
  Phone,
  Building2,
  Globe2,
  Languages,
  User2
} from "lucide-react";
import {
  COUNTRIES,
  LANGUAGES,
  SPECIALTIES,
  formatEstimate,
  type CountryOption
} from "./navigationData.js";
import {
  applyLanguageTranslation,
  getSavedLanguageCode,
  initGoogleTranslate
} from "./translation.js";

export interface SiteHeaderProps {
  siteSettings?: Partial<SiteSettings>;
  activePath?: string;
  isCalculatorOpen?: boolean;
  onCalculatorOpenChange?: (open: boolean) => void;
  isExploreOpen?: boolean;
  onExploreOpenChange?: (open: boolean) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  siteSettings = {},
  activePath: _activePath = "/",
  isCalculatorOpen: propCalculatorOpen,
  onCalculatorOpenChange,
  isExploreOpen: propExploreOpen,
  onExploreOpenChange
}) => {
  // Mobile drawer state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");

  // Regional Currency & Language Switcher State
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isCountryLangOpen, setIsCountryLangOpen] = useState(false);
  const [switcherTab, setSwitcherTab] = useState<"currency" | "language">("currency");
  const [switcherSearch, setSwitcherSearch] = useState("");
  const [translateImgError, setTranslateImgError] = useState(false);

  useEffect(() => {
    const savedCode = getSavedLanguageCode();
    if (savedCode && savedCode !== "en") {
      const match = LANGUAGES.find((l) => l.code.toLowerCase() === savedCode);
      if (match) {
        setSelectedLanguage(match);
      }
      initGoogleTranslate();
    }
  }, []);

  // Interactive Modals (controlled or internal)
  const [internalCalculatorOpen, setInternalCalculatorOpen] = useState(false);
  const [internalExploreOpen, setInternalExploreOpen] = useState(false);

  // Additional header portals
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [partnerType, setPartnerType] = useState<"hospital" | "agent">("hospital");
  const [patientLookupId, setPatientLookupId] = useState("");
  const [patientError, setPatientError] = useState("");

  // Feedback & Validation states
  const [quoteName, setQuoteName] = useState("");
  const [quoteContact, setQuoteContact] = useState("");
  const [quoteError, setQuoteError] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  const [partnerOrg, setPartnerOrg] = useState("");
  const [partnerContact, setPartnerContact] = useState("");
  const [partnerError, setPartnerError] = useState("");
  const [partnerSubmitted, setPartnerSubmitted] = useState(false);

  const isCalculatorOpen = propCalculatorOpen !== undefined ? propCalculatorOpen : internalCalculatorOpen;
  const setIsCalculatorOpen = (open: boolean) => {
    if (onCalculatorOpenChange) onCalculatorOpenChange(open);
    else setInternalCalculatorOpen(open);
  };

  const isExploreOpen = propExploreOpen !== undefined ? propExploreOpen : internalExploreOpen;
  const setIsExploreOpen = (open: boolean) => {
    if (onExploreOpenChange) onExploreOpenChange(open);
    else setInternalExploreOpen(open);
  };

  // Quick Estimate State inside Calculator Modal
  const [calcSpecialty, setCalcSpecialty] = useState("Cardiac Surgery");
  const [calcCountry, setCalcCountry] = useState("India");
  const [calcCompanion, setCalcCompanion] = useState("1 Companion");

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.countryName.toLowerCase().includes(switcherSearch.toLowerCase()) ||
      c.currencyCode.toLowerCase().includes(switcherSearch.toLowerCase()) ||
      c.currencyName.toLowerCase().includes(switcherSearch.toLowerCase())
  );

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(switcherSearch.toLowerCase()) ||
      l.local.toLowerCase().includes(switcherSearch.toLowerCase())
  );

  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");

  const emergencyPhone = siteSettings.emergencyHelpline || siteSettings.phone || "+91 82876 39443";
  const emergencyPhoneClean = emergencyPhone.replace(/[^0-9]/g, "");
  const whatsappPhone = siteSettings.whatsappHelpline || siteSettings.phone || "+91 82876 39443";
  const whatsappPhoneClean = whatsappPhone.replace(/[^0-9]/g, "");

  return (
    <>
      {/* 1. Top Utility & Emergency Bar (Synchronized with Admin Settings across ALL pages) */}
      {siteSettings.showTopUtilityBar !== false && (
        <div className="hidden lg:block bg-black text-white font-sans text-ink">
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
                  onClick={() => {
                    setSwitcherTab("currency");
                    setSwitcherSearch("");
                    setIsCountryLangOpen(true);
                  }}
                  className="flex items-center gap-1.5 rounded-sm bg-white/15 px-2.5 py-1 text-[0.75rem] font-bold text-white transition-colors hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white cursor-pointer border-0"
                  aria-label={`Selected currency: ${selectedCountry.currencyCode}, language: ${selectedLanguage.name}`}
                  aria-haspopup="dialog"
                  aria-expanded={isCountryLangOpen}
                  data-state={isCountryLangOpen ? "open" : "closed"}
                  data-slot="popover-trigger"
                >
                  <span className="inline-flex items-center shrink-0">
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

      {/* 2. Main Sticky Navigation Header - Reference Two-Tier Structure */}
      <header className="sticky top-0 z-[51] border-b shadow-xs transition-colors duration-300 bg-[#f9fbff] font-sans text-ink">
        {/* Tier 1: Upper Main Navigation Bar */}
        <div className="mx-auto flex min-w-0 max-w-7xl items-center gap-3 px-4 py-1.5 lg:min-h-[64px] lg:gap-6 lg:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-4 lg:gap-8">
            {/* Desktop Brand Logo */}
            <a
              className="lg:flex hidden shrink-0 items-center transition-opacity hover:opacity-95"
              aria-label="Akeezo Healthcare Platform Home"
              href="/"
            >
              <img
                alt="AKEEZO - Heal In India, Heal By Akeezo"
                width={270}
                height={34}
                decoding="async"
                fetchPriority="low"
                className="object-contain lg:w-[273px] max-h-11 w-auto"
                src="/logo/logo with tagline-dark.svg"
              />
            </a>

            {/* Mobile Brand Logo */}
            <a
              className="lg:hidden flex shrink-0 items-center transition-opacity hover:opacity-95"
              aria-label="Akeezo Healthcare Platform Home"
              href="/"
            >
              <img
                alt="AKEEZO - Heal In India, Heal By Akeezo"
                width={159}
                height={34}
                decoding="async"
                fetchPriority="low"
                className="object-contain w-[159px] max-h-9"
                src="/logo/logo with tagline-dark.svg"
              />
            </a>

            {/* Desktop Live Search Bar */}
            <div
              aria-hidden="false"
              className="hidden min-w-0 max-w-xl flex-1 lg:block transition-opacity duration-200 ease-out opacity-100"
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = navSearchQuery.trim();
                  if (q) {
                    window.location.href = `/treatments?q=${encodeURIComponent(q)}`;
                  }
                }}
                className="hidden z-40 md:flex flex-1 w-full max-w-[8000px] relative"
              >
                <div className="relative z-40 flex w-full items-center rounded-full bg-white shadow-[1px_0px_4px_rgba(0,0,0,0.12)] border border-border/60 outline-none focus-within:border-action">
                  <div className="pl-3"></div>
                  <input
                    placeholder="Search treatments, hospitals, doctors…"
                    className="w-full h-[48px] text-md py-3 px-4 bg-transparent border-0 focus:ring-0 outline-none focus:border-0 rounded-full focus:outline-none text-ink placeholder:text-ink-muted/70"
                    autoComplete="off"
                    type="text"
                    value={navSearchQuery}
                    onChange={(e) => setNavSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    aria-label="Submit search"
                    className="bg-brand-orange hover:bg-brand-orange-alt w-[36px] h-[36px] flex items-center justify-center shrink-0 rounded-full mr-1.5 transition-colors cursor-pointer text-white shadow-xs"
                  >
                    <svg
                      className="w-[12px] h-[12px]"
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.2535 8.26993L10.1272 10.1436M9.53528 4.97272C9.53528 6.18279 9.05458 7.34329 8.19894 8.19894C7.34329 9.05458 6.18278 9.53528 4.97272 9.53528C3.76265 9.53528 2.60215 9.05458 1.7465 8.19894C0.890853 7.34329 0.410156 6.18279 0.410156 4.97272C0.410156 3.76265 0.890853 2.60215 1.7465 1.7465C2.60215 0.890853 3.76265 0.410156 4.97272 0.410156C6.18278 0.410156 7.34329 0.890853 8.19894 1.7465C9.05458 2.60215 9.53528 3.76265 9.53528 4.97272Z"
                        stroke="white"
                        strokeWidth="0.821159"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Action Items */}
          <div className="flex min-w-0 shrink items-center gap-3 lg:gap-4">
            {/* Treatment Selector Dropdown Pill */}
            <div className="min-w-0 max-w-[10rem] shrink max-[400px]:max-w-[8.5rem] lg:max-w-[15rem]">
              <div className="w-full relative z-[5] m-1 inline-block">
                <div className="cursor-pointer">
                  <button
                    type="button"
                    onClick={() => setIsExploreOpen(true)}
                    title="Select Treatment"
                    className="relative flex cursor-pointer select-none items-center justify-between rounded-full transition-colors duration-200 bg-white text-action hover:text-action-hover border-[0.5px] h-9 px-4 text-sm gap-2 w-full border-action/40 hover:border-action max-[400px]:h-8 max-[400px]:gap-1 max-[400px]:px-2.5 max-[400px]:text-[13px] shadow-2xs font-semibold"
                  >
                    <span className="flex-1 truncate whitespace-nowrap text-left capitalize">Select Treatment</span>
                    <ChevronDown className="lucide lucide-chevron-down size-4 shrink-0 transition-transform duration-200 text-ink-muted" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>

            {/* 24/7 Desk Helpline for direct phone assistance */}
            <a
              href={`tel:${phoneClean}`}
              title={`Call 24/7 Desk: ${phone}`}
              aria-label={`Call 24/7 Desk: ${phone}`}
              className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-bold text-ink shadow-2xs hover:border-action hover:bg-surface-teal/30 hover:text-action transition-all"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-ink-muted">24/7 Desk:</span>
              <span className="font-bold text-action tracking-tight">{phone}</span>
            </a>

            {/* "Get Free Quote" CTA button */}
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="hidden sm:inline-flex h-[36px] items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-alt px-3.5 text-xs font-bold text-white shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              <Calculator className="size-3.5 mr-1" />
              <span>Get Free Quote</span>
            </button>

            {/* Desktop Language Switcher & Sign In Button */}
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              <button
                type="button"
                aria-label="Change language"
                data-cy="country-lang-switcher-icon"
                onClick={() => {
                  setSwitcherTab("language");
                  setSwitcherSearch("");
                  setIsCountryLangOpen(true);
                }}
                className="shrink-0 transition-opacity hover:opacity-70 cursor-pointer p-1 flex items-center justify-center"
                title={`Change language / currency (${selectedCountry.currencyCode})`}
              >
                {!translateImgError ? (
                  <img
                    alt="Language Switcher"
                    width={24}
                    height={24}
                    src="/v2/translate-icon.png"
                    className="object-contain"
                    onError={() => setTranslateImgError(true)}
                  />
                ) : (
                  <Languages className="size-5 text-ink-muted hover:text-action transition-colors" aria-hidden="true" />
                )}
              </button>
              <span aria-hidden="true" className="h-5 w-px shrink-0 bg-gray-300"></span>
              <div>
                <button
                  type="button"
                  onClick={() => setIsPatientModalOpen(true)}
                  className="group/btn gap-2 whitespace-nowrap rounded-full font-normal transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white ring-1 ring-transparent hover:ring-brand md:px-[21px] px-[16px] py-[8px] md:w-max w-full h-max md:text-[14px] text-[10px] md:!w-[104px] md:!px-2 !h-[36px] flex items-center justify-center cursor-pointer font-semibold shadow-xs"
                >
                  Sign in
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex shrink-0 items-center justify-center lg:hidden p-1.5 text-ink-muted hover:text-ink cursor-pointer"
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.75 6H20.25M3.75 12H20.25M3.75 18H20.25" stroke="#1D1D1D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Tier 2: Sub Navigation Link Bar */}
        <nav className="hidden border-t border-gray-100 lg:block bg-white/70 backdrop-blur-xs">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-1.5 px-6 py-3.5 text-sm">
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="whitespace-nowrap text-[0.95em] font-semibold text-brand-orange hover:text-brand-orange-alt transition-colors cursor-pointer flex items-center gap-1.5 py-0.5"
            >
              <Calculator className="size-3.5 text-brand-orange" />
              <span>Plan my Journey (Calculate Price)</span>
            </button>
            <a className="whitespace-nowrap text-[0.95em] font-medium text-[#1d1d1d] hover:text-action transition-colors py-0.5" href="/doctors">
              Doctors &amp; Specialists
            </a>
            <a className="whitespace-nowrap text-[0.95em] font-medium text-[#1d1d1d] hover:text-action transition-colors py-0.5" href="/hospitals">
              Hospitals
            </a>
            <a className="whitespace-nowrap text-[0.95em] font-medium text-[#8b5cf6] hover:text-[#7c4de8] transition-colors py-0.5" href="/treatments">
              Treatments
            </a>
            <a className="whitespace-nowrap text-[0.95em] font-medium text-[#1d1d1d] hover:text-action transition-colors py-0.5" href="/#destinations">
              Destinations
            </a>
            <a className="whitespace-nowrap text-[0.95em] font-medium text-[#1d1d1d] hover:text-action transition-colors py-0.5" href="/blog">
              Blogs
            </a>
            <a className="whitespace-nowrap text-[0.95em] font-medium text-[#1d1d1d] hover:text-action transition-colors py-0.5" href="/#opinion">
              Community
            </a>
            <a className="whitespace-nowrap text-[0.95em] font-medium text-[#1d1d1d] hover:text-action transition-colors py-0.5" href="/about">
              About Us
            </a>
          </div>
        </nav>

        {/* Google Translate Integration Container */}
        <div id="google_translate_container" aria-hidden="true" className="sr-only">
          <div id="google_translate_element"></div>
        </div>
        <div className="text-left"></div>
      </header>

      {/* Mobile Slide-over Menu Drawer */}
      <div className={isMobileMenuOpen ? "block" : "hidden"} aria-hidden={!isMobileMenuOpen}>
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <a
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Akeezo Healthcare Platform Home"
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <img
                    src="/logo/logo with tagline-dark.svg"
                    alt="AKEEZO"
                    className="h-9 w-auto object-contain"
                  />
                </a>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Mobile Nav Links - Privacy Policy strictly excluded */}
              <nav className="mt-6 flex flex-col gap-3.5 text-sm font-semibold text-ink">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsExploreOpen(true);
                  }}
                  className="flex items-center justify-between py-2 text-left hover:text-action cursor-pointer"
                >
                  <span>Treatments & Specialities</span>
                  <ChevronRight className="size-4 text-ink-muted" />
                </button>
                <a
                  href="/hospitals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 hover:text-action"
                >
                  <span>Accredited Hospitals & Clinics</span>
                  <ChevronRight className="size-4 text-ink-muted" />
                </a>
                <a
                  href="/doctors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 hover:text-action"
                >
                  <span>Board-Certified Specialists</span>
                  <ChevronRight className="size-4 text-ink-muted" />
                </a>
                <a
                  href="/#destinations"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 hover:text-action"
                >
                  <span>Medical Tourism Destinations</span>
                  <ChevronRight className="size-4 text-ink-muted" />
                </a>
                <a
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 hover:text-action"
                >
                  <span>About AKEEZO &amp; Our Team</span>
                  <ChevronRight className="size-4 text-ink-muted" />
                </a>
              </nav>

              <div className="pt-5 mt-4 border-t border-border flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCalculatorOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full inline-flex h-11 items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-alt text-xs font-bold text-white shadow-md shadow-brand-orange/20 transition-all cursor-pointer"
                >
                  <Calculator className="size-4 mr-2" />
                  Calculate Treatment Price
                </button>
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex h-11 items-center justify-center rounded-full bg-action text-xs font-bold text-white shadow-sm hover:bg-action-hover"
                >
                  <PhoneCall className="size-4 mr-2" />
                  WhatsApp 24/7 Desk
                </a>
              </div>
            </div>

            <div className="pt-6 border-t border-border text-xs text-ink-muted flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span>Currency:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSwitcherTab("currency");
                    setSwitcherSearch("");
                    setIsMobileMenuOpen(false);
                    setIsCountryLangOpen(true);
                  }}
                  className="font-bold text-action underline cursor-pointer"
                >
                  {selectedCountry.currencyCode} ({selectedCountry.currencySymbol})
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Language:</span>
                <button
                  type="button"
                  onClick={() => {
                    setSwitcherTab("language");
                    setSwitcherSearch("");
                    setIsMobileMenuOpen(false);
                    setIsCountryLangOpen(true);
                  }}
                  className="font-bold text-action underline cursor-pointer flex items-center gap-1.5"
                >
                  <img
                    alt="Language Switcher"
                    width={16}
                    height={16}
                    src="/v2/translate-icon.png"
                    className="object-contain inline-block"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                  <span>{selectedLanguage.name} ({selectedLanguage.local})</span>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Helpline:</span>
                <a href={`tel:${phoneClean}`} className="font-bold text-ink hover:text-action">
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Treatment Selector / Explore Modal */}
      {isExploreOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-ink">Explore Medical Specialities in India</h3>
                <p className="text-xs text-ink-muted mt-1">Select a department to view accredited procedures and specialists</p>
              </div>
              <button
                type="button"
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

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/treatments"
                  onClick={() => setIsExploreOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-action hover:text-action-hover"
                >
                  <span>View All 22+ Medical Treatments & Specialities</span>
                  <ChevronRight className="size-3.5" />
                </a>
                <span className="text-border hidden sm:inline">|</span>
                <a
                  href="/hospitals"
                  onClick={() => setIsExploreOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-action hover:text-action-hover"
                >
                  <span>Explore World's Top Hospitals</span>
                  <ChevronRight className="size-3.5" />
                </a>
              </div>
              <button
                type="button"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans">
          <div className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[20px] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-action-accent" />
                <h3 className="text-xl font-bold text-ink">Personalized Procedure Estimate</h3>
              </div>
              <button
                type="button"
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
                  className="flex-1 inline-flex h-11 items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-alt px-6 text-xs font-bold text-white shadow-md shadow-brand-orange/20 cursor-pointer"
                >
                  Request Itemized Quote on WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setIsCalculatorOpen(false)}
                  className="rounded-full bg-surface-muted px-6 py-2.5 text-xs font-bold text-ink hover:bg-border cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Direct Web Quote Submission with Feedback */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!quoteContact.trim()) {
                    setQuoteError("Please enter your phone number or email for care coordination.");
                    return;
                  }
                  setQuoteError("");
                  setQuoteSubmitted(true);
                }}
                className="mt-4 pt-4 border-t border-border space-y-3"
              >
                <div className="text-xs font-bold text-ink">Or Submit Direct Clinical Inquiry to Care Team:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    placeholder="Patient Name (Optional)"
                    className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs text-ink focus:outline-none focus:border-action"
                  />
                  <input
                    type="text"
                    value={quoteContact}
                    onChange={(e) => {
                      setQuoteContact(e.target.value);
                      if (quoteError) setQuoteError("");
                    }}
                    placeholder="Phone or Email *"
                    className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs text-ink focus:outline-none focus:border-action"
                  />
                </div>
                {quoteError && (
                  <div role="alert" className="text-xs font-bold text-emergency">
                    ⚠️ {quoteError}
                  </div>
                )}
                {quoteSubmitted ? (
                  <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                    ✓ Inquiry submitted! An Akeezo Care Coordinator has received your ${calcSpecialty} request and will contact you within 24 hours.
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full inline-flex h-10 items-center justify-center rounded-full bg-brand-orange hover:bg-brand-orange-alt text-xs font-bold text-white shadow-md shadow-brand-orange/20 cursor-pointer"
                  >
                    Submit Direct Free Quote Request
                  </button>
                )}
              </form>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans"
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
                        applyLanguageTranslation(l.code);
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans"
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

              {patientError && (
                <div role="alert" className="text-xs font-bold text-emergency">
                  ⚠️ {patientError}
                </div>
              )}
              <div className="pt-2 flex flex-col gap-2">
                <a
                  href={patientLookupId.trim() ? `https://wa.me/${phoneClean}?text=${encodeURIComponent(
                    `Hello Akeezo Patient Desk, I would like to track my medical case: ${patientLookupId}`
                  )}` : "#"}
                  onClick={(e) => {
                    if (!patientLookupId.trim()) {
                      e.preventDefault();
                      setPatientError("Please enter your Case ID, Passport or WhatsApp number to track.");
                    } else {
                      setPatientError("");
                    }
                  }}
                  target={patientLookupId.trim() ? "_blank" : "_self"}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans"
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

              {/* Partner Empanelment Application Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!partnerContact.trim()) {
                    setPartnerError("Please provide your contact number or email.");
                    return;
                  }
                  setPartnerError("");
                  setPartnerSubmitted(true);
                }}
                className="space-y-3 pt-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={partnerOrg}
                    onChange={(e) => setPartnerOrg(e.target.value)}
                    placeholder="Hospital / Agency Name"
                    className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs text-ink focus:outline-none focus:border-action"
                  />
                  <input
                    type="text"
                    value={partnerContact}
                    onChange={(e) => {
                      setPartnerContact(e.target.value);
                      if (partnerError) setPartnerError("");
                    }}
                    placeholder="Representative Phone / Email *"
                    className="w-full rounded-xl border border-border bg-surface-muted px-3 py-2 text-xs text-ink focus:outline-none focus:border-action"
                  />
                </div>
                {partnerError && (
                  <div role="alert" className="text-xs font-bold text-emergency">
                    ⚠️ {partnerError}
                  </div>
                )}
                {partnerSubmitted ? (
                  <div role="status" className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
                    ✓ Empanelment application submitted! Our Institutional Relations Director will connect within 1 business day.
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full inline-flex h-10 items-center justify-center rounded-full bg-action hover:bg-action-hover text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Submit Partner Registration
                  </button>
                )}
              </form>

              <div className="pt-2 flex flex-col gap-2.5">
                <a
                  href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                    partnerType === "hospital"
                      ? "Hello Akeezo Partnership Team, I represent a hospital interested in listing on the Akeezo healthcare platform."
                      : "Hello Akeezo Partnership Team, I am a medical travel agent interested in partner empanelment."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex h-11 items-center justify-center rounded-full bg-surface-muted px-6 text-xs font-bold text-ink hover:bg-border cursor-pointer text-center"
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
    </>
  );
};
