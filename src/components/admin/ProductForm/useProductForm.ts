import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useStore } from '../../../lib/store';
import { uploadProductImage } from '../../../lib/storage';
import { toast } from 'react-hot-toast';
import type { Product } from '../../../types/supabase';

const productSchema = z.object({
  title: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.number().min(0, 'Price must be positive').nullable(),
  brand_id: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  show_price: z.boolean().default(false),
});

export type ProductFormData = z.infer<typeof productSchema>;

interface UseProductFormProps {
  onSuccess?: () => void;
  initialData?: Partial<Product>;
  productId?: string;
}

export function useProductForm({ onSuccess, initialData, productId }: UseProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image_url || null);
  const { createProduct, updateProduct, brands } = useStore();

  const isEditMode = Boolean(productId);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category_id: initialData?.category_id || '',
      brand_id: brands.find(b => b.name === initialData?.brand)?.id || '',
      show_price: initialData?.price !== null,
      price: initialData?.price || null,
    },
  });

  const handleImageChange = (file: File | null) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
        
    if (file && file.size > maxSize) {
        toast.error('Image size must be less than 2MB');
        return;
    }
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(initialData?.image_url || null);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);

      if (!data.category_id) {
        throw new Error('Please select a category');
      }

      let imageUrl = initialData?.image_url || '';
      if (imageFile) {
        imageUrl = await uploadProductImage(imageFile);
      }

      const selectedBrand = brands.find(b => b.id === data.brand_id);
      
      const productData = {
        title: data.title,
        description: data.description,
        price: data.show_price ? data.price : null,
        brand: selectedBrand?.name || '',
        category_id: data.category_id,
        image_url: imageUrl,
      };

      if (isEditMode && productId) {
        await updateProduct(productId, productData);
        toast.success('Product updated successfully');
      } else {
        await createProduct(productData);
        toast.success('Product created successfully');
      }
      
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} product`);
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} product:`, error);
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    imageFile,
    imagePreview,
    handleImageChange,
    onSubmit: form.handleSubmit(onSubmit),
    isEditMode,
  };
}