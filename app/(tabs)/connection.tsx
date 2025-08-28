import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Bluetooth, Zap, Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BluetoothDevice } from '../../types/bluetooth';
import { BluetoothService } from '../../services/BluetoothService';
import { DeviceCard } from '../../components/DeviceCard';
import { ConnectionGuide } from '../../components/ConnectionGuide';

export default function ConnectionScreen() {
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<BluetoothDevice | null>(null);
  const [availableDevices, setAvailableDevices] = useState<BluetoothDevice[]>([]);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);

  useEffect(() => {
    checkBluetoothStatus();
    loadConnectedDevice();
  }, []);

  const checkBluetoothStatus = async () => {
    try {
      const bluetoothService = BluetoothService.getInstance();
      const isEnabled = await bluetoothService.isBluetoothEnabled();
      setBluetoothEnabled(isEnabled);
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
    }
  };

  const loadConnectedDevice = async () => {
    try {
      const bluetoothService = BluetoothService.getInstance();
      const device = await bluetoothService.getConnectedDevice();
      setConnectedDevice(device);
    } catch (error) {
      console.error('Error loading connected device:', error);
    }
  };

  const startScanning = async () => {
    if (!bluetoothEnabled) {
      Alert.alert(
        'Bluetooth Disabled',
        'Please enable Bluetooth to scan for devices.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {/* Open Bluetooth settings */} }
        ]
      );
      return;
    }

    setIsScanning(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const bluetoothService = BluetoothService.getInstance();
      const devices = await bluetoothService.scanForDevices();
      setAvailableDevices(devices);
    } catch (error) {
      Alert.alert('Scan Error', 'Failed to scan for devices. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const connectToDevice = async (device: BluetoothDevice) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const bluetoothService = BluetoothService.getInstance();
      
      const success = await bluetoothService.connectToDevice(device);
      if (success) {
        setConnectedDevice(device);
        setAvailableDevices([]);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Connected', `Successfully connected to ${device.name}`);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Connection Failed', 'Unable to connect to the device.');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'An error occurred while connecting to the device.');
    }
  };

  const disconnectDevice = async () => {
    if (!connectedDevice) return;

    Alert.alert(
      'Disconnect Device',
      `Are you sure you want to disconnect from ${connectedDevice.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Disconnect',
          style: 'destructive',
          onPress: async () => {
            try {
              const bluetoothService = BluetoothService.getInstance();
              await bluetoothService.disconnect();
              setConnectedDevice(null);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            } catch (error) {
              Alert.alert('Error', 'Failed to disconnect from device.');
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Device Connection</Text>
        <View style={styles.bluetoothStatus}>
          <Bluetooth size={20} color={bluetoothEnabled ? '#10B981' : '#EF4444'} />
          <Text style={[styles.statusText, { color: bluetoothEnabled ? '#10B981' : '#EF4444' }]}>
            {bluetoothEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Connected Device Section */}
        {connectedDevice && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connected Device</Text>
            <DeviceCard
              device={connectedDevice}
              isConnected={true}
              onPress={disconnectDevice}
              actionText="Disconnect"
              actionColor="#EF4444"
            />
          </View>
        )}

        {/* Scanning Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Devices</Text>
            <TouchableOpacity
              style={[styles.scanButton, isScanning && styles.scanButtonActive]}
              onPress={startScanning}
              disabled={isScanning || !bluetoothEnabled}
            >
              <RefreshCw 
                size={20} 
                color={isScanning || !bluetoothEnabled ? '#9CA3AF' : '#3B82F6'} 
              />
              <Text style={[styles.scanButtonText, isScanning || !bluetoothEnabled ? styles.disabledText : {}]}>
                {isScanning ? 'Scanning...' : 'Scan'}
              </Text>
            </TouchableOpacity>
          </View>

          {availableDevices.length > 0 ? (
            <View style={styles.devicesList}>
              {availableDevices.map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  isConnected={false}
                  onPress={() => connectToDevice(device)}
                  actionText="Connect"
                  actionColor="#10B981"
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              {isScanning ? (
                <>
                  <Wifi size={48} color="#3B82F6" />
                  <Text style={styles.emptyStateText}>Scanning for devices...</Text>
                </>
              ) : (
                <>
                  <WifiOff size={48} color="#9CA3AF" />
                  <Text style={styles.emptyStateText}>
                    {bluetoothEnabled 
                      ? 'No devices found. Tap "Scan" to search for sign language translation devices.'
                      : 'Enable Bluetooth to scan for devices.'
                    }
                  </Text>
                </>
              )}
            </View>
          )}
        </View>

        {/* Connection Guide */}
        <ConnectionGuide />

        {/* Device Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Device Requirements</Text>
          <View style={styles.requirementsList}>
            <View style={styles.requirementItem}>
              <Bluetooth size={20} color="#3B82F6" />
              <Text style={styles.requirementText}>Bluetooth 4.0 or higher</Text>
            </View>
            <View style={styles.requirementItem}>
              <Zap size={20} color="#10B981" />
              <Text style={styles.requirementText}>Low energy consumption</Text>
            </View>
            <View style={styles.requirementItem}>
              <Wifi size={20} color="#F59E0B" />
              <Text style={styles.requirementText}>Real-time data transmission</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  bluetoothStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  scanButtonActive: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  scanButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3B82F6',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  devicesList: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
  },
  requirementsList: {
    gap: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requirementText: {
    fontSize: 16,
    color: '#374151',
  },
});