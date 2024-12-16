import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { updateCatalogUrl } from '../../lib/api';
import { toast } from 'react-hot-toast';
import CatalogUrlInput from './CatalogUrlInput';

interface Props {
  catalogId: string;
  currentUrl: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CatalogUrlModal({ catalogId, currentUrl, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [newUrl, setNewUrl] = useState(currentUrl);
  const [isUrlValid, setIsUrlValid] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isUrlValid || newUrl === currentUrl) {
      return;
    }

    setLoading(true);

    try {
      await updateCatalogUrl(catalogId, newUrl);
      toast.success('Catalog URL updated successfully');
      onSuccess();
      onClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to update catalog URL');
      } else {
        toast.error('Failed to update catalog URL');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Change Catalog URL</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <CatalogUrlInput
            value={newUrl}
            onChange={setNewUrl}
            onValidityChange={setIsUrlValid}
            initialValue={currentUrl}
          />

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !isUrlValid || newUrl === currentUrl}
              className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] disabled:opacity-50"
            >
              {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
              {loading ? 'Updating...' : 'Update URL'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}