import React from 'react';
import { categoryList } from '../data/categories';
import { Heart, SprayCan, Utensils, Coffee, Wheat, LayoutGrid } from 'lucide-react';

interface Props {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const iconMap = {
  heart: Heart,
  'spray-can': SprayCan,
  utensils: Utensils,
  coffee: Coffee,
  wheat: Wheat,
  grid: LayoutGrid,
};

export default function CategoryNav({ selectedCategory, onSelectCategory }: Props) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex space-x-2 min-w-max">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center px-4 py-2 rounded-full transition-all ${
            selectedCategory === 'all'
              ? 'bg-[#ed1c24] text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          <span className="ml-2 whitespace-nowrap hidden sm:inline">
            All Categories
          </span>
        </button>
        {categoryList.map((category) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap];
          return (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center px-4 py-2 rounded-full transition-all ${
                selectedCategory === category.id
                  ? 'bg-[#ed1c24] text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <IconComponent className="w-4 h-4" />
              <span className="ml-2 whitespace-nowrap hidden sm:inline">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}