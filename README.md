# MCP MQTT PLC Server

[![npm version](https://badge.fury.io/js/mcp-mqtt-plc.svg)](https://badge.fury.io/js/mcp-mqtt-plc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that enables AI assistants to discover and monitor industrial PLCs through MQTT communication. Perfect for industrial automation monitoring, IoT data analysis, and SCADA systems integration.

## 🚀 Quick Installation

```bash
npm install -g mcp-mqtt-plc
```

## ✨ Features

- **🔍 Topic Discovery**: Automatically discovers all available MQTT topics
- **📊 Detailed Data Retrieval**: Get comprehensive information about specific topics
- **🤖 AI Integration**: Native support for VS Code MCP and Claude Desktop
- **⚡ Auto-start**: Server starts automatically when needed - no background processes
- **🔧 Configurable**: Easy environment-based configuration
- **🛡️ Secure**: Support for authenticated MQTT connections
- **🔒 Read-Only**: Safe monitoring interface with no control commands

## 📋 Available Tools

1. **`search_mqtt_topics`** - Discover and list all available MQTT topics
   - Returns overview of all topics with message counts and sample data
   - No parameters required
   - Use this first to understand what data is available

2. **`get_topic_details`** - Get detailed information about specific topics
   - Requires `topicPattern` parameter (exact name or partial match)
   - Returns full data payload and metadata
   - Supports pattern matching for flexible topic discovery

## 🛠️ Setup

### For VS Code (Native MCP)

1. **Install globally:**
   ```bash
   npm install -g mcp-mqtt-plc
   ```

2. **Add to VS Code settings.json:**
   ```json
   {
     "mcp.servers": {
       "mcp-mqtt-plc": {
         "command": "mcp-mqtt-plc",
         "args": [],
         "env": {
           "MQTT_BROKER_URL": "mqtt://your-broker:1883",
           "MQTT_USERNAME": "your-username",
           "MQTT_PASSWORD": "your-password"
         }
       }
     }
   }
   ```

### For Claude Desktop

1. **Install globally:**
   ```bash
   npm install -g mcp-mqtt-plc
   ```

2. **Configure Claude Desktop** (`%APPDATA%\Claude\claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "mcp-mqtt-plc": {
         "command": "mcp-mqtt-plc",
         "args": [],
         "env": {
           "MQTT_BROKER_URL": "mqtt://your-broker:1883",
           "MQTT_USERNAME": "your-username", 
           "MQTT_PASSWORD": "your-password"
         }
       }
     }
   }
   ```

## ⚙️ Configuration

Configure via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MQTT_BROKER_URL` | `mqtt://localhost:1883` | MQTT broker connection URL |
| `MQTT_CLIENT_ID` | `mcp-plc-server` | MQTT client identifier |
| `MQTT_USERNAME` | - | MQTT username (optional) |
| `MQTT_PASSWORD` | - | MQTT password (optional) |
| `MQTT_PLC_DATA_TOPIC` | `plc/data` | Default PLC data topic |
| `MQTT_PLC_COMMANDS_TOPIC` | `plc/commands` | Default PLC command topic |

## 🎯 Usage Examples

### Discovery Workflow
```
User: "What industrial data is available?"
→ AI calls search_mqtt_topics()
→ Shows: "factory/temperature", "plc/motors", "sensors/pressure"

User: "What's the current temperature?"  
→ AI calls get_topic_details("temperature")
→ Returns: {"temperature": 72.5, "unit": "°F", "timestamp": "..."}
```

### Pattern Matching
```
get_topic_details("motor")     # Finds topics containing "motor"
get_topic_details("plc/data")  # Exact topic match
get_topic_details("temp")      # Finds temperature-related topics
```

## 🧪 Development & Testing

### NPM Scripts
- `npm run build` - Build TypeScript to JavaScript  
- `npm run start` - Start the MCP server
- `npm run dev` - Build and start in one command
- `npm run watch` - Build in watch mode
- `npm run test-mqtt` - Test MQTT connection
- `npm run mock-plc` - Start mock PLC for testing

### Local Development
1. Clone the repository
2. Install dependencies: `npm install`
3. Create `.env` file with your MQTT configuration
4. Build: `npm run build`
5. Test: `npm run test-mqtt`

### Testing with Mock PLC
```bash
# Terminal 1: Start mock PLC
npm run mock-plc

# Terminal 2: Test the server
npm run test-mqtt
```

## 🏭 Industrial Use Cases

- **Factory Monitoring**: Real-time production data analysis
- **SCADA Integration**: Connect AI assistants to existing SCADA systems
- **Predictive Maintenance**: AI analysis of sensor data trends
- **Quality Control**: Automated monitoring of production parameters  
- **Energy Management**: Smart analysis of power consumption data
- **Safety Monitoring**: Real-time alert analysis and response

## 🛡️ Security & Safety

- **Read-Only Interface**: No control commands - monitoring only
- **Secure Connections**: Support for authenticated MQTT brokers
- **No Data Storage**: Real-time monitoring without data persistence
- **Isolated Execution**: Runs in controlled MCP environment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes and add tests
4. Build and test: `npm run build && npm run test-mqtt`
5. Commit: `git commit -am 'Add feature'`
6. Push: `git push origin feature-name`
7. Create Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Perfect for safe, intelligent monitoring of industrial MQTT data with AI assistants!** 🏭🤖