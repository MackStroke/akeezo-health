import React, { createContext, useContext, useState, useEffect } from "react";
import { UserDTO } from "@akeezo/contracts";

interface AuthContextType {
  user: UserDTO | null;
  token: string | null;
  tempToken: string | null;
  requires2FA: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  verify2FA: (code: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("akeezo_auth_token"));
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [requires2FA, setRequires2FA] = useState(false);
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      if (json.data?.requires2FA) {
        setTempToken(json.data.tempToken);
        setRequires2FA(true);
        return false;
      }

      localStorage.setItem("akeezo_auth_token", json.data.token);
      setToken(json.data.token);
      setUser(json.data.user);
      setRequires2FA(false);
      setTempToken(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Network error. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (totpCode: string): Promise<boolean> => {
    if (!tempToken) {
      setError("No 2FA session token. Please sign in again.");
      return false;
    }

    try {
      setError(null);
      setIsLoading(true);
      const res = await fetch("/api/v1/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tempToken, totpCode }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error?.message || "2FA verification failed.");
        return false;
      }

      localStorage.setItem("akeezo_auth_token", json.data.token);
      setToken(json.data.token);
      setUser(json.data.user);
      setRequires2FA(false);
      setTempToken(null);
      return true;
    } catch (err: any) {
      setError(err.message || "Network error during 2FA verification.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("akeezo_auth_token");
    setToken(null);
    setUser(null);
    setTempToken(null);
    setRequires2FA(false);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        tempToken,
        requires2FA,
        isLoading,
        error,
        login,
        verify2FA,
        logout,
        clearError,
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
