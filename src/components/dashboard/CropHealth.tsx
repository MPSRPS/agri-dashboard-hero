
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface CropHealthProps {
  cropHealthData: Array<{
    name: string;
    value: number;
  }>;
}

const CropHealth = ({ cropHealthData }: CropHealthProps) => {
  const { t } = useTranslation();
  const COLORS = ['#4CAF50', '#FFC107', '#F44336'];

  return (
    <Card className="p-4 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">{t('cropHealth')}</h3>
      </div>
      <div className="flex justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={cropHealthData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {cropHealthData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value, name, props) => [`${value}%`, name]}
              contentStyle={{ background: 'white', border: '1px solid #e2e8f0' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-4 mt-2">
        {cropHealthData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-1" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="text-xs text-gray-600">{entry.name}: {entry.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CropHealth;
