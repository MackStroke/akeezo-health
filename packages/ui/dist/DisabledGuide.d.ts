import React from "react";
export interface RequirementItem {
    label: string;
    fulfilled: boolean;
    tip?: string;
    fixLabel?: string;
    onFix?: () => void;
}
export interface DisabledGuideProps {
    disabled?: boolean;
    reasonTitle?: string;
    reasonMessage?: string;
    requirements?: RequirementItem[];
    stepsToEnable?: string[];
    placement?: "top" | "bottom" | "left" | "right";
    trigger?: "click" | "hover" | "both";
    children: React.ReactNode;
    className?: string;
}
export declare const DisabledGuide: React.FC<DisabledGuideProps>;
export interface DisabledGuideButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
    reasonTitle?: string;
    guideTitle?: string;
    reasonMessage?: string;
    guideReason?: string;
    requirements?: RequirementItem[];
    prerequisites?: RequirementItem[];
    stepsToEnable?: string[];
    actionSteps?: string[];
    placement?: "top" | "bottom" | "left" | "right";
    trigger?: "click" | "hover" | "both";
    variant?: "primary" | "secondary" | "orange" | "danger" | "ghost";
}
export declare const DisabledGuideButton: React.FC<DisabledGuideButtonProps>;
//# sourceMappingURL=DisabledGuide.d.ts.map