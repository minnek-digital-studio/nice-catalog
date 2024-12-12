import { useEffect, useState } from 'react';
import { useStore } from '../../lib/store';
import { Plus, Trash2, Building2, Pencil } from 'lucide-react';
import BrandModal from './BrandModal';
import { toast } from 'react-hot-toast';
import type { Database } from '../../types/supabase';

type Brand = Database['public']['Tables']['brands']['Row'];

export default function BrandList() {
  const [showModal, setShowModal] = useState(false);
  const { brands, fetchBrands, deleteBrand } = useStore();
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await deleteBrand(id);
        toast.success('Brand deleted successfully');
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message || 'Failed to delete brand');
        } else {
          toast.error('Failed to delete brand');
        }
      }
    }
  };
  
  const onEdit = (brand: Brand) => {
    setSelectedBrand(brand);
    setShowModal(true);
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-gray-900">Brands</h3>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ed1c24] hover:bg-[#d91920]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Brand
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {brands.map((brand) => (
            <li key={brand.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {brand.logo_url ? (
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="w-8 h-8 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-gray-400 mr-3" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{brand.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(brand)}
                    className="p-1 text-gray-400 hover:text-yellow-500"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(brand.id)}
                    className="p-1 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {brands.length === 0 && (
            <li className="p-4 text-center text-gray-500">
              No brands yet. Add your first brand to get started.
            </li>
          )}
        </ul>
      </div>

      {showModal && <BrandModal onClose={() => {
        setShowModal(false);
        setSelectedBrand(null);
      }} brand={selectedBrand} />}
    </div>
  );
}