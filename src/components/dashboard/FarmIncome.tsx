
import { BarChart3, Calculator, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { AIMetricsCard } from '@/components/dashboard';

interface FarmIncomeProps {
  financeData: Array<{
    name: string;
    revenue: number;
    expenses: number;
  }>;
}

const FarmIncome = ({ financeData }: FarmIncomeProps) => {
  const { t } = useTranslation();
  const [showReforecast, setShowReforecast] = useState(false);
  
  // Simulate AI-based budget reforecasting
  const reforecastedData = financeData.map(item => ({
    ...item,
    revenue: item.revenue * (1 + Math.random() * 0.2), // Increase by up to 20%
    expenses: item.expenses * (1 - Math.random() * 0.1), // Decrease by up to 10%
  }));
  
  const aiMetrics = {
    modelVersion: "2.3",
    confidenceScore: 87,
    dataPoints: 1420,
    responseTime: 0.8
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-green-600" />
            {t('farmIncome')}
          </h3>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setShowReforecast(!showReforecast)}
          >
            {showReforecast ? (
              <>
                <Calculator className="h-4 w-4" />
                <span>Original Forecast</span>
              </>
            ) : (
              <>
                <TrendingUp className="h-4 w-4" />
                <span>AI Reforecast</span>
              </>
            )}
          </Button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={showReforecast ? reforecastedData : financeData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" name={t('revenue')} fill="#4CAF50" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name={t('expenses')} fill="#F56565" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      
      {showReforecast && (
        <AIMetricsCard metrics={aiMetrics} />
      )}
    </div>
  );
};

export default FarmIncome;
