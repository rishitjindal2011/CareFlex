import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bluetooth, Battery, Signal } from 'lucide-react-native';
import { BluetoothDevice } from '../types/bluetooth';

interface DeviceCardProps {
  device: BluetoothDevice;
  isConnected: boolean;
  onPress: () => void;
  actionText: string;
  actionColor: string;
}

export function DeviceCard({ 
  device, 
  isConnected, 
  onPress, 
  actionText, 
  actionColor 
}: DeviceCardProps) {
  const getSignalStrength = (rssi?: number) => {
    if (!rssi) return 0;
    if (rssi > -30) return 100;
    if (rssi > -67) return 75;
    if (rssi > -70) return 50;
    return 25;
  };

  const signalStrength = getSignalStrength(device.rssi);

  return (
    <View style={[styles.container, isConnected && styles.connectedContainer]}>
      <View style={styles.deviceInfo}>
        <View style={styles.header}>
          <Bluetooth size={24} color={isConnected ? '#10B981' : '#3B82F6'} />
          <View style={styles.deviceDetails}>
            <Text style={styles.deviceName}>{device.name}</Text>
            <Text style={styles.deviceId}>ID: {device.id}</Text>
          </View>
        </View>
        
        <View style={styles.metrics}>
          {device.rssi && (
            <View style={styles.metric}>
              <Signal size={16} color="#6B7280" />
              <Text style={styles.metricText}>{signalStrength}%</Text>
            </View>
          )}
          
          {device.batteryLevel && (
            <View style={styles.metric}>
              <Battery size={16} color="#6B7280" />
              <Text style={styles.metricText}>{device.batteryLevel}%</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: actionColor }]}
        onPress={onPress}
      >
        <Text style={styles.actionText}>{actionText}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  connectedContainer: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  deviceInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceDetails: {
    marginLeft: 12,
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  deviceId: {
    fontSize: 12,
    color: '#6B7280',
  },
  metrics: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});