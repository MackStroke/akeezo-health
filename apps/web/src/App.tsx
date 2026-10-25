import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { HomeTemplate } from "./templates/HomeTemplate.js";
import { LegalTemplate } from "./templates/LegalTemplate.js";
import { NotFoundTemplate } from "./templates/NotFoundTemplate.js";
import { getDefaultRouteData } from "./defaultData.js";

export interface AppProps {
  data?: PublicRouteResponseDTO;
}

export function App({ data }: AppProps) {
  const currentData =
    data ||
    getDefaultRouteData(
      typeof window !== "undefined" ? window.location.pathname : "/"
    );

  switch (currentData.pageKind) {
    case "home":
      return <HomeTemplate data={currentData} />;
    case "legal":
      return <LegalTemplate data={currentData} />;
    case "notFound":
      return <NotFoundTemplate data={currentData} />;
    default:
      return <NotFoundTemplate data={currentData} />;
  }
}

export default App;
