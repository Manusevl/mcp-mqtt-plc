import mqtt, { MqttClient } from 'mqtt';
import { EventEmitter } from 'events';
import { MqttConfig, PlcData, MqttMessage } from '../types/index.js';

export class MqttPlcClient extends EventEmitter {
  private client: MqttClient | null = null;
  private config: MqttConfig;
  private latestPlcData: PlcData | null = null;
  private isConnected: boolean = false;
  private topicData: Map<string, any> = new Map();
  private topicMetadata: Map<string, { lastMessage: Date; messageCount: number; sampleData: any }> = new Map();

  constructor(config: MqttConfig) {
    super();
    this.config = config;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      const options: mqtt.IClientOptions = {
        clientId: this.config.clientId || `mcp-plc-${Math.random().toString(16).slice(3)}`,
        clean: true,
        connectTimeout: 4000,
        username: this.config.username,
        password: this.config.password,
        reconnectPeriod: 1000,
      };

      this.client = mqtt.connect(this.config.brokerUrl, options);

      this.client.on('connect', () => {
        this.isConnected = true;
        this.subscribeToTopics();
        resolve();
      });

      this.client.on('error', (error) => {
        this.isConnected = false;
        reject(error);
      });

      this.client.on('offline', () => {
        this.isConnected = false;
      });

      this.client.on('reconnect', () => {
      });

      this.client.on('message', (topic, payload) => {
        this.handleMessage(topic, payload);
      });
    });
  }

  private subscribeToTopics(): void {
    if (!this.client) return;

    // Subscribe to PLC data topic
    this.client.subscribe(this.config.topics.plcData, (err) => {
      if (err) {
      } else {
      }
    });

    // Subscribe to all topics for discovery (using wildcard)
    this.client.subscribe('#', (err) => {
      if (err) {
      } else {
      }
    });
  }

  private handleMessage(topic: string, payload: Buffer): void {
    try {
      const message: MqttMessage = {
        topic,
        payload,
        timestamp: new Date()
      };

      // Parse message data
      let parsedData: any;
      try {
        parsedData = JSON.parse(payload.toString());
      } catch {
        // If JSON parsing fails, store as string
        parsedData = payload.toString();
      }

      // Store topic data for discovery
      this.topicData.set(topic, parsedData);

      // Update topic metadata
      const metadata = this.topicMetadata.get(topic) || { lastMessage: new Date(), messageCount: 0, sampleData: null };
      metadata.lastMessage = new Date();
      metadata.messageCount += 1;
      metadata.sampleData = parsedData;
      this.topicMetadata.set(topic, metadata);

      // Handle specific PLC data topic
      if (topic === this.config.topics.plcData) {
        if (typeof parsedData === 'object') {
          const plcData = parsedData as PlcData;
          plcData.timestamp = new Date().toISOString();
          this.latestPlcData = plcData;
          this.emit('plcDataReceived', plcData);
        }
      }
    } catch (error) {
    }
  }

  async publishCommand(command: string): Promise<void> {
    if (!this.client || !this.isConnected) {
      throw new Error('MQTT client not connected');
    }

    const commandMessage = {
      command,
      timestamp: new Date().toISOString(),
      source: 'mcp-server'
    };

    return new Promise((resolve, reject) => {
      this.client!.publish(
        this.config.topics.plcCommands,
        JSON.stringify(commandMessage),
        { qos: 1 },
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  getLatestPlcData(): PlcData | null {
    return this.latestPlcData;
  }

  isClientConnected(): boolean {
    return this.isConnected;
  }

  getAllTopics(): Array<{ topic: string; lastMessage: Date; messageCount: number; sampleData: any }> {
    const topics: Array<{ topic: string; lastMessage: Date; messageCount: number; sampleData: any }> = [];
    
    this.topicMetadata.forEach((metadata, topic) => {
      topics.push({
        topic,
        lastMessage: metadata.lastMessage,
        messageCount: metadata.messageCount,
        sampleData: metadata.sampleData
      });
    });

    // Sort by last message time (most recent first)
    return topics.sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime());
  }

  getTopicDetails(topicPattern: string): { topic: string; data: any; metadata: any } | null {
    // If exact match exists, return it
    if (this.topicData.has(topicPattern)) {
      const metadata = this.topicMetadata.get(topicPattern);
      return {
        topic: topicPattern,
        data: this.topicData.get(topicPattern),
        metadata
      };
    }

    // Otherwise, find topics that match the pattern (simple contains match)
    const matchingTopics: Array<{ topic: string; data: any; metadata: any }> = [];
    
    this.topicData.forEach((data, topic) => {
      if (topic.toLowerCase().includes(topicPattern.toLowerCase()) || 
          topicPattern.toLowerCase().includes(topic.toLowerCase())) {
        const metadata = this.topicMetadata.get(topic);
        matchingTopics.push({ topic, data, metadata });
      }
    });

    if (matchingTopics.length === 1) {
      return matchingTopics[0];
    } else if (matchingTopics.length > 1) {
      // Return all matching topics as an array
      return {
        topic: `Multiple topics matching "${topicPattern}"`,
        data: matchingTopics,
        metadata: { matchCount: matchingTopics.length }
      };
    }

    return null;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      return new Promise((resolve) => {
        this.client!.end(false, {}, () => {
          this.isConnected = false;
          resolve();
        });
      });
    }
  }
}
