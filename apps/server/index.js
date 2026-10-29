import express from "express";

const app = express();

let bundleApp = null;
let bundleError = null;

async function getBundleApp() {
  if (bundleApp) return bundleApp;
  if (bundleError) throw bundleError;
  try {
    const mod = await import("./dist/bundle.js");
    bundleApp = mod.default || mod.app;
    return bundleApp;
  } catch (err) {
    bundleError = err;
    console.error("[Akeezo Serverless Boot Error]:", err);
    throw err;
  }
}

// 1. Direct diagnostic ping (never touches bundle or DB)
app.get(["/api/ping", "/ping"], (_req, res) => {
  res.status(200).json({
    data: {
      status: "alive",
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_REGION: process.env.VERCEL_REGION || process.env.NOW_REGION,
      }
    }
  });
});

// 2. Diagnostic bundle tester
app.get(["/api/diag", "/diag"], async (_req, res) => {
  try {
    const loaded = await getBundleApp();
    res.status(200).json({
      data: {
        status: "bundle_loaded_successfully",
        appType: typeof loaded,
      }
    });
  } catch (err) {
    res.status(500).json({
      error: {
        code: "BUNDLE_LOAD_ERROR",
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
      }
    });
  }
});

// 3. All other requests delegate to the loaded bundle app
app.use(async (req, res, next) => {
  try {
    const delegate = await getBundleApp();
    return delegate(req, res, next);
  } catch (err) {
    return res.status(500).json({
      error: {
        code: "SERVERLESS_INITIALIZATION_ERROR",
        name: err?.name,
        message: err?.message,
        stack: err?.stack,
      }
    });
  }
});

export default app;
