import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, MessageCircle, Share, Trash2 } from 'lucide-react-native';
import { ConversationHistory } from '../types/conversation';

interface ConversationCardProps {
  conversation: ConversationHistory;
  onPress: () => void;
  onDelete: () => void;
  onShare: () => void;
}

export function ConversationCard({ 
  conversation, 
  onPress, 
  onDelete, 
  onShare 
}: ConversationCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getPreviewText = () => {
    if (conversation.messages.length === 0) return 'No messages';
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    // Remove timestamp from message if present
    const cleanMessage = lastMessage.replace(/^\[\d{1,2}:\d{2}:\d{2} [AP]M\]\s*/, '');
    return cleanMessage.length > 60 ? cleanMessage.substring(0, 60) + '...' : cleanMessage;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.dateText}>{formatDate(conversation.date)}</Text>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onShare}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Share size={16} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onDelete}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Trash2 size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.messageInfo}>
          <MessageCircle size={18} color="#9CA3AF" />
          <Text style={styles.messageCount}>
            {conversation.messages.length} message{conversation.messages.length !== 1 ? 's' : ''}
          </Text>
        </View>
        
        <Text style={styles.preview}>{getPreviewText()}</Text>
      </View>

      {conversation.averageConfidence && (
        <View style={styles.footer}>
          <Text style={styles.confidenceText}>
            Avg. Confidence: {Math.round(conversation.averageConfidence)}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  content: {
    marginBottom: 8,
  },
  messageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  messageCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  preview: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  confidenceText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
});