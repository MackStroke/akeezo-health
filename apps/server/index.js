// Akeezo Healthcare Discovery & Coordination Platform - Serverless Service Entrypoint
let app = null;
let loadError = null;

try {
  const mod = await import("./dist/bundle.js");
  app = mod.default || mod.app;
} catch (err) {
  loadError = err;
  console.error("[Akeezo Serverless Boot Fatal Error]:", err);
}

export default function handler(req, res, next) {
  if (loadError) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        {
          error: {
            code: "FUNCTION_BOOT_ERROR",
            message: loadError?.message || "Module failed to load",
            stack: loadError?.stack,
            name: loadError?.name,
            node: process.version,
            region: process.env.VERCEL_REGION || process.env.NOW_REGION,
          }
        },
        null,
        2
      )
    );
    return;
  }

  // Instant zero-cold-start health probe (placed before any database or middleware)
  const cleanUrl = (req.url || "").split("?")[0].replace(/\/+$/, "") || "/";
  if (
    cleanUrl === "/health" ||
    cleanUrl === "/api/health" ||
    cleanUrl === "/v1/health" ||
    cleanUrl === "/api/v1/health" ||
    cleanUrl === "/ping" ||
    cleanUrl === "/api/ping"
  ) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        data: {
          status: "healthy",
          service: "akeezo-server",
          timestamp: new Date().toISOString()
        }
      })
    );
    return;
  }

  if (typeof app === "function") {
    return app(req, res, next);
  }

  if (app && typeof app.handle === "function") {
    return app.handle(req, res, next);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      data: {
        status: "alive_fallback",
        service: "akeezo-server",
        timestamp: new Date().toISOString()
      }
    })
  );
}

// Express-compatible interface shims
handler.handle = function (req, res, next) {
  return handler(req, res, next);
};
handler.use = function (...args) {
  if (app && typeof app.use === "function") return app.use(...args);
};
handler.get = function (...args) {
  if (app && typeof app.get === "function") return app.get(...args);
};
handler.post = function (...args) {
  if (app && typeof app.post === "function") return app.post(...args);
};
handler.listen = function (...args) {
  if (app && typeof app.listen === "function") return app.listen(...args);
};

export { app, handler };
