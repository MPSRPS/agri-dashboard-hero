
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card } from '@/components/ui/card';
import BudgetPlannerForm from '@/components/budget/BudgetPlannerForm';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface SavedBudget {
  totalBudget: number;
  categories: Array<{
    id: string;
    name: string;
    percentage: number;
    color: string;
  }>;
  userId: string | undefined;
  createdAt: string;
}

const BudgetPlanning = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [savedBudgets, setSavedBudgets] = useState<SavedBudget[]>([]);
  
  useEffect(() => {
    try {
      // Retrieve saved budget plans from localStorage
      const allPlans = JSON.parse(localStorage.getItem('budgetPlans') || '[]');
      // Filter plans for current user
      const userPlans = allPlans.filter((plan: SavedBudget) => plan.userId === user?.id);
      setSavedBudgets(userPlans);
    } catch (error) {
      console.error('Error loading budget plans:', error);
      setSavedBudgets([]);
    }
  }, [user?.id]);
  
  const clearAllBudgets = () => {
    try {
      // Get all plans
      const allPlans = JSON.parse(localStorage.getItem('budgetPlans') || '[]');
      // Filter out current user's plans
      const otherPlans = allPlans.filter((plan: SavedBudget) => plan.userId !== user?.id);
      // Save back only other users' plans
      localStorage.setItem('budgetPlans', JSON.stringify(otherPlans));
      // Update state
      setSavedBudgets([]);
    } catch (error) {
      console.error('Error clearing budget plans:', error);
    }
  };
  
  // Format currency in Indian Rupees
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            {t('budgetPlanning')}
          </h1>
          
          {savedBudgets.length > 0 && (
            <Button 
              variant="outline" 
              onClick={clearAllBudgets}
              className="text-red-500 border-red-200 hover:bg-red-50"
            >
              Clear All Budgets
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetPlannerForm />
          
          <div className="space-y-4">
            <Card className="p-6 border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="h-5 w-5 text-krishi-600" />
                <h2 className="text-xl font-bold text-gray-800">
                  Saved Budget Plans
                </h2>
              </div>
              
              {savedBudgets.length > 0 ? (
                <div className="space-y-4">
                  {savedBudgets.map((budget, index) => (
                    <Card key={index} className="p-4 border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold">
                          {formatCurrency(budget.totalBudget)}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(budget.createdAt)}
                        </span>
                      </div>
                      
                      <div className="grid gap-2">
                        {budget.categories.map((category) => (
                          <div key={category.id} className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                              <div 
                                className="h-2 w-2 rounded-full mr-2" 
                                style={{ backgroundColor: category.color }}
                              />
                              <span>{category.name}</span>
                            </div>
                            <span>
                              {formatCurrency(budget.totalBudget * (category.percentage / 100))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No saved budget plans yet.</p>
                  <p className="text-sm mt-2">
                    Create a budget plan to see it here.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BudgetPlanning;
