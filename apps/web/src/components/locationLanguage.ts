import { LANGUAGES } from "./navigationData.js";

export interface DetectedLocationInfo {
  countryCode: string;
  countryName: string;
  languageCode: string;
  languageName: string;
  languageLocal: string;
  flagUrl: string;
  currencyCode: string;
  currencySymbol: string;
  source: "ip" | "timezone" | "locale" | "fallback";
}

export const COOKIE_LANG = "akeezo_lang";
export const COOKIE_COUNTRY = "akeezo_country";
export const COOKIE_PROMPT_HANDLED = "akeezo_lang_prompt_handled";
export const COOKIE_AUTO_SWITCH = "akeezo_auto_switch_lang";

export const CACHE_LANG = "akeezo_user_language";
export const CACHE_COUNTRY = "akeezo_detected_country";
export const CACHE_PROMPT_HANDLED = "akeezo_lang_prompt_handled";
export const CACHE_AUTO_SWITCH = "akeezo_auto_switch_lang";

/**
 * Mapping of Country Codes to Primary Language, Currency, and Details
 */
export const COUNTRY_LANGUAGE_MAP: Record<
  string,
  { countryName: string; lang: string; currency: string; symbol: string; flag: string }
> = {
  AE: { countryName: "United Arab Emirates", lang: "ar", currency: "AED", symbol: "د.إ", flag: "https://flagcdn.com/w40/ae.png" },
  SA: { countryName: "Saudi Arabia", lang: "ar", currency: "SAR", symbol: "﷼", flag: "https://flagcdn.com/w40/sa.png" },
  OM: { countryName: "Oman", lang: "ar", currency: "OMR", symbol: "ر.ع.", flag: "https://flagcdn.com/w40/om.png" },
  QA: { countryName: "Qatar", lang: "ar", currency: "QAR", symbol: "ر.ق", flag: "https://flagcdn.com/w40/qa.png" },
  KW: { countryName: "Kuwait", lang: "ar", currency: "KWD", symbol: "د.ك", flag: "https://flagcdn.com/w40/kw.png" },
  BH: { countryName: "Bahrain", lang: "ar", currency: "BHD", symbol: ".د.ب", flag: "https://flagcdn.com/w40/bh.png" },
  EG: { countryName: "Egypt", lang: "ar", currency: "EGP", symbol: "£", flag: "https://flagcdn.com/w40/eg.png" },
  IQ: { countryName: "Iraq", lang: "ar", currency: "IQD", symbol: "ع.د", flag: "https://flagcdn.com/w40/iq.png" },
  BD: { countryName: "Bangladesh", lang: "bn", currency: "BDT", symbol: "৳", flag: "https://flagcdn.com/w40/bd.png" },
  FR: { countryName: "France", lang: "fr", currency: "EUR", symbol: "€", flag: "https://flagcdn.com/w40/fr.png" },
  SN: { countryName: "Senegal", lang: "fr", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/sn.png" },
  CI: { countryName: "Côte d'Ivoire", lang: "fr", currency: "XOF", symbol: "CFA", flag: "https://flagcdn.com/w40/ci.png" },
  RU: { countryName: "Russia", lang: "ru", currency: "RUB", symbol: "₽", flag: "https://flagcdn.com/w40/ru.png" },
  KZ: { countryName: "Kazakhstan", lang: "ru", currency: "KZT", symbol: "₸", flag: "https://flagcdn.com/w40/kz.png" },
  UZ: { countryName: "Uzbekistan", lang: "ru", currency: "UZS", symbol: "so'm", flag: "https://flagcdn.com/w40/uz.png" },
  KE: { countryName: "Kenya", lang: "sw", currency: "KES", symbol: "KSh", flag: "https://flagcdn.com/w40/ke.png" },
  TZ: { countryName: "Tanzania", lang: "sw", currency: "TZS", symbol: "TSh", flag: "https://flagcdn.com/w40/tz.png" },
  UG: { countryName: "Uganda", lang: "sw", currency: "UGX", symbol: "USh", flag: "https://flagcdn.com/w40/ug.png" },
  IN: { countryName: "India", lang: "hi", currency: "INR", symbol: "₹", flag: "https://flagcdn.com/w40/in.png" },
  ES: { countryName: "Spain", lang: "es", currency: "EUR", symbol: "€", flag: "https://flagcdn.com/w40/es.png" },
  MX: { countryName: "Mexico", lang: "es", currency: "MXN", symbol: "$", flag: "https://flagcdn.com/w40/mx.png" },
  CO: { countryName: "Colombia", lang: "es", currency: "COP", symbol: "$", flag: "https://flagcdn.com/w40/co.png" },
  TR: { countryName: "Turkey", lang: "tr", currency: "TRY", symbol: "₺", flag: "https://flagcdn.com/w40/tr.png" },
  DE: { countryName: "Germany", lang: "de", currency: "EUR", symbol: "€", flag: "https://flagcdn.com/w40/de.png" },
  PK: { countryName: "Pakistan", lang: "ur", currency: "PKR", symbol: "₨", flag: "https://flagcdn.com/w40/pk.png" },
  IR: { countryName: "Iran", lang: "fa", currency: "IRR", symbol: "﷼", flag: "https://flagcdn.com/w40/ir.png" },
  CN: { countryName: "China", lang: "zh-CN", currency: "CNY", symbol: "¥", flag: "https://flagcdn.com/w40/cn.png" },
  JP: { countryName: "Japan", lang: "ja", currency: "JPY", symbol: "¥", flag: "https://flagcdn.com/w40/jp.png" },
  KR: { countryName: "South Korea", lang: "ko", currency: "KRW", symbol: "₩", flag: "https://flagcdn.com/w40/kr.png" },
  BR: { countryName: "Brazil", lang: "pt", currency: "BRL", symbol: "R$", flag: "https://flagcdn.com/w40/br.png" },
  US: { countryName: "United States", lang: "en", currency: "USD", symbol: "$", flag: "https://flagcdn.com/w40/us.png" },
  GB: { countryName: "United Kingdom", lang: "en", currency: "GBP", symbol: "£", flag: "https://flagcdn.com/w40/gb.png" },
  NG: { countryName: "Nigeria", lang: "en", currency: "NGN", symbol: "₦", flag: "https://flagcdn.com/w40/ng.png" },
  CA: { countryName: "Canada", lang: "en", currency: "CAD", symbol: "C$", flag: "https://flagcdn.com/w40/ca.png" },
  AU: { countryName: "Australia", lang: "en", currency: "AUD", symbol: "A$", flag: "https://flagcdn.com/w40/au.png" }
};

/**
 * Mapping of IANA Timezones to Country Codes
 */
export const TIMEZONE_TO_COUNTRY: Record<string, string> = {
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Asia/Muscat": "OM",
  "Asia/Qatar": "QA",
  "Asia/Kuwait": "KW",
  "Asia/Bahrain": "BH",
  "Africa/Cairo": "EG",
  "Asia/Baghdad": "IQ",
  "Asia/Dhaka": "BD",
  "Europe/Paris": "FR",
  "Africa/Dakar": "SN",
  "Africa/Abidjan": "CI",
  "Europe/Moscow": "RU",
  "Asia/Yekaterinburg": "RU",
  "Asia/Novosibirsk": "RU",
  "Asia/Almaty": "KZ",
  "Asia/Tashkent": "UZ",
  "Africa/Nairobi": "KE",
  "Africa/Dar_es_Salaam": "TZ",
  "Africa/Kampala": "UG",
  "Asia/Kolkata": "IN",
  "Asia/Calcutta": "IN",
  "Europe/Madrid": "ES",
  "America/Mexico_City": "MX",
  "America/Bogota": "CO",
  "Europe/Istanbul": "TR",
  "Europe/Berlin": "DE",
  "Asia/Karachi": "PK",
  "Asia/Tehran": "IR",
  "Asia/Shanghai": "CN",
  "Asia/Hong_Kong": "CN",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "America/Sao_Paulo": "BR",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Los_Angeles": "US",
  "Europe/London": "GB",
  "Africa/Lagos": "NG",
  "America/Toronto": "CA",
  "Australia/Sydney": "AU"
};

/**
 * Read Cookie Helper
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[2]) : null;
}

/**
 * Set Cookie Helper (with Cross-subdomain & Lax security)
 */
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax;`;
  const host = window.location.hostname;
  if (host && host !== "localhost") {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; domain=.${host}; max-age=${maxAge}; SameSite=Lax;`;
  }
}

