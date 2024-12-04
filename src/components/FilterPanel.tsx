import React, { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import type { Database } from '../types/supabase';

type Category = Database['public']['Tables']['categories']['Row'];

interface Props {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  brands: string[];
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
}

export default function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  brands,
  selectedBrands,
  onBrandsChange,
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between lg:hidden"
      >
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-gray-500 mr-2" />
          <span className="font-medium text-gray-900">Filters</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? 'max-h-96' : 'max-h-0 lg:max-h-none'
        } overflow-hidden lg:overflow-visible`}
      >
        <div className="p-4 space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  checked={!selectedCategory}
                  onChange={() => onCategoryChange('')}
                  className="h-4 w-4 text-[#ed1c24] focus:ring-[#ed1c24] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-600">All Categories</span>
              </label>
              {categories.map((category) => (
                <label key={category.id} className="flex items-center">
                  <input
                    type="radio"
                    checked={selectedCategory === category.id}
                    onChange={() => onCategoryChange(category.id)}
                    className="h-4 w-4 text-[#ed1c24] focus:ring-[#ed1c24] border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">{category.name}</span>
                </label>
              ))}
            </div>
          </div>

          {brands.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand) => (
                  <label key={brand} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onBrandsChange([...selectedBrands, brand]);
                        } else {
                          onBrandsChange(selectedBrands.filter((b) => b !== brand));
                        }
                      }}
                      className="h-4 w-4 text-[#ed1c24] focus:ring-[#ed1c24] border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}