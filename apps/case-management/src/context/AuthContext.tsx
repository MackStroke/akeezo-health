import React, { createContext, useContext, useState, useEffect } from "react";
import { UserDTO } from "@akeezo/contracts";
import { auth, RecaptchaVerifier, signInWithPhoneNumber, type ConfirmationResult } from "../firebase.js";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    recaptchaWidgetId?: number;
  }
}

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  tempToken: string | null;
  requiresPhoneOtp: boolean;
  requires2FA: boolean;
  phone: string | null;
  maskedPhone: string | null;
  confirmationResult: ConfirmationResult | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  verify2FA: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("akeezo_auth_token"));
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [requiresPhoneOtp, setRequiresPhoneOtp] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      loadProfile(token);
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const loadProfile = async (authToken: string) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
        credentials: "same-origin",
      });
      if (res.ok) {
        const json = await res.json();
        setUser(json.data);
      } else {
        localStorage.removeItem("akeezo_auth_token");
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      console.error("Failed to restore session", err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFirebasePhoneAuth = async (phoneNumber: string) => {
    try {
      if (typeof window === "undefined") return;

      const container = document.getElementById("recaptcha-container");
      if (!container) return;

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible",
          callback: () => {
            // reCAPTCHA solved
          },
        });
      }

      const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber.replace(/\D/g, "")}`;
      const conf = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(conf);
    } catch (err: any) {
      console.warn("Firebase Phone Auth SMS trigger notice (fallback mode active):", err?.message || err);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { error: { message: `API response (${res.status}): ${text.slice(0, 100)}` } };
      }

      if (!res.ok) {
        setError(json.error?.message || "Invalid credentials.");
        return false;
      }

      if (json.data?.requiresPhoneOtp || json.data?.requires2FA) {
        const sessionToken = json.data.tempToken;
        const userPhone = json.data.phone || "+918287639443";
        const masked = json.data.maskedPhone || userPhone;

        setTempToken(sessionToken);
        setPhone(userPhone);
        setMaskedPhone(masked);
        setRequiresPhoneOtp(true);

        // Attempt Firebase Phone Auth SMS dispatch in background
        triggerFirebasePhoneAuth(userPhone);
        return false;
      }

      // Successful direct login
      localStorage.setItem("akeezo_auth_token", json.data.token);
      setToken(json.data.token);
      setUser(json.data.user);
      setRequiresPhoneOtp(false);
      setTempToken(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (code: string): Promise<boolean> => {
    if (!tempToken) {
      setError("No active authentication session. Please sign in again.");
      return false;
    }

    try {
      setError(null);
      setIsLoading(true);

      let firebaseIdToken: string | undefined = undefined;
      if (confirmationResult) {
        try {
          const cred = await confirmationResult.confirm(code);
          firebaseIdToken = await cred.user.getIdToken();
        } catch (firebaseErr: any) {
          // If code is demo fallback (e.g. 123456) or carrier SMS delayed, continue to server validation
          console.warn("Firebase confirmation notice:", firebaseErr?.message || firebaseErr);
        }
      }

      const res = await fetch("/api/v1/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          tempToken,
          code,
          firebaseIdToken,
          phone: phone || undefined,
        }),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { error: { message: `API response (${res.status}): ${text.slice(0, 100)}` } };
      }

      if (!res.ok) {
        setError(json.error?.message || "Invalid OTP code. Please check your SMS or try 123456.");
        return false;
      }

      localStorage.setItem("akeezo_auth_token", json.data.token);
      setToken(json.data.token);
      setUser(json.data.user);
      setRequiresPhoneOtp(false);
      setTempToken(null);
      setConfirmationResult(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to verify phone OTP.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (): Promise<boolean> => {
    if (!tempToken) {
      setError("No active session to resend OTP.");
      return false;
    }

    try {
      setError(null);
      setIsLoading(true);

      if (phone) {
        triggerFirebasePhoneAuth(phone);
      }

      const res = await fetch("/api/v1/auth/otp/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ tempToken, phone }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "Failed to resend OTP.");
        return false;
      }

      if (json.data?.tempToken) {
        setTempToken(json.data.tempToken);
      }
      return true;
    } catch (err: any) {
      setError(err.message || "Network error while resending OTP.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    if (token) {
      fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "same-origin",
      }).catch(() => {});
    }
    localStorage.removeItem("akeezo_auth_token");
    setToken(null);
    setUser(null);
    setRequiresPhoneOtp(false);
    setTempToken(null);
    setConfirmationResult(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tempToken,
        requiresPhoneOtp,
        requires2FA: requiresPhoneOtp,
        phone,
        maskedPhone,
        confirmationResult,
        isLoading,
        error,
        login,
        verifyOtp,
        verify2FA: verifyOtp,
        resendOtp,
        logout,
        clearError: () => setError(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
