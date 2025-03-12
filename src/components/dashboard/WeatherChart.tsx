
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
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

const weeklyWeatherData = [
  { day: 'Mon', temp: 28, rain: 10 },
  { day: 'Tue', temp: 29, rain: 20 },
  { day: 'Wed', temp: 27, rain: 30 },
  { day: 'Thu', temp: 26, rain: 15 },
  { day: 'Fri', temp: 29, rain: 5 },
  { day: 'Sat', temp: 30, rain: 0 },
  { day: 'Sun', temp: 28, rain: 12 },
];

const WeatherChart = () => {
  const { t } = useTranslation();

  return (
    <Card className="p-4 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-700">{t('weatherForecast')}</h3>
        <span className="text-sm text-gray-500">{t('nextSevenDays')}</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={weeklyWeatherData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="day" axisLine={false} tickLine={false} />
          <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="temp" name="Temp (°C)" fill="#ED8936" radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="rain" name="Rain (mm)" fill="#4299E1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default WeatherChart;
