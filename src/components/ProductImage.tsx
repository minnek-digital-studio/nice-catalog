import React, { useState } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils/tailwind-merge";

interface Props {
    src: string;
    alt: string;
    className?: string;
    size?: "sm" | "md" | "lg";
    aspectRatio?: "square" | "4:3" | "16:9";
}

export default function ProductImage({
    src,
    alt,
    className = "",
    size = "md",
    aspectRatio = "square",
}: Props) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    const sizeClasses = {
        sm: "h-10 w-10",
        md: "h-32 w-32",
        lg: "h-48 w-48",
    };

    const aspectRatioClasses = {
        square: "aspect-square",
        "4:3": "aspect-4/3",
        "16:9": "aspect-video",
    };

    if (!src || error) {
        return (
            <picture
                className={cn(
                    "flex items-center justify-center bg-gray-100 rounded-lg",
                    sizeClasses[size],
                    aspectRatioClasses[aspectRatio],
                    className
                )}
                role="img"
                aria-label={
                    error ? "Failed to load image" : "No image available"
                }
            >
                <ImageOff className="w-6 h-6 text-gray-400" />
            </picture>
        );
    }

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-lg",
                sizeClasses[size],
                aspectRatioClasses[aspectRatio],
                className
            )}
        >
            {loading && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
            )}
            <img
                src={src}
                alt={alt}
                onError={() => {
                    setError(true);
                    setLoading(false);
                }}
                onLoad={() => setLoading(false)}
                className={`
                  w-full h-full object-contain
                  ${loading ? "opacity-0" : "opacity-100"}
                  transition-opacity duration-200
                `}
            />
        </div>
    );
}
