import React, { useState } from "react";
import { X, HelpCircle, CheckCircle2, Send } from "lucide-react";
import { DiscardConfirmDialog } from "./DiscardConfirmDialog.js";

interface AskCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onThreadCreated?: (newThread: any) => void;
}

const CATEGORIES = [
  "Cosmetic & Plastic Surgery",
  "IVF & Fertility Treatment",
  "Hair Transplant",
  "Dental Care",
  "Orthopedics & Spine",
  "Bariatric & Weight Loss",
  "Cardiac & Oncology",
  "Travel, Visa & Logistics",
];

export const AskCommunityModal: React.FC<AskCommunityModalProps> = ({
  isOpen,
  onClose,
  onThreadCreated,
}) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorCountry, setAuthorCountry] = useState("United States");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dpdpConsent, setDpdpConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");

  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  if (!isOpen) return null;

  const hasDirtyInput = title.trim().length > 0 || content.trim().length > 0 || tagsInput.trim().length > 0;

  const handleCloseAttempt = () => {
    if (hasDirtyInput && !success) {
      setShowDiscardDialog(true);
    } else {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setShowDiscardDialog(false);
    setTitle("");
    setContent("");
    setTagsInput("");
    setAuthorName("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 10) {
      setError("Please provide a question title with at least 10 characters.");
      return;
    }
    if (content.trim().length < 20) {
      setError("Please explain your medical or travel question in at least 20 characters.");
      return;
    }
    if (!dpdpConsent) {
      setError("Please consent to the DPDP Act 2023 healthcare community guidelines.");
      return;
    }

    setLoading(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    try {
      const res = await fetch("/api/v1/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          content: content.trim(),
          tags,
          authorName: authorName.trim() || "International Patient",
          authorCountry: authorCountry.trim() || "International Patient",
          isAnonymous,
          isStory: false,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit question");
      }

      setSuccess(true);
      setCreatedSlug(json.data.slug);
      if (onThreadCreated) {
        onThreadCreated(json.data);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans"
        onClick={handleCloseAttempt}
      >
        <div
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
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
                <HelpCircle className="size-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-200">
                  Ask CMA & Akeezo Community
                </span>
                <h2 className="text-lg sm:text-xl font-bold leading-tight">
                  Ask Medical Travel Question
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  Get answers from verified international patients and specialist doctors.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Question Published to Community!</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Your question has been posted to the Akeezo community. Accredited doctors and experienced patients will be able to view and answer it.
                </p>
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`/community/${createdSlug}`}
                    className="inline-flex items-center gap-2 bg-[#007A6C] hover:bg-[#006357] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-all"
                  >
                    View Your Question
                  </a>
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold">
                    {error}
                  </div>
                )}

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Select Topic Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs font-semibold text-gray-800 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-[#007A6C] transition-colors cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Question Headline <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Is Rhinoplasty at Yanhee Hospital safe for international travelers?"
                    className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-[#007A6C] transition-colors"
                    maxLength={160}
                    required
                  />
                  <span className="block text-[10px] text-gray-400 mt-1">
                    Be specific about procedure, destination country, or hospital name ({160 - title.length} chars left)
                  </span>
                </div>

                {/* Detailed Content */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Details & Clinical Context <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide details about your medical condition, current recommendations, intended travel dates, or specific questions for doctors and past patients..."
                    className="w-full text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:bg-white focus:border-[#007A6C] transition-colors resize-none"
                    required
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. YanheeHospital, Rhinoplasty, RecoveryTime, Visa"
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 outline-none focus:bg-white focus:border-[#007A6C] transition-colors"
                  />
                </div>

                {/* Author Info & Country */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Your Name / Display Alias
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={isAnonymous ? "Anonymous Patient" : "e.g. Sarah M."}
                      disabled={isAnonymous}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-[#007A6C] disabled:opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Your Country of Origin
                    </label>
                    <select
                      value={authorCountry}
                      onChange={(e) => setAuthorCountry(e.target.value)}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-[#007A6C] cursor-pointer"
                    >
                      <option value="United States">United States (US)</option>
                      <option value="United Kingdom">United Kingdom (UK)</option>
                      <option value="United Arab Emirates">United Arab Emirates (UAE)</option>
                      <option value="Canada">Canada (CA)</option>
                      <option value="Australia">Australia (AU)</option>
                      <option value="Germany">Germany (DE)</option>
                      <option value="Nigeria">Nigeria (NG)</option>
                      <option value="Kenya">Kenya (KE)</option>
                      <option value="International Patient">Other International</option>
                    </select>
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="size-4 rounded text-[#007A6C] focus:ring-[#007A6C] cursor-pointer"
                  />
                  <span className="text-xs text-gray-700 font-medium">
                    Post anonymously (your name will appear as "Anonymous Patient")
                  </span>
                </label>

                {/* DPDP Consent */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    className="mt-0.5 size-4 rounded text-[#007A6C] focus:ring-[#007A6C] cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-500 leading-snug">
                    I agree to the Akeezo Community Guidelines. I understand this forum is informational and does not constitute a formal doctor-patient relationship. Protected under DPDP Act 2023.
                  </span>
                </label>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCloseAttempt}
                    className="text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 bg-[#FF6D1B] hover:bg-[#e65c0d] text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="size-3.5" />
                    <span>{loading ? "Posting..." : "Post Question"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <DiscardConfirmDialog
        isOpen={showDiscardDialog}
        onComplete={() => setShowDiscardDialog(false)}
        onDiscard={resetAndClose}
        title="Discard community question?"
        description="You have written a question. Would you like to stay and publish it or discard your entry?"
      />
    </>
  );
};
