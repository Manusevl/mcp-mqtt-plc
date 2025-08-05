import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

/**
 * Proper MCP Client to test the MQTT PLC Server
 */

async function testMCPServer() {
  console.log('🚀 Starting MCP MQTT PLC Server Test');
  
  try {
    // Spawn the server process
    const serverProcess = spawn('node', ['dist/server.js'], {
      stdio: ['pipe', 'pipe', 'inherit'], // inherit stderr to see server logs
      cwd: process.cwd()
    });

    // Create transport and client
    const transport = new StdioClientTransport({
      stdin: serverProcess.stdin,
      stdout: serverProcess.stdout
    });

    const client = new Client(
      {
        name: 'test-client',
        version: '1.0.0'
      },
      {
        capabilities: {}
      }
    );

    // Connect to server
    console.log('🔌 Connecting to MCP server...');
    await client.connect(transport);
    console.log('✅ Connected to MCP server');

    // List available tools
    console.log('📋 Listing available tools...');
    const toolsResponse = await client.listTools();
    console.log('Available tools:', toolsResponse.tools.map(t => t.name));

    // Test each tool
    for (const tool of toolsResponse.tools) {
      console.log(`\n🔧 Testing tool: ${tool.name}`);
      
      try {
        let result;
        
        switch (tool.name) {
          case 'get_plc_status':
            result = await client.callTool({
              name: 'get_plc_status',
              arguments: {}
            });
            break;
            
          case 'query_plc_data':
            result = await client.callTool({
              name: 'query_plc_data',
              arguments: {
                query: 'What is the motor status?'
              }
            });
            break;
            
          case 'send_plc_command':
            result = await client.callTool({
              name: 'send_plc_command',
              arguments: {
                command: 'TEST_COMMAND'
              }
            });
            break;
        }
        
        if (result) {
          console.log(`✅ ${tool.name} result:`, result.content[0].text);
        }
      } catch (error) {
        console.log(`❌ ${tool.name} error:`, error.message);
      }
    }

    console.log('\n🎉 Test completed successfully!');
    
    // Cleanup
    await client.close();
    serverProcess.kill();
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testMCPServer().catch(console.error);
