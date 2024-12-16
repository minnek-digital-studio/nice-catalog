import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { useStore } from '../../lib/store';
import { toast } from 'react-hot-toast';
import type { Database } from '../../types/supabase';

type Catalog = Database['public']['Tables']['catalogs']['Row'];

interface Props {
  catalog: Catalog;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteCatalogModal({ catalog, onClose, onSuccess }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const deleteCatalog = useStore((state) => state.deleteCatalog);

  const handleDelete = async () => {
    if (confirmText !== catalog.name) {
      toast.error('Please type the catalog name to confirm deletion');
      return;
    }

    setIsDeleting(true);
    try {
      await deleteCatalog(catalog.id);
      toast.success('Catalog deleted successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete catalog');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
          Delete Catalog
        </h3>
        
        <p className="text-sm text-gray-500 text-center mb-6">
          This action cannot be undone. This will permanently delete the{' '}
          <span className="font-semibold">{catalog.name}</span> catalog and all its products.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please type <span className="font-semibold">{catalog.name}</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Type catalog name"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || confirmText !== catalog.name}
            className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
            Delete Catalog
          </button>
        </div>
      </div>
    </div>
  );
}