import React from "react";
export interface LegalTocItem {
    id: string;
    title: string;
}
export interface LegalLayoutProps {
    title: string;
    subtitle: string;
    category: string;
    lastUpdated?: string;
    activePath: string;
    toc?: LegalTocItem[];
    children: React.ReactNode;
}
export declare const LegalLayout: React.FC<LegalLayoutProps>;
//# sourceMappingURL=LegalLayout.d.ts.map