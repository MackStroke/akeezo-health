import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { Compass, ChevronRight, ChevronLeft, X, CheckCircle, Lightbulb, } from "lucide-react";
const TourContext = createContext(null);
export const useTour = () => {
    const ctx = useContext(TourContext);
    if (!ctx) {
        throw new Error("useTour must be used within a TourProvider");
    }
    return ctx;
};
export const TourProvider = ({ children }) => {
    const [tourId, setTourId] = useState(null);
    const [steps, setSteps] = useState([]);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isTourActive, setIsTourActive] = useState(false);
    const [targetRect, setTargetRect] = useState(null);
    const currentStep = steps[currentStepIndex] || null;
    const hasCompletedTour = useCallback((id) => {
        try {
            return localStorage.getItem(`akeezo_tour_completed_${id}`) === "true";
        }
        catch {
            return false;
        }
    }, []);
    const markTourCompleted = useCallback((id) => {
        try {
            localStorage.setItem(`akeezo_tour_completed_${id}`, "true");
        }
        catch (e) {
            console.warn("Could not save tour state", e);
        }
    }, []);
    const startTour = useCallback((id, newSteps, forceRestart = false) => {
        if (!forceRestart && hasCompletedTour(id)) {
            return;
        }
        setTourId(id);
        setSteps(newSteps);
        setCurrentStepIndex(0);
        setIsTourActive(true);
    }, [hasCompletedTour]);
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
        }
        else {
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
        }
        else {
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
        if (!isTourActive)
            return;
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                skipTour();
            }
            else if (e.key === "ArrowRight" || e.key === "Enter") {
                nextStep();
            }
            else if (e.key === "ArrowLeft") {
                prevStep();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isTourActive, skipTour, nextStep, prevStep]);
    return (_jsxs(TourContext.Provider, { value: {
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
        }, children: [children, isTourActive && currentStep && (_jsx(PlatformTourModal, { step: currentStep, targetRect: targetRect, stepIndex: currentStepIndex, totalSteps: steps.length, onNext: nextStep, onPrev: prevStep, onSkip: skipTour }))] }));
};
// Spotlight & Interactive Tooltip Card
const PlatformTourModal = ({ step, targetRect, stepIndex, totalSteps, onNext, onPrev, onSkip }) => {
    const cardRef = useRef(null);
    // Compute card position anchored to targetRect or centered
    const getCardStyle = () => {
        const defaultCenter = {
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
        }
        else if (placement === "top") {
            top = targetRect.top - cardHeight - margin;
            left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
        }
        else if (placement === "left") {
            top = targetRect.top + targetRect.height / 2 - cardHeight / 2;
            left = targetRect.left - cardWidth - margin;
        }
        else if (placement === "right") {
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
    return (_jsxs("div", { className: "fixed inset-0 z-50 pointer-events-auto font-sans", children: [targetRect ? (
            // Highlighting Cutout via Box-Shadow
            _jsx("div", { style: {
                    position: "fixed",
                    top: targetRect.top - 6,
                    left: targetRect.left - 6,
                    width: targetRect.width + 12,
                    height: targetRect.height + 12,
                    borderRadius: "10px",
                    boxShadow: "0 0 0 9999px rgba(6, 30, 27, 0.78), 0 0 0 3px #00C7BE, 0 0 25px rgba(0, 199, 190, 0.5)",
                    zIndex: 9998,
                    transition: "all 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                    pointerEvents: "none",
                }, className: "animate-pulse" })) : (
            // Plain backdrop when centered
            _jsx("div", { className: "fixed inset-0 bg-[#061E1B]/80 backdrop-blur-xs transition-opacity", style: { zIndex: 9998 } })), _jsxs("div", { ref: cardRef, style: getCardStyle(), className: "bg-white rounded-2xl shadow-2xl border border-teal-100 overflow-hidden animate-fadeIn", children: [_jsxs("div", { className: "bg-[#061E1B] px-5 py-3 text-white flex items-center justify-between border-b border-teal-950", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "p-1 rounded bg-[#007A6C] text-[#00C7BE]", children: _jsx(Compass, { className: "w-4 h-4" }) }), _jsx("span", { className: "text-xs font-bold text-[#00C7BE] uppercase tracking-wider", children: "Platform Walkthrough" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("span", { className: "text-[11px] font-mono font-bold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded-full", children: [stepIndex + 1, " / ", totalSteps] }), _jsx("button", { onClick: onSkip, title: "Skip walkthrough", className: "text-slate-400 hover:text-white p-1 rounded-md transition", children: _jsx(X, { className: "w-4 h-4" }) })] })] }), _jsx("div", { className: "h-1 bg-slate-100 w-full overflow-hidden", children: _jsx("div", { style: { width: `${((stepIndex + 1) / totalSteps) * 100}%` }, className: "h-full bg-[#FF6B00] transition-all duration-300" }) }), _jsxs("div", { className: "p-5 space-y-3", children: [step.badge && (_jsx("span", { className: "inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-[#007A6C] border border-teal-200", children: step.badge })), _jsx("h3", { className: "text-sm font-black text-slate-900 tracking-tight", children: step.title }), _jsx("div", { className: "text-xs text-slate-600 leading-relaxed font-normal", children: step.description }), step.tip && (_jsxs("div", { className: "p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900", children: [_jsx(Lightbulb, { className: "w-4 h-4 text-amber-600 shrink-0 mt-0.5" }), _jsxs("div", { className: "text-[11px] leading-snug", children: [_jsx("span", { className: "font-bold", children: "Pro Tip: " }), step.tip] })] }))] }), _jsxs("div", { className: "px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between", children: [_jsx("button", { onClick: onSkip, className: "text-xs font-semibold text-slate-400 hover:text-slate-700 transition", children: "Skip Tour" }), _jsxs("div", { className: "flex items-center gap-2", children: [stepIndex > 0 && (_jsxs("button", { onClick: onPrev, className: "text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 flex items-center gap-1 transition", children: [_jsx(ChevronLeft, { className: "w-3.5 h-3.5" }), _jsx("span", { children: "Back" })] })), _jsxs("button", { onClick: onNext, className: "text-xs font-bold px-3.5 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF6D1B] active:bg-[#E05E00] text-white flex items-center gap-1.5 shadow-sm transition", children: [_jsx("span", { children: isLast ? "Finish Tour" : "Next Step" }), isLast ? (_jsx(CheckCircle, { className: "w-3.5 h-3.5" })) : (_jsx(ChevronRight, { className: "w-3.5 h-3.5" }))] })] })] })] })] }));
};
