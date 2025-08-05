#!/usr/bin/env node

/**
 * Persistent MQTT Service for MCP Server
 * Runs as a background service maintaining MQTT connection
 */

import { spawn } from 'child_process';
import { existsSync, writeFileSync, readFileSync } from 'fs';
import { join } from 'path';

const PID_FILE = 'mqtt-service.pid';
const LOG_FILE = 'mqtt-service.log';

class MqttService {
  constructor() {
    this.process = null;
    this.pidFile = join(process.cwd(), PID_FILE);
    this.logFile = join(process.cwd(), LOG_FILE);
  }

  start() {
    if (this.isRunning()) {
      console.log('📡 MQTT Service is already running');
      return;
    }

    console.log('🚀 Starting MQTT Service...');

    const serverProcess = spawn('node', ['dist/server.js'], {
      detached: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });

    // Save PID
    writeFileSync(this.pidFile, serverProcess.pid.toString());

    // Setup logging
    const logStream = require('fs').createWriteStream(this.logFile, { flags: 'a' });
    
    serverProcess.stdout.pipe(logStream);
    serverProcess.stderr.pipe(logStream);

    serverProcess.unref(); // Allow parent to exit

    serverProcess.on('error', (error) => {
      console.error('❌ Failed to start service:', error);
      this.cleanup();
    });

    serverProcess.on('exit', (code) => {
      console.log(`🔚 Service exited with code ${code}`);
      this.cleanup();
    });

    console.log(`✅ MQTT Service started (PID: ${serverProcess.pid})`);
    console.log(`📝 Logs: ${this.logFile}`);
  }

  stop() {
    if (!this.isRunning()) {
      console.log('⚠️  MQTT Service is not running');
      return;
    }

    const pid = this.getPid();
    if (pid) {
      try {
        process.kill(pid, 'SIGTERM');
        console.log(`🛑 Stopped MQTT Service (PID: ${pid})`);
      } catch (error) {
        console.error('❌ Failed to stop service:', error);
      }
    }

    this.cleanup();
  }

  status() {
    if (this.isRunning()) {
      const pid = this.getPid();
      console.log(`✅ MQTT Service is running (PID: ${pid})`);
      
      // Show recent logs
      if (existsSync(this.logFile)) {
        console.log('\n📝 Recent logs:');
        const logs = readFileSync(this.logFile, 'utf8').split('\n').slice(-10);
        logs.forEach(line => line && console.log(`   ${line}`));
      }
    } else {
      console.log('❌ MQTT Service is not running');
    }
  }

  restart() {
    console.log('🔄 Restarting MQTT Service...');
    this.stop();
    setTimeout(() => this.start(), 2000);
  }

  logs() {
    if (existsSync(this.logFile)) {
      const logs = readFileSync(this.logFile, 'utf8');
      console.log(logs);
    } else {
      console.log('📝 No log file found');
    }
  }

  isRunning() {
    if (!existsSync(this.pidFile)) {
      return false;
    }

    const pid = this.getPid();
    if (!pid) return false;

    try {
      process.kill(pid, 0); // Check if process exists
      return true;
    } catch {
      this.cleanup();
      return false;
    }
  }

  getPid() {
    try {
      const pidStr = readFileSync(this.pidFile, 'utf8').trim();
      return parseInt(pidStr);
    } catch {
      return null;
    }
  }

  cleanup() {
    if (existsSync(this.pidFile)) {
      require('fs').unlinkSync(this.pidFile);
    }
  }
}

// CLI Interface
const command = process.argv[2];
const service = new MqttService();

switch (command) {
  case 'start':
    service.start();
    break;
  case 'stop':
    service.stop();
    break;
  case 'restart':
    service.restart();
    break;
  case 'status':
    service.status();
    break;
  case 'logs':
    service.logs();
    break;
  default:
    console.log('🛠️  MQTT Service Manager');
    console.log('\nCommands:');
    console.log('  start   - Start the MQTT service');
    console.log('  stop    - Stop the MQTT service'); 
    console.log('  restart - Restart the MQTT service');
    console.log('  status  - Check service status');
    console.log('  logs    - Show service logs');
    console.log('\nUsage: node scripts/mqtt-service.js <command>');
    break;
}
