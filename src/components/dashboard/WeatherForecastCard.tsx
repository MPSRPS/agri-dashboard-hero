
import { Card } from '@/components/ui/card';
import { WeatherForecast } from '@/services/cropRecommendationService';
import { Cloud, CloudRain, Sun, Droplets } from 'lucide-react';

interface WeatherForecastCardProps {
  forecast: WeatherForecast;
}

const WeatherForecastCard = ({ forecast }: WeatherForecastCardProps) => {
  const getWeatherIcon = (rainfall: number) => {
    if (rainfall > 10) return <CloudRain className="h-5 w-5 text-blue-500" />;
    if (rainfall > 0) return <Cloud className="h-5 w-5 text-gray-500" />;
    return <Sun className="h-5 w-5 text-yellow-500" />;
  };

  return (
    <Card className="p-4 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
          <Cloud className="h-5 w-5 text-blue-600" />
          7-Day Weather Forecast
        </h3>
        <div className="flex items-center gap-1 text-sm">
          <Droplets className="h-4 w-4 text-blue-500" />
          <span>{forecast.totalExpectedRainfall}mm expected</span>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-2 min-w-max">
          {forecast.forecast.map((day, index) => (
            <div key={index} className="flex-1 bg-gray-50 p-3 rounded-lg text-center min-w-[80px]">
              <div className="text-xs text-gray-500">Day {day.day}</div>
              <div className="my-2 flex justify-center">
                {getWeatherIcon(day.rainfall)}
              </div>
              <div className="text-sm font-medium">{day.temperature}°C</div>
              <div className="text-xs text-gray-500">{day.humidity}% hum</div>
              <div className="text-xs text-blue-500">{day.rainfall}mm</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeatherForecastCard;
