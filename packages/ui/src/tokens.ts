export const tokens = {
  colors: {
    brandTeal: "#00C7BE",
    brandOrange: "#FF6B00",
    action: "#007A6C",
    actionHover: "#005F54",
    actionAccent: "#B54700",
    surface: "#FFFFFF",
    surfaceMuted: "#F4F6F9",
    surfaceTeal: "#E6F8F6",
    surfaceOrange: "#FFF4EC",
    ink: "#262626",
    inkMuted: "#595959",
    border: "#E2E8F0",
    emergency: "#D92D20",
    navy: "#061E1B",
    // Compatibility aliases
    primaryTeal: "#00C7BE",
    actionTeal: "#007A6C",
    warningOrange: "#FF6B00",
    actionOrange: "#B54700",
    darkNavy: "#061E1B",
    lightGray: "#F4F6F9",
    borderGray: "#E2E8F0",
    textDark: "#262626",
    textMuted: "#595959",
    textSecondary: "#595959"
  },
  typography: {
    fontFamily: "'Lato', system-ui, sans-serif"
  },
  layout: {
    pageMax: "1280px",
    radiusCard: "20px",
    radiusHero: "30px",
    radiusPill: "999px"
  }
} as const;

export const colors = tokens.colors;
