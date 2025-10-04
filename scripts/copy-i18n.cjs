/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

// Define source and destination folders
const srcDir = path.resolve(__dirname, "../src/i18n");
const destDir = path.resolve(__dirname, "../public/locales");

// Function to copy JSON files recursively
const copyFiles = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((file) => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.lstatSync(srcPath).isDirectory()) {
      copyFiles(srcPath, destPath); // Recursive for subdirectories
    } else if (path.extname(file) === ".json") {
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ Copied: ${srcPath} → ${destPath}`);
    }
  });
};

// clean locale folder
console.log("🧹 Cleaning public/locales folder...");
try {
  if (fs.existsSync(destDir)) {
    fs.rmdirSync(destDir, { recursive: true });
  }
} catch (error) {
  console.error("Error cleaning public/locales folder", error);
}

// Run copy process
console.log("🚀 Copying i18n JSON files to public/locales...");
copyFiles(srcDir, destDir);
console.log("✅ Copy completed!");
