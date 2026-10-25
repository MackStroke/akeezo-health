import { hydrateRoot, createRoot } from "react-dom/client";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { App } from "./App.js";
import "./index.css";

declare global {
  interface Window {
    __INITIAL_DATA__?: PublicRouteResponseDTO;
  }
}

const initialData = window.__INITIAL_DATA__;
const container = document.getElementById("root");

if (container) {
  if (initialData) {
    hydrateRoot(container, <App data={initialData} />);
  } else {
    // When running as a standalone Vite service on Vercel without SSR injection,
    // fetch initial route payload from the API service.
    const path = window.location.pathname || "/";
    fetch(`/api/v1/route?path=${encodeURIComponent(path)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const data = json?.data;
        createRoot(container).render(<App data={data} />);
      })
      .catch((err) => {
        console.warn("[Akeezo Client] Standalone route fetch failed, mounting fallback:", err);
        createRoot(container).render(<App />);
      });
  }
}
