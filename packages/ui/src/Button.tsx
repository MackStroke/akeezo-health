import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "emergency" | "outline" | "orange" | "orangeAlt" | "teal";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  href?: string;
  target?: string;
  rel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className = "",
  style,
  children,
  href,
  target,
  rel,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    borderRadius: "var(--radius-pill)",
    border: "1px solid transparent",
    transition: "all 0.15s ease-in-out",
    cursor: "pointer",
    textDecoration: "none",
    ...style
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: "6px 14px", fontSize: "0.8125rem" },
    md: { padding: "10px 20px", fontSize: "0.9375rem" },
    lg: { padding: "14px 28px", fontSize: "1.0625rem" }
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "var(--action)",
      color: "#ffffff"
    },
    orange: {
      backgroundColor: "var(--brand-orange)",
      color: "#ffffff",
      borderColor: "var(--brand-orange)"
    },
    orangeAlt: {
      backgroundColor: "var(--brand-orange-alt)",
      color: "#ffffff",
      borderColor: "var(--brand-orange-alt)"
    },
    teal: {
      backgroundColor: "var(--brand-teal)",
      color: "var(--navy)",
      borderColor: "var(--brand-teal)",
      fontWeight: 800
    },
    secondary: {
      backgroundColor: "var(--surface-teal)",
      color: "var(--action)",
      borderColor: "rgba(0, 199, 190, 0.3)"
    },
    ghost: {
      backgroundColor: "transparent",
      color: "var(--ink)",
      borderColor: "var(--border)"
    },
    emergency: {
      backgroundColor: "var(--emergency)",
      color: "#ffffff"
    },
    outline: {
      backgroundColor: "#ffffff",
      color: "var(--ink)",
      borderColor: "var(--border)"
    }
  };

  const combinedStyle = { ...baseStyle, ...sizeStyles[size], ...variantStyles[variant] };
  const combinedClass = `btn btn-${variant} btn-${size} ${className}`;

  if (href) {
    return (
      <a href={href} target={target} rel={rel} style={combinedStyle} className={combinedClass}>
        {children}
      </a>
    );
  }

  return (
    <button style={combinedStyle} className={combinedClass} {...props}>
      {children}
    </button>
  );
};
