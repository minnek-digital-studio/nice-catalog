import React, { useEffect, useState } from 'react';
import { useStore } from '../../lib/store';
import { Plus, Trash2 } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CategoryModal from './CategoryModal';
import { toast } from 'react-hot-toast';

export default function CategoryList() {
  const [showModal, setShowModal] = useState(false);
  const { categories, fetchCategories, deleteCategory } = useStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        toast.success('Category deleted successfully');
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete category');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Categories</h3>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ed1c24] hover:bg-[#d91920]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500">
                    <FontAwesomeIcon icon={['fas', category.icon]} />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-500">{category.slug}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {categories.length === 0 && (
            <li className="p-4 text-center text-gray-500">
              No categories yet. Add your first category to get started.
            </li>
          )}
        </ul>
      </div>

      {showModal && <CategoryModal onClose={() => setShowModal(false)} />}
    </div>
  );
}