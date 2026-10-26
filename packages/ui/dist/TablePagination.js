import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
/**
 * Smart page numbering generator with ellipsis windowing
 */
export function getPageNumbers(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
        return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
        return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}
/**
 * Universal accessible TablePagination component matching Akeezo branding
 */
export const TablePagination = ({ currentPage, totalItems, pageSize, onPageChange, onPageSizeChange, pageSizeOptions = [10, 25, 50, 100], className = "", itemLabel = "entries", }) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
    const endIndex = Math.min(safeCurrentPage * pageSize, totalItems);
    const pageNumbers = useMemo(() => getPageNumbers(safeCurrentPage, totalPages), [safeCurrentPage, totalPages]);
    return (_jsxs("div", { className: `flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-white border-t border-slate-200 text-xs text-slate-600 select-none ${className}`, "aria-label": "Table pagination navigation", children: [_jsxs("div", { className: "flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-start", children: [_jsxs("span", { className: "text-slate-600", children: ["Showing", " ", _jsx("strong", { className: "text-slate-900 font-semibold", children: totalItems === 0 ? 0 : startIndex }), " ", "to ", _jsx("strong", { className: "text-slate-900 font-semibold", children: endIndex }), " of", " ", _jsx("strong", { className: "text-slate-900 font-semibold", children: totalItems }), " ", itemLabel] }), onPageSizeChange && (_jsxs("div", { className: "flex items-center gap-1.5 pl-3 border-l border-slate-200", children: [_jsx("label", { htmlFor: "pageSizeSelect", className: "text-slate-500 whitespace-nowrap", children: "Per page:" }), _jsx("select", { id: "pageSizeSelect", value: pageSize, onChange: (e) => {
                                    onPageSizeChange(Number(e.target.value));
                                    onPageChange(1);
                                }, className: "px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#007A6C]", "aria-label": "Rows per page", children: pageSizeOptions.map((opt) => (_jsx("option", { value: opt, children: opt }, opt))) })] }))] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { type: "button", onClick: () => onPageChange(1), disabled: safeCurrentPage <= 1, "aria-label": "Go to first page", title: "First page", className: "p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition focus:outline-none focus:ring-1 focus:ring-[#007A6C]", children: _jsx(ChevronsLeft, { className: "w-3.5 h-3.5" }) }), _jsx("button", { type: "button", onClick: () => onPageChange(safeCurrentPage - 1), disabled: safeCurrentPage <= 1, "aria-label": "Go to previous page", title: "Previous page", className: "p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition focus:outline-none focus:ring-1 focus:ring-[#007A6C]", children: _jsx(ChevronLeft, { className: "w-3.5 h-3.5" }) }), _jsx("div", { className: "flex items-center gap-1 mx-1", children: pageNumbers.map((p, idx) => p === "..." ? (_jsx("span", { className: "px-1.5 py-1 text-slate-400 font-mono text-xs select-none", children: "..." }, `ellipsis-${idx}`)) : (_jsx("button", { type: "button", onClick: () => onPageChange(p), "aria-current": safeCurrentPage === p ? "page" : undefined, "aria-label": `Page ${p}`, className: `min-w-[28px] h-7 px-2 rounded-lg text-xs font-bold transition focus:outline-none focus:ring-1 focus:ring-[#007A6C] ${safeCurrentPage === p
                                ? "bg-[#007A6C] text-white shadow-2xs font-extrabold"
                                : "border border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"}`, children: p }, `page-${p}`))) }), _jsx("button", { type: "button", onClick: () => onPageChange(safeCurrentPage + 1), disabled: safeCurrentPage >= totalPages, "aria-label": "Go to next page", title: "Next page", className: "p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition focus:outline-none focus:ring-1 focus:ring-[#007A6C]", children: _jsx(ChevronRight, { className: "w-3.5 h-3.5" }) }), _jsx("button", { type: "button", onClick: () => onPageChange(totalPages), disabled: safeCurrentPage >= totalPages, "aria-label": "Go to last page", title: "Last page", className: "p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition focus:outline-none focus:ring-1 focus:ring-[#007A6C]", children: _jsx(ChevronsRight, { className: "w-3.5 h-3.5" }) })] })] }));
};
