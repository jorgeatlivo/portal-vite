/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

const localesDir = path.resolve(__dirname, "../src/i18n"); // Load from `src/i18n/`
const namespaces = {};

// Read all JSON files inside `src/i18n/`
fs.readdirSync(localesDir).forEach((entry) => {
  const entryPath = path.join(localesDir, entry);

  if (fs.statSync(entryPath).isDirectory()) {
    // If `entry` is a folder (e.g., `shift_claim_details`, `professionals`)
    fs.readdirSync(entryPath).forEach((file) => {
      if (!file.endsWith(".json")) return;

      const parts = file.split(".");
      let ns = "";
      let lng = "";

      if (parts.length === 2) {
        ns = entry;
        lng = parts[0];
      } else if (parts.length === 3) {
        const [subns, lang] = parts;
        ns = `${entry}/${subns}`;
        lng = lang;
      }

      const filePath = path.join(entryPath, file);
      processTranslationFile(ns, lng, filePath);
    });
  } else if (entry.endsWith(".json")) {
    // If `entry` is a file (e.g., `common.es.json`)
    const parts = entry.split(".");
    if (parts.length !== 3) return;

    const [ns, lng] = parts;
    if (!lng) return;

    const filePath = path.join(localesDir, entry);
    processTranslationFile(ns, lng, filePath);
  }
});

// Function to process a JSON translation file and extract all keys
function processTranslationFile(ns, lng, filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!namespaces[ns]) namespaces[ns] = new Set();

  const extractKeys = (obj, prefix = "") => {
    Object.keys(obj).forEach((key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object") {
        extractKeys(obj[key], newKey);
      } else {
        namespaces[ns].add(newKey);
      }
    });
  };

  extractKeys(content);
}

// Convert the Set into an object so that TypeScript can recognize the structure
const formattedNamespaces = Object.entries(namespaces).reduce(
  (acc, [ns, keys]) => {
    acc[ns] = Array.from(keys);
    return acc;
  },
  {}
);

// Generate TypeScript declaration file for i18next (kept original logic)
const dtsDefinitions = `
import "i18next";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: {
      ${Object.entries(formattedNamespaces)
        .map(
          ([ns, keys]) =>
            `"${ns}": {
              ${keys.map((key) => `"${key}": string;`).join("\n")}
            }`
        )
        .join(";\n  ")}
    };
  }
}
`;

const dtsPath = path.resolve(__dirname, "../src/@types");
const nsPath = path.resolve(__dirname, "../src/services/i18next");
const outputDtsFile = path.resolve(__dirname, "../src/@types/i18next.d.ts"); // Save the generated types to `@types`
const outputNsFile = path.resolve(
  __dirname,
  "../src/services/i18next/config.ts"
); // Save namespaces to `config`

if (!fs.existsSync(dtsPath)) {
  fs.mkdirSync(dtsPath, { recursive: true });
}

fs.writeFileSync(outputDtsFile, dtsDefinitions);
console.log(`✅ Generated i18next.d.ts from src/i18n/ into ${outputDtsFile}`);

// Extract only namespace keys for `i18n-namespace.ts`
const namespaceList = Object.keys(namespaces);

// Generate namespace config file
const namespaceDefinitions = `export const I18N_NAMESPACES = ${JSON.stringify(namespaceList, null, 2)} as const;
export type I18NNamespace = (typeof I18N_NAMESPACES)[number];
`;

if (!fs.existsSync(nsPath)) {
  fs.mkdirSync(nsPath, { recursive: true });
}
fs.writeFileSync(outputNsFile, namespaceDefinitions);
console.log(
  `✅ Generated i18n-namespace.ts from src/i18n/ into ${outputNsFile}`
);
