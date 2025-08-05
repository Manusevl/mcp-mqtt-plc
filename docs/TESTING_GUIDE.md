# MCP MQTT PLC Server - Testing Guide

## Overview
This guide shows you how to test the MCP MQTT PLC Server from various clients.

## Server Status
✅ **Built Successfully** - The TypeScript project compiled without errors
✅ **Environment Configured** - MQTT settings loaded from .env file
⚠️  **MQTT Connection** - PLC broker at 192.168.1.1:1883 may not be accessible (expected if PLC is offline)

## Testing Methods

### 1. Direct Testing with Node.js Client

Run the test client we created:
```bash
node test-client.js
```

This will:
- Start the MCP server
- Send initialization messages
- Test all three available tools:
  - `get_plc_status` - Get current PLC data
  - `query_plc_data` - Query PLC data with natural language
  - `send_plc_command` - Send commands to PLC

### 2. Claude Desktop Integration

To use this server with Claude Desktop:

1. **Locate your Claude Desktop config file:**
   - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
   - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. **Add this configuration:**
```json
{
  "mcpServers": {
    "mcp-mqtt-plc": {
      "command": "node",
      "args": ["C:\\projects\\X20MCPServer\\mcp-mqtt-plc-llm-server\\dist\\server.js"],
      "env": {
        "MQTT_BROKER_URL": "mqtt://192.168.1.1:1883",
        "MQTT_CLIENT_ID": "mcp-plc-server",
        "MQTT_USERNAME": "x20edgemqtt",
        "MQTT_PASSWORD": "x20edgemqtt",
        "MQTT_PLC_DATA_TOPIC": "PLCInfo",
        "MQTT_PLC_COMMANDS_TOPIC": "plc/commands"
      }
    }
  }
}
```

3. **Restart Claude Desktop**

4. **Test in Claude Desktop:**
   - Ask: "What's the current PLC status?"
   - Ask: "What is the motor temperature?"
   - Ask: "Send START_MOTOR command to the PLC"

### 3. Manual MQTT Testing

To test MQTT functionality independently:

```bash
npm run test-mqtt
```

This will:
- Connect to the MQTT broker
- Subscribe to PLC data topic
- Send a test command
- Show connection status

### 4. Available MCP Tools

The server provides these tools:

#### get_plc_status
- **Purpose:** Get current PLC status and data
- **Parameters:** None
- **Example:** Returns temperature, pressure, motor status, valve positions, etc.

#### send_plc_command
- **Purpose:** Send commands to PLC via MQTT
- **Parameters:** 
  - `command` (string): Command to send (e.g., "START_MOTOR", "STOP_MOTOR", "OPEN_VALVE1")
- **Example:** Sends command to plc/commands topic

#### query_plc_data
- **Purpose:** Natural language queries about PLC data
- **Parameters:**
  - `query` (string): Question about PLC status
- **Examples:** 
  - "What's the temperature?"
  - "Is the motor running?"
  - "What's the system pressure?"

## Expected Behavior

### With PLC Online
- MQTT connection succeeds
- Real PLC data is displayed
- Commands are sent to actual PLC
- Live data updates received

### With PLC Offline (Current State)
- MQTT connection may fail or timeout
- Server still responds with "No PLC data available"
- Commands are sent to MQTT but no response from PLC
- Tools work but show no live data

## Troubleshooting

### MQTT Connection Issues
1. Check if PLC at 192.168.1.1 is online: `ping 192.168.1.1`
2. Verify MQTT broker is running on port 1883
3. Check credentials in .env file
4. Try connecting with MQTT client like MQTT Explorer

### Server Issues
1. Ensure TypeScript compiled: `npm run build`
2. Check for errors in console output
3. Verify Node.js version compatibility
4. Check .env file exists and has correct values

### Client Integration
1. Verify absolute paths in configuration
2. Check file permissions
3. Restart client application after config changes
4. Review client logs for connection errors

## Production Deployment

For production use:
1. Update MQTT broker URL to production PLC
2. Use secure MQTT (mqtts://) if available
3. Set up proper authentication
4. Configure firewall rules for MQTT port
5. Set up monitoring for MQTT connection health

## Next Steps

1. Test with actual PLC hardware when available
2. Implement error handling for network issues
3. Add data validation for PLC commands
4. Set up logging for production monitoring
5. Add unit tests for MQTT functionality
