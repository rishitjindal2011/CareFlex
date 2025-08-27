import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Calendar, Share, Trash2, FileText } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { ConversationHistory } from '../../types/conversation';
import { ConversationCard } from '../../components/ConversationCard';
import { ExportModal } from '../../components/ExportModal';

export default function HistoryScreen() {
  const [conversations, setConversations] = useState<ConversationHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<ConversationHistory[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<ConversationHistory | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations]);

  const loadConversations = async () => {
    try {
      const savedConversations = await AsyncStorage.getItem('savedConversations');
      if (savedConversations) {
        const parsed = JSON.parse(savedConversations);
        setConversations(parsed.reverse()); // Show newest first
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      Alert.alert('Error', 'Failed to load conversation history');
    }
  };

  const filterConversations = () => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(conversation => 
      conversation.messages.some(message => 
        message.toLowerCase().includes(searchQuery.toLowerCase())
      ) || new Date(conversation.date).toLocaleDateString().includes(searchQuery)
    );
    
    setFilteredConversations(filtered);
  };

  const deleteConversation = async (conversationId: number) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedConversations = conversations.filter(conv => conv.id !== conversationId);
              setConversations(updatedConversations);
              await AsyncStorage.setItem('savedConversations', JSON.stringify(updatedConversations));
              Alert.alert('Deleted', 'Conversation has been deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete conversation');
            }
          }
        }
      ]
    );
  };

  const shareConversation = async (conversation: ConversationHistory) => {
    try {
      const conversationText = formatConversationForExport(conversation);
      
      if (await Sharing.isAvailableAsync()) {
        // Create a temporary file for sharing
        const fileName = `conversation_${new Date(conversation.date).toISOString().split('T')[0]}.txt`;
        // Implementation would depend on file system access
        Alert.alert('Export', 'Conversation prepared for sharing');
      } else {
        Alert.alert('Share Unavailable', 'Sharing is not available on this device');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share conversation');
    }
  };

  const formatConversationForExport = (conversation: ConversationHistory): string => {
    const header = `Sign Language Translation Conversation\nDate: ${new Date(conversation.date).toLocaleString()}\n${'='.repeat(50)}\n\n`;
    const messages = conversation.messages.join('\n\n');
    return header + messages;
  };

  const clearAllHistory = () => {
    Alert.alert(
      'Clear All History',
      'Are you sure you want to delete all conversation history? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              setConversations([]);
              await AsyncStorage.removeItem('savedConversations');
              Alert.alert('Cleared', 'All conversation history has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear history');
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
        <Text style={styles.headerTitle}>Conversation History</Text>
        {conversations.length > 0 && (
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearAllHistory}
          >
            <Trash2 size={20} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {/* Statistics */}
      {conversations.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{conversations.length}</Text>
            <Text style={styles.statLabel}>Conversations</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {conversations.reduce((total, conv) => total + conv.messages.length, 0)}
            </Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {conversations.length > 0 ? Math.round(
                conversations.reduce((total, conv) => total + conv.messages.length, 0) / conversations.length
              ) : 0}
            </Text>
            <Text style={styles.statLabel}>Avg per Conversation</Text>
          </View>
        </View>
      )}

      {/* Conversations List */}
      <ScrollView style={styles.conversationsList} showsVerticalScrollIndicator={false}>
        {filteredConversations.length === 0 ? (
          <View style={styles.emptyState}>
            <FileText size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>
              {searchQuery ? 'No matching conversations' : 'No conversations yet'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'Try adjusting your search terms' 
                : 'Start translating to build your conversation history'
              }
            </Text>
          </View>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationCard
              key={conversation.id}
              conversation={conversation}
              onPress={() => setSelectedConversation(conversation)}
              onDelete={() => deleteConversation(conversation.id)}
              onShare={() => shareConversation(conversation)}
            />
          ))
        )}
      </ScrollView>

      {/* Export Modal */}
      {showExportModal && selectedConversation && (
        <ExportModal
          conversation={selectedConversation}
          visible={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setSelectedConversation(null);
          }}
        />
      )}
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
  clearAllButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#374151',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  conversationsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});