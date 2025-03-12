
import { Home, Leaf, AlertTriangle, Calculator, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const sidebarLinks = [
    {
      title: t('dashboard'),
      icon: Home,
      path: '/dashboard',
    },
    {
      title: t('cropRecommendation'),
      icon: Leaf,
      path: '/crop-recommendation',
    },
    {
      title: t('diseasePrediction'),
      icon: AlertTriangle,
      path: '/disease-prediction',
    },
    {
      title: t('budgetPlanning'),
      icon: Calculator,
      path: '/budget-planning',
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div
      className={cn(
        'h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 transition-all duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
      )}
    >
      <div className="h-full flex flex-col justify-between py-4">
        <div className="px-4 space-y-1">
          {sidebarLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavigation(link.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                location.pathname === link.path
                  ? 'bg-krishi-100 text-krishi-800 dark:bg-krishi-900 dark:text-krishi-300'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              <link.icon className="h-5 w-5" />
              <span className={cn('transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 md:hidden')}>
                {link.title}
              </span>
            </button>
          ))}
        </div>

        <div className="px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className={cn('transition-opacity duration-300', isOpen ? 'opacity-100' : 'opacity-0 md:hidden')}>
              {t('logout')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
