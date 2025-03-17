
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  disabled: boolean;
}

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyDown, 
  placeholder, 
  disabled 
}: ChatInputProps) => {
  return (
    <div className="p-3 border-t">
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="text-sm"
          disabled={disabled}
        />
        <Button 
          size="icon" 
          onClick={onSend}
          className="bg-krishi-500 hover:bg-krishi-600"
          disabled={disabled}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
