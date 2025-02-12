import { X, ArrowLeft, ArrowRight } from "lucide-react";
import type { Database } from "../types/supabase";
import ProductImage from "./ProductImage";
import ProductThumbnails from "./ProductThumbnails";
import { useState } from "react";
import { cn } from "@/lib/utils/tailwind-merge";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
    category?: Database["public"]["Tables"]["categories"]["Row"] | null;
    images?: Database["public"]["Tables"]["product_images"]["Row"][];
};

interface Props {
    product: Product;
    category?: Database["public"]["Tables"]["categories"]["Row"] | null;
    onClose: () => void;
}

export default function ProductModal({ product, category, onClose }: Props) {
    const productImg =
        (product.images && product.images.find((img) => img.is_primary)) ||
        null;
    const [activeImage, setActiveImage] = useState<
        Database["public"]["Tables"]["product_images"]["Row"] | null
    >(productImg);

    const hasCarousel = product.images && product.images.length > 1;

    const handleNextArrow = () => {
        const images = product.images || [];
        if (images.length === 0) return;
        const currentIndex = images.findIndex(
            (img) => img.id === activeImage?.id
        );
        const nextIndex = currentIndex + 1;
        setActiveImage(images[nextIndex] || images[0]);
    };

    const handlePrevArrow = () => {
        const images = product.images || [];
        const currentIndex = images.findIndex(
            (img) => img.id === activeImage?.id
        );
        const prevIndex = currentIndex - 1;
        setActiveImage(images[prevIndex] || images[images.length - 1]);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
                className={cn(
                    "bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
                )}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {product.title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-3 w-full h-full relative rounded-lg overflow-hidden">
                            <div className="flex flex-col relative flex-1 size-full">
                                {product.show_promo && product.promo_text && (
                                    <div className="absolute z-10 right-2 top-2  inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                                        {product.promo_text}
                                    </div>
                                )}
                                <ProductImage
                                    src={activeImage?.url || product.image_url}
                                    alt={product.title}
                                    className="size-full"
                                    size="lg"
                                />

                                {hasCarousel && (
                                    <button
                                        onClick={handleNextArrow}
                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-100 rounded-full shadow-md px-2 py-1 aspect-square hover:bg-gray-400 transition-colors"
                                    >
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                )}

                                {hasCarousel && (
                                    <button
                                        onClick={handlePrevArrow}
                                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-100 rounded-full shadow-md px-2 py-1 aspect-square hover:bg-gray-400 transition-colors"
                                    >
                                        <ArrowLeft className="w-6 h-6" />
                                    </button>
                                )}
                            </div>

                            {hasCarousel && (
                                <ProductThumbnails
                                    active={activeImage}
                                    product={product}
                                    setActive={setActiveImage}
                                />
                            )}
                        </div>

                        <div className="space-y-4">
                            {category && (
                                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    {category.name}
                                </div>
                            )}

                            <div className="space-y-2">
                                {product.price !== null && (
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        ${product.price.toFixed(2)}
                                    </h3>
                                )}
                                {product.brand && (
                                    <p className="text-sm text-gray-500">
                                        Brand: {product.brand}
                                    </p>
                                )}
                            </div>

                            <div>
                                <h4 className="font-medium text-gray-900 mb-2">
                                    Description
                                </h4>
                                <p className="text-gray-600">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
