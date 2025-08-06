import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useSelector((state: RootState) => state.auth);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content: `Hi ${user?.firstName || 'there'}! 👋 I'm your DroneDelivery assistant. I can help you with:
        
• Finding restaurants
• Order tracking
• Menu recommendations
• Delivery information
• Account questions

What would you like to know?`,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, user?.firstName]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate API call delay
    setTimeout(() => {
      const botResponse = generateBotResponse(inputValue);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Simple keyword-based responses (in a real app, this would use AI)
    if (input.includes('track') || input.includes('order')) {
      return "I can help you track your order! Please provide your order number, or you can check your order history in the Orders section of your dashboard.";
    }
    
    if (input.includes('restaurant') || input.includes('food') || input.includes('eat')) {
      return "Great! I can help you find restaurants. What type of cuisine are you in the mood for? You can also browse all restaurants in the Restaurants section.";
    }
    
    if (input.includes('delivery') || input.includes('time') || input.includes('how long')) {
      return "Delivery times vary by restaurant and location, but most orders arrive within 20-45 minutes. Our drones make deliveries super fast! ⚡";
    }
    
    if (input.includes('drone') || input.includes('how it works')) {
      return "Our drone delivery system is amazing! 🚁 Once your order is ready, a drone picks it up and flies directly to you. You can track it in real-time on the map!";
    }
    
    if (input.includes('account') || input.includes('profile') || input.includes('settings')) {
      return "You can manage your account in the Profile section. There you can update your information, addresses, payment methods, and preferences.";
    }
    
    if (input.includes('payment') || input.includes('pay') || input.includes('card')) {
      return "We accept all major credit cards, debit cards, and digital wallets. You can manage your payment methods in your profile settings.";
    }
    
    if (input.includes('help') || input.includes('support')) {
      return "I'm here to help! You can ask me about restaurants, orders, delivery, account settings, or anything else related to DroneDelivery.";
    }
    
    if (input.includes('thank') || input.includes('thanks')) {
      return "You're welcome! 😊 Is there anything else I can help you with today?";
    }
    
    // Default response
    return "I understand you're asking about that. Let me help! You can:\n\n• Browse restaurants to place an order\n• Check your order history\n• Track active orders\n• Update your profile settings\n\nIs there something specific you'd like me to help you find?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40 flex items-center justify-center ${
          isOpen ? 'hidden' : 'flex'
        }`}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">DroneDelivery Assistant</h3>
                  <p className="text-xs text-blue-100">Always here to help</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'bot' && (
                        <Bot className="w-4 h-4 mt-1 text-blue-600 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="w-4 h-4 mt-1 text-blue-100 flex-shrink-0" />
                      )}
                      <div className="whitespace-pre-line text-sm leading-relaxed">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-2xl">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;