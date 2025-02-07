import React, { useState } from "react";
import type { Database } from "../types/supabase";
import { Tag, Eye } from "lucide-react";
import ProductImage from "./ProductImage";
import ProductModal from "./ProductModal";

type Product = Database["public"]["Tables"]["products"]["Row"] & {
    category?: Database["public"]["Tables"]["categories"]["Row"] | null;
    images?: Database["public"]["Tables"]["product_images"]["Row"][];
};

interface Props {
    product: Product;
    category?: Database["public"]["Tables"]["categories"]["Row"] | null;
}

export default function ProductCard({ product, category }: Props) {
    const productImg =
        (product.images && product.images.find((img) => img.is_primary)) ||
        null;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div className="group bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="relative aspect-square">
                    <ProductImage
                        src={productImg?.url || product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        aspectRatio="square"
                    />
                    <button
                        onClick={() => setShowModal(true)}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                    >
                        <span className="bg-white text-gray-900 px-4 py-2 rounded-full flex items-center font-medium">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                        </span>
                    </button>
                </div>

                <div className="p-4">
                    <div className="mb-2">
                        {category && (
                            <div className="flex items-center text-xs text-gray-500 mb-1">
                                <Tag className="w-3 h-3 mr-1" />
                                {category.name}
                            </div>
                        )}
                        <h3 className="font-medium text-gray-900 group-hover:text-[#ed1c24] transition-colors duration-200 line-clamp-2">
                            {product.title}
                        </h3>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        {product.price !== null && (
                            <span className="text-lg font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                            </span>
                        )}
                        {product.brand && (
                            <span className="text-sm text-gray-500">
                                {product.brand}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <ProductModal
                    product={product}
                    category={category}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
}
