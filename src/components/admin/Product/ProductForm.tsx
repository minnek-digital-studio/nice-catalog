import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { toast } from "react-hot-toast";
import { Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadProductImage } from "@/lib/storage";
import ProductPreview from "@/components/admin/Product/ProductPreview";
import CategoryModal from "@/components/admin/CategoryModal";
import BrandModal from "@/components/admin/BrandModal";
import type { Database } from "@/types/supabase";
import { ProductGallery } from "@/components/admin/Product/Gallery/ProductGallery";
import type { Image } from "@/components/admin/Product/Gallery/ProductGallery";
import DeleteConfirmation from "@/components/admin/DeleteConfirmation";

type Product = Partial<Database["public"]["Tables"]["products"]["Update"]> & {
    images?: Image[];
};

const schema = z.object({
    title: z.string().min(1, "Product name is required"),
    description: z.string().nullable(),
    price: z.coerce.number().min(0, "Price must be positive").nullable(),
    brand_id: z.string().nullable(),
    category_id: z.string().min(1, "Category is required"),
    show_price: z.boolean().default(true),
    images: z
        .array(
            z.object({
                id: z.string().optional(),
                file: z.instanceof(File).optional(),
                url: z.string(),
                is_primary: z.boolean(),
                position: z.number(),
            })
        )
        .optional()
        .nullable(),
});

export type FormData = z.infer<typeof schema>;

interface Props {
    onSuccess?: () => void;
    onCancel?: () => void;
    setShowModal?: (showModal: boolean) => void;
    initialData?: Partial<FormData> & { images?: Image[] };
    productId?: string;
}

