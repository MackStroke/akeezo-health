import React from "react";
export type FeedbackType = "success" | "error" | "failure" | "info" | "instruction" | "warning";
export interface ToastAction {
    label: string;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger";
}
export interface ToastOptions {
    id?: string;
    title?: string;
    message: React.ReactNode;
    type?: FeedbackType;
    duration?: number;
    steps?: string[];
    action?: ToastAction;
    retry?: () => void;
    details?: string | string[];
}
export interface ToastItem extends ToastOptions {
    id: string;
    type: FeedbackType;
    createdAt: number;
    duration: number;
}
export interface ModalFeedbackOptions {
    title: string;
    message: React.ReactNode;
    type?: FeedbackType;
    steps?: string[];
    details?: string | string[];
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
}
interface FeedbackContextValue {
    toasts: ToastItem[];
    addToast: (options: ToastOptions) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
    openModal: (options: ModalFeedbackOptions) => void;
    closeModal: () => void;
    toast: {
        success: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
        error: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
        failure: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
        info: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
        instruction: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
        warning: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    };
}
export declare const useFeedback: () => FeedbackContextValue;
export declare const useToast: () => {
    addToast: (options: ToastOptions) => string;
    removeToast: (id: string) => void;
    clearAllToasts: () => void;
    openModal: (options: ModalFeedbackOptions) => void;
    closeModal: () => void;
    success: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    error: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    failure: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    info: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    instruction: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
    warning: (message: React.ReactNode, options?: Omit<ToastOptions, "message" | "type"> | string) => string;
};
export declare const FeedbackProvider: React.FC<{
    children: React.ReactNode;
}>;
export {};
//# sourceMappingURL=Feedback.d.ts.map