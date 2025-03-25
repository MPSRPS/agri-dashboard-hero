
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Cpu, FileText, BarChart2 } from 'lucide-react';
import ChatHeader from '@/components/chat/ChatHeader';
import ChatMessages from '@/components/chat/ChatMessages';
import { useChatbot } from '@/hooks/useChatbot';
import { useTranslation } from '@/hooks/useTranslation';

const ChatInterface = () => {
  const [inputMessage, setInputMessage] = useState('');
  
  const { 
    messages, 
    isLoading, 
    handleSendMessage: sendChatMessage,
    modelInfo 
  } = useChatbot();
  
  const { t } = useTranslation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;
    
    try {
      await sendChatMessage(inputMessage);
      setInputMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex flex-col h-full border-gray-200">
      <ChatHeader 
        title="KrishiBot Assistant" 
        onClose={() => {}} 
      />
      
      <div className="flex-1 overflow-y-auto p-4">
        <ChatMessages messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>

      {showInfo && (
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Cpu className="h-4 w-4 text-krishi-600" />
              <div>
                <div className="font-medium">Model</div>
                <div>{modelInfo.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <BarChart2 className="h-4 w-4 text-krishi-600" />
              <div>
                <div className="font-medium">Confidence</div>
                <div>{(modelInfo.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 p-2 flex items-center gap-1 justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-gray-500 h-8"
          onClick={() => setShowInfo(!showInfo)}
        >
          <Cpu className="h-3 w-3 mr-1" /> 
          {showInfo ? "Hide Info" : "Show Info"}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-gray-500 h-8"
        >
          <FileText className="h-3 w-3 mr-1" /> 
          History
        </Button>
      </div>
      
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about farming techniques..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading || !inputMessage.trim()}
            className="bg-krishi-600 hover:bg-krishi-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChatInterface;
