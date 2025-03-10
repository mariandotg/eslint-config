import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginSecurity from "eslint-plugin-security";
import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginSort from "eslint-plugin-simple-import-sort";
import standardConfig from "eslint-config-standard";
import reactConfig from "./react.js";
import nodeConfig from "./node.js";

/**
 * Default configuration options
 */
const DEFAULT_OPTIONS = {
  react: false,
  node: false,
  typescript: false,
  typescriptStrict: false,
  standard: false,
  security: false,
  accessibility: false,
  performance: false,
  importSort: false,
  ignoreFiles: ["node_modules", "dist", ".next", "build", "coverage"]
};

/**
 * Creates a customized ESLint configuration based on provided options
 * @param {Object} options - Configuration options
 * @param {boolean} [options.react=false] - Enable React-specific rules
 * @param {boolean} [options.node=false] - Enable Node.js-specific rules
 * @param {boolean} [options.typescript=false] - Enable TypeScript rules
 * @param {boolean} [options.typescriptStrict=false] - Enable TypeScript strict rules (requires typescript:true)
 * @param {boolean} [options.standard=false] - Enable StandardJS formatting rules
 * @param {boolean} [options.security=false] - Enable security rules
 * @param {boolean} [options.accessibility=false] - Enable accessibility rules
 * @param {boolean} [options.performance=false] - Enable performance rules
 * @param {boolean} [options.importSort=false] - Enable import sorting
 * @param {string[]} [options.ignoreFiles] - List of files/directories to ignore
 * @returns {import('eslint').Linter.FlatConfig[]} The ESLint configuration
 */
export function createESLintConfig(userOptions = {}) {
  // Merge user options with defaults
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  
  /** @type {import('eslint').Linter.FlatConfig[]} */
  const config = [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: { ...globals.browser } } },
    pluginJs.configs.recommended,
  ];

  // Add StandardJS formatting if enabled
  if (options.standard) {
    config.push(standardConfig);
  }

  // Add TypeScript rules if enabled
  if (options.typescript) {
    config.push(...tseslint.configs.recommended);
    
    // Add strict TypeScript rules if enabled
    if (options.typescriptStrict) {
      config.push(...tseslint.configs.strict);
    }
  }
  
  if (options.react) {
    config.push(...reactConfig);
  }
  
  if (options.node) {
    config.push(...nodeConfig);
  }
  
  if (options.security && !options.node) {
    // Add security plugin only if not already added via node config
    config.push(pluginSecurity.configs.recommended);
  }
  
  if (options.accessibility && !options.react) {
    // Add accessibility plugin only if not already added via react config
    config.push(pluginA11y.configs.recommended);
  }
  
  if (options.performance) {
    config.push({ plugins: { unicorn: pluginUnicorn } });
    config.push(pluginUnicorn.configs.recommended);
  }
  
  if (options.importSort) {
    config.push({ 
      plugins: { "simple-import-sort": pluginSort }, 
      rules: { "simple-import-sort/imports": "error" } 
    });
  }

  // Add ignore configuration
  if (options.ignoreFiles && options.ignoreFiles.length > 0) {
    config.push({ ignores: options.ignoreFiles });
  }

  return config;
}

// Default export for convenience
export default createESLintConfig;
