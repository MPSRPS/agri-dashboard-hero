
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import WeatherWidgets from '@/components/dashboard/WeatherWidgets';
import ChatInterface from '@/components/dashboard/ChatInterface';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SoilAnalyzerCard from '@/components/dashboard/SoilAnalyzerCard';
import CropPerformanceCard from '@/components/dashboard/CropPerformanceCard';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasBudgetPlans, setHasBudgetPlans] = useState(false);
  
  // Check if user has any budget plans
  useEffect(() => {
    if (user?.id) {
      try {
        const allPlans = JSON.parse(localStorage.getItem('budgetPlans') || '[]');
        const userPlans = allPlans.filter((plan: any) => plan.userId === user.id);
        setHasBudgetPlans(userPlans.length > 0);
      } catch (error) {
        console.error('Error checking budget plans:', error);
        setHasBudgetPlans(false);
      }
    }
  }, [user?.id]);

  // Reset dashboard data
  const handleResetDashboard = () => {
    if (window.confirm('Are you sure you want to clear all your dashboard data?')) {
      // We don't clear localStorage completely as it contains user auth info
      // Only clear budget plans for this user
      try {
        const allPlans = JSON.parse(localStorage.getItem('budgetPlans') || '[]');
        const otherPlans = allPlans.filter((plan: any) => plan.userId !== user?.id);
        localStorage.setItem('budgetPlans', JSON.stringify(otherPlans));
        setHasBudgetPlans(false);
        
        toast({
          title: "Dashboard Reset",
          description: "Your dashboard data has been reset successfully.",
        });
      } catch (error) {
        console.error('Error resetting dashboard:', error);
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <DashboardHeader />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-gray-500"
            >
              <Download className="h-4 w-4 mr-2" /> Export Data
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetDashboard}
              className="text-gray-500"
            >
              <RefreshCw className="h-4 w-4 mr-2" /> Reset Dashboard
            </Button>
          </div>
        </div>
        
        <DashboardMetrics />
        
        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {hasBudgetPlans ? (
              <Card className="p-6 border-gray-200">
                <h2 className="text-xl font-bold mb-4">Your Budget Summary</h2>
                <p className="mb-4">You have created budget plans. View and manage them in the Budget Planning section.</p>
                <Button onClick={() => navigate('/budget-planning')} className="bg-krishi-600 hover:bg-krishi-700">
                  View Budget Plans
                </Button>
              </Card>
            ) : (
              <Card className="p-6 border-gray-200">
                <h2 className="text-xl font-bold mb-4">Get Started with Budget Planning</h2>
                <p className="mb-4">Create your first budget plan to optimize your agricultural spending.</p>
                <Button onClick={() => navigate('/budget-planning')} className="bg-krishi-600 hover:bg-krishi-700">
                  Create Budget Plan
                </Button>
              </Card>
            )}
            
            <WeatherWidgets temperatureData={[
              { name: '6AM', value: 22 },
              { name: '9AM', value: 24 },
              { name: '12PM', value: 28 },
              { name: '3PM', value: 30 },
              { name: '6PM', value: 27 },
              { name: '9PM', value: 25 },
            ]} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SoilAnalyzerCard />
              <CropPerformanceCard />
            </div>
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
