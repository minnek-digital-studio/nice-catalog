import { Upload } from 'lucide-react';

interface Props {
  imagePreview: string | null;
  onImageChange: (file: File | null) => void;
}

export default function ImageUpload({ imagePreview, onImageChange }: Props) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Product Image
      </label>
      <div
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-[#ed1c24] transition-colors duration-200"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) onImageChange(file);
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
              onClick={() => onImageChange(null)}
              className="text-sm text-red-600 hover:text-red-500"
            >
              Remove image
            </button>
          </div>
        ) : (
          <div className="space-y-2 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#ed1c24] hover:text-[#d91920] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#ed1c24]">
                <span>Upload a file</span>
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={(e) => onImageChange(e.target.files?.[0] || null)}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
          </div>
        )}
      </div>
    </div>
  );
}