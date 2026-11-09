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

  const code = langCode.toLowerCase();
  const cookieValue = `/en/${code}`;

  // Set cookies for root and hostname
  document.cookie = `googtrans=${cookieValue}; path=/;`;
  const host = window.location.hostname;
  if (host && host !== "localhost") {
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${host};`;
  }

  initGoogleTranslate();

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
}

export function getSavedLanguageCode(): string {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/([a-zA-Z_-]+)/);
  return match && match[1] ? match[1].toLowerCase() : "en";
}
