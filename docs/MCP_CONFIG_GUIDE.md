# MCP Configuration Guide

## ✅ Your MCP Configuration is Now Fixed!

### 🔧 **What Was Fixed:**

1. **✅ Updated to use lazy server** (`server-lazy.js`) for faster startup
2. **✅ Added full absolute path** to avoid path resolution issues  
3. **✅ Added environment variables** for MQTT configuration
4. **✅ Used correct VS Code MCP format** with `"servers"` key

### 📁 **Current Configuration:**

**VS Code MCP (`.vscode/mcp.json`):**
```json
{
  "servers": {
    "mcp-mqtt-plc": {
      "command": "node",
      "args": ["C:\\projects\\X20MCPServer\\mcp-mqtt-plc-llm-server\\dist\\server-lazy.js"],
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

### 🚀 **How to Test:**

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Test the server manually:**
   ```bash
   echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node dist/server-lazy.js
   ```

3. **Use with VS Code MCP extension** - the server should now appear in your MCP tools

### 🎯 **For Claude Desktop Users:**

Copy the configuration from `configs/claude-desktop-config.json` to your Claude Desktop config file:

**Location:** `%APPDATA%\Claude\claude_desktop_config.json` (Windows)

### 🔧 **Configuration Options:**

- **Lazy Server** (`server-lazy.js`) - Connects to MQTT on-demand ⚡
- **Original Server** (`server.js`) - Connects to MQTT immediately 🔄

### 🧪 **Testing Commands:**

```bash
# Test MQTT connection
npm run test-mqtt

# Test full MCP functionality  
npm run test

# Start mock PLC for testing
npm run mock-plc
```

Your MCP server is now properly configured and ready to use! 🎉
