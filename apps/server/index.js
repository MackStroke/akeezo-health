export default function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  res.end(JSON.stringify({
    status: "alive_from_native_handler",
    timestamp: new Date().toISOString(),
    node: process.version,
    cwd: process.cwd(),
  }));
}
