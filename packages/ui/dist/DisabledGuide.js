import { Fragment as _Fragment, jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from "react";
import { CheckCircle2, XCircle, X, Lock, ShieldAlert, } from "lucide-react";
export const DisabledGuide = ({ disabled = false, reasonTitle = "Action Currently Blocked", reasonMessage = "Certain prerequisite requirements must be satisfied before this action can be executed.", requirements = [], stepsToEnable = [], placement = "top", trigger = "both", children, className = "", }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);
    const popoverRef = useRef(null);
    // Close when clicking outside
    useEffect(() => {
        if (!isOpen)
            return;
        const handleClickOutside = (e) => {
            if (containerRef.current &&
                !containerRef.current.contains(e.target) &&
                popoverRef.current &&
                !popoverRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);
    // If not disabled, render plain children
    if (!disabled) {
        return _jsx(_Fragment, { children: children });
    }
    const handleTriggerClick = (e) => {
        if (disabled) {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen((prev) => !prev);
        }
    };
    const handleMouseEnter = () => {
        if (trigger === "hover" || trigger === "both") {
            setIsOpen(true);
        }
    };
    const handleMouseLeave = () => {
        if (trigger === "hover") {
            setIsOpen(false);
        }
    };
    // Position classes
    const placementClasses = {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2.5",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2.5",
        left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
        right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
    }[placement];
    return (_jsxs("div", { ref: containerRef, className: `relative inline-flex items-center ${className}`, onClick: handleTriggerClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, children: [_jsxs("div", { className: "relative inline-flex items-center cursor-not-allowed group", children: [_jsx("div", { className: "pointer-events-none opacity-60 filter grayscale-[25%] transition-all select-none", children: children }), _jsx("span", { title: "Click to see why this action is blocked", className: "absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs animate-pulse pointer-events-auto cursor-help", children: _jsx(Lock, { className: "w-2.5 h-2.5" }) })] }), isOpen && (_jsxs("div", { ref: popoverRef, role: "tooltip", "aria-live": "polite", className: `absolute z-50 ${placementClasses} w-80 sm:w-96 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 font-sans text-xs animate-fadeIn`, style: {
                    boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
                }, onClick: (e) => e.stopPropagation(), children: [_jsxs("div", { className: "flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "p-1 rounded bg-amber-500/20 text-amber-400", children: _jsx(ShieldAlert, { className: "w-4 h-4" }) }), _jsx("h4", { className: "font-bold text-slate-100 text-xs tracking-tight", children: reasonTitle })] }), _jsx("button", { onClick: () => setIsOpen(false), "aria-label": "Close guide", className: "text-slate-400 hover:text-white p-0.5 rounded transition", children: _jsx(X, { className: "w-3.5 h-3.5" }) })] }), _jsx("p", { className: "text-slate-300 text-[11px] mt-2.5 leading-relaxed", children: reasonMessage }), requirements.length > 0 && (_jsxs("div", { className: "mt-3 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 space-y-2", children: [_jsx("span", { className: "text-[10px] font-bold tracking-wider text-slate-400 uppercase block", children: "Prerequisite Checklist:" }), _jsx("div", { className: "space-y-1.5", children: requirements.map((req, idx) => (_jsxs("div", { className: "flex items-start justify-between gap-2 text-[11px] leading-tight", children: [_jsxs("div", { className: "flex items-start gap-1.5 min-w-0", children: [req.fulfilled ? (_jsx(CheckCircle2, { className: "w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" })) : (_jsx(XCircle, { className: "w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" })), _jsxs("div", { children: [_jsx("span", { className: req.fulfilled
                                                                ? "text-slate-400 line-through"
                                                                : "text-slate-200 font-semibold", children: req.label }), req.tip && !req.fulfilled && (_jsxs("div", { className: "text-[10px] text-amber-300/90 mt-0.5 font-normal", children: ["\u21B3 ", req.tip] }))] })] }), req.onFix && !req.fulfilled && (_jsx("button", { onClick: () => {
                                                req.onFix?.();
                                                setIsOpen(false);
                                            }, className: "text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 hover:bg-teal-500 text-white shrink-0 transition", children: req.fixLabel || "Fix" }))] }, idx))) })] })), stepsToEnable.length > 0 && (_jsxs("div", { className: "mt-3 pt-2 border-t border-slate-800 space-y-1.5", children: [_jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider text-teal-400 block", children: "How to Enable This Action:" }), _jsx("ol", { className: "list-decimal list-inside space-y-1 text-[11px] text-slate-300", children: stepsToEnable.map((step, i) => (_jsx("li", { className: "pl-0.5", children: _jsx("span", { className: "text-slate-200", children: step }) }, i))) })] })), _jsxs("div", { className: "mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400", children: [_jsx("span", { children: "Click outside or Esc to dismiss" }), _jsx("button", { onClick: () => setIsOpen(false), className: "text-teal-400 hover:text-teal-300 font-bold transition", children: "Understood" })] })] }))] }));
};
export const DisabledGuideButton = ({ disabled = false, reasonTitle, guideTitle, reasonMessage, guideReason, requirements, prerequisites, stepsToEnable, actionSteps, placement = "top", trigger = "both", variant = "primary", children, className = "", onClick, ...props }) => {
    return (_jsx(DisabledGuide, { disabled: disabled, reasonTitle: reasonTitle || guideTitle, reasonMessage: reasonMessage || guideReason, requirements: requirements || prerequisites, stepsToEnable: stepsToEnable || actionSteps, placement: placement, trigger: trigger, children: _jsx("button", { type: "button", disabled: disabled, onClick: disabled ? undefined : onClick, className: className, ...props, children: children }) }));
};
