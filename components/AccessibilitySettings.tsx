import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Type, Palette, Moon, Eye } from 'lucide-react-native';
import { SettingsSection } from './SettingsSection';

interface AccessibilitySettingsProps {
  settings: any;
  onSettingChange: (key: string, value: any) => void;
  darkMode: boolean;
}

export function AccessibilitySettings({ 
  settings, 
  onSettingChange, 
  darkMode 
}: AccessibilitySettingsProps) {
  const textSizes = [
    { size: 14, label: 'Small' },
    { size: 18, label: 'Medium' },
    { size: 22, label: 'Large' },
    { size: 26, label: 'Extra Large' },
  ];

  return (
    <SettingsSection title="Accessibility" darkMode={darkMode}>
      {/* High Contrast Mode */}
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Eye size={24} color={darkMode ? '#9CA3AF' : '#6B7280'} />
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>
              High Contrast Mode
            </Text>
            <Text style={[styles.settingDescription, darkMode && styles.darkSubText]}>
              Increase color contrast for better visibility
            </Text>
          </View>
        </View>
        <Switch
          value={settings.highContrastMode}
          onValueChange={(value) => onSettingChange('highContrastMode', value)}
          trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
          thumbColor={'#FFFFFF'}
        />
      </View>

      {/* Dark Mode */}
      <View style={styles.settingItem}>
        <View style={styles.settingContent}>
          <Moon size={24} color={darkMode ? '#9CA3AF' : '#6B7280'} />
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingTitle, darkMode && styles.darkText]}>
              Dark Mode
            </Text>
            <Text style={[styles.settingDescription, darkMode && styles.darkSubText]}>
              Use dark theme to reduce eye strain
            </Text>
          </View>
        </View>
        <Switch
          value={settings.darkMode}
          onValueChange={(value) => onSettingChange('darkMode', value)}
          trackColor={{ false: '#E5E7EB', true: '#3B82F6' }}
          thumbColor={'#FFFFFF'}
        />
      </View>

      {/* Text Size */}
      <View style={styles.settingGroup}>
        <View style={styles.settingGroupHeader}>
          <Type size={24} color={darkMode ? '#9CA3AF' : '#6B7280'} />
          <Text style={[styles.settingTitle, darkMode && styles.darkText]}>
            Text Size
          </Text>
        </View>
        <View style={styles.textSizeOptions}>
          {textSizes.map((option) => (
            <TouchableOpacity
              key={option.size}
              style={[
                styles.textSizeButton,
                settings.textSize === option.size && styles.selectedTextSize,
                darkMode && styles.darkTextSizeButton,
                settings.textSize === option.size && darkMode && styles.darkSelectedTextSize,
              ]}
              onPress={() => onSettingChange('textSize', option.size)}
            >
              <Text
                style={[
                  styles.textSizeLabel,
                  { fontSize: option.size },
                  settings.textSize === option.size && styles.selectedTextSizeLabel,
                  darkMode && styles.darkText,
                  settings.textSize === option.size && darkMode && styles.selectedTextSizeLabel,
                ]}
              >
                Aa
              </Text>
              <Text style={[
                styles.textSizeDescription,
                darkMode && styles.darkSubText,
                settings.textSize === option.size && styles.selectedTextSizeLabel,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SettingsSection>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
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
  settingGroup: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingGroupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  textSizeOptions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 40,
  },
  textSizeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  darkTextSizeButton: {
    backgroundColor: '#374151',
  },
  selectedTextSize: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  darkSelectedTextSize: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
  },
  textSizeLabel: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  textSizeDescription: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  selectedTextSizeLabel: {
    color: '#3B82F6',
  },
  darkText: {
    color: '#F9FAFB',
  },
  darkSubText: {
    color: '#9CA3AF',
  },
});