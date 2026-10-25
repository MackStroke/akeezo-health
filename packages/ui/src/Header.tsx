import React from "react";
import { BrandLogo } from "./BrandLogo.js";

export interface HeaderProps {
  variant?: "home" | "inner";
  phone?: string;
  activePath?: string;
  siteSettings?: any;
}

export const Header: React.FC<HeaderProps> = ({
  variant = "inner",
  phone = "+91 82876 39443",
  activePath = "/"
}) => {
  return (
    <header
      style={{
        height: "68px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          {variant === "inner" ? (
            <a href="/" style={{ display: "flex", alignItems: "center" }}>
              <BrandLogo variant="dark" height={36} />
            </a>
          ) : (
            <a href="/" style={{ display: "flex", alignItems: "center" }}>
              <BrandLogo variant="icon" height={36} />
            </a>
          )}

          <nav style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <a
              href="/treatments"
              style={{
                fontSize: "0.9375rem",
                fontWeight: activePath.startsWith("/treatments") ? 700 : 500,
                color: activePath.startsWith("/treatments") ? "var(--action)" : "var(--ink)"
              }}
            >
              Treatments
            </a>
            <a
              href="/hospitals"
              style={{
                fontSize: "0.9375rem",
                fontWeight: activePath.startsWith("/hospitals") ? 700 : 500,
                color: activePath.startsWith("/hospitals") ? "var(--action)" : "var(--ink)"
              }}
            >
              Hospitals
            </a>
            <a
              href="/doctors"
              style={{
                fontSize: "0.9375rem",
                fontWeight: activePath.startsWith("/doctors") ? 700 : 500,
                color: activePath.startsWith("/doctors") ? "var(--action)" : "var(--ink)"
              }}
            >
              Doctors
            </a>
            <a
              href="/destinations"
              style={{
                fontSize: "0.9375rem",
                fontWeight: activePath.startsWith("/destinations") ? 700 : 500,
                color: activePath.startsWith("/destinations") ? "var(--action)" : "var(--ink)"
              }}
            >
              Destinations
            </a>
            <a
              href="/cost-calculator"
              style={{
                fontSize: "0.9375rem",
                fontWeight: activePath.startsWith("/cost-calculator") ? 700 : 500,
                color: "var(--brand-orange)"
              }}
            >
              Calculate Price
            </a>
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: "var(--action)",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            <span>24/7 Desk:</span>
            <span>{phone}</span>
          </a>

          <a
            href="/plan-treatment"
            style={{
              backgroundColor: "var(--action)",
              color: "#ffffff",
              padding: "8px 18px",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.875rem",
              fontWeight: 700,
              textDecoration: "none"
            }}
          >
            Plan Treatment
          </a>
        </div>
      </div>
    </header>
  );
};
