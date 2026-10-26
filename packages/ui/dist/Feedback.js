import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, BookOpen, X, RotateCcw, ChevronRight, } from "lucide-react";
const FeedbackContext = createContext(null);
export const useFeedback = () => {
    const ctx = useContext(FeedbackContext);
    if (!ctx) {
        throw new Error("useFeedback must be used within a FeedbackProvider");
    }
    return ctx;
};
// Alias hook
export const useToast = () => {
    const { toast, addToast, removeToast, clearAllToasts, openModal, closeModal } = useFeedback();
    return { ...toast, addToast, removeToast, clearAllToasts, openModal, closeModal };
};
const TYPE_CONFIG = {
    success: {
        icon: CheckCircle2,
        accentColor: "#007A6C",
        bgColor: "#F0FDF4",
        borderColor: "#86EFAC",
        textColor: "#14532D",
        badgeBg: "#DCFCE7",
        defaultTitle: "Operation Succeeded",
    },
    error: {
        icon: AlertTriangle,
        accentColor: "#DC2626",
        bgColor: "#FEF2F2",
        borderColor: "#FCA5A5",
        textColor: "#7F1D1D",
        badgeBg: "#FEE2E2",
        defaultTitle: "Action Error",
    },
    failure: {
        icon: XCircle,
        accentColor: "#991B1B",
        bgColor: "#FFF1F2",
        borderColor: "#FDA4AF",
        textColor: "#881337",
        badgeBg: "#FFE4E6",
        defaultTitle: "System Failure",
    },
    info: {
        icon: Info,
        accentColor: "#0284C7",
        bgColor: "#F0F9FF",
        borderColor: "#BAE6FD",
        textColor: "#0C4A6E",
        badgeBg: "#E0F2FE",
        defaultTitle: "Platform Notice",
    },
    instruction: {
        icon: BookOpen,
        accentColor: "#007A6C",
        bgColor: "#F0FDFA",
        borderColor: "#99F6E4",
        textColor: "#134E4A",
        badgeBg: "#CCFBF1",
        defaultTitle: "Workflow Instruction",
    },
    warning: {
        icon: AlertTriangle,
        accentColor: "#D97706",
        bgColor: "#FFFBEB",
        borderColor: "#FDE68A",
        textColor: "#78350F",
        badgeBg: "#FEF3C7",
        defaultTitle: "Attention Required",
    },
};
// Single Toast Notification Component
const ToastNotification = ({ toast, onClose }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(100);
    const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
    const Icon = config.icon;
    const title = toast.title || config.defaultTitle;
    useEffect(() => {
        if (toast.duration <= 0)
            return;
        const startTime = Date.now();
        const endTime = startTime + toast.duration;
        const interval = setInterval(() => {
            if (isPaused)
                return;
            const remaining = endTime - Date.now();
            const pct = Math.max(0, (remaining / toast.duration) * 100);
            setProgress(pct);
            if (remaining <= 0) {
                clearInterval(interval);
                onClose(toast.id);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [toast.id, toast.duration, isPaused, onClose]);
    return (_jsxs("div", { role: "alert", "aria-live": toast.type === "error" || toast.type === "failure" ? "assertive" : "polite", onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), style: {
            backgroundColor: config.bgColor,
            borderColor: config.borderColor,
        }, className: "w-full max-w-md pointer-events-auto rounded-xl border shadow-lg overflow-hidden transition-all duration-300 transform translate-y-0 opacity-100 font-sans", children: [_jsxs("div", { className: "p-4 flex items-start gap-3", children: [_jsx("div", { style: { backgroundColor: config.badgeBg, color: config.accentColor }, className: "p-2 rounded-lg shrink-0 mt-0.5", children: _jsx(Icon, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1 min-w-0 pr-1", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("h4", { style: { color: config.textColor }, className: "text-xs font-bold tracking-tight uppercase", children: title }), _jsx("span", { className: "text-[10px] text-slate-400 font-mono", children: new Date(toast.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) })] }), _jsx("div", { style: { color: config.textColor }, className: "text-xs mt-1 leading-relaxed font-normal opacity-90 break-words", children: toast.message }), toast.steps && toast.steps.length > 0 && (_jsxs("div", { className: "mt-2.5 pt-2 border-t border-slate-200/60 space-y-1.5", children: [_jsx("span", { className: "text-[10px] font-bold tracking-wider uppercase text-slate-500 block", children: "Required Steps:" }), _jsx("ol", { className: "list-decimal list-inside space-y-1 text-xs text-slate-700", children: toast.steps.map((st, i) => (_jsx("li", { className: "pl-1", children: _jsx("span", { className: "font-medium", children: st }) }, i))) })] })), toast.details && (_jsx("div", { className: "mt-2 p-2 bg-white/70 rounded text-[11px] font-mono text-slate-700 max-h-24 overflow-y-auto border border-slate-200", children: Array.isArray(toast.details)
                                    ? toast.details.map((d, i) => _jsxs("div", { children: ["\u2022 ", d] }, i))
                                    : toast.details })), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [toast.retry && (_jsxs("button", { onClick: () => {
                                            toast.retry?.();
                                            onClose(toast.id);
                                        }, className: "text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center gap-1 transition shadow-2xs", children: [_jsx(RotateCcw, { className: "w-3 h-3" }), _jsx("span", { children: "Retry Action" })] })), toast.action && (_jsxs("button", { onClick: () => {
                                            toast.action?.onClick();
                                            onClose(toast.id);
                                        }, style: {
                                            backgroundColor: config.accentColor,
                                        }, className: "text-xs font-bold px-3 py-1 rounded-md text-white hover:opacity-90 flex items-center gap-1 transition shadow-2xs", children: [_jsx("span", { children: toast.action.label }), _jsx(ChevronRight, { className: "w-3 h-3" })] }))] })] }), _jsx("button", { onClick: () => onClose(toast.id), "aria-label": "Dismiss notification", className: "text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-white/50 transition shrink-0", children: _jsx(X, { className: "w-4 h-4" }) })] }), toast.duration > 0 && (_jsx("div", { className: "h-1 w-full bg-black/5 overflow-hidden", children: _jsx("div", { style: {
                        width: `${progress}%`,
                        backgroundColor: config.accentColor,
                    }, className: "h-full transition-all duration-75 ease-linear" }) }))] }));
};
// Modal Dialog for critical feedback or instructions
const FeedbackModal = ({ options, onClose }) => {
    if (!options)
        return null;
    const config = TYPE_CONFIG[options.type || "instruction"];
    const Icon = config.icon;
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans animate-fadeIn", children: _jsxs("div", { className: "bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden transform transition-all", children: [_jsxs("div", { style: { backgroundColor: config.bgColor, borderBottomColor: config.borderColor }, className: "p-5 border-b flex items-start gap-3", children: [_jsx("div", { style: { backgroundColor: config.badgeBg, color: config.accentColor }, className: "p-2.5 rounded-xl shrink-0", children: _jsx(Icon, { className: "w-6 h-6" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "text-base font-bold text-slate-900", children: options.title }), _jsx("p", { className: "text-xs text-slate-500 mt-0.5", children: "Please review the guidance below to continue." })] }), _jsx("button", { onClick: onClose, "aria-label": "Close dialog", className: "text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-white/50 transition", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsx("div", { className: "text-sm text-slate-700 leading-relaxed", children: options.message }), options.steps && options.steps.length > 0 && (_jsxs("div", { className: "bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2", children: [_jsx("span", { className: "text-[11px] font-bold uppercase tracking-wider text-slate-500 block", children: "Follow These Steps:" }), _jsx("ol", { className: "list-decimal list-inside space-y-1.5 text-xs text-slate-800", children: options.steps.map((st, i) => (_jsx("li", { className: "pl-1", children: _jsx("span", { className: "font-semibold", children: st }) }, i))) })] })), options.details && (_jsx("div", { className: "p-3 bg-red-50/70 text-red-900 border border-red-200 rounded-lg text-xs font-mono max-h-32 overflow-y-auto", children: Array.isArray(options.details)
                                ? options.details.map((d, i) => _jsxs("div", { children: ["\u2022 ", d] }, i))
                                : options.details }))] }), _jsxs("div", { className: "px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3", children: [(options.showCancel ?? true) && (_jsx("button", { onClick: () => {
                                options.onCancel?.();
                                onClose();
                            }, className: "text-xs font-semibold px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition", children: options.cancelLabel || "Cancel" })), _jsx("button", { onClick: () => {
                                options.onConfirm?.();
                                onClose();
                            }, style: { backgroundColor: config.accentColor }, className: "text-xs font-bold px-4 py-2 rounded-lg text-white hover:opacity-90 transition shadow-xs", children: options.confirmLabel || "Got it, Continue" })] })] }) }));
};
export const FeedbackProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const [modalOptions, setModalOptions] = useState(null);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const clearAllToasts = useCallback(() => {
        setToasts([]);
    }, []);
    const addToast = useCallback((opts) => {
        const id = opts.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
        const newItem = {
            ...opts,
            id,
            type: opts.type || "info",
            duration: opts.duration !== undefined ? opts.duration : 5000,
            createdAt: Date.now(),
        };
        setToasts((prev) => [newItem, ...prev.slice(0, 6)]); // Max 7 visible toasts in stack
        return id;
    }, []);
    const openModal = useCallback((opts) => {
        setModalOptions(opts);
    }, []);
    const closeModal = useCallback(() => {
        setModalOptions(null);
    }, []);
    const toastHelpers = {
        success: (message, options) => {
            const opts = typeof options === "string" ? { title: options } : options;
            return addToast({ ...opts, message, type: "success" });
        },
        error: (message, options) => {
            const opts = typeof options === "string" ? { title: options } : options;
            return addToast({ ...opts, message, type: "error" });
        },
        failure: (message, options) => {
            const opts = typeof options === "string" ? { title: options } : options;
            return addToast({ ...opts, message, type: "failure" });
        },
        info: (message, options) => {
            const opts = typeof options === "string" ? { title: options } : options;
            return addToast({ ...opts, message, type: "info" });
        },
        instruction: (message, options) => {
            const opts = typeof options === "string" ? { title: options } : options;
            return addToast({ ...opts, message, type: "instruction" });
        },
        warning: (message, options) => {
            const opts = typeof options === "string" ? { title: options } : options;
            return addToast({ ...opts, message, type: "warning" });
        },
    };
    return (_jsxs(FeedbackContext.Provider, { value: {
            toasts,
            addToast,
            removeToast,
            clearAllToasts,
            openModal,
            closeModal,
            toast: toastHelpers,
        }, children: [children, _jsx("div", { "aria-label": "Notifications", className: "fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-3 sm:px-0", children: toasts.map((t) => (_jsx(ToastNotification, { toast: t, onClose: removeToast }, t.id))) }), _jsx(FeedbackModal, { options: modalOptions, onClose: closeModal })] }));
};
