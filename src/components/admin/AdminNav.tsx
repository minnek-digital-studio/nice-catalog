import React from 'react';
import { Book, ChevronLeft, Settings } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';

interface Props {
  onSignOut: () => void;
}

export default function AdminNav({ onSignOut }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useStore((state) => state.user);
  const currentCatalog = useStore((state) => state.currentCatalog);
  const isActive = (path: string) => location.pathname.startsWith(path);
  const isProductsPage = location.pathname.includes('/products');

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-4">
              {isProductsPage && (
                <button
                  onClick={() => navigate('/admin/catalogs')}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to Catalogs
                </button>
              )}
              <Link
                to="/admin/catalogs"
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  isActive('/admin/catalogs')
                    ? 'text-[#ed1c24] border-b-2 border-[#ed1c24]'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Book className="w-4 h-4 mr-2" />
                {currentCatalog ? currentCatalog.name : 'Catalogs'}
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/admin/settings"
              className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                isActive('/admin/settings')
                  ? 'text-[#ed1c24]'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
            <button
              onClick={onSignOut}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}