import React from "react";
import { ArrowUp, ArrowDown, ChevronsUpDown, X, Filter } from "lucide-react";

export type SortDirection = "asc" | "desc" | null;

export interface SortHeaderProps<T = string> {
  field: T;
  label: string;
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
export function SortHeader<T = string>({
  field,
  label,
  currentSortField,
  currentField,
  currentSortDirection,
  currentDirection,
  onSort,
  className = "",
  align = "left",
}: SortHeaderProps<T>) {
  const activeField = currentSortField !== undefined ? currentSortField : currentField;
  const activeDirection = currentSortDirection !== undefined ? currentSortDirection : currentDirection;
  const isActive = activeField === field && activeDirection !== null && activeDirection !== undefined;
  const isAsc = isActive && activeDirection === "asc";
  const isDesc = isActive && activeDirection === "desc";

  const alignClass =
    align === "right"
      ? "justify-end text-right ml-auto"
      : align === "center"
      ? "justify-center text-center mx-auto"
      : "justify-start text-left";

  return (
    <th
      scope="col"
      className={`py-3 px-4 select-none ${className}`}
      aria-sort={isAsc ? "ascending" : isDesc ? "descending" : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] transition group focus:outline-none focus:ring-1 focus:ring-[#007A6C] rounded px-1 -mx-1 ${alignClass} ${
          isActive ? "text-[#007A6C]" : "text-slate-500 hover:text-slate-800"
        }`}
        title={`Sort by ${label} (${
          isActive ? (isAsc ? "sorted ascending — click to invert" : "sorted descending — click to reset") : "click to sort"
        })`}
      >
        <span>{label}</span>
        <span className="shrink-0 transition-transform">
          {isAsc ? (
            <ArrowUp className="w-3.5 h-3.5 text-[#007A6C]" />
          ) : isDesc ? (
            <ArrowDown className="w-3.5 h-3.5 text-[#007A6C]" />
          ) : (
            <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
          )}
        </span>
      </button>
    </th>
  );
}

/**
 * Safely resolves nested property path (e.g. "actorId.name" or "patientId.fullName")
 */
export function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  if (!path.includes(".")) return obj[path];
  return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

/**
 * Universal array sort supporting numbers, dates, strings, and nested accessor keys
 */
export function sortItems<T>(
  items: T[],
  sortField: string | null,
  sortDirection: SortDirection
): T[] {
  if (!sortField || !sortDirection) return items;

  return [...items].sort((a, b) => {
    const valA = getNestedValue(a, sortField);
    const valB = getNestedValue(b, sortField);

    if (valA === valB) return 0;
    if (valA === null || valA === undefined) return 1;
    if (valB === null || valB === undefined) return -1;

    // Numerical comparison
    if (typeof valA === "number" && typeof valB === "number") {
      return sortDirection === "asc" ? valA - valB : valB - valA;
    }

    // Date comparison
    const isDateA =
      !isNaN(Date.parse(valA)) &&
      (typeof valA === "string" && (valA.includes("-") || valA.includes("/")));
    const isDateB =
      !isNaN(Date.parse(valB)) &&
      (typeof valB === "string" && (valB.includes("-") || valB.includes("/")));
    if (isDateA && isDateB) {
      const timeA = new Date(valA).getTime();
      const timeB = new Date(valB).getTime();
      return sortDirection === "asc" ? timeA - timeB : timeB - timeA;
    }

    // String / Lexical comparison
    const strA = String(valA).toLowerCase();
    const strB = String(valB).toLowerCase();
    return sortDirection === "asc"
      ? strA.localeCompare(strB, undefined, { numeric: true, sensitivity: "base" })
      : strB.localeCompare(strA, undefined, { numeric: true, sensitivity: "base" });
  });
}

/**
 * Generates next 3-state cycle for a clicked column header: neutral -> asc -> desc -> neutral
 */
export function getNextSortDirection(
  currentField: string | null,
  clickedField: string,
  currentDirection: SortDirection
): { field: string; direction: SortDirection } {
  if (currentField !== clickedField) {
    return { field: clickedField, direction: "asc" };
  }
  if (currentDirection === "asc") {
    return { field: clickedField, direction: "desc" };
  }
  if (currentDirection === "desc") {
    return { field: clickedField, direction: null };
  }
  return { field: clickedField, direction: "asc" };
}

export type DateRangePreset = "all" | "today" | "last_7_days" | "last_30_days" | "this_year";

/**
 * Filter items by date preset
 */
export function filterByDatePreset<T>(
  items: T[],
  dateField: string,
  preset: DateRangePreset
): T[] {
  if (preset === "all") return items;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  return items.filter((item) => {
    const val = getNestedValue(item, dateField);
    if (!val) return false;
    const time = new Date(val).getTime();
    if (isNaN(time)) return false;

    switch (preset) {
      case "today":
        return time >= startOfToday;
      case "last_7_days":
        return time >= startOfToday - 7 * 24 * 60 * 60 * 1000;
      case "last_30_days":
        return time >= startOfToday - 30 * 24 * 60 * 60 * 1000;
      case "this_year":
        return time >= new Date(now.getFullYear(), 0, 1).getTime();
      default:
        return true;
    }
  });
}
