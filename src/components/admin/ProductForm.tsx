import React, { useState, useEffect } from 'react';
import { useStore } from '../../lib/store';
import { toast } from 'react-hot-toast';
import { Plus, Upload, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { uploadProductImage } from '../../lib/storage';
import ProductPreview from './ProductPreview';
import CategoryModal from './CategoryModal';
import BrandModal from './BrandModal';

const schema = z.object({
    title: z.string().min(1, 'Product name is required'),
    description: z.string().min(1, 'Description is required'),
    price: z.number().min(0, 'Price must be positive').optional().nullable(),
    brand_id: z.string().optional(),
    category_id: z.string().min(1, 'Category is required'),
    show_price: z.boolean().default(true),
});

type FormData = z.infer<typeof schema>;

interface Props {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialData?: Partial<FormData>;
    productId?: string;
}

export default function ProductForm({ onSuccess, onCancel, initialData, productId }: Props) {
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const { createProduct, categories, brands, fetchCategories, fetchBrands, updateProduct } = useStore();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            show_price: true,
            ...initialData,
        }
    });

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, [fetchCategories, fetchBrands]);

    const handleImageChange = (file: File | null) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const showPrice = watch('show_price');
    const formData = watch();

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);

            if (!data.category_id) {
                throw new Error('Please select a category');
            }

            let imageUrl = '';
            if (imageFile) {
                imageUrl = await uploadProductImage(imageFile);
            }

            const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            const selectedBrand = brands.find(b => b.id === data.brand_id);

            const productData = {
                title: data.title,
                description: data.description,
                price: data.show_price ? data.price : null,
                brand: selectedBrand?.name || '',
                category_id: data.category_id,
                image_url: imageUrl,
                slug,
            };

            if (productId) {
                await updateProduct(productId, productData);
                toast.success('Product updated successfully');
                onSuccess?.();
                return;
            }
            await createProduct(productData);
            toast.success('Product created successfully');
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || 'Failed to create product');
            console.error('Error creating product:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
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
                                        {...register('price', { valueAsNumber: true })}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Product Image
                        </label>
                        <div
                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#ed1c24] transition-colors duration-200"
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files?.[0];
                                if (file) handleImageChange(file);
                            }}
                        >
                            {imagePreview ? (
                                <div className="space-y-2 text-center">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleImageChange(null)}
                                        className="text-sm text-red-600 hover:text-red-500"
                                    >
                                        Remove image
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#ed1c24] hover:text-[#d91920] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#ed1c24]">
                                            <span>Upload a file</span>
                                            <input
                                                type="file"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>
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
                    {loading ? productId ? 'Updating...' : 'Creating...' : productId ? 'Update Product' : 'Create Product'}
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
