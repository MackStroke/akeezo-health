import React from "react";
export type ViewMode = "table" | "grid";
export interface ViewToggleProps {
    mode: ViewMode;
    onChange: (mode: ViewMode) => void;
    className?: string;
    tableLabel?: string;
    gridLabel?: string;
    showLabels?: boolean;
}
export declare const ViewToggle: React.FC<ViewToggleProps>;
//# sourceMappingURL=ViewToggle.d.ts.map