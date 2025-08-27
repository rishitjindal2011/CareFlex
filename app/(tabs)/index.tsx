import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Mic, MicOff, Volume2, Copy, Save } from 'lucide-react-native';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BluetoothService } from '../../services/BluetoothService';
import { TranslationDisplay } from '../../components/TranslationDisplay';
import { ConnectionStatus } from '../../components/ConnectionStatus';
import { EmergencyButton } from '../../components/EmergencyButton';

export default function TranslateScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentTranslation, setCurrentTranslation] = useState('');
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [textSize, setTextSize] = useState(20);
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    loadSettings();
    initializeBluetoothConnection();
  }, []);

  const loadSettings = async () => {
    try {
      const speechEnabled = await AsyncStorage.getItem('speechEnabled');
      const savedTextSize = await AsyncStorage.getItem('textSize');
      
      if (speechEnabled !== null) {
        setIsSpeechEnabled(JSON.parse(speechEnabled));
      }
      if (savedTextSize !== null) {
        setTextSize(parseInt(savedTextSize));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const initializeBluetoothConnection = async () => {
    try {
      const bluetoothService = BluetoothService.getInstance();
      await bluetoothService.initialize();
      
      bluetoothService.onTranslationReceived((translation, confidenceScore) => {
        setCurrentTranslation(translation);
        setConfidence(confidenceScore);
        
        if (translation.trim()) {
          handleNewTranslation(translation);
        }
      });

      bluetoothService.onConnectionStatusChanged((connected) => {
        setIsConnected(connected);
        if (connected) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
      });

      bluetoothService.onListeningStateChanged((listening) => {
        setIsListening(listening);
      });

    } catch (error) {
      Alert.alert('Connection Error', 'Failed to initialize Bluetooth connection.');
    }
  };

  const handleNewTranslation = (translation: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const historyEntry = `[${timestamp}] ${translation}`;
    
    setConversationHistory(prev => [...prev, historyEntry]);
    
    if (isSpeechEnabled && translation.trim()) {
      Speech.speak(translation, {
        language: 'en',
        pitch: 1.0,
        rate: 0.8,
      });
    }

    // Haptic feedback for successful translation
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const copyToClipboard = () => {
    if (currentTranslation) {
      // In a real app, you'd use Clipboard API
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      Alert.alert('Copied', 'Translation copied to clipboard');
    }
  };

  const saveConversation = async () => {
    try {
      const conversations = await AsyncStorage.getItem('savedConversations') || '[]';
      const parsed = JSON.parse(conversations);
      const newConversation = {
        id: Date.now(),
        date: new Date().toISOString(),
        messages: conversationHistory,
      };
      
      parsed.push(newConversation);
      await AsyncStorage.setItem('savedConversations', JSON.stringify(parsed));
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Conversation saved to history');
    } catch (error) {
      Alert.alert('Error', 'Failed to save conversation');
    }
  };

  const toggleSpeech = () => {
    const newState = !isSpeechEnabled;
    setIsSpeechEnabled(newState);
    AsyncStorage.setItem('speechEnabled', JSON.stringify(newState));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const clearCurrentSession = () => {
    setConversationHistory([]);
    setCurrentTranslation('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sign Language Translator</Text>
        <ConnectionStatus isConnected={isConnected} />
      </View>

      {/* Main Translation Display */}
      <View style={styles.mainContent}>
        <TranslationDisplay
          translation={currentTranslation}
          textSize={textSize}
          confidence={confidence}
          isListening={isListening}
        />

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, isSpeechEnabled ? styles.activeButton : styles.inactiveButton]}
            onPress={toggleSpeech}
            accessible={true}
            accessibilityLabel={isSpeechEnabled ? "Disable speech" : "Enable speech"}
          >
            {isSpeechEnabled ? <Volume2 size={24} color="#FFFFFF" /> : <MicOff size={24} color="#6B7280" />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={copyToClipboard}
            disabled={!currentTranslation}
            accessible={true}
            accessibilityLabel="Copy translation"
          >
            <Copy size={24} color={currentTranslation ? "#3B82F6" : "#9CA3AF"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={saveConversation}
            disabled={conversationHistory.length === 0}
            accessible={true}
            accessibilityLabel="Save conversation"
          >
            <Save size={24} color={conversationHistory.length > 0 ? "#10B981" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Conversation History */}
      <View style={styles.historyContainer}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Live Conversation</Text>
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearCurrentSession}
            disabled={conversationHistory.length === 0}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView
          style={styles.historyScroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.historyContent}
        >
          {conversationHistory.length === 0 ? (
            <Text style={styles.emptyHistory}>
              {isConnected ? "Start signing to begin translation..." : "Connect your device to start"}
            </Text>
          ) : (
            conversationHistory.map((message, index) => (
              <View key={index} style={styles.historyMessage}>
                <Text style={[styles.historyMessageText, { fontSize: Math.max(textSize - 4, 14) }]}>
                  {message}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Emergency Button */}
      <EmergencyButton />
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
  mainContent: {
    flex: 1,
    padding: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    marginVertical: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  activeButton: {
    backgroundColor: '#3B82F6',
  },
  inactiveButton: {
    backgroundColor: '#F3F4F6',
  },
  historyContainer: {
    height: 200,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  historyScroll: {
    flex: 1,
  },
  historyContent: {
    padding: 15,
  },
  emptyHistory: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 40,
  },
  historyMessage: {
    backgroundColor: '#F9FAFB',
    padding: 10,
    marginVertical: 3,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  historyMessageText: {
    color: '#374151',
    lineHeight: 20,
  },
});