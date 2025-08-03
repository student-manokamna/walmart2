
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useProducts } from './ProductsContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  language?: string;
}

interface ChatbotContextType {
  messages: Message[];
  currentLanguage: string;
  availableLanguages: { code: string; name: string; flag: string }[];
  isTyping: boolean;
  sendMessage: (message: string) => void;
  setLanguage: (language: string) => void;
  clearChat: () => void;
  isChatOpen: boolean;
  toggleChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
];

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { products, searchProducts } = useProducts();
  const { toast } = useToast();

  const translations = {
    en: {
      welcome: "Hello! I'm your Walmart AI Assistant. Which language do you prefer?",
      problemQuestion: "What problem are you facing today?",
      notFound: "Sorry, this item is not available. Would you like to see alternatives?",
      found: "Great! I found some options for you.",
      outOfStock: "This item is currently out of stock. I'll notify you when it's back!",
      alternatives: "Here are some similar alternatives:",
    },
    hi: {
      welcome: "नमस्ते! मैं आपका Walmart AI सहायक हूं। आप कौन सी भाषा पसंद करते हैं?",
      problemQuestion: "आज आपको कया समस्या है?",
      notFound: "खुशी है, यह आइटम उपलब्ध नहीं है। क्या आप विकल्प देखना चाहते हैं?",
      found: "बहुत बढ़िया! मैंने आपके लिए कुछ विकल्प खोजे हैं।",
      outOfStock: "यह आइटम फिलहाल स्टॉक में नहीं है। जब यह वापस आएगा तो मैं आपको सूचित करूंगा!",
      alternatives: "यहां कुछ समान विकल्प हैं:",
    },
    ta: {
      welcome: "வணக்கம்! நான் உங்கள் Walmart AI உதவியாளர். எந்த மொழியை விரும்புகிறீர்கள்?",
      problemQuestion: "இன்று உங்களுக்கு என்ன பிரச்சனை?",
      notFound: "மன்னிக்கவும், இந்த பொருள் கிடைக்கவில்லை. மாற்று வழிகளைப் பார்க்க விரும்புகிறீர்களா?",
      found: "சிறப்பு! உங்களுக்கு சில விருப்பங்களைக் கண்டேன்.",
      outOfStock: "இந்த பொருள் தற்போது கையிருப்பில் இல்லை. அது திரும்பும்போது உங்களுக்குத் தெரியப்படுத்துகிறேன்!",
      alternatives: "இதோ சில ஒத்த மாற்றுகள்:",
    }
  };

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: translations[currentLanguage as keyof typeof translations]?.welcome || translations.en.welcome,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage,
      };
      setMessages([welcomeMessage]);
    }
  }, [currentLanguage]);

  const speakMessage = (text: string, language: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const generateBotResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    const currentTranslations = translations[currentLanguage as keyof typeof translations] || translations.en;
    
    // Check if user is asking about a specific product
    const foundProducts = searchProducts(lowerMessage);
    
    if (lowerMessage.includes('rice') || lowerMessage.includes('bread') || lowerMessage.includes('milk')) {
      const specificProducts = products.filter(p => 
        p.name.toLowerCase().includes(lowerMessage) || 
        lowerMessage.includes(p.name.toLowerCase())
      );
      
      if (specificProducts.length > 0) {
        const product = specificProducts[0];
        if (product.inStock) {
          return `${currentTranslations.found} ${product.name} is available for $${product.price}. ${product.distance ? `It's ${product.distance} away in ${product.aisle}.` : 'You can order it online.'}`;
        } else {
          // Simulate stock notification
          setTimeout(() => {
            toast({
              title: "📦 Stock Alert",
              description: `${product.name} is back in stock!`,
            });
          }, 5000);
          return currentTranslations.outOfStock;
        }
      }
    }
    
    if (foundProducts.length > 0) {
      return `${currentTranslations.found} I found ${foundProducts.length} items matching your search. Check the shop page for details!`;
    }
    
    // Default responses for common queries
    if (lowerMessage.includes('help') || lowerMessage.includes('problem')) {
      return currentTranslations.problemQuestion;
    }
    
    if (lowerMessage.includes('find') || lowerMessage.includes('where')) {
      return "I can help you find items! Tell me what you're looking for and I'll guide you to it.";
    }
    
    return currentTranslations.notFound;
  };

  const sendMessage = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      language: currentLanguage,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    
    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        language: currentLanguage,
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      speakMessage(botResponse, currentLanguage);
    }, 1000 + Math.random() * 1000);
  };

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    const confirmationMessage: Message = {
      id: Date.now().toString(),
      text: `Language changed to ${languages.find(l => l.code === language)?.name}. ${translations[language as keyof typeof translations]?.problemQuestion || translations.en.problemQuestion}`,
      sender: 'bot',
      timestamp: new Date(),
      language: language,
    };
    setMessages(prev => [...prev, confirmationMessage]);
  };

  const clearChat = () => {
    setMessages([]);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        currentLanguage,
        availableLanguages: languages,
        isTyping,
        sendMessage,
        setLanguage,
        clearChat,
        isChatOpen,
        toggleChat,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};
