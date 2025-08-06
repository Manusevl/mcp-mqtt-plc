# Installation Guide for MCP MQTT PLC Server

This guide will help you install and configure the MCP MQTT PLC Server for use with VS Code and other MCP-compatible tools.

## Quick Installation

```bash
npm install -g mcp-mqtt-plc
```

## VS Code Setup (Native MCP Support)

### 1. Install the Package
```bash
npm install -g mcp-mqtt-plc
```

### 2. Configure VS Code Settings

Add the following to your VS Code `settings.json`:

```json
{
  "mcp.servers": {
    "mcp-mqtt-plc": {
      "command": "mcp-mqtt-plc",
      "args": [],
      "env": {
        "NODE_ENV": "production",
        "MQTT_BROKER_URL": "mqtt://your-broker:1883",
        "MQTT_CLIENT_ID": "vscode-mcp-client",
        "MQTT_PLC_DATA_TOPIC": "plc/data",
        "MQTT_PLC_COMMANDS_TOPIC": "plc/commands"
      }
    }
  }
}
```

### 3. Environment Configuration

You can configure the server using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MQTT_BROKER_URL` | `mqtt://localhost:1883` | MQTT broker URL |
| `MQTT_CLIENT_ID` | `mcp-plc-server` | MQTT client identifier |
| `MQTT_USERNAME` | - | MQTT username (optional) |
| `MQTT_PASSWORD` | - | MQTT password (optional) |
| `MQTT_PLC_DATA_TOPIC` | `plc/data` | Topic for PLC data |
| `MQTT_PLC_COMMANDS_TOPIC` | `plc/commands` | Topic for PLC commands |
| `DEBUG` | `false` | Enable debug logging |

## Claude Desktop Setup

### 1. Install the Package
```bash
npm install -g mcp-mqtt-plc
```

### 2. Configure Claude Desktop

Add to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux**: `~/.config/claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-mqtt-plc": {
      "command": "mcp-mqtt-plc",
      "args": [],
      "env": {
        "NODE_ENV": "production",
        "MQTT_BROKER_URL": "mqtt://your-broker:1883",
        "MQTT_CLIENT_ID": "claude-mcp-client"
      }
    }
  }
}
```

## Automatic Server Management

The MCP server starts automatically when:
- VS Code requests MCP capabilities
- Claude Desktop connects to the server
- Any MCP-compatible client invokes the server

**No background processes needed!** The server runs on-demand and shuts down when not in use.

## Available Tools

Once configured, you'll have access to these tools:

1. **get_plc_status** - Get current PLC status and data
2. **query_plc_data** - Query specific PLC data points
3. **send_plc_command** - Send commands to the PLC

## Verification

To verify the installation works:

1. Open VS Code or Claude Desktop
2. Ask: "What is the current PLC status?"
3. The server should automatically start and connect to your MQTT broker

## Troubleshooting

### Server Not Starting
- Ensure `mcp-mqtt-plc` is installed globally: `npm list -g mcp-mqtt-plc`
- Check that Node.js version is >= 18.0.0: `node --version`

### Connection Issues
- Verify MQTT broker URL is correct
- Check network connectivity to MQTT broker
- Ensure MQTT credentials are correct (if required)

### Debug Mode
Enable debug logging by setting `DEBUG=true` in the environment configuration.

## Example Usage in VS Code

Once configured, you can interact with your PLC directly in VS Code:

```
You: "Show me the current temperature readings from the PLC"
Assistant: [Automatically connects to PLC via MQTT and retrieves temperature data]

You: "Set motor speed to 1500 RPM"
Assistant: [Sends command to PLC via MQTT]
```

## Security Considerations

- Use TLS/SSL for MQTT connections in production: `mqtts://`
- Store sensitive credentials in environment variables, not in config files
- Consider using MQTT authentication for production deployments
- Restrict MQTT topic access using broker ACLs

## Support

For issues and questions:
- GitHub Issues: https://github.com/Manusevl/mcp-mqtt-plc/issues
- Documentation: https://github.com/Manusevl/mcp-mqtt-plc#readme
