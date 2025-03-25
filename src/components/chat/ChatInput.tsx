import { Button } from "@/components/ui/button";
import { Send, Paperclip, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  placeholder: string;
  disabled: boolean;
  onAttachmentChange?: (file: File | null) => void;
}

const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyDown, 
  placeholder, 
  disabled,
  onAttachmentChange
}: ChatInputProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (onAttachmentChange) {
      onAttachmentChange(file);
    }
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    if (onAttachmentChange) {
      onAttachmentChange(null);
    }
  };

  return (
    <div className="p-3 border-t">
      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-50 rounded flex items-center justify-between text-xs">
          <span className="truncate max-w-[200px]">{selectedFile.name}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={removeAttachment}
          >
            <X size={14} />
          </Button>
        </div>
      )}
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          className="text-sm min-h-[80px] resize-none"
          disabled={disabled}
        />
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-10 w-10"
            disabled={disabled}
            asChild
          >
            <label>
              <Paperclip size={16} />
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
                disabled={disabled}
              />
            </label>
          </Button>
          <Button 
            size="icon" 
            onClick={onSend}
            className="bg-krishi-500 hover:bg-krishi-600 ml-auto"
            disabled={disabled || (!value.trim() && !selectedFile)}
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
