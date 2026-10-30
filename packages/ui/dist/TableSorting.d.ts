import React from "react";
export type SortDirection = "asc" | "desc" | null;
export interface SortHeaderProps<T = string> {
    field: T;
    label?: string;
    children?: React.ReactNode;
    currentSortField?: T | null;
    currentField?: T | null;
    currentSortDirection?: SortDirection;
    currentDirection?: SortDirection;
    onSort: (field: T) => void;
    className?: string;
    align?: "left" | "center" | "right";
}
/**
 * Clickable accessible table column header with visual ascending/descending/neutral indicator
 */
export declare function SortHeader<T = string>({ field, label, children, currentSortField, currentField, currentSortDirection, currentDirection, onSort, className, align, }: SortHeaderProps<T>): React.JSX.Element;
/**
 * Safely resolves nested property path (e.g. "actorId.name" or "patientId.fullName")
 */
export declare function getNestedValue(obj: any, path: string): any;
/**
 * Universal array sort supporting numbers, dates, strings, and nested accessor keys
 */
export declare function sortItems<T>(items: T[], sortField: string | null, sortDirection: SortDirection): T[];
/**
 * Generates next 3-state cycle for a clicked column header: neutral -> asc -> desc -> neutral
 */
export declare function getNextSortDirection(currentField: string | null, clickedField: string, currentDirection: SortDirection): {
    field: string;
    direction: SortDirection;
};
export type DateRangePreset = "all" | "today" | "last_7_days" | "last_30_days" | "this_year";
/**
 * Filter items by date preset
 */
export declare function filterByDatePreset<T>(items: T[], dateField: string, preset: DateRangePreset): T[];
//# sourceMappingURL=TableSorting.d.ts.map