/**
 * Check whether user has already dismissed or handled the location prompt
 */
export function isLanguagePromptHandled(): boolean {
  if (typeof window === "undefined") return true;
  const cookieVal = getCookie(COOKIE_PROMPT_HANDLED);
  if (cookieVal === "true") return true;
  try {
    if (localStorage.getItem(CACHE_PROMPT_HANDLED) === "true") return true;
  } catch (e) {}
  return false;
}

/**
 * Persist prompt dismissal or handling flag
 */
export function setLanguagePromptHandled(handled: boolean): void {
  setCookie(COOKIE_PROMPT_HANDLED, handled ? "true" : "false");
  try {
    localStorage.setItem(CACHE_PROMPT_HANDLED, handled ? "true" : "false");
  } catch (e) {}
}

/**
 * Check whether auto-switch without prompt is enabled
 */
export function isAutoSwitchEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const cookieVal = getCookie(COOKIE_AUTO_SWITCH);
  if (cookieVal !== null) return cookieVal === "true";
  try {
    return localStorage.getItem(CACHE_AUTO_SWITCH) === "true";
  } catch (e) {}
  return false;
}

/**
 * Persist auto-switch preference
 */
export function setAutoSwitchEnabled(enabled: boolean): void {
  setCookie(COOKIE_AUTO_SWITCH, enabled ? "true" : "false");
  try {
    localStorage.setItem(CACHE_AUTO_SWITCH, enabled ? "true" : "false");
  } catch (e) {}
}

