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

// Build the workspace packages
console.log("Building workspace packages...");
try {
  execSync("npm run build:packages", { stdio: "inherit" });
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
    path.join(sharedTargetDir, "package.json"),
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
    path.join(uiTargetDir, "package.json"),
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
