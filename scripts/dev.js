#!/usr/bin/env node

/**
 * Development Helper Script
 * Provides utilities for development workflow
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';

const command = process.argv[2];

switch (command) {
  case 'clean':
    console.log('🧹 Cleaning build artifacts...');
    spawn('npx', ['rimraf', 'dist'], { stdio: 'inherit' });
    break;

  case 'dev':
    console.log('🔄 Starting development mode with watch...');
    const tscWatch = spawn('tsc', ['--watch'], { stdio: 'inherit' });
    
    // In a real setup, you might want to restart the server on changes
    console.log('📝 TypeScript compiler watching for changes...');
    console.log('💡 In another terminal, run: npm start');
    break;

  case 'check':
    console.log('🔍 Checking project health...');
    
    // Check if required files exist
    const required = ['.env', 'dist/', 'src/server.ts'];
    let allGood = true;
    
    required.forEach(file => {
      if (existsSync(file)) {
        console.log(`✅ ${file}`);
      } else {
        console.log(`❌ ${file} (missing)`);
        allGood = false;
      }
    });
    
    if (allGood) {
      console.log('\n🎉 Project looks healthy!');
    } else {
      console.log('\n⚠️  Some files are missing. Run: npm run setup');
    }
    break;

  default:
    console.log('🛠️  MCP MQTT PLC Server - Development Helper');
    console.log('\nAvailable commands:');
    console.log('  clean  - Clean build artifacts');
    console.log('  dev    - Start development mode with TypeScript watch');
    console.log('  check  - Check project health');
    console.log('\nUsage: node scripts/dev.js <command>');
    break;
}
