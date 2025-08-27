import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Activity, Mic } from 'lucide-react-native';

interface TranslationDisplayProps {
  translation: string;
  textSize: number;
  confidence: number;
  isListening: boolean;
}

export function TranslationDisplay({ 
  translation, 
  textSize, 
  confidence, 
  isListening 
}: TranslationDisplayProps) {
  const pulseValue = new Animated.Value(1);

  React.useEffect(() => {
    if (isListening) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseValue, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isListening]);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#10B981';
    if (confidence >= 75) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <View style={styles.container}>
      {/* Status Indicator */}
      <View style={styles.statusContainer}>
        <Animated.View 
          style={[
            styles.statusIndicator,
            isListening && { transform: [{ scale: pulseValue }] }
          ]}
        >
          {isListening ? (
            <Mic size={20} color="#3B82F6" />
          ) : (
            <Activity size={20} color="#9CA3AF" />
          )}
        </Animated.View>
        <Text style={styles.statusText}>
          {isListening ? 'Listening for gestures...' : 'Ready to translate'}
        </Text>
      </View>

      {/* Main Translation Display */}
      <View style={styles.translationContainer}>
        {translation ? (
          <>
            <Text 
              style={[
                styles.translationText, 
                { fontSize: Math.max(textSize, 16) }
              ]}
              numberOfLines={0}
            >
              {translation}
            </Text>
            
            {/* Confidence Indicator */}
            <View style={styles.confidenceContainer}>
              <View style={styles.confidenceBar}>
                <View 
                  style={[
                    styles.confidenceFill,
                    { 
                      width: `${confidence}%`,
                      backgroundColor: getConfidenceColor(confidence)
                    }
                  ]} 
                />
              </View>
              <Text 
                style={[
                  styles.confidenceText,
                  { color: getConfidenceColor(confidence) }
                ]}
              >
                {confidence}% confident
              </Text>
            </View>
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={styles.placeholderText}>
              {isListening 
                ? 'Recognizing gesture...' 
                : 'Start signing to see translations here'
              }
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statusText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  translationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  translationText: {
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 1.4,
    marginBottom: 16,
  },
  confidenceContainer: {
    alignItems: 'center',
    width: '100%',
  },
  confidenceBar: {
    height: 6,
    width: '80%',
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '600',
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});