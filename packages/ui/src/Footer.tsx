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
      <div className="container" style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
        {/* Brand Header */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "24px" }}>
          <BrandLogo variant="light" height={40} />
          <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: "720px" }}>
            Tell AKEEZO what you need and we coordinate the healthcare journey — hospital and doctor
            options, treatment cost estimates, travel, medical visas, and 24/7 care assistance in India.
          </p>
        </div>

        {/* TOP SECTION: B2C (Patient Care & Individual Discovery) */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "rgba(0, 122, 108, 0.3)", color: "var(--brand-teal)", padding: "4px 10px", borderRadius: "9999px", border: "1px solid rgba(0, 122, 108, 0.4)" }}>
              B2C · Patient Services
            </span>
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, margin: 0, color: "#ffffff" }}>
              Patients &amp; Individual Healthcare
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "28px"
            }}
          >
            {/* B2C Col 1: Care Discovery */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Care Discovery
              </h4>
              <a href="/treatments" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Treatments &amp; Procedures
              </a>
              <a href="/hospitals" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Hospitals in India
              </a>
              <a href="/doctors" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Specialist Doctors
              </a>
              <a href="/destinations" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Destinations &amp; Cities
              </a>
              <a href="/cost-calculator" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Treatment Cost Calculator
              </a>
            </div>

            {/* B2C Col 2: Patient Journey */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Journey Assistance
              </h4>
              <a href="/#opinion" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Free Second Opinion
              </a>
              <a href="/#visa" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Medical Visa (e-Med) Assistance
              </a>
              <a href="/#concierge" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Airport Concierge &amp; Stay
              </a>
              <a href="/#telehealth" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Video Consultation Desk
              </a>
              <a href="/contact" style={{ color: "var(--brand-teal)", fontSize: "0.875rem", fontWeight: 700 }}>
                Contact Us &amp; Support &rarr;
              </a>
            </div>

            {/* B2C Col 3: Quality & Trust */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Patient Trust
              </h4>
              <span style={{ color: "var(--brand-teal)", fontSize: "0.875rem", fontWeight: 600 }}>
                JCI &amp; NABH Audited Network
              </span>
              <a href="/refund-policy" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Zero-Markup Billing Guarantee
              </a>
              <a href="/consent" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Informed Patient Consent
              </a>
              <a href="/privacy" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Patient Privacy Rights
              </a>
              <a href="/disclaimer" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Medical Notice &amp; Safety
              </a>
            </div>

            {/* B2C Col 4: Community & Insights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Community &amp; Insights
              </h4>
              <a href="/community" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Ask Community (Q&amp;A)
              </a>
              <a href="/community" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Patient Recovery Stories
              </a>
              <a href="/blog" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Clinical Blog &amp; Guides
              </a>
              <a href="/about" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Meet Our Leadership &amp; Story
              </a>
              <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", marginTop: "4px" }}>
                ISO 9001:2015 Certified
              </span>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: B2B (Healthcare Partners, Providers, Facilitators & Corporate) */}
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "16px",
            padding: "24px 28px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <span style={{ fontSize: "0.6875rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", backgroundColor: "rgba(255, 255, 255, 0.15)", color: "#ffffff", padding: "4px 10px", borderRadius: "9999px" }}>
              B2B · Institutional Network
            </span>
            <h3 style={{ fontSize: "1.0625rem", fontWeight: 700, margin: 0, color: "#ffffff" }}>
              Healthcare Providers, Partners &amp; Corporate Desks
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "28px"
            }}
          >
            {/* B2B Col 1: Hospital & Clinics Network */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Hospitals &amp; Clinics
              </h4>
              <a href="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                List Your Hospital / Clinic
              </a>
              <a href="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Doctor &amp; Specialist Onboarding
              </a>
              <a href="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Hospital SLA &amp; Rate Cards
              </a>
              <a href="/hospitals" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Accreditation Compliance
              </a>
            </div>

            {/* B2B Col 2: Facilitators & Agents */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Agents &amp; Facilitators
              </h4>
              <a href="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Facilitator Portal Login
              </a>
              <a href="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                International Referral Network
              </a>
              <a href="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Commission Framework
              </a>
              <a href="/contact" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Institutional Travel Desk
              </a>
            </div>

            {/* B2B Col 3: Corporate & Legal */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Legal &amp; Governance
              </h4>
              <a href="/privacy" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Privacy Policy (DPDP &amp; GDPR)
              </a>
              <a href="/terms" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Terms of Service
              </a>
              <a href="/disclaimer" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Medical Disclaimer
              </a>
              <a href="/grievance-officer" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Grievance Officer (IT Act)
              </a>
              <a href="/refund-policy" style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "0.875rem" }}>
                Refund Policy
              </a>
            </div>

            {/* B2B Col 4: Corporate Desks & Contact */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--brand-teal)", margin: "0 0 4px 0" }}>
                Corporate Desks
              </h4>
              <div style={{ fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.6 }}>
                <p style={{ margin: "0 0 2px 0" }}><strong>24/7 Helpline:</strong></p>
                <a href={`tel:${phone.replace(/\s+/g, "")}`} style={{ color: "var(--brand-orange)", fontWeight: 700 }}>
                  {phone}
                </a>
              </div>
              <div style={{ fontSize: "0.8125rem", color: "rgba(255, 255, 255, 0.8)", lineHeight: 1.5 }}>
                <p style={{ margin: "0 0 2px 0" }}><strong>Care:</strong> <a href={`mailto:${careEmail}`} style={{ color: "#ffffff" }}>{careEmail}</a></p>
                <p style={{ margin: "0 0 2px 0" }}><strong>Medical:</strong> <a href={`mailto:${medicalEmail}`} style={{ color: "#ffffff" }}>{medicalEmail}</a></p>
                <p style={{ margin: "0" }}><strong>Partners:</strong> <a href={`mailto:${partnershipEmail}`} style={{ color: "#ffffff" }}>{partnershipEmail}</a></p>
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.5)", marginTop: "4px" }}>
                <p style={{ margin: 0 }}><strong>{legalEntity}</strong></p>
                <p style={{ margin: 0 }}>{officeAddress}</p>
              </div>
            </div>
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
