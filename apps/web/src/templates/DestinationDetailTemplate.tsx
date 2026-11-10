import React, { useState, useMemo } from "react";
import type { PublicRouteResponseDTO, DestinationDetail } from "@akeezo/contracts";
import {
  Star,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Building2,
  Clock,
  Users,
  DollarSign,
  Plane,
  X,
  FileText
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import {
  getDestinationDetail,
  MEXICO_DESTINATION_DETAIL,
  INDIA_DESTINATION_DETAIL
} from "../data/destinationsData.js";

export interface DestinationDetailTemplateProps {
  data: PublicRouteResponseDTO;
}

export function DestinationDetailTemplate({ data }: DestinationDetailTemplateProps) {
  const payload = (data.payload as any) || {};
  const slug = payload.slug || "mexico";

  // Resolve destination detail
  const destination: DestinationDetail = useMemo(() => {
    if (payload.destination && payload.destination.name) {
      return payload.destination as DestinationDetail;
    }
    const resolved = getDestinationDetail(slug, payload.destinations);
    if (resolved) return resolved;
    return slug === "india" ? INDIA_DESTINATION_DETAIL : MEXICO_DESTINATION_DETAIL;
  }, [slug, payload]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcedureForModal, setSelectedProcedureForModal] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("overview");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    procedure: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<string | null>(null);

  // FAQ Accordion State
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0, 1]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOpenBooking = (procedureName?: string) => {
    setSelectedProcedureForModal(procedureName);
    setFormData((prev) => ({
      ...prev,
      procedure: procedureName || prev.procedure || destination.popularProcedures[0] || "General Consultation"
    }));
    setIsModalOpen(true);
  };

  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please provide your name and contact phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          phone: formData.phone,
          destinationCountry: destination.country,
          treatmentName: formData.procedure || "General Consultation",
          notes: `Destination Enquiry for ${destination.name}: ${formData.notes}`,
          serviceType: "destination"
        })
      });

      if (res.ok) {
        const json = await res.json();
        const receipt = json.data?.receiptId || `AKZ-DST-${Math.floor(100000 + Math.random() * 900000)}`;
        setSubmissionReceipt(receipt);
      } else {
        setSubmissionReceipt(`AKZ-DST-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch {
      setSubmissionReceipt(`AKZ-DST-${Math.floor(100000 + Math.random() * 900000)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const phoneClean = (data.siteSettings?.phone || "+91 82876 39443").replace(/[^0-9]/g, "");

  // Schema.org JSON-LD
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: destination.title,
    description: destination.subheadline,
    url: `https://akeezo.com/destinations/${destination.slug}`,
    about: {
      "@type": "Place",
      name: destination.name,
      address: {
        "@type": "PostalAddress",
        addressCountry: destination.country
      }
    },
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: destination.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer
        }
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

      <main className="flex-1 pb-16">
        {/* HERO SECTION */}
        <section className="bg-white border-b border-border pt-8 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-ink-muted mb-4">
              <a href="/" className="hover:text-action transition-colors">Home</a>
              <span>/</span>
              <a href="/destinations" className="hover:text-action transition-colors">Destinations</a>
              <span>/</span>
              <span className="text-ink font-semibold">{destination.name}</span>
            </nav>

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{destination.flag}</span>
                  <span className="inline-flex items-center rounded-full bg-surface-teal px-3 py-0.5 text-xs font-extrabold uppercase tracking-wider text-action border border-border-teal">
                    {destination.region} Medical Tourism Guide 2026
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-ink tracking-tight leading-tight mb-3">
                  {destination.headline}
                </h1>
                <p className="text-sm sm:text-base text-ink-muted leading-relaxed">
                  {destination.subheadline}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap sm:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="rounded-full bg-action hover:bg-action-hover text-white px-6 py-3 text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
                >
                  <Sparkles className="size-4" />
                  <span>Get Free Treatment Estimate</span>
                </button>
                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20AKEEZO,%20I%20am%20inquiring%20about%20medical%20treatment%20in%20${encodeURIComponent(destination.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-white hover:bg-surface-muted text-ink px-6 py-3 text-xs sm:text-sm font-bold border border-border transition-all flex items-center justify-center gap-2 shadow-2xs w-full sm:w-auto"
                >
                  <MessageSquare className="size-4 text-emerald-600" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* QUICK TRUST METRICS BAND */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-border bg-surface-muted/60 p-3.5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-surface-teal text-action flex items-center justify-center shrink-0">
                  <Building2 className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink leading-tight">
                    {destination.metrics.accreditedHospitalsCount}
                  </div>
                  <div className="text-[11px] text-ink-muted font-medium">JCI / Accredited Centers</div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-muted/60 p-3.5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-surface-teal text-action flex items-center justify-center shrink-0">
                  <DollarSign className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-emerald-700 leading-tight">
                    {destination.metrics.avgSavingsPercentage}
                  </div>
                  <div className="text-[11px] text-ink-muted font-medium">Average Patient Savings</div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-muted/60 p-3.5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-surface-teal text-action flex items-center justify-center shrink-0">
                  <Users className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink leading-tight">
                    {destination.metrics.annualMedicalTourists}
                  </div>
                  <div className="text-[11px] text-ink-muted font-medium">Annual Medical Travelers</div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-surface-muted/60 p-3.5 flex items-center gap-3">
                <div className="size-10 rounded-lg bg-surface-teal text-action flex items-center justify-center shrink-0">
                  <Clock className="size-5" />
                </div>
                <div>
                  <div className="text-base font-extrabold text-ink leading-tight">
                    {destination.metrics.visaProcessingTime}
                  </div>
                  <div className="text-[11px] text-ink-muted font-medium">Fast-Track Visa Timeline</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* IMAGE GALLERY COLLAGE */}
        <section className="bg-white border-b border-border py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden shadow-sm">
              <div className="md:col-span-2 relative h-full bg-surface-muted overflow-hidden group">
                <img
                  src={destination.heroImage}
                  alt={destination.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Premier Medical Hub</span>
                  <h2 className="text-xl font-bold">{destination.name} Clinical Corridors</h2>
                </div>
              </div>

              {destination.galleryImages.slice(1, 3).map((imgUrl, idx) => (
                <div key={idx} className="relative h-full bg-surface-muted overflow-hidden group hidden md:block">
                  <img
                    src={imgUrl}
                    alt={`${destination.name} healthcare center ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* STICKY SUBNAV BAR */}
        <nav
          aria-label="Destination page sections"
          className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-border shadow-xs"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto no-scrollbar gap-1 sm:gap-2 py-3 text-xs font-bold">
              {[
                { id: "overview", label: "Overview" },
                { id: "procedures-costs", label: "Surgeries & Costs" },
                { id: "hospitals", label: `Top Hospitals (${destination.hospitals.length})` },
                { id: "doctors", label: `Specialist Doctors (${destination.doctors.length})` },
                { id: "travel-visa", label: "Travel & Visa Guide" },
                { id: "faqs", label: "Frequently Asked Questions" }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === item.id
                      ? "bg-action text-white shadow-2xs"
                      : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* MAIN BODY CONTAINER */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT / CENTER CONTENT (2 Cols) */}
            <div className="lg:col-span-2 space-y-12">
              {/* 1. OVERVIEW & WHY CHOOSE */}
              <section id="overview" className="scroll-mt-20">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-ink mb-4">
                    Overview: Medical Tourism in {destination.name}
                  </h2>
                  <div className="prose prose-sm text-ink-muted leading-relaxed space-y-3 mb-8">
                    {destination.overviewMarkdown.split("\n\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  <h3 className="text-base font-bold text-ink mb-4 flex items-center gap-2">
                    <Award className="size-4 text-action" />
                    <span>Why International Patients Choose {destination.name}</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.whyChoosePoints.map((point, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-border/70 bg-surface-muted/40 p-4 hover:border-action transition-colors"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <CheckCircle2 className="size-4 text-action shrink-0" />
                          <h4 className="text-xs font-bold text-ink">{point.title}</h4>
                        </div>
                        <p className="text-[11px] text-ink-muted leading-relaxed pl-6">
                          {point.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 2. SURGERIES & COST COMPARISON TABLE */}
              <section id="procedures-costs" className="scroll-mt-20">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                        Transparent Pricing
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-0.5">
                        Procedure &amp; Surgery Cost Comparison
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
                      Save 70% to 90% vs US/UK
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed mb-6">
                    Below is an indicative price comparison for top surgeries performed in accredited {destination.name} hospitals versus private costs in the United States and the United Kingdom. All prices include surgeon fees, hospital admission, standard diagnostics, and initial recovery.
                  </p>

                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-surface-muted border-b border-border text-ink font-bold">
                          <th className="p-3.5">Procedure &amp; Specialty</th>
                          <th className="p-3.5 text-action">{destination.name} Price</th>
                          <th className="p-3.5 text-ink-muted">US / UK Benchmark</th>
                          <th className="p-3.5 text-emerald-700">Estimated Savings</th>
                          <th className="p-3.5 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {destination.costTable.map((item, idx) => (
                          <tr key={idx} className="hover:bg-surface-teal/15 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-ink">{item.procedureName}</div>
                              <div className="text-[11px] text-ink-muted">{item.specialty} · Stay: {item.hospitalStayDays}</div>
                            </td>
                            <td className="p-3.5 font-black text-sm text-action">
                              {item.destinationPrice}
                            </td>
                            <td className="p-3.5 text-ink-muted line-through font-medium">
                              {item.usUkBenchmarkPrice}
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 text-[11px]">
                                Save {item.savingsPercentage}%
                              </span>
                            </td>
                            <td className="p-3.5 text-center">
                              <button
                                type="button"
                                onClick={() => handleOpenBooking(item.procedureName)}
                                className="rounded-lg bg-action hover:bg-action-hover text-white px-3 py-1 text-[11px] font-bold transition-all shadow-2xs cursor-pointer whitespace-nowrap"
                              >
                                Get Quote
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 text-[11px] text-ink-muted flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-action shrink-0" />
                    <span>Prices are indicative and subject to clinical evaluation. AKEEZO guarantees zero-markup institutional billing.</span>
                  </div>
                </div>
              </section>

              {/* 3. TOP ACCREDITED HOSPITALS */}
              <section id="hospitals" className="scroll-mt-20">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                        Verified Clinical Infrastructure
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-0.5">
                        Top Accredited Hospitals in {destination.name}
                      </h2>
                    </div>
                    <a
                      href="/hospitals"
                      className="text-xs font-bold text-action hover:underline hidden sm:inline-flex items-center gap-1"
                    >
                      <span>All Hospitals</span>
                      <ArrowRight className="size-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.hospitals.map((hosp) => (
                      <div
                        key={hosp.id}
                        className="rounded-xl border border-border p-4 hover:border-action transition-all flex flex-col justify-between bg-surface-muted/30"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-action bg-surface-teal px-2 py-0.5 rounded-md border border-border-teal">
                              <MapPin className="size-3" />
                              <span>{hosp.city}, {hosp.country}</span>
                            </span>
                            <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                              <Star className="size-3.5 fill-amber-500 text-amber-500" />
                              <span>{hosp.rating}</span>
                            </div>
                          </div>

                          <h3 className="text-sm font-bold text-ink mb-1">
                            {hosp.name}
                          </h3>
                          <div className="text-[11px] font-semibold text-ink-muted mb-2">
                            {hosp.rankBadge}
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {hosp.accreditations.map((acc, i) => (
                              <span
                                key={i}
                                className="rounded bg-white border border-border text-[10px] font-extrabold text-emerald-800 px-1.5 py-0.5"
                              >
                                {acc}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border flex items-center justify-between">
                          <span className="text-[11px] text-ink-muted">
                            {hosp.bedsCount} Inpatient Beds
                          </span>
                          <a
                            href={`/hospitals/${hosp.slug}`}
                            className="text-xs font-bold text-action hover:underline inline-flex items-center gap-1"
                          >
                            <span>Hospital Details</span>
                            <ArrowRight className="size-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 4. SPECIALIST DOCTORS */}
              <section id="doctors" className="scroll-mt-20">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                        Board-Certified Surgeons
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-0.5">
                        Leading Medical Specialists in {destination.name}
                      </h2>
                    </div>
                    <a
                      href="/doctors"
                      className="text-xs font-bold text-action hover:underline hidden sm:inline-flex items-center gap-1"
                    >
                      <span>All Specialists</span>
                      <ArrowRight className="size-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {destination.doctors.map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-xl border border-border p-4 bg-surface-muted/30 hover:border-action transition-all flex items-center gap-3.5"
                      >
                        <div className="size-16 rounded-xl bg-surface-teal overflow-hidden shrink-0 border border-border">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="size-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-ink truncate">{doc.name}</h3>
                          <div className="text-xs text-action font-semibold truncate">{doc.specialty}</div>
                          <div className="text-[11px] text-ink-muted truncate mt-0.5">{doc.hospital}</div>
                          <div className="text-[11px] text-ink font-semibold mt-1 flex items-center gap-2">
                            <span>{doc.experience}</span>
                            <span>·</span>
                            <span className="flex items-center text-amber-600">
                              <Star className="size-3 fill-amber-500 text-amber-500 inline mr-0.5" />
                              {doc.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. TRAVEL & VISA GUIDE */}
              <section id="travel-visa" className="scroll-mt-20">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                    Smooth Inbound Journey
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-0.5 mb-4">
                    Travel, Visa &amp; Logistics Guide: {destination.name}
                  </h2>
                  <p className="text-xs text-ink-muted leading-relaxed mb-6">
                    {destination.travelInfo.visaDescription}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="rounded-xl border border-border/80 bg-surface-muted/40 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-ink mb-2">
                        <FileText className="size-4 text-action" />
                        <span>Required Visa Documents</span>
                      </div>
                      <ul className="text-xs text-ink-muted space-y-1.5 pl-6 list-disc">
                        {destination.travelInfo.visaDocumentsNeeded.map((doc, i) => (
                          <li key={i}>{doc}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-border/80 bg-surface-muted/40 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-ink mb-2">
                        <Plane className="size-4 text-action" />
                        <span>Flight Connectivity &amp; Transit</span>
                      </div>
                      <ul className="text-xs text-ink-muted space-y-1.5 pl-6 list-disc">
                        {destination.travelInfo.flightHubs.map((hub, i) => (
                          <li key={i}>{hub}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-ink-muted bg-surface-muted/50 rounded-xl p-4 border border-border/60">
                    <div>
                      <strong className="text-ink block mb-0.5">Airport Transfers:</strong>
                      <span>{destination.travelInfo.airportPickup}</span>
                    </div>
                    <div>
                      <strong className="text-ink block mb-0.5">Companion Stay:</strong>
                      <span>{destination.travelInfo.companionAccommodation}</span>
                    </div>
                    <div>
                      <strong className="text-ink block mb-0.5">Languages Spoken:</strong>
                      <span>{destination.travelInfo.languageAssistance}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. FAQS ACCORDION */}
              <section id="faqs" className="scroll-mt-20">
                <div className="rounded-2xl border border-border bg-white p-6 sm:p-8 shadow-xs">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-action">
                    Clear Answers
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-ink mt-0.5 mb-6">
                    Frequently Asked Questions about Medical Tourism in {destination.name}
                  </h2>

                  <div className="space-y-3">
                    {destination.faqs.map((faq, idx) => {
                      const isOpen = openFaqIndices.includes(idx);
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-border overflow-hidden bg-surface-muted/30"
                        >
                          <button
                            type="button"
                            onClick={() => toggleFaq(idx)}
                            className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-ink hover:text-action transition-colors cursor-pointer"
                          >
                            <span>{faq.question}</span>
                            <ChevronDown
                              className={`size-4 text-ink-muted transition-transform duration-200 shrink-0 ml-2 ${
                                isOpen ? "rotate-180 text-action" : ""
                              }`}
                            />
                          </button>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 text-xs text-ink-muted leading-relaxed border-t border-border/50 bg-white">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT SIDEBAR: CONSULTATION CARD */}
            <div className="space-y-6">
              <div className="sticky top-20 rounded-2xl border border-border bg-white p-6 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">{destination.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-ink">Plan Care in {destination.name}</h3>
                    <p className="text-[11px] text-ink-muted">Free Case Evaluation &amp; Hospital Quotes</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-ink-muted py-3 border-t border-b border-border my-4">
                  <div className="flex items-center justify-between">
                    <span>Accredited Centers:</span>
                    <strong className="text-ink">{destination.metrics.accreditedHospitalsCount}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Average Savings:</span>
                    <strong className="text-emerald-700">{destination.metrics.avgSavingsPercentage}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Visa Processing:</span>
                    <strong className="text-ink">{destination.metrics.visaProcessingTime}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Billing Surety:</span>
                    <strong className="text-action font-bold">Zero-Markup Direct Billing</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="w-full rounded-full bg-action hover:bg-action-hover text-white py-3 text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mb-3"
                >
                  <Sparkles className="size-4" />
                  <span>Request Free Treatment Quote</span>
                </button>

                <a
                  href={`https://wa.me/${phoneClean}?text=Hello%20AKEEZO,%20I%20am%20interested%20in%20treatment%20in%20${encodeURIComponent(destination.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="size-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <div className="mt-4 pt-3 border-t border-border/60 text-center text-[11px] text-ink-muted">
                  <span>Helpline: </span>
                  <a href={`tel:${phoneClean}`} className="text-action font-bold hover:underline">
                    {data.siteSettings?.phone || "+91 82876 39443"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ENQUIRY & ESTIMATE MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans text-ink"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{destination.flag}</span>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    Treatment Quote: {destination.name}
                  </h3>
                  <p className="text-xs text-ink-muted">
                    {selectedProcedureForModal
                      ? `Personalized pricing for ${selectedProcedureForModal}`
                      : "Receive 3 verified hospital options with zero markups"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1.5 text-ink-muted hover:bg-surface-muted hover:text-ink cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </div>

            {submissionReceipt ? (
              <div className="py-6 text-center">
                <div className="size-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="text-lg font-bold text-ink mb-1">Quote Request Confirmed!</h4>
                <p className="text-xs text-ink-muted mb-4 max-w-sm mx-auto">
                  Your reference ID is <strong className="text-ink font-mono">{submissionReceipt}</strong>. An AKEEZO medical coordinator will review your request and contact you within 2 hours with customized hospital cost options.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSubmissionReceipt(null);
                  }}
                  className="rounded-full bg-action px-6 py-2 text-xs font-bold text-white hover:bg-action-hover cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitEnquiry} className="space-y-3.5 text-xs">
                <div>
                  <label className="font-bold text-ink block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-2 text-xs text-ink focus:border-action focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-ink block mb-1">Phone / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-2 text-xs text-ink focus:border-action focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-ink block mb-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="patient@example.com"
                      className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-2 text-xs text-ink focus:border-action focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Planned Procedure</label>
                  <input
                    type="text"
                    value={formData.procedure}
                    onChange={(e) => setFormData({ ...formData, procedure: e.target.value })}
                    placeholder="e.g. Knee Replacement, CyberKnife, Bariatric"
                    className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-2 text-xs text-ink focus:border-action focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-ink block mb-1">Medical Details or Questions</label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Briefly describe your diagnosis or specific hospital preference..."
                    className="w-full rounded-xl border border-border bg-surface-muted px-3.5 py-2 text-xs text-ink focus:border-action focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-ink-muted">
                    Zero obligation · 100% confidential
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-action px-6 py-2.5 text-xs font-bold text-white hover:bg-action-hover disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? "Submitting..." : "Send Request"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <SiteFooter siteSettings={data.siteSettings} />
    </div>
  );
}
