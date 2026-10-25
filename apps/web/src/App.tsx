import React from "react";
import type { PublicRouteResponseDTO } from "@akeezo/contracts";
import { HomeTemplate } from "./templates/HomeTemplate.js";
import { LegalTemplate } from "./templates/LegalTemplate.js";
import { NotFoundTemplate } from "./templates/NotFoundTemplate.js";
import { ServerErrorTemplate } from "./templates/ServerErrorTemplate.js";
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

  const renderContent = () => {
    switch (currentData.pageKind) {
      case "home":
        return <HomeTemplate data={currentData} />;
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
