import pluginReact from "eslint-plugin-react";
import pluginA11y from "eslint-plugin-jsx-a11y";
import globals from "globals";

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
  
  return flatConfig;
}

/**
 * React-specific ESLint configuration
 * Includes React best practices and accessibility rules
 */
export default [
  convertToFlatConfig(pluginReact.configs.flat.recommended), // React best practices
  convertToFlatConfig(pluginA11y.configs.recommended), // Enforce accessibility best practices
];
