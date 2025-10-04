const fs = require("fs");
const path = require("path");

const COMPONENTS_DIR = path.join(__dirname, "../src/components");
const PROJECT_DIR = path.join(__dirname, "../src");

// Recursively get all component files from components directory
function getComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getComponentFiles(fullPath, fileList); // Recursive call
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// Recursively get all project files
function getAllProjectFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllProjectFiles(fullPath, fileList);
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      fileList.push(fullPath);
    }
  });
  return fileList;
}

// Extract component names from file content
function extractComponentNames(filePath, content) {
  const names = new Set();
  const fileName = path.basename(filePath, path.extname(filePath));

  // Add filename-based component name as fallback
  names.add(fileName);

  // Extract named exports (export const Component = ... or export const Component: Type = ...)
  const namedExportRegex = /export\s+const\s+([A-Z][a-zA-Z0-9_]*)\s*(?::[^=]*)?\s*=/g;
  let match;
  while ((match = namedExportRegex.exec(content)) !== null) {
    names.add(match[1]);
  }

  // Extract default exports (export default Component)
  const defaultExportRegex = /export\s+default\s+(?:function\s+)?([A-Z][a-zA-Z0-9_]*)/g;
  while ((match = defaultExportRegex.exec(content)) !== null) {
    names.add(match[1]);
  }

  // Extract function components with TypeScript annotations
  const functionComponentRegex = /(?:function\s+|const\s+)([A-Z][a-zA-Z0-9_]*)\s*(?::[^=]*?)?\s*(?:=\s*(?:\([^)]*\)|[a-zA-Z0-9_]+)\s*=>|\([^)]*\)\s*{)/g;
  while ((match = functionComponentRegex.exec(content)) !== null) {
    names.add(match[1]);
  }

  // Extract class components
  const classComponentRegex = /class\s+([A-Z][a-zA-Z0-9_]*)\s+extends\s+/g;
  while ((match = classComponentRegex.exec(content)) !== null) {
    names.add(match[1]);
  }

  return Array.from(names);
}

// Check if a component is used
function isComponentUsed(componentPath, projectFilesContent) {
  const componentContent = projectFilesContent[componentPath];
  const componentNames = extractComponentNames(componentPath, componentContent);

  // Skip the component's own file
  return Object.entries(projectFilesContent).some(([file, content]) => {
    if (file === componentPath) return false;

    // Check for any of the possible component names
    return componentNames.some(componentName => {
      // Check for imports (both default and named imports)
      const importRegex = new RegExp(`import\\s+(?:{[^}]*\\b${componentName}\\b[^}]*}|\\b${componentName}\\b)\\s+from\\s+['"\`]`, 'g');
      if (importRegex.test(content)) return true;

      // Check for JSX usage (<Component> or <Component />)
      const jsxRegex = new RegExp(`<\\s*${componentName}[\\s/>]`, 'g');
      if (jsxRegex.test(content)) return true;

      // Check for React.createElement usage
      const createElementRegex = new RegExp(`React\\.createElement\\(\\s*(?:['"\`]${componentName}['"\`]|\\b${componentName}\\b)`, 'g');
      if (createElementRegex.test(content)) return true;

      // Check for aliased imports (import { ComponentX as ComponentName })
      const aliasImportRegex = new RegExp(`import\\s+{[^}]*\\b\\w+\\s+as\\s+${componentName}\\b[^}]*}\\s+from\\s+['"\`]`, 'g');
      if (aliasImportRegex.test(content)) return true;

      return false;
    });
  });
}

// Find components with duplicate names
function findDuplicateComponents(components) {
  const componentNameMap = new Map();

  components.forEach(componentPath => {
    const componentName = path.basename(componentPath, path.extname(componentPath));
    if (!componentNameMap.has(componentName)) {
      componentNameMap.set(componentName, []);
    }
    componentNameMap.get(componentName).push(componentPath);
  });

  const duplicates = Array.from(componentNameMap.entries())
    .filter(([_, paths]) => paths.length > 1)
    .map(([name, paths]) => ({
      name,
      paths: paths.map(p => path.relative(COMPONENTS_DIR, p))
    }));

  return duplicates;
}

function findUnusedComponents() {
  const components = getComponentFiles(COMPONENTS_DIR);
  console.log("🚀 ~ findUnusedComponents ~ components:", components);

  // Find and report duplicate components
  const duplicateComponents = findDuplicateComponents(components);
  if (duplicateComponents.length) {
    console.log("Components with duplicate names:");
    duplicateComponents.forEach(dup => {
      console.log(`  - ${dup.name}: Found in ${dup.paths.length} files`);
      dup.paths.forEach(p => console.log(`    * ${p}`));
    });
    console.log("\nWarning: Components with the same name may cause false negatives in usage detection.\n");
  }

  const projectFiles = getAllProjectFiles(PROJECT_DIR);

  // Pre-load all file contents to avoid multiple reads
  const projectFilesContent = {};
  projectFiles.forEach(file => {
    projectFilesContent[file] = fs.readFileSync(file, "utf8");
  });

  const unusedComponents = components.filter(component => {
    return !isComponentUsed(component, projectFilesContent);
  });

  console.log(
    "Unused Components:",
    unusedComponents.length
      ? unusedComponents.map((file) => path.relative(COMPONENTS_DIR, file))
      : "None"
  );
}

findUnusedComponents();
