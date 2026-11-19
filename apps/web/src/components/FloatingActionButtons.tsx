import React, { useState } from "react";
import type { SiteSettings } from "@akeezo/contracts";
import { X } from "lucide-react";

export interface FloatingActionButtonsProps {
  siteSettings?: Partial<SiteSettings>;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  siteSettings = {}
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const phone = siteSettings.whatsappHelpline || siteSettings.phone || "19453987522";
  const phoneClean = phone.replace(/[^0-9]/g, "") || "19453987522";
  const defaultText = encodeURIComponent(
    "Hi, I'm interested in treatment abroad and would like to know more about this."
  );
  const whatsappUrl = `https://wa.me/${phoneClean}?text=${defaultText}`;

  // Theme settings dynamically controlled from Admin Panel
  const assistantButtonBg =
    siteSettings.websiteTheme?.floatingButtonBgColor ||
    siteSettings.floatingButtonBgColor ||
    "var(--floating-button-bg, var(--action, #007A6C))";

  const assistantButtonText =
    siteSettings.websiteTheme?.floatingButtonTextColor ||
    siteSettings.floatingButtonTextColor ||
    "var(--floating-button-text, #FFFFFF)";

  const assistantPingColor =
    siteSettings.websiteTheme?.floatingButtonBgColor ||
    siteSettings.floatingButtonBgColor ||
    "var(--floating-button-bg, var(--brand-teal, #00C7BE))";

  return (
    <div className="fixed right-5 z-[9999] flex flex-col items-end gap-3 bottom-[86px] transition-all duration-300 ease-out lg:bottom-6 max-lg:pointer-events-none max-lg:translate-x-24 max-lg:opacity-0">
      {/* Interactive Quick Chat Drawer when assistant button is clicked */}
      {isChatOpen && (
        <div className="w-[300px] sm:w-[340px] bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-2 animate-in fade-in slide-in-from-bottom-4 duration-200 pointer-events-auto">
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between shadow-xs"
            style={{
              background: assistantButtonBg,
              color: assistantButtonText
            }}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                  </svg>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white"></span>
              </div>
              <div>
                <h4 className="font-bold text-sm leading-tight">
                  {siteSettings.brandName || "AKEEZO"} Care Assistant
                </h4>
                <p className="text-[11px] opacity-80">
                  Online | Instant Coordination
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-full opacity-80 hover:opacity-100 hover:bg-white/10 transition cursor-pointer"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 bg-gray-50 max-h-[320px] overflow-y-auto space-y-3 text-xs">
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-xs border border-gray-100 text-gray-800 leading-relaxed">
              👋 Hi! Welcome to {siteSettings.brandName || "AKEEZO"}. How can we
              help coordinate your medical treatment today?
            </div>

            <div className="space-y-1.5 pt-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Quick Assistance
              </p>
              <a
                href="/cost-calculator"
                className="block p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-gray-200 hover:border-slate-300 text-gray-700 font-medium transition text-left"
              >
                💰 Plan My Journey (Calculate Price)
              </a>
              <a
                href="/hospitals"
                className="block p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-gray-200 hover:border-slate-300 text-gray-700 font-medium transition text-left"
              >
                🏥 Explore Accredited Hospitals
              </a>
              <a
                href="/doctors"
                className="block p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-gray-200 hover:border-slate-300 text-gray-700 font-medium transition text-left"
              >
                👨‍⚕️ Find Specialist Doctors
              </a>
              <a
                href="/contact"
                className="block p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-gray-200 hover:border-slate-300 text-gray-700 font-medium transition text-left"
              >
                ✉️ Send Message to Care Desk
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2.5 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 text-emerald-800 font-medium transition text-left"
              >
                💬 Chat on WhatsApp (+{phoneClean})
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 pointer-events-auto"
        aria-label="Chat on WhatsApp"
        style={{ backgroundColor: "rgb(37, 211, 102)" }}
      >
        <svg
          className="w-6 h-6 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* CMA / Care Assistant Button */}
      <button
        type="button"
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="relative w-14 h-14 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer pointer-events-auto"
        aria-label="Chat with CMA Assistant, 1 unread message"
        style={{
          background: assistantButtonBg,
          color: assistantButtonText
        }}
      >
        <span
          className="absolute inset-0 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: assistantPingColor.includes("gradient") ? "var(--brand-teal, #00C7BE)" : assistantPingColor }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 relative"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
        </svg>
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow border border-white"
        >
          1
        </span>
      </button>
    </div>
  );
};

export default FloatingActionButtons;
