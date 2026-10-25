/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#00C7BE",
          tealAction: "#007A6C",
          tealDark: "#061E1B",
          tealLight: "#E6F8F6",
          tealBorder: "#B2EBE4",
          orange: "#FF6B00",
          orangeAlt: "#FF6D1B",
          orangeDark: "#B54700",
          orangeLight: "#FFF4EC",
          orangeBorder: "#FFD8BF",
          navy: "#061E1B",
          ink: "#262626",
          inkMuted: "#595959",
        },
      },
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
