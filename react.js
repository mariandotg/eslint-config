import pluginImport from "eslint-plugin-import";
import pluginA11y from "eslint-plugin-jsx-a11y";
import pluginReact from "eslint-plugin-react";
import { convertToFlatConfig } from "./utils";

/**
 * Map of plugin names to their actual plugin objects
 */
const PLUGIN_MAP = {
  'react': pluginReact,
  'jsx-a11y': pluginA11y,
  'import': pluginImport
};

/**
 * React-specific ESLint configuration
 * Includes React best practices and accessibility rules
 */
export default [
  // React settings configuration
  {
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  convertToFlatConfig(pluginReact.configs.flat.recommended, PLUGIN_MAP), // React best practices
  convertToFlatConfig(pluginA11y.configs.recommended, PLUGIN_MAP), // Enforce accessibility best practices
];
