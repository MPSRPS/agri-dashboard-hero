
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Message } from "@/components/chat/ChatMessages";

export const useChatbot = () => {
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
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const [modelInfo, setModelInfo] = useState({
    name: "gpt-4o-mini",
    confidence: 0.85,
  });

  const handleAttachmentChange = (file: File | null) => {
    setSelectedAttachment(file);
  };

  const uploadAttachment = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id || 'anonymous'}/${fileName}`;
      
      // For now, we'll just return a mock URL since we don't have storage set up
      // In a real implementation, this would upload to Supabase Storage
      return URL.createObjectURL(file);
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const analyzeImage = async (file: File): Promise<string> => {
    // Simplified image description for now
    // This would normally call a vision API
    return `uploaded image (${file.type}, ${Math.round(file.size/1024)}KB)`;
  };

  const handleSendMessage = async (messageText: string) => {
    if ((!messageText.trim() && !selectedAttachment) || isLoading) return;

    let attachmentData = null;
    let attachmentDescription = "";
    
    // Handle file upload if there's an attachment
    if (selectedAttachment) {
      const isImage = selectedAttachment.type.startsWith('image/');
      const fileUrl = await uploadAttachment(selectedAttachment);
      
      if (fileUrl) {
        attachmentData = {
          type: isImage ? "image" : "file",
          url: fileUrl,
          name: selectedAttachment.name
        };
        
        // For images, get a description to send to the AI
        if (isImage) {
          attachmentDescription = await analyzeImage(selectedAttachment);
        }
      } else {
        toast({
          title: "Upload Failed",
          description: "Failed to upload the attachment",
          variant: "destructive",
        });
      }
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: "user",
      timestamp: new Date(),
      attachment: attachmentData
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setSelectedAttachment(null);
    setIsLoading(true);

    try {
      // Prepare message history for context
      const messageHistory = messages.map(msg => ({
        text: msg.text,
        sender: msg.sender
      }));

      // Call the KrishiBot edge function with message history
      const { data, error } = await supabase.functions.invoke("krishibot", {
        body: {
          message: messageText,
          language: currentLanguage,
          userId: user?.id,
          messageHistory: messageHistory,
          attachmentInfo: attachmentDescription
        }
      });

      if (error) {
        throw error;
      }

      // Update model info if provided
      if (data.model) {
        setModelInfo({
          name: data.model,
          confidence: data.confidence || 0.85
        });
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
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(input);
    }
  };

  return {
    messages,
    input,
    setInput,
    isExpanded,
    setIsExpanded,
    isLoading,
    handleSendMessage,
    handleKeyDown,
    handleAttachmentChange,
    selectedAttachment,
    modelInfo,
    t,
    currentLanguage
  };
};
