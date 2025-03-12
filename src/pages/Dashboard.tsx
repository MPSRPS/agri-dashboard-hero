
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { getDashboardData } from '@/lib/supabase';

// Import refactored components
import SummaryCards from '@/components/dashboard/SummaryCards';
import EnvironmentalData from '@/components/dashboard/EnvironmentalData';
import WeatherChart from '@/components/dashboard/WeatherChart';
import DataCharts from '@/components/dashboard/DataCharts';
import FarmIncomeChart from '@/components/dashboard/FarmIncomeChart';
import ChatbotComponent from '@/components/dashboard/ChatbotComponent';

interface DashboardData {
  totalCrops: number;
  harvestReady: number;
  pendingTasks: number;
  completedTasks: number;
}

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalCrops: 0,
    harvestReady: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const data = await getDashboardData(user.id);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {t('welcome')}, {user?.name || t('farmer')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        {/* Summary Cards */}
        <SummaryCards dashboardData={dashboardData} isLoading={isLoading} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Environmental Data */}
          <div className="lg:col-span-2 space-y-6">
            <EnvironmentalData />
            <WeatherChart />
            <DataCharts />
            <FarmIncomeChart />
          </div>
          
          {/* Right Column - Chatbot */}
          <div className="lg:col-span-1">
            <ChatbotComponent />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
