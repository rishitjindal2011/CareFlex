import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { User, CreditCard as Edit3, Save, Camera, Globe, Zap } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { UserProfile } from '../../types/profile';
import { GestureAccuracyChart } from '../../components/GestureAccuracyChart';
import { LanguageSelector } from '../../components/LanguageSelector';

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    preferredLanguage: 'en',
    gestureAccuracy: 85,
    totalTranslations: 0,
    averageSessionLength: 0,
    customGestures: [],
    createdAt: new Date().toISOString(),
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        setProfile(parsed);
        setEditedName(parsed.name);
        setEditedEmail(parsed.email);
      } else {
        // Create new profile
        const newProfile = {
          ...profile,
          id: Date.now().toString(),
        };
        await AsyncStorage.setItem('userProfile', JSON.stringify(newProfile));
        setProfile(newProfile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      const updatedProfile = {
        ...profile,
        name: editedName,
        email: editedEmail,
      };
      
      await AsyncStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setIsEditing(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Saved', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const calibrateGestures = () => {
    Alert.alert(
      'Gesture Calibration',
      'This will help improve gesture recognition accuracy by learning your specific signing patterns.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start Calibration', onPress: startCalibration }
      ]
    );
  };

  const startCalibration = () => {
    // In a real app, this would start the calibration process
    Alert.alert('Calibration Started', 'Follow the on-screen instructions to perform gestures');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const exportProfile = () => {
    Alert.alert(
      'Export Profile',
      'Export your profile data including gesture patterns and preferences?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: performExport }
      ]
    );
  };

  const performExport = async () => {
    try {
      // In a real app, this would create a downloadable file
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Exported', 'Profile data has been prepared for export');
    } catch (error) {
      Alert.alert('Error', 'Failed to export profile data');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={isEditing ? saveProfile : () => setIsEditing(true)}
        >
          {isEditing ? <Save size={20} color="#10B981" /> : <Edit3 size={20} color="#3B82F6" />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <User size={40} color="#3B82F6" />
            </View>
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            {isEditing ? (
              <>
                <TextInput
                  style={styles.nameInput}
                  value={editedName}
                  onChangeText={setEditedName}
                  placeholder="Enter your name"
                  placeholderTextColor="#9CA3AF"
                />
                <TextInput
                  style={styles.emailInput}
                  value={editedEmail}
                  onChangeText={setEditedEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  placeholderTextColor="#9CA3AF"
                />
              </>
            ) : (
              <>
                <Text style={styles.profileName}>
                  {profile.name || 'Add your name'}
                </Text>
                <Text style={styles.profileEmail}>
                  {profile.email || 'Add your email'}
                </Text>
              </>
            )}
            
            <Text style={styles.memberSince}>
              Member since {new Date(profile.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profile.gestureAccuracy}%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{profile.totalTranslations}</Text>
            <Text style={styles.statLabel}>Translations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{Math.round(profile.averageSessionLength)}m</Text>
            <Text style={styles.statLabel}>Avg Session</Text>
          </View>
        </View>

        {/* Gesture Accuracy Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gesture Recognition Accuracy</Text>
          <GestureAccuracyChart accuracy={profile.gestureAccuracy} />
        </View>

        {/* Language Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Preferences</Text>
          <LanguageSelector
            selectedLanguage={profile.preferredLanguage}
            onLanguageChange={(language) => {
              setProfile(prev => ({ ...prev, preferredLanguage: language }));
            }}
          />
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Actions</Text>
          
          <TouchableOpacity style={styles.actionItem} onPress={calibrateGestures}>
            <Zap size={24} color="#F59E0B" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Calibrate Gestures</Text>
              <Text style={styles.actionDescription}>
                Improve recognition accuracy by training the system with your gestures
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} onPress={exportProfile}>
            <Globe size={24} color="#8B5CF6" />
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Export Profile Data</Text>
              <Text style={styles.actionDescription}>
                Download your gesture patterns and preferences
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Custom Gestures */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Custom Gestures</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
          
          {profile.customGestures.length === 0 ? (
            <Text style={styles.emptyText}>
              No custom gestures added yet. Create personalized gestures for better recognition.
            </Text>
          ) : (
            profile.customGestures.map((gesture, index) => (
              <View key={index} style={styles.gestureItem}>
                <Text style={styles.gestureName}>{gesture.name}</Text>
                <Text style={styles.gestureAccuracy}>{gesture.accuracy}% accurate</Text>
              </View>
            ))
          )}
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  memberSince: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  nameInput: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    paddingBottom: 4,
    marginBottom: 12,
    minWidth: 200,
    textAlign: 'center',
  },
  emailInput: {
    fontSize: 16,
    color: '#6B7280',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    paddingBottom: 4,
    marginBottom: 8,
    minWidth: 200,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
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
  addButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  actionContent: {
    marginLeft: 16,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  gestureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  gestureName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  gestureAccuracy: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
});