import express from "express";

let app = null;
let bootError = null;

try {
  const mod = await import("./dist/bundle.js");
  app = mod.default || mod.app;
} catch (errBundle) {
  console.warn("[Akeezo Serverless] bundle.js failed to load, trying dist/index.js fallback:", errBundle.message);
  try {
    const modFallback = await import("./dist/index.js");
    app = modFallback.default || modFallback.app;
  } catch (errFallback) {
    bootError = {
      bundleError: {
        name: errBundle?.name,
        message: errBundle?.message,
        stack: errBundle?.stack,
      },
      fallbackError: {
        name: errFallback?.name,
        message: errFallback?.message,
        stack: errFallback?.stack,
      },
    };
    console.error("[Akeezo Serverless Boot Fatal]:", bootError);
  }
}

const serverlessApp = express();

serverlessApp.use((req, res, next) => {
  if (bootError) {
    return res.status(500).json({
      error: {
        code: "SERVERLESS_BOOT_ERROR",
        message: "Server application failed to initialize in serverless runtime.",
        details: bootError,
      },
    });
  }

  if (!app) {
    return res.status(500).json({
      error: {
        code: "SERVERLESS_APP_UNAVAILABLE",
        message: "Server application instance is not available.",
      },
    });
  }

  return app(req, res, next);
});

export default serverlessApp;
