
import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useTranslation } from '@/hooks/useTranslation';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

// Define types for our data
interface Crop {
  id: string;
  crop_name: string;
  status: string;
  user_id: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  user_id: string;
}

const DashboardMetrics = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [metrics, setMetrics] = useState({
    totalCrops: 0,
    harvestReady: 0,
    pendingTasks: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Manual type casting to avoid TypeScript errors while waiting for schema updates
        const { data: cropData, error: cropError } = await supabase
          .from('user_crops')
          .select('*')
          .eq('user_id', user.id);

        const { data: taskData, error: taskError } = await supabase
          .from('user_tasks')
          .select('*')
          .eq('user_id', user.id);

        if (cropError) {
          console.error('Error fetching crops:', cropError);
        }
        
        if (taskError) {
          console.error('Error fetching tasks:', taskError);
        }

        // If we successfully get data, process it
        if (cropData && taskData) {
          const typedCropData = cropData as unknown as Crop[];
          const typedTaskData = taskData as unknown as Task[];
          
          setMetrics({
            totalCrops: typedCropData.length,
            harvestReady: typedCropData.filter(crop => crop.status === 'ready').length,
            pendingTasks: typedTaskData.filter(task => task.status === 'pending').length,
            completedTasks: typedTaskData.filter(task => task.status === 'completed').length
          });
        }
      } catch (error) {
        console.error('Error in fetchMetrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  // Render skeleton UI while loading
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="p-4 flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4 flex items-center gap-4 bg-krishi-50 border-krishi-100">
        <div className="h-12 w-12 bg-krishi-100 rounded-full flex items-center justify-center">
          <Calendar className="h-6 w-6 text-krishi-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('totalCrops')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{metrics.totalCrops}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center gap-4 bg-soil-50 border-soil-100">
        <div className="h-12 w-12 bg-soil-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-soil-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('harvestReady')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{metrics.harvestReady}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center gap-4 bg-water-50 border-water-100">
        <div className="h-12 w-12 bg-water-100 rounded-full flex items-center justify-center">
          <Clock className="h-6 w-6 text-water-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('pendingTasks')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{metrics.pendingTasks}</h3>
        </div>
      </Card>
      
      <Card className="p-4 flex items-center gap-4 bg-growth-50 border-growth-100">
        <div className="h-12 w-12 bg-growth-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-6 w-6 text-growth-700" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{t('completedTasks')}</p>
          <h3 className="text-2xl font-bold text-gray-800">{metrics.completedTasks}</h3>
        </div>
      </Card>
    </div>
  );
};

export default DashboardMetrics;
