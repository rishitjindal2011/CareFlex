import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TriangleAlert as AlertTriangle, Phone } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export function EmergencyButton() {
  const [isPressed, setIsPressed] = useState(false);

  const handleEmergencyPress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    
    Alert.alert(
      'Emergency Mode',
      'This will send pre-written emergency messages to your emergency contacts. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Emergency Message',
          style: 'destructive',
          onPress: sendEmergencyMessage
        }
      ]
    );
  };

  const sendEmergencyMessage = () => {
    // In a real app, this would:
    // 1. Send SMS to emergency contacts
    // 2. Display common emergency phrases
    // 3. Increase text size and contrast
    // 4. Enable location sharing
    
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Emergency Message Sent',
      'Your emergency contacts have been notified. Emergency communication mode is now active.'
    );
  };

  return (
    <TouchableOpacity
      style={[styles.button, isPressed && styles.buttonPressed]}
      onPress={handleEmergencyPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
    >
      <AlertTriangle size={20} color="#FFFFFF" />
      <Text style={styles.buttonText}>Emergency</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 8,
  },
  buttonPressed: {
    backgroundColor: '#DC2626',
    elevation: 2,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});