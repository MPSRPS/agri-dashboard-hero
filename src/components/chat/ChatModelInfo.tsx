
import { Cpu, BarChart2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatModelInfoProps {
  modelName: string;
  confidence: number;
}

const ChatModelInfo = ({ modelName, confidence }: ChatModelInfoProps) => {
  return (
    <div className="px-3 py-1 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
      <div className="flex items-center gap-1">
        <Cpu size={12} />
        <span>{modelName}</span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-1 cursor-help">
              <BarChart2 size={12} />
              <span>Confidence: {(confidence * 100).toFixed(0)}%</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">The model's confidence in its responses</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ChatModelInfo;
