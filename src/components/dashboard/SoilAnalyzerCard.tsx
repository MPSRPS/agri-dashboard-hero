
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  CircleOff, 
  ArrowUpRight, 
  ArrowDownRight, 
  Dot 
} from "lucide-react";
import { cn } from "@/lib/utils";

const SoilParameterRow = ({ 
  name, 
  value, 
  range, 
  status 
}: { 
  name: string; 
  value: number; 
  range: string;
  status: "optimal" | "high" | "low" | "critical" 
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "optimal": return "text-green-600";
      case "high": return "text-amber-600";
      case "low": return "text-blue-600";
      case "critical": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "optimal": return <Dot className="h-5 w-5 text-green-600" />;
      case "high": return <ArrowUpRight className="h-4 w-4 text-amber-600" />;
      case "low": return <ArrowDownRight className="h-4 w-4 text-blue-600" />;
      case "critical": return <CircleOff className="h-4 w-4 text-red-600" />;
      default: return null;
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2">
        {getStatusIcon()}
        <span className="text-sm">{name}</span>
      </div>
      <div className="flex items-center">
        <span className={cn("font-medium text-sm mr-1", getStatusColor())}>
          {value}
        </span>
        <span className="text-xs text-gray-500">{range}</span>
      </div>
    </div>
  );
};

const SoilAnalyzerCard = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Soil Analysis</CardTitle>
        <CardDescription>AI-powered soil health monitor</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <SoilParameterRow 
            name="Nitrogen (N)" 
            value={42} 
            range="ppm" 
            status="optimal" 
          />
          <SoilParameterRow 
            name="Phosphorus (P)" 
            value={38} 
            range="ppm" 
            status="high" 
          />
          <SoilParameterRow 
            name="Potassium (K)" 
            value={156} 
            range="ppm" 
            status="optimal" 
          />
          <SoilParameterRow 
            name="pH Level" 
            value={6.2} 
            range="pH" 
            status="low" 
          />
          <SoilParameterRow 
            name="Organic Matter" 
            value={3.8} 
            range="%" 
            status="optimal" 
          />
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-1">AI Recommendation</h4>
          <p className="text-xs text-blue-700">Apply dolomitic lime at 20 lb/1000 sq ft to gradually increase soil pH to optimal range.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SoilAnalyzerCard;
