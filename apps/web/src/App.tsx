import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { HomeTemplate } from "./templates/HomeTemplate.js";
import { LegalTemplate } from "./templates/LegalTemplate.js";
import { NotFoundTemplate } from "./templates/NotFoundTemplate.js";

export interface AppProps {
  data?: PublicRouteResponseDTO;
}

export function App({ data }: AppProps) {
  if (!data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p>Loading AKEEZO...</p>
      </div>
    );
  }

  switch (data.pageKind) {
    case "home":
      return <HomeTemplate data={data} />;
    case "legal":
      return <LegalTemplate data={data} />;
    case "notFound":
      return <NotFoundTemplate data={data} />;
    default:
      return <NotFoundTemplate data={data} />;
  }
}

export default App;
