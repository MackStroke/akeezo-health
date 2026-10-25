/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: "#0D6E6E",
          tealDark: "#094F4F",
          tealLight: "#E6F4F4",
          orange: "#E85D04",
          orangeDark: "#C44B00",
          orangeLight: "#FFF3EB",
        },
      },
      fontFamily: {
        sans: ["Lato", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
