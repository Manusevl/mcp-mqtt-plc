import { MqttPlcClient } from './src/mqtt/mqttClient.js';
import { MqttConfig } from './src/types/index.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config: MqttConfig = {
  brokerUrl: process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883',
  clientId: process.env.MQTT_CLIENT_ID || 'mcp-plc-test',
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
  topics: {
    plcData: process.env.MQTT_PLC_DATA_TOPIC || 'plc/data',
    plcCommands: process.env.MQTT_PLC_COMMANDS_TOPIC || 'plc/commands'
  }
};

async function testMqttConnection() {
  console.log('Testing MQTT connection...');
  console.log('Configuration:', {
    brokerUrl: config.brokerUrl,
    clientId: config.clientId,
    dataTopicSub: config.topics.plcData,
    commandTopicPub: config.topics.plcCommands
  });

  const client = new MqttPlcClient(config);

  try {
    // Connect to MQTT broker
    await client.connect();
    
    // Listen for PLC data
    client.on('plcDataReceived', (data) => {
      console.log('Received PLC data:', data);
    });

    console.log('✅ Successfully connected to MQTT broker');
    console.log(`📡 Listening for PLC data on topic: ${config.topics.plcData}`);
    console.log(`📤 Ready to publish commands to topic: ${config.topics.plcCommands}`);
    
    // Test sending a command after 2 seconds
    setTimeout(async () => {
      try {
        await client.publishCommand('TEST_CONNECTION');
        console.log('✅ Test command sent successfully');
      } catch (error) {
        console.error('❌ Failed to send test command:', error);
      }
    }, 2000);

    // Keep the test running for 30 seconds
    setTimeout(async () => {
      console.log('🔌 Disconnecting from MQTT broker...');
      await client.disconnect();
      process.exit(0);
    }, 30000);

  } catch (error) {
    console.error('❌ MQTT connection failed:', error);
    process.exit(1);
  }
}

testMqttConnection().catch(console.error);
