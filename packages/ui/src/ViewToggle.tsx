import React from "react";
import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "table" | "grid";

export interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
  tableLabel?: string;
  gridLabel?: string;
  showLabels?: boolean;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  mode,
  onChange,
  className = "",
  tableLabel = "Table",
  gridLabel = "Grid",
  showLabels = true,
}) => {
  return (
    <div
      role="group"
      aria-label="View layout toggle"
      className={`inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("table")}
        aria-pressed={mode === "table"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
          mode === "table"
            ? "bg-white text-[#007A6C] shadow-xs border border-slate-200/60"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
        }`}
        title="Switch to Table view"
      >
        <List className="w-3.5 h-3.5" />
        {showLabels && <span>{tableLabel}</span>}
      </button>

      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={mode === "grid"}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
          mode === "grid"
            ? "bg-white text-[#007A6C] shadow-xs border border-slate-200/60"
            : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/60"
        }`}
        title="Switch to Grid view"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        {showLabels && <span>{gridLabel}</span>}
      </button>
    </div>
  );
};
