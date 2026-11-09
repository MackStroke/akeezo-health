import { resolve } from "node:path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
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
            if (id.includes("motion") || id.includes("gsap")) {
              return "vendor-animation";
            }
            if (id.includes("radix-ui") || id.includes("@radix-ui")) {
              return "vendor-radix";
            }
            return "vendor-core";
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src"),
      "@akeezo/contracts": resolve(import.meta.dirname, "../../packages/contracts/src/index.ts"),
      "@akeezo/ui": resolve(import.meta.dirname, "../../packages/ui/src/index.ts"),
    },
  },
})
