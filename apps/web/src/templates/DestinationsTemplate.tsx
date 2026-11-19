import { useState, useMemo } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  Search,
  Building2,
  Plane,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  HeartHandshake,
  DollarSign
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  ALL_DESTINATIONS,
  DESTINATION_REGIONS,
  type DestinationCardItem
} from "../data/destinationsData.js";

export interface DestinationsTemplateProps {
  data: PublicRouteResponseDTO;
}

export function DestinationsTemplate({ data }: DestinationsTemplateProps) {
  const payload = (data.payload as any) || {};

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("All Destinations");
  const [destinationTypeFilter, setDestinationTypeFilter] = useState<"all" | "countries" | "cities">("all");
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0, 1]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Filter destinations based on search query, region, and type
  const filteredDestinations = useMemo(() => {
    let list: DestinationCardItem[] = ALL_DESTINATIONS;

    if (selectedRegion !== "All Destinations") {
      list = list.filter((item) => item.region === selectedRegion);
    }

    if (destinationTypeFilter === "countries") {
      list = list.filter((item) => item.type === "country");
    } else if (destinationTypeFilter === "cities") {
      list = list.filter((item) => item.type === "city");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q) ||
          item.cityHighlights.toLowerCase().includes(q) ||
          item.tagline.toLowerCase().includes(q) ||
          item.popularProcedures.some((p) => p.toLowerCase().includes(q))
      );
    }

    return list;
  }, [searchQuery, selectedRegion, destinationTypeFilter]);

  const featuredDestinations = useMemo(() => {
    return ALL_DESTINATIONS.filter((d) => d.featured);
  }, []);

  const headline = payload.headline || "Premier Medical Tourism Destinations";
  const subheadline =
    payload.subheadline ||
    "Discover world-class accredited hospitals, board-certified surgeons, and up to 85% cost savings across premier healthcare destinations.";

  // FAQs data
  const destinationFaqs = [
    {
      q: "How do I choose the best medical tourism destination for my treatment?",
      a: "The ideal destination depends on your medical specialty, budget, travel distance, and visa regulations. India is globally renowned for quaternary surgeries like heart bypass, CyberKnife oncology, and organ transplants with 80-90% savings. Mexico is favored by North Americans for bariatric and dental surgery due to driving proximity. Thailand and Turkey lead in aesthetic surgery, dental makeovers, and health wellness."
    },
    {
      q: "Are hospitals in these destinations internationally accredited?",
      a: "Yes. AKEEZO only partners with medical facilities accredited by Joint Commission International (JCI USA), National Accreditation Board for Hospitals & Healthcare Providers (NABH), or official national health councils with rigorous sterile, patient safety, and clinical outcome standards."
    },
    {
      q: "How does AKEEZO assist with medical visas and travel logistics?",
      a: "AKEEZO coordinates directly with treating hospitals to issue official Medical Visa Invitation Letters within 24 to 48 hours. Our care team assists with flight arrangements, complimentary VIP airport ambulance/car pickups, companion hotel bookings, and continuous on-ground care navigation."
    },
    {
      q: "Can I get an accurate cost estimate before traveling?",
      a: "Yes. By submitting your diagnostic scans and doctor reports to AKEEZO, our medical directors obtain itemized treatment quotes from 3 to 5 accredited hospitals at zero markup, guaranteeing transparent pricing before you book flights."
    }
  ];

  // Schema markup
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: headline,
    description: subheadline,
    url: "https://akeezo.com/destinations",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ALL_DESTINATIONS.slice(0, 10).map((d, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: d.name,
        url: `https://akeezo.com/destinations/${d.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-surface-muted font-sans text-ink flex flex-col">
      <SiteHeader siteSettings={data.siteSettings} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-surface-teal/30 via-white to-surface-muted pt-10 pb-14 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-ink-muted mb-6">
              <a href="/" className="hover:text-action transition-colors">Home</a>
              <span>/</span>
              <span className="text-ink font-semibold">Destinations</span>
            </nav>

            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-surface-teal border border-border-teal px-3 py-1 text-xs font-bold text-action mb-4 shadow-2xs">
                <Sparkles className="size-3.5" />
                <span>Heal in India &amp; Worldwide Hubs</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight leading-tight mb-4">
                {headline}
              </h1>
              <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                {subheadline}
              </p>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div className="mt-8 rounded-2xl bg-white p-4 sm:p-5 shadow-lg border border-border">
              <div className="flex flex-col md:flex-row items-stretch gap-3">
                {/* Search input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-ink-muted" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search destination, city, country, or procedure (e.g., India, Mexico, CyberKnife, Bariatric)..."
                    className="w-full rounded-xl border border-border bg-surface-muted py-2.5 pl-10 pr-4 text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:border-action focus:outline-none focus:bg-white transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-muted hover:text-ink cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Country vs City Pill Switcher */}
                <div className="inline-flex rounded-xl bg-surface-muted p-1 border border-border text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setDestinationTypeFilter("all")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      destinationTypeFilter === "all"
                        ? "bg-action text-white shadow-xs"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    All ({ALL_DESTINATIONS.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDestinationTypeFilter("countries")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      destinationTypeFilter === "countries"
                        ? "bg-action text-white shadow-xs"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    Countries
                  </button>
                  <button
                    type="button"
                    onClick={() => setDestinationTypeFilter("cities")}
                    className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                      destinationTypeFilter === "cities"
                        ? "bg-action text-white shadow-xs"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    India Hubs (Cities)
                  </button>
                </div>
              </div>

              {/* Regional filter pills */}
              <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-border/60">
                <span className="text-xs font-semibold text-ink-muted self-center mr-1">Region:</span>
                {DESTINATION_REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      selectedRegion === region
                        ? "bg-action text-white shadow-xs"
                        : "bg-surface-muted text-ink-muted hover:bg-surface-teal/50 hover:text-action border border-border/80"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED DESTINATIONS CAROUSEL */}
        <section className="py-12 bg-white border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                  Top Medical Hubs
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                  Featured Healthcare Destinations
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-ink-muted max-w-md">
                Verified international healthcare corridors with premier JCI hospital accreditations and proven patient safety records.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDestinations.slice(0, 4).map((dest) => (
                <a
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm hover:shadow-xl hover:border-action transition-all cursor-pointer"
                >
                  {/* Card Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-surface-muted">
                    <img
                      src={dest.image || "/images/destination-placeholder.svg"}
                      alt={dest.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        target.src = "/images/destination-placeholder.svg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-ink shadow-sm">
                      <span className="text-base">{dest.flag}</span>
                      <span>{dest.country}</span>
                    </div>
                    <div className="absolute top-3 right-3 rounded-full bg-emerald-600 text-white px-2.5 py-0.5 text-xs font-extrabold shadow-sm">
                      Save up to {dest.savingsPercentage}%
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-bold leading-tight drop-shadow-xs">
                        {dest.name}
                      </h3>
                      <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                        {dest.cityHighlights}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-xs text-ink-muted">
                        <span className="flex items-center gap-1">
                          <Building2 className="size-3.5 text-action" />
                          <strong>{dest.hospitalCount}+</strong> Accredited Centers
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5 text-action" />
                          {dest.visaProcessingDays.split(" ")[0]} {dest.visaProcessingDays.split(" ")[1] || "Days"}
                        </span>
                      </div>
                      <div className="text-xs text-ink-muted flex items-start gap-1">
                        <Plane className="size-3.5 text-action shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{dest.flightConnectivity}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-action group-hover:text-action-hover">
                      <span>Explore Clinics &amp; Costs</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* HEAL IN INDIA COORDINATION BANNER */}
        <section className="py-10 bg-gradient-to-r from-emerald-800 via-teal-900 to-cyan-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl text-center lg:text-left">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  <span>Heal In India with AKEEZO</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Zero-Markup Hospital Billing &amp; Guaranteed Fast-Track Visas
                </h2>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                  Connecting international patients directly to 45+ premier JCI &amp; NABH quaternary hospitals across Delhi, Mumbai, Chennai, and Bengaluru with complete bedside care navigation.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/#opinion"
                  className="rounded-full bg-white text-emerald-900 hover:bg-white/90 px-6 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Free Secondary Opinion
                </a>
                <a
                  href="/cost-calculator"
                  className="rounded-full border border-white/30 bg-white/10 hover:bg-white/20 px-6 py-2.5 text-xs font-bold text-white transition-all cursor-pointer"
                >
                  Compare Costs
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ALL DESTINATIONS DIRECTORY GRID */}
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
              <div>
                <h2 className="text-2xl font-extrabold text-ink">
                  All Healthcare Destinations ({filteredDestinations.length})
                </h2>
                <p className="text-xs text-ink-muted mt-1">
                  Browse by country or Indian healthcare hub city
                </p>
              </div>
              <div className="text-xs text-ink-muted">
                Showing <strong className="text-ink">{filteredDestinations.length}</strong> hubs
              </div>
            </div>

            {filteredDestinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDestinations.map((dest) => (
                  <a
                    key={dest.id}
                    href={`/destinations/${dest.slug}`}
                    className="group rounded-2xl border border-border bg-white p-5 hover:border-action hover:shadow-md transition-all flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{dest.flag}</span>
                          <div>
                            <h3 className="text-base font-bold text-ink group-hover:text-action transition-colors">
                              {dest.name}
                            </h3>
                            <span className="text-[11px] font-semibold text-action uppercase tracking-wider">
                              {dest.type === "city" ? "India Medical Hub" : dest.region}
                            </span>
                          </div>
                        </div>
                        <span className="rounded-full bg-surface-teal border border-border-teal px-2.5 py-0.5 text-xs font-extrabold text-action">
                          Save ~{dest.savingsPercentage}%
                        </span>
                      </div>

                      {/* Tagline */}
                      <p className="text-xs text-ink-muted mb-4 line-clamp-2 leading-relaxed">
                        {dest.tagline}
                      </p>

                      {/* Popular Procedures Chips */}
                      <div className="mb-4">
                        <span className="text-[11px] font-bold text-ink mb-1.5 block">Popular Treatments:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {dest.popularProcedures.map((proc, idx) => (
                            <span
                              key={idx}
                              className="rounded-md bg-surface-muted px-2 py-0.5 text-[11px] text-ink-muted font-medium border border-border/60"
                            >
                              {proc}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key stats row */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-muted bg-surface-muted/60 rounded-xl p-2.5 border border-border/50 mb-4">
                        <div className="flex items-center gap-1.5 truncate">
                          <Building2 className="size-3.5 text-action shrink-0" />
                          <span>{dest.hospitalCount}+ Hospitals</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <Clock className="size-3.5 text-action shrink-0" />
                          <span>{dest.visaProcessingDays.split("(")[0]}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-bold text-action group-hover:text-action-hover">
                      <span>View Clinics, Doctors &amp; Costs</span>
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
                <Search className="size-8 text-ink-muted mx-auto mb-3" />
                <h3 className="text-base font-bold text-ink">No destinations matched your criteria</h3>
                <p className="text-xs text-ink-muted mt-1 max-w-sm mx-auto">
                  Try adjusting your search query or selecting "All Destinations" from the filter tabs above.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedRegion("All Destinations");
                    setDestinationTypeFilter("all");
                  }}
                  className="mt-4 rounded-full bg-action px-4 py-1.5 text-xs font-bold text-white hover:bg-action-hover cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* TRUST BANNER: WHY MEDICAL TOURISM WITH AKEEZO */}
        <section className="py-12 bg-white border-t border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                Patient Protection &amp; Surety
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Why Coordinate Your Medical Journey with AKEEZO?
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-2">
                We advocate for you at every stage — from hospital selection and quote negotiation to bedside arrival and recovery.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl border border-border p-6 bg-surface-muted/40 hover:bg-surface-teal/20 transition-colors">
                <div className="size-10 rounded-xl bg-surface-teal text-action flex items-center justify-center mb-4">
                  <DollarSign className="size-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-1.5">Zero-Markup Pricing Guarantee</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  You pay the hospital directly. We guarantee you receive official institutional rate cards without broker markups or hidden service commissions.
                </p>
              </div>

              <div className="rounded-2xl border border-border p-6 bg-surface-muted/40 hover:bg-surface-teal/20 transition-colors">
                <div className="size-10 rounded-xl bg-surface-teal text-action flex items-center justify-center mb-4">
                  <ShieldCheck className="size-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-1.5">Strict JCI &amp; NABH Clinical Audits</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Every listed hospital undergoes verification of its operating theater sterilization, ICU ratios, physician credentials, and international patient care protocols.
                </p>
              </div>

              <div className="rounded-2xl border border-border p-6 bg-surface-muted/40 hover:bg-surface-teal/20 transition-colors">
                <div className="size-10 rounded-xl bg-surface-teal text-action flex items-center justify-center mb-4">
                  <HeartHandshake className="size-5" />
                </div>
                <h3 className="text-base font-bold text-ink mb-1.5">Dedicated Personal Care Navigator</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Your dedicated coordinator manages appointments, fast-tracks medical visas, arranges airport transfers, and supports your companion throughout your stay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQS SECTION */}
        <section className="py-14 bg-surface-muted">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink mt-1">
                Medical Travel Destinations FAQ
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted mt-2">
                Frequently asked questions about choosing a medical tourism destination and coordinating travel.
              </p>
            </div>

            <div className="space-y-3">
              {destinationFaqs.map((faq, idx) => {
                const isOpen = openFaqIndices.includes(idx);
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-border bg-white overflow-hidden shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-ink hover:text-action transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`size-4 text-ink-muted transition-transform duration-200 shrink-0 ml-2 ${
                          isOpen ? "rotate-180 text-action" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-ink-muted leading-relaxed border-t border-border/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-12 bg-white border-t border-border">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="rounded-3xl bg-gradient-to-b from-surface-teal/50 to-surface-teal border border-border-teal/60 p-8 sm:p-10 shadow-sm">
              <h2 className="text-2xl sm:text-3xl font-black text-ink mb-3">
                Unsure Which Destination Is Right for Your Surgery?
              </h2>
              <p className="text-xs sm:text-sm text-ink-muted max-w-xl mx-auto mb-6 leading-relaxed">
                Send us your medical report for a free clinical assessment. Our medical team will review your case and provide transparent hospital and cost comparisons across top destinations.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="/contact"
                  className="rounded-full bg-action hover:bg-action-hover text-white px-7 py-3 text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
                >
                  Contact Our Medical Advisors
                </a>
                <a
                  href="/cost-calculator"
                  className="rounded-full bg-white hover:bg-surface-muted text-ink px-6 py-3 text-xs sm:text-sm font-bold border border-border transition-all cursor-pointer"
                >
                  Calculate Procedure Cost
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter siteSettings={data.siteSettings} />
    </div>
  );
}
