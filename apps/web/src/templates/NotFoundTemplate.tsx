import React from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { Header, Footer, Button, colors } from "@akeezo/ui";

export interface NotFoundTemplateProps {
  data: PublicRouteResponseDTO;
}

export const NotFoundTemplate: React.FC<NotFoundTemplateProps> = ({ data }) => {
  const { siteSettings } = data;
  const phone = siteSettings.phone || siteSettings.emergencyHelpline || "+91 82876 39443";
  const email = siteSettings.careEmail || siteSettings.contactEmail || "care@akeezo.com";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", backgroundColor: colors.lightGray }}>
      <Header variant="inner" siteSettings={siteSettings} />

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px 24px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "48px 32px",
            boxShadow: "0 4px 20px rgba(6, 30, 27, 0.08)",
            border: `1px solid ${colors.borderGray}`
          }}
        >
          <div
            style={{
              fontSize: "72px",
              fontWeight: 900,
              color: colors.primaryTeal,
              lineHeight: 1,
              marginBottom: "16px"
            }}
          >
            404
          </div>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: colors.darkNavy,
              marginBottom: "16px"
            }}
          >
            Page Not Found
          </h1>
          <p
            style={{
              fontSize: "16px",
              color: colors.textSecondary,
              lineHeight: 1.6,
              marginBottom: "32px"
            }}
          >
            The healthcare service, doctor, hospital, or document you are looking for is not available at this address.
            Our care team is always standing by to help you find what you need.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "32px"
            }}
          >
            <Button href="/" variant="primary">
              Return to Homepage
            </Button>
            <Button
              href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
              variant="outline"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp 24/7 Desk
            </Button>
          </div>

          <div
            style={{
              borderTop: `1px solid ${colors.borderGray}`,
              paddingTop: "24px",
              fontSize: "14px",
              color: colors.textSecondary
            }}
          >
            Need immediate medical travel or consultation guidance? Call{" "}
            <a
              href={`tel:${phone}`}
              style={{ color: colors.actionTeal, fontWeight: 700, textDecoration: "none" }}
            >
              {phone}
            </a>{" "}
            or email{" "}
            <a
              href={`mailto:${email}`}
              style={{ color: colors.actionTeal, fontWeight: 700, textDecoration: "none" }}
            >
              {email}
            </a>
          </div>
        </div>
      </main>

      <Footer siteSettings={siteSettings} />
    </div>
  );
};
