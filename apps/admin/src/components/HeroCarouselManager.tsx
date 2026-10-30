import React, { useState, useEffect, useCallback } from "react";
import {
  Calculator,
  Compass,
  Stethoscope,
  Shield,
  Heart,
  Award,
  Activity,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Check,
  Save,
  RotateCcw,
  Eye,
  ExternalLink,
  AlertCircle,
  Sliders
} from "lucide-react";
import { DEFAULT_CAROUSEL_SLIDES, type CarouselSlide } from "@akeezo/contracts";

const AVAILABLE_ICONS = [
  { id: "calculator", label: "Calculator", Icon: Calculator },
  { id: "compass", label: "Compass / Explore", Icon: Compass },
  { id: "stethoscope", label: "Stethoscope / Opinion", Icon: Stethoscope },
  { id: "shield", label: "Shield / Visa / Trust", Icon: Shield },
  { id: "heart", label: "Heart / Care", Icon: Heart },
  { id: "award", label: "Award / JCI", Icon: Award },
  { id: "activity", label: "Activity / Recovery", Icon: Activity },
  { id: "sparkles", label: "Sparkles / VIP", Icon: Sparkles },
];

const AVAILABLE_ACCENTS = [
  { id: "orange", label: "Orange (Default Akeezo)", border: "border-orange-300", bg: "bg-orange-50", badge: "text-orange-700 bg-orange-100", btn: "bg-[#FF6B00]" },
  { id: "teal", label: "Teal (Akeezo Clinical)", border: "border-teal-300", bg: "bg-teal-50", badge: "text-teal-700 bg-teal-100", btn: "bg-[#007A6C]" },
  { id: "purple", label: "Purple (Specialty / VIP)", border: "border-purple-300", bg: "bg-purple-50", badge: "text-purple-700 bg-purple-100", btn: "bg-purple-600" },
  { id: "emerald", label: "Emerald (Visa / FRRO)", border: "border-emerald-300", bg: "bg-emerald-50", badge: "text-emerald-700 bg-emerald-100", btn: "bg-emerald-600" },
  { id: "blue", label: "Blue (Global Patients)", border: "border-blue-300", bg: "bg-blue-50", badge: "text-blue-700 bg-blue-100", btn: "bg-blue-600" },
];

const BUTTON_ACTIONS = [
  { id: "calculator", label: "Open Cost Calculator Modal" },
  { id: "explore", label: "Open Specialities Directory Modal" },
  { id: "whatsapp", label: "Direct WhatsApp Care Concierge" },
  { id: "link", label: "Navigate to Custom URL or Page Route" },
];

function renderSlideIcon(iconName?: string, className = "w-5 h-5") {
  switch (iconName?.toLowerCase()) {
    case "compass":
      return <Compass className={className} />;
    case "stethoscope":
      return <Stethoscope className={className} />;
    case "shield":
      return <Shield className={className} />;
    case "heart":
      return <Heart className={className} />;
    case "award":
      return <Award className={className} />;
    case "activity":
      return <Activity className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "calculator":
    default:
      return <Calculator className={className} />;
  }
}

