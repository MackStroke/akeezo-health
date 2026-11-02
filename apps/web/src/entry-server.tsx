import React from "react";
import { renderToPipeableStream, renderToString, type RenderToPipeableStreamOptions } from "react-dom/server";
import {
  type PublicRouteResponseDTO,
  generateWebsiteThemeCss,
  getGoogleFontUrl
} from "@akeezo/contracts";
import { App } from "./App.js";
import { getDefaultRouteData, DEFAULT_SITE_SETTINGS } from "./defaultData.js";
import { ALL_TREATMENTS } from "./data/treatmentsData.js";
import { ALL_HOSPITALS } from "./data/hospitalsData.js";
import { ALL_DOCTORS } from "./data/doctorsData.js";
import { ALL_BLOG_ARTICLES } from "./data/blogData.js";

export function render(
  _url: string,
  data: PublicRouteResponseDTO,
  options?: RenderToPipeableStreamOptions
) {
  return renderToPipeableStream(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>,
    options
  );
}

export function renderHtml(data: PublicRouteResponseDTO): string {
  return renderToString(
    <React.StrictMode>
      <App data={data} />
    </React.StrictMode>
  );
}

export {
  App,
  getDefaultRouteData,
  DEFAULT_SITE_SETTINGS,
  generateWebsiteThemeCss,
  getGoogleFontUrl,
  ALL_TREATMENTS,
  ALL_HOSPITALS,
  ALL_DOCTORS,
  ALL_BLOG_ARTICLES
};


