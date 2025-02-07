import { Upload } from "lucide-react";

interface ProductGalleryFormProps {
    onChange: (images: File[]) => void;
}

export const ProductGalleryForm = ({ onChange }: ProductGalleryFormProps) => {
    return (
        <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#ed1c24] transition-colors duration-200"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                onChange(files);
            }}
        >
            <div className="space-y-2 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                    <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#ed1c24] hover:text-[#d91920] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#ed1c24]">
                        <span>Upload a file</span>
                        <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                const files = Array.from(e.target.files || []);
                                onChange(files);
                            }}
                        />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
            </div>
        </div>
    );
};

export default ProductGalleryForm;
