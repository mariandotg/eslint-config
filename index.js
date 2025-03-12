import { FlatCompat } from "@eslint/eslintrc";
import pluginJs from "@eslint/js";
import globals from "globals";
import path from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

// Setup for FlatCompat
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  ignoreFiles: ["node_modules", "dist", ".next", "build", "coverage"],
  customPlugins: [],       // For adding custom plugins
  customExtends: [],       // For extending configs
  customConfigs: [],       // For adding custom flat configurations
  customRules: {}          // For adding specific rules
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
 * @param {string[]} [options.customPlugins] - Custom plugins to include
 * @param {string[]} [options.customExtends] - Custom configs to extend
 * @param {Object[]} [options.customConfigs] - Custom flat configurations to include
 * @param {Object} [options.customRules] - Custom ESLint rules to include
 * @param {string} [options.configDir] - Directory to use as base for resolving configs (defaults to process.cwd())
 * @returns {import('eslint').Linter.FlatConfig[]} The ESLint configuration
 */
export function createESLintConfig(userOptions = {}) {
  // Merge user options with defaults
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  
  // Create FlatCompat instance with the appropriate base directory
  const baseDirectory = options.configDir || process.cwd();
  const compat = new FlatCompat({
    baseDirectory,
    recommendedConfig: pluginJs.configs.recommended
  });
  
  /** @type {import('eslint').Linter.FlatConfig[]} */
  const config = [
    { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
    { languageOptions: { globals: { ...globals.browser } } },
    pluginJs.configs.recommended,
  ];

  // Add StandardJS formatting if enabled
  if (options.standard) {
    config.push(...compat.extends("standard"));
  }

  // Add TypeScript rules if enabled
  if (options.typescript) {
    config.push(...tseslint.configs.recommended);
    
    // Add strict TypeScript rules if enabled
    if (options.typescriptStrict) {
      config.push(...tseslint.configs.strict);
    }
  }
  
  // Add React rules if enabled
  if (options.react) {
    config.push(...compat.extends("plugin:react/recommended"));
    config.push(...compat.extends("plugin:react-hooks/recommended"));
    
    if (options.accessibility) {
      config.push(...compat.extends("plugin:jsx-a11y/recommended"));
    }
  } else if (options.accessibility) {
    // Add accessibility rules without React if specified
    config.push(...compat.extends("plugin:jsx-a11y/recommended"));
  }
  
  // Add Node.js rules if enabled
  if (options.node) {
    config.push(...compat.extends("plugin:n/recommended"));
  }
  
  // Add security rules if enabled
  if (options.security) {
    config.push(...compat.extends("plugin:security/recommended"));
  }
  
  // Add performance rules if enabled
  if (options.performance) {
    config.push(...compat.extends("plugin:unicorn/recommended"));
  }
  
  // Add import sorting if enabled
  if (options.importSort) {
    config.push(...compat.plugins("simple-import-sort"));
    config.push({
      rules: {
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error"
      }
    });
  }

  // Add custom plugins
  if (options.customPlugins && options.customPlugins.length > 0) {
    config.push(...compat.plugins(...options.customPlugins));
  }

  // Add custom extends
  if (options.customExtends && options.customExtends.length > 0) {
    for (const extendConfig of options.customExtends) {
      config.push(...compat.extends(extendConfig));
    }
  }

  // Add custom flat configurations
  if (options.customConfigs && options.customConfigs.length > 0) {
    config.push(...options.customConfigs);
  }

  // Add custom rules
  if (options.customRules && Object.keys(options.customRules).length > 0) {
    config.push({
      rules: options.customRules
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