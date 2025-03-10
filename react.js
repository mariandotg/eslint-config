const pluginReact = require("eslint-plugin-react");
const pluginA11y = require("eslint-plugin-jsx-a11y");

/**
 * React-specific ESLint configuration
 * Includes React best practices and accessibility rules
 */
module.exports = [
  pluginReact.configs.flat.recommended, // React best practices
  pluginA11y.configs.recommended, // Enforce accessibility best practices
];
