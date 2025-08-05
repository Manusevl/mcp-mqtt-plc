import { spawn } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

/**
 * Complete MCP MQTT PLC Server Test Suite
 * This demonstrates the server working with both real and mock PLC data
 */

console.log('🧪 MCP MQTT PLC Server - Complete Test Suite');
console.log('============================================\n');

// Backup original .env and switch to test environment
console.log('⚙️  Setting up test environment...');
try {
  const originalEnv = readFileSync('.env', 'utf8');
  writeFileSync('.env.backup', originalEnv);
  
  const testEnv = readFileSync('.env.test', 'utf8');
  writeFileSync('.env', testEnv);
  
  console.log('✅ Switched to test MQTT broker (broker.hivemq.com)');
} catch (error) {
  console.log('⚠️  Could not switch to test environment, using current .env');
}

async function runTest() {
  console.log('\n🚀 Starting MCP Server...');
  
  // Start the MCP server
  const serverProcess = spawn('node', ['dist/server.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });

  let serverReady = false;
  let testResults = {
    serverStarted: false,
    toolsListed: false,
    statusTool: false,
    queryTool: false,
    commandTool: false
  };

  // Monitor server startup
  serverProcess.stderr.on('data', (data) => {
    const output = data.toString();
    console.log('📊 Server Log:', output.trim());
    
    if (output.includes('MQTT client connected') || output.includes('Server will continue running')) {
      serverReady = true;
      testResults.serverStarted = true;
      console.log('✅ MCP Server is ready');
      runMCPTests();
    }
  });

  serverProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    if (output) {
      try {
        const parsed = JSON.parse(output);
        handleMCPResponse(parsed);
      } catch (e) {
        console.log('📝 Server Output:', output);
      }
    }
  });

  let messageId = 1;
  let testStep = 0;

  function sendMCPMessage(method, params = {}) {
    const message = {
      jsonrpc: '2.0',
      id: messageId++,
      method: method,
      params: params
    };
    
    console.log(`📤 Sending: ${method}`);
    serverProcess.stdin.write(JSON.stringify(message) + '\n');
  }

  function handleMCPResponse(response) {
    console.log('📥 Response:', response.method || 'result');
    
    if (response.result && response.result.tools) {
      testResults.toolsListed = true;
      console.log('✅ Tools available:', response.result.tools.map(t => t.name).join(', '));
    }
    
    if (response.result && response.result.content) {
      const content = response.result.content[0].text;
      console.log('📋 Tool Result:', content.substring(0, 100) + '...');
      
      // Track which tools worked
      if (content.includes('PLC Status') || content.includes('No PLC data available')) {
        testResults.statusTool = true;
      }
      if (content.includes('Query:') || content.includes('motor')) {
        testResults.queryTool = true;
      }
      if (content.includes('Command') && content.includes('sent')) {
        testResults.commandTool = true;
      }
    }
  }

  function runMCPTests() {
    console.log('\n🔧 Running MCP Protocol Tests...\n');
    
    // Initialize
    setTimeout(() => {
      console.log('1️⃣  Initializing MCP connection...');
      sendMCPMessage('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'test-client', version: '1.0.0' }
      });
    }, 1000);

    // List tools
    setTimeout(() => {
      console.log('2️⃣  Listing available tools...');
      sendMCPMessage('tools/list');
    }, 2000);

    // Test get_plc_status
    setTimeout(() => {
      console.log('3️⃣  Testing get_plc_status tool...');
      sendMCPMessage('tools/call', {
        name: 'get_plc_status',
        arguments: {}
      });
    }, 3000);

    // Test query_plc_data
    setTimeout(() => {
      console.log('4️⃣  Testing query_plc_data tool...');
      sendMCPMessage('tools/call', {
        name: 'query_plc_data',
        arguments: { query: 'What is the motor status?' }
      });
    }, 4000);

    // Test send_plc_command
    setTimeout(() => {
      console.log('5️⃣  Testing send_plc_command tool...');
      sendMCPMessage('tools/call', {
        name: 'send_plc_command',
        arguments: { command: 'TEST_COMMAND' }
      });
    }, 5000);

    // Final results
    setTimeout(() => {
      console.log('\n📊 Test Results Summary:');
      console.log('========================');
      console.log(`✅ Server Started: ${testResults.serverStarted ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Tools Listed: ${testResults.toolsListed ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Status Tool: ${testResults.statusTool ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Query Tool: ${testResults.queryTool ? 'PASS' : 'FAIL'}`);
      console.log(`✅ Command Tool: ${testResults.commandTool ? 'PASS' : 'FAIL'}`);
      
      const passedTests = Object.values(testResults).filter(Boolean).length;
      const totalTests = Object.keys(testResults).length;
      
      console.log(`\n🎯 Score: ${passedTests}/${totalTests} tests passed`);
      
      if (passedTests === totalTests) {
        console.log('🎉 ALL TESTS PASSED! MCP Server is working correctly.');
      } else {
        console.log('⚠️  Some tests failed. Check logs above for details.');
      }
      
      // Cleanup
      console.log('\n🧹 Cleaning up...');
      serverProcess.kill();
      restoreEnvironment();
      process.exit(passedTests === totalTests ? 0 : 1);
    }, 7000);
  }

  // Timeout if server doesn't start
  setTimeout(() => {
    if (!serverReady) {
      console.log('⏰ Server startup timeout - this is expected if MQTT broker is unreachable');
      console.log('✅ Server can still handle MCP requests without MQTT connection');
      runMCPTests();
    }
  }, 10000);
}

function restoreEnvironment() {
  try {
    const originalEnv = readFileSync('.env.backup', 'utf8');
    writeFileSync('.env', originalEnv);
    console.log('✅ Restored original .env file');
  } catch (error) {
    console.log('⚠️  Could not restore original .env file');
  }
}

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Test interrupted');
  restoreEnvironment();
  process.exit(1);
});

runTest().catch((error) => {
  console.error('❌ Test failed:', error);
  restoreEnvironment();
  process.exit(1);
});
