import React, { useState, useEffect } from "react";
import { X, AlertTriangle, Check, UserPlus, Link2 } from "lucide-react";
import { SPECIALTIES } from "@akeezo/contracts";
import { useToast, DisabledGuideButton } from "@akeezo/ui";
import { apiFetch } from "../utils/api.js";

interface NewCaseModalProps {
  onClose: () => void;
  onSuccess: () => void;
  partners: any[];
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  onClose,
  onSuccess,
  partners,
}) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    sex: "male",
    nationality: "UZ",
    phone: "",
    email: "",
    passportNumber: "",
    passportExpiry: "",
    partnerId: partners[0]?._id || "",
    source: "partner",
    caseType: "treatment",
    specialty: "oncology",
    diagnosisSummary: "",
    urgency: "priority",
    preferredCity: "Delhi NCR",
    budgetMinMinor: 50000000, // 5 Lakhs
    budgetMaxMinor: 100000000, // 10 Lakhs
    patientInIndia: false,
    consentShareWithHospitals: true,
    feeDisclosedToPartner: true,
  });

  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [checkingDuplicates, setCheckingDuplicates] = useState(false);
  const [selectedExistingPatientId, setSelectedExistingPatientId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const isFormValid = Boolean(
    formData.fullName.trim().length >= 2 &&
      formData.dateOfBirth &&
      (formData.phone.trim().length >= 5 || formData.email.trim().length >= 5) &&
      formData.consentShareWithHospitals
  );

  // Live duplicate detection effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        formData.passportNumber.trim().length >= 4 ||
        (formData.fullName.trim().length >= 3 && formData.dateOfBirth)
      ) {
        checkDuplicates();
      } else {
        setDuplicates([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [formData.passportNumber, formData.fullName, formData.dateOfBirth]);

  const checkDuplicates = async () => {
    try {
      setCheckingDuplicates(true);
      const params = new URLSearchParams();
      if (formData.passportNumber) params.append("passport", formData.passportNumber);
      if (formData.fullName) params.append("name", formData.fullName);
      if (formData.dateOfBirth) params.append("dob", formData.dateOfBirth);

      const res = await apiFetch(`/api/v1/patients/duplicates?${params.toString()}`);
      const json = await res.json();
      setDuplicates(json.data || []);
    } catch (err) {
      console.error("Duplicate check error", err);
    } finally {
      setCheckingDuplicates(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        patient: {
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          sex: formData.sex,
          nationality: formData.nationality,
          phone: formData.phone,
          email: formData.email,
          passportNumber: formData.passportNumber,
          passportExpiry: formData.passportExpiry,
        },
        existingPatientId: selectedExistingPatientId || undefined,
        partnerId: formData.partnerId || undefined,
        source: formData.source,
        caseType: formData.caseType,
        specialty: formData.specialty,
        diagnosisSummary: formData.diagnosisSummary,
        urgency: formData.urgency,
        preferredCity: formData.preferredCity,
        budgetMinMinor: formData.budgetMinMinor,
        budgetMaxMinor: formData.budgetMaxMinor,
        patientInIndia: formData.patientInIndia,
        consentShareWithHospitals: formData.consentShareWithHospitals,
        feeDisclosedToPartner: formData.feeDisclosedToPartner,
        ownerId: "67b938000000000000000001", // Priya Sharma / Default coordinator
      };

      const res = await apiFetch("/api/v1/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        toast.success(
          `Patient case ${json.data?.caseCode || ""} registered into pipeline successfully!`,
          { title: "Intake Complete" }
        );
        onSuccess();
      } else {
        const err = await res.json();
        toast.error(err.error?.message || "Failed to create case", { title: "Intake Failed" });
      }
    } catch (err: any) {
      toast.error(err.message, { title: "Network Error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#061E1B]/60 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="px-6 py-4 bg-[#061E1B] text-white flex items-center justify-between shrink-0 border-b border-teal-950">
          <div>
            <h2 className="text-base font-black tracking-tight text-white">
              New Patient Referral Intake
            </h2>
            <p className="text-[11px] text-teal-300/80">
              Captures patient, partner, clinical diagnosis, and consent evidence.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Duplicate Warning Banner */}
        {duplicates.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 p-4 shrink-0">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Potential Existing Patient Match Found!</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {duplicates.map((dup) => (
                <div
                  key={dup.id}
                  className="bg-white p-2.5 rounded-lg border border-amber-300 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{dup.fullName}</span> (
                    {dup.nationality || "Intl"}) · DOB: {dup.dateOfBirth || "N/A"} ·{" "}
                    {dup.caseCount} existing case(s)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedExistingPatientId(dup.id);
                      setFormData({ ...formData, fullName: dup.fullName });
                    }}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition ${
                      selectedExistingPatientId === dup.id
                        ? "bg-teal-700 text-white"
                        : "bg-amber-100 hover:bg-amber-200 text-amber-900"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5" />
                    <span>
                      {selectedExistingPatientId === dup.id ? "Linked" : "Link to Patient"}
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Section 1: Partner */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Referring Partner
            </label>
            <select
              value={formData.partnerId}
              onChange={(e) => setFormData({ ...formData, partnerId: e.target.value })}
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-medium"
            >
              {partners.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.partnerCode}) - {p.country}
                </option>
              ))}
            </select>
          </div>

          {/* Section 2: Patient */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Patient Full Name *
              </label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Farid Ahmed"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Date of Birth (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Passport Number
              </label>
              <input
                type="text"
                value={formData.passportNumber}
                onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                placeholder="Encrypted AES-256"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nationality (ISO-2)
              </label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                placeholder="UZ, KE, NG"
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone (with code)
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+998..."
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
              />
            </div>
          </div>

          {/* Section 3: Medical Need */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Medical Specialty *
              </label>
              <select
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 capitalize"
              >
                {SPECIALTIES.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600 uppercase"
              >
                <option value="routine">Routine</option>
                <option value="priority">Priority</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Diagnosis Summary & Treatment Goal *
            </label>
            <textarea
              required
              rows={3}
              value={formData.diagnosisSummary}
              onChange={(e) => setFormData({ ...formData, diagnosisSummary: e.target.value })}
              placeholder="Clinical summary, history, previous interventions, scans available..."
              className="w-full text-xs p-2.5 bg-slate-50 border rounded-lg focus:outline-teal-600"
            />
          </div>

          {/* Consents & Disclosure */}
          <div className="p-3 bg-slate-50 border rounded-lg space-y-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={formData.consentShareWithHospitals}
                onChange={(e) =>
                  setFormData({ ...formData, consentShareWithHospitals: e.target.checked })
                }
                className="rounded text-teal-600"
              />
              <span>Patient consented to sharing medical records with hospitals (DPDP 2023)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
              <input
                type="checkbox"
                checked={formData.feeDisclosedToPartner}
                onChange={(e) =>
                  setFormData({ ...formData, feeDisclosedToPartner: e.target.checked })
                }
                className="rounded text-teal-600"
              />
              <span>Akeezo facilitation fee terms disclosed to partner / patient</span>
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs px-4 py-2 border rounded-lg text-slate-600"
            >
              Cancel
            </button>
            <DisabledGuideButton
              type="submit"
              disabled={!isFormValid || submitting}
              reasonTitle="Case Intake Incomplete"
              reasonMessage="Essential patient identification and contact details are required to initialize a compliant DPDP healthcare case."
              requirements={[
                {
                  label: "Patient Full Legal Name",
                  fulfilled: formData.fullName.trim().length >= 2,
                  tip: "Must match passport identity",
                },
                {
                  label: "Date of Birth",
                  fulfilled: Boolean(formData.dateOfBirth),
                  tip: "Required for clinical identification",
                },
                {
                  label: "Contact Phone or Email",
                  fulfilled: Boolean(
                    formData.phone.trim().length >= 5 || formData.email.trim().length >= 5
                  ),
                  tip: "Needed for clinical triage and WhatsApp notifications",
                },
                {
                  label: "DPDP Hospital Record Consent",
                  fulfilled: formData.consentShareWithHospitals,
                  tip: "Consent required under India DPDP Act 2023",
                },
              ]}
              stepsToEnable={[
                "Enter the patient's full legal name as shown on their passport.",
                "Select their date of birth.",
                "Provide a reachable phone number or email address.",
                "Confirm that the patient consented to share medical records with hospitals.",
              ]}
              placement="top"
              className={`text-xs px-5 py-2 font-bold rounded-lg shadow-sm transition ${
                isFormValid && !submitting
                  ? "bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {submitting ? "Creating..." : "Create Case & Enter Pipeline"}
            </DisabledGuideButton>
          </div>
        </form>
      </div>
    </div>
  );
};
