import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { Message, QuickReply } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface ChatBoxProps {
  messages: Message[];
  quickReplies: QuickReply[];
  isExpanded: boolean;
  isLoading?: boolean;
  error?: string;
  onToggle: () => void;
  onSendMessage: (text: string) => void;
  onQuickReply: (reply: QuickReply) => void;
  onViewProductDetails?: () => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  quickReplies,
  isExpanded,
  isLoading,
  error,
  onToggle,
  onSendMessage,
  onQuickReply,
  onViewProductDetails,
}) => {
  const [inputText, setInputText] = useState('');
  const [animatedHeight] = useState(new Animated.Value(isExpanded ? 600 : 60));
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    Animated.spring(animatedHeight, {
      toValue: isExpanded ? Dimensions.get('window').height * 0.8 : 60,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [isExpanded]);

  React.useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleQuickReplyPress = (reply: QuickReply) => {
    onQuickReply(reply);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  if (!isExpanded) {
    return (
      <TouchableOpacity style={styles.minimizedContainer} onPress={onToggle}>
        <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
        <Text style={styles.minimizedText}>Wine Assistant</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>1</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.expandedContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="wine" size={24} color="#B72E61" />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Wine Assistant</Text>
            <Text style={styles.headerSubtitle}>Online • Happy to help</Text>
          </View>
        </View>
        <TouchableOpacity onPress={onToggle} style={styles.minimizeButton}>
          <Ionicons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.sender === 'user' ? styles.userMessageWrapper : styles.assistantMessageWrapper,
            ]}
          >
            <View
              style={[
                styles.messageBubble,
                message.sender === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.sender === 'user' ? styles.userMessageText : styles.assistantMessageText,
                ]}
              >
                {message.text}
              </Text>
              {message.productReference && (
                <TouchableOpacity
                  style={styles.productReferenceButton}
                  onPress={onViewProductDetails}
                >
                  <Ionicons name="wine-outline" size={16} color="#B72E61" />
                  <Text style={styles.productReferenceText}>View Wine Details</Text>
                  <Ionicons name="chevron-forward" size={16} color="#B72E61" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.timestamp}>
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        ))}

        {isLoading && (
          <View style={styles.typingIndicator}>
            <View style={styles.typingDot} />
            <View style={[styles.typingDot, styles.typingDotDelay1]} />
            <View style={[styles.typingDot, styles.typingDotDelay2]} />
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#d32f2f" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <ScrollView
          horizontal
          style={styles.quickRepliesContainer}
          showsHorizontalScrollIndicator={false}
        >
          {quickReplies.map((reply) => (
            <TouchableOpacity
              key={reply.id}
              style={styles.quickReplyButton}
              onPress={() => handleQuickReplyPress(reply)}
            >
              <Text style={styles.quickReplyText}>{reply.text}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Ask about wines..."
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() ? styles.sendButtonActive : null]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={inputText.trim() ? '#fff' : '#999'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  minimizedContainer: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#B72E61',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  minimizedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#B72E61',
    fontSize: 12,
    fontWeight: 'bold',
  },
  expandedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#4caf50',
    marginTop: 2,
  },
  minimizeButton: {
    padding: 4,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  userMessageWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  assistantMessageWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  messageBubble: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  userMessage: {
    backgroundColor: '#B72E61',
    borderBottomRightRadius: 4,
  },
  assistantMessage: {
    backgroundColor: '#f5f5f5',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: '#fff',
  },
  assistantMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  productReferenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#B72E61',
  },
  productReferenceText: {
    color: '#B72E61',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 4,
    flex: 1,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#999',
    marginHorizontal: 3,
  },
  typingDotDelay1: {
    opacity: 0.7,
  },
  typingDotDelay2: {
    opacity: 0.4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    color: '#d32f2f',
    fontSize: 14,
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  quickRepliesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 16,
    maxHeight: 60,
  },
  quickReplyButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#B72E61',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickReplyText: {
    color: '#B72E61',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 15,
    maxHeight: 100,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#B72E61',
  },
});