export const HeroCarouselManager: React.FC = () => {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/v1/admin/carousel-slides");
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setSlides(json.data);
          return;
        }
      }
      // Fallback to site-settings
      const siteRes = await fetch("/api/v1/admin/site-settings");
      if (siteRes.ok) {
        const siteJson = await siteRes.json();
        if (siteJson.data?.carouselSlides && siteJson.data.carouselSlides.length > 0) {
          setSlides(siteJson.data.carouselSlides);
          return;
        }
      }
      setSlides(DEFAULT_CAROUSEL_SLIDES);
    } catch (err: any) {
      console.warn("Could not load carousel slides, using defaults", err);
      setSlides(DEFAULT_CAROUSEL_SLIDES);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (newSlides?: CarouselSlide[]) => {
    try {
      setSaving(true);
      setSaveSuccess(null);
      setError(null);
      const payload = newSlides || slides;

      const res = await fetch("/api/v1/admin/carousel-slides", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides: payload }),
      });

      if (!res.ok) {
        // Fallback to updating site-settings directly
        const fallbackRes = await fetch("/api/v1/admin/site-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ carouselSlides: payload }),
        });
        if (!fallbackRes.ok) {
          throw new Error("Server rejected carousel update.");
        }
      }

      setIsDirty(false);
      setSaveSuccess(`Feature carousel saved and published live at ${new Date().toLocaleTimeString()}!`);
      setTimeout(() => setSaveSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to save carousel slides.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = async () => {
    if (!window.confirm("Reset all carousel cards back to Akeezo default configuration? Any custom cards will be replaced.")) {
      return;
    }
    try {
      setSaving(true);
      const res = await fetch("/api/v1/admin/carousel-slides/reset", {
        method: "POST",
      });
      if (res.ok) {
        const json = await res.json();
        setSlides(json.data || DEFAULT_CAROUSEL_SLIDES);
      } else {
        setSlides(DEFAULT_CAROUSEL_SLIDES);
        await handleSaveAll(DEFAULT_CAROUSEL_SLIDES);
      }
      setIsDirty(false);
      setPreviewIndex(0);
      setSaveSuccess("Carousel reset to original 4 defaults.");
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const updated = [...slides];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Reassign order
    const ordered = updated.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSlides(ordered);
    setIsDirty(true);
  };

  const handleToggleActive = (id: string) => {
    const updated = slides.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s));
    setSlides(updated);
    setIsDirty(true);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this feature card?")) return;
    const updated = slides.filter((s) => s.id !== id).map((s, idx) => ({ ...s, order: idx + 1 }));
    setSlides(updated);
    setIsDirty(true);
  };

  const handleSaveModal = (slide: CarouselSlide) => {
    if (isAddingNew) {
      const newSlide: CarouselSlide = {
        ...slide,
        id: slide.id || `card-${Date.now()}`,
        order: slides.length + 1,
      };
      setSlides([...slides, newSlide]);
    } else {
      setSlides(slides.map((s) => (s.id === slide.id ? slide : s)));
    }
    setEditingSlide(null);
    setIsAddingNew(false);
    setIsDirty(true);
  };

  const activeSlides = slides.filter((s) => s.isActive !== false);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500">
        <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-semibold">Loading Hero Feature Carousel...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F8F6] text-[#007A6C] border border-[#00C7BE]/30 mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Homepage Carousel</span>
          </div>
          <h2 className="text-lg font-black text-slate-900">Hero Feature Carousel (#main-content &gt; section.py-6 &gt; div)</h2>
          <p className="text-xs text-slate-500">
            Manage the prominent feature cards row on the public homepage. Rearrange, toggle visibility, customize styles, and test actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefaults}
            disabled={saving}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Reset to 4 default cards"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setEditingSlide({
                id: `slide-${Date.now()}`,
                title: "New Patient Feature",
                description: "Describe the patient tool, second opinion service, or benefit.",
                badgeText: "New Tool",
                badgeStyle: "teal",
                buttonText: "Learn More",
                buttonAction: "explore",
                buttonLink: "/hospitals",
                accentColor: "teal",
                iconName: "compass",
                isActive: true,
                order: slides.length + 1,
              });
              setIsAddingNew(true);
            }}
            className="px-3.5 py-2 text-xs font-bold text-[#007A6C] bg-[#E6F8F6] hover:bg-[#B2EBE4] border border-[#00C7BE]/40 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Card</span>
          </button>
          <button
            type="button"
            onClick={() => handleSaveAll()}
            disabled={saving || !isDirty}
            className={`px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
              isDirty
                ? "bg-[#007A6C] hover:bg-[#005F54] animate-pulse"
                : "bg-slate-400 opacity-60 cursor-not-allowed"
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Publishing..." : isDirty ? "Save & Publish Changes" : "Published"}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* LIVE HOMEPAGE PREVIEW */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Eye className="w-4 h-4 text-[#007A6C]" />
            <span>Interactive Live Preview (What Patients See on /)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPreviewIndex((prev) => (prev <= 0 ? Math.max(0, activeSlides.length - 2) : prev - 1))}
              disabled={activeSlides.length <= 2}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setPreviewIndex((prev) => (prev >= Math.max(0, activeSlides.length - 2) ? 0 : prev + 1))}
              disabled={activeSlides.length <= 2}
              className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Carousel Preview Frame */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4">
          <div
            className="flex gap-4 transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(calc(-${previewIndex} * (50% + 8px)))`,
            }}
          >
            {activeSlides.map((slide) => {
              const accentInfo = AVAILABLE_ACCENTS.find((a) => a.id === slide.accentColor) || AVAILABLE_ACCENTS[0];
              return (
                <div
                  key={slide.id}
                  className={`w-[calc(50%-8px)] shrink-0 rounded-2xl border ${accentInfo.border} ${accentInfo.bg} p-5 flex flex-col justify-between min-h-[220px] shadow-xs relative overflow-hidden`}
                >
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs">
                        {renderSlideIcon(slide.iconName)}
                      </div>
                      {slide.badgeText && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${accentInfo.badge}`}>
                          {slide.badgeText}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{slide.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{slide.description}</p>
                  </div>

                  <div className="relative z-10 pt-4 flex items-center justify-between border-t border-slate-200/50 mt-2">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold text-white ${accentInfo.btn}`}>
                      {slide.buttonText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Action: {BUTTON_ACTIONS.find((b) => b.id === slide.buttonAction)?.label || slide.buttonAction}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CARDS LIST & CONTROLS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">Configured Cards ({slides.length})</h3>
          <span className="text-xs text-slate-500">
            {activeSlides.length} active / {slides.length - activeSlides.length} hidden
          </span>
        </div>

        <div className="grid gap-3">
          {slides.map((slide, index) => {
            const accentInfo = AVAILABLE_ACCENTS.find((a) => a.id === slide.accentColor) || AVAILABLE_ACCENTS[0];
            return (
              <div
                key={slide.id}
                className={`p-4 rounded-xl border transition ${
                  slide.isActive
                    ? "bg-white border-slate-200 hover:border-slate-300"
                    : "bg-slate-50 border-slate-200 opacity-60"
                } flex flex-col md:flex-row md:items-center justify-between gap-4`}
              >
                {/* Left: Reorder & Icon & Details */}
                <div className="flex items-start md:items-center gap-3 min-w-0">
                  {/* Reordering */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleMove(index, "up")}
                      disabled={index === 0}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move card up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, "down")}
                      disabled={index === slides.length - 1}
                      className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-30 cursor-pointer"
                      title="Move card down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Icon badge */}
                  <div
                    className={`w-10 h-10 rounded-xl ${accentInfo.bg} border ${accentInfo.border} flex items-center justify-center text-slate-800 shrink-0`}
                  >
                    {renderSlideIcon(slide.iconName)}
                  </div>

                  {/* Card Title & Snippet */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black text-slate-900">{slide.title}</span>
                      {slide.badgeText && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${accentInfo.badge}`}>
                          {slide.badgeText}
                        </span>
                      )}
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                        id: {slide.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate max-w-xl mt-0.5">{slide.description}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>
                        Button: <strong className="text-slate-700">{slide.buttonText}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Action: <strong className="text-slate-700">{slide.buttonAction}</strong>
                      </span>
                      {slide.buttonLink && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-[150px] font-mono text-[10px]">
                            {slide.buttonLink}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {/* Active Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => handleToggleActive(slide.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                      slide.isActive
                        ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                        : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${slide.isActive ? "bg-emerald-600" : "bg-slate-500"}`} />
                    <span>{slide.isActive ? "Active" : "Inactive"}</span>
                  </button>

                  {/* Edit button */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSlide({ ...slide });
                      setIsAddingNew(false);
                    }}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="Edit card"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleDelete(slide.id)}
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer"
                    title="Delete card"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* EDIT / ADD MODAL */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">
                {isAddingNew ? "Add Feature Carousel Card" : "Edit Feature Card"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setEditingSlide(null);
                  setIsAddingNew(false);
                }}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Card ID */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Card ID (DOM Anchor / Unique Identifier)</label>
                <input
                  type="text"
                  value={editingSlide.id}
                  disabled={!isAddingNew}
                  onChange={(e) => setEditingSlide({ ...editingSlide, id: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })}
                  placeholder="e.g. calculator, destinations, second-opinion"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono disabled:bg-slate-100 disabled:text-slate-500"
                />
                <span className="text-[10px] text-slate-400">Used for DOM element id and direct anchor jumps.</span>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Heading</label>
                <input
                  type="text"
                  value={editingSlide.title}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  placeholder="e.g. Get Your Personalized Price"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Description</label>
                <textarea
                  rows={3}
                  value={editingSlide.description}
                  onChange={(e) => setEditingSlide({ ...editingSlide, description: e.target.value })}
                  placeholder="Detailed explanation of the patient benefit..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Badge Text & Style */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={editingSlide.badgeText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                    placeholder="e.g. Save Up To 70%"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Theme Accent Color</label>
                  <select
                    value={editingSlide.accentColor}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        accentColor: e.target.value,
                        badgeStyle: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs capitalize"
                  >
                    {AVAILABLE_ACCENTS.map((accent) => (
                      <option key={accent.id} value={accent.id}>
                        {accent.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Card Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {AVAILABLE_ICONS.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setEditingSlide({ ...editingSlide, iconName: item.id })}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        editingSlide.iconName === item.id
                          ? "border-[#007A6C] bg-[#E6F8F6] text-[#007A6C] font-bold"
                          : "border-slate-200 hover:border-slate-300 text-slate-600"
                      }`}
                    >
                      <item.Icon className="w-4 h-4" />
                      <span className="text-[10px] truncate max-w-full">{item.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Text & Action */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={editingSlide.buttonText}
                    onChange={(e) => setEditingSlide({ ...editingSlide, buttonText: e.target.value })}
                    placeholder="e.g. Get Your Estimate in 1 Minute"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Button Action</label>
                  <select
                    value={editingSlide.buttonAction}
                    onChange={(e) => setEditingSlide({ ...editingSlide, buttonAction: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    {BUTTON_ACTIONS.map((action) => (
                      <option key={action.id} value={action.id}>
                        {action.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Button Link */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Button Link URL / Route</label>
                <input
                  type="text"
                  value={editingSlide.buttonLink || ""}
                  onChange={(e) => setEditingSlide({ ...editingSlide, buttonLink: e.target.value })}
                  placeholder="e.g. /cost-calculator, /hospitals, /#opinion"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="slide-active"
                  checked={editingSlide.isActive}
                  onChange={(e) => setEditingSlide({ ...editingSlide, isActive: e.target.checked })}
                  className="rounded border-slate-300 text-[#007A6C] focus:ring-[#007A6C]"
                />
                <label htmlFor="slide-active" className="font-bold text-slate-700 cursor-pointer">
                  Card is active and visible in public carousel
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setEditingSlide(null);
                  setIsAddingNew(false);
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSaveModal(editingSlide)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#007A6C] hover:bg-[#005F54] rounded-xl shadow-xs transition cursor-pointer"
              >
                {isAddingNew ? "Add Card to Carousel" : "Update Card"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
