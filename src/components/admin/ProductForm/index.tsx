import React, { useState, useEffect } from 'react';
import { useStore } from '../../../lib/store';
import { Loader2, Plus } from 'lucide-react';
import { useProductForm } from './useProductForm';
import ImageUpload from './ImageUpload';
import ProductPreview from '../ProductPreview';
import CategoryModal from '../CategoryModal';
import BrandModal from '../BrandModal';
import type { Product } from '../../../types/supabase';

interface Props {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: Partial<Product>;
  productId?: string;
}

export default function ProductForm({ onSuccess, onCancel, initialData, productId }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const { categories, brands, fetchCategories, fetchBrands } = useStore();

  const {
    form: {
      register,
      watch,
      formState: { errors },
    },
    loading,
    imageFile,
    imagePreview,
    handleImageChange,
    onSubmit,
    isEditMode,
  } = useProductForm({ onSuccess, initialData, productId });

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, [fetchCategories, fetchBrands]);

  const showPrice = watch('show_price');
  const showPromo = watch('show_promo');
  const formData = watch();

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm"
              placeholder="Enter product name"
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description')}
              className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm"
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="show_price"
                {...register('show_price')}
                className="h-4 w-4 text-[#ed1c24] focus:ring-[#ed1c24] border-gray-300 rounded"
              />
              <label htmlFor="show_price" className="ml-2 block text-sm text-gray-700">
                Display price
              </label>
            </div>

            {showPrice && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    {...register('price', {
                      setValueAs: v => v === '' ? null : parseFloat(v),
                      valueAsNumber: true
                    })}
                    className="block w-full pl-8 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="show_promo"
                {...register('show_promo')}
                className="h-4 w-4 text-[#ed1c24] focus:ring-[#ed1c24] border-gray-300 rounded"
              />
              <label htmlFor="show_price" className="ml-2 block text-sm text-gray-700">
                Display promotion text
              </label>
            </div>

            {showPromo && (
              <div>
                <label htmlFor="promo_text" className="block text-sm font-medium text-gray-700 mb-2">
                  Promotion Text
                </label>
                <input
                  type="text"
                  id="promo_text"
                  {...register('promo_text')}
                  className="block w-full pl-8 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm"
                  placeholder="0.00"
                />
                {errors.promo_text && (
                  <p className="mt-2 text-sm text-red-600">{errors.promo_text.message}</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <div className="flex rounded-lg shadow-sm">
              <select
                {...register('category_id')}
                className="flex-1 w-full px-4 py-3 rounded-l-lg border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm"
              >
                <option value="">Select a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowCategoryModal(true)}
                className="relative -ml-px inline-flex items-center px-4 py-3 rounded-r-lg border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#ed1c24]"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            {errors.category_id && (
              <p className="mt-2 text-sm text-red-600">{errors.category_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <div className="flex rounded-lg shadow-sm">
              <select
                {...register('brand_id')}
                className="flex-1 w-full px-4 py-3 rounded-l-lg border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm"
              >
                <option value="">Select a brand</option>
                {brands?.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowBrandModal(true)}
                className="relative -ml-px inline-flex items-center px-4 py-3 rounded-r-lg border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#ed1c24]"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          <ImageUpload
            imagePreview={imagePreview}
            onImageChange={handleImageChange}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
        >
          Preview
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
        </button>
      </div>

      {showPreview && (
        <ProductPreview
          product={{
            ...formData,
            image_url: imagePreview || '',
          }}
          imageFile={imageFile}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showCategoryModal && (
        <CategoryModal onClose={() => setShowCategoryModal(false)} />
      )}

      {showBrandModal && (
        <BrandModal onClose={() => setShowBrandModal(false)} />
      )}
    </form>
  );
}