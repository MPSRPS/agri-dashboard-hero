
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AIMetrics } from '@/services/cropRecommendationService';
import { Cpu, BarChart, GitMerge } from 'lucide-react';

interface AIMetricsCardProps {
  metrics: AIMetrics;
}

const AIMetricsCard = ({ metrics }: AIMetricsCardProps) => {
  return (
    <Card className="p-4 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Cpu className="h-5 w-5 text-purple-600" />
          AI Engine Metrics
        </h3>
        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
          Model v{metrics.modelVersion}
        </span>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <GitMerge className="h-4 w-4" />
              Recommendation Confidence
            </span>
            <span className="font-medium">{metrics.confidenceScore}%</span>
          </div>
          <Progress value={metrics.confidenceScore} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Data Points</div>
            <div className="font-medium text-lg">{metrics.dataPoints}</div>
          </div>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-xs text-gray-500">Response Time</div>
            <div className="font-medium text-lg">0.8s</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AIMetricsCard;
