import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LEGAL_DOCS = [
    { path: "/privacy", title: "Privacy Policy", subtitle: "GDPR, HIPAA & DPDP Data Protection" },
    { path: "/terms", title: "Terms of Service", subtitle: "Platform Usage & Facilitation Agreement" },
    { path: "/disclaimer", title: "Medical Disclaimer", subtitle: "Non-Clinical Role & Physician Authority" },
    { path: "/consent", title: "Patient Consent", subtitle: "Cross-Border PHI Transfer & Care Authorization" },
    { path: "/refund-policy", title: "Refund Policy", subtitle: "Service Surety & Money-Back Commitment" },
    { path: "/grievance-officer", title: "Grievance Officer", subtitle: "Complaint Redressal under IT Act & DPDP" }
];
export const LegalLayout = ({ title, subtitle, category, lastUpdated = "September 13, 2026", activePath, toc = [], children }) => {
    return (_jsxs("div", { style: { minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }, children: [_jsx("section", { style: {
                    backgroundColor: "var(--navy)",
                    color: "#ffffff",
                    padding: "48px 0 56px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
                }, children: _jsxs("div", { className: "container", style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [_jsx("span", { style: {
                                        backgroundColor: "rgba(0, 199, 190, 0.2)",
                                        color: "#00c7be",
                                        border: "1px solid rgba(0, 199, 190, 0.3)",
                                        fontSize: "0.75rem",
                                        fontWeight: 700,
                                        padding: "4px 10px",
                                        borderRadius: "var(--radius-pill)"
                                    }, children: category }), _jsxs("span", { style: { fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.7)" }, children: ["Last Updated: ", _jsx("strong", { children: lastUpdated })] })] }), _jsx("h1", { style: { fontSize: "2.25rem", fontWeight: 900, color: "#ffffff", lineHeight: 1.2 }, children: title }), _jsx("p", { style: { fontSize: "1rem", color: "rgba(255, 255, 255, 0.8)", maxWidth: "800px", lineHeight: 1.6 }, children: subtitle })] }) }), _jsx("div", { className: "container", style: { padding: "40px var(--page-gutter) 80px", flex: 1 }, children: _jsxs("div", { style: {
                        display: "grid",
                        gridTemplateColumns: "repeat(12, 1fr)",
                        gap: "32px",
                        alignItems: "start"
                    }, children: [_jsxs("aside", { style: {
                                gridColumn: "span 4",
                                display: "flex",
                                flexDirection: "column",
                                gap: "24px",
                                position: "sticky",
                                top: "90px"
                            }, children: [_jsxs("div", { style: {
                                        backgroundColor: "#ffffff",
                                        border: "1px solid var(--border)",
                                        borderRadius: "var(--radius-card)",
                                        padding: "20px",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                                    }, children: [_jsx("span", { style: {
                                                fontSize: "0.6875rem",
                                                fontWeight: 800,
                                                textTransform: "uppercase",
                                                letterSpacing: "0.05em",
                                                color: "var(--ink-muted)",
                                                display: "block",
                                                paddingBottom: "10px",
                                                borderBottom: "1px solid var(--border)"
                                            }, children: "Legal Documents" }), _jsx("nav", { style: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }, children: LEGAL_DOCS.map((doc) => {
                                                const isActive = activePath === doc.path;
                                                return (_jsxs("a", { href: doc.path, style: {
                                                        padding: "10px 12px",
                                                        borderRadius: "8px",
                                                        fontSize: "0.8125rem",
                                                        fontWeight: isActive ? 700 : 500,
                                                        backgroundColor: isActive ? "var(--action)" : "transparent",
                                                        color: isActive ? "#ffffff" : "var(--ink)",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "2px",
                                                        transition: "all 0.15s ease"
                                                    }, children: [_jsx("span", { children: doc.title }), _jsx("span", { style: {
                                                                fontSize: "0.6875rem",
                                                                color: isActive ? "rgba(255, 255, 255, 0.8)" : "var(--ink-muted)"
                                                            }, children: doc.subtitle })] }, doc.path));
                                            }) })] }), _jsxs("div", { style: { display: "flex", gap: "10px" }, children: [_jsx("button", { type: "button", onClick: () => {
                                                if (typeof window !== "undefined")
                                                    window.print();
                                            }, style: {
                                                flex: 1,
                                                padding: "10px",
                                                fontSize: "0.8125rem",
                                                fontWeight: 700,
                                                borderRadius: "8px",
                                                border: "1px solid var(--border)",
                                                backgroundColor: "#ffffff",
                                                color: "var(--ink)",
                                                cursor: "pointer"
                                            }, children: "Print Document" }), _jsx("a", { href: "mailto:dpo@akeezo.com?subject=Legal%20Compliance%20Inquiry", style: {
                                                flex: 1,
                                                padding: "10px",
                                                fontSize: "0.8125rem",
                                                fontWeight: 700,
                                                borderRadius: "8px",
                                                border: "1px solid var(--border)",
                                                backgroundColor: "#ffffff",
                                                color: "var(--action)",
                                                textAlign: "center",
                                                textDecoration: "none"
                                            }, children: "Contact DPO" })] })] }), _jsx("article", { style: {
                                gridColumn: "span 8",
                                backgroundColor: "#ffffff",
                                border: "1px solid var(--border)",
                                borderRadius: "var(--radius-card)",
                                padding: "40px",
                                boxShadow: "var(--shadow-card)",
                                lineHeight: 1.7
                            }, children: children })] }) })] }));
};
