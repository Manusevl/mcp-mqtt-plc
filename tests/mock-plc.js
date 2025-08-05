import mqtt from 'mqtt';

/**
 * Mock MQTT Broker Simulator
 * This simulates a PLC sending data to test the MCP server
 */

const MQTT_CONFIG = {
  brokerUrl: 'mqtt://broker.hivemq.com:1883', // Free public broker for testing
  clientId: 'mock-plc-simulator',
  topics: {
    plcData: 'test/PLCInfo',
    plcCommands: 'test/plc/commands'
  }
};

async function startMockPLC() {
  console.log('🏭 Starting Mock PLC Simulator...');
  console.log(`📡 Connecting to: ${MQTT_CONFIG.brokerUrl}`);
  
  const client = mqtt.connect(MQTT_CONFIG.brokerUrl, {
    clientId: MQTT_CONFIG.clientId,
    clean: true,
    connectTimeout: 4000,
    username: undefined,
    password: undefined,
    reconnectPeriod: 1000,
  });

  client.on('connect', () => {
    console.log('✅ Mock PLC connected to MQTT broker');
    
    // Subscribe to commands
    client.subscribe(MQTT_CONFIG.topics.plcCommands, (err) => {
      if (!err) {
        console.log(`📥 Subscribed to commands topic: ${MQTT_CONFIG.topics.plcCommands}`);
      }
    });

    // Start sending mock PLC data every 5 seconds
    const sendMockData = () => {
      const mockPlcData = {
        temperature: 72.5 + (Math.random() - 0.5) * 5, // 70-75°F range
        pressure: 14.7 + (Math.random() - 0.5) * 2,    // 13.7-15.7 PSI range
        motorSpeed: 1200 + Math.floor(Math.random() * 100), // 1200-1300 RPM
        motorStatus: Math.random() > 0.8 ? "STOPPED" : "RUNNING",
        valve1Position: Math.floor(Math.random() * 100), // 0-100%
        valve2Position: Math.floor(Math.random() * 100), // 0-100%
        flowRate: 150 + (Math.random() - 0.5) * 20,    // 140-160 L/min
        alarms: Math.random() > 0.9 ? ["HIGH_TEMPERATURE"] : [],
        systemStatus: Math.random() > 0.95 ? "ERROR" : "OPERATIONAL",
        timestamp: new Date().toISOString()
      };

      client.publish(MQTT_CONFIG.topics.plcData, JSON.stringify(mockPlcData), { qos: 0 });
      console.log('📤 Sent mock PLC data:', {
        temp: mockPlcData.temperature.toFixed(1),
        motor: mockPlcData.motorStatus,
        status: mockPlcData.systemStatus
      });
    };

    // Send initial data
    sendMockData();
    
    // Send data every 5 seconds
    setInterval(sendMockData, 5000);
  });

  client.on('message', (topic, message) => {
    if (topic === MQTT_CONFIG.topics.plcCommands) {
      const command = JSON.parse(message.toString());
      console.log('📥 Received command:', command);
      
      // Simulate command acknowledgment
      setTimeout(() => {
        const ack = {
          command: command.command,
          status: 'EXECUTED',
          timestamp: new Date().toISOString(),
          response: `Command ${command.command} executed successfully`
        };
        
        console.log('✅ Command executed:', ack.command);
      }, 1000);
    }
  });

  client.on('error', (error) => {
    console.error('❌ MQTT Error:', error);
  });

  client.on('close', () => {
    console.log('🔌 MQTT connection closed');
  });
}

console.log('🎯 Mock PLC Configuration:');
console.log(`   Data Topic: ${MQTT_CONFIG.topics.plcData}`);
console.log(`   Commands Topic: ${MQTT_CONFIG.topics.plcCommands}`);
console.log('');

startMockPLC().catch(console.error);
