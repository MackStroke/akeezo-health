import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import express from "express";
import cors from "cors";
import compression from "compression";
import helmet from "helmet";
import { env } from "./config/env.js";
import mongoose from "mongoose";
import { connectDB } from "./db/connection.js";
import { apiRouter } from "./api/routes.js";
import { RedirectModel } from "./db/models/Redirect.js";
import { SiteSettings } from "./db/models/SiteSettings.js";
import { generateAdminThemeCss, getGoogleFontUrl } from "@akeezo/contracts";
import { handleSsr, getViteServer, renderFallback500Html, toSafeSiteSettings } from "./ssr/renderer.js";
import { verifyToken } from "./utils/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webPublicDir = path.resolve(__dirname, "../../web/public");
const webClientDistDir = path.resolve(__dirname, "../../web/dist/client");

const isServerless =
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.VERCEL_ENV) ||
  Boolean(process.env.VERCEL_REGION) ||
  Boolean(process.env.NOW_REGION) ||
  Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME) ||
  Boolean(process.env.LAMBDA_TASK_ROOT);

const isTestEnv =
  process.env.NODE_ENV === "test" ||
  process.execArgv.includes("--test") ||
  process.argv.includes("--test") ||
  process.argv[1]?.includes("test");

export const app = express();

// 1. Database Connection (non-blocking background connect so routes respond instantly)
if (!isTestEnv) {
  connectDB().catch((err) => {
    console.warn("[Akeezo Server] Non-blocking initial DB connection notice:", (err as Error)?.message);
  });
}

app.use(async (req, _res, next) => {
  // If disconnected, attempt reconnect; on API routes await so queries don't buffer-timeout on cold start
  if (mongoose.connection.readyState === 0 && !isTestEnv) {
    if (req.path.startsWith("/api") || req.path.startsWith("/v1")) {
      try {
        await connectDB();
      } catch {
        // Continue and let individual route query handlers fail gracefully or buffer
      }
    } else {
      connectDB().catch(() => {});
    }
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
      // Allow official production domains, Vercel preview deployments, or local development ports
      const allowedPatterns = [
        /^https?:\/\/localhost(:\d+)?$/,
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
        /^https:\/\/([a-zA-Z0-9-]+\.)*vercel\.app$/,
        /^https:\/\/(www\.)?akeezo\.com$/
      ];
      if (allowedPatterns.some((pattern) => pattern.test(origin))) {
        return callback(null, true);
      }
      return callback(null, false);
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
if (!isServerless) {
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

  // Server-side Super Admin Gate: Intercept non-super-admin sessions and prevent access to /admin
  app.use(["/admin", "/admin/*"], (req, res, next) => {
    let token: string | undefined = undefined;
    if (req.headers.cookie) {
      const match = req.headers.cookie.match(/akeezo_session=([^;]+)/);
      if (match) token = decodeURIComponent(match[1]);
    }
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      const payload = verifyToken(token);
      if (payload && payload.role && payload.role !== "admin") {
        return res.redirect("/case-management?access=denied_super_admin_only");
      }
    }
    next();
  });

  app.use("/admin", express.static(adminDistDir, { index: false }));
  app.get(["/admin", "/admin/*"], async (req, res) => {
    const indexPath = path.join(adminDistDir, "index.html");
    if (!fs.existsSync(indexPath)) {
      res.status(404).send("Admin portal build not found.");
      return;
    }

    try {
      let html = await fs.promises.readFile(indexPath, "utf-8");
      if (mongoose.connection.readyState === 1) {
        const targetEnv = env.NODE_ENV || "development";
        const doc =
          (await SiteSettings.findOne({ environment: targetEnv }).lean()) ||
          (await SiteSettings.findOne({ environment: "development" }).lean()) ||
          (await SiteSettings.findOne().lean());
        const adminTheme = doc?.adminTheme;
        if (adminTheme) {
          const themeCss = generateAdminThemeCss(adminTheme);
          const fontUrl = getGoogleFontUrl(adminTheme.fontFamily);
          const fontHtml = fontUrl
            ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="${fontUrl}">`
            : "";
          const injection = `${fontHtml}<style id="akeezo-dynamic-admin-theme">\n${themeCss}\n</style>`;
          html = html.replace("</head>", `${injection}\n</head>`);
          if (adminTheme.mode === "dark" && !html.includes('class="dark"')) {
            html = html.replace("<html", '<html class="dark"');
          }
        }
      }
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.send(html);
    } catch {
      res.sendFile(indexPath);
    }
  });

  // 3. Public Uploads Directory (safe static storage for media library assets)
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use(
    "/uploads",
    (_req, res, next) => {
      res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
      res.setHeader("X-Content-Type-Options", "nosniff");
      next();
    },
    express.static(uploadsDir)
  );

  // 4. Dynamic SEO 301/302 Redirect Execution Middleware (before SSR)
  app.use(async (req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (
      req.path.startsWith("/api") ||
      req.path.startsWith("/v1") ||
      req.path.startsWith("/admin") ||
      req.path.startsWith("/case-management") ||
      req.path.startsWith("/uploads")
    ) {
      return next();
    }
    if (mongoose.connection.readyState !== 1) return next();
    try {
      const rawPath = req.path.toLowerCase().replace(/\/+$/, "") || "/";
      const redirect = await RedirectModel.findOne({ sourcePath: rawPath, enabled: true }).lean();
      if (redirect) {
        RedirectModel.updateOne(
          { _id: redirect._id },
          { $inc: { hitsCount: 1 }, $set: { lastHitAt: new Date() } }
        ).exec();
        return res.redirect(redirect.statusCode || 301, redirect.destinationPath);
      }
    } catch {
      // fallback
    }
    next();
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

// 8. Start Listening if not running in Serverless environment or test runner
if (!isServerless && !isTestEnv) {
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
