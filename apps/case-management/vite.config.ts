import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/case-management/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react/") || id.includes("react-router")) {
              return "vendor-react";
            }
            if (id.includes("lucide-react")) {
              return "vendor-icons";
            }
            return "vendor-core";
          }
        },
      },
    },
  },
  server: {
    port: 5174,
    proxy: {
      "/api": {
        target: process.env.SERVER_URL || "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
});
