import React from "react";

export interface BrandLogoProps {
  variant?: "dark" | "light" | "icon";
  height?: number;
  className?: string;
  alt?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "dark",
  height = 42,
  className = "",
  alt = "AKEEZO - Heal In India, Heal By Akeezo"
}) => {
  const src =
    variant === "light"
      ? "/logo/logo with tagline-light.svg"
      : variant === "icon"
      ? "/logo/favicon.svg"
      : "/logo/logo with tagline-dark.svg";

  return (
    <img
      src={src}
      alt={alt}
      height={height}
      style={{ height: `${height}px`, width: "auto", display: "inline-block" }}
      className={className}
    />
  );
};
