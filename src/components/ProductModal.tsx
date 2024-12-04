import React from 'react';
import { X } from 'lucide-react';
import type { Database } from '../types/supabase';
import ProductImage from './ProductImage';

type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row'] | null;
};

interface Props {
  product: Product;
  category?: Database['public']['Tables']['categories']['Row'] | null;
  onClose: () => void;
}

export default function ProductModal({ product, category, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{product.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square w-full relative bg-gray-100 rounded-lg overflow-hidden">
              <ProductImage
                src={product.image_url}
                alt={product.title}
                className="w-full h-full"
                size="lg"
              />
            </div>
            
            <div className="space-y-4">
              {category && (
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {category.name}
                </div>
              )}
              
              <div className="space-y-2">
                {product.price !== null && product.show_price && (
                  <h3 className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</h3>
                )}
                {product.brand && (
                  <p className="text-sm text-gray-500">Brand: {product.brand}</p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}