import { useState, useMemo } from "react";
import type { PublicRouteResponseDTO, HospitalDetail } from "@akeezo/contracts";
import {
  Star,
  MapPin,
  Award,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Phone,
  MessageSquare,
  Bed,
  Activity,
  HeartPulse,
  Calendar,
  Users,
  Globe2,
  DollarSign,
  Languages,
  Check,
  Stethoscope,
  Eye,
  Info,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";
import { HospitalEnquiryModal } from "../components/HospitalEnquiryModal.js";
import { getHospitalDetail, YANHEE_HOSPITAL_DETAIL } from "../data/hospitalsData.js";

export interface HospitalDetailTemplateProps {
  data: PublicRouteResponseDTO;
}

export function HospitalDetailTemplate({ data }: HospitalDetailTemplateProps) {
  const payload = (data.payload as any) || {};
  const slug = payload.slug || "yanhee-international-hospital";

  // Resolve hospital detail from payload, helper, or default
  const hospital: HospitalDetail = useMemo(() => {
    if (payload.hospital && payload.hospital.name) {
      return payload.hospital as HospitalDetail;
    }
    const resolved = getHospitalDetail(slug, payload.hospitals);
    if (resolved) return resolved;
    return YANHEE_HOSPITAL_DETAIL;
  }, [slug, payload]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcedureForModal, setSelectedProcedureForModal] = useState<string | undefined>(undefined);

  // Active Subnav Tab
  const [activeTab, setActiveTab] = useState("overview");

  // FAQ Accordion State
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0, 1]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleOpenBooking = (procedureName?: string) => {
    setSelectedProcedureForModal(procedureName);
    setIsModalOpen(true);
  };

  // Structured Data JSON-LD
  const hospitalSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "Hospital",
      name: hospital.name,
      description: hospital.summary,
      url: `https://akeezo.com${hospital.href || `/hospitals/${hospital.slug}`}`,
      image: hospital.image,
      address: {
        "@type": "PostalAddress",
        addressLocality: hospital.city,
        addressCountry: hospital.country,
        streetAddress: hospital.address,
        postalCode: hospital.postalCode,
      },
      telephone: hospital.telephone,
      medicalSpecialty: hospital.specialties,
      accreditation: hospital.accreditations.map((acc) => ({
        "@type": "Organization",
        name: acc,
      })),
      numberOfBeds: hospital.bedsCount,
      numberOfICU: hospital.icuCount,
      numberOfOperatingRooms: hospital.operatingRooms,
      foundingDate: String(hospital.establishedYear),
    };
  }, [hospital]);

  const breadcrumbSchema = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://akeezo.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Hospitals",
          item: "https://akeezo.com/hospitals",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: hospital.name,
          item: `https://akeezo.com/hospitals/${hospital.slug}`,
        },
      ],
    };
  }, [hospital]);

  const faqSchema = useMemo(() => {
    if (!hospital.faqs || hospital.faqs.length === 0) return null;
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: hospital.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer,
        },
      })),
    };
  }, [hospital.faqs]);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "why-choose", label: "Why Choose" },
    { id: "cost", label: "Surgeries & Costs" },
    { id: "treatments", label: "Treatments" },
    { id: "facilities", label: "Facilities & Rooms" },
    { id: "doctors", label: "Specialists" },
    { id: "location", label: "Location" },
    { id: "faqs", label: "FAQs" },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-gray-900 selection:bg-surface-teal selection:text-action">
      {/* Schema.org Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hospitalSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Global Site Header */}
      <SiteHeader siteSettings={data.siteSettings} />

      <main className="flex-1 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium overflow-x-auto whitespace-nowrap">
              <a href="/" className="hover:text-action transition-colors">
                Home
              </a>
              <ChevronRight className="size-3 text-gray-400 shrink-0" />
              <a href="/hospitals" className="hover:text-action transition-colors">
                Hospitals
              </a>
              <ChevronRight className="size-3 text-gray-400 shrink-0" />
              <span className="text-gray-900 font-bold truncate">{hospital.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Collage & Hospital Profile Banner */}
        <section className="bg-white border-b border-gray-100 pt-6 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Gallery Collage */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-3xl overflow-hidden mb-6 h-64 sm:h-80 md:h-96 shadow-xs border border-gray-100 bg-gray-50">
              {/* Main Image */}
              <div className="md:col-span-2 relative h-full overflow-hidden group">
                <img
                  src={hospital.image}
                  alt={hospital.name}
                  className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://d162jy5nwnavsz.cloudfront.net/hospitals/52/hospital-images/e46701bb35956867d693adbd6a76736922011944e2620e07a5156b853d2f20e9.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30 text-white mb-2">
                      <Sparkles className="size-3.5 text-amber-300" />
                      <span>{hospital.rankBadge}</span>
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-sm">
                      {hospital.name}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Secondary Grid */}
              <div className="hidden md:grid grid-rows-2 gap-3 h-full overflow-hidden">
                <div className="relative h-full overflow-hidden group">
                  <img
                    src={hospital.images?.[1] || "/uploads/hospitals/hospital-default.jpg"}
                    alt={`${hospital.name} Building`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="relative h-full overflow-hidden group">
                  <img
                    src={hospital.images?.[2] || "/uploads/hospitals/hospital-default.jpg"}
                    alt={`${hospital.name} Interior & Modern Facilities`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-3 right-3">
                    <button
                      type="button"
                      onClick={() => handleOpenBooking()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-xl backdrop-blur-md cursor-pointer transition-colors"
                    >
                      <Eye className="size-3.5" />
                      <span>View Gallery (15+)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges & Meta Info Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-surface-teal text-action border border-border-teal">
                    {hospital.hospitalType}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                    {hospital.ownership}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <ShieldCheck className="size-3.5 text-amber-600" />
                    <span>Patient Trusted Hospital</span>
                  </span>
                  {hospital.accreditations.map((acc) => (
                    <span
                      key={acc}
                      className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {acc}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1 font-semibold text-gray-800">
                    <MapPin className="size-4 text-[#007A6C]" />
                    <span>{hospital.address}</span>
                  </span>
                  <span className="text-gray-300">|</span>
                  <a
                    href={`tel:${hospital.telephone.replace(/\s+/g, "")}`}
                    className="flex items-center gap-1 hover:text-action font-semibold"
                  >
                    <Phone className="size-3.5 text-gray-500" />
                    <span>{hospital.telephone}</span>
                  </a>
                </div>
              </div>

              {/* Rating & Action */}
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-sm font-bold text-gray-900">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    <span>{hospital.rating}</span>
                    <span className="text-xs text-gray-500 font-normal">/ 100</span>
                  </div>
                  <div className="text-[11px] text-gray-500">{hospital.ratingDisplay}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center gap-2"
                >
                  <MessageSquare className="size-4" />
                  <span>Connect with Hospital</span>
                </button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-6">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0 text-[#007A6C]">
                  <Bed className="size-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">{hospital.bedsCount}</div>
                  <div className="text-[11px] text-gray-500">Inpatient Beds</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0 text-amber-600">
                  <HeartPulse className="size-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">{hospital.icuCount}</div>
                  <div className="text-[11px] text-gray-500">ICU Capacity</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                  <Activity className="size-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">{hospital.operatingRooms}</div>
                  <div className="text-[11px] text-gray-500">Operation Theaters</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">Est. {hospital.establishedYear}</div>
                  <div className="text-[11px] text-gray-500">40+ Years Care</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-600">
                  <Users className="size-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">2,000+</div>
                  <div className="text-[11px] text-gray-500">Daily Patients</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-3">
                <div className="size-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0 text-rose-600">
                  <Globe2 className="size-5" />
                </div>
                <div>
                  <div className="text-base font-bold text-gray-900">270+ Doctors</div>
                  <div className="text-[11px] text-gray-500">800+ Nurses</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Sub-Navigation Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 no-scrollbar">
              {tabs.map((tab) => (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#007A6C] text-white shadow-xs"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </a>
              ))}
              <div className="ml-auto shrink-0 pl-2">
                <button
                  type="button"
                  onClick={() => handleOpenBooking()}
                  className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-4 py-1.5 rounded-full transition-colors cursor-pointer"
                >
                  Get Hospital Quote
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Layout with Sticky Sidebar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_420px] gap-8 items-start">
            {/* Left Content Column */}
            <div className="space-y-12">
              {/* SECTION 1: Overview */}
              <section id="overview" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-action">
                    About The Medical Center
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    About {hospital.name}
                  </h2>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed font-normal">
                  {hospital.summary}
                </p>

                {/* Narrative prose */}
                <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
                  <div className="p-4 bg-teal-50/50 border border-teal-100 rounded-2xl">
                    <h3 className="text-sm font-bold text-[#007A6C] flex items-center gap-2 mb-2">
                      <Award className="size-4" />
                      <span>Ratings &amp; Official Certifications</span>
                    </h3>
                    <ul className="text-xs text-gray-700 space-y-1.5 list-disc pl-5">
                      <li>The <strong>hospital was ranked #12 in Thailand</strong> by Newsweek 2025 (rating <strong>75.21</strong>)</li>
                      <li><strong>JCI Accredited</strong> (Joint Commission International) Gold Seal of Approval</li>
                      <li><strong>ISO 9001 Certified</strong> for clinical quality management continuously since 2000</li>
                      <li>Thai Hospital Accreditation (<strong>HA</strong>) certified by the Healthcare Accreditation Institute</li>
                      <li><strong>CAP Accredited</strong> clinical pathology laboratories</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50/60 border border-amber-100 rounded-2xl">
                    <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
                      <ShieldCheck className="size-4 text-amber-600" />
                      <span>Patient Satisfaction &amp; Global Trust</span>
                    </h3>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      An estimated <strong>75% of Yanhee’s International Patients</strong> are either repeat patients or were
                      referred directly through positive personal recommendations of previous surgical patients. This provides
                      high empirical proof of patient satisfaction and lasting surgical outcomes.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Why Choose */}
              <section id="why-choose" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-action">
                    International Excellence
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    Why International Patients Choose {hospital.name}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="size-10 rounded-xl bg-teal-100 text-[#007A6C] flex items-center justify-center font-bold">
                      75%
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">High Patient Loyalty</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Over three-quarters of overseas visitors return for subsequent procedures or are recommended by family members.
                    </p>
                  </div>

                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="size-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      70%
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">50% - 70% Cost Advantage</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Tier-1 aesthetic surgery, bariatric programs, and dental care at a fraction of North American or European rates.
                    </p>
                  </div>

                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="size-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                      <Languages className="size-5" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Multilingual Care Desk</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      On-site medical interpreters for English, Arabic, Japanese, French, German, Chinese, and Burmese.
                    </p>
                  </div>

                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="size-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="size-5" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">Zero Agency Markups</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Direct hospital invoices with 100% price transparency. AKEEZO care coordination is completely free to patients.
                    </p>
                  </div>
                </div>
              </section>

              {/* SECTION 3: Cost of Surgeries */}
              <section id="cost" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                      Transparent Pricing
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      Cost of Surgeries at {hospital.name}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Indicative procedural estimates compared against standard US / UK private hospital rates.
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-[#FF6D1B] self-start sm:self-auto">
                    <DollarSign className="size-3.5" />
                    <span>Average 65% - 75% Savings</span>
                  </span>
                </div>

                {/* Price Comparison Table */}
                <div className="overflow-x-auto rounded-2xl border border-gray-200">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold">
                        <th className="p-3.5 sm:px-4">Procedure &amp; Category</th>
                        <th className="p-3.5 sm:px-4">{hospital.name} Price</th>
                        <th className="p-3.5 sm:px-4 text-gray-500">Typical US / UK Price</th>
                        <th className="p-3.5 sm:px-4 text-center">Indicative Savings</th>
                        <th className="p-3.5 sm:px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {hospital.surgeriesCost.map((sc) => (
                        <tr key={sc.id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="p-3.5 sm:px-4">
                            <div className="font-bold text-gray-900 text-sm">{sc.procedure}</div>
                            <div className="text-[11px] text-gray-500">{sc.category}</div>
                          </td>
                          <td className="p-3.5 sm:px-4 font-bold text-[#007A6C] text-sm whitespace-nowrap">
                            {sc.hospitalPriceUsd}
                          </td>
                          <td className="p-3.5 sm:px-4 text-gray-500 line-through whitespace-nowrap">
                            {sc.usUkPriceUsd}
                          </td>
                          <td className="p-3.5 sm:px-4 text-center whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                              Save {sc.savingsPercent}%
                            </span>
                          </td>
                          <td className="p-3.5 sm:px-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleOpenBooking(sc.procedure)}
                              className="px-3.5 py-1.5 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                            >
                              Get Quote
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-xl">
                  <Info className="size-4 text-gray-400 shrink-0" />
                  <span>
                    Quotes include hospital admission fees, surgeon fees, anesthesiology, and routine in-stay medications.
                  </span>
                </div>
              </section>

              {/* SECTION 4: Treatments Yanhee Is Known For */}
              <section id="treatments" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-action">
                    Clinical Specialties
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    Treatments {hospital.name} Is Known For
                  </h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {hospital.specialties.map((spec) => (
                    <div
                      key={spec}
                      className="p-4 rounded-2xl border border-gray-100 bg-gray-50/60 hover:bg-white hover:border-[#007A6C]/40 hover:shadow-xs transition-all flex flex-col justify-between group"
                    >
                      <div className="space-y-1.5">
                        <Stethoscope className="size-5 text-[#007A6C] group-hover:scale-110 transition-transform" />
                        <h3 className="text-xs font-bold text-gray-900 leading-snug">{spec}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(spec)}
                        className="mt-3 text-[11px] font-bold text-[#FF6D1B] hover:text-[#e65c0d] flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inquire</span>
                        <ChevronRight className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 5: Facilities, Rooms & Highlights */}
              <section id="facilities" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-action">
                    Hospital Infrastructure
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    Facilities, Patient Suites &amp; Accessibility
                  </h2>
                </div>

                {/* Room Types */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">Inpatient Suite Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {hospital.roomTypes.map((rt) => (
                      <div key={rt.name} className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3">
                        <div className="text-sm font-bold text-[#007A6C]">{rt.name}</div>
                        <p className="text-xs text-gray-600 leading-relaxed">{rt.description}</p>
                        <div className="pt-2 border-t border-gray-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Included Amenities
                          </span>
                          <ul className="text-xs text-gray-700 space-y-1">
                            {rt.amenities.map((a) => (
                              <li key={a} className="flex items-center gap-1.5">
                                <Check className="size-3 text-[#007A6C] shrink-0" />
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights and Accessibility */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <Sparkles className="size-4 text-amber-500" />
                      <span>Hospital Highlights</span>
                    </h3>
                    <ul className="text-xs text-gray-700 space-y-2">
                      {hospital.highlights.map((hl) => (
                        <li key={hl} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                      <ShieldCheck className="size-4 text-blue-500" />
                      <span>Accessibility &amp; Safety</span>
                    </h3>
                    <ul className="text-xs text-gray-700 space-y-2">
                      {hospital.accessibilityFeatures.map((af) => (
                        <li key={af} className="flex items-start gap-2">
                          <CheckCircle2 className="size-3.5 text-blue-600 mt-0.5 shrink-0" />
                          <span>{af}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Accepted Payment Methods
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {hospital.paymentMethods.map((pm) => (
                      <span key={pm} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-800">
                        {pm}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION 6: Doctors & Specialists */}
              <section id="doctors" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-action">
                      Medical Leadership
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                      Specialists at {hospital.name}
                    </h2>
                  </div>
                  <a href="/doctors" className="text-xs font-bold text-[#007A6C] hover:underline flex items-center gap-1">
                    <span>View All Doctors</span>
                    <ArrowRight className="size-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {hospital.doctors.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-3 hover:bg-white hover:border-[#007A6C] transition-all group"
                    >
                      <div className="size-20 rounded-full mx-auto overflow-hidden border-2 border-gray-200 group-hover:border-[#007A6C] transition-colors">
                        <img
                          src={doc.image}
                          alt={doc.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://d162jy5nwnavsz.cloudfront.net/doctors/3797/profile-photo.jpg";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 line-clamp-1">{doc.name}</h3>
                        <p className="text-xs text-[#007A6C] font-semibold mt-0.5">{doc.specialty}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5">{doc.experience} experience</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(doc.specialty)}
                        className="w-full py-2 bg-white hover:bg-[#007A6C] text-[#007A6C] hover:text-white border border-[#007A6C] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Book Teleconsultation
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* SECTION 7: Location & Airport Transfer */}
              <section id="location" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-action">
                    Getting There
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    Location &amp; Travel Logistics
                  </h2>
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <MapPin className="size-4 text-[#007A6C]" />
                    <span>{hospital.address}</span>
                  </div>
                  <p className="text-xs text-gray-600">{hospital.location?.travelNotes}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Suvarnabhumi Airport (BKK)
                    </span>
                    <div className="text-sm font-bold text-gray-900">
                      {hospital.location?.airportBKKDistance}
                    </div>
                    <p className="text-xs text-gray-500">Expressway transfer with hospital private car</p>
                  </div>

                  <div className="p-4 rounded-2xl border border-gray-200 bg-white space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Don Mueang Airport (DMK)
                    </span>
                    <div className="text-sm font-bold text-gray-900">
                      {hospital.location?.airportDMKDistance}
                    </div>
                    <p className="text-xs text-gray-500">Tollway connectivity for regional flights</p>
                  </div>
                </div>
              </section>

              {/* SECTION 8: FAQ Accordion */}
              <section id="faqs" className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xs space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-action">
                    Common Questions
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">
                    Frequently Asked Questions about {hospital.name}
                  </h2>
                </div>

                <div className="space-y-3">
                  {hospital.faqs.map((faq, idx) => {
                    const isOpen = openFaqIndices.includes(idx);
                    return (
                      <div
                        key={faq.question}
                        className="border border-gray-200 rounded-2xl overflow-hidden transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleFaq(idx)}
                          className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900 hover:text-action transition-colors cursor-pointer"
                        >
                          <span>{faq.question}</span>
                          <ChevronDown
                            className={`size-4 text-gray-500 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-action" : ""
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Right Sticky Booking & Inquiry Card */}
            <div className="lg:sticky lg:top-20 space-y-5">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 sm:p-7 space-y-6">
                <div className="text-center space-y-2 pb-4 border-b border-gray-100">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="size-3.5 text-emerald-600" />
                    <span>Free Care Coordination</span>
                  </span>
                  <h3 className="text-lg font-bold text-gray-900">
                    Connect with {hospital.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Direct hospital estimates &amp; personalized treatment plan within 12 business hours.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleOpenBooking()}
                    className="w-full py-3.5 px-6 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    <span>Request Free Treatment Quote</span>
                  </button>

                  <a
                    href="https://wa.me/918287639443?text=Hello%20Akeezo%20Care%20Desk%2C%20I%20want%20information%20for%20Yanhee%20International%20Hospital."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-6 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Phone className="size-3.5" />
                    <span>WhatsApp 24/7 Desk Hotline</span>
                  </a>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-gray-100 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#007A6C] shrink-0" />
                    <span>100% Price Match Guarantee directly from hospital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#007A6C] shrink-0" />
                    <span>Official Medical Visa Invitation Letter provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#007A6C] shrink-0" />
                    <span>Airport VIP Pickup &amp; Multilingual Care Coordinator</span>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-center space-y-1">
                  <div className="text-[11px] text-gray-500">Have questions right now?</div>
                  <div className="font-bold text-xs text-gray-900">
                    Call: <a href="tel:918287639443" className="text-action hover:underline">+91 82876 39443</a>
                  </div>
                </div>
              </div>

              {/* Akeezo Care Free Badge */}
              <div className="bg-gradient-to-br from-[#007A6C] to-[#005a4f] text-white rounded-3xl p-6 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-teal-200 text-xs font-bold">
                  <Sparkles className="size-4" />
                  <span>AKEEZO PATIENT GUARANTEE</span>
                </div>
                <h4 className="text-base font-bold leading-tight">
                  AKEEZO Care Is Absolutely Free For Patients
                </h4>
                <p className="text-xs text-white/80 leading-relaxed">
                  We never charge patients any consultation or coordination fees. You pay the exact official hospital bill directly upon arrival.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Site Footer */}
      <SiteFooter siteSettings={data.siteSettings} />

      {/* Hospital Booking / Inquiry Modal */}
      <HospitalEnquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hospital={hospital}
        initialProcedure={selectedProcedureForModal}
      />
    </div>
  );
}
