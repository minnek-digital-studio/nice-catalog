import { cn } from "@/lib/utils/tailwind-merge";
import { type Database } from "@/types/supabase";

interface ThumbnailsProps {
    product: Database["public"]["Tables"]["products"]["Row"] & {
        images?: Database["public"]["Tables"]["product_images"]["Row"][];
    };
    active: Database["public"]["Tables"]["product_images"]["Row"] | null;
    setActive: (
        image: Database["public"]["Tables"]["product_images"]["Row"] | null
    ) => void;
}

const ProductThumbnails = ({
    product: { images, ...product },
    active,
    setActive,
}: ThumbnailsProps) => {
    return (
        <ul className="flex snap-center w-full snap-x snap-mandatory overflow-scroll no-scrollbar gap-x-4 overflow-y-hidden h-28 bg-white">
            {images?.map((image) => (
                <li
                    key={image.id}
                    className={cn(
                        "snap-center flex flex-col shrink-0 overflow-hidden size-20 border border-transparent transition-colors duration-200",
                        active?.id === image.id
                            ? "brightness-90 bg-gray-200"
                            : "hover:brightness-95 hover:bg-gray-100"
                    )}
                    onClick={() => {
                        setActive(image);
                    }}
                >
                    <img
                        src={image.url}
                        alt={product.title}
                        loading="lazy"
                        className="size-full object-contain"
                    />
                </li>
            ))}
        </ul>
    );
};

export default ProductThumbnails;
