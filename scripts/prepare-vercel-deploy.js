#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

console.log("Preparing web app for Vercel deployment...");

// Ensure we're in the root of the monorepo
const rootDir = process.cwd();
const webAppDir = path.join(rootDir, "apps", "web");
const packagesDir = path.join(rootDir, "packages");

// Check if we're in the right place
if (!fs.existsSync(webAppDir) || !fs.existsSync(packagesDir)) {
  console.error("Error: This script must be run from the root of the monorepo");
  process.exit(1);
}

// Create simple build files for packages
console.log("Creating simple build files for packages...");

// Create simple tsup config for shared package
if (fs.existsSync(path.join(packagesDir, "shared"))) {
  const sharedTsupConfig = `
const { defineConfig } = require('tsup');

module.exports = defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [],
});
`;
  fs.writeFileSync(
    path.join(packagesDir, "shared", "tsup.config.js"),
    sharedTsupConfig
  );
}

// Create simple tsup config for UI package
if (fs.existsSync(path.join(packagesDir, "ui"))) {
  const uiTsupConfig = `
const { defineConfig } = require('tsup');

module.exports = defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'antd'],
  outExtension: ({ format }) => ({
    js: \`.\${format}.js\`,
  }),
});
`;
  fs.writeFileSync(
    path.join(packagesDir, "ui", "tsup.config.js"),
    uiTsupConfig
  );
}

// Install dependencies for shared packages first
console.log("Installing dependencies for workspace packages...");
try {
  // Install dependencies for shared package
  if (fs.existsSync(path.join(packagesDir, "shared"))) {
    console.log("Installing dependencies for shared package...");
    execSync("cd packages/shared && npm install typescript tsup --no-save", {
      stdio: "inherit",
    });
  }

  // Install dependencies for UI package
  if (fs.existsSync(path.join(packagesDir, "ui"))) {
    console.log("Installing dependencies for UI package...");
    execSync("cd packages/ui && npm install typescript tsup --no-save", {
      stdio: "inherit",
    });
  }

  // Install dependencies for database package
  if (fs.existsSync(path.join(packagesDir, "database"))) {
    console.log("Installing dependencies for database package...");
    execSync("cd packages/database && npm install typescript --no-save", {
      stdio: "inherit",
    });
  }
} catch (error) {
  console.error("Error installing dependencies for workspace packages:", error);
  process.exit(1);
}

// Build the workspace packages individually instead of using turbo
console.log("Building workspace packages...");
try {
  // Build shared package
  if (fs.existsSync(path.join(packagesDir, "shared"))) {
    console.log("Building shared package...");
    execSync("cd packages/shared && npx tsup --config tsup.config.js", {
      stdio: "inherit",
    });
  }

  // Build UI package
  if (fs.existsSync(path.join(packagesDir, "ui"))) {
    console.log("Building UI package...");
    execSync("cd packages/ui && npx tsup --config tsup.config.js", {
      stdio: "inherit",
    });
  }

  // Build database package if it has a build script
  if (fs.existsSync(path.join(packagesDir, "database", "package.json"))) {
    const dbPackageJson = require(
      path.join(packagesDir, "database", "package.json")
    );
    if (dbPackageJson.scripts && dbPackageJson.scripts.build) {
      console.log("Building database package...");
      execSync("cd packages/database && npm run build", { stdio: "inherit" });
    }
  }
} catch (error) {
  console.error("Error building workspace packages:", error);
  process.exit(1);
}

// Create the target directory for workspace packages
const targetDir = path.join(webAppDir, "node_modules", "@supply-chain-system");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy the shared package
console.log("Copying shared package...");
const sharedDir = path.join(packagesDir, "shared");
const sharedTargetDir = path.join(targetDir, "shared");
if (fs.existsSync(sharedDir)) {
  if (fs.existsSync(sharedTargetDir)) {
    fs.rmSync(sharedTargetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(sharedTargetDir, { recursive: true });

  // Copy the package.json
  fs.copyFileSync(
    path.join(sharedDir, "package.json"),
    path.join(sharedTargetDir, "package.json")
  );

  // Copy the dist directory
  const distDir = path.join(sharedDir, "dist");
  const distTargetDir = path.join(sharedTargetDir, "dist");
  if (fs.existsSync(distDir)) {
    fs.cpSync(distDir, distTargetDir, { recursive: true });
  } else {
    console.warn("Warning: dist directory not found in shared package");
  }
}

// Copy the UI package
console.log("Copying UI package...");
const uiDir = path.join(packagesDir, "ui");
const uiTargetDir = path.join(targetDir, "ui");
if (fs.existsSync(uiDir)) {
  if (fs.existsSync(uiTargetDir)) {
    fs.rmSync(uiTargetDir, { recursive: true, force: true });
  }
  fs.mkdirSync(uiTargetDir, { recursive: true });

  // Copy the package.json
  fs.copyFileSync(
    path.join(uiDir, "package.json"),
    path.join(uiTargetDir, "package.json")
  );

  // Copy the dist directory
  const distDir = path.join(uiDir, "dist");
  const distTargetDir = path.join(uiTargetDir, "dist");
  if (fs.existsSync(distDir)) {
    fs.cpSync(distDir, distTargetDir, { recursive: true });
  } else {
    console.warn("Warning: dist directory not found in UI package");
  }
}

// Copy the database package if it exists
console.log("Copying database package...");
const dbDir = path.join(packagesDir, "database");
const dbTargetDir = path.join(targetDir, "database");
if (fs.existsSync(dbDir)) {
  if (fs.existsSync(dbTargetDir)) {
    fs.rmSync(dbTargetDir, { recursive: true, force: true });
  }
  fs.cpSync(dbDir, dbTargetDir, { recursive: true });
}

console.log("Web app prepared for Vercel deployment!");
