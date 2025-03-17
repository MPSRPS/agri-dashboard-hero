
import { Card } from "@/components/ui/card";
import { Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/hooks/useChatbot";
import ChatHeader from "./chat/ChatHeader";
import ChatMessages from "./chat/ChatMessages";
import ChatInput from "./chat/ChatInput";

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
    t
  } = useChatbot();

  return (
    <Card 
      className={cn(
        "fixed right-6 bottom-6 bg-white overflow-hidden transition-all duration-300 ease-in-out border shadow-lg z-50",
        isExpanded 
          ? "w-80 h-96 rounded-xl" 
          : "w-14 h-14 rounded-full cursor-pointer chatbot-pulse"
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
            onSend={handleSendMessage}
            onKeyDown={handleKeyDown}
            placeholder={t("ask_question")}
            disabled={isLoading}
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
