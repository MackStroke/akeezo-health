import { jsx as _jsx } from "react/jsx-runtime";
export const BrandLogo = ({ variant = "dark", height = 42, className = "", alt = "AKEEZO - Heal In India, Heal By Akeezo" }) => {
    const src = variant === "light"
        ? "/logo/logo with tagline-light.svg"
        : variant === "icon"
            ? "/logo/favicon.svg"
            : "/logo/logo with tagline-dark.svg";
    return (_jsx("img", { src: src, alt: alt, height: height, style: { height: `${height}px`, width: "auto", display: "inline-block" }, className: className }));
};
