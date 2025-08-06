# MCP MQTT PLC Server

[![npm version](https://badge.fury.io/js/mcp-mqtt-plc.svg)](https://badge.fury.io/js/mcp-mqtt-plc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server that enables AI assistants to interact with industrial PLCs through MQTT communication. Perfect for industrial automation, IoT monitoring, and SCADA systems integration.

## 🚀 Quick Installation

```bash
npm install -g mcp-mqtt-plc
```

## ✨ Features

- **🔌 Real-time MQTT Connection**: Connect to any MQTT broker for live PLC data
- **🎛️ PLC Control**: Send commands and queries to industrial PLCs
- **🤖 AI Integration**: Native support for VS Code MCP and Claude Desktop
- **⚡ Auto-start**: Server starts automatically when needed - no background processes
- **🔧 Configurable**: Easy environment-based configuration
- **📊 Live Data**: Real-time monitoring of PLC sensors, motors, and systems
- **🛡️ Secure**: Support for authenticated MQTT connections

## 🛠️ Supported Platforms

- **VS Code** (with native MCP support)
- **Claude Desktop**
- Any MCP-compatible client

## 📋 Available Tools

Once configured, your AI assistant can:

1. **`get_plc_status`** - Get current PLC status and all data points
2. **`query_plc_data`** - Ask natural language questions about PLC data
3. **`send_plc_command`** - Send control commands to the PLC

## 🔧 Quick Setup

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
           "MQTT_CLIENT_ID": "vscode-mcp-client"
         }
       }
     }
   }
   ```

3. **Start using:** Just ask your AI assistant about PLC data!

### For Claude Desktop

1. **Install globally:**
   ```bash
   npm install -g mcp-mqtt-plc
   ```

2. **Configure Claude Desktop** (`claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "mcp-mqtt-plc": {
         "command": "mcp-mqtt-plc",
         "args": [],
         "env": {
           "MQTT_BROKER_URL": "mqtt://your-broker:1883"
         }
       }
     }
   }
   ```

## 🎯 Example Usage

Once configured, you can interact naturally:

```
You: "What's the current temperature in zone 1?"
Assistant: *Connects to PLC via MQTT* "Zone 1 temperature is 72.5°F"

You: "Start motor pump 3"
Assistant: *Sends command to PLC* "Motor pump 3 has been started successfully"

You: "Show me all alarm conditions"  
Assistant: *Queries PLC data* "Currently 2 active alarms: High pressure in tank A, Low oil level in pump 2"
```

## ⚙️ Configuration

Configure using environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `MQTT_BROKER_URL` | `mqtt://localhost:1883` | MQTT broker connection URL |
| `MQTT_CLIENT_ID` | `mcp-plc-server` | Unique client identifier |
| `MQTT_USERNAME` | - | MQTT username (if required) |
| `MQTT_PASSWORD` | - | MQTT password (if required) |
| `MQTT_PLC_DATA_TOPIC` | `plc/data` | Topic for receiving PLC data |
| `MQTT_PLC_COMMANDS_TOPIC` | `plc/commands` | Topic for sending PLC commands |
| `DEBUG` | `false` | Enable debug logging |

## 📁 Example Configurations

The package includes example configurations in the `examples/` directory:
- `vscode-settings.json` - VS Code configuration
- `claude-desktop-config.json` - Claude Desktop configuration

## 🚦 Auto-Start Behavior

The MCP server automatically:
- ✅ Starts when an AI assistant requests PLC data
- ✅ Connects to MQTT broker on-demand  
- ✅ Shuts down when not needed
- ❌ **No background processes required!**

## 🔐 Security Best Practices

- Use `mqtts://` for encrypted connections
- Store credentials in environment variables
- Use MQTT broker authentication in production
- Implement proper network security

## 🏭 Industrial Use Cases

- **Manufacturing**: Monitor production lines, control machinery
- **Energy**: Manage power systems, monitor consumption  
- **Water Treatment**: Control pumps, monitor quality sensors
- **HVAC**: Manage building climate systems
- **Process Control**: Chemical plants, refineries
- **Packaging**: Conveyor systems, quality control

## 📖 Full Documentation

