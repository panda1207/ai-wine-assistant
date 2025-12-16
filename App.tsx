import React, { useState, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { ChatBox } from './src/components/ChatBox';
import { mockProduct, mockMessages, quickReplies, recommendedProducts, mockProducts } from './src/data/mockData';
import { Message, QuickReply, Product } from './src/types';

export default function App() {
  const [currentProduct, setCurrentProduct] = useState<Product>(mockProduct);
  const [isChatExpanded, setIsChatExpanded] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const allProducts = useMemo(() => {
    return [...mockProducts, ...recommendedProducts];
  }, []);

  // Get recommendations: all products except current one, limited to 2
  const currentRecommendations = useMemo(() => {
    return allProducts
      .filter(p => p.id !== currentProduct.id)
      .slice(0, 2);
  }, [currentProduct.id, allProducts]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Contextual responses based on quick reply
    if (lowerMessage.includes('tell me more')) {
      return `${currentProduct.name} is truly exceptional. ${currentProduct.description} It's currently priced at $${currentProduct.price.toFixed(2)} and rated ${currentProduct.rating} stars. Would you like to know about its tasting notes or food pairings?`;
    }
    
    if (lowerMessage.includes('view details')) {
      return `You're already viewing the ${currentProduct.name}. Feel free to scroll through all the details, or I can answer specific questions about this wine's characteristics, vintage, or perfect occasions to enjoy it!`;
    }
    
    if (lowerMessage.includes('other options')) {
      const recommendations = currentRecommendations.map(p => p.name).join(' and ');
      return `Great question! Based on ${currentProduct.name}, I'd recommend checking out ${recommendations}. They share similar characteristics but each offers a unique experience. Would you like me to explain what makes each special?`;
    }
    
    if (lowerMessage.includes('food pair')) {
      const pairings = currentProduct.pairings.slice(0, 3).join(', ');
      return `${currentProduct.name} pairs beautifully with ${pairings}. The wine's ${currentProduct.varietal} profile complements rich, savory dishes perfectly. Planning a special meal?`;
    }
    
    // Default response
    return `That's a great question about ${currentProduct.name}! Let me help you with that. Would you like to know more about its tasting profile, food pairings, or find similar wines?`;
  };

  const handleSendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate AI response with contextual answers
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(text),
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickReply = (reply: QuickReply) => {
    handleSendMessage(reply.text);
  };

  const handleToggleChat = () => {
    setIsChatExpanded((prev) => !prev);
  };

  const handleViewProductDetails = () => {
    setIsChatExpanded(false);
  };

  const handleOpenChat = () => {
    setIsChatExpanded(true);
  };

  const handleAddToCart = () => {
    const confirmMessage: Message = {
      id: Date.now().toString(),
      text: `Great choice! I've added ${currentProduct.name} to your cart. Would you like me to suggest wines for your next course?`,
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, confirmMessage]);
    setIsChatExpanded(true);
  };

  const handleProductSelect = (product: Product) => {
    setCurrentProduct(product);
    
    // Create a new chat context for the selected product
    const newMessages: Message[] = [
      {
        id: '1',
        text: 'Hello! I\'m your wine assistant. How can I help you with this wine today?',
        sender: 'assistant',
        timestamp: new Date(Date.now() - 30000),
      },
      {
        id: '2',
        text: `I see you're interested in ${product.name}. This is an excellent choice! Would you like to know more about its characteristics or find the perfect food pairing?`,
        sender: 'assistant',
        timestamp: new Date(Date.now() - 10000),
      },
    ];
    setMessages(newMessages);
    setIsChatExpanded(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.screenContainer}>
        <ProductDetailScreen
          product={currentProduct}
          recommendedProducts={currentRecommendations}
          onAddToCart={handleAddToCart}
          onOpenChat={handleOpenChat}
          onProductSelect={handleProductSelect}
        />
        <ChatBox
          messages={messages}
          quickReplies={quickReplies}
          isExpanded={isChatExpanded}
          isLoading={isLoading}
          onToggle={handleToggleChat}
          onSendMessage={handleSendMessage}
          onQuickReply={handleQuickReply}
          onViewProductDetails={handleViewProductDetails}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  screenContainer: {
    flex: 1,
    position: 'relative',
  },
});
