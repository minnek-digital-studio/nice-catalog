import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { Database } from '../types/supabase';
import { IconName } from '@fortawesome/fontawesome-svg-core';

type Category = Database['public']['Tables']['categories']['Row'];

interface Props {
  categories: Category[];
  selectedCategory: string;
  onSelect: (categoryId: string) => void;
}

export default function CategoryIcons({ categories, selectedCategory, onSelect }: Props) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex space-x-4 min-w-max pb-4">
        <button
          onClick={() => onSelect('')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            !selectedCategory 
              ? 'bg-[#ed1c24] text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <FontAwesomeIcon icon={['fas', 'grip']} className="w-5 h-5" />
          <span className="text-sm">All Products</span>
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelect(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
              selectedCategory === category.id
                ? 'bg-[#ed1c24] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={['fas', category.icon as IconName]} className="w-5 h-5" />
            <span className="text-sm whitespace-nowrap">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}