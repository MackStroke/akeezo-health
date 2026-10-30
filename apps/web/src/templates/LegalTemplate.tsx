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

  const legalEntityName = siteSettings?.legalEntityName || "AKEEZO Healthcare Platform Private Limited";
  const careEmail = siteSettings?.careEmail || "care@akeezo.com";
  const phone = siteSettings?.phone || "+91 82876 39443";
  const rawPhone = phone.replace(/\s+/g, "");
  const officeAddress =
    siteSettings?.officeAddress || "Regus Elegance, 2F, Jasola District Centre, Jasola, New Delhi, India 110025";

  const grievanceOfficer = siteSettings?.grievanceOfficer || {
    name: "Yogesh Verma",
    designation: "Co-Founder & Chief Operating Officer",
    email: "grievance@akeezo.com",
    helpline: "+91 82876 39443",
    address: "Regus Elegance, Jasola District Centre, New Delhi, India 110025"
  };
  const rawGrievanceHelpline = (grievanceOfficer.helpline || phone).replace(/\s+/g, "");

  const dpoContact = siteSettings?.dpoContact || {
    email: "dpo@akeezo.com",
    address: "AKEEZO Healthcare Platform Private Limited, New Delhi, India 110001"
  };

  const renderContent = () => {
    switch (path) {
      case "/privacy":
        return (
          <div className="space-y-8 text-ink">
            {/* Health Data Privacy & Security Assurance Banner */}
            <div
              style={{
                backgroundColor: "rgba(0, 199, 190, 0.08)",
                border: `1px solid ${colors.primaryTeal}`,
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{
                    backgroundColor: colors.actionTeal,
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Statutory Privacy Compliance
                </span>
                <span className="text-xs font-semibold text-actionTeal">
                  DPDP Act 2023 • EU GDPR • US HIPAA ePHI
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: colors.darkNavy, margin: "0 0 8px 0" }}>
                Patient Health Data Privacy & Clinical Security Assurance
              </h2>
              <p style={{ margin: 0, color: colors.darkNavy, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {legalEntityName} adheres to the highest global data governance benchmarks. We encrypt all medical
                records in transit and at rest, enforce strict least-privilege role-based access, and maintain a
                stringent policy: <strong>we never sell, monetize, or commercialize patient health data</strong>.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                1. Introduction, Data Controller & Regulatory Framework
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                {legalEntityName} ("Akeezo", "we", "our", or "us") operates the website <strong>akeezo.com</strong> and
                connected medical travel facilitation services under the "Heal in India" initiative. We serve
                international patients seeking accredited clinical diagnostics, surgical procedures, and medical second
                opinions from premier healthcare institutions in India.
              </p>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Because medical coordination inherently involves sensitive clinical records (Protected Health Information
                or PHI), we have structured our technical, organizational, and governance architecture in full compliance
                with applicable global and regional legal frameworks:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, India):</strong> As a Data Fiduciary
                  processing digital personal data within the territory of India.
                </li>
                <li>
                  <strong>General Data Protection Regulation (Regulation (EU) 2016/679 - GDPR):</strong> As a Data
                  Controller and Processor regarding patients situated in the European Union and European Economic Area.
                </li>
                <li>
                  <strong>UK Data Protection Act 2018:</strong> Applying UK GDPR protections for patients resident in the
                  United Kingdom.
                </li>
                <li>
                  <strong>Health Insurance Portability and Accountability Act (HIPAA, USA):</strong> Incorporating
                  HIPAA Security, Privacy, and Breach Notification rules for electronic Protected Health Information
                  (ePHI) during medical data storage, handling, and transmission.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                2. Categories of Personal & Health Data We Collect
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                We collect personal information directly from you, through authorized representatives, or via our digital
                portal strictly as necessary to provide personalized healthcare discovery and coordination:
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy mb-1">A. Identity & Know-Your-Customer (KYC) Data</h3>
                  <p className="text-xs text-inkMuted leading-relaxed">
                    Full legal name, gender, date of birth, nationality, passport number, national identity documents,
                    and photographs required for official Medical Visa (MED / MEDX) facilitation and hospital inpatient
                    registration.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy mb-1">
                    B. Clinical & Sensitive Personal Health Data (PHI)
                  </h3>
                  <p className="text-xs text-inkMuted leading-relaxed">
                    Medical histories, current physical symptoms, prior surgery records, known drug allergies,
                    pathology and biopsy laboratory reports, radiology imaging files (DICOM, CT scans, MRI, X-rays,
                    ultrasounds), physician consultation notes, and current prescription regimens.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy mb-1">C. Travel & Logistical Preferences</h3>
                  <p className="text-xs text-inkMuted leading-relaxed">
                    Preferred dates of travel, accompanying attendant/family details, accommodation preferences, flight
                    itineraries, language interpretation requirements, and airport ground transport needs in India.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy mb-1">D. Technical & Telemetry Information</h3>
                  <p className="text-xs text-inkMuted leading-relaxed">
                    IP address (truncated and anonymized where applicable), browser type and version, operating system,
                    access timestamps, referring URLs, and essential encrypted session security tokens.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                3. Lawful Grounds and Purposes of Processing
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                In compliance with Section 6 of the DPDP Act 2023 and Article 6 & Article 9 of the EU GDPR, we process
                your personal data on the following lawful bases:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Explicit Consent:</strong> You voluntarily provide specific, informed, and unambiguous consent
                  when uploading medical records or requesting coordination.
                </li>
                <li>
                  <strong>Performance of Facilitation Services:</strong> Processing is essential to obtain specialist
                  second opinions, provide accurate cost estimates, and arrange hospital admission.
                </li>
                <li>
                  <strong>Statutory & Regulatory Obligations:</strong> Compliance with Foreigners Regional Registration
                  Officer (FRRO) reporting rules, healthcare documentation, and IT Intermediary Rules.
                </li>
              </ul>
              <div
                style={{
                  backgroundColor: "#fff7ed",
                  borderLeft: `4px solid ${colors.brandOrange}`,
                  padding: "16px 20px",
                  borderRadius: "4px"
                }}
              >
                <p style={{ margin: 0, fontWeight: 700, color: "#9a3412", fontSize: "0.9375rem" }}>
                  Our Zero-Monetization Commitment:
                </p>
                <p style={{ margin: "6px 0 0 0", color: "#7c2d12", fontSize: "0.875rem", lineHeight: 1.6 }}>
                  Akeezo does not sell, lease, license, or trade your personal health data to advertising brokers,
                  insurance underwriters, pharmaceutical manufacturers, or commercial data aggregators.
                </p>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                4. Data Security & Technical Architecture
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                We apply defense-in-depth security measures to protect Protected Health Information against unauthorized
                access, alteration, disclosure, or destruction:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Encryption in Transit:</strong> All data transmitted to and from our platform is enforced with
                  Transport Layer Security (TLS 1.3) utilizing strong cipher suites and HTTP Strict Transport Security
                  (HSTS).
                </li>
                <li>
                  <strong>Encryption at Rest:</strong> Diagnostic scans, reports, and database records are stored in
                  isolated, encrypted storage vaults using Advanced Encryption Standard (AES-256).
                </li>
                <li>
                  <strong>Role-Based Access Control (RBAC):</strong> Access to patient medical records is strictly
                  restricted on a least-privilege basis to assigned Care Coordinators and verified hospital clinicians.
                </li>
                <li>
                  <strong>Immutable Audit Logging:</strong> Every viewing, download, or transmission of medical files is
                  cryptographically recorded in tamper-evident access audit logs.
                </li>
                <li>
                  <strong>Threat & Malware Scanning:</strong> All uploaded medical imaging files and documents undergo
                  automated anti-malware and virus inspection prior to ingestion.
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                5. Cross-Border Health Data Transfers
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Because Akeezo coordinates medical care for international patients traveling to India, your personal and
                clinical health records are transmitted across international borders from your country of residence to
                empanelled healthcare institutions in India.
              </p>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                All cross-border transfers are conducted pursuant to your explicit consent and protected by robust
                governance mechanisms, including Standard Contractual Clauses (SCCs), Business Associate Agreements
                (BAAs), and strict Data Processing Addenda requiring Indian partner hospitals to maintain confidentiality
                and data protection standards equivalent to GDPR and DPDP requirements.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                6. Data Retention & Secure Disposal
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                We retain your personal and medical information only for as long as necessary to fulfill the purposes
                outlined in this policy:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Active Coordination:</strong> Retained throughout the duration of medical consultation, travel,
                  hospital admission, and post-discharge follow-up care.
                </li>
                <li>
                  <strong>Clinical Documentation Archival:</strong> Medical summaries and discharge certificates are
                  retained in accordance with National Medical Commission (NMC) guidelines and statutory Indian healthcare
                  record retention rules.
                </li>
                <li>
                  <strong>Cryptographic Sanitization:</strong> Once the retention period lapses or upon validated erasure
                  request, all physical and electronic records are permanently purged using secure cryptographic erasure.
                </li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                7. Your Statutory Rights as a Data Principal
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Depending on your jurisdiction (including India, the European Union, the United Kingdom, and the United
                States), you are entitled to exercise the following legal rights:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Right of Access & Summary:</strong> You may request a complete summary of your personal data and
                  health records held by Akeezo.
                </li>
                <li>
                  <strong>Right to Correction & Rectification:</strong> You may update or correct incomplete, inaccurate,
                  or misleading personal and health details.
                </li>
                <li>
                  <strong>Right to Erasure ("Right to be Forgotten"):</strong> You may request deletion of your records,
                  subject to statutory medical retention obligations.
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> You may withdraw your consent for medical coordination at
                  any time without retroactive penalty.
                </li>
                <li>
                  <strong>Right of Nomination (DPDP Act, Sec 14):</strong> You may nominate a trusted individual to
                  exercise your data rights in the event of death or incapacity.
                </li>
                <li>
                  <strong>Right to Grievance Redressal:</strong> You have the right to lodge a grievance directly with our
                  Data Protection Officer or appeal to the Data Protection Board of India (DPBI) or your national
                  supervisory authority.
                </li>
              </ul>
            </div>

            {/* Section 8 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                8. Cookies & Telemetry Transparency
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Our website uses strictly necessary session cookies for user authentication, security verification, and
                CSRF defense. We also deploy privacy-respecting, aggregated performance metrics (such as Google
                Analytics with IP anonymization enabled) to analyze web traffic trends and improve platform usability. You
                can manage or disable cookie preferences directly in your browser settings at any time.
              </p>
            </div>

            {/* Section 9: DPO Contact Card */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                9. Data Protection Officer (DPO) Contact
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                If you have questions regarding this Privacy Policy, wish to exercise your statutory rights, or have
                concerns regarding how your clinical records are processed, please contact our Data Protection Officer:
              </p>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "24px",
                  borderRadius: "12px",
                  border: `1px solid ${colors.border}`,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
                }}
              >
                <h3 style={{ margin: "0 0 12px 0", fontWeight: 800, fontSize: "1.125rem", color: colors.darkNavy }}>
                  Office of the Data Protection Officer
                </h3>
                <div className="space-y-2 text-sm text-ink">
                  <div>
                    <span className="font-bold text-darkNavy">Entity: </span>
                    <span>{legalEntityName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">Official DPO Email: </span>
                    <a
                      href={`mailto:${dpoContact.email}`}
                      style={{ color: colors.actionTeal, fontWeight: 700 }}
                      className="hover:underline"
                    >
                      {dpoContact.email}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">Care Coordination Desk: </span>
                    <a
                      href={`mailto:${careEmail}`}
                      style={{ color: colors.actionTeal, fontWeight: 700 }}
                      className="hover:underline"
                    >
                      {careEmail}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">Mailing Address: </span>
                    <span>{dpoContact.address || officeAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "/terms":
        return (
          <div className="space-y-8 text-ink">
            {/* Platform Nature Clarification Alert */}
            <div
              style={{
                backgroundColor: "#fff7ed",
                borderLeft: `4px solid ${colors.brandOrange}`,
                padding: "20px 24px",
                borderRadius: "8px"
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{
                    backgroundColor: colors.brandOrange,
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase"
                  }}
                >
                  Important Legal Notice
                </span>
                <span className="text-xs font-semibold text-amber-900">
                  Section 79, Information Technology Act, 2000
                </span>
              </div>
              <p style={{ margin: 0, fontWeight: 800, color: "#9a3412", fontSize: "1rem" }}>
                Non-Clinical Healthcare Intermediary & Facilitator Status
              </p>
              <p style={{ margin: "8px 0 0 0", color: "#7c2d12", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                {legalEntityName} is a technology-enabled healthcare discovery and medical tourism concierge platform.
                Akeezo is <strong>not</strong> a hospital, clinic, diagnostic center, or direct healthcare provider. We
                do not employ physicians to practice medicine via the platform. All clinical consultations, surgical
                procedures, treatments, and medical prescriptions are provided exclusively and independently by licensed
                hospitals and healthcare professionals.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                1. Acceptance of Terms & Entity Information
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                These Terms of Service ("Terms") constitute a legally binding agreement between you (the "User", "Patient",
                or "Legal Guardian") and {legalEntityName} ("Akeezo", "we", "our", or "us"), incorporated under the
                Companies Act, 2013, India.
              </p>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                By accessing <strong>akeezo.com</strong>, using the Surgery Cost Calculator, submitting medical records,
                engaging with an Akeezo Care Coordinator via WhatsApp, phone, or email, or receiving medical travel
                logistics support, you agree to be bound by these Terms and our integrated Privacy Policy and Medical
                Disclaimer. If you do not agree, you must immediately refrain from using our services.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                2. User Obligations & Accuracy of Clinical Records
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                When submitting medical reports, diagnostic imaging, and health inquiries on our platform, you warrant
                and represent that:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>You are at least 18 years of age or possess legal guardianship / power of attorney for the patient.</li>
                <li>
                  All medical documentation, diagnostic scans, past surgical history, and known drug allergies provided
                  are genuine, authentic, complete, and unmanipulated.
                </li>
                <li>
                  You understand that submitting altered, forged, or incomplete medical records may lead to inaccurate
                  treatment estimates, clinical misjudgments, and cancellation of hospital care.
                </li>
                <li>
                  You will promptly disclose any pre-existing health conditions, communicable diseases, or ongoing
                  medications to treating medical staff upon hospital admission.
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                3. Treatment Quotations, Cost Calculator & Zero-Markup Transparency
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Our Surgery Cost Calculator and preliminary quotation letters provide estimated cost brackets based on
                preliminary record reviews conducted by partner hospital international patient desks.
              </p>
              <div className="space-y-3 mb-4">
                <div className="p-3.5 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy">Preliminary Estimates</h3>
                  <p className="text-xs text-inkMuted leading-relaxed mt-0.5">
                    All cost ranges, package inclusions, and length of hospital stay estimates are indicative and subject
                    to revision following in-person clinical examinations, pre-operative bloodwork, and surgeon
                    consultation at the treating hospital.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy">Direct Hospital Billing</h3>
                  <p className="text-xs text-inkMuted leading-relaxed mt-0.5">
                    Treatment bills, surgeon fees, surgical implants, and room tariffs are billed directly by the
                    accredited hospital. Akeezo adheres to a strict <strong>Zero-Markup Guarantee</strong>: we never
                    inflate or mark up official hospital medical packages.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                4. Medical Visa (FRRO) & Sovereign Immigration Discretion
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Akeezo assists patients and certified attendants in procuring official Medical Visa (MED / MEDX)
                invitation letters issued directly by empanelled hospitals. However, visa granting, immigration entry,
                stay duration, and FRRO clearance remain under the sole sovereign jurisdiction of the Ministry of External
                Affairs and Bureau of Immigration, Government of India. Akeezo is not liable for sovereign visa delays,
                rejections, or border clearance issues.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                5. Intellectual Property & Permitted Platform Use
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                All software, user interface designs, proprietary algorithms, database structures, trademarks, logos, and
                original articles on <strong>akeezo.com</strong> are the exclusive intellectual property of {legalEntityName}
                . Users are granted a limited, revocable, non-exclusive license for personal, non-commercial use. Automated
                scraping, harvesting, copying, or reverse engineering of directory listings or pricing datasets is
                strictly prohibited.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                6. Limitation of Liability & Hold Harmless
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                To the fullest extent permissible by applicable law:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  Akeezo, its directors, officers, employees, and affiliates shall not be liable for any medical outcomes,
                  surgical complications, post-operative infections, clinical errors, or malpractice committed by partner
                  hospitals or physicians.
                </li>
                <li>
                  Akeezo is not responsible for airline cancellations, flight delays, weather disruptions, or baggage
                  losses incurred during international medical travel.
                </li>
                <li>
                  In any event, Akeezo's total aggregate liability arising out of or related to non-clinical concierge
                  services shall not exceed the facilitation fee (if any) paid directly by the user to Akeezo for the
                  specific coordination service.
                </li>
              </ul>
            </div>

            {/* Section 7 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                7. Suspension & Termination of Services
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Akeezo reserves the right to suspend or terminate services immediately without prior notice in the event
                of fraudulent document submission, verbally or physically abusive conduct directed at care coordinators or
                hospital personnel, or any breach of applicable domestic or international laws.
              </p>
            </div>

            {/* Section 8 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                8. Governing Law & Binding Arbitration
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                These Terms and any claim or dispute arising out of or in connection with them shall be governed by and
                construed in accordance with the substantive laws of the Republic of India.
              </p>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Any dispute, controversy, or claim shall first be submitted to mutual amicable conciliation for 30 days.
                If unresolved, it shall be referred to and finally resolved by binding arbitration conducted by a sole
                arbitrator appointed in accordance with the <strong>Arbitration and Conciliation Act, 1996</strong>. The
                seat and venue of arbitration shall be New Delhi, India, and proceedings shall be in English. Subject to
                arbitration, the courts of New Delhi, India shall have exclusive territorial jurisdiction.
              </p>
            </div>

            {/* Section 9: Legal Desk Contact */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                9. Legal Desk & Customer Contact
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                For contractual inquiries or formal notices regarding these Terms, contact our legal department:
              </p>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px 24px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="space-y-1.5 text-sm text-ink">
                  <div>
                    <span className="font-bold text-darkNavy">Entity: </span>
                    <span>{legalEntityName}</span>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">Legal & Care Email: </span>
                    <a href={`mailto:${careEmail}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                      {careEmail}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">24/7 Coordination Desk: </span>
                    <a href={`tel:${rawPhone}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                      {phone}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">Corporate Headquarters: </span>
                    <span>{officeAddress}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "/disclaimer":
        return (
          <div className="space-y-8 text-ink">
            {/* Emergency Warning Banner */}
            <div
              style={{
                backgroundColor: "#fef2f2",
                border: "2px solid #fecaca",
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{
                    backgroundColor: "#b91c1c",
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 900,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em"
                  }}
                >
                  Urgent Notice
                </span>
                <span className="text-xs font-bold text-red-900">Immediate Medical Attention Required</span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, color: "#991b1b", margin: "0 0 10px 0" }}>
                EMERGENCY MEDICAL WARNING
              </h2>
              <p style={{ margin: "0 0 10px 0", color: "#7f1d1d", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                AKEEZO DOES NOT PROVIDE EMERGENCY MEDICAL SERVICES. IF YOU OR A PATIENT IN YOUR CARE IS EXPERIENCING A
                LIFE-THREATENING EMERGENCY, ACUTE CHEST PAIN, SEVERE BLEEDING, RESPIRATORY DISTRESS, OR ACUTE TRAUMA,
                CALL YOUR LOCAL EMERGENCY SERVICES IMMEDIATELY (112 IN INDIA, 911 IN THE USA, 999 IN THE UK) OR REPORT
                TO THE NEAREST HOSPITAL EMERGENCY DEPARTMENT.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                1. General Informational & Educational Scope Only
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                The content on <strong>akeezo.com</strong>, including medical procedure overviews, cost calculator
                estimates, doctor profiles, hospital accreditation records, blog articles, and AI virtual triage tools,
                is published exclusively for general informational, educational, and logistical planning purposes.
              </p>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                None of the materials on this website constitute formal medical advice, clinical diagnosis, surgical
                recommendation, or an endorsement of any specific pharmaceutical drug or medical device.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                2. Absence of Doctor-Patient Relationship
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Accessing our website, submitting medical inquiries, using our Surgery Cost Calculator, or communicating
                with an Akeezo Care Coordinator does <strong>not</strong> establish a physician-patient relationship. A
                doctor-patient relationship is formed solely between you and the licensed medical doctor or hospital
                after a formal teleconsultation or in-person clinical admission has been conducted with that healthcare
                provider.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                3. Independent Clinical Judgment of Healthcare Providers
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                All surgeons, physicians, and medical facilities listed on Akeezo are independent healthcare
                professionals and institutions. Akeezo does not control, supervise, or influence clinical diagnoses,
                surgical techniques, or post-operative protocols.
              </p>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Medicine and surgery are inherently non-exact sciences. Clinical outcomes depend upon numerous individual
                factors, including genetic predisposition, age, general health status, disease severity, and adherence to
                medical regimens. Neither Akeezo nor its partner hospitals guarantee specific medical outcomes or cures.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                4. Preliminary Opinions, AI Tools & Mandatory In-Person Evaluation
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Preliminary clinical opinions and second-opinion quotes arranged through Akeezo prior to travel are based
                solely on diagnostic records provided remotely, without an in-person physical examination.
              </p>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Upon hospital arrival in India, the medical team will conduct comprehensive physical examinations, repeat
                laboratory investigations, and cardiac/anesthesia clearances. The treating surgeon reserves the full
                clinical authority to modify, defer, or cancel the proposed surgery if unexpected contraindications or
                findings are discovered.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                5. Medical Travel & High-Altitude Flight Health Risks
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Long-distance international travel following surgery carries documented physiological risks, including
                Deep Vein Thrombosis (DVT), pulmonary embolism, altitude-induced cabin pressure fluctuations, and wound
                healing complications. Patients must obtain a formal "Fit to Fly" certificate from their treating Indian
                surgeon prior to booking or boarding return international flights.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                6. Patient Autonomy & Informed Consent
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Patients maintain complete autonomy over their healthcare decisions. You are strongly advised to consult
                with your primary physician in your home country before undergoing medical travel. Comprehensive, written
                informed consent for surgery and anesthesia will be obtained directly by the treating hospital in India.
              </p>
            </div>

            {/* Section 7 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                7. Questions & Clinical Inquiries
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                For inquiries regarding this Medical Disclaimer or to coordinate with hospital clinical desks, contact our
                team:
              </p>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px 24px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="space-y-1.5 text-sm text-ink">
                  <div>
                    <span className="font-bold text-darkNavy">Care Coordination Desk: </span>
                    <a href={`mailto:${careEmail}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                      {careEmail}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">24/7 Helpline: </span>
                    <a href={`tel:${rawPhone}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                      {phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "/consent":
        return (
          <div className="space-y-8 text-ink">
            {/* Header Alert */}
            <div
              style={{
                backgroundColor: "rgba(0, 199, 190, 0.08)",
                border: `1px solid ${colors.primaryTeal}`,
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: colors.actionTeal, margin: "0 0 8px 0" }}>
                Patient Consent & Care Authorization Framework
              </h2>
              <p style={{ margin: 0, color: colors.darkNavy, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                Under Section 6 of the Digital Personal Data Protection Act, 2023 and the National Medical Commission
                (NMC) Telemedicine Practice Guidelines 2020, this agreement formalizes your voluntary authorization for
                medical records review, cross-border transmission, and hospital facilitation.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                1. Authorization for Medical Coordination & Records Review
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                By submitting diagnostic documentation through Akeezo, you voluntarily authorize {legalEntityName} and its
                credentialed Care Coordinators to:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  Ingest, review, and catalog your medical summaries, radiology scans (DICOM, CT, MRI), pathology
                  reports, and clinical history.
                </li>
                <li>
                  Transmit your diagnostic records securely to empanelled NABH and JCI accredited hospitals in India solely
                  for obtaining clinical assessments, treatment protocols, and pricing estimates.
                </li>
                <li>
                  Coordinate with hospital international patient desks for teleconsultations, hospital bed reservations,
                  and Medical Visa (MED) invitation letters.
                </li>
              </ul>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                2. Telemedicine Consultation Authorization
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Where video or audio teleconsultations are scheduled with specialists in India, you acknowledge that
                telemedicine has inherent limitations compared to an in-person physical examination. You agree that
                telemedicine opinions are advisory and subject to confirmation upon physical examination at the hospital.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                3. Cross-Border Data Transmission Authorization
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                You expressly consent to the secure electronic transmission of your personal health information across
                international borders from your country of residence to India. All partner institutions are bound by strict
                confidentiality, HIPAA-aligned security protocols, and Indian DPDP Act standards.
              </p>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                4. Right of Revocation
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                You retain the statutory right to withdraw your consent at any time prior to hospital admission by writing
                to our consent desk at{" "}
                <a href={`mailto:${careEmail}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                  {careEmail}
                </a>
                . Upon receipt, your coordination file will be deactivated and your clinical records securely archived or
                purged in compliance with applicable healthcare record retention laws.
              </p>
            </div>
          </div>
        );

      case "/refund-policy":
        return (
          <div className="space-y-8 text-ink">
            {/* Service Surety Guarantee Banner */}
            <div
              style={{
                backgroundColor: "rgba(0, 199, 190, 0.08)",
                border: `1px solid ${colors.primaryTeal}`,
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{
                    backgroundColor: colors.actionTeal,
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase"
                  }}
                >
                  Patient Protection Guarantee
                </span>
                <span className="text-xs font-bold text-actionTeal">100% Service Surety Money-Back Commitment</span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: colors.darkNavy, margin: "0 0 8px 0" }}>
                Akeezo 100% Service Surety Guarantee
              </h2>
              <p style={{ margin: 0, color: colors.darkNavy, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                We stand 100% behind the excellence, responsiveness, and integrity of our Care Coordination team. If our
                coordination service, hospital second-opinion facilitation, or scheduling assistance fails to meet your
                expectations and you rate our service below 4 out of 5 stars, we provide a <strong>100% full refund</strong>{" "}
                of any coordination service fees charged directly by Akeezo.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                1. Fee Architecture & Transparent Payment Separation
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                To maintain complete commercial transparency and avoid conflicts of interest, Akeezo enforces strict
                financial segregation between coordination fees and hospital treatment fees:
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy mb-1">
                    A. Akeezo Care Coordination & Concierge Fees (Where Applicable)
                  </h3>
                  <p className="text-xs text-inkMuted leading-relaxed">
                    Non-clinical facilitation fees covering medical record digitisation, cross-hospital specialist
                    quotation collation, language translation, and dedicated ground concierge services. Covered directly
                    by our 100% Service Surety guarantee.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy mb-1">
                    B. Direct Hospital Treatment & Medical Procedure Charges
                  </h3>
                  <p className="text-xs text-inkMuted leading-relaxed">
                    Inpatient hospital admissions, surgical operations, physician professional fees, diagnostic
                    investigations, surgical implants, and medication. These payments are made directly to the accredited
                    hospital billing department and are governed by the hospital's refund policies.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                2. Akeezo Coordination Fee Refund Terms
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Any facilitation or concierge fees paid directly to Akeezo are refundable under the following terms:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Cancellation Prior to Appointment Booking:</strong> If you cancel your medical travel plans
                  before an in-person hospital appointment or formal teleconsultation is confirmed, you receive a{" "}
                  <strong>100% full refund</strong> with zero cancellation charges.
                </li>
                <li>
                  <strong>Service Surety Dissatisfaction Claim:</strong> If you rate our coordination support below 4 out
                  of 5 stars within 14 days of consultation completion, we process a <strong>100% full refund</strong> of
                  the coordination fee.
                </li>
                <li>
                  <strong>Processing Timeline:</strong> Approved refunds are dispatched within <strong>5 to 7 business days</strong>{" "}
                  to the original payment method (Credit/Debit Card, Wire Transfer, or UPI).
                </li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                3. Direct Hospital Payments & Medical Deposit Refunds
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Payments made directly to partner hospitals for inpatient admissions, surgical procedures, or advance
                deposits are governed by each hospital's statutory billing and cancellation guidelines:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Medical Contraindication upon Arrival:</strong> If the hospital surgical board finds the patient
                  clinically unfit for surgery during pre-operative evaluations (e.g., cardiac clearance failure), unspent
                  hospital deposits are refunded directly by the hospital as per their policy.
                </li>
                <li>
                  <strong>Medical Visa Denial:</strong> If a patient's Medical Visa application is rejected by the
                  Government of India, the hospital will refund advance admission deposits upon receiving official proof of
                  visa denial.
                </li>
                <li>
                  <strong>Patient Advocacy Support:</strong> Akeezo Care Coordinators act as the patient's dedicated
                  liaison, tracking refund claims with hospital billing departments to ensure prompt return of funds
                  (typically 7 to 15 banking days).
                </li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                4. Third-Party Flight, Hotel & Travel Bookings
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Independent airline tickets and private hotel accommodations booked by the patient or through third-party
                travel providers are subject to the cancellation and refund rules of the respective airlines and hotels.
                Akeezo assists patients by providing official medical cancellation certificates and hospital letters to
                support full refund claims under airline medical emergency waivers and travel insurance policies.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                5. Zero-Markup Guarantee & Price Integrity
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                Akeezo guarantees that all treatment cost estimates presented reflect the genuine, uninflated institutional
                package rates of the partner hospital. If any unexplained billing discrepancy arises between an approved
                written hospital quotation and the hospital's final invoice, our care desk will intervene directly with
                hospital leadership to resolve the issue.
              </p>
            </div>

            {/* Section 6 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                6. How to Submit a Refund Claim
              </h2>
              <p style={{ marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.7 }}>
                To initiate a refund request under our 100% Service Surety policy or to seek assistance with a hospital
                deposit refund, please contact our team:
              </p>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "20px 24px",
                  borderRadius: "10px",
                  border: `1px solid ${colors.border}`
                }}
              >
                <div className="space-y-1.5 text-sm text-ink">
                  <div>
                    <span className="font-bold text-darkNavy">Refund Desk Email: </span>
                    <a href={`mailto:${careEmail}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                      {careEmail}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">Helpline: </span>
                    <a href={`tel:${rawPhone}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                      {phone}
                    </a>
                  </div>
                  <div>
                    <span className="font-bold text-darkNavy">Required Details: </span>
                    <span>Patient Name, Akeezo Reference ID, Payment Receipt, and Reason for Refund Request.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "/grievance-officer":
        return (
          <div className="space-y-8 text-ink">
            {/* Statutory Compliance Notice Banner */}
            <div
              style={{
                backgroundColor: "rgba(0, 199, 190, 0.08)",
                border: `1px solid ${colors.primaryTeal}`,
                borderRadius: "12px",
                padding: "24px"
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  style={{
                    backgroundColor: colors.actionTeal,
                    color: "#ffffff",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    textTransform: "uppercase"
                  }}
                >
                  Statutory Disclosure
                </span>
                <span className="text-xs font-bold text-actionTeal">
                  Rule 3(2), IT Rules 2021 & Section 13, DPDP Act 2023
                </span>
              </div>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: colors.darkNavy, margin: "0 0 8px 0" }}>
                Statutory Grievance Redressal Mechanism
              </h2>
              <p style={{ margin: 0, color: colors.darkNavy, fontSize: "0.9375rem", lineHeight: 1.6 }}>
                In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines and Digital Media
                Ethics Code) Rules, 2021, and Section 13 of the Digital Personal Data Protection Act, 2023, the details of
                our designated Grievance Redressal Officer are published below for prompt, impartial dispute resolution.
              </p>
            </div>

            {/* Section 1 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                1. Statutory Framework & Grievance Mandate
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                {legalEntityName} is dedicated to maintaining the highest ethical, legal, and operational standards.
                Our designated Grievance Officer is legally authorized to receive, investigate, and resolve complaints
                concerning data protection, intermediary platform content, service quality, and regulatory compliance.
              </p>
            </div>

            {/* Section 2: Grievance Officer Profile Card */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                2. Designated Grievance Redressal Officer Details
              </h2>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: `2px solid ${colors.actionTeal}`,
                  borderRadius: "12px",
                  padding: "28px",
                  boxShadow: "0 4px 16px rgba(0, 122, 108, 0.08)"
                }}
              >
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: colors.darkNavy, margin: "0 0 16px 0" }}>
                  Grievance Redressal Officer
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 text-sm text-ink">
                  <span className="font-bold text-darkNavy">Name:</span>
                  <span>{grievanceOfficer.name}</span>

                  <span className="font-bold text-darkNavy">Designation:</span>
                  <span>{grievanceOfficer.designation}</span>

                  <span className="font-bold text-darkNavy">Company:</span>
                  <span>{legalEntityName}</span>

                  <span className="font-bold text-darkNavy">Official Email:</span>
                  <a
                    href={`mailto:${grievanceOfficer.email}`}
                    style={{ color: colors.actionTeal, fontWeight: 700 }}
                    className="hover:underline"
                  >
                    {grievanceOfficer.email}
                  </a>

                  <span className="font-bold text-darkNavy">Direct Helpline:</span>
                  <a
                    href={`tel:${rawGrievanceHelpline}`}
                    style={{ color: colors.actionTeal, fontWeight: 700 }}
                    className="hover:underline"
                  >
                    {grievanceOfficer.helpline}
                  </a>

                  <span className="font-bold text-darkNavy">Registered Office:</span>
                  <span>{grievanceOfficer.address}</span>

                  <span className="font-bold text-darkNavy">Working Hours:</span>
                  <span>Monday – Saturday, 09:30 AM to 06:30 PM IST (Emergency Desk: 24/7)</span>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                3. Categories of Grievances Handled
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                The Grievance Officer receives and addresses complaints falling under the following categories:
              </p>
              <div className="space-y-3">
                <div className="p-3.5 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy">Data Protection & Privacy Rights</h3>
                  <p className="text-xs text-inkMuted leading-relaxed mt-0.5">
                    Concerns regarding processing of medical records, unauthorized access, requests for data
                    rectification, or erasure ("Right to be Forgotten") under the DPDP Act 2023 or EU GDPR.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy">Service Coordination & Care Desk Quality</h3>
                  <p className="text-xs text-inkMuted leading-relaxed mt-0.5">
                    Unreasonable delays in obtaining hospital second opinions, issues with Care Coordinator
                    communication, or dissatisfaction with ground concierge coordination.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy">Platform Content & Credential Accuracy</h3>
                  <p className="text-xs text-inkMuted leading-relaxed mt-0.5">
                    Inaccuracies in doctor qualifications, hospital accreditation badges, treatment descriptions, or
                    intellectual property claims.
                  </p>
                </div>
                <div className="p-3.5 rounded-lg bg-surface-muted border border-border">
                  <h3 className="text-sm font-bold text-darkNavy">Financial Transparency & Refund Claims</h3>
                  <p className="text-xs text-inkMuted leading-relaxed mt-0.5">
                    Disputes regarding coordination fees or delays in refund processing under our 100% Service Surety
                    policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                4. Step-by-Step Grievance Procedure & Resolution SLA
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                We follow a rigorous, time-bound procedure to ensure all grievances are resolved equitably:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Step 1 (Submission):</strong> Send a detailed email to{" "}
                  <a href={`mailto:${grievanceOfficer.email}`} style={{ color: colors.actionTeal, fontWeight: 700 }}>
                    {grievanceOfficer.email}
                  </a>{" "}
                  with Subject: <code>GRIEVANCE: [Subject] - [Patient ID/Reference]</code>, including relevant supporting
                  records and preferred contact information.
                </li>
                <li>
                  <strong>Step 2 (Acknowledgment within 48 Hours):</strong> An official acknowledgment containing a unique
                  Grievance Tracking Ticket Number is issued within <strong>48 hours</strong> of receipt.
                </li>
                <li>
                  <strong>Step 3 (Investigation):</strong> The Grievance Officer, assisted by our legal and clinical audit
                  team, initiates an inquiry, reviewing communications and consulting with partner hospital desks.
                </li>
                <li>
                  <strong>Step 4 (Resolution within 30 Days):</strong> A reasoned written decision containing corrective
                  actions taken or recommendations is delivered to the complainant within <strong>30 days</strong> from the
                  date of grievance receipt.
                </li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h2 style={{ fontSize: "1.375rem", fontWeight: 800, color: colors.darkNavy, marginBottom: "12px" }}>
                5. Appellate Recourse & Regulatory Authorities
              </h2>
              <p style={{ marginBottom: "14px", color: colors.darkNavy, lineHeight: 1.7 }}>
                If you are not satisfied with the resolution provided by our Grievance Officer:
              </p>
              <ul style={{ paddingLeft: "24px", marginBottom: "16px", color: colors.darkNavy, lineHeight: 1.8 }}>
                <li>
                  <strong>Data Protection Board of India (DPBI):</strong> For grievances regarding digital personal data,
                  you have the statutory right to file a complaint before the Data Protection Board under Section 18 of the
                  DPDP Act, 2023.
                </li>
                <li>
                  <strong>Grievance Appellate Committee (GAC):</strong> For intermediary content decisions, users may appeal
                  to the Grievance Appellate Committee established by the Central Government under Rule 3A of the IT Rules,
                  2021 via <code>gac.gov.in</code>.
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4 text-ink">
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: colors.darkNavy, marginBottom: "16px" }}>
              Legal Documentation & Policy Overview
            </h2>
            <p style={{ color: colors.darkNavy, lineHeight: 1.7 }}>
              Please select a document from the navigation sidebar to review our policies, compliance notices, and patient
              protection standards.
            </p>
          </div>
        );
    }
  };

  const getDocMeta = () => {
    switch (path) {
      case "/privacy":
        return {
          title: "Privacy Policy",
          subtitle: "How AKEEZO protects patient health data under DPDP Act 2023, EU GDPR, and HIPAA standards.",
          category: "Data Protection"
        };
      case "/terms":
        return {
          title: "Terms of Service",
          subtitle: "Terms and conditions governing healthcare discovery, hospital facilitation, and medical travel.",
          category: "Legal Agreement"
        };
      case "/disclaimer":
        return {
          title: "Medical Disclaimer",
          subtitle: "Critical medical notice on platform scope, clinical independence, and emergency care advisory.",
          category: "Medical Notice"
        };
      case "/consent":
        return {
          title: "Patient Consent & Teleconsultation Agreement",
          subtitle: "Authorization for medical records coordination, telemedicine, and cross-border transmission.",
          category: "Patient Authorization"
        };
      case "/refund-policy":
        return {
          title: "Refund Policy & Service Surety",
          subtitle: "Transparent refund terms and our 100% Service Surety money-back commitment.",
          category: "Financial Policy"
        };
      case "/grievance-officer":
        return {
          title: "Grievance Redressal Officer",
          subtitle: "Statutory grievance redressal under Rule 3(2) IT Rules 2021 & Section 13 DPDP Act 2023.",
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
