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

// Load environment variables (suppress promotional messages)
dotenv.config({ quiet: true });

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
            name: 'search_mqtt_topics',
            description: 'Search and discover all available MQTT topics with basic information',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          {
            name: 'get_topic_details',
            description: 'Get detailed information about a specific MQTT topic',
            inputSchema: {
              type: 'object',
              properties: {
                topicPattern: {
                  type: 'string',
                  description: 'The topic name or pattern to get details for',
                },
              },
              required: ['topicPattern'],
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
          case 'search_mqtt_topics':
            return await this.searchMqttTopics();

          case 'get_topic_details':
            if (!args || typeof args.topicPattern !== 'string') {
              throw new Error('Missing or invalid "topicPattern" argument for get_topic_details');
            }
            return await this.getTopicDetails(args.topicPattern as string);

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

  private async searchMqttTopics() {
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

    const topics = this.mqttClient.getAllTopics();
    
    if (topics.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `No MQTT topics discovered yet. MQTT connection status: ${this.mqttClient.isClientConnected() ? 'Connected' : 'Disconnected'}\nBroker: ${this.mqttConfig.brokerUrl}\n\nMake sure the MQTT broker is publishing data or wait a moment for topics to be discovered.`,
          },
        ],
      };
    }

    // Create a summary of all topics
    let topicSummary = `MQTT Topics Discovery (${topics.length} topics found):\n\n`;
    
    topics.forEach((topicInfo, index) => {
      const timeDiff = Math.round((Date.now() - topicInfo.lastMessage.getTime()) / 1000);
      let sampleDataPreview = '';
      
      try {
        if (typeof topicInfo.sampleData === 'object') {
          sampleDataPreview = Object.keys(topicInfo.sampleData).join(', ');
        } else {
          sampleDataPreview = String(topicInfo.sampleData).substring(0, 50);
        }
      } catch {
        sampleDataPreview = 'Unable to preview';
      }
      
      topicSummary += `${index + 1}. Topic: "${topicInfo.topic}"\n`;
      topicSummary += `   - Messages received: ${topicInfo.messageCount}\n`;
      topicSummary += `   - Last message: ${timeDiff}s ago\n`;
      topicSummary += `   - Data preview: ${sampleDataPreview}\n\n`;
    });

    return {
      content: [
        {
          type: 'text',
          text: topicSummary,
        },
      ],
    };
  }

  private async getTopicDetails(topicPattern: string) {
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

    const topicDetails = this.mqttClient.getTopicDetails(topicPattern);
    
    if (!topicDetails) {
      return {
        content: [
          {
            type: 'text',
            text: `No topic found matching pattern: "${topicPattern}"\n\nUse the search_mqtt_topics method to discover available topics.`,
          },
        ],
      };
    }

    let detailsText = `Topic Details for: "${topicDetails.topic}"\n\n`;
    
    if (topicDetails.metadata && typeof topicDetails.metadata === 'object' && 'matchCount' in topicDetails.metadata) {
      // Multiple topics matched
      detailsText += `Found ${topicDetails.metadata.matchCount} matching topics:\n\n`;
      if (Array.isArray(topicDetails.data)) {
        topicDetails.data.forEach((item, index) => {
          detailsText += `${index + 1}. Topic: "${item.topic}"\n`;
          detailsText += `   Data: ${JSON.stringify(item.data, null, 2)}\n`;
          if (item.metadata) {
            detailsText += `   Messages: ${item.metadata.messageCount}\n`;
            detailsText += `   Last updated: ${item.metadata.lastMessage}\n`;
          }
          detailsText += '\n';
        });
      }
    } else {
      // Single topic
      detailsText += `Current Data:\n${JSON.stringify(topicDetails.data, null, 2)}\n\n`;
      
      if (topicDetails.metadata) {
        detailsText += `Metadata:\n`;
        detailsText += `- Total messages received: ${topicDetails.metadata.messageCount}\n`;
        detailsText += `- Last message time: ${topicDetails.metadata.lastMessage}\n`;
        detailsText += `- Time since last message: ${Math.round((Date.now() - topicDetails.metadata.lastMessage.getTime()) / 1000)}s ago\n`;
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: detailsText,
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