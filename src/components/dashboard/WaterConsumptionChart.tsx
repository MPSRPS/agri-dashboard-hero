
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

const waterConsumptionData = [
  { name: 'Jan', value: 1200 },
  { name: 'Feb', value: 1400 },
  { name: 'Mar', value: 1800 },
  { name: 'Apr', value: 2200 },
  { name: 'May', value: 2600 },
  { name: 'Jun', value: 2400 },
];

const WaterConsumptionChart = () => {
  const { t } = useTranslation();

  return (
    <Card className="p-4 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">{t('waterConsumption')}</h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={waterConsumptionData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip 
            formatter={(value) => [`${value} L`, 'Water Usage']}
            contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#4299E1" 
            fill="#BEE3F8" 
            fillOpacity={0.8} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default WaterConsumptionChart;
