import globals from "globals";

/**
 * Helper function to convert legacy ESLint config format to flat config format
 * @param {Object} config - The config object to convert
 * @returns {Object} - The converted config object
 */
export function convertToFlatConfig(config, plugins) {
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
        
        if (plugins[shortName]) {
          pluginsObject[shortName] = plugins[shortName];
        } else {
          console.warn(`Plugin ${pluginName} not found in plugin map. You may need to add it to the PLUGIN_MAP.`);
        }
      });
      
      flatConfig.plugins = pluginsObject;
    }
    
    return flatConfig;
  }