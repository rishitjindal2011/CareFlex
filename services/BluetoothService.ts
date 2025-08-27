// Mock Bluetooth service for demonstration
// In a real implementation, this would use expo-bluetooth or react-native-ble-plx

export interface BluetoothDevice {
  id: string;
  name: string;
  rssi?: number;
  isConnectable: boolean;
}

export interface TranslationData {
  gesture: string;
  confidence: number;
  timestamp: number;
}

export class BluetoothService {
  private static instance: BluetoothService;
  private isConnected: boolean = false;
  private connectedDevice: BluetoothDevice | null = null;
  private isScanning: boolean = false;
  private translationCallback?: (translation: string, confidence: number) => void;
  private connectionCallback?: (connected: boolean) => void;
  private listeningCallback?: (listening: boolean) => void;

  private constructor() {}

  static getInstance(): BluetoothService {
    if (!BluetoothService.instance) {
      BluetoothService.instance = new BluetoothService();
    }
    return BluetoothService.instance;
  }

  async initialize(): Promise<void> {
    // Mock initialization
    console.log('Bluetooth service initialized');
    
    // Simulate receiving translations
    this.simulateTranslations();
  }

  async isBluetoothEnabled(): Promise<boolean> {
    // Mock check - in real implementation would check actual Bluetooth state
    return true;
  }

  async scanForDevices(): Promise<BluetoothDevice[]> {
    this.isScanning = true;
    
    // Mock scan results
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isScanning = false;
        resolve([
          {
            id: 'sign-device-001',
            name: 'SignLang Pro',
            rssi: -45,
            isConnectable: true,
          },
          {
            id: 'sign-device-002',
            name: 'GestureGlove 2.0',
            rssi: -67,
            isConnectable: true,
          },
          {
            id: 'sign-device-003',
            name: 'HandTalk Device',
            rssi: -72,
            isConnectable: true,
          },
        ]);
      }, 2000);
    });
  }

  async connectToDevice(device: BluetoothDevice): Promise<boolean> {
    // Mock connection
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isConnected = true;
        this.connectedDevice = device;
        this.connectionCallback?.(true);
        resolve(true);
      }, 1500);
    });
  }

  async disconnect(): Promise<void> {
    this.isConnected = false;
    this.connectedDevice = null;
    this.connectionCallback?.(false);
  }

  async getConnectedDevice(): Promise<BluetoothDevice | null> {
    return this.connectedDevice;
  }

  onTranslationReceived(callback: (translation: string, confidence: number) => void): void {
    this.translationCallback = callback;
  }

  onConnectionStatusChanged(callback: (connected: boolean) => void): void {
    this.connectionCallback = callback;
  }

  onListeningStateChanged(callback: (listening: boolean) => void): void {
    this.listeningCallback = callback;
  }

  private simulateTranslations(): void {
    // Mock translation simulation for demo purposes
    const mockTranslations = [
      { text: 'Hello', confidence: 95 },
      { text: 'How are you?', confidence: 89 },
      { text: 'Thank you', confidence: 92 },
      { text: 'Good morning', confidence: 87 },
      { text: 'Nice to meet you', confidence: 91 },
      { text: 'I need help', confidence: 88 },
      { text: 'Please', confidence: 93 },
      { text: 'Excuse me', confidence: 85 },
    ];

    let index = 0;
    setInterval(() => {
      if (this.isConnected && this.translationCallback) {
        // Simulate listening state
        this.listeningCallback?.(true);
        
        setTimeout(() => {
          const translation = mockTranslations[index % mockTranslations.length];
          this.translationCallback?.(translation.text, translation.confidence);
          this.listeningCallback?.(false);
          index++;
        }, 2000);
      }
    }, 8000); // New translation every 8 seconds when connected
  }
}