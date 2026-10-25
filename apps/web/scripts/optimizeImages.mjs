import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "../public");

function compressSvg(svgContent) {
  // 1. Remove XML/HTML comments
  let cleaned = svgContent.replace(/<!--[\s\S]*?-->/g, "");

  // 2. Remove whitespace between tags
  cleaned = cleaned.replace(/>\s+</g, "><");

  // 3. Normalize multiple whitespace between attributes safely
  cleaned = cleaned.replace(/\s{2,}/g, " ");

  // 4. Ensure closing tags don't have redundant spaces before closing >
  cleaned = cleaned.replace(/\s+>/g, ">").replace(/\s+\/>/g, "/>");

  return cleaned.trim() + "\n";
}

async function findFiles(dir, ext) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await findFiles(fullPath, ext)));
    } else if (entry.name.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function main() {
  console.log(`[Image Optimizer] Scanning ${publicDir} for SVG assets...`);
  const svgFiles = await findFiles(publicDir, ".svg");

  let totalOriginal = 0;
  let totalOptimized = 0;

  for (const filePath of svgFiles) {
    const relativePath = path.relative(publicDir, filePath);
    const originalContent = await fs.readFile(filePath, "utf-8");
    const originalSize = Buffer.byteLength(originalContent, "utf-8");

    const optimizedContent = compressSvg(originalContent);
    const optimizedSize = Buffer.byteLength(optimizedContent, "utf-8");

    totalOriginal += originalSize;
    totalOptimized += optimizedSize;

    const savedPercent = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1);
    console.log(
      `  ✓ ${relativePath}: ${originalSize}B -> ${optimizedSize}B (${savedPercent}% saved)`
    );

    await fs.writeFile(filePath, optimizedContent, "utf-8");
  }

  const overallSavedPercent = (
    ((totalOriginal - totalOptimized) / totalOriginal) *
    100
  ).toFixed(1);
  console.log(
    `[Image Optimizer] Complete. Total: ${totalOriginal}B -> ${totalOptimized}B (${overallSavedPercent}% total saved across ${svgFiles.length} files)`
  );
}

main().catch((err) => {
  console.error("[Image Optimizer] Error:", err);
  process.exit(1);
});
