import React from "react";
export interface TourStep {
    id: string;
    targetSelector: string;
    title: string;
    description: React.ReactNode;
    tip?: string;
    badge?: string;
    placement?: "top" | "bottom" | "left" | "right" | "center";
}
interface TourContextValue {
    isTourActive: boolean;
    currentStepIndex: number;
    currentStep: TourStep | null;
    totalSteps: number;
    tourId: string | null;
    startTour: (tourId: string, steps: TourStep[], forceRestart?: boolean) => void;
    nextStep: () => void;
    prevStep: () => void;
    skipTour: () => void;
    finishTour: () => void;
    hasCompletedTour: (tourId: string) => boolean;
}
export declare const useTour: () => TourContextValue;
export interface TourProviderProps {
    children: React.ReactNode;
}
export declare const TourProvider: React.FC<TourProviderProps>;
export {};
//# sourceMappingURL=PlatformTour.d.ts.map