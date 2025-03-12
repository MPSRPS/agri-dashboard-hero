
import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Mic, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const { t, currentLanguage } = useLanguage();
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isExpanded]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = {
        english: "I'm processing your query. In a real application, this would connect to an AI service for personalized agricultural advice.",
        hindi: "मैं आपकी क्वेरी प्रोसेस कर रहा हूं। एक वास्तविक एप्लिकेशन में, यह व्यक्तिगत कृषि सलाह के लिए एक AI सेवा से कनेक्ट होगा।",
        marathi: "मी तुमची चौकशी प्रक्रिया करत आहे. वास्तविक अनुप्रयोगात, हे वैयक्तिक कृषी सल्ल्यासाठी एआय सेवेशी कनेक्ट होईल.",
        punjabi: "ਮੈਂ ਤੁਹਾਡੀ ਪੁੱਛਗਿੱਛ 'ਤੇ ਕਾਰਵਾਈ ਕਰ ਰਿਹਾ ਹਾਂ। ਇੱਕ ਅਸਲ ਐਪਲੀਕੇਸ਼ਨ ਵਿੱਚ, ਇਹ ਨਿੱਜੀ ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਲਈ ਇੱਕ AI ਸੇਵਾ ਨਾਲ ਜੁੜੇਗਾ।",
        bengali: "আমি আপনার কোয়েরি প্রক্রিয়া করছি। একটি বাস্তব অ্যাপ্লিকেশনে, এটি ব্যক্তিগতকৃত কৃষি পরামর্শের জন্য একটি এআই পরিষেবার সাথে সংযুক্ত হবে।",
        tamil: "நான் உங்கள் வினவலை செயலாக்குகிறேன். ஒரு உண்மையான பயன்பாட்டில், இது தனிப்பயனாக்கப்பட்ட விவசாய ஆலோசனைக்காக ஒரு AI சேவையுடன் இணைக்கப்படும்."
      };
      
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponses[currentLanguage as keyof typeof botResponses] || botResponses.english,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
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
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                className="bg-krishi-500 hover:bg-krishi-600"
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
