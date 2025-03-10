import globals from "globals";
import pluginSecurity from "eslint-plugin-security";

/**
 * Node.js-specific ESLint configuration
 * Includes Node.js globals and security rules
 */
export default [
  { languageOptions: { globals: { ...globals.node } } }, // Node.js globals
  pluginSecurity.configs.recommended // Security best practices
];
