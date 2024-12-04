import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../../lib/store';
import { uploadProductImage } from '../../../lib/storage';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import FormField from './FormField';
import ImageUpload from './ImageUpload';
import type { Product } from '../../../types';

const schema = z.object({
  title: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive').optional(),
  category_id: z.string().min(1, 'Category is required'),
  image_url: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  initialData?: Product;
  productId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ initialData, productId, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { createProduct, updateProduct, categories } = useStore();
  const isEditMode = Boolean(productId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData || {
      title: '',
      description: '',
      price: 0,
      category_id: '',
    }
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      let imageUrl = initialData?.image_url;
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const productData = {
        ...data,
        image_url: imageUrl || '',
        slug: data.title.toLowerCase().replace(/\s+/g, '-'),
      };

      if (isEditMode && productId) {
        await updateProduct(productId, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <FormField
          label="Product Name"
          error={errors.title?.message}
          required
        >
          <input
            type="text"
            {...register('title')}
            className="form-input"
            placeholder="Enter product name"
          />
        </FormField>

        <FormField
          label="Description"
          error={errors.description?.message}
          required
        >
          <textarea
            {...register('description')}
            rows={3}
            className="form-textarea"
            placeholder="Enter product description"
          />
        </FormField>

        <FormField
          label="Price"
          error={errors.price?.message}
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              {...register('price', { valueAsNumber: true })}
              className="form-input pl-7 text-right"
              placeholder="0.00"
            />
          </div>
        </FormField>

        <FormField
          label="Category"
          error={errors.category_id?.message}
          required
        >
          <select
            {...register('category_id')}
            className="form-select"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </FormField>

        <ImageUpload
          initialImage={initialData?.image_url}
          onImageSelected={setImageFile}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  );
}