// Akeezo Serverless Entrypoint Bridge for Vercel Multi-Services
let innerApp = null;
let bootError = null;

try {
  const mod = await import("./dist/bundle.js");
  innerApp = mod.default || mod.app;
} catch (err) {
  bootError = {
    message: err?.message,
    stack: err?.stack,
    name: err?.name,
    code: err?.code,
  };
  console.error("[Akeezo Serverless Boot Error]:", err);
}

export default function handler(req, res, next) {
  if (bootError) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify(
        {
          status: "SERVERLESS_BOOT_ERROR",
          details: bootError,
          cwd: process.cwd(),
          node: process.version,
        },
        null,
        2
      )
    );
    return;
  }

  if (typeof innerApp === "function") {
    return innerApp(req, res, next);
  }

  if (innerApp && typeof innerApp.handle === "function") {
    return innerApp.handle(req, res, next);
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(
    JSON.stringify({
      status: "alive_fallback",
      timestamp: new Date().toISOString(),
    })
  );
}

// Attach Express application methods for full compatibility with Vercel Express preset
handler.handle = function (req, res, next) {
  return handler(req, res, next);
};
handler.use = function (...args) {
  if (innerApp && typeof innerApp.use === "function") {
    return innerApp.use(...args);
  }
};
handler.get = function (...args) {
  if (innerApp && typeof innerApp.get === "function") {
    return innerApp.get(...args);
  }
};
handler.post = function (...args) {
  if (innerApp && typeof innerApp.post === "function") {
    return innerApp.post(...args);
  }
};
handler.listen = function (...args) {
  if (innerApp && typeof innerApp.listen === "function") {
    return innerApp.listen(...args);
  }
};
