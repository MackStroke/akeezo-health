import React, { useState } from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import {
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Send,
  Loader2,
  Lock,
  Building2,
  ExternalLink
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";

export interface ContactTemplateProps {
  data: PublicRouteResponseDTO;
}

const COUNTRY_DIAL_CODES = [
  { code: "91", country: "IN", label: "India (+91)" },
  { code: "1", country: "US", label: "USA / Canada (+1)" },
  { code: "44", country: "GB", label: "United Kingdom (+44)" },
  { code: "971", country: "AE", label: "UAE (+971)" },
  { code: "61", country: "AU", label: "Australia (+61)" },
  { code: "65", country: "SG", label: "Singapore (+65)" },
  { code: "966", country: "SA", label: "Saudi Arabia (+966)" },
  { code: "968", country: "OM", label: "Oman (+968)" },
  { code: "974", country: "QA", label: "Qatar (+974)" },
  { code: "965", country: "KW", label: "Kuwait (+965)" },
  { code: "973", country: "BH", label: "Bahrain (+973)" },
  { code: "880", country: "BD", label: "Bangladesh (+880)" },
  { code: "977", country: "NP", label: "Nepal (+977)" },
  { code: "94", country: "LK", label: "Sri Lanka (+94)" },
  { code: "234", country: "NG", label: "Nigeria (+234)" },
  { code: "254", country: "KE", label: "Kenya (+254)" },
  { code: "27", country: "ZA", label: "South Africa (+27)" },
  { code: "49", country: "DE", label: "Germany (+49)" }
];

export function ContactTemplate({ data }: ContactTemplateProps) {
  const siteSettings = data.siteSettings || {};
  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const phoneClean = phone.replace(/[^0-9]/g, "");
  const careEmail = siteSettings.careEmail || siteSettings.contactEmail || "care@akeezo.com";
  const medicalEmail = siteSettings.medicalEmail || "medical@akeezo.com";
  const partnershipEmail = siteSettings.partnershipEmail || "partnership@akeezo.com";
  const officeAddress =
    siteSettings.officeAddress ||
    "Regus Elegance, Jasola District Centre, New Delhi, India 110025";

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("Treatment Cost Estimate & Second Opinion");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    receiptId: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }

    if (!email.trim() && !phoneNumber.trim()) {
      setErrorMessage("Please provide either your email address or phone number.");
      return;
    }

    if (!message.trim()) {
      setErrorMessage("Please enter a short message describing your medical or travel requirements.");
      return;
    }

    setIsSubmitting(true);
    try {
      const fullPhone = phoneNumber.trim() ? `+${countryCode} ${phoneNumber.trim()}` : "";
      const res = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterName: fullName.trim(),
          email: email.trim(),
          phone: fullPhone,
          country: COUNTRY_DIAL_CODES.find((c) => c.code === countryCode)?.label || "International",
          serviceType: "contact",
          notes: `[Contact Form - ${subject}] ${message.trim()}`,
          message: message.trim(),
          sourcePath: "/contact"
        })
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Failed to submit enquiry. Please try again or WhatsApp our care desk.");
      }

      setSubmissionSuccess({
        receiptId: json.data?.receiptId || `AKZ-CNT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        message:
          json.data?.message ||
          "Your message has been sent successfully. A dedicated patient coordinator will review your request and get back to you within 2 hours."
      });

      // Clear fields
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setMessage("");
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please contact us directly via WhatsApp or phone.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans text-gray-900 selection:bg-brand-orange/20 selection:text-brand-orange-hover">
      {/* JSON-LD Schema for ContactPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contact Us - Medical Tourism & Patient Support | AKEEZO",
            description:
              "Get in touch with AKEEZO for personalized medical tourism assistance in India. Contact our care team for hospital quotes, specialist consultations, and travel guidance.",
            url: "https://akeezo.com/contact",
            mainEntity: {
              "@type": "MedicalBusiness",
              name: "AKEEZO Healthcare Platform",
              telephone: phone,
              email: careEmail,
              address: {
                "@type": "PostalAddress",
                streetAddress: officeAddress,
                addressLocality: "New Delhi",
                postalCode: "110025",
                addressCountry: "IN"
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: phone,
                  contactType: "customer support",
                  availableLanguage: ["English", "Hindi", "Arabic", "French", "Bengali"],
                  areaServed: "Worldwide"
                }
              ]
            }
          })
        }}
      />

      {/* Global Site Header */}
      <SiteHeader activePath="/contact" siteSettings={siteSettings} />

      <main className="flex-1">
        <div className="mx-auto max-w-[1324px]">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-y-1 md:py-5 py-4 text-sm md:px-10 px-4">
            <div className="flex items-center">
              <a className="flex items-center text-[#A8A8A8] hover:text-black transition" href="/">
                Home
              </a>
              <ChevronRight className="mx-1 shrink-0 text-gray-400 w-3.5 h-3.5 md:w-4 md:h-4" />
            </div>
            <div className="flex items-center">
              <span className="text-gray-900 font-medium">Contact Us</span>
            </div>
          </nav>

          <div className="md:pt-4 pt-2 space-y-12 md:space-y-16">
            {/* Header Centerpiece */}
            <div className="px-4 md:px-10 space-y-6">
              <div className="max-w-4xl mx-auto mt-2 text-center space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-teal border border-border-teal text-action text-xs font-bold tracking-wide uppercase">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Patient Support &amp; 24/7 Care Desk</span>
                </div>
                <h1 className="text-[28px] md:text-[38px] font-bold text-gray-900 tracking-tight">
                  Contact Us
                </h1>
                <p className="text-base md:text-[20px] text-gray-700 font-medium">
                  AKEEZO – Your trusted global platform to discover and compare world-class medical treatments in India.
                </p>
                <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  From cardiac surgery to cosmetic procedures, oncology, and joint replacements in India, we help you explore accredited hospitals, verified doctors, transparent pricing, and real patient reviews — all in one place.
                </p>
              </div>
            </div>

            {/* Two-Column Grid: Form + Contact Cards */}
            <div className="px-4 md:px-10">
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                {/* Left Column: Send us a Message */}
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border shadow-xs">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-[20px] md:text-[24px] font-bold text-gray-900">
                        Send us a Message
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Tell us about your healthcare requirement. We will reply within 2 hours.
                      </p>
                    </div>
                    <span className="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </span>
                  </div>

                  {submissionSuccess ? (
                    <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                        <div>
                          <h3 className="font-bold text-emerald-900 text-lg">Message Received!</h3>
                          <p className="text-xs font-semibold text-emerald-700">
                            Receipt ID: <span className="font-mono">{submissionSuccess.receiptId}</span>
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-emerald-800 leading-relaxed">
                        {submissionSuccess.message}
                      </p>
                      <div className="pt-2 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => setSubmissionSuccess(null)}
                          className="px-4 py-2 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition cursor-pointer"
                        >
                          Send Another Message
                        </button>
                        <a
                          href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20just%20submitted%20the%20contact%20form%20with%20reference%20${submissionSuccess.receiptId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#25D366] text-white hover:bg-[#20bd5a] transition"
                        >
                          <span>Chat on WhatsApp Now</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {errorMessage && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                          {errorMessage}
                        </div>
                      )}

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          maxLength={40}
                          required
                          placeholder="e.g. Dr. John Doe / Sarah Smith"
                          className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-ink outline-none focus:ring-2 focus:ring-action/40 focus:border-action transition-colors"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-ink outline-none focus:ring-2 focus:ring-action/40 focus:border-action transition-colors"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>

                      {/* Phone Number with Country Code */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Phone / WhatsApp Number <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="w-[130px] shrink-0 px-3 py-3 border border-gray-300 rounded-full text-xs font-semibold bg-white text-gray-700 outline-none focus:border-action cursor-pointer"
                          >
                            {COUNTRY_DIAL_CODES.map((c) => (
                              <option key={c.country} value={c.code}>
                                {c.country} (+{c.code})
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            required
                            placeholder="Mobile number with WhatsApp"
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm text-ink outline-none focus:ring-2 focus:ring-action/40 focus:border-action transition-colors"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Subject / Inquiry Type */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          How can we help you?
                        </label>
                        <select
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-full text-sm text-gray-700 bg-white outline-none focus:ring-2 focus:ring-action/40 focus:border-action cursor-pointer"
                        >
                          <option value="Treatment Cost Estimate & Second Opinion">
                            Free Treatment Cost Estimate &amp; Second Opinion
                          </option>
                          <option value="Hospital & Doctor Recommendation">
                            Hospital &amp; Surgeon Matching in India
                          </option>
                          <option value="Medical Visa & Inbound Logistics">
                            Medical Visa Invitation &amp; Travel Assistance
                          </option>
                          <option value="Hospital Partnership Inquiry">
                            Hospital / Doctor Onboarding Partnership
                          </option>
                          <option value="Patient Grievance / Feedback">
                            Patient Experience &amp; Feedback
                          </option>
                          <option value="General Question">General Healthcare Inquiry</option>
                        </select>
                      </div>

                      {/* Message */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-sm font-semibold text-gray-700">
                            Message &amp; Medical Details <span className="text-red-500">*</span>
                          </label>
                          <span className="text-xs text-gray-400">
                            {message.length}/1000
                          </span>
                        </div>
                        <textarea
                          rows={4}
                          maxLength={1000}
                          required
                          placeholder="Please tell us about your current diagnosis, desired treatment, preferred city (Delhi, Mumbai, Chennai, etc.), or specific questions..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-sm text-ink outline-none focus:ring-2 focus:ring-action/40 focus:border-action transition-colors resize-none"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>

                      {/* Medical report note */}
                      <div className="p-3 bg-surface-teal/40 rounded-xl border border-border-teal/50 flex items-start gap-2.5 text-xs text-gray-600">
                        <ShieldCheck className="w-4 h-4 text-action shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-action">Have clinical reports or prescriptions?</span>
                          <p className="mt-0.5 text-gray-500">
                            You can attach them directly when replying to our WhatsApp confirmation or email. We never charge coordination fees.
                          </p>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3.5 px-6 rounded-full transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Sending Your Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Message</span>
                          </>
                        )}
                      </button>

                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>Protected by India DPDP Act 2023 &amp; HIPAA standard encryption</span>
                      </div>
                    </form>
                  )}
                </div>

                {/* Right Column: Direct Contact Cards & Information */}
                <div className="space-y-6">
                  {/* Card 1: 24/7 Helpline & Call */}
                  <div className="p-6 rounded-3xl bg-white border border-border shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-action text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">Call 24/7 Care Desk</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          Online Now
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Direct assistance for hospital admissions, quotes, and emergency transfers.
                      </p>
                      <div className="mt-2.5">
                        <a
                          href={`tel:${phoneClean}`}
                          className="text-base font-bold text-action hover:underline"
                        >
                          {phone}
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: WhatsApp Chat */}
                  <div className="p-6 rounded-3xl bg-white border border-border shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Chat with Us on WhatsApp</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Instant responses, report review, and doctor appointment scheduling.
                      </p>
                      <div className="mt-2.5">
                        <a
                          href={`https://wa.me/${phoneClean}?text=Hello%20Akeezo,%20I%20would%20like%20to%20inquire%20about%20medical%20travel%20in%20India`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
                        >
                          <span>Start WhatsApp Conversation</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Email Desks */}
                  <div className="p-6 rounded-3xl bg-white border border-border shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-gray-900">Email Assistance</h3>
                      <div className="text-xs text-gray-600 space-y-1 pt-1">
                        <p>
                          <span className="font-semibold text-gray-800">Patient Care:</span>{" "}
                          <a href={`mailto:${careEmail}`} className="text-action hover:underline font-medium">
                            {careEmail}
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-800">Medical Opinions:</span>{" "}
                          <a href={`mailto:${medicalEmail}`} className="text-action hover:underline font-medium">
                            {medicalEmail}
                          </a>
                        </p>
                        <p>
                          <span className="font-semibold text-gray-800">Hospital Partnerships:</span>{" "}
                          <a href={`mailto:${partnershipEmail}`} className="text-action hover:underline font-medium">
                            {partnershipEmail}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: Registered Office */}
                  <div className="p-6 rounded-3xl bg-white border border-border shadow-xs flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-900 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Visit Our Main Office</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Corporate &amp; Coordination Headquarters</p>
                      <address className="not-italic text-xs text-gray-700 font-medium mt-1 leading-relaxed">
                        {officeAddress}
                      </address>
                    </div>
                  </div>

                  {/* Why Choose AKEEZO Box */}
                  <div className="p-6 rounded-3xl bg-gradient-to-br from-surface-teal/50 to-white border border-border-teal/60">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-action" />
                      <span>Why Choose AKEEZO?</span>
                    </h3>
                    <ul className="space-y-2 text-xs text-gray-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-action shrink-0 mt-0.5" />
                        <span><strong>100% Free Patient Service:</strong> Zero consultation or hidden coordination fees.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-action shrink-0 mt-0.5" />
                        <span><strong>Accredited Hospitals:</strong> Only NABH and JCI accredited quaternary healthcare facilities.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-action shrink-0 mt-0.5" />
                        <span><strong>Direct Hospital Billing:</strong> Transparent official pricing paid directly upon hospital arrival.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-action shrink-0 mt-0.5" />
                        <span><strong>End-to-End Coordination:</strong> Medical visa invitations, airport transfers, and local stay support.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Map Section */}
            <div className="px-4 md:px-10 pb-12 space-y-6">
              <div className="text-center space-y-2 max-w-2xl mx-auto">
                <h2 className="text-[20px] md:text-[26px] font-bold text-gray-900">
                  Our Headquarters Location
                </h2>
                <div className="flex items-center justify-center gap-1.5 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-action shrink-0" />
                  <span>{officeAddress}</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-md border border-border overflow-hidden">
                <div className="h-96 lg:h-[460px] relative">
                  <iframe
                    src="https://www.google.com/maps?q=28.5398,77.2882&hl=en&z=15&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="AKEEZO Healthcare Headquarters Location"
                    className="w-full h-full"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs rounded-2xl shadow-xl p-4 max-w-xs border border-border">
                    <div className="flex items-center space-x-3 mb-2.5">
                      <div className="w-10 h-10 bg-action rounded-full flex items-center justify-center text-white shrink-0">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">AKEEZO Platform</h4>
                        <p className="text-xs text-gray-500">Global Medical Travel Desk</p>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-2">
                      <p>📍 Jasola District Centre, New Delhi, India</p>
                      <p>📞 {phone}</p>
                      <p>✉️ {careEmail}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Site Footer */}
      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
}
export default ContactTemplate;
