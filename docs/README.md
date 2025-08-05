# Documentation Index

This directory contains all documentation for the MCP MQTT PLC Server project.

## 📚 Available Documentation

### [📋 Testing Guide](TESTING_GUIDE.md)
Comprehensive guide on how to test the MCP server with different clients and scenarios.

### [🚀 Ready to Test](READY_TO_TEST.md)  
Quick start guide showing the server is ready and how to connect from various clients.

## 📖 Additional Resources

### Project Structure
```
├── src/                    # Source code
│   ├── server.ts          # Main MCP server
│   ├── mqtt/              # MQTT client implementation
│   └── types/             # Type definitions
├── tests/                 # Test files and utilities
│   ├── test-mqtt.js       # MQTT connection test
│   ├── complete-test.js   # Full MCP server test suite
│   ├── mock-plc.js        # Mock PLC simulator
│   └── ...                # Other test files
├── docs/                  # Documentation (this directory)
├── configs/               # Configuration files
│   ├── .env.example       # Environment template
│   ├── .env.test          # Test environment config
│   └── claude-desktop-config.json  # Claude Desktop integration
├── scripts/               # Utility scripts
│   ├── setup.js           # Project setup script
│   └── dev.js             # Development helper
└── dist/                  # Built JavaScript files
```

### Quick Commands
- `npm run setup` - Initialize project configuration
- `npm run build` - Build TypeScript to JavaScript
- `npm run test` - Run complete test suite
- `npm run check` - Check project health
- `npm run mock-plc` - Start mock PLC for testing

### Environment Configuration
The server uses environment variables for MQTT configuration. See `configs/.env.example` for all available options.

### Client Integration
- **Claude Desktop**: Use `configs/claude-desktop-config.json`
- **Other MCP Clients**: Server runs on stdio, use standard MCP client libraries

For detailed instructions, see the specific documentation files above.
