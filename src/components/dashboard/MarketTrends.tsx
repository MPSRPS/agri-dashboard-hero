
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, DollarSign } from 'lucide-react';
import { AlternativeCrop } from '@/services/cropRecommendationService';

interface MarketTrendsProps {
  mainCrop: {
    name: string;
    marketPrice: number;
    marketTrend: string;
  };
  alternativeCrops?: AlternativeCrop[];
}

const MarketTrends = ({ mainCrop, alternativeCrops = [] }: MarketTrendsProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'falling':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendClass = (trend: string) => {
    switch (trend) {
      case 'rising':
        return 'text-green-600';
      case 'falling':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card className="p-4 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Market Trends
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-medium">{mainCrop.name}</div>
              <div className="text-xs text-gray-600">Recommended crop</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 font-medium">
                <span>₹{mainCrop.marketPrice}/kg</span>
                {getTrendIcon(mainCrop.marketTrend)}
              </div>
              <div className={`text-xs ${getTrendClass(mainCrop.marketTrend)}`}>
                {mainCrop.marketTrend === 'rising' ? 'Rising market' : 
                 mainCrop.marketTrend === 'falling' ? 'Falling market' : 'Stable market'}
              </div>
            </div>
          </div>
        </div>
        
        {alternativeCrops && alternativeCrops.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Alternative Crops</h4>
            <div className="space-y-2">
              {alternativeCrops.map((crop, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm">{crop.name}</div>
                      <div className="text-xs text-gray-500">Match score: {crop.score}%</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span>₹{crop.marketPrice}/kg</span>
                        {getTrendIcon(crop.marketTrend)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MarketTrends;
