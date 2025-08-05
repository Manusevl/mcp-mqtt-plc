# MCP MQTT PLC Server

This project is an MCP (Model Context Protocol) server that connects to an MQTT broker to collect real-time PLC data and send commands to industrial PLCs. The server provides tools for querying PLC status and controlling PLC operations through MQTT communication.

## Project Structure

```
mcp-mqtt-plc-llm-server
├── src
│   ├── server.ts          # Main MCP server implementation
│   ├── mqtt
│   │   └── mqttClient.ts  # MQTT client for PLC communication
│   └── types
│       └── index.ts       # Type definitions for PLC data and MQTT
├── .env                   # Environment configuration
├── package.json           # npm configuration file
├── tsconfig.json          # TypeScript configuration file
└── README.md             # Project documentation
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

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mcp-mqtt-plc-llm-server.git
   ```
2. Navigate to the project directory:
   ```bash
   cd mcp-mqtt-plc-llm-server
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the example environment file and configure your MQTT settings:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your actual MQTT broker settings.

## Usage

1. Build the project:
   ```
   npm run build
   ```

2. Start the server:
   ```
   npm start
   ```

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

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.