import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Volume2, Vibrate, Palette, Type, Moon, Shield, Download, CircleHelp as HelpCircle, ChevronRight, Bell } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { SettingsSection } from '../../components/SettingsSection';
import { AccessibilitySettings } from '../../components/AccessibilitySettings';

interface AppSettings {
  speechEnabled: boolean;
  hapticFeedback: boolean;
  highContrastMode: boolean;
  textSize: number;
  darkMode: boolean;
  notifications: boolean;
  offlineMode: boolean;
  autoSave: boolean;
  gestureTimeout: number;
  confidenceThreshold: number;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<AppSettings>({
    speechEnabled: true,
    hapticFeedback: true,
    highContrastMode: false,
    textSize: 18,
    darkMode: false,
    notifications: true,
    offlineMode: false,
    autoSave: true,
    gestureTimeout: 3,
    confidenceThreshold: 75,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem('appSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
      
      if (settings.hapticFeedback) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save settings');
    }
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    saveSettings(newSettings);
  };

  const resetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to their default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings: AppSettings = {
              speechEnabled: true,
              hapticFeedback: true,
              highContrastMode: false,
              textSize: 18,
              darkMode: false,
              notifications: true,
              offlineMode: false,
              autoSave: true,
              gestureTimeout: 3,
              confidenceThreshold: 75,
            };
            saveSettings(defaultSettings);
            Alert.alert('Reset Complete', 'All settings have been reset to defaults');
          }
        }
      ]
    );
  };

  const exportSettings = () => {
    Alert.alert(
      'Export Settings',
      'Export your current settings configuration?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: performExportSettings }
      ]
    );
  };

  const performExportSettings = async () => {
    try {
      // In a real app, this would create a downloadable file
      if (settings.hapticFeedback) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
      Alert.alert('Exported', 'Settings have been prepared for export');
    } catch (error) {
      Alert.alert('Error', 'Failed to export settings');
    }
  };

  const showHelp = () => {
    Alert.alert(
      'Help & Support',
      'For additional help and support, visit our website or contact our support team.',
      [
        { text: 'OK' },
        { text: 'Contact Support', onPress: () => {} }
      ]
    );
  };

  return (
    <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <StatusBar style={settings.darkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.header, settings.darkMode && styles.darkHeader]}>
        <Text style={[styles.headerTitle, settings.darkMode && styles.darkText]}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Audio Settings */}
        <SettingsSection title="Audio & Feedback" darkMode={settings.darkMode}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Volume2 size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Text-to-Speech
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  Automatically speak translations aloud
                </Text>
              </View>
            </View>
            <Switch
              value={settings.speechEnabled}
              onValueChange={(value) => updateSetting('speechEnabled', value)}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Vibrate size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Haptic Feedback
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  Feel vibrations for app interactions
                </Text>
              </View>
            </View>
            <Switch
              value={settings.hapticFeedback}
              onValueChange={(value) => updateSetting('hapticFeedback', value)}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Bell size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Notifications
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  Receive connection and system alerts
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={(value) => updateSetting('notifications', value)}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
            />
          </View>
        </SettingsSection>

        {/* Accessibility Settings */}
        <AccessibilitySettings
          settings={settings}
          onSettingChange={updateSetting}
          darkMode={settings.darkMode}
        />

        {/* App Behavior */}
        <SettingsSection title="App Behavior" darkMode={settings.darkMode}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Download size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Offline Mode
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  {settings.offlineMode ? 'Enabled - Basic functionality available' : 'Disabled'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.offlineMode}
              onValueChange={(value) => updateSetting('offlineMode', value)}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Shield size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Auto-save Conversations
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  Automatically save conversation history
                </Text>
              </View>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={(value) => updateSetting('autoSave', value)}
              trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
              thumbColor={'#FFFFFF'}
            />
          </TouchableOpacity>
        </SettingsSection>

        {/* Device Calibration */}
        <SettingsSection title="Device Calibration" darkMode={settings.darkMode}>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Type size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Gesture Timeout
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  {settings.gestureTimeout} seconds
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={settings.darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Shield size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Confidence Threshold
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  {settings.confidenceThreshold}% minimum accuracy
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={settings.darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>
        </SettingsSection>

        {/* Advanced */}
        <SettingsSection title="Advanced" darkMode={settings.darkMode}>
          <TouchableOpacity style={styles.settingItem} onPress={exportSettings}>
            <View style={styles.settingContent}>
              <Download size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Export Settings
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  Save your current configuration
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={settings.darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={showHelp}>
            <View style={styles.settingContent}>
              <HelpCircle size={24} color={settings.darkMode ? '#9CA3AF' : '#6B7280'} />
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, settings.darkMode && styles.darkText]}>
                  Help & Support
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  Get help and contact support
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={settings.darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={resetSettings}>
            <View style={styles.settingContent}>
              <View style={styles.settingTextContainer}>
                <Text style={[styles.settingTitle, { color: '#EF4444' }]}>
                  Reset All Settings
                </Text>
                <Text style={[styles.settingDescription, settings.darkMode && styles.darkSubText]}>
                  Restore default configuration
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={settings.darkMode ? '#6B7280' : '#9CA3AF'} />
          </TouchableOpacity>
        </SettingsSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
            }
  ontainer: {
    flex: 1 ,
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
  },
  darkContainer: {
    backgroundColor: '#111827',
  },
  header: {
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
  darkHeader: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubText: {
    color: '#9CA3AF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});