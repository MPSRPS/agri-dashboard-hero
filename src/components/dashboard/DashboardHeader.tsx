
import { useTranslation } from '@/hooks/useTranslation';
import { useAuth } from '@/context/AuthContext';

const DashboardHeader = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {t('welcome')}, {user?.name || 'Guest'}
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