/**
 * Save user language preference in both cookies and cache (localStorage)
 */
export function saveUserLanguagePreference(langCode: string, countryCode?: string): void {
  const code = langCode.toLowerCase();
  setCookie(COOKIE_LANG, code);
  if (countryCode) {
    setCookie(COOKIE_COUNTRY, countryCode.toUpperCase());
  }
  setLanguagePromptHandled(true);
  try {
    localStorage.setItem(CACHE_LANG, code);
    if (countryCode) {
      localStorage.setItem(CACHE_COUNTRY, countryCode.toUpperCase());
    }
  } catch (e) {}
}

/**
 * Resolve country code from IANA timezone string
 */
export function countryFromTimezone(tz: string): string | null {
  if (!tz) return null;
  if (TIMEZONE_TO_COUNTRY[tz]) {
    return TIMEZONE_TO_COUNTRY[tz];
  }
  // Region-based fallbacks
  if (tz.startsWith("Asia/Riyadh") || tz.startsWith("Asia/Jeddah")) return "SA";
  if (tz.startsWith("Asia/Dubai")) return "AE";
  if (tz.startsWith("Africa/Cairo")) return "EG";
  if (tz.startsWith("Asia/Dhaka")) return "BD";
  if (tz.startsWith("Europe/Paris")) return "FR";
  if (tz.startsWith("Europe/Moscow")) return "RU";
  if (tz.startsWith("Africa/Nairobi")) return "KE";
  if (tz.startsWith("Asia/Kolkata") || tz.startsWith("Asia/Calcutta")) return "IN";
  if (tz.startsWith("Europe/Madrid")) return "ES";
  if (tz.startsWith("America/Mexico_City")) return "MX";
  if (tz.startsWith("Europe/Istanbul")) return "TR";
  if (tz.startsWith("Europe/Berlin")) return "DE";
  return null;
}

