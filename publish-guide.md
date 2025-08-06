# NPM Publishing Quick Guide

## Prerequisites

1. **npm Account**: Create an account at https://www.npmjs.com/
2. **Authentication**: Login to npm:
   ```bash
   npm login
   ```
3. **Verify Login**: 
   ```bash
   npm whoami
   ```

## Publishing Steps

### 1. Pre-publish Checks

```bash
# Build the project
npm run build

# Run tests
npm test

# Check what will be published
npm pack --dry-run
```

### 2. Publishing Options

#### Option A: Automated Versioning (Recommended)

```bash
# For bug fixes (0.1.0 → 0.1.1)
npm run publish:patch

# For new features (0.1.0 → 0.2.0)
npm run publish:minor

# For breaking changes (0.1.0 → 1.0.0)
npm run publish:major
```

#### Option B: Manual Process

```bash
# Update version
npm version patch  # or minor/major

# Publish
npm publish
```

### 3. Verification

After publishing, verify the package:

```bash
# Install globally to test
npm install -g mcp-mqtt-plc-server

# Test the CLI
mcp-mqtt-plc --help

# Check on npm website
# https://www.npmjs.com/package/mcp-mqtt-plc-server
```

## Usage by End Users

Once published, users can install and use the package:

### Global Installation (for CLI usage)
```bash
npm install -g mcp-mqtt-plc-server
mcp-mqtt-plc
```

### Local Installation (as a dependency)
```bash
npm install mcp-mqtt-plc-server
node node_modules/.bin/mcp-mqtt-plc
```

### Direct Execution (no installation)
```bash
npx mcp-mqtt-plc-server
```

## Package Contents

The published package includes:
- ✅ `dist/` - Compiled JavaScript files
- ✅ `configs/` - Configuration templates
- ✅ `docs/` - User documentation
- ✅ `README.md` - Main documentation
- ✅ `LICENSE` - MIT license
- ✅ `install.js` - Post-install setup script

## Important Notes

1. **Pre-publish Hook**: The `prepublishOnly` script automatically builds and tests before publishing
2. **Post-install Hook**: The `postinstall` script sets up configuration files for users
3. **Files Exclusion**: `.npmignore` excludes source files, tests, and development files
4. **CLI Executable**: The `bin` field makes `mcp-mqtt-plc` available as a command

## Troubleshooting

- **Permission Denied**: Make sure you're logged in with `npm login`
- **Version Exists**: Increment version with `npm version patch/minor/major`
- **Large Package**: Check `.npmignore` and use `npm pack --dry-run` to verify contents
