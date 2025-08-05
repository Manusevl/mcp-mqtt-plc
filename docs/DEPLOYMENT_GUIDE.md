# MCP Server Deployment Guide

## 🤔 How MCP Servers Work

**MCP servers are NOT standalone applications!** They are invoked on-demand by MCP clients (like Claude Desktop) when needed.

## 🚀 Two Deployment Options

### Option 1: Lazy Connection (Recommended) ⚡

**Best for:** Most MCP use cases, Claude Desktop integration

**How it works:**
- MCP server starts instantly when called
- Connects to MQTT only when tools are actually used
- Faster startup, more responsive to clients

**Configuration:**
```json
{
  "mcpServers": {
    "mcp-mqtt-plc": {
      "command": "node",
      "args": ["C:\\projects\\X20MCPServer\\mcp-mqtt-plc-llm-server\\dist\\server-lazy.js"]
    }
  }
}
```

**Commands:**
```bash
npm run build           # Build both versions
npm run start-lazy      # Test the lazy version
```

### Option 2: Persistent Service 🔄

**Best for:** Real-time monitoring, high-frequency PLC interactions

**How it works:**
- Background service maintains constant MQTT connection
- MCP server connects to this service
- Always has latest PLC data immediately available

**Commands:**
```bash
npm run service:start   # Start background service
npm run service:status  # Check if running
npm run service:stop    # Stop service
npm run service:logs    # View logs
```

## 📋 Comparison

| Feature | Lazy Connection | Persistent Service |
|---------|----------------|-------------------|
| **Startup Speed** | ⚡ Instant | 🐌 2-3 seconds |
| **Real-time Data** | ❌ On-demand only | ✅ Always current |
| **Resource Usage** | 💚 Low | 🟡 Medium |
| **Reliability** | 🟡 Connection per use | ✅ Always connected |
| **Best For** | Claude Desktop | Production monitoring |

## 🎯 Recommended Setup

### For Claude Desktop Users:
1. Use the **Lazy Connection** approach
2. Build: `npm run build`
3. Configure Claude Desktop with `server-lazy.js`
4. The server will connect to MQTT when you ask questions

### For Production/Real-time:
1. Use the **Persistent Service** approach
2. Start service: `npm run service:start`
3. Configure MCP client with `server.js`
4. Monitor with: `npm run service:status`

## 🛠️ Quick Start

### Test Lazy Version:
```bash
npm run build
npm run start-lazy
# In another terminal:
npm run test-client
```

### Test Persistent Version:
```bash
npm run build
npm run service:start
npm run service:status
# Test with your MCP client
npm run service:stop
```

## 🔧 Configuration Files

Both versions use the same `.env` configuration:
```env
MQTT_BROKER_URL=mqtt://192.168.1.1:1883
MQTT_CLIENT_ID=mcp-plc-server
MQTT_USERNAME=x20edgemqtt
MQTT_PASSWORD=x20edgemqtt
MQTT_PLC_DATA_TOPIC=PLCInfo
MQTT_PLC_COMMANDS_TOPIC=plc/commands
```

## 📱 Client Integration

### Claude Desktop (Lazy):
```json
{
  "mcpServers": {
    "mcp-mqtt-plc": {
      "command": "node",
      "args": ["C:\\full\\path\\to\\dist\\server-lazy.js"],
      "env": {
        "MQTT_BROKER_URL": "mqtt://192.168.1.1:1883"
      }
    }
  }
}
```

### Claude Desktop (Persistent):
1. Start service: `npm run service:start`
2. Use regular server configuration:
```json
{
  "mcpServers": {
    "mcp-mqtt-plc": {
      "command": "node", 
      "args": ["C:\\full\\path\\to\\dist\\server.js"]
    }
  }
}
```

## 🎉 Summary

- **MCP servers don't run automatically** - they're invoked by clients
- **Lazy connection** = Fast startup, connects when needed
- **Persistent service** = Always connected, real-time data
- Choose based on your use case!

**Most users should start with the lazy connection approach.**
