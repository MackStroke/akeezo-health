import React, { useState, useRef, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  X,
  Lock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export interface RequirementItem {
  label: string;
  fulfilled: boolean;
  tip?: string;
  fixLabel?: string;
  onFix?: () => void;
}

export interface DisabledGuideProps {
  disabled?: boolean;
  reasonTitle?: string;
  reasonMessage?: string;
  requirements?: RequirementItem[];
  stepsToEnable?: string[];
  placement?: "top" | "bottom" | "left" | "right";
  trigger?: "click" | "hover" | "both";
  children: React.ReactNode;
  className?: string;
}

export const DisabledGuide: React.FC<DisabledGuideProps> = ({
  disabled = false,
  reasonTitle = "Action Currently Blocked",
  reasonMessage = "Certain prerequisite requirements must be satisfied before this action can be executed.",
  requirements = [],
  stepsToEnable = [],
  placement = "top",
  trigger = "both",
  children,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
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
    return <>{children}</>;
  }

  const handleTriggerClick = (e: React.MouseEvent) => {
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

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onClick={handleTriggerClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Wrapper intercepting clicks for disabled element */}
      <div className="relative inline-flex items-center cursor-not-allowed group">
        {/* Child button with disabled visual styling */}
        <div className="pointer-events-none opacity-60 filter grayscale-[25%] transition-all select-none">
          {children}
        </div>

        {/* Small badge indicator on the button */}
        <span
          title="Click to see why this action is blocked"
          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs animate-pulse pointer-events-auto cursor-help"
        >
          <Lock className="w-2.5 h-2.5" />
        </span>
      </div>

      {/* Guidance Popover Modal */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="tooltip"
          aria-live="polite"
          className={`absolute z-50 ${placementClasses} w-80 sm:w-96 p-4 rounded-xl bg-slate-900 text-white shadow-2xl border border-slate-700 font-sans text-xs animate-fadeIn`}
          style={{
            boxShadow: "0 20px 30px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-100 text-xs tracking-tight">{reasonTitle}</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close guide"
              className="text-slate-400 hover:text-white p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Reason Description */}
          <p className="text-slate-300 text-[11px] mt-2.5 leading-relaxed">{reasonMessage}</p>

          {/* Prerequisites Checklist */}
          {requirements.length > 0 && (
            <div className="mt-3 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 space-y-2">
              <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase block">
                Prerequisite Checklist:
              </span>
              <div className="space-y-1.5">
                {requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between gap-2 text-[11px] leading-tight"
                  >
                    <div className="flex items-start gap-1.5 min-w-0">
                      {req.fulfilled ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span
                          className={
                            req.fulfilled
                              ? "text-slate-400 line-through"
                              : "text-slate-200 font-semibold"
                          }
                        >
                          {req.label}
                        </span>
                        {req.tip && !req.fulfilled && (
                          <div className="text-[10px] text-amber-300/90 mt-0.5 font-normal">
                            ↳ {req.tip}
                          </div>
                        )}
                      </div>
                    </div>

                    {req.onFix && !req.fulfilled && (
                      <button
                        onClick={() => {
                          req.onFix?.();
                          setIsOpen(false);
                        }}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-600 hover:bg-teal-500 text-white shrink-0 transition"
                      >
                        {req.fixLabel || "Fix"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps to Enable */}
          {stepsToEnable.length > 0 && (
            <div className="mt-3 pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400 block">
                How to Enable This Action:
              </span>
              <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300">
                {stepsToEnable.map((step, i) => (
                  <li key={i} className="pl-0.5">
                    <span className="text-slate-200">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Footer note */}
          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>Click outside or Esc to dismiss</span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-teal-400 hover:text-teal-300 font-bold transition"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export interface DisabledGuideButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
  reasonTitle?: string;
  guideTitle?: string;
  reasonMessage?: string;
  guideReason?: string;
  requirements?: RequirementItem[];
  prerequisites?: RequirementItem[];
  stepsToEnable?: string[];
  actionSteps?: string[];
  placement?: "top" | "bottom" | "left" | "right";
  trigger?: "click" | "hover" | "both";
  variant?: "primary" | "secondary" | "orange" | "danger" | "ghost";
}

export const DisabledGuideButton: React.FC<DisabledGuideButtonProps> = ({
  disabled = false,
  reasonTitle,
  guideTitle,
  reasonMessage,
  guideReason,
  requirements,
  prerequisites,
  stepsToEnable,
  actionSteps,
  placement = "top",
  trigger = "both",
  variant = "primary",
  children,
  className = "",
  onClick,
  ...props
}) => {
  return (
    <DisabledGuide
      disabled={disabled}
      reasonTitle={reasonTitle || guideTitle}
      reasonMessage={reasonMessage || guideReason}
      requirements={requirements || prerequisites}
      stepsToEnable={stepsToEnable || actionSteps}
      placement={placement}
      trigger={trigger}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={disabled ? undefined : onClick}
        className={className}
        {...props}
      >
        {children}
      </button>
    </DisabledGuide>
  );
};
