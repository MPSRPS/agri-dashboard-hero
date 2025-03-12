
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Home, LayoutDashboard, ListChecks, Coins, Sprout, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Define the type for translation keys to ensure type safety
type TranslationKey = Parameters<ReturnType<typeof useTranslation>['t']>[0];

// Define the navigation items with properly typed titles
export const sidebarLinks = [
  {
    title: 'dashboard' as TranslationKey,
    href: '/dashboard',
    icon: LayoutDashboard
  },
  {
    title: 'cropRecommendation' as TranslationKey,
    href: '/crop-recommendation',
    icon: Home
  },
  {
    title: 'diseasePrediction' as TranslationKey,
    href: '/disease-prediction',
    icon: ListChecks
  },
  {
    title: 'budgetPlanning' as TranslationKey,
    href: '/budget-planning',
    icon: Coins
  },
  {
    title: 'fertilizerRecommendation' as TranslationKey,
    href: '/fertilizer-recommendation',
    icon: Sprout
  },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 transition-transform transform-translate-x-0 w-64",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "md:translate-x-0 md:sticky",
      )}
    >
      <div className="h-full px-3 py-4 overflow-y-auto bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center font-bold text-xl text-krishi-700">
            KrishiShakti
          </Link>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        <ul className="space-y-2 font-medium">
          {sidebarLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  "flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group",
                  location.pathname === link.href ? "bg-krishi-100 dark:bg-krishi-700" : ""
                )}
              >
                <link.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                <span className="ml-3">{t(link.title)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
