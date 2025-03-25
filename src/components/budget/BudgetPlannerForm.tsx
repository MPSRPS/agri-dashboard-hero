
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { TrendingUp, Save, RotateCcw } from 'lucide-react';

// Budget allocation categories
interface BudgetCategory {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

const initialCategories: BudgetCategory[] = [
  { id: 'seeds', name: 'Seeds', percentage: 20, color: '#4CAF50' },
  { id: 'fertilizers', name: 'Fertilizers', percentage: 25, color: '#2196F3' },
  { id: 'equipment', name: 'Equipment', percentage: 15, color: '#FFC107' },
  { id: 'labor', name: 'Labor', percentage: 30, color: '#9C27B0' },
  { id: 'misc', name: 'Miscellaneous', percentage: 10, color: '#FF5722' },
];

const BudgetPlannerForm = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [totalBudget, setTotalBudget] = useState<number | ''>('');
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format currency in Indian Rupees
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Handle total budget submission
  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!totalBudget || totalBudget <= 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid budget amount greater than zero",
        variant: "destructive"
      });
      return;
    }
    
    setStep(2);
  };

  // Handle category percentage change
  const handleCategoryChange = (index: number, value: number[]) => {
    const newCategories = [...categories];
    const oldPercentage = newCategories[index].percentage;
    const newPercentage = value[0];
    const difference = newPercentage - oldPercentage;
    
    // Adjust other categories proportionally
    if (difference !== 0) {
      const otherCategories = newCategories.filter((_, i) => i !== index);
      const totalOtherPercentage = otherCategories.reduce((sum, cat) => sum + cat.percentage, 0);
      
      if (totalOtherPercentage > 0) {
        newCategories.forEach((cat, i) => {
          if (i !== index) {
            const ratio = cat.percentage / totalOtherPercentage;
            cat.percentage -= difference * ratio;
            // Ensure percentage is not negative and round to nearest integer
            cat.percentage = Math.max(0, Math.round(cat.percentage));
          }
        });
      }
    }
    
    newCategories[index].percentage = newPercentage;
    
    // Ensure total is 100%
    const total = newCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (total !== 100) {
      // Adjust the last category to make total 100%
      const lastAdjustableIndex = newCategories.findIndex((_, i) => i !== index);
      if (lastAdjustableIndex >= 0) {
        newCategories[lastAdjustableIndex].percentage += (100 - total);
      }
    }
    
    setCategories(newCategories);
  };

  // Handle final submission
  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(3);
      
      // Save budget to localStorage for persistence
      if (typeof totalBudget === 'number') {
        const budgetPlan = {
          totalBudget,
          categories,
          userId: user?.id,
          createdAt: new Date().toISOString()
        };
        
        try {
          const savedPlans = JSON.parse(localStorage.getItem('budgetPlans') || '[]');
          savedPlans.push(budgetPlan);
          localStorage.setItem('budgetPlans', JSON.stringify(savedPlans));
          
          toast({
            title: "Budget Plan Saved",
            description: "Your budget plan has been saved successfully",
          });
        } catch (error) {
          console.error('Error saving budget plan:', error);
        }
      }
    }, 1000);
  };

  // Reset the form
  const resetForm = () => {
    setTotalBudget('');
    setCategories(initialCategories);
    setStep(1);
  };

  return (
    <Card className="p-6 border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {t('budgetPlanning')}
        </h2>
        <p className="text-gray-600">
          {step === 1 && "Enter your total budget to get started."}
          {step === 2 && "Allocate your budget across different categories."}
          {step === 3 && "Here's your budget allocation summary."}
        </p>
      </div>
      
      {step === 1 && (
        <form onSubmit={handleBudgetSubmit} className="space-y-4">
          <div>
            <label htmlFor="totalBudget" className="block text-sm font-medium text-gray-700 mb-1">
              Total Budget (₹)
            </label>
            <Input
              id="totalBudget"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.valueAsNumber || '')}
              placeholder="Enter your total budget"
              className="w-full"
              required
              min="1"
            />
          </div>
          <Button type="submit" className="w-full bg-krishi-600 hover:bg-krishi-700">
            Continue
          </Button>
        </form>
      )}
      
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Total Budget: {formatCurrency(Number(totalBudget))}
            </h3>
            <Button 
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="text-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={category.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">
                    {category.name}
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">
                      {formatCurrency(Number(totalBudget) * (category.percentage / 100))}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({category.percentage}%)
                    </span>
                  </div>
                </div>
                <Slider
                  value={[category.percentage]}
                  onValueChange={(value) => handleCategoryChange(index, value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleFinalSubmit} 
            disabled={isSubmitting}
            className="w-full bg-krishi-600 hover:bg-krishi-700"
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Budget Plan
              </>
            )}
          </Button>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-4">
              Budget Allocation Summary
            </h3>
            
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div 
                      className="h-3 w-3 rounded-full mr-2" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm font-medium">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(Number(totalBudget) * (category.percentage / 100))}
                    </div>
                    <div className="text-xs text-gray-500">
                      {category.percentage}%
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{formatCurrency(Number(totalBudget))}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              onClick={resetForm}
              variant="outline"
              className="flex-1"
            >
              Create New Budget
            </Button>
            <Button 
              className="flex-1 bg-krishi-600 hover:bg-krishi-700"
              onClick={() => {
                toast({
                  title: "Success",
                  description: "Budget plan successfully exported"
                });
              }}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default BudgetPlannerForm;
