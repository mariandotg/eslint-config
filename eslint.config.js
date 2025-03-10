const { createESLintConfig } = require("./index.js");

/**
 * Example usage of the ESLint configuration factory
 * This file demonstrates how to use the configuration in a project
 */
module.exports = createESLintConfig({
  // Enable features as needed
  react: true,
  node: true,
  typescript: true,
  typescriptStrict: true,  // Enable strict TypeScript rules
  standard: true,          // Enable StandardJS formatting
  
  // These are automatically included with react: true and node: true
  // but can be enabled separately if needed
  // security: true,
  // accessibility: true,
  
  performance: true,
  importSort: true,
  
  // Custom ignore list (extends the default list)
  ignoreFiles: ["node_modules", "dist", ".next", "build", "coverage", "**/*.generated.js"]
});
