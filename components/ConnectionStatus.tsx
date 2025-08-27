import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bluetooth, BluetoothConnected, CircleAlert as AlertCircle } from 'lucide-react-native';

interface ConnectionStatusProps {
  isConnected: boolean;
  deviceName?: string;
  signalStrength?: number;
}

export function ConnectionStatus({ 
  isConnected, 
  deviceName = 'Unknown Device',
  signalStrength = 0 
}: ConnectionStatusProps) {
  const getStatusColor = () => {
    if (!isConnected) return '#EF4444';
    if (signalStrength < 30) return '#F59E0B';
    return '#10B981';
  };

  const getStatusText = () => {
    if (!isConnected) return 'Disconnected';
    if (signalStrength < 30) return 'Weak Connection';
    return 'Connected';
  };

  const renderIcon = () => {
    if (!isConnected) {
      return <AlertCircle size={18} color="#EF4444" />;
    }
    
    return signalStrength < 30 
      ? <Bluetooth size={18} color="#F59E0B" />
      : <BluetoothConnected size={18} color="#10B981" />;
  };

  return (
    <View style={[styles.container, { backgroundColor: `${getStatusColor()}15` }]}>
      {renderIcon()}
      <View style={styles.statusInfo}>
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
        {isConnected && (
          <Text style={styles.deviceText}>
            {deviceName}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
  },
  statusInfo: {
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deviceText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
});