import { useState } from "react";
import { useStore } from "../../lib/store";
import { uploadBrandLogo } from "../../lib/storage";
import { toast } from "react-hot-toast";
import { Loader2, Upload } from "lucide-react";
import type { Database } from "../../types/supabase";

interface Props {
    onClose: () => void;
    initialData?: Database["public"]["Tables"]["brands"]["Update"] | null;
}

const BrandForm = ({ onClose, initialData }: Props) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialData?.name || "");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        initialData?.logo_url || null
    );
    const createBrand = useStore((state) => state.createBrand);
    const updateBrand = useStore((state) => state.updateBrand);

    const loaderMessage = initialData?.id ? "Updating..." : "Creating...";
    const buttonMessage = initialData?.id ? "Update Brand" : "Create Brand";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let logoUrl = imagePreview || "";

            if (logoUrl === "" && logoFile) {
                logoUrl = await uploadBrandLogo(logoFile);
            }

            if (initialData?.id) {
                await updateBrand(initialData.id, { name, logo_url: logoUrl });
                toast.success("Brand updated successfully");
                onClose();
                return;
            }

            await createBrand({ name, logo_url: logoUrl });
            toast.success("Brand created successfully");
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create brand");
            } else {
                toast.error("Failed to create brand");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (file: File | null) => {
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (file && file.size > maxSize) {
            toast.error("Image size must be less than 2MB");
            return;
        }

        setLogoFile(file);

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

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Brand Name
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    Brand Logo
                </label>
                <div
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
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
                        <div className="space-y-1 text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="flex text-sm text-gray-600">
                                <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#ed1c24] hover:text-[#d91920] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#ed1c24]">
                                    <span>Upload a logo</span>
                                    <input
                                        type="file"
                                        className="sr-only"
                                        accept="image/*"
                                        onChange={(e) =>
                                            setLogoFile(
                                                e.target.files?.[0] || null
                                            )
                                        }
                                    />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-500">
                                PNG, JPG, GIF up to 2MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50"
                >
                    {loading && (
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    )}
                    {loading ? loaderMessage : buttonMessage}
                </button>
            </div>
        </form>
    );
};

export default BrandForm;
