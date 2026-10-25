// Vercel Serverless Entrypoint for @akeezo/server
let cachedApp = null;

export default async function handler(req, res) {
  try {
    if (!cachedApp) {
      const mod = await import("./dist/index.js");
      cachedApp = mod.default || mod.app || mod;
    }
    return cachedApp(req, res);
  } catch (err) {
    console.error("[Vercel Serverless Handler Fatal Error]:", err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          error: {
            code: "SERVERLESS_INITIALIZATION_ERROR",
            message: err?.message || "Internal server initialization error"
          }
        })
      );
    }
  }
}