/**
 * Resolve country code from browser navigator language
 */
export function countryFromNavigatorLocale(locale: string): string | null {
  if (!locale) return null;
  const parts = locale.split(/[-_]/);
  if (parts.length >= 2 && parts[1].length === 2) {
    const code = parts[1].toUpperCase();
    if (COUNTRY_LANGUAGE_MAP[code]) return code;
  }
  // Primary language fallback
  const lang = parts[0].toLowerCase();
  if (lang === "ar") return "AE";
  if (lang === "bn") return "BD";
  if (lang === "fr") return "FR";
  if (lang === "ru") return "RU";
  if (lang === "sw") return "KE";
  if (lang === "es") return "ES";
  if (lang === "tr") return "TR";
  if (lang === "de") return "DE";
  if (lang === "hi") return "IN";
  return null;
}

/**
 * Full Location & Language Detection Engine
 * 1. Checks server /api/v1/geo headers (Cloudflare/Vercel)
 * 2. Fallbacks to client Intl timezone
 * 3. Fallbacks to browser navigator languages
 */
export async function detectUserLocationAndLanguage(): Promise<DetectedLocationInfo> {
  if (typeof window === "undefined") {
    return {
      countryCode: "US",
      countryName: "United States",
      languageCode: "en",
      languageName: "English",
      languageLocal: "English",
      flagUrl: "https://flagcdn.com/w40/us.png",
      currencyCode: "USD",
      currencySymbol: "$",
      source: "fallback"
    };
  }

  let detectedCountryCode: string | null = null;
  let source: "ip" | "timezone" | "locale" | "fallback" = "fallback";

  // 1. Try server Geo API (non-blocking, timeout 1200ms)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);
    const resp = await fetch("/api/v1/geo", { signal: controller.signal });
    clearTimeout(timeoutId);
    if (resp.ok) {
      const data = await resp.json();
      if (data && data.countryCode && COUNTRY_LANGUAGE_MAP[data.countryCode]) {
        detectedCountryCode = data.countryCode;
        source = "ip";
      }
    }
  } catch (e) {
    // Graceful fallback to client inspection
  }

  // 2. Try client-side Timezone if not detected via IP
  if (!detectedCountryCode) {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzCountry = countryFromTimezone(tz);
      if (tzCountry && COUNTRY_LANGUAGE_MAP[tzCountry]) {
        detectedCountryCode = tzCountry;
        source = "timezone";
      }
    } catch (e) {}
  }

  // 3. Try browser navigator.languages
  if (!detectedCountryCode && typeof navigator !== "undefined") {
    const primaryLocale = navigator.language || (navigator.languages && navigator.languages[0]) || "";
    const locCountry = countryFromNavigatorLocale(primaryLocale);
    if (locCountry && COUNTRY_LANGUAGE_MAP[locCountry]) {
      detectedCountryCode = locCountry;
      source = "locale";
    }
  }

  // 4. Default to US / English if unresolvable
  const country = detectedCountryCode ? COUNTRY_LANGUAGE_MAP[detectedCountryCode] : COUNTRY_LANGUAGE_MAP.US;
  const countryCode = detectedCountryCode || "US";

  const langMatch = LANGUAGES.find((l) => l.code.toLowerCase() === country.lang.toLowerCase()) || {
    code: country.lang,
    name: "English",
    local: "English"
  };

  return {
    countryCode,
    countryName: country.countryName,
    languageCode: country.lang,
    languageName: langMatch.name,
    languageLocal: langMatch.local,
    flagUrl: country.flag,
    currencyCode: country.currency,
    currencySymbol: country.symbol,
    source
  };
}