export default function ProductForm({
    onSuccess,
    onCancel,
    initialData,
    productId,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [images, setImages] = useState<Image[]>(initialData?.images || []);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showBrandModal, setShowBrandModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<Image | null>(null);
    const {
        createProduct,
        categories,
        brands,
        fetchCategories,
        fetchBrands,
        updateProduct,
        deleteImages,
        updateImages,
    } = useStore();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            show_price: true,
            ...initialData,
            price: initialData?.price || null,
        },
    });

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, [fetchCategories, fetchBrands]);

    const formData = watch();

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true);

            if (!data.category_id) {
                throw new Error("Please select a category");
            }
            const slug = data.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "");
            const selectedBrand = brands.find((b) => b.id === data.brand_id);

            const productData = {
                title: data.title,
                description: data.description,
                price: data.price || null,
                brand: selectedBrand?.name || "",
                brand_id: data.brand_id || null,
                category_id: data.category_id,
                is_visible: data.show_price,
                slug,
                image_url: images.find((image) => image.is_primary)?.url || "",
            } as Product;

            if (productId) {
                await updateProduct(productId, productData);
                await saveImages(images, productId);
                toast.success("Product updated successfully");
                onSuccess?.();
                return;
            }

            const product = await createProduct(
                productData as Omit<
                    Database["public"]["Tables"]["products"]["Insert"],
                    "catalog_id"
                >
            );
            if (!product) throw new Error("Failed to create product");
            await saveImages(images, product.id);
            toast.success("Product created successfully");
            onSuccess?.();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create product");
            } else {
                toast.error("Failed to create product");
            }
            console.error("Error creating product:", error);
        } finally {
            setLoading(false);
        }
    };

    const uploadImages = async (
        images: Partial<Image>[],
        productId: string
    ) => {
        const imagesUploads = await Promise.all(
            images.map(async ({ file, ...image }) => {
                if (!file) return image;
                return {
                    ...image,
                    product_id: productId,
                    url: await uploadProductImage(file),
                };
            })
        );
        return imagesUploads;
    };

    const saveImages = async (
        imagesState: Partial<Image>[],
        productId: string
    ) => {
        const imagesData = await uploadImages(imagesState, productId);
        return await updateImages(imagesData, productId);
    };

    const handleClickImage = async (image: Image) => {
        setSelectedImage(image);
        setShowDeleteModal(true);
    };

    const handleDeleteImage = async (image: Image) => {
        if (!image.id) return;
        const wasPrimary = image.is_primary;
        const newImages = images.filter((i) => i.id !== image.id);
        if (!image.file) await deleteImages(image);

        if (wasPrimary && newImages.length > 0) {
            newImages[0].is_primary = true;
        }
        setImages(newImages);
        setShowDeleteModal(false);
        setSelectedImage(null);
        toast.success("Image deleted successfully");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <div className="space-y-8">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Product Name *
                            </label>
                            <input
                                type="text"
                                id="title"
                                {...register("title")}
                                className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm border"
                                placeholder="Enter product name"
                            />
                            {errors.title && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center mb-4">
                                <input
                                    type="checkbox"
                                    id="show_price"
                                    {...register("show_price")}
                                    className="h-4 w-4 text-[#ed1c24] focus:ring-[#ed1c24] border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="show_price"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Display price
                                </label>
                            </div>
                            <div>
                                <label
                                    htmlFor="price"
                                    className="block text-sm font-medium text-gray-700 mb-2"
                                >
                                    Price
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">
                                            $
                                        </span>
                                    </div>
                                    <input
                                        type="number"
                                        id="price"
                                        step="0.01"
                                        {...register("price")}
                                        className="block w-full pl-8 pr-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm border"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                {...register("description")}
                                className="block w-full px-4 py-3 rounded-lg border-gray-300 shadow-sm focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm border"
                                placeholder="Enter product description"
                            />
                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category *
                            </label>
                            <div className="flex rounded-lg shadow-sm border border-gray-300 gap-2">
                                <select
                                    {...register("category_id")}
                                    className="flex-1 w-full px-4 py-3 rounded-l-lg border-gray-300 focus:ring-[#ed1c24] focus:border-[#ed1c24] sm:text-sm "
                                >
                                    <option value="">Select a category</option>
                                    {categories?.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(true)}
                                    className="relative -ml-px inline-flex items-center px-4 py-3 rounded-r-lg border-l border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#ed1c24]"
                                >
                                    <Plus className="size-5" />
                                </button>
                            </div>
                            {errors.category_id && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.category_id.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Brand
                            </label>
                            <div className="flex rounded-lg shadow-sm border border-gray-300 gap-2">
                                <select
                                    {...register("brand_id")}
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
                                    className="relative -ml-px inline-flex items-center px-4 py-3 rounded-r-lg border-l border-gray-300 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-[#ed1c24]"
                                >
                                    <Plus className="size-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Product Images
                    </label>
                    <ProductGallery
                        images={images}
                        setImages={setImages}
                        onDelete={handleClickImage}
                        productId={productId || ""}
                        sortable
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
                    {loading && (
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    )}
                    {loading
                        ? productId
                            ? "Updating..."
                            : "Creating..."
                        : productId
                        ? "Update Product"
                        : "Create Product"}
                </button>
            </div>

            {showPreview && (
                <ProductPreview
                    product={{
                        ...formData,
                        image_url:
                            images.find((image) => image.is_primary)?.url || "",
                        brand:
                            brands.find((b) => b.id === formData.brand_id)
                                ?.name || "",
                        catalog_id: null,
                        created_at: new Date().toISOString(),
                        flags: null,
                        id: "preview",
                        slug:
                            formData.title
                                ?.toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, "") || "",
                        visible: true,
                        is_published: true,
                        is_visible: true,
                        position: 0,
                        stock_status: "in_stock",
                        updated_at: new Date().toISOString(),
                    }}
                    imageFile={
                        images.find((image) => image.is_primary)?.file || null
                    }
                    onClose={() => setShowPreview(false)}
                />
            )}

            {showCategoryModal && (
                <CategoryModal onClose={() => setShowCategoryModal(false)} />
            )}

            {showBrandModal && (
                <BrandModal onClose={() => setShowBrandModal(false)} />
            )}

            {showDeleteModal && selectedImage && (
                <DeleteConfirmation
                    obj={{
                        id: selectedImage.id || "",
                        title: formData.title || "",
                        type: "image",
                        image: selectedImage.url || "",
                    }}
                    onClose={() => setSelectedImage(null)}
                    onConfirm={() => handleDeleteImage(selectedImage)}
                />
            )}
        </form>
    );
}
