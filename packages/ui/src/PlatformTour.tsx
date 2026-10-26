import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import {
  Compass,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

export interface TourStep {
  id: string;
  targetSelector: string; // e.g. '[data-tour="pipeline"]' or '#quick-intake'
  title: string;
  description: React.ReactNode;
  tip?: string;
  badge?: string;
  placement?: "top" | "bottom" | "left" | "right" | "center";
}

interface TourContextValue {
  isTourActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep | null;
  totalSteps: number;
  tourId: string | null;
  startTour: (tourId: string, steps: TourStep[], forceRestart?: boolean) => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTour: () => void;
  finishTour: () => void;
  hasCompletedTour: (tourId: string) => boolean;
}

const TourContext = createContext<TourContextValue | null>(null);

export const useTour = (): TourContextValue => {
  const ctx = useContext(TourContext);
  if (!ctx) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return ctx;
};

export interface TourProviderProps {
  children: React.ReactNode;
}

export const TourProvider: React.FC<TourProviderProps> = ({ children }) => {
  const [tourId, setTourId] = useState<string | null>(null);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isTourActive, setIsTourActive] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const currentStep = steps[currentStepIndex] || null;

  const hasCompletedTour = useCallback((id: string): boolean => {
    try {
      return localStorage.getItem(`akeezo_tour_completed_${id}`) === "true";
    } catch {
      return false;
    }
  }, []);

  const markTourCompleted = useCallback((id: string) => {
    try {
      localStorage.setItem(`akeezo_tour_completed_${id}`, "true");
    } catch (e) {
      console.warn("Could not save tour state", e);
    }
  }, []);

  const startTour = useCallback(
    (id: string, newSteps: TourStep[], forceRestart = false) => {
      if (!forceRestart && hasCompletedTour(id)) {
        return;
      }
      setTourId(id);
      setSteps(newSteps);
      setCurrentStepIndex(0);
      setIsTourActive(true);
    },
    [hasCompletedTour]
  );

  const finishTour = useCallback(() => {
    if (tourId) {
      markTourCompleted(tourId);
    }
    setIsTourActive(false);
    setTargetRect(null);
  }, [tourId, markTourCompleted]);

  const skipTour = useCallback(() => {
    if (tourId) {
      markTourCompleted(tourId);
    }
    setIsTourActive(false);
    setTargetRect(null);
  }, [tourId, markTourCompleted]);

  const nextStep = useCallback(() => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      finishTour();
    }
  }, [currentStepIndex, steps.length, finishTour]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Recalculate target element position whenever step changes or window resizes
  const updateTargetRect = useCallback(() => {
    if (!isTourActive || !currentStep) {
      setTargetRect(null);
      return;
    }

    if (currentStep.placement === "center" || !currentStep.targetSelector) {
      setTargetRect(null);
      return;
    }

    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    } else {
      setTargetRect(null);
    }
  }, [isTourActive, currentStep]);

  useEffect(() => {
    updateTargetRect();
    const handleResize = () => updateTargetRect();
    const handleScroll = () => updateTargetRect();

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [updateTargetRect]);

  // Keyboard navigation
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        skipTour();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        nextStep();
      } else if (e.key === "ArrowLeft") {
        prevStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTourActive, skipTour, nextStep, prevStep]);

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        currentStep,
        totalSteps: steps.length,
        tourId,
        startTour,
        nextStep,
        prevStep,
        skipTour,
        finishTour,
        hasCompletedTour,
      }}
    >
      {children}

      {/* Spotlight Overlay & Tour Card */}
      {isTourActive && currentStep && (
        <PlatformTourModal
          step={currentStep}
          targetRect={targetRect}
          stepIndex={currentStepIndex}
          totalSteps={steps.length}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
        />
      )}
    </TourContext.Provider>
  );
};

// Spotlight & Interactive Tooltip Card
const PlatformTourModal: React.FC<{
  step: TourStep;
  targetRect: DOMRect | null;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}> = ({ step, targetRect, stepIndex, totalSteps, onNext, onPrev, onSkip }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Compute card position anchored to targetRect or centered
  const getCardStyle = (): React.CSSProperties => {
    const defaultCenter: React.CSSProperties = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
    };

    if (!targetRect || step.placement === "center") {
      return defaultCenter;
    }

    const margin = 14;
    const cardWidth = 380;
    const cardHeight = 240;

    let top = 0;
    let left = 0;

    const placement = step.placement || "bottom";

    if (placement === "bottom") {
      top = targetRect.bottom + margin;
      left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    } else if (placement === "top") {
      top = targetRect.top - cardHeight - margin;
      left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    } else if (placement === "left") {
      top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
      left = targetRect.left - cardWidth - margin;
    } else if (placement === "right") {
      top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
      left = targetRect.right + margin;
    }

    // Viewport containment clamping
    const maxLeft = window.innerWidth - cardWidth - 16;
    const maxTop = window.innerHeight - cardHeight - 16;

    left = Math.max(16, Math.min(left, maxLeft));
    top = Math.max(16, Math.min(top, maxTop));

    return {
      position: "fixed",
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999,
      width: `${cardWidth}px`,
    };
  };

  const isLast = stepIndex === totalSteps - 1;

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto font-sans">
      {/* 1. Backdrop Overlay */}
      {targetRect ? (
        // Highlighting Cutout via Box-Shadow
        <div
          style={{
            position: "fixed",
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12,
            borderRadius: "10px",
            boxShadow:
              "0 0 0 9999px rgba(6, 30, 27, 0.78), 0 0 0 3px #00C7BE, 0 0 25px rgba(0, 199, 190, 0.5)",
            zIndex: 9998,
            transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            pointerEvents: "none",
          }}
          className="animate-pulse"
        />
      ) : (
        // Plain backdrop when centered
        <div
          className="fixed inset-0 bg-[#061E1B]/80 backdrop-blur-xs transition-opacity"
          style={{ zIndex: 9998 }}
        />
      )}

      {/* 2. Interactive Step Card */}
      <div
        ref={cardRef}
        style={getCardStyle()}
        className="bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden animate-fadeIn"
      >
        {/* Card Header with Progress Bar */}
        <div className="bg-[#061E1B] px-5 py-3 text-white flex items-center justify-between border-b border-teal-950">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#007A6C] text-[#00C7BE]">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#00C7BE] uppercase tracking-wider">
              Platform Walkthrough
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full">
              {stepIndex + 1} / {totalSteps}
            </span>
            <button
              onClick={onSkip}
              title="Skip walkthrough"
              className="text-slate-400 hover:text-white p-1 rounded-md transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="h-1 bg-slate-100 w-full overflow-hidden">
          <div
            style={{ width: `${((stepIndex + 1) / totalSteps) * 100}%` }}
            className="h-full bg-[#FF6B00] transition-all duration-300"
          />
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-3">
          {step.badge && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#007A6C] border border-teal-200">
              {step.badge}
            </span>
          )}

          <h3 className="text-sm font-black text-slate-900 tracking-tight">{step.title}</h3>

          <div className="text-xs text-slate-600 leading-relaxed font-normal">
            {step.description}
          </div>

          {step.tip && (
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-snug">
                <span className="font-bold">Pro Tip: </span>
                {step.tip}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Actions */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onSkip}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            {stepIndex > 0 && (
              <button
                onClick={onPrev}
                className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={onNext}
              className="text-xs font-bold px-3.5 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white flex items-center gap-1.5 shadow-sm transition"
            >
              <span>{isLast ? "Finish Tour" : "Next Step"}</span>
              {isLast ? (
                <CheckCircle className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
