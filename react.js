import pluginReact from "eslint-plugin-react";
import pluginA11y from "eslint-plugin-jsx-a11y";

/**
 * React-specific ESLint configuration
 * Includes React best practices and accessibility rules
 */
export default [
  pluginReact.configs.flat.recommended, // React best practices
  pluginA11y.configs.recommended, // Enforce accessibility best practices
];
