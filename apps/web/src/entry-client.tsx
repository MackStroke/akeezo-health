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

function isRouteMatching(initialPath?: string, currentPath?: string): boolean {
  if (!initialPath || !currentPath) return false;
  const normInitial = (initialPath.replace(/\/$/, "") || "/").toLowerCase();
  const normCurrent = (currentPath.replace(/\/$/, "") || "/").toLowerCase();
  return normInitial === normCurrent;
}

const initialData = window.__INITIAL_DATA__;
const container = document.getElementById("root");

if (container) {
  const currentPath = window.location.pathname || "/";
  if (initialData && isRouteMatching(initialData.path, currentPath)) {
    hydrateRoot(container, <App data={initialData} />);
  } else {
    // When running as a standalone Vite service on Vercel without SSR injection,
    // or when a fallback index.html is served for a dynamically matched route,
    // render immediately with fallback route data so user never encounters a blank loader screen.
    const defaultData = getDefaultRouteData(currentPath);
    const root = createRoot(container);
    root.render(<App data={defaultData} />);

    // In background, fetch the latest published CMS route payload from the API service.
    fetch(`/api/v1/route?path=${encodeURIComponent(currentPath)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && json.data.pageKind !== "notFound") {
          root.render(<App data={json.data} />);
        }
      })
      .catch((err) => {
        console.warn("[Akeezo Client] Standalone route background fetch notice:", err);
      });
  }
}
