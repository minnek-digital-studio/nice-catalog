import React from 'react';
import { X } from 'lucide-react';

interface Props {
  product: any;
  imageFile: File | null;
  onClose: () => void;
}

export default function ProductPreview({ product, imageFile, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Product Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">No image selected</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold">{product.title || 'Untitled Product'}</h3>
              <p className="text-gray-500">{product.brand || 'No brand specified'}</p>
            </div>

            <div>
              <p className="text-2xl font-bold">${product.price || '0.00'}</p>
              <span className={`inline-block px-2 py-1 text-sm rounded-full ${
                product.stock_status === 'in_stock'
                  ? 'bg-green-100 text-green-800'
                  : product.stock_status === 'low_stock'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {product.stock_status?.replace('_', ' ').toUpperCase() || 'IN STOCK'}
              </span>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{product.description || 'No description provided'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
       <button
  onClick={onClose}
  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
>
  Close Preview
</button>
        </div>
      </div>
    </div>
  );
}