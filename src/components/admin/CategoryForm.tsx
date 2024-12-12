import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import slugify from "slugify";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useStore } from "../../lib/store";
import { type IconName } from "@fortawesome/fontawesome-svg-core";
import type { Database } from "../../types/supabase";

interface Props {
    onClose: () => void;
    icon: IconName;
    setShowIconPicker: (value: boolean) => void;
    initialData?: Database["public"]["Tables"]["categories"]["Update"] | null;
}

const CategoryForm = ({
    onClose,
    icon,
    setShowIconPicker,
    initialData,
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialData?.name || "");

    const createCategory = useStore((state) => state.createCategory);
    const updateCategory = useStore((state) => state.updateCategory);
    const loaderMessage = initialData?.id ? "Updating..." : "Creating...";
    const buttonMessage = initialData?.id
        ? "Update Category"
        : "Create Category";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const slug = slugify(name, { lower: true, strict: true });

            if (initialData?.id) {
                await updateCategory(initialData.id, { name, slug, icon });
                toast.success("Category updated successfully");
                onClose();
                return;
            }

            await createCategory({ name, slug, icon });
            toast.success("Category created successfully");
            onClose();
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message || "Failed to create category");
            } else {
                toast.error("Failed to create category");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                >
                    Category Name
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Icon
                </label>
                <button
                    type="button"
                    onClick={() => setShowIconPicker(true)}
                    className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
                >
                    <div className="flex items-center">
                        <FontAwesomeIcon
                            icon={["fas", icon]}
                            className="w-5 h-5 text-gray-400 mr-2"
                        />
                        <span className="text-gray-700">{icon}</span>
                    </div>
                    <span className="text-sm text-gray-500">Change</span>
                </button>
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

export default CategoryForm;
