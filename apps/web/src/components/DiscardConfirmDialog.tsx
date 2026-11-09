import React from "react";
import { AlertTriangle } from "lucide-react";

export interface DiscardConfirmDialogProps {
  isOpen: boolean;
  onComplete: () => void;
  onDiscard: () => void;
  title?: string;
  description?: string;
  completeLabel?: string;
  discardLabel?: string;
}

/**
 * Reusable modal alert displayed when a user attempts to close a popup
 * after entering text or making changes. Provides explicit choices:
 * - "Complete" (stay on form to complete it)
 * - "Discard" (discard entered information and close popup)
 */
export const DiscardConfirmDialog: React.FC<DiscardConfirmDialogProps> = ({
  isOpen,
  onComplete,
  onDiscard,
  title = "Discard unsaved entries?",
  description = "You have entered information in this form. Would you like to complete your entry or discard it?",
  completeLabel = "Complete",
  discardLabel = "Discard",
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="discard-alert-title"
      aria-describedby="discard-alert-desc"
      data-testid="discard-confirm-dialog"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs font-sans animate-in fade-in duration-150"
      onClick={(e) => {
        e.stopPropagation();
        // Clicking backdrop of the alert dialog defaults to Complete / keep editing
        onComplete();
      }}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 border border-amber-200">
          <AlertTriangle className="size-6 text-amber-600" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h4 id="discard-alert-title" className="text-base font-bold text-gray-900">
            {title}
          </h4>
          <p id="discard-alert-desc" className="text-xs text-gray-500 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <button
            type="button"
            data-testid="discard-confirm-discard-btn"
            onClick={onDiscard}
            className="flex-1 rounded-full border border-gray-300 bg-white py-2.5 px-4 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer"
          >
            {discardLabel}
          </button>
          <button
            type="button"
            data-testid="discard-confirm-complete-btn"
            onClick={onComplete}
            className="flex-1 rounded-full bg-action py-2.5 px-4 text-xs font-bold text-white shadow-sm hover:bg-action-hover transition-colors cursor-pointer"
            autoFocus
          >
            {completeLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
