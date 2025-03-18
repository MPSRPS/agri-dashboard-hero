
import { useTranslation } from '@/hooks/useTranslation';

const DashboardHeader = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {t('welcome')}, Pranav
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
