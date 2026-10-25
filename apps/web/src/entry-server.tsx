import React from "react";
import { renderToPipeableStream, type RenderToPipeableStreamOptions } from "react-dom/server";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { App } from "./App.js";

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

export { App };
