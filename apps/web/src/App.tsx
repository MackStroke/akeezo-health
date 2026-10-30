import React from "react";
import { type PublicRouteResponseDTO, websiteThemeToCssVariables, getGoogleFontUrl } from "@akeezo/contracts";
import { HomeTemplate } from "./templates/HomeTemplate.js";
import { LegalTemplate } from "./templates/LegalTemplate.js";
import { NotFoundTemplate } from "./templates/NotFoundTemplate.js";
import { ServerErrorTemplate } from "./templates/ServerErrorTemplate.js";
import { CalculatorTemplate } from "./templates/CalculatorTemplate.js";
import { TreatmentsTemplate } from "./templates/TreatmentsTemplate.js";
import { HospitalsTemplate } from "./templates/HospitalsTemplate.js";
import { DoctorsTemplate } from "./templates/DoctorsTemplate.js";
import { AboutTemplate } from "./templates/AboutTemplate.js";
import { getDefaultRouteData } from "./defaultData.js";

export interface AppProps {
  data?: PublicRouteResponseDTO;
}

interface ErrorBoundaryProps {
  data: PublicRouteResponseDTO;
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[Akeezo App ErrorBoundary caught an unhandled render error]:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ServerErrorTemplate data={this.props.data} error={this.state.error} />;
    }
    return this.props.children;
  }
}

export function App({ data }: AppProps) {
  const currentData =
    data ||
    getDefaultRouteData(
      typeof window !== "undefined" ? window.location.pathname : "/"
    );

  React.useEffect(() => {
    if (typeof document !== "undefined") {
      if (currentData.seo?.title) {
        document.title = currentData.seo.title;
      }
      if (currentData.seo?.description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement("meta");
          metaDesc.setAttribute("name", "description");
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute("content", currentData.seo.description);
      }

      // Apply dynamic theme tokens
      const theme = currentData.siteSettings?.websiteTheme;
      if (theme) {
        if (theme.mode === "dark") {
          document.documentElement.classList.add("dark");
        } else if (theme.mode === "light") {
          document.documentElement.classList.remove("dark");
        }

        const fontUrl =
          getGoogleFontUrl(theme.fontFamily) ||
          getGoogleFontUrl(theme.headingFontFamily);
        if (fontUrl) {
          let fontLink = document.getElementById("akeezo-dynamic-font") as HTMLLinkElement | null;
          if (!fontLink) {
            fontLink = document.createElement("link");
            fontLink.id = "akeezo-dynamic-font";
            fontLink.rel = "stylesheet";
            document.head.appendChild(fontLink);
          }
          if (fontLink.href !== fontUrl) {
            fontLink.href = fontUrl;
          }
        }

        const cssVars = websiteThemeToCssVariables(theme);
        for (const [prop, val] of Object.entries(cssVars)) {
          document.documentElement.style.setProperty(prop, val);
        }
      }
    }
  }, [currentData]);

  const renderContent = () => {
    switch (currentData.pageKind) {
      case "home":
        return <HomeTemplate data={currentData} />;
      case "calculatorLanding":
      case "calculatorWizard":
      case "calculatorResult":
        return <CalculatorTemplate data={currentData} />;
      case "treatmentDirectory":
      case "treatmentDetail":
        return <TreatmentsTemplate data={currentData} />;
      case "hospitalDirectory":
      case "hospitalDetail":
        return <HospitalsTemplate data={currentData} />;
      case "doctorDirectory":
      case "doctorDetail":
        return <DoctorsTemplate data={currentData} />;
      case "about":
        return <AboutTemplate data={currentData} />;
      case "legal":
        return <LegalTemplate data={currentData} />;
      case "serverError":
        return <ServerErrorTemplate data={currentData} />;
      case "notFound":
        return <NotFoundTemplate data={currentData} />;
      default:
        return <NotFoundTemplate data={currentData} />;
    }
  };

  return <ErrorBoundary data={currentData}>{renderContent()}</ErrorBoundary>;
}

export default App;
