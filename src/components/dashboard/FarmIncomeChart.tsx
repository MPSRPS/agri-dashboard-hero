
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

const financeData = [
  { name: 'Jan', revenue: 5000, expenses: 3000 },
  { name: 'Feb', revenue: 4500, expenses: 3200 },
  { name: 'Mar', revenue: 6000, expenses: 3500 },
  { name: 'Apr', revenue: 7000, expenses: 4000 },
  { name: 'May', revenue: 8500, expenses: 4200 },
  { name: 'Jun', revenue: 9000, expenses: 4500 },
];

const FarmIncomeChart = () => {
  const { t } = useTranslation();

  return (
    <Card className="p-4 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-green-600" />
          {t('farmIncome')}
        </h3>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={financeData}>
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
  );
};

export default FarmIncomeChart;
