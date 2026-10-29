import express from "express";

const app = express();

// 1. Instant zero-cold-start health probe (responds in <1ms, NEVER touches bundle.js)
app.get(["/health", "/api/health", "/ping", "/api/ping", "/v1/health", "/api/v1/health"], (_req, res) => {
  res.status(200).json({
    data: {
      status: "healthy",
      service: "akeezo-server",
      timestamp: new Date().toISOString()
    }
  });
});

// 2. Lazy-loaded full application for data/auth routes
let fullApp = null;
let loadPromise = null;
let loadError = null;

async function getFullApp() {
  if (fullApp) return fullApp;
  if (loadError) throw loadError;
  if (!loadPromise) {
    loadPromise = import("./dist/bundle.js")
      .then((mod) => {
        fullApp = mod.default || mod.app;
        return fullApp;
      })
      .catch((err) => {
        loadError = err;
        throw err;
      });
  }
  return loadPromise;
}

app.use(async (req, res, next) => {
  try {
    const handler = await getFullApp();
    if (typeof handler === "function") {
      return handler(req, res, next);
    }
    next();
  } catch (err) {
    console.error("[Akeezo Serverless Load Error]:", err);
    res.status(500).json({
      error: {
        code: "BUNDLE_LOAD_ERROR",
        message: err?.message || "Failed to load backend bundle",
        stack: err?.stack,
        node: process.version,
        region: process.env.VERCEL_REGION || process.env.NOW_REGION
      }
    });
  }
});

export default app;
export { app };
