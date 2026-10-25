import React from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { LegalLayout, colors } from "@akeezo/ui";
import { SiteHeader } from "../components/SiteHeader.js";
import { SiteFooter } from "../components/SiteFooter.js";

export interface LegalTemplateProps {
  data: PublicRouteResponseDTO;
}

export const LegalTemplate: React.FC<LegalTemplateProps> = ({ data }) => {
  const { path, siteSettings } = data;

  const renderContent = () => {
    switch (path) {
      case "/privacy":
        return (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              1. Introduction & Scope
            </h2>
            <p style={{ marginBottom: "16px", color: colors.darkNavy }}>
              AKEEZO Healthcare Platform Private Limited ("Akeezo", "we", "our", or "us") operates the website{" "}
              <strong>akeezo.com</strong> and connected healthcare discovery and coordination services. We are dedicated
              to safeguarding your privacy and ensuring the security of your Protected Health Information (PHI) and
              Personally Identifiable Information (PII).
            </p>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              This Privacy Policy explains how we collect, store, process, transfer, and protect your information in
              accordance with applicable global and regional data protection frameworks, including the{" "}
              <strong>European Union General Data Protection Regulation (EU GDPR)</strong>, the{" "}
              <strong>UK Data Protection Act 2018</strong>, the{" "}
              <strong>United States Health Insurance Portability and Accountability Act (HIPAA)</strong> security and
              privacy standards, and the <strong>Digital Personal Data Protection Act 2023 (DPDP Act, India)</strong>.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              2. Data We Collect
            </h2>
            <ul style={{ paddingLeft: "20px", marginBottom: "24px", color: colors.darkNavy, lineHeight: 1.8 }}>
              <li>
                <strong>Identity & Contact Data:</strong> Full legal name, date of birth, passport/national ID details
                (for medical visa facilitation), email address, telephone/WhatsApp contact number, and country of
                residence.
              </li>
              <li>
                <strong>Clinical & Health Records:</strong> Medical histories, radiology scans (DICOM, CT, MRI),
                laboratory diagnostic reports, current prescriptions, physician notes, and specific treatment inquiries
                uploaded directly by you or your authorized representative.
              </li>
              <li>
                <strong>Logistical & Travel Data:</strong> Desired travel dates, companion details, accommodation
                preferences, arrival flight details, and local transportation requirements in India.
              </li>
              <li>
                <strong>Technical & Telemetry Data:</strong> IP address, device fingerprints, browser version, access
                timestamps, and session telemetry used strictly for operational integrity and fraud prevention.
              </li>
            </ul>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              3. Purpose of Processing & Legal Basis
            </h2>
            <p style={{ marginBottom: "16px", color: colors.darkNavy }}>
              We process your personal and sensitive health data exclusively for legitimate medical facilitation
              purposes, based on your explicit consent:
            </p>
            <ul style={{ paddingLeft: "20px", marginBottom: "24px", color: colors.darkNavy, lineHeight: 1.8 }}>
              <li>Facilitating clinical second opinions and treatment cost estimates from partner NABH/JCI hospitals.</li>
              <li>Coordinating telemedicine consultations with certified medical specialists in India.</li>
              <li>Assisting with medical visa invitation letters (FRRO) and airport ground logistics.</li>
              <li>Ensuring communication continuity via your dedicated Akeezo Care Coordinator.</li>
            </ul>
            <p style={{ marginBottom: "24px", fontWeight: 700, color: colors.primaryTeal }}>
              We do not sell, rent, monetize, or trade your personal health data to any commercial third parties,
              advertisers, or insurers.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              4. Data Security & Storage Architecture
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              All health documents and communications are encrypted in transit using Transport Layer Security (TLS 1.3)
              and at rest using Advanced Encryption Standard (AES-256). Storage systems employ role-based access
              controls (RBAC) and audit logging to ensure that only authorized care coordinators and medical specialists
              assigned to your inquiry have access to your clinical documents.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              5. Cross-Border Health Data Transfers
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              As a global medical tourism and healthcare coordination facilitator, your records may be transmitted from
              your home country to partner hospitals in India for clinical evaluation. Cross-border transfers are
              conducted with your express written consent and backed by Standard Contractual Clauses (SCCs) and robust
              data processing agreements compliant with international data governance standards.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              6. Your Rights
            </h2>
            <p style={{ marginBottom: "16px", color: colors.darkNavy }}>
              Depending on your jurisdiction, you possess the right to:
            </p>
            <ul style={{ paddingLeft: "20px", marginBottom: "24px", color: colors.darkNavy, lineHeight: 1.8 }}>
              <li>Request access to all medical records and personal data held about you.</li>
              <li>Request correction or rectification of incomplete or inaccurate information.</li>
              <li>Request erasure of your records ("Right to be Forgotten"), subject to statutory medical record keeping rules.</li>
              <li>Withdraw consent for medical coordination at any time.</li>
            </ul>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              7. Data Protection Officer (DPO) Contact
            </h2>
            <div
              style={{
                backgroundColor: colors.lightGray,
                padding: "20px",
                borderRadius: "8px",
                border: `1px solid ${colors.borderGray}`
              }}
            >
              <p style={{ margin: "0 0 8px 0", fontWeight: 700, color: colors.darkNavy }}>
                Data Protection Officer:
              </p>
              <p style={{ margin: "0 0 4px 0", color: colors.darkNavy }}>
                Email:{" "}
                <a href="mailto:dpo@akeezo.com" style={{ color: colors.actionTeal, fontWeight: 700 }}>
                  dpo@akeezo.com
                </a>
              </p>
              <p style={{ margin: "0", color: colors.darkNavy }}>
                AKEEZO Healthcare Platform Private Limited, New Delhi, India 110001
              </p>
            </div>
          </div>
        );

      case "/terms":
        return (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              1. Platform Nature & Non-Clinical Role
            </h2>
            <div
              style={{
                backgroundColor: "#fff7ed",
                borderLeft: `4px solid ${colors.warningOrange}`,
                padding: "16px 20px",
                marginBottom: "24px",
                borderRadius: "4px"
              }}
            >
              <p style={{ margin: 0, fontWeight: 700, color: "#9a3412" }}>
                Important Clarification on Services:
              </p>
              <p style={{ margin: "8px 0 0 0", color: "#7c2d12", fontSize: "0.9375rem" }}>
                AKEEZO Healthcare Platform Private Limited is a healthcare discovery, facilitation, and medical tourism
                logistics platform. Akeezo is <strong>not</strong> a hospital, clinic, or medical treatment provider. We
                do not employ licensed physicians to provide medical treatment through our platform. All medical
                diagnoses, surgeries, and treatment regimens are delivered directly and independently by licensed
                hospitals and healthcare professionals.
              </p>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              2. User Obligations & Accuracy of Records
            </h2>
            <p style={{ marginBottom: "16px", color: colors.darkNavy }}>
              By submitting medical reports, diagnostic images, and inquiries on our platform, you confirm and warrant
              that:
            </p>
            <ul style={{ paddingLeft: "20px", marginBottom: "24px", color: colors.darkNavy, lineHeight: 1.8 }}>
              <li>All information and clinical records provided are authentic, accurate, and current.</li>
              <li>You have full legal authorization or guardianship to submit information on behalf of the patient.</li>
              <li>
                You will inform the hospital and treating medical team of all relevant health history, allergies, and
                current medications.
              </li>
            </ul>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              3. Treatment Quotations & Estimates
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              Cost estimates, treatment quotes, and length of hospital stay estimates shared by Akeezo represent
              preliminary estimates provided by partner healthcare institutions based on the initial records supplied.
              Final costs and treatment durations may vary based on in-person clinical examinations, unforeseen medical
              complications, or updated diagnostic evaluations performed by the treating hospital.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              4. Governing Law & Dispute Resolution
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              These Terms and any dispute or claim arising out of or in connection with them shall be governed by and
              construed in accordance with the laws of India. Any dispute arising out of this agreement shall be referred
              to and finally resolved by a sole arbitrator appointed in accordance with the{" "}
              <strong>Arbitration and Conciliation Act, 1996</strong>. The seat and venue of arbitration shall be New
              Delhi, India, and proceedings shall be conducted in the English language.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              5. Contact Information
            </h2>
            <p style={{ color: colors.darkNavy }}>
              For contractual inquiries or clarifications regarding these Terms, contact our legal desk at{" "}
              <a href="mailto:care@akeezo.com" style={{ color: colors.actionTeal, fontWeight: 700 }}>
                care@akeezo.com
              </a>{" "}
              or call our 24/7 Desk at{" "}
              <a href="tel:+918287639443" style={{ color: colors.actionTeal, fontWeight: 700 }}>
                +91 82876 39443
              </a>
              .
            </p>
          </div>
        );

      case "/disclaimer":
        return (
          <div>
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "32px"
              }}
            >
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: "#991b1b", marginTop: 0, marginBottom: "12px" }}>
                EMERGENCY MEDICAL WARNING
              </h2>
              <p style={{ margin: "0 0 12px 0", color: "#7f1d1d", fontSize: "1rem", lineHeight: 1.6 }}>
                AKEEZO DOES NOT PROVIDE EMERGENCY MEDICAL SERVICES. IF YOU OR A PATIENT IN YOUR CARE IS EXPERIENCING A
                LIFE-THREATENING EMERGENCY, IMMEDIATE SEVERE SYMPTOMS, OR TRAUMA, CALL YOUR LOCAL EMERGENCY SERVICES (112
                IN INDIA, 911 IN THE USA, 999 IN THE UK) OR REPORT TO THE NEAREST HOSPITAL EMERGENCY ROOM IMMEDIATELY.
              </p>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              1. Non-Medical Practice Statement
            </h2>
            <p style={{ marginBottom: "20px", color: colors.darkNavy }}>
              The content on akeezo.com, including text, graphics, treatment descriptions, cost calculators, blog
              articles, and answers generated by virtual assistants, is provided exclusively for general informational
              and educational purposes. It does not constitute medical advice, medical diagnosis, or a recommendation
              for any specific pharmaceutical product, medical device, or surgical procedure.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              2. Physician-Patient Relationship
            </h2>
            <p style={{ marginBottom: "20px", color: colors.darkNavy }}>
              Browsing our website, submitting an inquiry, or communicating with an Akeezo Care Coordinator does not
              establish a doctor-patient relationship. A doctor-patient relationship is formed solely between you and the
              licensed medical professional or hospital after an in-person or formal teleconsultation has been scheduled
              and conducted.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              3. Diagnostic Scans & AI Assistance
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              Any preliminary scan evaluations, summary extractions, or triage overviews presented on this website are
              computational aids designed to help you organize your medical documentation. They do not substitute for a
              formal radiology read or clinical diagnosis by a board-certified radiologist or surgeon.
            </p>
          </div>
        );

      case "/consent":
        return (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              1. Explicit Patient Consent for Healthcare Coordination
            </h2>
            <p style={{ marginBottom: "20px", color: colors.darkNavy }}>
              By utilizing the Akeezo medical discovery platform, you voluntarily authorize AKEEZO Healthcare Platform
              Private Limited and its verified care coordinators to:
            </p>
            <ul style={{ paddingLeft: "20px", marginBottom: "24px", color: colors.darkNavy, lineHeight: 1.8 }}>
              <li>
                Receive, review, and organize your clinical records, lab investigations, pathology reports, and
                radiology scans.
              </li>
              <li>
                Share your records with empanelled NABH and JCI accredited hospitals and medical specialists across India
                solely for obtaining clinical evaluations and treatment quotes.
              </li>
              <li>
                Liaise with hospital international patient desks to schedule teleconsultations, hospital admissions, and
                facilitate FRRO medical visa invitation letters.
              </li>
            </ul>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              2. Cross-Border Data Transmission Authorization
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              You expressly consent to the electronic transmission of your personal health data across international
              borders from your country of origin to India. We ensure that all receiving institutions adhere to strict
              confidentiality and healthcare data protection agreements.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              3. Right of Revocation
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              You retain the right to withdraw your consent at any stage prior to treatment delivery by writing to{" "}
              <a href="mailto:consent@akeezo.com" style={{ color: colors.actionTeal, fontWeight: 700 }}>
                consent@akeezo.com
              </a>
              . Upon receipt, your coordination file will be deactivated and personal documents securely archived or
              purged in accordance with applicable medical laws.
            </p>
          </div>
        );

      case "/refund-policy":
        return (
          <div>
            <div
              style={{
                backgroundColor: "rgba(0, 199, 190, 0.08)",
                border: `1px solid ${colors.primaryTeal}`,
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "32px"
              }}
            >
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.actionTeal, marginTop: 0, marginBottom: "12px" }}>
                Akeezo Service Surety Commitment
              </h2>
              <p style={{ margin: 0, color: colors.darkNavy, fontSize: "1rem", lineHeight: 1.6 }}>
                We stand firmly behind the dedication of our Care Coordination team. If our coordination service,
                scheduling support, or second-opinion facilitation fails to meet your expectations and you rate our
                service below 4 out of 5 stars, we provide a <strong>100% full refund</strong> of our coordination fee.
              </p>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              1. Coordination & Advisory Fees
            </h2>
            <p style={{ marginBottom: "20px", color: colors.darkNavy }}>
              Any administrative or coordination fees charged directly by Akeezo are fully refundable prior to the
              execution of hospital booking or specialist teleconsultation. Refund requests submitted to{" "}
              <a href="mailto:care@akeezo.com" style={{ color: colors.actionTeal, fontWeight: 700 }}>
                care@akeezo.com
              </a>{" "}
              are processed within 5 business days to the original payment method.
            </p>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              2. Direct Hospital Payments & Medical Deposits
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              Payments made directly to partner hospitals for inpatient admissions, surgical procedures, or diagnostic
              imaging are governed by the respective hospital's statutory cancellation and refund policies. Akeezo
              assists patients in submitting and tracking formal refund claims with hospital billing departments in the
              event of medical cancellation or visa denial.
            </p>
          </div>
        );

      case "/grievance-officer":
        return (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              Statutory Grievance Redressal Mechanism
            </h2>
            <p style={{ marginBottom: "24px", color: colors.darkNavy }}>
              In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media
              Ethics Code) Rules, 2021, and Section 13 of the Digital Personal Data Protection Act, 2023, the details of
              our Grievance Redressal Officer are published below:
            </p>

            <div
              style={{
                backgroundColor: "#ffffff",
                border: `2px solid ${colors.actionTeal}`,
                borderRadius: "12px",
                padding: "32px",
                marginBottom: "32px",
                boxShadow: "0 4px 16px rgba(0, 122, 108, 0.08)"
              }}
            >
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: colors.darkNavy, marginTop: 0, marginBottom: "16px" }}>
                Designated Grievance Officer
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "12px", color: colors.darkNavy }}>
                <strong>Name:</strong>
                <span>Yogesh Verma</span>

                <strong>Designation:</strong>
                <span>Co-Founder & Chief Operating Officer (COO)</span>

                <strong>Company:</strong>
                <span>AKEEZO Healthcare Platform Private Limited</span>

                <strong>Email:</strong>
                <a href="mailto:grievance@akeezo.com" style={{ color: colors.actionTeal, fontWeight: 700 }}>
                  grievance@akeezo.com
                </a>

                <strong>Helpline / Desk:</strong>
                <a href="tel:+918287639443" style={{ color: colors.actionTeal, fontWeight: 700 }}>
                  +91 82876 39443
                </a>

                <strong>Registered Office:</strong>
                <span>Regus Elegance, Jasola District Centre, New Delhi, India 110025</span>
              </div>
            </div>

            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              Grievance Redressal Timeline (SLA)
            </h2>
            <ul style={{ paddingLeft: "20px", color: colors.darkNavy, lineHeight: 1.8 }}>
              <li>
                <strong>Acknowledgment:</strong> Within <strong>48 hours</strong> of receipt of the grievance ticket or
                email.
              </li>
              <li>
                <strong>Resolution:</strong> Full investigation and redressal within <strong>30 days</strong> from the date
                of receipt.
              </li>
            </ul>
          </div>
        );

      default:
        return (
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              Legal Documentation
            </h2>
            <p style={{ color: colors.darkNavy }}>Please select a document from the sidebar to review our policies.</p>
          </div>
        );
    }
  };

  const getDocMeta = () => {
    switch (path) {
      case "/privacy":
        return {
          title: "Privacy Policy",
          subtitle: "How AKEEZO protects your health data under GDPR, HIPAA, and DPDP Act 2023.",
          category: "Data Protection"
        };
      case "/terms":
        return {
          title: "Terms of Service",
          subtitle: "Terms and conditions governing healthcare discovery and coordination services.",
          category: "Legal Agreement"
        };
      case "/disclaimer":
        return {
          title: "Medical Disclaimer",
          subtitle: "Critical information on platform scope, clinical independence, and emergency care.",
          category: "Medical Notice"
        };
      case "/consent":
        return {
          title: "Patient Consent & Teleconsultation Agreement",
          subtitle: "Consent for cross-border medical record coordination and teleconsultations.",
          category: "Patient Authorization"
        };
      case "/refund-policy":
        return {
          title: "Refund Policy",
          subtitle: "Transparent refund terms and our Service Surety money-back commitment.",
          category: "Financial Policy"
        };
      case "/grievance-officer":
        return {
          title: "Grievance Redressal Officer",
          subtitle: "Statutory grievance redressal under IT Intermediary Rules & DPDP Act 2023.",
          category: "Compliance & Governance"
        };
      default:
        return {
          title: "Legal Policy",
          subtitle: "AKEEZO Healthcare Platform documentation.",
          category: "Legal"
        };
    }
  };

  const meta = getDocMeta();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans text-ink">
      <SiteHeader siteSettings={siteSettings} activePath={path} />
      <div className="flex-1">
        <LegalLayout
          title={meta.title}
          subtitle={meta.subtitle}
          category={meta.category}
          activePath={path}
          lastUpdated="September 13, 2026"
        >
          {renderContent()}
        </LegalLayout>
      </div>
      <SiteFooter siteSettings={siteSettings} />
    </div>
  );
};
