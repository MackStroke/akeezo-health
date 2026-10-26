import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  BookOpen,
  X,
  RotateCcw,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export type FeedbackType = "success" | "error" | "failure" | "info" | "instruction" | "warning";

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
}

export interface ToastOptions {
  id?: string;
  title?: string;
  message: React.ReactNode;
  type?: FeedbackType;
  duration?: number; // ms, default 5000, 0 for infinite/sticky
  steps?: string[]; // For instruction toasts: ordered list of steps
  action?: ToastAction;
  retry?: () => void;
  details?: string | string[];
}

export interface ToastItem extends ToastOptions {
  id: string;
  type: FeedbackType;
  createdAt: number;
  duration: number;
}

export interface ModalFeedbackOptions {
  title: string;
  message: React.ReactNode;
  type?: FeedbackType;
  steps?: string[];
  details?: string | string[];
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

interface FeedbackContextValue {
  toasts: ToastItem[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  openModal: (options: ModalFeedbackOptions) => void;
  closeModal: () => void;
  // Convenience helper methods
  toast: {
    success: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    error: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    failure: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    info: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    instruction: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    warning: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
  };
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

export const useFeedback = (): FeedbackContextValue => {
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

const TYPE_CONFIG: Record<
  FeedbackType,
  {
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
    badgeBg: string;
    defaultTitle: string;
  }
> = {
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
const ToastNotification: React.FC<{
  toast: ToastItem;
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const config = TYPE_CONFIG[toast.type] || TYPE_CONFIG.info;
  const Icon = config.icon;
  const title = toast.title || config.defaultTitle;

  useEffect(() => {
    if (toast.duration <= 0) return;
    const startTime = Date.now();
    const endTime = startTime + toast.duration;

    const interval = setInterval(() => {
      if (isPaused) return;
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

  return (
    <div
      role="alert"
      aria-live={toast.type === "error" || toast.type === "failure" ? "assertive" : "polite"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
      }}
      className="w-full max-w-md pointer-events-auto rounded-xl border shadow-lg overflow-hidden transition-all duration-300 transform translate-y-0 opacity-100 font-sans"
    >
      <div className="p-4 flex items-start gap-3">
        {/* Type Badge Icon */}
        <div
          style={{ backgroundColor: config.badgeBg, color: config.accentColor }}
          className="p-2 rounded-lg shrink-0 mt-0.5"
        >
          <Icon className="w-5 h-5" />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-2">
            <h4
              style={{ color: config.textColor }}
              className="text-xs font-bold tracking-tight uppercase"
            >
              {title}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {new Date(toast.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>

          <div
            style={{ color: config.textColor }}
            className="text-xs mt-1 leading-relaxed font-normal opacity-90 break-words"
          >
            {toast.message}
          </div>

          {/* Ordered Step Instructions */}
          {toast.steps && toast.steps.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-200/60 space-y-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 block">
                Required Steps:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-xs text-slate-700">
                {toast.steps.map((st, i) => (
                  <li key={i} className="pl-1">
                    <span className="font-medium">{st}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Error Details if provided */}
          {toast.details && (
            <div className="mt-2 p-2 bg-white/70 rounded text-[11px] font-mono text-slate-700 max-h-24 overflow-y-auto border border-slate-200">
              {Array.isArray(toast.details)
                ? toast.details.map((d, i) => <div key={i}>• {d}</div>)
                : toast.details}
            </div>
          )}

          {/* Actions & Retry */}
          <div className="mt-3 flex items-center gap-2">
            {toast.retry && (
              <button
                onClick={() => {
                  toast.retry?.();
                  onClose(toast.id);
                }}
                className="text-xs font-bold px-2.5 py-1 rounded-md bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 flex items-center gap-1 transition shadow-2xs"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retry Action</span>
              </button>
            )}

            {toast.action && (
              <button
                onClick={() => {
                  toast.action?.onClick();
                  onClose(toast.id);
                }}
                style={{
                  backgroundColor: config.accentColor,
                }}
                className="text-xs font-bold px-3 py-1 rounded-md text-white hover:opacity-90 flex items-center gap-1 transition shadow-2xs"
              >
                <span>{toast.action.label}</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => onClose(toast.id)}
          aria-label="Dismiss notification"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-white/50 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-dismiss progress bar */}
      {toast.duration > 0 && (
        <div className="h-1 w-full bg-black/5 overflow-hidden">
          <div
            style={{
              width: `${progress}%`,
              backgroundColor: config.accentColor,
            }}
            className="h-full transition-all duration-75 ease-linear"
          />
        </div>
      )}
    </div>
  );
};

// Modal Dialog for critical feedback or instructions
const FeedbackModal: React.FC<{
  options: ModalFeedbackOptions | null;
  onClose: () => void;
}> = ({ options, onClose }) => {
  if (!options) return null;

  const config = TYPE_CONFIG[options.type || "instruction"];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs font-sans animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden transform transition-all">
        {/* Header */}
        <div
          style={{ backgroundColor: config.bgColor, borderBottomColor: config.borderColor }}
          className="p-5 border-b flex items-start gap-3"
        >
          <div
            style={{ backgroundColor: config.badgeBg, color: config.accentColor }}
            className="p-2.5 rounded-xl shrink-0"
          >
            <Icon className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-900">{options.title}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Please review the guidance below to continue.</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-white/50 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-slate-700 leading-relaxed">{options.message}</div>

          {options.steps && options.steps.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Follow These Steps:
              </span>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-800">
                {options.steps.map((st, i) => (
                  <li key={i} className="pl-1">
                    <span className="font-semibold">{st}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {options.details && (
            <div className="p-3 bg-red-50/70 text-red-900 border border-red-200 rounded-lg text-xs font-mono max-h-32 overflow-y-auto">
              {Array.isArray(options.details)
                ? options.details.map((d, i) => <div key={i}>• {d}</div>)
                : options.details}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          {(options.showCancel ?? true) && (
            <button
              onClick={() => {
                options.onCancel?.();
                onClose();
              }}
              className="text-xs font-semibold px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition"
            >
              {options.cancelLabel || "Cancel"}
            </button>
          )}

          <button
            onClick={() => {
              options.onConfirm?.();
              onClose();
            }}
            style={{ backgroundColor: config.accentColor }}
            className="text-xs font-bold px-4 py-2 rounded-lg text-white hover:opacity-90 transition shadow-xs"
          >
            {options.confirmLabel || "Got it, Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [modalOptions, setModalOptions] = useState<ModalFeedbackOptions | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback((opts: ToastOptions): string => {
    const id = opts.id || `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newItem: ToastItem = {
      ...opts,
      id,
      type: opts.type || "info",
      duration: opts.duration !== undefined ? opts.duration : 5000,
      createdAt: Date.now(),
    };

    setToasts((prev) => [newItem, ...prev.slice(0, 6)]); // Max 7 visible toasts in stack
    return id;
  }, []);

  const openModal = useCallback((opts: ModalFeedbackOptions) => {
    setModalOptions(opts);
  }, []);

  const closeModal = useCallback(() => {
    setModalOptions(null);
  }, []);

  const toastHelpers = {
    success: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => {
      const opts = typeof options === "string" ? { title: options } : options;
      return addToast({ ...opts, message, type: "success" });
    },
    error: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => {
      const opts = typeof options === "string" ? { title: options } : options;
      return addToast({ ...opts, message, type: "error" });
    },
    failure: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => {
      const opts = typeof options === "string" ? { title: options } : options;
      return addToast({ ...opts, message, type: "failure" });
    },
    info: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => {
      const opts = typeof options === "string" ? { title: options } : options;
      return addToast({ ...opts, message, type: "info" });
    },
    instruction: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => {
      const opts = typeof options === "string" ? { title: options } : options;
      return addToast({ ...opts, message, type: "instruction" });
    },
    warning: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => {
      const opts = typeof options === "string" ? { title: options } : options;
      return addToast({ ...opts, message, type: "warning" });
    },
  };

  return (
    <FeedbackContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        clearAllToasts,
        openModal,
        closeModal,
        toast: toastHelpers,
      }}
    >
      {children}

      {/* Floating Toast Container */}
      <div
        aria-label="Notifications"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none px-3 sm:px-0"
      >
        {toasts.map((t) => (
          <ToastNotification key={t.id} toast={t} onClose={removeToast} />
        ))}
      </div>

      {/* Modal Dialog */}
      <FeedbackModal options={modalOptions} onClose={closeModal} />
    </FeedbackContext.Provider>
  );
};
