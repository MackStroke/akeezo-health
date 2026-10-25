import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { env } from "./config/env.js";
import { connectDB } from "./db/connection.js";
import { apiRouter } from "./api/routes.js";
import { handleSsr, getViteServer } from "./ssr/renderer.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webPublicDir = path.resolve(__dirname, "../../web/public");
const webClientDistDir = path.resolve(__dirname, "../../web/dist/client");

export const app = express();

// 1. Database Connection Middleware (ensures Mongoose is connected for every request, both standalone and serverless)
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// 2. Base Middlewares
app.use(compression());
app.use(
  cors({
    origin: env.CORS_ORIGINS.split(",").map((s) => s.trim()),
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

// 3. Static Assets (active when running standalone)
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

// 4. REST API Routes
app.use("/api/v1", apiRouter);

// 4b. Internal Case Management Operations & Admin Portal
const caseManagementDistDir = path.resolve(__dirname, "../../case-management/dist");
app.use("/case-management", express.static(caseManagementDistDir));
app.get("/case-management*", (_req, res) => {
  res.sendFile(path.join(caseManagementDistDir, "index.html"));
});
app.get(["/admin", "/admin/*"], (_req, res) => {
  res.redirect("/case-management/");
});

// 5. SSR Catch-all Handler
app.use(handleSsr);

// 6. Global Error Handler
app.use(
  (
    err: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("[Akeezo Server Unhandled Error]:", err);
    res.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred."
      }
    });
  }
);

// 7. Process resilience handlers
process.on("unhandledRejection", (reason, promise) => {
  console.error("[Akeezo Server Unhandled Rejection at]:", promise, "reason:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("[Akeezo Server Uncaught Exception]:", err);
});

// 8. Start Listening if not running in Vercel Serverless environment
if (!process.env.VERCEL) {
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
