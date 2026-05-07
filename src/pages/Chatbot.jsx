import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Card } from '../components/Card';
import { useAuth } from '../contexts/AuthContext';
import { analyzeText } from '../services/sentimentService';

const MOOD_RESPONSES = {
  'Thriving': [
    "That's wonderful! You're in a great place. Keep up the positive momentum!",
    "I'm so happy to hear you're thriving! What's contributing to this positive state?",
    "Your energy is amazing! How can you maintain this wonderful feeling?"
  ],
  'Positive': [
    "I'm glad you're feeling positive! What's bringing you joy today?",
    "That's great to hear! Positive emotions are so important for wellbeing.",
    "Your optimism is inspiring! Keep nurturing those positive feelings."
  ],
  'Balanced': [
    "Balance is a beautiful state. You're managing things well!",
    "It sounds like you're in a good equilibrium. How are you maintaining this balance?",
    "That's a healthy place to be. What's helping you stay balanced?"
  ],
  'Neutral': [
    "I hear you. Sometimes neutral is okay. Is there anything you'd like to explore?",
    "It's okay to feel neutral. Would you like to talk about what's on your mind?",
    "I'm here to listen. What would make today more meaningful for you?"
  ],
  'Low Mood': [
    "I'm sorry you're feeling down. Remember, this feeling is temporary. What usually helps lift your spirits?",
    "It's okay to have low moments. Would you like to talk about what's bothering you?",
    "I'm here for you. Sometimes just acknowledging how we feel can help. What do you need right now?"
  ],
  'Stressed': [
    "I can sense you're feeling stressed. Let's take a deep breath together. What's weighing on you?",
    "Stress can be overwhelming. Have you tried taking a short break or doing something you enjoy?",
    "I'm here to support you. What would help reduce your stress right now?"
  ],
  'Burnout': [
    "Burnout is serious. Please prioritize rest and self-care. Can you take some time for yourself?",
    "I'm concerned about your wellbeing. Have you considered talking to someone or taking a break?",
    "Your health matters most. What can you do today to start recovering from this burnout?"
  ]
};

const GENERAL_RESPONSES = [
  "Tell me more about how you're feeling.",
  "I'm here to listen. What's on your mind?",
  "How has your day been so far?",
  "What would make you feel better right now?",
  "I'm here to support you. How can I help?"
];

const MOTIVATIONAL_MESSAGES = [
  "Remember: You are stronger than you think.",
  "Every small step forward is progress.",
  "Your feelings are valid, and you deserve support.",
  "Take it one moment at a time.",
  "You've overcome challenges before, and you can do it again.",
  "Be kind to yourself today."
];

export function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentMood, setCurrentMood] = useState('Neutral');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChatHistory();
    // Initial greeting
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage("Hello! I'm your AI wellness companion. How are you feeling today?");
      }, 500);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = () => {
    const key = `chat_${user?.email || 'guest'}`;
    const data = localStorage.getItem(key);
    if (data) {
      setMessages(JSON.parse(data));
    }
  };

  const saveChatHistory = (newMessages) => {
    const key = `chat_${user?.email || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(newMessages));
  };

  const addBotMessage = (text) => {
    const botMessage = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => {
      const updated = [...prev, botMessage];
      saveChatHistory(updated);
      return updated;
    });
  };

  const generateResponse = (userText, mood) => {
    const moodResponses = MOOD_RESPONSES[mood] || GENERAL_RESPONSES;
    const response = moodResponses[Math.floor(Math.random() * moodResponses.length)];
    
    // Add motivational message occasionally
    if (Math.random() > 0.7) {
      const motivation = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
      return `${response}\n\n💜 ${motivation}`;
    }
    
    return response;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);

    // Analyze sentiment
    const analysis = analyzeText(input);
    const detectedMood = analysis?.state || 'Neutral';
    setCurrentMood(detectedMood);

    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const response = generateResponse(input, detectedMood);
      addBotMessage(response);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Wellness Companion
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Current mood: <span className="font-semibold text-purple-500">{currentMood}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <Card className="h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender === 'user' 
                      ? 'bg-purple-500' 
                      : 'bg-gradient-to-r from-purple-500 to-purple-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-gray-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts..."
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isTyping}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Quick Tips */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <h3 className="font-bold text-gray-900 dark:text-white">Quick Tips</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>• Share your feelings openly - I'm here to listen without judgment</li>
          <li>• I analyze your mood and provide personalized support</li>
          <li>• Ask me for coping strategies or motivational messages</li>
          <li>• Your conversations are private and stored locally</li>
        </ul>
      </Card>
    </div>
  );
}
