
import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const SEARCH_DIRS = ["app", "components", "src", "data"];

const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".css",
  ".md",
  ".mdx",
]);

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function findCodeFiles(dir) {
  if (!(await exists(dir))) return [];

  const entries = await fs.readdir(dir, {
    withFileTypes: true,
  });

  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await findCodeFiles(fullPath)));
    } else if (
      CODE_EXTENSIONS.has(path.extname(entry.name))
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  let updatedFiles = 0;
  let updatedReferences = 0;

  for (const directory of SEARCH_DIRS) {
    const files = await findCodeFiles(
      path.join(ROOT, directory)
    );

    for (const file of files) {
      const original = await fs.readFile(file, "utf8");
      let replacements = 0;

      const updated = original.replace(
        /\/images\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g)/gi,
        (imagePath) => {
          const webpPath = imagePath.replace(
            /\.(png|jpe?g)$/i,
            ".webp"
          );

          const fullWebpPath = path.join(
            PUBLIC,
            webpPath.replace(/^\/+/, "")
          );

          // Only update if the WebP actually exists.
          if (!fsSyncExists(fullWebpPath)) {
            return imagePath;
          }

          replacements++;
          return webpPath;
        }
      );

      if (replacements > 0) {
        await fs.writeFile(file, updated, "utf8");

        updatedFiles++;
        updatedReferences += replacements;

        console.log(
          `Updated ${replacements} references: ` +
          path.relative(ROOT, file)
        );
      }
    }
  }

  console.log("\nMigration complete!");
  console.log(`Files updated: ${updatedFiles}`);
  console.log(
    `Image references updated: ${updatedReferences}`
  );
}

import fsSync from "node:fs";

function fsSyncExists(file) {
  return fsSync.existsSync(file);
}

main().catch(console.error);
