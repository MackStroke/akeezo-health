import React, { useState } from "react";
import type { DoctorDetail } from "@akeezo/contracts";
import {
  X,
  Video,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  CalendarPlus,
  MessageSquare,
} from "lucide-react";
import { DiscardConfirmDialog } from "./DiscardConfirmDialog.js";

interface DoctorBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: DoctorDetail;
  initialProcedure?: string;
}

export function DoctorBookingModal({
  isOpen,
  onClose,
  doctor,
  initialProcedure,
}: DoctorBookingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [consultationType, setConsultationType] = useState<"video" | "in_person">("video");
  const [selectedProcedure, setSelectedProcedure] = useState(
    initialProcedure || (doctor.procedures?.[0]?.name ?? doctor.specialty)
  );
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [preferredSlot, setPreferredSlot] = useState("Morning (09:00 - 12:00)");

  // Patient Info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(doctor.country || "International");
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
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setShowDiscardConfirm(false);
    setStep(1);
    setName("");
    setPhone("");
    setEmail("");
    setNotes("");
    setSubmitError("");
    setReceiptId("");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setSubmitError("Please enter your full name.");
      return;
    }
    if (!phone.trim() && !email.trim()) {
      setSubmitError("Please provide a WhatsApp phone number or email address.");
      return;
    }
    if (!hasDpdpConsent) {
      setSubmitError("Please accept the DPDP Act 2023 medical confidentiality terms.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterName: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          country: country.trim(),
          serviceType: "consultation",
          doctorName: doctor.name,
          doctorSlug: doctor.slug,
          hospital: doctor.hospital,
          procedure: selectedProcedure,
          consultationType,
          preferredDate,
          preferredSlot,
          message: notes.trim() || `Consultation booking for ${doctor.name}`,
          notes: `Consultation Mode: ${consultationType === "video" ? "Online Video" : "In-Person Hospital"} | Slot: ${preferredDate} (${preferredSlot}) | Procedure: ${selectedProcedure}`,
          sourcePath: `/doctors/${doctor.slug}`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.data?.receiptId) {
        setReceiptId(data.data.receiptId);
        setStep(3);
      } else {
        setSubmitError(data.error?.message || "Failed to register consultation. Please try again.");
      }
    } catch (err: any) {
      setSubmitError("Connection interruption. Please verify your internet and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createGoogleCalendarUrl = () => {
    const title = encodeURIComponent(`Medical Consultation with ${doctor.name}`);
    const details = encodeURIComponent(
      `Appointment Reference: ${receiptId}\nDoctor: ${doctor.name} (${doctor.specialty})\nHospital: ${doctor.hospital}\nMode: ${
        consultationType === "video" ? "Encrypted Video Call" : "In-Person Consultation"
      }\nSlot: ${preferredSlot}\n\nAkeezo Care Desk: +91 82876 39443`
    );
    const location = encodeURIComponent(
      consultationType === "video" ? "Akeezo Telehealth Secure Room" : `${doctor.hospital}, ${doctor.city}`
    );
    const dateFormatted = preferredDate.replace(/-/g, "");
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateFormatted}T090000Z/${dateFormatted}T100000Z`;
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto"
        onClick={handleCloseAttempt}
      >
        <div
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="bg-[#061E1B] text-white p-5 sm:p-6 relative">
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition"
              aria-label="Close booking modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#007A6C] text-white">
                Teleconsultation Booking
              </span>
              <span className="text-xs text-teal-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                DPDP 2023 Protected
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#00C7BE]"
              />
              <div>
                <h3 className="font-bold text-base sm:text-lg leading-tight text-white">{doctor.name}</h3>
                <p className="text-xs text-teal-200/90 leading-tight">
                  {doctor.specialty} · {doctor.hospital}
                </p>
              </div>
            </div>

            {/* Stepper Indicator */}
            {step !== 3 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-teal-900/60 text-xs">
                <span className={`font-semibold ${step === 1 ? "text-[#00C7BE]" : "text-slate-400"}`}>
                  1. Mode & Schedule
                </span>
                <span className="text-slate-600">→</span>
                <span className={`font-semibold ${step === 2 ? "text-[#00C7BE]" : "text-slate-400"}`}>
                  2. Patient Details
                </span>
                <span className="text-slate-600">→</span>
                <span className="text-slate-500">3. Confirmation</span>
              </div>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
            {submitError && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                {submitError}
              </div>
            )}

            {/* STEP 1: Mode & Schedule */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Consultation Mode
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setConsultationType("video")}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                        consultationType === "video"
                          ? "border-[#007A6C] bg-teal-50/50 ring-2 ring-[#007A6C]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          consultationType === "video" ? "bg-[#007A6C] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Online Video Call</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Encrypted teleconsultation from home prior to travel
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setConsultationType("in_person")}
                      className={`p-3.5 rounded-2xl border text-left transition flex items-start gap-3 ${
                        consultationType === "in_person"
                          ? "border-[#007A6C] bg-teal-50/50 ring-2 ring-[#007A6C]/20"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div
                        className={`p-2 rounded-xl shrink-0 ${
                          consultationType === "in_person" ? "bg-[#007A6C] text-white" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900">Hospital Appointment</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          In-person clinical evaluation at {doctor.hospital}
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Procedure Selection */}
                {doctor.procedures && doctor.procedures.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Procedure or Treatment Area
                    </label>
                    <select
                      value={selectedProcedure}
                      onChange={(e) => setSelectedProcedure(e.target.value)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                    >
                      {doctor.procedures.map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} ({p.indicativeCostUsd})
                        </option>
                      ))}
                      <option value="General Clinical Second Opinion">General Second Opinion / Other</option>
                    </select>
                  </div>
                )}

                {/* Preferred Date & Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                    >
                      <option value="Morning (09:00 - 12:00)">Morning (09:00 - 12:00)</option>
                      <option value="Afternoon (13:00 - 16:00)">Afternoon (13:00 - 16:00)</option>
                      <option value="Evening (17:00 - 20:00)">Evening (17:00 - 20:00)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-[#007A6C] hover:bg-[#005F54] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Continue to Patient Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Patient Identity & Contact */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+44 7911 123456"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Country of Residence
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. United Kingdom, USA, UAE"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Symptoms or Medical Query (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly describe prior treatments, diagnostics, or questions for Dr. Kahraman..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full text-xs font-medium px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00C7BE] resize-none"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    id="dpdp-consent"
                    type="checkbox"
                    checked={hasDpdpConsent}
                    onChange={(e) => setHasDpdpConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-[#007A6C] focus:ring-[#00C7BE]"
                  />
                  <label htmlFor="dpdp-consent" className="text-[11px] text-slate-500 leading-tight select-none">
                    I consent to sharing my clinical inquiry with {doctor.hospital} and Akeezo under the Digital Personal
                    Data Protection (DPDP) Act 2023. Data is strictly encrypted.
                  </label>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-[#FF6B00] hover:bg-[#e05f00] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Registering Appointment...</span>
                    ) : (
                      <>
                        <span>Confirm Consultation Request</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Booking Confirmation Screen */}
            {step === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    Consultation Requested
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">Appointment Successfully Registered</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    We have notified Dr. {doctor.name}&apos;s clinical team at {doctor.hospital}.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200/60">
                    <span className="text-slate-500 font-medium">Booking Receipt ID:</span>
                    <span className="font-mono font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                      {receiptId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-semibold text-slate-800">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Mode:</span>
                    <span className="font-semibold text-slate-800">
                      {consultationType === "video" ? "📹 Encrypted Video Call" : "🏥 Hospital Visit"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Requested Slot:</span>
                    <span className="font-semibold text-slate-800">
                      {preferredDate} ({preferredSlot})
                    </span>
                  </div>
                </div>

                {/* What Happens Next Timeline */}
                <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-3.5 text-left text-xs space-y-1.5">
                  <div className="font-bold text-teal-900 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#007A6C]" />
                    <span>What Happens Next?</span>
                  </div>
                  <ul className="text-[11px] text-teal-950/80 space-y-1 list-disc pl-4">
                    <li>Clinical assistant reviews your medical query (within 2 hours).</li>
                    <li>WhatsApp & email confirmation sent with secure video room link.</li>
                    <li>Dedicated Akeezo Care Coordinator assigned to guide any travel.</li>
                  </ul>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
                  <a
                    href={createGoogleCalendarUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-slate-600" />
                    <span>Add to Calendar</span>
                  </a>

                  <a
                    href="https://wa.me/918287639443?text=Hi%2C%20I%20have%20requested%20a%20consultation%20with%20Dr.%20Semra%20Kahraman"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-1/2 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp Concierge</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={resetAndClose}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DiscardConfirmDialog
        isOpen={showDiscardConfirm}
        onComplete={() => setShowDiscardConfirm(false)}
        onDiscard={resetAndClose}
        title="Discard Consultation Booking?"
        description="You have unsaved appointment details. Are you sure you want to close this window?"
      />
    </>
  );
}
