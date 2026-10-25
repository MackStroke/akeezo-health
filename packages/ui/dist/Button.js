import { jsx as _jsx } from "react/jsx-runtime";
export const Button = ({ variant = "primary", size = "md", className = "", style, children, href, target, rel, ...props }) => {
    const baseStyle = {
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
    const sizeStyles = {
        sm: { padding: "6px 14px", fontSize: "0.8125rem" },
        md: { padding: "10px 20px", fontSize: "0.9375rem" },
        lg: { padding: "14px 28px", fontSize: "1.0625rem" }
    };
    const variantStyles = {
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
        return (_jsx("a", { href: href, target: target, rel: rel, style: combinedStyle, className: combinedClass, children: children }));
    }
    return (_jsx("button", { style: combinedStyle, className: combinedClass, ...props, children: children }));
};
