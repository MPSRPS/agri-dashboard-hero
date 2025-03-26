
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';

const DashboardHeader = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set appropriate greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(t('goodMorning'));
    } else if (hour < 18) {
      setGreeting(t('goodAfternoon'));
    } else {
      setGreeting(t('goodEvening'));
    }
  }, [t]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {greeting}, {user?.name || t('farmer')}
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
  );
};

export default DashboardHeader;
