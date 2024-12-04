import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import IconSearch from './IconSearch';
import IconGrid from './IconGrid';
import { getIconNames } from '../../lib/icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function IconPicker({ value, onChange, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [icons, setIcons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const iconNames = getIconNames();
      setIcons(iconNames);
    } catch (err) {
      setError('Failed to load icons');
      console.error('Error loading icons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredIcons = icons.filter(icon => 
    icon.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    onClose();
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <X className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Icons</h3>
            <p className="text-sm text-gray-500 mb-4">Please try again later.</p>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <IconSearch value={searchQuery} onChange={setSearchQuery} />
        </div>

        <div className="relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ed1c24]"></div>
            </div>
          ) : (
            <div className="p-4">
              <IconGrid
                icons={filteredIcons}
                selectedIcon={value}
                onSelect={handleSelect}
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}