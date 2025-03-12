
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Thermometer, Droplets } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
  XAxis
} from 'recharts';

const temperatureData = [
  { name: '6AM', value: 22 },
  { name: '9AM', value: 24 },
  { name: '12PM', value: 28 },
  { name: '3PM', value: 30 },
  { name: '6PM', value: 27 },
  { name: '9PM', value: 25 },
];

const EnvironmentalData = () => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            {t('temperature')}
          </h3>
          <span className="text-xl font-bold text-orange-500">28°C</span>
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={temperatureData}>
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#ED8936" 
              strokeWidth={2} 
              dot={{ r: 0 }}
              activeDot={{ r: 4 }} 
            />
            <Tooltip 
              formatter={(value) => [`${value}°C`, 'Temperature']}
              contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
            />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
      
      <Card className="p-4 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-700 flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            {t('soilMoisture')}
          </h3>
          <span className="text-xl font-bold text-blue-500">65%</span>
        </div>
        <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 rounded-full" 
            style={{ width: '65%' }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0%</span>
          <span className="font-medium text-blue-500">65%</span>
          <span>100%</span>
        </div>
      </Card>
    </div>
  );
};

export default EnvironmentalData;
