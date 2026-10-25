import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { env } from "./config/env.js";
import mongoose from "mongoose";
import { connectDB } from "./db/connection.js";
import { apiRouter } from "./api/routes.js";
import { handleSsr, getViteServer, renderFallback500Html, toSafeSiteSettings } from "./ssr/renderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webPublicDir = path.resolve(__dirname, "../../web/public");
const webClientDistDir = path.resolve(__dirname, "../../web/dist/client");

export const app = express();

// 1. Database Connection (non-blocking background connect so routes respond instantly)
connectDB().catch((err) => {
  console.warn("[Akeezo Server] Non-blocking initial DB connection notice:", (err as Error)?.message);
});
app.use((_req, _res, next) => {
  // If disconnected, attempt reconnect non-blockingly
  if (mongoose.connection.readyState === 0) {
    connectDB().catch(() => {});
  }
  next();
});

// 2. Base Middlewares
app.use(compression());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any vercel.app preview or production deployment, localhost, or production domain
      if (
        origin.endsWith(".vercel.app") ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin === "https://akeezo.com" ||
        origin === "https://www.akeezo.com"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true
  })
);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);
app.use(express.json());

// 3. Root & Health Probes (instant 200 responses)
app.get(["/health", "/api/health", "/api/v1/health", "/v1/health"], (_req, res) => {
  res.status(200).json({
    data: {
      status: "healthy",
      service: "akeezo-server",
      timestamp: new Date().toISOString()
    }
  });
});

// 4. REST API Routes (mounted at all common prefixes)
app.use("/api/v1", apiRouter);
app.use("/v1", apiRouter);
app.use("/api", apiRouter);

// 5. Environment-specific routing: Standalone SSR vs Vercel Serverless
if (!process.env.VERCEL) {
  // Static Assets (active when running standalone outside Vercel)
  app.use(express.static(webPublicDir));
  if (env.NODE_ENV === "production") {
    app.use(express.static(webClientDistDir, { index: false }));
  } else {
    getViteServer()
      .then((vite) => {
        if (vite) app.use(vite.middlewares);
      })
      .catch(() => {});
  }

  // 1. Internal Case Management Operations Portal (Dedicated CMS for patient leads, stages, quotes & commissions)
  const caseManagementDistDir = path.resolve(__dirname, "../../case-management/dist");
  app.use("/case-management", express.static(caseManagementDistDir));
  app.get(["/case-management", "/case-management/*"], (_req, res) => {
    res.sendFile(path.join(caseManagementDistDir, "index.html"));
  });

  // 2. Akeezo Website Management & Super Admin Portal (Overall website CMS, lead collector, and Case Management oversight)
  const adminDistDir = path.resolve(__dirname, "../../admin/dist");
  app.use("/admin", express.static(adminDistDir));
  app.get(["/admin", "/admin/*"], (_req, res) => {
    res.sendFile(path.join(adminDistDir, "index.html"));
  });

  // Standalone SSR Catch-all Handler
  app.use(handleSsr);
} else {
  // On Vercel Serverless, unhandled API requests return clean 404 JSON without filesystem access
  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: `Endpoint ${req.method} ${req.originalUrl || req.url} not found on serverless API`
      }
    });
  });
}

// 6. Global Error Handler
app.use(
  (
    err: unknown,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[Akeezo Server Unhandled Error]:", err);
    if (!res.headersSent && req.accepts && req.accepts("html")) {
      const fallbackHtml = renderFallback500Html(toSafeSiteSettings(null));
      res.status(500).setHeader("Content-Type", "text/html; charset=utf-8").send(fallbackHtml);
      return;
    }
    if (!res.headersSent) {
      res.status(500).json({
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred."
        }
      });
    }
  }
);

// 7. Process resilience handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Akeezo Server Unhandled Rejection at]:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[Akeezo Server Uncaught Exception]:", err);
});

// 8. Start Listening if not running in Vercel Serverless environment or test runner
const isTestEnv =
  process.env.NODE_ENV === "test" ||
  process.execArgv.includes("--test") ||
  process.argv.includes("--test") ||
  process.argv[1]?.includes("test");

if (!process.env.VERCEL && !isTestEnv) {
  connectDB()
    .then(() => {
      app.listen(env.PORT, () => {
        console.log(`[Akeezo Server] Listening on http://localhost:${env.PORT} (${env.NODE_ENV})`);
        console.log(`[Akeezo Server] Healthcare Discovery & Coordination Platform ready.`);
      });
    })
    .catch((err) => {
      console.error("[Akeezo Server] Fatal DB connection error:", err);
    });
}

export default app;
