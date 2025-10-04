/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

/**
 * Source directory where i18n JSON files are stored
 */
const SOURCE_DIR = path.resolve(__dirname, "../src/i18n");

/**
 * Destination directory where processed files will be saved
 */
const DEST_DIR = path.resolve(__dirname, "../.lokalise");

/**
 * Convert file path to a flat filename with underscores
 * Example: "professionals/favorite.json" → "professionals_favorite.json"
 */
function convertToFlatFilename(filePath) {
  return filePath.replace(/\//g, "__");
}

/**
 * Convert file path to a flat filename with underscores (excluding language extension)
 * Supports:
 * - "professionals/favorite.en.json" -> "professionals_favorite.json"
 * - "professionals/favorite.en-US.json" -> "professionals_favorite.json"
 */
function getNamespace(filePath) {
  return filePath.replace(/\.[a-z]{2}(-[A-Z]{2})?\.json$/, ""); // Remove language extensions like ".en" or ".en-US"
}

/**
 * Prefix JSON keys with namespace (excluding language extension)
 * Example:
 * - Original JSON: { "no_internet_title": "Connection Error" }
 * - Transformed: { "no-internet__no_internet_title": "Connection Error" }
 */
function transformJsonKeys(jsonObject, namespace) {
  const transformed = {};
  Object.keys(jsonObject).forEach((key) => {
    transformed[`${namespace}__${key}`] = jsonObject[key];
  });
  return transformed;
}

/**
 * Recursively scan `src/i18n/`, process filenames, update JSON keys, and copy to `.lokalise/`
 */
function copyI18nFilesToLokalise(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const relativePath = path.relative(SOURCE_DIR, srcPath);

    if (entry.isDirectory()) {
      copyI18nFilesToLokalise(srcPath, destDir);
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      // Convert the relative path into a flat filename with underscores
      const flatFilename = convertToFlatFilename(relativePath);
      const destPath = path.join(destDir, flatFilename);
      // Read original JSON
      const jsonData = JSON.parse(fs.readFileSync(srcPath, "utf-8"));

      // Transform JSON keys with namespace prefix (without lang code)
      const namespace = getNamespace(relativePath);
      const transformedData = transformJsonKeys(jsonData, namespace);

      // Write transformed JSON to destination
      fs.writeFileSync(
        destPath,
        JSON.stringify(transformedData, null, 2),
        "utf-8"
      );

      console.log(`✅ Processed & Copied: ${relativePath}.json -> ${destPath}`);
    }
  }
}

// Run the copy process
copyI18nFilesToLokalise(SOURCE_DIR, DEST_DIR);

console.log(`🎉 All i18n files copied successfully to ${DEST_DIR}`);
