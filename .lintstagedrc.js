module.exports = {
  // Run TypeScript type checking on all TypeScript files
  "**/*.ts?(x)": () => "npm run type-check",

  // Run ESLint on JavaScript and TypeScript files
  // Use eslint directly instead of through turbo to handle file paths
  "**/*.{js,jsx,ts,tsx}": ["eslint --fix"],

  // Run Prettier on all supported files
  "**/*.{js,jsx,ts,tsx,json,md,css,scss}": ["prettier --write"],
};
