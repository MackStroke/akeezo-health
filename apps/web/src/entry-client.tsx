import { hydrateRoot } from "react-dom/client";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { App } from "./App.js";
import "./index.css";

declare global {
  interface Window {
    __INITIAL_DATA__?: PublicRouteResponseDTO;
  }
}

const initialData = window.__INITIAL_DATA__;

if (initialData) {
  const container = document.getElementById("root");
  if (container) {
    hydrateRoot(container, <App data={initialData} />);
  }
} else {
  console.warn("[Akeezo Client] No __INITIAL_DATA__ found on window; hydration skipped.");
}
