import React from 'react';
import { ChevronLeft, Settings, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import ThemeToggle from '../ThemeToggle';

interface Props {
  onSignOut: () => void;
}

export default function TopNav({ onSignOut }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const currentCatalog = useStore((state) => state.currentCatalog);
  
  const isSettingsPage = location.pathname === '/admin/settings';
  const isProductsPage = location.pathname.includes('/products');
  const showBackButton = isSettingsPage || isProductsPage;
  
  if (!user) return null;

  const getBackPath = () => {
    if (isSettingsPage) return '/admin/catalogs';
    if (isProductsPage) return '/admin/catalogs';
    return '';
  };

  const getTitle = () => {
    if (isSettingsPage) return 'Settings';
    if (isProductsPage) return currentCatalog?.name;
    return 'My Catalogs';
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            {showBackButton && (
              <button
                onClick={() => navigate(getBackPath())}
                className="mr-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {getTitle()}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {!isSettingsPage && (
              <Link
                to="/admin/settings"
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>
            )}
            <button
              onClick={onSignOut}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}