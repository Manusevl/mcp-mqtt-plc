#!/usr/bin/env node

import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';

/**
 * Simple MCP client to test the MQTT PLC server
 */

console.log('Starting MCP MQTT PLC Server...');

// Import and start our server
import('./dist/server.js').then(() => {
    console.log('Server module loaded');
}).catch(err => {
    console.error('Failed to load server:', err);
});
