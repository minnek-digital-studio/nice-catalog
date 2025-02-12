import { X } from "lucide-react";
import type { Image } from "@/components/admin/Product/Gallery/ProductGallery";
import ProductGalleryForm from "@/components/admin/Product/Gallery/Form";
import ProductGalleryImage from "@/components/admin/Product/Gallery/Image";
interface ProductGalleryModalProps {
    handleImageChange: (files: File[]) => void;
    handleImageClick: (index: number) => void;
    handleDeleteImage: (index: number, image: Image) => void;
    onClose?: () => void;
    error: string | null;
    images: Image[];
    maxImages: number;
}

export const ProductGalleryModal = ({
    handleDeleteImage,
    handleImageChange,
    handleImageClick,
    images,
    error,
    onClose,
}: ProductGalleryModalProps) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-screen-md w-full p-6 shadow-lg relative">
                <div className="mb-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Product Gallery
                    </h2>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={onClose}
                    >
                        <X className="size-6" />
                    </button>
                </div>
                <div className="mb-4">
                    <ProductGalleryForm onChange={handleImageChange} />
                    {error && (
                        <div className="mt-2 text-red-500 text-sm">{error}</div>
                    )}

                    <div className="max-h-[300px] overflow-y-auto overflow-x-visible">
                        <div className="grid grid-cols-3 gap-4 auto-rows-fr mt-4">
                            {images.length > 0 &&
                                images.map((img, index) => (
                                    <ProductGalleryImage
                                        key={img.id || `image-${index}`}
                                        handleDeleteImage={handleDeleteImage}
                                        handleImageClick={handleImageClick}
                                        image={img}
                                        index={index}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGalleryModal;
