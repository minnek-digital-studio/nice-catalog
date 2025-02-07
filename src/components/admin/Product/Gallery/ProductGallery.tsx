import { useState } from "react";
import ProductGalleryModal from "@/components/admin/Product/Gallery/Modal";
import ProductGalleryImage from "@/components/admin/Product/Gallery/Image";
import ProductGalleryForm from "@/components/admin/Product/Gallery/Form";
import SortableList from "@/components/admin/Product/Gallery/SortableList";
import SortableImage from "@/components/admin/Product/Gallery/SortableImage";

export type Image = {
    id: string;
    file?: File;
    url: string;
    is_primary: boolean;
    position: number | null;
    error?: string;
    isUploading?: boolean;
    isUploaded?: boolean;
};

interface Props {
    onClose?: () => void;
    onDelete?: (image: Image) => Promise<void>;
    images: Image[];
    setImages: (images: Image[]) => void;
    modal?: boolean;
    sortable?: boolean;
    productId: string;
}

export const ProductGallery = ({
    onClose,
    onDelete,
    images,
    setImages,
    modal = false,
    sortable = false,
    productId,
}: Props) => {
    const [error, setError] = useState<string | null>(null);
    const maxImages = 10;

    const handleImageChange = (files: File[]) => {
        const maxSize = 2 * 1024 * 1024; // 2MB
        const totalImages = files?.length + images?.length;
        if (totalImages > maxImages)
            return setError(`You can only upload up to ${maxImages} images`);

        const validFiles = files.filter((file) => file.size <= maxSize);
        if (validFiles?.length !== files?.length) {
            return setError("One or more images are too large");
        }

        const newImages = validFiles.map((file, index) => {
            const position = images.length + index;
            return {
                file,
                url: URL.createObjectURL(file),
                is_primary: images.length === 0 && index === 0,
                position,
                product_id: productId,
                id: crypto.randomUUID(),
            };
        });

        setImages([...images, ...newImages]);
        setError(null);
    };

    const handleImageClick = (index: number) => {
        const newImages = images.map((img) => ({
            ...img,
            is_primary: false,
        }));
        newImages[index].is_primary = true;
        setImages(newImages);
    };

    const handleDeleteImage = async (index: number, image: Image) => {
        if (!image.id) return setImages(images.filter((_, i) => i !== index));
        await onDelete?.(image);
    };

    const handleOrderChange = (newItems: Partial<Image>[]) => {
        setImages(
            (newItems as Image[]).map((item, index) => ({
                ...item,
                position: index,
            }))
        );
    };

    return (
        <>
            {modal ? (
                <ProductGalleryModal
                    onClose={onClose}
                    images={images}
                    handleImageChange={handleImageChange}
                    handleImageClick={handleImageClick}
                    handleDeleteImage={handleDeleteImage}
                    error={error}
                    maxImages={maxImages}
                />
            ) : (
                <>
                    <ProductGalleryForm onChange={handleImageChange} />
                    {error && (
                        <div className="mt-2 text-red-500 text-sm">{error}</div>
                    )}

                    {images.length > 0 && (
                        <div className="max-h-[230px] overflow-y-auto">
                            <ul className="grid grid-cols-3 gap-4 auto-rows-fr mt-4">
                                {sortable ? (
                                    <SortableList
                                        items={images.map(
                                            (image, index) =>
                                                image.id || `image-${index}`
                                        )}
                                        objItems={images}
                                        onDragEnd={handleOrderChange}
                                    >
                                        {images.map((img, index) => (
                                            <SortableImage
                                                key={img.id || `image-${index}`}
                                                handleDeleteImage={
                                                    handleDeleteImage
                                                }
                                                handleImageClick={
                                                    handleImageClick
                                                }
                                                image={img}
                                                index={index}
                                            />
                                        ))}
                                    </SortableList>
                                ) : (
                                    images.map((img, index) => (
                                        <ProductGalleryImage
                                            key={img.id || `image-${index}`}
                                            handleDeleteImage={
                                                handleDeleteImage
                                            }
                                            handleImageClick={handleImageClick}
                                            image={img}
                                            index={index}
                                        />
                                    ))
                                )}
                            </ul>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ProductGallery;
