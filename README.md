# Modular ESLint Configuration

A modular ESLint configuration package that can be customized for different project types. Compatible with ESLint v9's flat config system.

## Installation

```bash
npm install --save-dev @mariandotg/eslint-config
```

Or with yarn:

```bash
yarn add --dev @mariandotg/eslint-config
```

Or with pnpm:

```bash
pnpm add --save-dev @mariandotg/eslint-config
```

## Usage

### Basic Usage

Create an `eslint.config.js` file in your project root:

```javascript
import { createESLintConfig } from "@mariandotg/eslint-config";

// Use with default options
export default createESLintConfig();

// Or customize as needed
export default createESLintConfig({
  // Enable only what you need
  react: true,
  typescript: true,
});
```

### Available Options

| Option | Default | Description |
|--------|---------|-------------|
| `react` | `false` | Enables React-specific rules and JSX accessibility rules |
| `node` | `false` | Enables Node.js-specific rules and security rules |
| `typescript` | `false` | Enables TypeScript rules |
| `typescriptStrict` | `false` | Enables TypeScript strict rules (requires `typescript: true`) |
| `standard` | `false` | Enables StandardJS formatting rules |
| `security` | `false` | Enables security rules (automatically included with `node: true`) |
| `accessibility` | `false` | Enables accessibility rules (automatically included with `react: true`) |
| `performance` | `false` | Enables performance-related rules |
| `importSort` | `false` | Enables automatic import sorting |
| `ignoreFiles` | `["node_modules", "dist", ".next", "build", "coverage"]` | List of files/directories to ignore |

### Customizing Ignored Files

You can customize the list of ignored files:

```javascript
import { createESLintConfig } from "@mariandotg/eslint-config";

export default createESLintConfig({
  // Your other options...
  
  // Custom ignore list (replaces the default list)
  ignoreFiles: ["node_modules", "dist", "custom-dir", "*.generated.js"]
});
```

### Using Specific Configurations

You can also import specific configurations directly:

```javascript
// For React projects
import reactConfig from "@mariandotg/eslint-config/react";

// For Node.js projects
import nodeConfig from "@mariandotg/eslint-config/node";
```

## Examples

### React + TypeScript Project

```javascript
import { createESLintConfig } from "@mariandotg/eslint-config";

export default createESLintConfig({
  react: true,
  typescript: true,
  typescriptStrict: true,
  performance: true,
  importSort: true
});
```

### Node.js API Project with StandardJS

```javascript
import { createESLintConfig } from "@mariandotg/eslint-config";

export default createESLintConfig({
  node: true,
  typescript: true,
  standard: true,
  ignoreFiles: ["node_modules", "dist", "logs"]
});
```

## ESLint v9 Compatibility

This package is fully compatible with ESLint v9's flat config system. It automatically converts any legacy configuration formats from plugins to the new flat config format, handling:

- Converting `parserOptions` to `languageOptions.parserOptions`
- Converting `parser` to `languageOptions.parser`
- Converting `env` settings to appropriate `languageOptions.globals`
- Converting `plugins` arrays to the required object format with actual plugin instances

This ensures you can use this configuration with ESLint v9 without any compatibility issues, even when using plugins that haven't been updated to the flat config format yet.

## License

MIT 