#!/usr/bin/env node

/**
 * Setup Script for MCP MQTT PLC Server
 * Initializes the project with proper configuration
 */

import { existsSync, copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

console.log('🚀 Setting up MCP MQTT PLC Server...\n');

// Ensure .env file exists
if (!existsSync('.env')) {
  if (existsSync('configs/.env.example')) {
    copyFileSync('configs/.env.example', '.env');
    console.log('✅ Created .env file from example');
  } else {
    console.log('⚠️  No .env.example found in configs/');
  }
} else {
  console.log('✅ .env file already exists');
}

// Ensure dist directory exists
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
  console.log('✅ Created dist directory');
} else {
  console.log('✅ dist directory already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your MQTT broker settings');
console.log('2. Run: npm run build');
console.log('3. Run: npm start');
console.log('\n🎯 For testing:');
console.log('- npm run test-mqtt (test MQTT connection)');
console.log('- npm run test (full MCP server test)');
console.log('- npm run mock-plc (start mock PLC simulator)');
console.log('\n✨ Setup complete!');
