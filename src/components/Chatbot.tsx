
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/hooks/useChatbot";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";
import ChatModelInfo from "./chat/ChatModelInfo";
import { useEffect, useState } from "react";

const Chatbot = () => {
  const {
    messages,
    input,
    setInput,
    isExpanded,
    setIsExpanded,
    isLoading,
    handleSendMessage,
    handleKeyDown,
    handleAttachmentChange,
    modelInfo,
    t
  } = useChatbot();

  const [isVisible, setIsVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Handle chat visibility on mobile based on scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > scrollPosition;
      
      // Only hide when scrolling down and chatbot is collapsed
      if (isScrollingDown && !isExpanded && currentScrollPos > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setScrollPosition(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollPosition, isExpanded]);

  return (
    <Card 
      className={cn(
        "fixed right-6 bottom-6 bg-white overflow-hidden transition-all duration-300 ease-in-out border shadow-lg z-50",
        isExpanded 
          ? "w-80 h-[500px] sm:w-96 sm:h-[550px] rounded-xl" 
          : "w-14 h-14 rounded-full cursor-pointer chatbot-pulse",
        !isVisible && !isExpanded ? "translate-y-24 opacity-0" : "translate-y-0 opacity-100"
      )}
      onClick={() => !isExpanded && setIsExpanded(true)}
    >
      {isExpanded ? (
        <div className="flex flex-col h-full">
          <ChatHeader 
            title={t("assistant")} 
            onClose={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }} 
          />
          
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
          />
          
          <ChatInput 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onSend={() => handleSendMessage(input)}
            onKeyDown={handleKeyDown}
            placeholder={t("ask_question")}
            disabled={isLoading}
            onAttachmentChange={handleAttachmentChange}
          />
          
          <ChatModelInfo 
            modelName={modelInfo.name} 
            confidence={modelInfo.confidence} 
          />
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
