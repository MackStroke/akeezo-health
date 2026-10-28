import React, { createContext, useContext, useState, useEffect } from "react";
import { UserDTO } from "@akeezo/contracts";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type ConfirmationResult,
} from "../firebase.js";

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
  loginWithPhoneOtp: (phoneNumber: string) => Promise<boolean>;
  loginWithEmailOtp: (emailAddress: string) => Promise<boolean>;
  verifyOtp: (code: string) => Promise<boolean>;
  verify2FA: (code: string) => Promise<boolean>;
  resendOtp: () => Promise<boolean>;
  cancelOtp: () => void;
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

  const formatE164Phone = (raw: string): string => {
    const trimmed = raw.trim();
    const digits = trimmed.replace(/\D/g, "");
    if (trimmed.startsWith("+")) {
      return "+" + digits;
    }
    if (digits.length === 10) {
      return "+91" + digits;
    }
    return "+" + digits;
  };

  const triggerFirebasePhoneAuth = async (phoneNumber: string): Promise<boolean> => {
    try {
      if (typeof window === "undefined") return false;

      let container = document.getElementById("recaptcha-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "recaptcha-container";
        document.body.appendChild(container);
      }

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {
          // ignore
        }
        window.recaptchaVerifier = undefined;
      }

      window.recaptchaVerifier = new RecaptchaVerifier(auth, container, {
        size: "invisible",
        callback: () => {
          console.log("[Firebase Phone Auth] reCAPTCHA verified successfully");
        },
        "expired-callback": () => {
          console.warn("[Firebase Phone Auth] reCAPTCHA expired");
        },
      });

      const formattedPhone = formatE164Phone(phoneNumber);
      console.log(`[Firebase Phone Auth] Dispatching carrier SMS to: ${formattedPhone}`);
      const conf = await signInWithPhoneNumber(auth, formattedPhone, window.recaptchaVerifier);
      setConfirmationResult(conf);
      console.log("[Firebase Phone Auth] SMS successfully sent by Firebase Auth Gateway");
      return true;
    } catch (err: any) {
      console.error("[Firebase Phone Auth Error]", err);
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch {}
        window.recaptchaVerifier = undefined;
      }

      let userMsg = err.message || "Failed to dispatch SMS verification code.";
      if (err.code === "auth/invalid-phone-number") {
        userMsg = "Invalid phone number format. Please ensure correct country code (e.g. +91 98765 43210).";
      } else if (err.code === "auth/quota-exceeded" || err.code === "auth/too-many-requests") {
        userMsg = "Firebase SMS daily limit reached on the Spark plan. Please use test phone numbers or email login.";
      } else if (err.code === "auth/captcha-check-failed") {
        userMsg = "reCAPTCHA verification failed. Please refresh the page and try again.";
      } else if (err.code === "auth/billing-not-enabled") {
        userMsg = "Firebase project requires billing or test phone numbers to dispatch SMS.";
      }

      setError(userMsg);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const cleanEmail = email.trim();

      // 1. Direct Firebase Email & Password Authentication (Unlimited & Free)
      let firebaseIdToken: string | null = null;
      try {
        const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
        firebaseIdToken = await cred.user.getIdToken();
      } catch (fbErr: any) {
        // If account not registered in Firebase yet, auto-provision in Firebase Auth
        if (fbErr.code === "auth/user-not-found" || fbErr.code === "auth/invalid-credential") {
          try {
            const newCred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
            firebaseIdToken = await newCred.user.getIdToken();
          } catch {
            // fallback
          }
        }
      }

      // 2. Direct session establishment via verified Firebase Token
      if (firebaseIdToken) {
        const fbRes = await fetch("/api/v1/auth/firebase", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ firebaseIdToken, email: cleanEmail }),
        });

        if (fbRes.ok) {
          const json = await fbRes.json();
          localStorage.setItem("akeezo_auth_token", json.data.token);
          setToken(json.data.token);
          setUser(json.data.user);
          setRequiresPhoneOtp(false);
          setTempToken(null);
          return true;
        }
      }

      // 3. Fallback server verification
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: cleanEmail, password }),
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
        await triggerFirebasePhoneAuth(userPhone);
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

  const loginWithPhoneOtp = async (phoneNumber: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const res = await fetch("/api/v1/auth/phone/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { error: { message: `API response (${res.status}): ${text.slice(0, 100)}` } };
      }

      if (!res.ok) {
        setError(json.error?.message || "Failed to dispatch phone OTP.");
        return false;
      }

      const sessionToken = json.data.tempToken;
      const userPhone = json.data.phone || phoneNumber;
      const masked = json.data.maskedPhone || userPhone;

      setTempToken(sessionToken);
      setPhone(userPhone);
      setMaskedPhone(masked);

      // Trigger Firebase Phone Auth SMS
      const smsSent = await triggerFirebasePhoneAuth(userPhone);
      if (!smsSent) {
        return false;
      }

      setRequiresPhoneOtp(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Network error while requesting phone OTP.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmailOtp = async (emailAddress: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);

      const res = await fetch("/api/v1/auth/email/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email: emailAddress }),
      });

      const text = await res.text();
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { error: { message: `API response (${res.status}): ${text.slice(0, 100)}` } };
      }

      if (!res.ok) {
        setError(json.error?.message || "Failed to dispatch email OTP.");
        return false;
      }

      const sessionToken = json.data.tempToken;
      const userPhone = json.data.phone || "+918287639443";
      const masked = json.data.maskedPhone || userPhone;

      setTempToken(sessionToken);
      setPhone(userPhone);
      setMaskedPhone(masked);

      // Trigger Firebase Phone Auth SMS
      const smsSent = await triggerFirebasePhoneAuth(userPhone);
      if (!smsSent) {
        return false;
      }

      setRequiresPhoneOtp(true);
      return true;
    } catch (err: any) {
      setError(err.message || "Network error while requesting email OTP.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelOtp = () => {
    setRequiresPhoneOtp(false);
    setTempToken(null);
    setConfirmationResult(null);
    setError(null);
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
          // If carrier SMS or client Firebase verification has network delay, continue to server validation
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
        setError(json.error?.message || "Invalid OTP code. Please check your SMS and try again.");
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
        const smsSent = await triggerFirebasePhoneAuth(phone);
        if (!smsSent) {
          return false;
        }
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
    signOut(auth).catch(() => {});
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
        loginWithPhoneOtp,
        loginWithEmailOtp,
        verifyOtp,
        verify2FA: verifyOtp,
        resendOtp,
        cancelOtp,
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
