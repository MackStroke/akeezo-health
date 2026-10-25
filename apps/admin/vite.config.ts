import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/admin/",
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      "/api": {
        target: process.env.SERVER_URL || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
