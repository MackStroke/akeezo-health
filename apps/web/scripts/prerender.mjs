import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");
const clientDist = path.resolve(webRoot, "dist/client");
const serverDist = path.resolve(webRoot, "dist/server");

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function main() {
  console.log("[Akeezo SSG Pre-render] Starting static pre-rendering...");

  const templatePath = path.join(clientDist, "index.html");
  if (!fs.existsSync(templatePath)) {
    console.error("[Akeezo SSG Pre-render] Client template index.html not found at:", templatePath);
    process.exit(1);
  }

  const rawTemplate = fs.readFileSync(templatePath, "utf-8");
  // Save template.html with SSR placeholders so dynamic server SSR can always use the production template
  fs.writeFileSync(path.join(clientDist, "template.html"), rawTemplate, "utf-8");

  const serverEntryPath = path.join(serverDist, "entry-server.js");
  if (!fs.existsSync(serverEntryPath)) {
    console.error("[Akeezo SSG Pre-render] Server bundle not found at:", serverEntryPath);
    process.exit(1);
  }

  const serverEntryUrl = pathToFileURL(serverEntryPath).href;
  const {
    renderHtml,
    getDefaultRouteData,
    generateWebsiteThemeCss,
    getGoogleFontUrl,
    ALL_TREATMENTS = [],
    ALL_HOSPITALS = [],
    ALL_DOCTORS = [],
    ALL_BLOG_ARTICLES = []
  } = await import(serverEntryUrl);

  const coreRoutes = [
    "/",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/consent",
    "/refund-policy",
    "/grievance-officer",
    "/cost-calculator",
    "/calculator",
    "/cma-planner",
    "/treatments",
    "/hospitals",
    "/doctors",
    "/about",
    "/about-us",
    "/blog",
    "/blogs",
    "/articles",
    "/changelog",
    "/faq"
  ];

  const treatmentRoutes = ALL_TREATMENTS.map((t) => `/treatments/${t.slug}`);
  const hospitalRoutes = ALL_HOSPITALS.map((h) => `/hospitals/${h.slug}`);
  const doctorRoutes = ALL_DOCTORS.map((d) => `/doctors/${d.slug}`);
  const blogRoutes = ALL_BLOG_ARTICLES.flatMap((b) => [
    `/blogs/${b.slug}`,
    `/blog/${b.slug}`
  ]);

  const allRoutes = Array.from(
    new Set([
      ...coreRoutes,
      ...treatmentRoutes,
      ...hospitalRoutes,
      ...doctorRoutes,
      ...blogRoutes
    ])
  );

  console.log(`[Akeezo SSG Pre-render] Pre-rendering ${allRoutes.length} routes...`);

  let renderedCount = 0;
  for (const route of allRoutes) {
    try {
      const dto = getDefaultRouteData(route);
      const bodyHtml = renderHtml(dto);

      const canonicalPath = dto.seo?.canonicalPath || route;
      const canonicalUrl = canonicalPath.startsWith("http")
        ? canonicalPath
        : `https://akeezo.com${canonicalPath.startsWith("/") ? "" : "/"}${canonicalPath}`;

      const dynamicThemeCss = generateWebsiteThemeCss
        ? generateWebsiteThemeCss(dto.siteSettings?.websiteTheme)
        : "";

      const fontUrl = getGoogleFontUrl
        ? getGoogleFontUrl(dto.siteSettings?.websiteTheme?.fontFamily) ||
          getGoogleFontUrl(dto.siteSettings?.websiteTheme?.headingFontFamily)
        : null;

      const fontLinkHtml = fontUrl
        ? `    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link rel="stylesheet" href="${fontUrl}">\n`
        : "";

      const safeInitialDataJson = JSON.stringify(dto).replace(/</g, "\\u003c");

      const headInjection = `
    <title>${escapeHtml(dto.seo?.title || "AKEEZO Healthcare Platform")}</title>
    <meta name="description" content="${escapeHtml(dto.seo?.description || "")}" />
    <meta name="robots" content="${escapeHtml(dto.seo?.robots || "index,follow")}" />
    <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeHtml(dto.seo?.title || "")}" />
    <meta property="og:description" content="${escapeHtml(dto.seo?.description || "")}" />
    <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(dto.seo?.title || "")}" />
    <meta name="twitter:description" content="${escapeHtml(dto.seo?.description || "")}" />
${fontLinkHtml}    <style id="akeezo-dynamic-theme">
${dynamicThemeCss}
    </style>
    <script>window.__INITIAL_DATA__ = ${safeInitialDataJson};</script>
`;

      let pageHtml = rawTemplate.replace("<!--ssr-head-->", headInjection);
      pageHtml = pageHtml.replace("<!--ssr-outlet-->", bodyHtml);

      if (route === "/") {
        fs.writeFileSync(path.join(clientDist, "index.html"), pageHtml, "utf-8");
      } else {
        const cleanRoute = route.replace(/^\//, "");
        const outDir = path.join(clientDist, cleanRoute);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, "index.html"), pageHtml, "utf-8");

        // Also write standalone .html file for routes not having further subdirectories
        if (!cleanRoute.includes("/")) {
          fs.writeFileSync(path.join(clientDist, `${cleanRoute}.html`), pageHtml, "utf-8");
        }
      }

      renderedCount++;
    } catch (err) {
      console.warn(`[Akeezo SSG Pre-render] Warning rendering route "${route}":`, err.message);
    }
  }

  console.log(`[Akeezo SSG Pre-render] Successfully pre-rendered ${renderedCount} routes to static HTML!`);
}

main().catch((err) => {
  console.error("[Akeezo SSG Pre-render] Fatal error during pre-render:", err);
  process.exit(1);
});
