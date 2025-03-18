
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import WeatherWidgets from '@/components/dashboard/WeatherWidgets';
import WeatherForecast from '@/components/dashboard/WeatherForecast';
import CropHealth from '@/components/dashboard/CropHealth';
import WaterConsumption from '@/components/dashboard/WaterConsumption';
import FarmIncome from '@/components/dashboard/FarmIncome';
import ChatInterface from '@/components/dashboard/ChatInterface';

const Dashboard = () => {
  // Mock data for charts
  const temperatureData = [
    { name: '6AM', value: 22 },
    { name: '9AM', value: 24 },
    { name: '12PM', value: 28 },
    { name: '3PM', value: 30 },
    { name: '6PM', value: 27 },
    { name: '9PM', value: 25 },
  ];

  const weeklyWeatherData = [
    { day: 'Mon', temp: 28, rain: 10 },
    { day: 'Tue', temp: 29, rain: 20 },
    { day: 'Wed', temp: 27, rain: 30 },
    { day: 'Thu', temp: 26, rain: 15 },
    { day: 'Fri', temp: 29, rain: 5 },
    { day: 'Sat', temp: 30, rain: 0 },
    { day: 'Sun', temp: 28, rain: 12 },
  ];

  const waterConsumptionData = [
    { name: 'Jan', value: 1200 },
    { name: 'Feb', value: 1400 },
    { name: 'Mar', value: 1800 },
    { name: 'Apr', value: 2200 },
    { name: 'May', value: 2600 },
    { name: 'Jun', value: 2400 },
  ];

  const financeData = [
    { name: 'Jan', revenue: 5000, expenses: 3000 },
    { name: 'Feb', revenue: 4500, expenses: 3200 },
    { name: 'Mar', revenue: 6000, expenses: 3500 },
    { name: 'Apr', revenue: 7000, expenses: 4000 },
    { name: 'May', revenue: 8500, expenses: 4200 },
    { name: 'Jun', revenue: 9000, expenses: 4500 },
  ];

  const cropHealthData = [
    { name: 'Healthy', value: 70 },
    { name: 'At Risk', value: 20 },
    { name: 'Unhealthy', value: 10 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader />
        
        {/* Overview Cards */}
        <DashboardMetrics />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Environmental Data */}
          <div className="lg:col-span-2 space-y-6">
            <WeatherWidgets temperatureData={temperatureData} />
            
            <WeatherForecast weeklyWeatherData={weeklyWeatherData} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CropHealth cropHealthData={cropHealthData} />
              <WaterConsumption waterConsumptionData={waterConsumptionData} />
            </div>
            
            <FarmIncome financeData={financeData} />
          </div>
          
          {/* Right Column - Chatbot */}
          <div className="lg:col-span-1">
            <ChatInterface />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
