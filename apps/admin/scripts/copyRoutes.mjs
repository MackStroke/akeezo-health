import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.resolve(__dirname, "../dist");

if (!fs.existsSync(dist)) {
  console.log("No dist folder found in admin");
  process.exit(0);
}

const html = fs.readFileSync(path.join(dist, "index.html"), "utf-8");

const routes = [
  "",
  "overview",
  "content",
  "media",
  "enquiries",
  "redirects",
  "users",
  "activity",
  "settings",
  "cases"
];

for (const r of routes) {
  const targetDir1 = path.join(dist, "admin", r);
  fs.mkdirSync(targetDir1, { recursive: true });
  fs.writeFileSync(path.join(targetDir1, "index.html"), html, "utf-8");
  if (r) {
    fs.writeFileSync(path.join(dist, "admin", `${r}.html`), html, "utf-8");
  }

  const targetDir2 = path.join(dist, r);
  fs.mkdirSync(targetDir2, { recursive: true });
  fs.writeFileSync(path.join(targetDir2, "index.html"), html, "utf-8");
  if (r) {
    fs.writeFileSync(path.join(dist, `${r}.html`), html, "utf-8");
  }
}

try {
  fs.cpSync(path.join(dist, "assets"), path.join(dist, "admin", "assets"), { recursive: true });
} catch {}

console.log("[Akeezo Admin] Copied SPA routes to static HTML.");
