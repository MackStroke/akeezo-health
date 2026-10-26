import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
/**
 * Clickable accessible table column header with visual ascending/descending/neutral indicator
 */
export function SortHeader({ field, label, currentSortField, currentField, currentSortDirection, currentDirection, onSort, className = "", align = "left", }) {
    const activeField = currentSortField !== undefined ? currentSortField : currentField;
    const activeDirection = currentSortDirection !== undefined ? currentSortDirection : currentDirection;
    const isActive = activeField === field && activeDirection !== null && activeDirection !== undefined;
    const isAsc = isActive && activeDirection === "asc";
    const isDesc = isActive && activeDirection === "desc";
    const alignClass = align === "right"
        ? "justify-end text-right ml-auto"
        : align === "center"
            ? "justify-center text-center mx-auto"
            : "justify-start text-left";
    return (_jsx("th", { scope: "col", className: `py-3 px-4 select-none ${className}`, "aria-sort": isAsc ? "ascending" : isDesc ? "descending" : "none", children: _jsxs("button", { type: "button", onClick: () => onSort(field), className: `flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] transition group focus:outline-none focus:ring-1 focus:ring-[#007A6C] rounded px-1 -mx-1 ${alignClass} ${isActive ? "text-[#007A6C]" : "text-slate-500 hover:text-slate-800"}`, title: `Sort by ${label} (${isActive ? (isAsc ? "sorted ascending — click to invert" : "sorted descending — click to reset") : "click to sort"})`, children: [_jsx("span", { children: label }), _jsx("span", { className: "shrink-0 transition-transform", children: isAsc ? (_jsx(ArrowUp, { className: "w-3.5 h-3.5 text-[#007A6C]" })) : isDesc ? (_jsx(ArrowDown, { className: "w-3.5 h-3.5 text-[#007A6C]" })) : (_jsx(ChevronsUpDown, { className: "w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" })) })] }) }));
}
/**
 * Safely resolves nested property path (e.g. "actorId.name" or "patientId.fullName")
 */
export function getNestedValue(obj, path) {
    if (!obj)
        return undefined;
    if (!path.includes("."))
        return obj[path];
    return path.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}
/**
 * Universal array sort supporting numbers, dates, strings, and nested accessor keys
 */
export function sortItems(items, sortField, sortDirection) {
    if (!sortField || !sortDirection)
        return items;
    return [...items].sort((a, b) => {
        const valA = getNestedValue(a, sortField);
        const valB = getNestedValue(b, sortField);
        if (valA === valB)
            return 0;
        if (valA === null || valA === undefined)
            return 1;
        if (valB === null || valB === undefined)
            return -1;
        // Numerical comparison
        if (typeof valA === "number" && typeof valB === "number") {
            return sortDirection === "asc" ? valA - valB : valB - valA;
        }
        // Date comparison
        const isDateA = !isNaN(Date.parse(valA)) &&
            (typeof valA === "string" && (valA.includes("-") || valA.includes("/")));
        const isDateB = !isNaN(Date.parse(valB)) &&
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
export function getNextSortDirection(currentField, clickedField, currentDirection) {
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
/**
 * Filter items by date preset
 */
export function filterByDatePreset(items, dateField, preset) {
    if (preset === "all")
        return items;
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    return items.filter((item) => {
        const val = getNestedValue(item, dateField);
        if (!val)
            return false;
        const time = new Date(val).getTime();
        if (isNaN(time))
            return false;
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
