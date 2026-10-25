import React from "react";
import { BrandLogo } from "./BrandLogo.js";

export interface FooterProps {
  phone?: string;
  careEmail?: string;
  medicalEmail?: string;
  partnershipEmail?: string;
  officeAddress?: string;
  legalEntity?: string;
  siteSettings?: any;
}

export const Footer: React.FC<FooterProps> = ({
  phone = "+91 82876 39443",
  careEmail = "care@akeezo.com",
  medicalEmail = "medical@akeezo.com",
  partnershipEmail = "partnership@akeezo.com",
  officeAddress = "New Delhi, India — 110001",
  legalEntity = "AKEEZO Healthcare Platform Private Limited"
}) => {
  return (
    <footer
      style={{
        backgroundColor: "var(--navy)",
        color: "#ffffff",
        paddingTop: "60px",
        paddingBottom: "40px",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "32px"
          }}
        >
          {/* Column 1: Brand & Tagline */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <BrandLogo variant="light" height={40} />
            <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem", lineHeight: 1.6 }}>
              Tell AKEEZO what you need and we coordinate the healthcare journey — hospital and doctor
              options, treatment cost estimates, travel, medical visas, and 24/7 care assistance in India.
            </p>
            <div style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.6)" }}>
              <p><strong>{legalEntity}</strong></p>
              <p>{officeAddress}</p>
            </div>
          </div>

          {/* Column 2: Discover & Plan */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--brand-teal)" }}>
              Care Discovery
            </h4>
            <a href="/treatments" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Treatments & Procedures
            </a>
            <a href="/hospitals" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Hospitals in India
            </a>
            <a href="/doctors" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Specialist Doctors
            </a>
            <a href="/destinations" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Destinations & Cities
            </a>
            <a href="/cost-calculator" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Treatment Cost Calculator
            </a>
            <a href="/plan-treatment" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Plan Treatment Journey
            </a>
          </div>

          {/* Column 3: Contact & Help */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--brand-teal)" }}>
              Contact Desks
            </h4>
            <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
              <p><strong>24/7 Helpline & WhatsApp:</strong></p>
              <a href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: "var(--brand-orange)", fontWeight: 700 }}>
                {phone}
              </a>
            </div>
            <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
              <p><strong>Care Team:</strong> <a href={`mailto:${careEmail}`} style={{ color: "#ffffff" }}>{careEmail}</a></p>
              <p><strong>Medical Tourism:</strong> <a href={`mailto:${medicalEmail}`} style={{ color: "#ffffff" }}>{medicalEmail}</a></p>
              <p><strong>Partnerships:</strong> <a href={`mailto:${partnershipEmail}`} style={{ color: "#ffffff" }}>{partnershipEmail}</a></p>
            </div>
          </div>

          {/* Column 4: Legal & Governance */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--brand-teal)" }}>
              Legal & Trust
            </h4>
            <a href="/privacy" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Privacy Policy (DPDP & GDPR)
            </a>
            <a href="/terms" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Terms of Service
            </a>
            <a href="/disclaimer" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Medical Disclaimer
            </a>
            <a href="/consent" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Patient Consent Framework
            </a>
            <a href="/refund-policy" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Refund Policy (Service Surety)
            </a>
            <a href="/grievance-officer" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
              Grievance Officer (IT Act)
            </a>
          </div>
        </div>

        {/* Disclaimer Bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
            fontSize: "0.75rem",
            color: "rgba(255, 255, 255, 0.5)",
            lineHeight: 1.6
          }}
        >
          <p>
            <strong>Medical Notice:</strong> AKEEZO functions strictly as an independent healthcare journey
            coordination and medical tourism facilitation platform. AKEEZO does not practice medicine, provide medical
            diagnoses, or employ treating doctors. All medical treatments and surgeries are performed independently by
            accredited hospitals and licensed physicians.
          </p>
          <p style={{ marginTop: "8px" }}>
            © {new Date().getFullYear()} {legalEntity}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
