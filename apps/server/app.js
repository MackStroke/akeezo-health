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

export default async function handler(req, res, next) {
  const rawUrl = req.url || "";
  const cleanUrl = rawUrl.split("?")[0].replace(/\/+$/, "") || "/";

  // 1. Instant zero-cold-start health probes (pure Node.js, zero external dependencies, responds in <1ms)
  if (
    cleanUrl === "/health" ||
    cleanUrl === "/api/health" ||
    cleanUrl === "/ping" ||
    cleanUrl === "/api/ping" ||
    cleanUrl === "/v1/health" ||
    cleanUrl === "/api/v1/health"
  ) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        data: {
          status: "healthy",
          service: "akeezo-server",
          timestamp: new Date().toISOString()
        }
      })
    );
  }

  // 2. Data and Authentication Routes (delegates to bundled Express backend)
  try {
    const app = await getFullApp();
    if (typeof app === "function") {
      return app(req, res, next);
    }
    if (app && typeof app.handle === "function") {
      return app.handle(req, res, next);
    }
    throw new Error("Backend bundle did not export a callable application handler.");
  } catch (err) {
    console.error("[Akeezo Serverless Handler Error]:", err);
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 500;
    return res.end(
      JSON.stringify({
        error: {
          code: "SERVERLESS_INVOCATION_ERROR",
          message: err?.message || String(err),
          stack: err?.stack,
          node: process.version
        }
      })
    );
  }
}

// Attach Express-compatible hooks in case the Vercel framework bridge expects them
handler.use = function () {
  return handler;
};
handler.get = function () {
  return handler;
};
handler.post = function () {
  return handler;
};
handler.handle = function (req, res, next) {
  return handler(req, res, next);
};
handler.listen = function () {
  return handler;
};

export const app = handler;
