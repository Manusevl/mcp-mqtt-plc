import { spawn } from 'child_process';

/**
 * Simple test client for the MCP MQTT PLC Server
 * This demonstrates how to communicate with the server via stdio
 */

async function testMCPServer() {
  console.log('🚀 Starting MCP MQTT PLC Server test...');
  
  // Spawn the server process
  const serverProcess = spawn('node', ['dist/server.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });

  let messageId = 1;

  // Helper function to send JSON-RPC messages
  function sendMessage(method, params = {}) {
    const message = {
      jsonrpc: '2.0',
      id: messageId++,
      method: method,
      params: params
    };
    const messageStr = JSON.stringify(message) + '\n';
    console.log('📤 Sending:', messageStr.trim());
    serverProcess.stdin.write(messageStr);
  }

  // Listen for server responses
  serverProcess.stdout.on('data', (data) => {
    const response = data.toString().trim();
    if (response) {
      console.log('📥 Received:', response);
      try {
        const parsed = JSON.parse(response);
        console.log('✅ Parsed response:', JSON.stringify(parsed, null, 2));
      } catch (e) {
        console.log('⚠️  Raw response (not JSON):', response);
      }
    }
  });

  serverProcess.stderr.on('data', (data) => {
    console.log('🔴 Server stderr:', data.toString());
  });

  serverProcess.on('close', (code) => {
    console.log(`🔚 Server process exited with code ${code}`);
  });

  // Wait a moment for server to initialize
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test sequence
  console.log('\n🔧 Testing server initialization...');
  sendMessage('initialize', {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  });

  setTimeout(() => {
    console.log('\n📋 Listing available tools...');
    sendMessage('tools/list');
  }, 1000);

  setTimeout(() => {
    console.log('\n🔍 Testing get_plc_status tool...');
    sendMessage('tools/call', {
      name: 'get_plc_status',
      arguments: {}
    });
  }, 2000);

  setTimeout(() => {
    console.log('\n💬 Testing query_plc_data tool...');
    sendMessage('tools/call', {
      name: 'query_plc_data',
      arguments: {
        query: 'What is the motor status?'
      }
    });
  }, 3000);

  setTimeout(() => {
    console.log('\n📤 Testing send_plc_command tool...');
    sendMessage('tools/call', {
      name: 'send_plc_command',
      arguments: {
        command: 'TEST_COMMAND'
      }
    });
  }, 4000);

  // Clean up after 10 seconds
  setTimeout(() => {
    console.log('\n🔚 Test completed. Cleaning up...');
    serverProcess.kill();
    process.exit(0);
  }, 10000);
}

testMCPServer().catch(console.error);
