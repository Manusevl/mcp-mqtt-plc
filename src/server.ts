#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { PlcData, MqttConfig } from './types/index.js';
import { MqttPlcClient } from './mqtt/mqttClient.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class MCPMqttPlcServer {
  private server: Server;
  private mqttClient: MqttPlcClient | null = null;
  private mqttConfig: MqttConfig;
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    // MQTT configuration
    this.mqttConfig = {
      brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
      clientId: process.env.MQTT_CLIENT_ID || 'mcp-plc-server',
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      topics: {
        plcData: process.env.MQTT_PLC_DATA_TOPIC || 'plc/data',
        plcCommands: process.env.MQTT_PLC_COMMANDS_TOPIC || 'plc/commands'
      }
    };

    this.server = new Server(
      {
        name: 'mcp-mqtt-plc-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.setupToolHandlers();
    // Note: NO immediate MQTT connection - using lazy loading
  }

  private async ensureMqttConnection(): Promise<void> {
    if (this.mqttClient?.isClientConnected()) {
      return; // Already connected
    }

    if (this.connectionPromise) {
      return this.connectionPromise; // Connection in progress
    }

    this.connectionPromise = this.connectToMqtt();
    try {
      await this.connectionPromise;
    } finally {
      this.connectionPromise = null;
    }
  }

  private async connectToMqtt(): Promise<void> {
    try {
      this.mqttClient = new MqttPlcClient(this.mqttConfig);
      await this.mqttClient.connect();
      
      this.mqttClient.on('plcDataReceived', (data: PlcData) => {
      });
    } catch (error) {
      throw error;
    }
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_plc_status',
            description: 'Get the current status and data from the PLC',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          {
            name: 'send_plc_command',
            description: 'Send a command to the PLC',
            inputSchema: {
              type: 'object',
              properties: {
                command: {
                  type: 'string',
                  description: 'The command to send to the PLC',
                },
              },
              required: ['command'],
            },
          },
          {
            name: 'query_plc_data',
            description: 'Query specific PLC data points or ask questions about PLC status',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Natural language query about the PLC data',
                },
              },
              required: ['query'],
            },
          },
        ] satisfies Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Connect to MQTT only when tools are actually used
        await this.ensureMqttConnection();

        switch (name) {
          case 'get_plc_status':
            return await this.getPlcStatus();

          case 'send_plc_command':
            if (!args || typeof args.command !== 'string') {
              throw new Error('Missing or invalid "command" argument for send_plc_command');
            }
            return await this.sendPlcCommand(args.command as string);

          case 'query_plc_data':
            if (!args || typeof args.query !== 'string') {
              throw new Error('Missing or invalid "query" argument for query_plc_data');
            }
            return await this.queryPlcData(args.query as string);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
        };
      }
    });
  }

  private async getPlcStatus() {
    if (!this.mqttClient) {
      return {
        content: [
          {
            type: 'text',
            text: 'MQTT client not initialized. Connection will be established on first use.',
          },
        ],
      };
    }

    const latestPlcData = this.mqttClient.getLatestPlcData();
    
    if (!latestPlcData) {
      return {
        content: [
          {
            type: 'text',
            text: `No PLC data available yet. MQTT connection status: ${this.mqttClient.isClientConnected() ? 'Connected' : 'Disconnected'}\nBroker: ${this.mqttConfig.brokerUrl}\nData Topic: ${this.mqttConfig.topics.plcData}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: `Current PLC Status:\n${JSON.stringify(latestPlcData, null, 2)}`,
        },
      ],
    };
  }

  private async sendPlcCommand(command: string) {
    if (!this.mqttClient) {
      throw new Error('MQTT client not connected');
    }

    try {
      await this.mqttClient.publishCommand(command);
      return {
        content: [
          {
            type: 'text',
            text: `Command "${command}" sent to PLC successfully via MQTT.`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Failed to send command "${command}": ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  }

  private async queryPlcData(query: string) {
    if (!this.mqttClient) {
      return {
        content: [
          {
            type: 'text',
            text: 'MQTT client not initialized. Please try again.',
          },
        ],
      };
    }

    const latestPlcData = this.mqttClient.getLatestPlcData();
    
    if (!latestPlcData) {
      return {
        content: [
          {
            type: 'text',
            text: `No PLC data available to query. MQTT connection status: ${this.mqttClient.isClientConnected() ? 'Connected' : 'Disconnected'}`,
          },
        ],
      };
    }

    // Simple query responses based on query
    const queryLower = query.toLowerCase();
    let response = '';

    if (queryLower.includes('temperature')) {
      response = `Current temperature: ${latestPlcData.temperature?.toFixed(1)}°F`;
    } else if (queryLower.includes('motor')) {
      response = `Motor status: ${latestPlcData.motorStatus} at ${latestPlcData.motorSpeed} RPM`;
    } else if (queryLower.includes('pressure')) {
      response = `System pressure: ${latestPlcData.pressure?.toFixed(1)} PSI`;
    } else {
      response = `System status: ${latestPlcData.systemStatus}`;
    }

    return {
      content: [
        {
          type: 'text',
          text: `Query: "${query}"\n\nAnswer: ${response}\n\nFull PLC Data:\n${JSON.stringify(latestPlcData, null, 2)}`,
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

// Start the server
const server = new MCPMqttPlcServer();
server.run().catch(() => {
  // Suppress error logging to avoid stdio interference
  process.exit(1);
});