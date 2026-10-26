import React from "react";
export interface TablePaginationProps {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
    pageSizeOptions?: number[];
    className?: string;
    itemLabel?: string;
}
/**
 * Smart page numbering generator with ellipsis windowing
 */
export declare function getPageNumbers(currentPage: number, totalPages: number): (number | "...")[];
/**
 * Universal accessible TablePagination component matching Akeezo branding
 */
export declare const TablePagination: React.FC<TablePaginationProps>;
//# sourceMappingURL=TablePagination.d.ts.map