
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";

interface ChatHeaderProps {
  title: string;
  onClose?: (e: React.MouseEvent) => void;
}

const ChatHeader = ({ title, onClose }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-krishi-500 text-white">
      <div className="flex items-center gap-2">
        <Bot size={18} />
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {onClose && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white hover:bg-krishi-600 p-1 h-6 w-6"
          onClick={onClose}
        >
          ✕
        </Button>
      )}
    </div>
  );
};

export default ChatHeader;
