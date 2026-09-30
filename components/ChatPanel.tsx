import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import { Send, Bot, User, Sparkles, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Button, Input } from './ui';
import { Message } from '../types';
import { useDecisionStore } from '../store/decisionStore';

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  suggestions?: string[];
}

export function ChatPanel({ messages, onSendMessage, suggestions }: ChatPanelProps) {
  const { theme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);
  
  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };
  
  return (
    <Card title="AI Copilot" variant="elevated" padding="none">
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {messages.length === 0 ? (
            <View style={styles.emptyState}>
              <Bot size={48} color={theme.colors.primary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                How can I help?
              </Text>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                Ask me anything about your decision. I can help analyze options, identify risks, or explore scenarios.
              </Text>
            </View>
          ) : (
            messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageWrapper,
                  message.role === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    {
                      backgroundColor:
                        message.role === 'user'
                          ? theme.colors.primary
                          : theme.colors.surface,
                    },
                  ]}
                >
                  <View style={styles.messageHeader}>
                    {message.role === 'user' ? (
                      <User size={14} color={theme.colors.textInverse} />
                    ) : (
                      <Sparkles size={14} color={theme.colors.primary} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color:
                          message.role === 'user'
                            ? theme.colors.textInverse
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {message.content}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
        
        {suggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.suggestionsRow}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.suggestionChip, { backgroundColor: theme.colors.surfaceAlt }]}
                    onPress={() => onSendMessage(suggestion)}
                  >
                    <Text style={[styles.suggestionText, { color: theme.colors.text }]}>
                      {suggestion}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
        
        <View style={[styles.inputContainer, { borderTopColor: theme.colors.border }]}>
          <Input
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Ask about your decision..."
            style={styles.input}
            multiline
            numberOfLines={1}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send size={20} color={theme.colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 500,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  messageWrapper: {
    maxWidth: '85%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
  },
  assistantMessageWrapper: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    padding: 12,
  },
  messageHeader: {
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionsContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  suggestionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  suggestionText: {
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    gap: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    marginBottom: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
