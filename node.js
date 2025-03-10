const globals = require("globals");
const pluginSecurity = require("eslint-plugin-security");

/**
 * Node.js-specific ESLint configuration
 * Includes Node.js globals and security rules
 */
module.exports = [
  { languageOptions: { globals: { ...globals.node } } }, // Node.js globals
  pluginSecurity.configs.recommended // Security best practices
];
