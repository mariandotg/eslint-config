import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginSecurity from "eslint-plugin-security";
import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginSort from "eslint-plugin-simple-import-sort";
import standardConfig from "eslint-config-standard";
import pluginImport from "eslint-plugin-import";
import pluginN from "eslint-plugin-n";
import pluginPromise from "eslint-plugin-promise";
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
 * Map of plugin names to their actual plugin objects
 */
const PLUGIN_MAP = {
  'react': pluginReact,
  'jsx-a11y': pluginA11y,
  'security': pluginSecurity,
  'unicorn': pluginUnicorn,
  'simple-import-sort': pluginSort,
  'import': pluginImport,
  'n': pluginN,
  'promise': pluginPromise
};

/**
 * Helper function to convert legacy ESLint config format to flat config format
 * @param {Object} config - The config object to convert
 * @returns {Object} - The converted config object
 */
function convertToFlatConfig(config) {
  const flatConfig = { ...config };
  
  // Convert parserOptions to languageOptions.parserOptions
  if (flatConfig.parserOptions) {
    flatConfig.languageOptions = flatConfig.languageOptions || {};
    flatConfig.languageOptions.parserOptions = flatConfig.parserOptions;
    delete flatConfig.parserOptions;
  }
  
  // Convert parser to languageOptions.parser
  if (flatConfig.parser) {
    flatConfig.languageOptions = flatConfig.languageOptions || {};
    flatConfig.languageOptions.parser = flatConfig.parser;
    delete flatConfig.parser;
  }
  
  // Convert globals to languageOptions.globals
  if (flatConfig.globals) {
    flatConfig.languageOptions = flatConfig.languageOptions || {};
    flatConfig.languageOptions.globals = flatConfig.languageOptions.globals || {};
    
    // Merge globals
    Object.assign(flatConfig.languageOptions.globals, flatConfig.globals);
    
    delete flatConfig.globals;
  }
  
  // Convert env to languageOptions.globals
  if (flatConfig.env) {
    flatConfig.languageOptions = flatConfig.languageOptions || {};
    flatConfig.languageOptions.globals = flatConfig.languageOptions.globals || {};
    
    // Convert common environments
    if (flatConfig.env.browser) {
      Object.assign(flatConfig.languageOptions.globals, globals.browser);
    }
    if (flatConfig.env.node) {
      Object.assign(flatConfig.languageOptions.globals, globals.node);
    }
    if (flatConfig.env.es6 || flatConfig.env.es2015) {
      Object.assign(flatConfig.languageOptions.globals, globals.es2015);
    }
    
    delete flatConfig.env;
  }
  
  // Convert plugins array to plugins object
  if (Array.isArray(flatConfig.plugins)) {
    const pluginsObject = {};
    
    flatConfig.plugins.forEach(pluginName => {
      // Handle prefixed plugins (eslint-plugin-*)
      const shortName = pluginName.replace(/^eslint-plugin-/, '');
      
      if (PLUGIN_MAP[shortName]) {
        pluginsObject[shortName] = PLUGIN_MAP[shortName];
      } else {
        console.warn(`Plugin ${pluginName} not found in plugin map. You may need to add it to the PLUGIN_MAP.`);
      }
    });
    
    flatConfig.plugins = pluginsObject;
  }
  
  return flatConfig;
}

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
    // Convert standard config to flat config format if needed
    const flatStandardConfig = convertToFlatConfig(standardConfig);
    config.push(flatStandardConfig);
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
    const flatSecurityConfig = convertToFlatConfig(pluginSecurity.configs.recommended);
    config.push(flatSecurityConfig);
  }
  
  if (options.accessibility && !options.react) {
    // Add accessibility plugin only if not already added via react config
    const flatA11yConfig = convertToFlatConfig(pluginA11y.configs.recommended);
    config.push(flatA11yConfig);
  }
  
  if (options.performance) {
    // Get the unicorn recommended config and convert it
    const flatUnicornConfig = convertToFlatConfig(pluginUnicorn.configs.recommended);
    
    // Add the plugin reference only if it doesn't already have one
    if (!flatUnicornConfig.plugins || !flatUnicornConfig.plugins.unicorn) {
      flatUnicornConfig.plugins = flatUnicornConfig.plugins || {};
      flatUnicornConfig.plugins.unicorn = pluginUnicorn;
    }
    
    config.push(flatUnicornConfig);
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
