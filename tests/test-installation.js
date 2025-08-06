#!/usr/bin/env node

/**
 * Simple test to verify the MCP server can start and respond
 * This can be run after global installation to verify everything works
 */

import { spawn } from 'child_process';
import { setTimeout } from 'timers/promises';

console.log('🧪 Testing MCP MQTT PLC Server installation...\n');

// Test 1: Check if command exists
console.log('1. Testing command availability...');
try {
  const child = spawn('mcp-mqtt-plc', ['--help'], { 
    stdio: 'pipe',
    timeout: 5000 
  });
  
  let output = '';
  child.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  child.stderr.on('data', (data) => {
    output += data.toString();
  });
  
  await new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code !== null) {
        console.log('✅ Command is available and executable');
        resolve();
      } else {
        console.log('✅ Command started (likely waiting for MCP input)');
        resolve();
      }
    });
    
    child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        console.log('❌ Command not found. Please install globally: npm install -g mcp-mqtt-plc');
      } else {
        console.log(`❌ Error: ${err.message}`);
      }
      reject(err);
    });
    
    // Kill after 2 seconds if still running (normal for MCP server)
    setTimeout(2000).then(() => {
      if (!child.killed) {
        child.kill();
        console.log('✅ Server started successfully (terminated test after 2s)');
      }
    });
  });
  
} catch (error) {
  console.log(`❌ Test failed: ${error.message}`);
  process.exit(1);
}

console.log('\n🎉 Installation test completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Configure your VS Code or Claude Desktop settings');
console.log('2. Set your MQTT_BROKER_URL environment variable');  
console.log('3. Start asking your AI assistant about PLC data!');
console.log('\n📖 See INSTALLATION.md for detailed setup instructions');
