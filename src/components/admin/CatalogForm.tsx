import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { toast } from 'react-hot-toast';
import slugify from 'slugify';
import type { Database } from '../../types/supabase';
import { Loader2 } from 'lucide-react';

type CatalogInsert = Omit<Database['public']['Tables']['catalogs']['Insert'], 'user_id'>;

interface Props {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  onCancel?: () => void;
  initialData?: Partial<CatalogInsert>;
}

export default function CatalogForm({ onSuccess, onError, onCancel, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const createCatalog = useStore((state) => state.createCatalog);

  const [formData, setFormData] = useState<Partial<CatalogInsert>>({
    name: '',
    description: '',
    is_published: false,
    ...initialData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      toast.error('Catalog name is required');
      return;
    }

    setLoading(true);

    try {
      const slug = slugify(formData.name, { lower: true, strict: true });
      
      await createCatalog({
        ...formData,
        slug,
      } as CatalogInsert);

      onSuccess?.();
    } catch (error: any) {
      onError?.(error);
      console.error('Error creating catalog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm"
          placeholder="Enter catalog name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ed1c24] focus:ring-[#ed1c24] sm:text-sm"
          placeholder="Describe your catalog"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="is_published"
          checked={formData.is_published || false}
          onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
          className="h-4 w-4 text-[#ed1c24] focus:ring-[#ed1c24] border-gray-300 rounded"
        />
        <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
          Publish catalog immediately
        </label>
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50"
        >
          {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
          {loading ? 'Creating...' : 'Create Catalog'}
        </button>
      </div>
    </form>
  );
}