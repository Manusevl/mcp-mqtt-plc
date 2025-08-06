# Distribution Guide for MCP MQTT PLC Server

This guide explains how to package, publish, and distribute the MCP MQTT PLC Server npm package.

## Overview

The MCP MQTT PLC Server is distributed as an npm package that can be installed globally or locally. The package includes:

- Compiled JavaScript files in the `dist/` directory
- Configuration templates in the `configs/` directory
- Documentation in the `docs/` directory
- CLI executable for easy startup

## Package Structure

When published, the npm package contains:

```
mcp-mqtt-plc-server/
├── dist/                  # Compiled JavaScript (from TypeScript src/)
│   ├── server.js         # Main server entry point
│   ├── mqtt/            # MQTT client modules
│   └── types/           # Type definitions (compiled)
├── configs/             # Configuration templates
│   ├── .env.example    # Environment template
│   └── claude-desktop-config.json
├── docs/               # User documentation
├── package.json       # Package metadata
├── README.md          # Installation and usage guide
└── LICENSE            # MIT license
```

## Pre-Publishing Checklist

Before publishing to npm, ensure:

1. **Build is successful:**
   ```bash
   npm run build
   ```

2. **Tests pass:**
   ```bash
   npm test
   ```

3. **Version is updated:**
   ```bash
   npm version patch|minor|major
   ```

4. **Package contents are correct:**
   ```bash
   npm pack --dry-run
   ```

## Publishing Process

### 1. Automated Publishing (Recommended)

Use the provided npm scripts for version management and publishing:

```bash
# For bug fixes (0.1.0 → 0.1.1)
npm run publish:patch

# For new features (0.1.0 → 0.2.0)
npm run publish:minor

# For breaking changes (0.1.0 → 1.0.0)
npm run publish:major
```

These scripts automatically:
- Build the project
- Run tests
- Update the version number
- Publish to npm

### 2. Manual Publishing

For more control over the process:

```bash
# 1. Build the project
npm run build

# 2. Run tests
npm test

# 3. Update version
npm version patch  # or minor/major

# 4. Create a test package (optional)
npm pack

# 5. Publish to npm
npm publish
```

### 3. Publishing to a Private Registry

To publish to a private npm registry:

```bash
# Set registry URL
npm config set registry https://your-private-registry.com

# Publish
npm publish

# Reset to public registry
npm config set registry https://registry.npmjs.org
```

## Installation Methods

Once published, users can install the package in several ways:

### Global Installation (Recommended for CLI usage)

```bash
npm install -g mcp-mqtt-plc-server
```

This makes the `mcp-mqtt-plc` command available system-wide.

### Local Installation

```bash
npm install mcp-mqtt-plc-server
```

For use as a dependency in another Node.js project.

### npx Usage (No installation required)

```bash
npx mcp-mqtt-plc-server
```

Runs the server directly without installing it globally.

## Usage After Installation

### Global Installation Usage

```bash
# Start the server
mcp-mqtt-plc

# Or with explicit node
node $(npm root -g)/mcp-mqtt-plc-server/dist/server.js
```

### Local Installation Usage

```bash
# Via npm scripts
npm start

# Or directly
node ./node_modules/mcp-mqtt-plc-server/dist/server.js
```

## Version Management

The package follows semantic versioning (semver):

- **Patch** (0.1.0 → 0.1.1): Bug fixes, no breaking changes
- **Minor** (0.1.0 → 0.2.0): New features, backwards compatible
- **Major** (0.1.0 → 1.0.0): Breaking changes

## Distribution Channels

### 1. NPM Registry (Primary)

- **Public NPM:** https://www.npmjs.com/package/mcp-mqtt-plc-server
- **Installation:** `npm install mcp-mqtt-plc-server`

### 2. GitHub Packages (Alternative)

```bash
# Configure npm for GitHub Packages
npm config set @your-username:registry https://npm.pkg.github.com

# Install from GitHub Packages
npm install @your-username/mcp-mqtt-plc-server
```

### 3. Tarball Distribution

For offline or restricted environments:

```bash
# Create tarball
npm pack

# This creates: mcp-mqtt-plc-server-0.1.0.tgz
# Users can install with: npm install ./mcp-mqtt-plc-server-0.1.0.tgz
```

## Package Maintenance

### Updating Dependencies

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Update and test
npm run build && npm test
```

### Security Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Manual fixes
npm audit fix --force
```

## Troubleshooting Distribution Issues

### Common Publishing Problems

1. **Authentication Error:**
   ```bash
   npm login
   npm whoami  # Verify login
   ```

2. **Version Already Exists:**
   ```bash
   npm version patch  # Increment version
   npm publish
   ```

3. **Package Too Large:**
   - Check `.npmignore` file
   - Use `npm pack --dry-run` to see included files
   - Exclude unnecessary files

4. **Permission Denied:**
   ```bash
   # Check package ownership
   npm owner ls mcp-mqtt-plc-server
   
   # Add owner if needed
   npm owner add username mcp-mqtt-plc-server
   ```

### Installation Issues

1. **Global Installation Permission:**
   ```bash
   # Use npm's built-in solution
   npm config set prefix '~/.npm-global'
   
   # Add to PATH in ~/.profile or ~/.bashrc
   export PATH=~/.npm-global/bin:$PATH
   ```

2. **Node Version Compatibility:**
   - Ensure Node.js >= 18.0.0
   - Check with: `node --version`

## Best Practices

1. **Always test before publishing:**
   ```bash
   npm pack
   cd /tmp
   npm install /path/to/your/package.tgz
   ```

2. **Use npm scripts for consistency:**
   - `npm run publish:patch` for routine updates
   - `npm run pack` to test package contents

3. **Keep documentation updated:**
   - Update README.md with any breaking changes
   - Update version in documentation examples

4. **Monitor package health:**
   - Check download statistics
   - Monitor issue reports
   - Keep dependencies updated

## Support and Maintenance

For questions about distribution or installation:

1. **Documentation:** Check the `/docs` directory
2. **Issues:** https://github.com/Manusevl/mcp-mqtt-plc/issues
3. **npm Package:** https://www.npmjs.com/package/mcp-mqtt-plc-server

Remember to keep this guide updated as the distribution process evolves!
