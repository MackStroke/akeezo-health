import React, { useState } from "react";
import { X, Sparkles, Star, CheckCircle2, Send } from "lucide-react";
import { DiscardConfirmDialog } from "./DiscardConfirmDialog.js";

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated?: (newStory: any) => void;
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

export const ShareStoryModal: React.FC<ShareStoryModalProps> = ({
  isOpen,
  onClose,
  onStoryCreated,
}) => {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [title, setTitle] = useState("");
  const [procedure, setProcedure] = useState("");
  const [hospitalName, setHospitalName] = useState("");
  const [costUsd, setCostUsd] = useState("");
  const [recoveryDays, setRecoveryDays] = useState(14);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorCountry, setAuthorCountry] = useState("United Kingdom");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [dpdpConsent, setDpdpConsent] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdSlug, setCreatedSlug] = useState("");

  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  if (!isOpen) return null;

  const hasDirtyInput =
    title.trim().length > 0 ||
    content.trim().length > 0 ||
    procedure.trim().length > 0 ||
    hospitalName.trim().length > 0;

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
    setProcedure("");
    setHospitalName("");
    setCostUsd("");
    setContent("");
    setAuthorName("");
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 10) {
      setError("Please provide a story title with at least 10 characters.");
      return;
    }
    if (content.trim().length < 25) {
      setError("Please provide a narrative of your journey with at least 25 characters.");
      return;
    }
    if (!dpdpConsent) {
      setError("Please consent to the community guidelines.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/v1/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          tags: [hospitalName.replace(/\s+/g, ""), procedure.replace(/\s+/g, ""), "PatientStory"].filter(Boolean),
          content: content.trim(),
          authorName: authorName.trim() || "International Patient",
          authorCountry: authorCountry.trim() || "International Patient",
          isAnonymous,
          isStory: true,
          storyDetails: {
            hospitalName: hospitalName.trim() || "International Hospital",
            procedure: procedure.trim() || "Medical Procedure",
            costUsd: costUsd.trim() ? (costUsd.startsWith("$") ? costUsd : `$${costUsd}`) : "$3,000",
            recoveryDays: Number(recoveryDays) || 14,
            rating: Number(rating) || 5,
          },
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit story");
      }

      setSuccess(true);
      setCreatedSlug(json.data.slug);
      if (onStoryCreated) {
        onStoryCreated(json.data);
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
          <div className="relative bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5 sm:p-6 shrink-0">
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
                <Sparkles className="size-6 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-200">
                  Real Medical Tourism Experience
                </span>
                <h2 className="text-lg sm:text-xl font-bold leading-tight">
                  Share Your Medical Travel Journey
                </h2>
                <p className="text-xs text-white/80 mt-0.5">
                  Help fellow medical travelers with honest insights, costs paid, and recovery advice.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-1">
            {success ? (
              <div className="text-center py-6 space-y-4">
                <div className="size-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="size-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Your Journey Story is Published!</h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Thank you for empowering patients worldwide. Your journey is now live on the Akeezo Community.
                </p>
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={`/community/${createdSlug}`}
                    className="inline-flex items-center gap-2 bg-[#007A6C] hover:bg-[#006357] text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-xs transition-all"
                  >
                    View Your Story
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

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Story Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My Knee Replacement Journey at Medanta: From London to Delhi"
                    className="w-full text-sm font-semibold text-gray-900 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:bg-white focus:border-amber-600 transition-colors"
                    required
                  />
                </div>

                {/* Procedure & Hospital */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      Medical Procedure <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={procedure}
                      onChange={(e) => setProcedure(e.target.value)}
                      placeholder="e.g. Bilateral Knee Replacement"
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      Hospital / Clinic <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={hospitalName}
                      onChange={(e) => setHospitalName(e.target.value)}
                      placeholder="e.g. Medanta The Medicity, Gurugram"
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600"
                      required
                    />
                  </div>
                </div>

                {/* Category & Cost */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600 cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      Total Cost (USD)
                    </label>
                    <input
                      type="text"
                      value={costUsd}
                      onChange={(e) => setCostUsd(e.target.value)}
                      placeholder="e.g. $4,800"
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                      Recovery Days
                    </label>
                    <input
                      type="number"
                      value={recoveryDays}
                      onChange={(e) => setRecoveryDays(Number(e.target.value))}
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600"
                      min={1}
                      max={365}
                    />
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Your Overall Hospital & Care Experience
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 rounded-md hover:bg-amber-50 cursor-pointer"
                        aria-label={`${star} star rating`}
                      >
                        <Star
                          className={`size-6 ${
                            star <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-gray-700 ml-2">{rating}.0 / 5 Stars</span>
                  </div>
                </div>

                {/* Narrative */}
                <div>
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
                    Your Full Journey Narrative <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share what led you to travel abroad, how consultations went, hospital stay experience, pain management, recovery milestones, and advice for future patients..."
                    className="w-full text-xs text-gray-800 bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:bg-white focus:border-amber-600 transition-colors resize-none"
                    required
                  />
                </div>

                {/* Author Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Author Name / Alias
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder={isAnonymous ? "Anonymous Patient" : "e.g. Arthur P."}
                      disabled={isAnonymous}
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Home Country
                    </label>
                    <input
                      type="text"
                      value={authorCountry}
                      onChange={(e) => setAuthorCountry(e.target.value)}
                      placeholder="e.g. United Kingdom"
                      className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:border-amber-600"
                    />
                  </div>
                </div>

                {/* Anonymous Toggle */}
                <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="size-4 rounded text-amber-600 focus:ring-amber-600 cursor-pointer"
                  />
                  <span className="text-xs text-gray-700 font-medium">
                    Post anonymously without displaying full name
                  </span>
                </label>

                {/* DPDP Consent */}
                <label className="flex items-start gap-2.5 pt-1 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={dpdpConsent}
                    onChange={(e) => setDpdpConsent(e.target.checked)}
                    className="mt-0.5 size-4 rounded text-amber-600 focus:ring-amber-600 cursor-pointer"
                  />
                  <span className="text-[11px] text-gray-500 leading-snug">
                    I confirm this review represents my authentic medical experience abroad. Protected under DPDP Act 2023.
                  </span>
                </label>

                {/* Footer Buttons */}
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
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="size-3.5" />
                    <span>{loading ? "Publishing..." : "Publish Journey Story"}</span>
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
        title="Discard patient journey story?"
        description="You have written your medical experience. Would you like to stay and complete it or discard it?"
      />
    </>
  );
};
