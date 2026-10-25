import { hydrateRoot, createRoot } from "react-dom/client";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { App } from "./App.js";
import { getDefaultRouteData } from "./defaultData.js";
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
    // render immediately with fallback route data so user never encounters a blank loader screen.
    const path = window.location.pathname || "/";
    const defaultData = getDefaultRouteData(path);
    const root = createRoot(container);
    root.render(<App data={defaultData} />);

    // In background, fetch the latest published CMS route payload from the API service.
    fetch(`/api/v1/route?path=${encodeURIComponent(path)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) {
          root.render(<App data={json.data} />);
        }
      })
      .catch((err) => {
        console.warn("[Akeezo Client] Standalone route background fetch notice:", err);
      });
  }
}
