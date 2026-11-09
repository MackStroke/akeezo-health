import React, { useState } from "react";
import type { HospitalDetail } from "@akeezo/contracts";
import {
  X,
  Building2,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { DiscardConfirmDialog } from "./DiscardConfirmDialog.js";

interface HospitalEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: HospitalDetail;
  initialProcedure?: string;
}

export function HospitalEnquiryModal({
  isOpen,
  onClose,
  hospital,
  initialProcedure,
}: HospitalEnquiryModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedProcedure, setSelectedProcedure] = useState(
    initialProcedure || hospital.surgeriesCost?.[0]?.procedure || hospital.specialties?.[0] || "General Medical Inquiry"
  );
  const [timeline, setTimeline] = useState("Immediately (within 2-4 weeks)");

  // Patient Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(hospital.country || "International");
  const [notes, setNotes] = useState("");
  const [hasDpdpConsent, setHasDpdpConsent] = useState(true);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [receiptId, setReceiptId] = useState("");
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  if (!isOpen) return null;

  const hasUnsavedChanges =
    step !== 3 &&
    (name.trim().length > 0 ||
      phone.trim().length > 0 ||
      email.trim().length > 0 ||
      notes.trim().length > 0);

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges) {
      setShowDiscardConfirm(true);
    } else {
      onClose();
    }
  };

  const handleDiscardConfirm = () => {
    setShowDiscardConfirm(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (!name.trim()) {
      setSubmitError("Please enter your full legal name.");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Please enter a valid phone or WhatsApp number.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!hasDpdpConsent) {
      setSubmitError("Consent is required to coordinate with accredited hospital teams.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          country: country.trim(),
          treatment: selectedProcedure,
          hospital: hospital.name,
          hospitalSlug: hospital.slug,
          destination: `${hospital.city}, ${hospital.country}`,
          notes: `[Hospital Direct Enquiry] ${hospital.name}\nTimeline: ${timeline}\nProcedure: ${selectedProcedure}\nNotes: ${notes.trim()}`,
          consentDpdp: hasDpdpConsent,
          sourceUrl: typeof window !== "undefined" ? window.location.href : `/hospitals/${hospital.slug}`,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Failed to submit enquiry (${res.status})`);
      }

      const json = await res.json();
      const ref = json.data?.receiptId || json.data?.id || `AKZ-HOSP-${Date.now().toString(36).toUpperCase()}`;
      setReceiptId(ref);
      setStep(3);
    } catch (err: any) {
      setSubmitError(err.message || "An unexpected network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hospital-modal-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleCloseAttempt();
        }}
      >
        <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#007A6C] to-[#005a4f] text-white p-5 sm:p-6 shrink-0">
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="size-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="size-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <Building2 className="size-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  Direct Hospital Coordination
                </span>
                <h2 id="hospital-modal-title" className="text-lg sm:text-xl font-bold leading-tight">
                  Connect with {hospital.name}
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  {hospital.city}, {hospital.country} · {hospital.rankBadge}
                </p>
              </div>
            </div>

            {/* Step Progress Indicators */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/15 text-xs font-semibold">
              <span
                className={`flex items-center gap-1.5 ${
                  step >= 1 ? "text-white" : "text-white/50"
                }`}
              >
                <span className="size-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  1
                </span>
                Procedure
              </span>
              <span className="text-white/40">/</span>
              <span
                className={`flex items-center gap-1.5 ${
                  step >= 2 ? "text-white" : "text-white/50"
                }`}
              >
                <span className="size-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  2
                </span>
                Patient Details
              </span>
              <span className="text-white/40">/</span>
              <span
                className={`flex items-center gap-1.5 ${
                  step === 3 ? "text-white" : "text-white/50"
                }`}
              >
                <span className="size-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                  3
                </span>
                Confirmation
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {/* Step 1: Select Procedure & Timeline */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Select Desired Treatment or Surgery
                  </label>
                  <select
                    value={selectedProcedure}
                    onChange={(e) => setSelectedProcedure(e.target.value)}
                    className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 focus:bg-white focus:border-[#007A6C] focus:ring-2 focus:ring-[#007A6C]/20 outline-none transition-all cursor-pointer"
                  >
                    {hospital.surgeriesCost && hospital.surgeriesCost.length > 0 && (
                      <optgroup label="Key Surgeries & Indicative Estimates">
                        {hospital.surgeriesCost.map((s) => (
                          <option key={s.id} value={s.procedure}>
                            {s.procedure} ({s.hospitalPriceUsd})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {hospital.specialties && hospital.specialties.length > 0 && (
                      <optgroup label="Clinical Specialty Departments">
                        {hospital.specialties.map((spec) => (
                          <option key={spec} value={spec}>
                            {spec}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <option value="General Medical Consultation">General Medical Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                    Expected Travel Timeline
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      "Immediately (within 2-4 weeks)",
                      "Within 1-3 months",
                      "Just researching options",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setTimeline(opt)}
                        className={`text-left text-xs p-3 rounded-xl border font-semibold transition-all cursor-pointer ${
                          timeline === opt
                            ? "bg-[#007A6C]/10 border-[#007A6C] text-[#007A6C] shadow-xs"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hospital Guarantees */}
                <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                    <span>Akeezo Care Assurance at {hospital.name}</span>
                  </div>
                  <ul className="text-xs text-emerald-800 space-y-1 pl-6 list-disc">
                    <li>Direct hospital rate card pricing — 0% booking markup</li>
                    <li>Official medical visa invitation assistance</li>
                    <li>Complimentary dedicated care coordinator throughout your stay</li>
                  </ul>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 bg-[#FF6D1B] hover:bg-[#e65c0d] text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <span>Continue to Patient Details</span>
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Patient Info */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
                    {submitError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Patient Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Country of Residence <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="e.g. United Kingdom, Australia, USA"
                      className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sarah@example.com"
                      className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      WhatsApp / Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+44 7911 123456"
                      className="w-full text-sm px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Medical History / Specific Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Briefly describe your medical concerns, prior surgeries, or desired appointment window..."
                    className="w-full text-sm p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#007A6C] outline-none transition-colors"
                  />
                </div>

                {/* DPDP Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={hasDpdpConsent}
                      onChange={(e) => setHasDpdpConsent(e.target.checked)}
                      className="mt-0.5 size-4 rounded text-[#007A6C] focus:ring-[#007A6C] cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 leading-snug">
                      I consent to sharing this medical enquiry with {hospital.name} international patient
                      liaison under HIPAA, GDPR, and India DPDP 2023 principles for care coordination.
                    </span>
                  </label>
                </div>

                <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
                  >
                    <ArrowLeft className="size-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#FF6D1B] hover:bg-[#e65c0d] text-white font-bold text-sm px-7 py-3 rounded-full transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <span>Submit Hospital Enquiry</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Success Confirmation */}
            {step === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="size-9" />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900">Enquiry Submitted Successfully!</h3>
                  <p className="text-xs text-gray-600 mt-1 max-w-md mx-auto">
                    Your direct hospital request for <strong className="text-gray-900">{selectedProcedure}</strong> has
                    been securely transmitted to the international coordination team at{" "}
                    <strong className="text-[#007A6C]">{hospital.name}</strong>.
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl max-w-sm mx-auto text-xs space-y-1">
                  <div className="text-gray-500">Official Tracking Reference</div>
                  <div className="font-mono font-bold text-sm text-[#007A6C]">{receiptId}</div>
                  <div className="text-[11px] text-gray-400">Response expected within 12 business hours</div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <a
                    href={`https://wa.me/918287639443?text=Hello%20Akeezo%20Care%2C%20I%20have%20submitted%20inquiry%20${receiptId}%20for%20${encodeURIComponent(
                      hospital.name
                    )}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm transition-all"
                  >
                    <MessageSquare className="size-4" />
                    <span>WhatsApp 24/7 Desk Now</span>
                  </a>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Done &amp; Return to Hospital
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Discard Confirmation Dialog */}
      <DiscardConfirmDialog
        isOpen={showDiscardConfirm}
        onComplete={() => setShowDiscardConfirm(false)}
        onDiscard={handleDiscardConfirm}
      />
    </>
  );
}
