
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = path.join(process.cwd(), "public", "images");

const QUALITY = 82;
const MIN_SAVINGS = 0.15;

async function findImages(directory) {
  const entries = await fs.readdir(directory, {
    withFileTypes: true,
  });

  const images = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      images.push(...(await findImages(fullPath)));
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      images.push(fullPath);
    }
  }

  return images;
}

function formatMB(bytes) {
  return (bytes / 1024 / 1024).toFixed(2);
}

async function optimize() {
  const images = await findImages(ROOT);

  let originalTotal = 0;
  let optimizedTotal = 0;
  let converted = 0;

  for (const file of images) {
    const original = await fs.readFile(file);
    originalTotal += original.length;

    const outputPath = file.replace(
      /\.(png|jpe?g)$/i,
      ".webp"
    );

    // Avoid replacing existing WebP files.
    try {
      await fs.access(outputPath);
      console.log(`SKIP (exists): ${outputPath}`);
      optimizedTotal += original.length;
      continue;
    } catch {
      // No existing WebP file.
    }

    const optimized = await sharp(original)
      .webp({
        quality: QUALITY,
        effort: 6,
      })
      .toBuffer();

    const savings =
      1 - optimized.length / original.length;

    if (savings < MIN_SAVINGS) {
      optimizedTotal += original.length;
      console.log(`SKIP: ${path.basename(file)}`);
      continue;
    }

    await fs.writeFile(outputPath, optimized);

    optimizedTotal += optimized.length;
    converted++;

    console.log(
      `${path.basename(file)}: ` +
      `${formatMB(original.length)} MB → ` +
      `${formatMB(optimized.length)} MB ` +
      `(${Math.round(savings * 100)}% smaller)`
    );
  }

  console.log("\nOptimization complete!");
  console.log(`Images converted: ${converted}`);
  console.log(
    `Original size: ${formatMB(originalTotal)} MB`
  );
  console.log(
    `Optimized size: ${formatMB(optimizedTotal)} MB`
  );
  console.log(
    `Potential savings: ${
      formatMB(originalTotal - optimizedTotal)
    } MB`
  );

  console.log(
    "\nOriginal images have NOT been deleted."
  );
}

optimize().catch(console.error);
