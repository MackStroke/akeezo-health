import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrandLogo } from "./BrandLogo.js";
export const Header = ({ variant = "inner", phone = "+91 82876 39443", activePath = "/" }) => {
    return (_jsx("header", { style: {
            height: "68px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 50
        }, children: _jsxs("div", { className: "container", style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
            }, children: [_jsxs("div", { style: { display: "flex", alignItems: "center", gap: "28px" }, children: [variant === "inner" ? (_jsx("a", { href: "/", style: { display: "flex", alignItems: "center" }, children: _jsx(BrandLogo, { variant: "dark", height: 36 }) })) : (_jsx("a", { href: "/", style: { display: "flex", alignItems: "center" }, children: _jsx(BrandLogo, { variant: "icon", height: 36 }) })), _jsxs("nav", { style: { display: "flex", alignItems: "center", gap: "20px" }, children: [_jsx("a", { href: "/treatments", style: {
                                        fontSize: "0.9375rem",
                                        fontWeight: activePath.startsWith("/treatments") ? 700 : 500,
                                        color: activePath.startsWith("/treatments") ? "var(--action)" : "var(--ink)"
                                    }, children: "Treatments" }), _jsx("a", { href: "/hospitals", style: {
                                        fontSize: "0.9375rem",
                                        fontWeight: activePath.startsWith("/hospitals") ? 700 : 500,
                                        color: activePath.startsWith("/hospitals") ? "var(--action)" : "var(--ink)"
                                    }, children: "Hospitals" }), _jsx("a", { href: "/doctors", style: {
                                        fontSize: "0.9375rem",
                                        fontWeight: activePath.startsWith("/doctors") ? 700 : 500,
                                        color: activePath.startsWith("/doctors") ? "var(--action)" : "var(--ink)"
                                    }, children: "Doctors" }), _jsx("a", { href: "/destinations", style: {
                                        fontSize: "0.9375rem",
                                        fontWeight: activePath.startsWith("/destinations") ? 700 : 500,
                                        color: activePath.startsWith("/destinations") ? "var(--action)" : "var(--ink)"
                                    }, children: "Destinations" }), _jsx("a", { href: "/cost-calculator", style: {
                                        fontSize: "0.9375rem",
                                        fontWeight: activePath.startsWith("/cost-calculator") ? 700 : 500,
                                        color: "var(--brand-orange)"
                                    }, children: "Calculate Price" })] })] }), _jsxs("div", { style: { display: "flex", alignItems: "center", gap: "16px" }, children: [_jsxs("a", { href: `tel:${phone.replace(/\s+/g, "")}`, style: {
                                fontSize: "0.875rem",
                                fontWeight: 700,
                                color: "var(--action)",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px"
                            }, children: [_jsx("span", { children: "24/7 Desk:" }), _jsx("span", { children: phone })] }), _jsx("a", { href: "/plan-treatment", style: {
                                backgroundColor: "var(--action)",
                                color: "#ffffff",
                                padding: "8px 18px",
                                borderRadius: "var(--radius-pill)",
                                fontSize: "0.875rem",
                                fontWeight: 700,
                                textDecoration: "none"
                            }, children: "Plan Treatment" })] })] }) }));
};
