module.exports = {
  // Run TypeScript type checking on all TypeScript files
  '**/*.ts?(x)': () => 'npm run type-check',
  
  // Run ESLint on all JavaScript and TypeScript files
  '**/*.{js,jsx,ts,tsx}': ['npm run lint:fix'],
  
  // Run Prettier on all supported files
  '**/*.{js,jsx,ts,tsx,json,md,css,scss}': ['npm run format'],
}; 