- [Installation Guide](docs/INSTALLATION.md) - Detailed setup instructions
- [GitHub Repository](https://github.com/Manusevl/mcp-mqtt-plc) - Source code and issues

## 🤝 Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/Manusevl/mcp-mqtt-plc) for:
- Bug reports
- Feature requests  
- Pull requests
- Documentation improvements

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Made for Industrial IoT 🏭 | Powered by MCP 🤖 | Built with TypeScript ⚡**
cp examples/.env.production .env
```

Edit `.env` with your MQTT broker settings:
```env
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_CLIENT_ID=mcp-plc-server
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
MQTT_PLC_DATA_TOPIC=plc/data
MQTT_PLC_COMMANDS_TOPIC=plc/commands
```

### 2. Build and Run

```bash
npm install
npm run build
npm start
```

### 3. Test with Mock PLC

In another terminal, start the mock PLC simulator:
```bash
npm run mock-plc
```

### 4. Configure MCP Client

**For Claude Desktop**, add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "mcp-mqtt-plc": {
      "command": "node",
      "args": ["/path/to/your/project/dist/server.js"]
    }
  }
}
```

**For VS Code with MCP extension**, create `.vscode/mcp.json`:
```json
{
  "servers": {
    "mcp-mqtt-plc": {
      "command": "node",
      "args": ["./dist/server.js"]
    }
  }
}

```env
MQTT_BROKER_URL=mqtt://localhost:1883
MQTT_CLIENT_ID=mcp-plc-server
MQTT_USERNAME=your-username
MQTT_PASSWORD=your-password
MQTT_PLC_DATA_TOPIC=plc/data
MQTT_PLC_COMMANDS_TOPIC=plc/commands
```

### Supported MQTT Brokers

- Local Mosquitto: `mqtt://localhost:1883`
- HiveMQ Cloud: `mqtts://your-cluster.s1.eu.hivemq.cloud:8883`
- AWS IoT Core: `mqtts://your-endpoint.iot.region.amazonaws.com:8883`
- Any MQTT 3.1.1 compatible broker

## Installation & Quick Start

### Option 1: NPM Installation (Recommended)
}
```

## MQTT Broker Support

### Supported Brokers
- **Local Mosquitto**: `mqtt://localhost:1883`
- **HiveMQ Cloud**: `mqtts://your-cluster.s1.eu.hivemq.cloud:8883`
- **AWS IoT Core**: `mqtts://your-endpoint.iot.region.amazonaws.com:8883`
- **Any MQTT 3.1.1+ compatible broker**

### For Testing (No Setup Required)
Use the free public HiveMQ broker:
```env
MQTT_BROKER_URL=mqtt://broker.hivemq.com:1883
MQTT_PLC_DATA_TOPIC=test/PLCInfo
MQTT_PLC_COMMANDS_TOPIC=test/plc/commands
```

## Available Tools

The MCP server provides three tools that can be called by MCP clients:

1. **`get_plc_status`** - Get current PLC status and data from MQTT
2. **`send_plc_command`** - Send commands to the PLC via MQTT  
3. **`query_plc_data`** - Natural language queries about live PLC data

## Development

### NPM Scripts
- `npm run build` - Build TypeScript to JavaScript  
- `npm run start` - Start the MCP server
- `npm run dev` - Build and start in one command
- `npm run watch` - Build in watch mode
- `npm run test-mqtt` - Test MQTT connection only
- `npm run mock-plc` - Start mock PLC for testing

### Testing
1. Start the mock PLC: `npm run mock-plc`
2. In another terminal, test MQTT: `npm run test-mqtt`
3. The mock PLC sends realistic data every 5 seconds

## MQTT Data Format

### PLC Data (Received)
Expected JSON format on the data topic:
```json
{
  "temperature": 75.2,
  "pressure": 14.7,
  "motorSpeed": 1200,
  "motorStatus": "RUNNING",
  "valve1Position": 85,
  "valve2Position": 92,
  "flowRate": 150.5,
  "alarms": [],
  "systemStatus": "OPERATIONAL"
}
```

### Commands (Sent)
Commands published to the command topic:
```json
{
  "command": "START_MOTOR",
  "timestamp": "2025-08-05T13:00:00.000Z",
  "source": "mcp-server"
}
```

## License

MIT
```

## Available Commands

The server supports sending the following PLC commands via MQTT:
- `START_MOTOR`: Start the motor
- `STOP_MOTOR`: Stop the motor  
- `OPEN_VALVE1`: Open valve 1
- `CLOSE_VALVE1`: Close valve 1
- Any custom command supported by your PLC system

Ensure that the MQTT broker and PLC are properly configured and accessible.

## Distribution & Publishing

This package is available on npm as `mcp-mqtt-plc-server`.

### For Package Maintainers

To publish updates to npm:

```bash
# For bug fixes
npm run publish:patch

# For new features  
npm run publish:minor

# For breaking changes
npm run publish:major
```

See `publish-guide.md` and `DISTRIBUTION.md` for detailed publishing instructions.

### Package Contents

The npm package includes:
- Compiled JavaScript files (`dist/`)
- Configuration templates (`configs/`)
- Documentation (`docs/`)
- Post-install setup script (`install.js`)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.