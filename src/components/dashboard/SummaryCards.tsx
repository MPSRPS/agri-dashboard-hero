
import { useTranslation } from '@/hooks/useTranslation';
import { Card } from '@/components/ui/card';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';

interface SummaryCardsProps {
  dashboardData: {
    totalCrops: number;
    harvestReady: number;
    pendingTasks: number;
    completedTasks: number;
  };
  isLoading: boolean;
}

const SummaryCards = ({ dashboardData, isLoading }: SummaryCardsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 flex items-center gap-4 bg-krishi-50 border-krishi-100">
        <div className="h-12 w-12 bg-krishi-100 rounded-full flex items-center justify-center">
          <Calendar className="h-6 w-6 text-krishi-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('totalCrops')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{isLoading ? "-" : dashboardData.totalCrops}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center gap-4 bg-soil-50 border-soil-100">
        <div className="h-12 w-12 bg-soil-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-soil-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('harvestReady')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{isLoading ? "-" : dashboardData.harvestReady}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center gap-4 bg-water-50 border-water-100">
        <div className="h-12 w-12 bg-water-100 rounded-full flex items-center justify-center">
          <Clock className="h-6 w-6 text-water-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('pendingTasks')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{isLoading ? "-" : dashboardData.pendingTasks}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center gap-4 bg-growth-50 border-growth-100">
        <div className="h-12 w-12 bg-growth-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-growth-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('completedTasks')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{isLoading ? "-" : dashboardData.completedTasks}</h3>
        </div>
      </Card>
    </div>
  );
};

export default SummaryCards;
