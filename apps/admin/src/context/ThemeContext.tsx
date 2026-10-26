import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  type WebsiteTheme,
  type AdminTheme,
  type SiteSettings,
  DEFAULT_WEBSITE_THEME,
  DEFAULT_ADMIN_THEME,
  THEME_PRESETS,
  adminThemeToCssVariables,
  getGoogleFontUrl,
} from "@akeezo/contracts";

const getAuthHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = typeof window !== "undefined" ? localStorage.getItem("akeezo_auth_token") : null;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

interface ThemeContextType {
  siteSettings: SiteSettings | null;
  websiteTheme: WebsiteTheme;
  adminTheme: AdminTheme;
  isLoading: boolean;
  isSaving: boolean;
  saveMessage: string | null;
  saveError: string | null;
  setWebsiteTheme: React.Dispatch<React.SetStateAction<WebsiteTheme>>;
  setAdminTheme: React.Dispatch<React.SetStateAction<AdminTheme>>;
  updateWebsiteToken: <K extends keyof WebsiteTheme>(key: K, value: WebsiteTheme[K]) => void;
  updateAdminToken: <K extends keyof AdminTheme>(key: K, value: AdminTheme[K]) => void;
  applyPreset: (presetId: string, target?: "website" | "admin" | "both") => Promise<boolean>;
  resetToDefaults: (target?: "website" | "admin" | "both") => Promise<boolean>;
  saveTheme: () => Promise<boolean>;
  refreshSettings: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [websiteTheme, setWebsiteTheme] = useState<WebsiteTheme>(DEFAULT_WEBSITE_THEME);
  const [adminTheme, setAdminTheme] = useState<AdminTheme>(DEFAULT_ADMIN_THEME);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const applyAdminCssToDom = useCallback((theme: AdminTheme) => {
    if (typeof document === "undefined") return;
    const vars = adminThemeToCssVariables(theme);
    for (const [prop, val] of Object.entries(vars)) {
      document.documentElement.style.setProperty(prop, val);
    }
    if (theme.mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Dynamic Google Font injection for Admin Panel
    if (theme.fontFamily) {
      const fontUrl = getGoogleFontUrl(theme.fontFamily);
      const existingLink = document.getElementById("akeezo-admin-dynamic-font") as HTMLLinkElement | null;
      if (fontUrl) {
        if (existingLink) {
          if (existingLink.href !== fontUrl) {
            existingLink.href = fontUrl;
          }
        } else {
          const link = document.createElement("link");
          link.id = "akeezo-admin-dynamic-font";
          link.rel = "stylesheet";
          link.href = fontUrl;
          document.head.appendChild(link);
        }
      } else if (existingLink) {
        existingLink.remove();
      }
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/admin/site-settings", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const json = await res.json();
        const settings = json.data;
        setSiteSettings(settings);

        const loadedWebsiteTheme: WebsiteTheme = {
          ...DEFAULT_WEBSITE_THEME,
          ...(settings.websiteTheme || {}),
          primaryColor: settings.websiteTheme?.primaryColor || settings.primaryColor || DEFAULT_WEBSITE_THEME.primaryColor,
          secondaryColor: settings.websiteTheme?.secondaryColor || settings.secondaryColor || DEFAULT_WEBSITE_THEME.secondaryColor,
          accentColor: settings.websiteTheme?.accentColor || settings.accentColor || DEFAULT_WEBSITE_THEME.accentColor,
          actionColor: settings.websiteTheme?.actionColor || settings.actionColor || DEFAULT_WEBSITE_THEME.actionColor,
        };

        const loadedAdminTheme: AdminTheme = {
          ...DEFAULT_ADMIN_THEME,
          ...(settings.adminTheme || {}),
        };

        setWebsiteTheme(loadedWebsiteTheme);
        setAdminTheme(loadedAdminTheme);
        applyAdminCssToDom(loadedAdminTheme);
      }
    } catch (err: any) {
      console.error("Failed to load site settings theme", err);
    } finally {
      setIsLoading(false);
    }
  }, [applyAdminCssToDom]);

  useEffect(() => {
    refreshSettings();
  }, [refreshSettings]);

  // Live real-time preview: when adminTheme state changes, update DOM variables immediately
  useEffect(() => {
    applyAdminCssToDom(adminTheme);
  }, [adminTheme, applyAdminCssToDom]);

  const updateWebsiteToken = <K extends keyof WebsiteTheme>(key: K, value: WebsiteTheme[K]) => {
    setWebsiteTheme((prev) => ({ ...prev, [key]: value }));
  };

  const updateAdminToken = <K extends keyof AdminTheme>(key: K, value: AdminTheme[K]) => {
    setAdminTheme((prev) => ({ ...prev, [key]: value }));
  };

  const applyPreset = async (presetId: string, target: "website" | "admin" | "both" = "both"): Promise<boolean> => {
    const preset = THEME_PRESETS[presetId];
    if (!preset) return false;

    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const res = await fetch("/api/v1/admin/theme/preset", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ presetId, target }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to apply preset.");
      }

      const json = await res.json();
      const updated = json.data;
      setSiteSettings(updated);

      if (target === "website" || target === "both") {
        setWebsiteTheme((prev) => ({
          ...prev,
          ...preset.websiteTheme,
          activePreset: presetId,
        }));
      }

      if (target === "admin" || target === "both") {
        const newAdmin = {
          ...DEFAULT_ADMIN_THEME,
          ...preset.adminTheme,
          activePreset: presetId,
        };
        setAdminTheme(newAdmin);
        applyAdminCssToDom(newAdmin);
      }

      setSaveMessage(`Preset "${preset.name}" successfully applied and published!`);
      setTimeout(() => setSaveMessage(null), 3500);
      return true;
    } catch (err: any) {
      setSaveError(err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = async (target: "website" | "admin" | "both" = "both"): Promise<boolean> => {
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const res = await fetch("/api/v1/admin/theme/reset", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ target }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to reset theme.");
      }

      const json = await res.json();
      setSiteSettings(json.data);

      if (target === "website" || target === "both") {
        setWebsiteTheme(DEFAULT_WEBSITE_THEME);
      }

      if (target === "admin" || target === "both") {
        setAdminTheme(DEFAULT_ADMIN_THEME);
        applyAdminCssToDom(DEFAULT_ADMIN_THEME);
      }

      setSaveMessage("Theme successfully reset to official Akeezo defaults!");
      setTimeout(() => setSaveMessage(null), 3500);
      return true;
    } catch (err: any) {
      setSaveError(err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const saveTheme = async (): Promise<boolean> => {
    setIsSaving(true);
    setSaveMessage(null);
    setSaveError(null);

    try {
      const res = await fetch("/api/v1/admin/site-settings", {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          websiteTheme,
          adminTheme,
          primaryColor: websiteTheme.primaryColor,
          secondaryColor: websiteTheme.secondaryColor,
          accentColor: websiteTheme.accentColor,
          actionColor: websiteTheme.actionColor,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error?.message || "Failed to save theme settings.");
      }

      const json = await res.json();
      setSiteSettings(json.data);
      applyAdminCssToDom(adminTheme);
      setSaveMessage("Theme settings successfully saved and applied to live website and admin panel!");
      setTimeout(() => setSaveMessage(null), 4000);
      return true;
    } catch (err: any) {
      setSaveError(err.message);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        siteSettings,
        websiteTheme,
        adminTheme,
        isLoading,
        isSaving,
        saveMessage,
        saveError,
        setWebsiteTheme,
        setAdminTheme,
        updateWebsiteToken,
        updateAdminToken,
        applyPreset,
        resetToDefaults,
        saveTheme,
        refreshSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
