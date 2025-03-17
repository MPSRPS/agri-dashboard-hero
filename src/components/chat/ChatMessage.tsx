
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  text: string;
  sender: "user" | "bot";
}

const ChatMessage = ({ text, sender }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "max-w-[80%] p-2 rounded-lg text-sm",
        sender === "user"
          ? "ml-auto bg-krishi-100 text-krishi-800"
          : "bg-gray-100 text-gray-800"
      )}
    >
      {text}
    </div>
  );
};

export default ChatMessage;
