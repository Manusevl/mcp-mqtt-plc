export interface PlcData {
  temperature?: number;
  pressure?: number;
  motorSpeed?: number;
  motorStatus?: string;
  valve1Position?: number;
  valve2Position?: number;
  flowRate?: number;
  timestamp?: string;
  alarms?: string[];
  systemStatus?: string;
  [key: string]: any;
}

export interface MqttConfig {
  brokerUrl: string;
  clientId?: string;
  username?: string;
  password?: string;
  topics: {
    plcData: string;
    plcCommands: string;
  };
}

export interface MqttMessage {
  topic: string;
  payload: Buffer | string;
  timestamp: Date;
}