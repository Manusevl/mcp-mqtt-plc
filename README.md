# MCP MQTT PLC Server

This project is an MCP (Model Context Protocol) server that connects to an MQTT broker to collect real-time PLC data and send commands to industrial PLCs. The server provides tools for querying PLC status and controlling PLC operations through MQTT communication.

## Project Structure

```
mcp-mqtt-plc-llm-server
├── src/                   # Source code
│   ├── server.ts          # Main MCP server implementation
│   ├── mqtt/              # MQTT client for PLC communication
│   │   └── mqttClient.ts
│   └── types/             # Type definitions for PLC data and MQTT
│       └── index.ts
├── tests/                 # Test files and utilities
│   ├── test-mqtt.js       # MQTT connection test
│   ├── complete-test.js   # Full MCP server test suite
│   ├── mock-plc.js        # Mock PLC simulator for testing
│   └── ...                # Additional test utilities
├── docs/                  # Documentation
│   ├── README.md          # Documentation index
│   ├── TESTING_GUIDE.md   # Comprehensive testing guide
│   └── READY_TO_TEST.md   # Quick start guide
├── configs/               # Configuration files
│   ├── .env.example       # Environment template
│   ├── .env.test          # Test environment settings
│   └── claude-desktop-config.json  # Claude Desktop integration
├── scripts/               # Utility scripts
│   ├── setup.js           # Project initialization
│   └── dev.js             # Development helpers
├── dist/                  # Built JavaScript files (generated)
├── .env                   # Environment configuration (create from example)
├── package.json           # npm configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # This file
```

## Features

- **Real-time MQTT Connection**: Connects to MQTT broker to receive live PLC data
- **PLC Command Control**: Send commands to PLC via MQTT topics
- **MCP Tools**: Provides three tools for interacting with the PLC:
  - `get_plc_status`: Get current PLC status and data from MQTT
  - `send_plc_command`: Send commands to the PLC via MQTT
  - `query_plc_data`: Natural language queries about live PLC data
- **Configurable MQTT Settings**: Environment-based configuration for different brokers

## Configuration

Create a `.env` file in the project root with your MQTT broker settings:

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

1. **Install globally:**
   ```bash
   npm install -g mcp-mqtt-plc-server
   ```

2. **Start the server:**
   ```bash
   mcp-mqtt-plc
   ```
   The server will automatically create configuration files in `~/.mcp-mqtt-plc/` on first run.

3. **Configure MQTT settings:**
   Edit `~/.mcp-mqtt-plc/.env` with your MQTT broker details.

### Option 2: Direct Usage (No Installation)

```bash
npx mcp-mqtt-plc-server
```

### Option 3: Development Setup

1. **Clone and setup:**
   ```bash
   git clone https://github.com/yourusername/mcp-mqtt-plc-llm-server.git
   cd mcp-mqtt-plc-llm-server
   npm install
   ```

2. **Initialize configuration:**
   ```bash
   npm run setup
   ```
   This creates your `.env` file from the template in `configs/`.

3. **Configure MQTT settings:**
   Edit `.env` with your MQTT broker details:
   ```env
   MQTT_BROKER_URL=mqtt://your-broker:1883
   MQTT_CLIENT_ID=mcp-plc-server
   MQTT_USERNAME=your-username
   MQTT_PASSWORD=your-password
   MQTT_PLC_DATA_TOPIC=plc/data
   MQTT_PLC_COMMANDS_TOPIC=plc/commands
   ```

4. **Build and start:**
   ```bash
   npm run build
   npm start
   ```

## Quick Commands

- `npm run setup` - Initialize project configuration
- `npm run build` - Build TypeScript to JavaScript  
- `npm run start` - Start the MCP server
- `npm run test` - Run complete test suite
- `npm run test-mqtt` - Test MQTT connection only
- `npm run mock-plc` - Start mock PLC for testing
- `npm run check` - Check project health

The server will automatically connect to your MQTT broker and start listening for PLC data on the configured topic.

## MQTT Topics

### Data Topic (Subscribe)
The server subscribes to `MQTT_PLC_DATA_TOPIC` (default: `plc/data`) to receive PLC status updates. Expected JSON format:

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

### Commands Topic (Publish)
The server publishes commands to `MQTT_PLC_COMMANDS_TOPIC` (default: `plc/commands`) in the format:

```json
{
  "command": "START_MOTOR",
  "timestamp": "2025-08-05T13:00:00.000Z",
  "source": "mcp-server"
}
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