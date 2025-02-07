import { Image } from "@/components/admin/Product/Gallery/ProductGallery";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ProductGalleryImage from "@/components/admin/Product/Gallery/Image";

interface SortableImageProps {
    image: Image;
    index: number;
    handleImageClick: (index: number) => void;
    handleDeleteImage: (index: number, image: Image) => void;
}

export const SortableImage = ({
    image,
    index,
    handleImageClick,
    handleDeleteImage,
}: SortableImageProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transition,
        transform,
        isDragging,
    } = useSortable({ id: image.id || `image-${index}` });

    const style: React.CSSProperties = {
        transition,
        transform: CSS.Transform.toString(transform),
        cursor: isDragging ? "grabbing" : "pointer",
    };

    return (
        <ProductGalleryImage
            image={image}
            index={index}
            handleImageClick={handleImageClick}
            handleDeleteImage={handleDeleteImage}
            {...attributes}
            {...listeners}
            style={style}
            ref={setNodeRef}
        />
    );
};

export default SortableImage;
