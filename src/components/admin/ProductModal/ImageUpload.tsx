import React, { useState } from 'react';
import { ImageIcon, X, Upload, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Props {
  initialImage?: string;
  onImageSelected: (file: File | null) => void;
}

export default function ImageUpload({ initialImage, onImageSelected }: Props) {
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateFile = (file: File): boolean => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload a JPG, PNG, GIF, or WebP image.');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 2MB.');
      return false;
    }

    return true;
  };

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setPreview(initialImage || null);
      onImageSelected(null);
      return;
    }

    if (!validateFile(file)) {
      return;
    }
    
    const maxSize = 2 * 1024 * 1024; // 2MB
        
    if (file && file.size > maxSize) {
        toast.error('Image size must be less than 2MB');
        return;
    }

    setIsLoading(true);

    try {
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      onImageSelected(file);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Product Image
      </label>
      <div
        className={`
          mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg
          transition-colors duration-200
          ${isDragging
            ? 'border-[#ed1c24] bg-red-50'
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isLoading ? (
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
            <p className="mt-2 text-sm text-gray-500">Processing image...</p>
          </div>
        ) : preview ? (
          <div className="space-y-2 text-center">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto h-32 w-32 object-cover rounded-lg"
                onError={() => {
                  setPreview(null);
                  toast.error('Failed to load image preview');
                }}
              />
              <button
                type="button"
                onClick={() => handleFileChange(null)}
                className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Click the X to remove the image
            </p>
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
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP up to 2MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
}