export interface UserProfile {
  id: string;
  name: string;
  email: string;
  preferredLanguage: string;
  gestureAccuracy: number;
  totalTranslations: number;
  averageSessionLength: number;
  customGestures: CustomGesture[];
  createdAt: string;
  lastUpdated?: string;
}

export interface CustomGesture {
  id: string;
  name: string;
  description: string;
  accuracy: number;
  timesUsed: number;
  createdAt: string;
  gestureData: any; // Raw gesture sensor data
}

export interface GestureCalibration {
  gestureId: string;
  samples: GestureSample[];
  averageAccuracy: number;
  lastCalibrated: string;
}

export interface GestureSample {
  id: string;
  sensorData: any;
  timestamp: number;
  accuracy: number;
}