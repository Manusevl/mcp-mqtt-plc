import mqtt, { MqttClient } from 'mqtt';
import { EventEmitter } from 'events';
import { MqttConfig, PlcData, MqttMessage } from '../types/index.js';

export class MqttPlcClient extends EventEmitter {
  private client: MqttClient | null = null;
  private config: MqttConfig;
  private latestPlcData: PlcData | null = null;
  private isConnected: boolean = false;

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
  }

  private handleMessage(topic: string, payload: Buffer): void {
    try {
      const message: MqttMessage = {
        topic,
        payload,
        timestamp: new Date()
      };

      if (topic === this.config.topics.plcData) {
        // Parse PLC data from MQTT message
        const plcData = JSON.parse(payload.toString()) as PlcData;
        plcData.timestamp = new Date().toISOString();
        
        this.latestPlcData = plcData;
        this.emit('plcDataReceived', plcData);
        
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
