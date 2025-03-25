
import { useState, useEffect, useRef } from 'react';
import { Send, Bot } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      text: "I'm your KrishiBot assistant. How can I help you with your farming needs today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentLanguage } = useTranslation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isBot: false,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setMessage('');
    
    try {
      // Prepare message history for context
      const messageHistory = chatMessages.map(msg => ({
        text: msg.text,
        sender: msg.isBot ? 'bot' : 'user'
      }));
      
      // Call the KrishiBot edge function
      const { data, error } = await window.supabase.functions.invoke("krishibot", {
        body: {
          message,
          language: currentLanguage,
          userId: user?.id,
          messageHistory: messageHistory
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Add bot response
      setChatMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          text: data.text || "I'm having trouble understanding. Could you rephrase your question?",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive",
      });
      
      // Add error message
      setChatMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting right now. Please try again later.",
          isBot: true,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <Bot className="h-5 w-5 text-krishi-600" />
          {t('chatbot')}
        </h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {chatMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4">
            <div className="w-16 h-16 bg-krishi-100 rounded-full flex items-center justify-center mb-4">
              <Send className="h-8 w-8 text-krishi-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-700">KrishiBot Assistant</h3>
            <p className="text-gray-500 mt-2">
              Ask me anything about crop recommendations, disease identification, or budget planning.
            </p>
          </div>
        ) : (
          chatMessages.map((msg, index) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.isBot
                  ? 'bg-gray-100 text-gray-800 self-start'
                  : 'bg-krishi-600 text-white self-end ml-auto'
              }`}
            >
              {msg.text}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="bg-gray-100 p-3 rounded-lg max-w-[80%] animate-pulse">
            <Skeleton className="h-4 w-32 mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chatbotPlaceholder')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500 disabled:opacity-70 disabled:cursor-not-allowed"
          />
          <Button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="p-2 bg-krishi-600 text-white rounded-md hover:bg-krishi-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default ChatInterface;
