import React from 'react';
import { X } from 'lucide-react';
import ProductForm from './ProductForm';
import type { Product } from '../../../types/supabase';

interface Props {
  product?: Product;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const isEditMode = Boolean(product);

  return (
    <div className="fixed inset-0 bg-gray-500/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
          <ProductForm
            initialData={product}
            productId={product?.id}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
}