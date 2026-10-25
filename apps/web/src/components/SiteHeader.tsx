import React, { useState } from "react";
import type { SiteSettings } from "@akeezo/contracts";
import {
  Search,
  X,
  ChevronDown,
  ChevronRight,
  Calculator,
  Menu,
  Check,
  PhoneCall
} from "lucide-react";
import {
  COUNTRIES,
  LANGUAGES,
  SPECIALTIES,
  formatEstimate,
  type CountryOption
} from "./navigationData.js";

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

  // Regional Currency & Language Switcher State
  const [selectedCountry, setSelectedCountry] = useState<CountryOption>(COUNTRIES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [isCountryLangOpen, setIsCountryLangOpen] = useState(false);
  const [switcherTab, setSwitcherTab] = useState<"currency" | "language">("currency");
  const [switcherSearch, setSwitcherSearch] = useState("");

  // Interactive Modals (controlled or internal)
  const [internalCalculatorOpen, setInternalCalculatorOpen] = useState(false);
  const [internalExploreOpen, setInternalExploreOpen] = useState(false);

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

  return (
    <>
      <header className="sticky top-0 z-50 h-18 sm:h-20 border-b border-border/80 bg-white/95 backdrop-blur-md transition-shadow shadow-2xs font-sans text-ink">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-7 lg:gap-9">
            {/* Full Size Official Brand Logo */}
            <a href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-95 py-1">
              <img
                src="/logo/logo with tagline-dark.svg"
                alt="AKEEZO - Heal In India, Heal By Akeezo"
                width={190}
                height={60}
                className="h-10 sm:h-12 w-auto max-w-[170px] sm:max-w-[210px] md:max-w-[230px] object-contain"
              />
            </a>

            {/* Desktop Navigation - Privacy Policy / Compliance strictly removed */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[13.5px] font-semibold text-ink-muted">
              <button
                type="button"
                onClick={() => setIsExploreOpen(true)}
                className="flex items-center gap-1 transition-colors hover:text-action cursor-pointer py-1"
              >
                <span>Treatments</span>
                <ChevronDown className="size-3.5 text-ink-muted/80" />
              </button>
              <a href="/#hospitals" className="transition-colors hover:text-action py-1">
                Hospitals
              </a>
              <a href="/#doctors" className="transition-colors hover:text-action py-1">
                Specialists
              </a>
              <a href="/#destinations" className="transition-colors hover:text-action py-1">
                Destinations
              </a>
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(true)}
                className="flex items-center gap-1 transition-colors text-action hover:text-action-hover cursor-pointer py-1 font-bold"
              >
                <Calculator className="size-3.5 text-brand-orange" />
                <span>Calculate Price</span>
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Regional Country / Currency / Language Switcher Button */}
            <button
              type="button"
              data-cy="country-lang-switcher"
              data-testid="country-lang-switcher"
              onClick={() => setIsCountryLangOpen(true)}
              className="flex items-center gap-1.5 rounded-sm bg-surface-muted px-2.5 py-1 text-[0.75rem] font-bold text-ink border border-border transition-colors hover:bg-surface-teal/50 hover:text-action hover:border-action focus-visible:outline-2 focus-visible:outline-action cursor-pointer shadow-2xs"
              aria-label={`Selected currency: ${selectedCountry.currencyCode}, language: ${selectedLanguage.name}`}
              aria-haspopup="dialog"
              aria-expanded={isCountryLangOpen}
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
              <span className="text-ink-muted/60">|</span>
              <span className="font-medium text-ink-muted">{selectedLanguage.name}</span>
              <ChevronDown
                className={`size-3 text-ink-muted/80 transition-transform duration-200 ${isCountryLangOpen ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>

            {/* Live WhatsApp / Phone Helpline with Active Pulse */}
            <a
              href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo%20Care%20Desk`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Contact Akeezo 24/7 care helpline on WhatsApp: ${phone}`}
              className="hidden md:inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 sm:px-3.5 py-1.5 text-xs font-bold text-ink shadow-2xs transition-all hover:border-action hover:bg-surface-teal/30 hover:text-action focus-visible:outline-2 focus-visible:outline-action"
            >
              <span className="relative flex size-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-semibold text-ink-muted">24/7 Desk:</span>
              <span className="font-bold text-action tracking-tight">{phone}</span>
            </a>

            {/* Primary Care Quote CTA with Cost Estimation */}
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="inline-flex h-9 sm:h-10 items-center justify-center rounded-full bg-action px-3.5 sm:px-5 text-xs sm:text-[13px] font-bold text-white shadow-sm transition-all hover:bg-action-hover focus-visible:outline-2 focus-visible:outline-action cursor-pointer shrink-0"
            >
              <Calculator className="size-3.5 sm:size-4 mr-1.5 hidden sm:inline-block" />
              <span>Get Free Quote</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex lg:hidden p-2 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-over Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <img
                  src="/logo/logo with tagline-dark.svg"
                  alt="AKEEZO"
                  className="h-9 w-auto object-contain"
                />
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
                  href="/#hospitals"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 hover:text-action"
                >
                  <span>Accredited Hospitals & Clinics</span>
                  <ChevronRight className="size-4 text-ink-muted" />
                </a>
                <a
                  href="/#doctors"
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
              </nav>

              <div className="pt-5 mt-4 border-t border-border flex flex-col gap-3">
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
                    setIsMobileMenuOpen(false);
                    setIsCountryLangOpen(true);
                  }}
                  className="font-bold text-action underline cursor-pointer"
                >
                  {selectedCountry.currencyCode} ({selectedCountry.currencySymbol})
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span>Helpline:</span>
                <a href={`tel:${phoneClean}`} className="font-bold text-ink">
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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

            <div className="mt-6 flex justify-end">
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
                  className="flex-1 inline-flex h-11 items-center justify-center rounded-full bg-action px-6 text-xs font-bold text-white shadow-sm hover:bg-action-hover cursor-pointer"
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
    </>
  );
};
