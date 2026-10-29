// Akeezo Serverless Resilient Entrypoint Bridge for Vercel Multi-Services
let cachedApp = null;
let loadError = null;

async function getApp() {
  if (cachedApp) return cachedApp;
  if (loadError) return { __error: loadError };

  try {
    const mod = await import("./dist/bundle.js");
    cachedApp = mod.default || mod.app;
    return cachedApp;
  } catch (err) {
    loadError = {
      message: err?.message,
      stack: err?.stack,
      name: err?.name,
      code: err?.code,
    };
    console.error("[Akeezo Serverless Bundle Load Error]:", err);
    return { __error: loadError };
  }
}

export default async function handler(req, res, next) {
  // 1. Instant zero-dependency diagnostic ping route (guaranteed to never fail or block)
  const pathname = (req.url || "").split("?")[0];
  if (pathname === "/api/ping" || pathname === "/ping") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        {
          status: "alive_instant_ping",
          url: req.url,
          method: req.method,
          node: process.version,
          memoryUsage: process.memoryUsage(),
          env: {
            VERCEL: process.env.VERCEL,
            VERCEL_ENV: process.env.VERCEL_ENV,
            NODE_ENV: process.env.NODE_ENV,
            REGION: process.env.VERCEL_REGION,
          },
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );
    return;
  }

  // 2. Load the main application bundle lazily on request
  try {
    const app = await getApp();

    if (app && app.__error) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify(
          {
            status: "BUNDLE_LOAD_ERROR",
            details: app.__error,
            node: process.version,
            cwd: process.cwd(),
          },
          null,
          2
        )
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
        status: "alive_fallback",
        timestamp: new Date().toISOString(),
      })
    );
  } catch (runtimeErr) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        {
          status: "RUNTIME_DISPATCH_ERROR",
          error: {
            message: runtimeErr?.message,
            stack: runtimeErr?.stack,
          },
        },
        null,
        2
      )
    );
  }
}

// Attach Express application methods for full compatibility with Vercel Express preset
handler.handle = function (req, res, next) {
  return handler(req, res, next);
};
handler.use = function (...args) {
  if (cachedApp && typeof cachedApp.use === "function") {
    return cachedApp.use(...args);
  }
};
handler.get = function (...args) {
  if (cachedApp && typeof cachedApp.get === "function") {
    return cachedApp.get(...args);
  }
};
handler.post = function (...args) {
  if (cachedApp && typeof cachedApp.post === "function") {
    return cachedApp.post(...args);
  }
};
handler.listen = function (...args) {
  if (cachedApp && typeof cachedApp.listen === "function") {
    return cachedApp.listen(...args);
  }
};
