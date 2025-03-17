
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface ChatMessageProps {
  text: string;
  sender: "user" | "bot";
  attachment?: {
    type: "image" | "file";
    url: string;
    name: string;
  };
}

const ChatMessage = ({ text, sender, attachment }: ChatMessageProps) => {
  const [feedback, setFeedback] = useState<"helpful" | "unhelpful" | null>(null);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The message has been copied to your clipboard"
    });
  };

  const handleFeedback = (type: "helpful" | "unhelpful") => {
    setFeedback(type);
    toast({
      title: type === "helpful" ? "Thank you for your feedback" : "We'll try to improve",
      description: "Your feedback helps us improve our agricultural assistant"
    });
  };

  return (
    <div
      className={cn(
        "max-w-[80%] rounded-lg text-sm",
        sender === "user"
          ? "ml-auto"
          : ""
      )}
    >
      <div
        className={cn(
          "p-3 rounded-lg",
          sender === "user"
            ? "bg-krishi-100 text-krishi-800"
            : "bg-gray-100 text-gray-800"
        )}
      >
        {text}
        
        {attachment && (
          <div className="mt-2 border rounded overflow-hidden">
            {attachment.type === "image" ? (
              <img 
                src={attachment.url} 
                alt={attachment.name}
                className="max-w-full h-auto"
              />
            ) : (
              <div className="p-2 flex items-center gap-2 text-xs bg-gray-50">
                <span className="truncate">{attachment.name}</span>
                <a 
                  href={attachment.url} 
                  download
                  className="text-krishi-600 hover:underline"
                >
                  Download
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {sender === "bot" && (
        <div className="flex items-center gap-2 mt-1 opacity-70 hover:opacity-100 transition-opacity">
          <button 
            onClick={() => handleFeedback("helpful")} 
            className={cn(
              "p-1 rounded hover:bg-gray-100", 
              feedback === "helpful" && "text-krishi-500"
            )}
          >
            <ThumbsUp size={14} />
          </button>
          <button 
            onClick={() => handleFeedback("unhelpful")} 
            className={cn(
              "p-1 rounded hover:bg-gray-100", 
              feedback === "unhelpful" && "text-red-500"
            )}
          >
            <ThumbsDown size={14} />
          </button>
          <button 
            onClick={handleCopyToClipboard}
            className="p-1 rounded hover:bg-gray-100 ml-auto"
          >
            <Copy size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
