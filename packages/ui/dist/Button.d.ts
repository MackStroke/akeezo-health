import React from "react";
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "emergency" | "outline" | "orange" | "orangeAlt" | "teal";
    size?: "sm" | "md" | "lg";
    asChild?: boolean;
    href?: string;
    target?: string;
    rel?: string;
}
export declare const Button: React.FC<ButtonProps>;
//# sourceMappingURL=Button.d.ts.map