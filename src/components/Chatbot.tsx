
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const { t, currentLanguage } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Hello! I'm your agriculture assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isExpanded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the KrishiBot edge function
      const { data, error } = await supabase.functions.invoke("krishibot", {
        body: {
          message: input,
          language: currentLanguage,
          userId: user?.id
        }
      });

      if (error) {
        throw error;
      }

      // Add bot response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.text,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting bot response:", error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive",
      });

      // Add fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <Card 
      className={cn(
        "fixed right-6 bottom-6 bg-white overflow-hidden transition-all duration-300 ease-in-out border shadow-lg",
        isExpanded 
          ? "w-80 h-96 rounded-xl" 
          : "w-14 h-14 rounded-full cursor-pointer chatbot-pulse"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {isExpanded ? (
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 bg-krishi-500 text-white">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <h3 className="text-sm font-medium">{t("assistant")}</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:bg-krishi-600 p-1 h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
            >
              ✕
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[80%] p-2 rounded-lg text-sm",
                  message.sender === "user"
                    ? "ml-auto bg-krishi-100 text-krishi-800"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {message.text}
              </div>
            ))}
            {isLoading && (
              <div className="bg-gray-100 text-gray-800 max-w-[80%] p-2 rounded-lg text-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          <div className="p-3 border-t">
            <div className="flex gap-2">
              <Input
                placeholder={t("ask_question")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm"
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                className="bg-krishi-500 hover:bg-krishi-600"
                disabled={isLoading}
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-krishi-500 text-white">
          <Bot size={20} />
        </div>
      )}
    </Card>
  );
};

export default Chatbot;
