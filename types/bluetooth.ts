export interface BluetoothDevice {
  id: string;
  name: string;
  rssi?: number;
  isConnectable: boolean;
  batteryLevel?: number;
  firmwareVersion?: string;
}

export interface GestureData {
  type: string;
  confidence: number;
  timestamp: number;
  sensorData?: {
    accelerometer?: { x: number; y: number; z: number };
    gyroscope?: { x: number; y: number; z: number };
    magnetometer?: { x: number; y: number; z: number };
  };
}

export interface TranslationResult {
  originalGesture: string;
  translatedText: string;
  confidence: number;
  language: string;
  timestamp: number;
  context?: string;
}