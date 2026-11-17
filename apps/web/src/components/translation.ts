declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: new (options: unknown, elementId: string) => void;
      };
    };
    __googleTranslateElementInit?: () => void;
  }
}

export const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";

export function initGoogleTranslate(): void {
  if (typeof window === "undefined") return;

  if (!window.__googleTranslateElementInit) {
    window.__googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "en",
              includedLanguages: "en,ar,bn,fr,ru,sw,hi,es,de,zh-CN,ja,ko,pt,tr,fa,ur",
              autoDisplay: false
            },
            "google_translate_element"
          );
        }
      } catch (e) {
        console.warn("[Akeezo Translate] Init warning:", e);
      }
    };
  }

  if (!document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src = "https://translate.google.com/translate_a/element.js?cb=__googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }
}

export function applyLanguageTranslation(langCode: string): void {
  if (typeof window === "undefined") return;

  const code = (langCode || "en").toLowerCase();
  const cookieValue = `/en/${code}`;

  // 1. Set Google Translate cookie
  if (code === "en") {
    // Reset to English
    document.cookie = `googtrans=/en/en; path=/; max-age=31536000; SameSite=Lax;`;
    const host = window.location.hostname;
    if (host && host !== "localhost") {
      document.cookie = `googtrans=/en/en; path=/; domain=.${host}; max-age=31536000; SameSite=Lax;`;
    }
  } else {
    document.cookie = `googtrans=${cookieValue}; path=/; max-age=31536000; SameSite=Lax;`;
    const host = window.location.hostname;
    if (host && host !== "localhost") {
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host}; max-age=31536000; SameSite=Lax;`;
    }
  }

  // 2. Set Akeezo preference cookie
  document.cookie = `akeezo_lang=${code}; path=/; max-age=31536000; SameSite=Lax;`;
  const host = window.location.hostname;
  if (host && host !== "localhost") {
    document.cookie = `akeezo_lang=${code}; path=/; domain=.${host}; max-age=31536000; SameSite=Lax;`;
  }

  // 3. Save into cache (localStorage)
  try {
    localStorage.setItem("akeezo_user_language", code);
    localStorage.setItem("akeezo_lang_prompt_handled", "true");
  } catch (e) {}

  // 4. Initialize translation engine
  initGoogleTranslate();

  // 5. Trigger Google Translate select element
  const changeSelect = () => {
    const select = document.querySelector<HTMLSelectElement>("select.goog-te-combo");
    if (select) {
      select.value = code;
      select.dispatchEvent(new Event("change"));
      return true;
    }
    return false;
  };

  if (!changeSelect()) {
    let retries = 0;
    const interval = setInterval(() => {
      retries++;
      if (changeSelect() || retries > 15) {
        clearInterval(interval);
      }
    }, 200);
  }

  // 6. Dispatch custom event for UI synchronization across header and footer
  try {
    window.dispatchEvent(new CustomEvent("akeezo:language-change", { detail: { code } }));
  } catch (e) {}
}

export function getSavedLanguageCode(): string {
  if (typeof document === "undefined") return "en";

  // 1. Check akeezo_lang cookie
  const akeezoMatch = document.cookie.match(/akeezo_lang=([a-zA-Z_-]+)/);
  if (akeezoMatch && akeezoMatch[1]) {
    return akeezoMatch[1].toLowerCase();
  }

  // 2. Check localStorage cache
  try {
    const cached = localStorage.getItem("akeezo_user_language");
    if (cached) return cached.toLowerCase();
  } catch (e) {}

  // 3. Check googtrans cookie
  const googMatch = document.cookie.match(/googtrans=\/en\/([a-zA-Z_-]+)/);
  if (googMatch && googMatch[1] && googMatch[1] !== "en") {
    return googMatch[1].toLowerCase();
  }

  return "en";
}
