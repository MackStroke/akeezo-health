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

const LEGAL_DOCS = [
  { path: "/privacy", title: "Privacy Policy", subtitle: "GDPR, HIPAA & DPDP Data Protection" },
  { path: "/terms", title: "Terms of Service", subtitle: "Platform Usage & Facilitation Agreement" },
  { path: "/disclaimer", title: "Medical Disclaimer", subtitle: "Non-Clinical Role & Physician Authority" },
  { path: "/consent", title: "Patient Consent", subtitle: "Cross-Border PHI Transfer & Care Authorization" },
  { path: "/refund-policy", title: "Refund Policy", subtitle: "Service Surety & Money-Back Commitment" },
  { path: "/grievance-officer", title: "Grievance Officer", subtitle: "Complaint Redressal under IT Act & DPDP" },
  { path: "/changelog", title: "Release Changelog", subtitle: "Official Platform Updates & Notes" },
  { path: "/blog", title: "Medical Blog & Guides", subtitle: "Clinical Insights & Hospital Comparisons" }
];

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  category,
  lastUpdated = "September 13, 2026",
  activePath,
  toc = [],
  children
}) => {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8fafc" }}>
      {/* Hero Header */}
      <section
        style={{
          backgroundColor: "var(--navy)",
          color: "#ffffff",
          padding: "48px 0 56px 0",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
        }}
      >
        <div className="container" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                backgroundColor: "rgba(0, 199, 190, 0.2)",
                color: "#00c7be",
                border: "1px solid rgba(0, 199, 190, 0.3)",
                fontSize: "0.75rem",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "var(--radius-pill)"
              }}
            >
              {category}
            </span>
            <span style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.7)" }}>
              Last Updated: <strong>{lastUpdated}</strong>
            </span>
          </div>

          <h1 style={{ fontSize: "2.25rem", fontWeight: 900, color: "#ffffff", lineHeight: 1.2 }}>
            {title}
          </h1>

          <p style={{ fontSize: "1rem", color: "rgba(255, 255, 255, 0.8)", maxWidth: "800px", lineHeight: 1.6 }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Body */}
      <div className="container" style={{ padding: "40px var(--page-gutter) 80px", flex: 1 }}>
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start w-full">
          {/* Left Sticky Sidebar */}
          <aside className="w-full lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-[90px]">
            {/* Legal Documents Nav */}
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-card)",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}
            >
              <span
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--ink-muted)",
                  display: "block",
                  paddingBottom: "10px",
                  borderBottom: "1px solid var(--border)"
                }}
              >
                Legal Documents
              </span>

              <nav style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "12px" }}>
                {LEGAL_DOCS.map((doc) => {
                  const isActive = activePath === doc.path;
                  return (
                    <a
                      key={doc.path}
                      href={doc.path}
                      style={{
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
                      }}
                    >
                      <span>{doc.title}</span>
                      <span
                        style={{
                          fontSize: "0.6875rem",
                          color: isActive ? "rgba(255, 255, 255, 0.8)" : "var(--ink-muted)"
                        }}
                      >
                        {doc.subtitle}
                      </span>
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Quick Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") window.print();
                }}
                style={{
                  flex: 1,
                  padding: "10px",
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  backgroundColor: "#ffffff",
                  color: "var(--ink)",
                  cursor: "pointer"
                }}
              >
                Print Document
              </button>
              <a
                href="mailto:dpo@akeezo.com?subject=Legal%20Compliance%20Inquiry"
                style={{
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
                }}
              >
                Contact DPO
              </a>
            </div>
          </aside>

          {/* Right Main Article */}
          <article className="w-full lg:col-span-8 bg-white border border-border rounded-[20px] p-6 sm:p-10 shadow-xs leading-relaxed overflow-x-hidden">
            {children}
          </article>
        </div>
      </div>
    </div>
  );
};
