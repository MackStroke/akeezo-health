import React, { useState, useEffect } from "react";
import { Globe, X, ArrowRight } from "lucide-react";
import {
  detectUserLocationAndLanguage,
  isLanguagePromptHandled,
  setLanguagePromptHandled,
  isAutoSwitchEnabled,
  setAutoSwitchEnabled,
  saveUserLanguagePreference,
  type DetectedLocationInfo
} from "./locationLanguage.js";
import { applyLanguageTranslation, getSavedLanguageCode } from "./translation.js";

export function LocationLanguagePrompt(): React.ReactElement | null {
  const [detected, setDetected] = useState<DetectedLocationInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [autoSwitchChecked, setAutoSwitchChecked] = useState(false);
  const [autoNotification, setAutoNotification] = useState<{
    message: string;
    targetLang: string;
  } | null>(null);

  useEffect(() => {
    // Only execute on client
    if (typeof window === "undefined") return;

    let mounted = true;

    async function evaluateLocationAndLanguage() {
      // 1. If user already chose a language or handled prompt, do not prompt
      const savedLang = getSavedLanguageCode();
      const alreadyHandled = isLanguagePromptHandled();

      if (alreadyHandled && savedLang !== "en") {
        // Already configured in cookie/cache, no prompt needed
        return;
      }

      // 2. Detect location & language
      const loc = await detectUserLocationAndLanguage();
      if (!mounted) return;

      // 3. If detected language is English, nothing to switch to
      if (!loc.languageCode || loc.languageCode === "en") {
        setLanguagePromptHandled(true);
        return;
      }

      // 4. If auto-switch is enabled by user preference
      if (isAutoSwitchEnabled()) {
        applyLanguageTranslation(loc.languageCode);
        saveUserLanguagePreference(loc.languageCode, loc.countryCode);
        setAutoNotification({
          message: `Website language set to ${loc.languageName} (${loc.languageLocal}) based on your location in ${loc.countryName}.`,
          targetLang: loc.languageCode
        });
        // Auto-hide notification after 6 seconds
        setTimeout(() => {
          if (mounted) setAutoNotification(null);
        }, 6000);
        return;
      }

      // 5. If not handled yet, open confirmation prompt
      if (!alreadyHandled) {
        setDetected(loc);
        setIsOpen(true);
      }
    }

    // Small delay so page content renders smoothly first
    const timer = setTimeout(() => {
      evaluateLocationAndLanguage();
    }, 600);

    // Listen to manual language change events from header/footer to dismiss prompt
    const handleManualChange = () => {
      setIsOpen(false);
      setAutoNotification(null);
    };
    window.addEventListener("akeezo:language-change", handleManualChange);

    return () => {
      mounted = false;
      clearTimeout(timer);
      window.removeEventListener("akeezo:language-change", handleManualChange);
    };
  }, []);

  const handleSwitchLanguage = () => {
    if (!detected) return;
    if (autoSwitchChecked) {
      setAutoSwitchEnabled(true);
    }
    applyLanguageTranslation(detected.languageCode);
    saveUserLanguagePreference(detected.languageCode, detected.countryCode);
    setIsOpen(false);
  };

  const handleKeepEnglish = () => {
    if (autoSwitchChecked) {
      setAutoSwitchEnabled(false);
    }
    saveUserLanguagePreference("en", detected?.countryCode);
    setLanguagePromptHandled(true);
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setLanguagePromptHandled(true);
    setIsOpen(false);
  };

  const handleUndoAuto = () => {
    applyLanguageTranslation("en");
    saveUserLanguagePreference("en");
    setAutoSwitchEnabled(false);
    setAutoNotification(null);
  };

  // 1. Auto-switch Notification Toast
  if (autoNotification) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-24 right-4 sm:right-6 z-[9990] max-w-sm rounded-2xl bg-[#061E1B] text-white p-4 shadow-2xl border border-[#00C7BE]/30 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-300 font-sans"
      >
        <div className="flex items-start gap-3">
          <div className="size-8 rounded-full bg-[#00C7BE]/20 flex items-center justify-center shrink-0 text-[#00C7BE]">
            <Globe className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/90 leading-relaxed">
              {autoNotification.message}
            </p>
            <div className="mt-2.5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleUndoAuto}
                className="text-xs font-bold text-[#00C7BE] hover:underline cursor-pointer"
              >
                Switch back to English
              </button>
              <button
                type="button"
                onClick={() => setAutoNotification(null)}
                className="text-xs text-white/60 hover:text-white cursor-pointer ml-auto"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Location Confirmation Modal / Prompt Card
  if (!isOpen || !detected) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={`Language preference confirmation for ${detected.countryName}`}
      className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-[9990] max-w-[380px] w-[calc(100vw-2rem)] sm:w-full rounded-2xl bg-white text-ink p-5 shadow-2xl border border-border/80 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-6 duration-300 font-sans"
    >
      {/* Header with Flag & Dismiss */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <img
            src={detected.flagUrl}
            alt={detected.countryName}
            className="w-5 h-3.5 object-cover rounded-xs shadow-xs"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span className="text-[11px] font-bold uppercase tracking-wider text-action flex items-center gap-1">
            <Globe className="size-3 text-action" />
            <span>Visiting from {detected.countryName}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss language suggestion"
          className="size-7 rounded-full text-ink-muted hover:text-ink hover:bg-surface-muted flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Main Copy */}
      <h3 className="text-sm sm:text-base font-bold text-ink leading-snug">
        Browse AKEEZO in {detected.languageName}?
      </h3>
      <p className="text-xs text-ink-muted mt-1 leading-relaxed">
        We noticed your location in <strong>{detected.countryName}</strong>. You can view procedures, costs, and doctors in{" "}
        <span className="font-semibold text-action">{detected.languageLocal}</span>.
      </p>

      {/* Auto Switch Checkbox */}
      <label className="flex items-start gap-2.5 mt-3.5 pt-3 border-t border-border/60 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={autoSwitchChecked}
          onChange={(e) => setAutoSwitchChecked(e.target.checked)}
          className="size-4 rounded-sm border-gray-300 text-action focus:ring-action mt-0.5 cursor-pointer"
        />
        <span className="text-[11px] text-ink-muted leading-tight">
          Remember my choice and automatically adjust language based on location
        </span>
      </label>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-4">
        <button
          type="button"
          onClick={handleSwitchLanguage}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-action hover:bg-action-hover text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <span>Switch to {detected.languageLocal}</span>
          <ArrowRight className="size-3.5" />
        </button>
        <button
          type="button"
          onClick={handleKeepEnglish}
          className="px-3 py-2 rounded-xl border border-border hover:bg-surface-muted text-ink text-xs font-medium transition-colors cursor-pointer"
        >
          Keep English
        </button>
      </div>
    </div>
  );
}
