import { ShieldCheck, Shield, Trash } from "lucide-react";
import type { Image } from "@/components/admin/Product/Gallery/ProductGallery";
import { forwardRef } from "react";

interface ProductGalleryImageProps extends React.HTMLAttributes<HTMLLIElement> {
    image: Image;
    index: number;
    handleImageClick: (index: number) => void;
    handleDeleteImage: (index: number, image: Image) => void;
}

const ProductGalleryImage = forwardRef<HTMLLIElement, ProductGalleryImageProps>(
    ({ image, index, handleImageClick, handleDeleteImage, ...props }, ref) => {
        return (
            <li
                className={`relative border-2 transition-colors duration-200 max-h-36 max-w-36 size-full ${
                    image.is_primary
                        ? "border-green-500"
                        : "border-transparent hover:border-gray-300 group"
                } rounded-lg`}
                onClick={() => handleImageClick(index)}
                {...props}
                ref={ref}
            >
                <picture className="flex size-full overflow-hidden rounded-lg">
                    <img
                        src={image.url}
                        alt={`Product Image ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                </picture>

                <button
                    type="button"
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200 focus:outline-none"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(index, image);
                    }}
                >
                    <Trash className="w-5 h-5 text-red-500 hover:text-red-700" />
                    <span className="sr-only">Remove Image</span>
                </button>

                <div
                    className={`absolute bottom-2 left-2 bg-white p-1 rounded-full shadow-md items-center gap-1 ${
                        image.is_primary ? "flex" : "hidden group-hover:flex"
                    }`}
                >
                    {image.is_primary ? (
                        <ShieldCheck className={`w-5 h-5 text-green-500`} />
                    ) : (
                        <Shield className={`w-5 h-5 text-gray-500`} />
                    )}
                    <span
                        className={`text-xs font-medium ${
                            image.is_primary
                                ? "text-green-600"
                                : "text-gray-600"
                        }`}
                    >
                        Primary
                    </span>
                </div>
            </li>
        );
    }
);

ProductGalleryImage.displayName = "ProductGalleryImage";

export default ProductGalleryImage;
