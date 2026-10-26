/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: "var(--admin-primary, #007A6C)",
          accent: "var(--admin-accent, #00C7BE)",
          secondary: "var(--admin-secondary, #FF6B00)",
          sidebarBg: "var(--admin-sidebar-bg, #061E1B)",
          sidebarText: "var(--admin-sidebar-text, #F4F6F9)",
          sidebarActive: "var(--admin-sidebar-active, #0B2B27)",
          headerBg: "var(--admin-header-bg, #FFFFFF)",
          headerText: "var(--admin-header-text, #1E293B)",
          contentBg: "var(--admin-content-bg, #F8FAFC)",
          cardBg: "var(--admin-card-bg, #FFFFFF)",
          textColor: "var(--admin-text, #1E293B)",
          textMuted: "var(--admin-text-muted, #64748B)",
          border: "var(--admin-border, #E2E8F0)",
        },
        brand: {
          teal: "var(--admin-accent, #00C7BE)",
          tealAction: "var(--admin-primary, #007A6C)",
          tealDark: "var(--admin-sidebar-bg, #061E1B)",
          tealLight: "#E6F8F6",
          tealBorder: "#B2EBE4",
          orange: "var(--admin-secondary, #FF6B00)",
          orangeAlt: "#FF6D1B",
          orangeDark: "#B54700",
          orangeLight: "#FFF4EC",
          orangeBorder: "#FFD8BF",
          navy: "var(--admin-sidebar-bg, #061E1B)",
          ink: "#262626",
          inkMuted: "#595959",
        },
      },
      borderRadius: {
        adminCard: "var(--admin-radius-card, 16px)",
        adminBtn: "var(--admin-radius-button, 10px)",
      },
      fontFamily: {
        sans: ["var(--admin-font, Lato)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
