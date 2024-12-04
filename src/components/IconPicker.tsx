import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Search, X } from 'lucide-react';
import { getIconCategories, searchIcons, getIconNames } from '../lib/icons';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

export default function IconPicker({ value, onChange, onClose }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = getIconCategories();
  const allIcons = getIconNames();

  const filteredIcons = searchQuery 
    ? searchIcons(searchQuery)
    : selectedCategory === 'All'
      ? allIcons
      : categories[selectedCategory] || [];

  const handleSelect = (iconName: string) => {
    onChange(iconName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Select an Icon</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search icons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ed1c24] focus:border-transparent"
            />
          </div>

          <div className="flex space-x-2 mt-4 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedCategory === 'All'
                  ? 'bg-[#ed1c24] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Icons
            </button>
            {Object.keys(categories).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-[#ed1c24] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-6 gap-4">
            {filteredIcons.map((iconName) => (
              <button
                key={iconName}
                onClick={() => handleSelect(iconName)}
                className={`p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                  value === iconName ? 'bg-[#ed1c24] bg-opacity-10 ring-2 ring-[#ed1c24]' : ''
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <FontAwesomeIcon 
                    icon={['fas', iconName]} 
                    className={`text-xl ${value === iconName ? 'text-[#ed1c24]' : 'text-gray-600'}`}
                  />
                  <span className="text-xs text-gray-500 truncate w-full text-center">
                    {iconName}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}