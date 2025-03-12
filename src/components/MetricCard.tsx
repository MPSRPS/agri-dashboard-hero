
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import CircularProgress from "./CircularProgress";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  icon?: ReactNode;
  percentage: number;
  color: string;
  gradientFrom?: string;
  gradientTo?: string;
  className?: string;
}

const MetricCard = ({
  title,
  icon,
  percentage,
  color,
  gradientFrom,
  gradientTo,
  className,
}: MetricCardProps) => {
  const bgGradient = gradientFrom && gradientTo
    ? `linear-gradient(45deg, ${gradientFrom}, ${gradientTo})`
    : color;

  return (
    <Card
      className={cn(
        "flex items-center gap-4 p-4 overflow-hidden transition-all duration-300 hover:shadow-lg border-0",
        className
      )}
      style={{ background: bgGradient }}
    >
      <div className="flex-1">
        <h3 className="text-sm font-medium text-white/90 mb-1">{title}</h3>
        {icon && <div className="text-white/90 mb-2">{icon}</div>}
      </div>
      <CircularProgress 
        percentage={percentage} 
        size={60} 
        strokeWidth={6} 
        color="white" 
        backgroundColor="rgba(255,255,255,0.3)" 
      />
    </Card>
  );
};

export default MetricCard;
