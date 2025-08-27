export interface ConversationHistory {
  id: number;
  date: string;
  messages: string[];
  totalMessages: number;
  averageConfidence?: number;
  participants?: string[];
  tags?: string[];
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  confidence: number;
  speaker: 'user' | 'system';
  originalGesture?: string;
}

export interface ConversationStats {
  totalConversations: number;
  totalMessages: number;
  averageMessagesPerConversation: number;
  mostUsedWords: { word: string; count: number }[];
  averageConfidence: number;
}