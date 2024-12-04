import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { toast } from 'react-hot-toast';
import { Loader2, X } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import slugify from 'slugify';
import IconPicker from '../IconPicker';

interface Props {
  onClose: () => void;
}

export default function CategoryModal({ onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('tag');
  const [showIconPicker, setShowIconPicker] = useState(false);
  const createCategory = useStore((state) => state.createCategory);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const slug = slugify(name, { lower: true, strict: true });
      await createCategory({ name, slug, icon });
      toast.success('Category created successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Add New Category</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
                <FontAwesomeIcon icon={['fas', icon]} className="w-5 h-5 text-gray-400 mr-2" />
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
              {loading && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>

        {showIconPicker && (
          <IconPicker
            value={icon}
            onChange={setIcon}
            onClose={() => setShowIconPicker(false)}
          />
        )}
      </div>
    </div>
  );
}