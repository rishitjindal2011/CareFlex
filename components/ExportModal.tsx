import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { X, FileText, Share, Download } from 'lucide-react-native';
import { ConversationHistory } from '../types/conversation';

interface ExportModalProps {
  conversation: ConversationHistory;
  visible: boolean;
  onClose: () => void;
}

export function ExportModal({ conversation, visible, onClose }: ExportModalProps) {
  const exportAsTxt = () => {
    // Mock export functionality
    console.log('Exporting as TXT');
    onClose();
  };

  const exportAsPdf = () => {
    // Mock export functionality
    console.log('Exporting as PDF');
    onClose();
  };

  const shareConversation = () => {
    // Mock share functionality
    console.log('Sharing conversation');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Export Conversation</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.description}>
              Choose how you'd like to export this conversation with{' '}
              {conversation.messages.length} messages.
            </Text>

            <View style={styles.options}>
              <TouchableOpacity style={styles.option} onPress={exportAsTxt}>
                <FileText size={24} color="#3B82F6" />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Text File (.txt)</Text>
                  <Text style={styles.optionDescription}>
                    Plain text format, easy to read
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={exportAsPdf}>
                <Download size={24} color="#10B981" />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>PDF Document</Text>
                  <Text style={styles.optionDescription}>
                    Formatted document with timestamps
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.option} onPress={shareConversation}>
                <Share size={24} color="#F59E0B" />
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>Share Directly</Text>
                  <Text style={styles.optionDescription}>
                    Send via email, messaging apps, etc.
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 20,
  },
  options: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  optionContent: {
    marginLeft: 16,
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});