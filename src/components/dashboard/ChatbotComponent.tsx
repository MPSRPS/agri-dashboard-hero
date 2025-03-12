
import { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Send } from 'lucide-react';

const ChatbotComponent = () => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ text: string; isBot: boolean }[]>([]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatMessages([...chatMessages, { text: message, isBot: false }]);
    
    // Simulate bot response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev, 
        { 
          text: "I'm your KrishiBot assistant. How can I help you with your farming needs today?", 
          isBot: true 
        }
      ]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <Card className="border-gray-200 h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-700">{t('chatbot')}</h3>
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
              key={index}
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
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t('chatbotPlaceholder')}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-krishi-500"
          />
          <button
            type="submit"
            className="p-2 bg-krishi-600 text-white rounded-md hover:bg-krishi-700 transition-colors"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </Card>
  );
};

export default ChatbotComponent;
