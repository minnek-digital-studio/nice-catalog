import React, { useState } from 'react';
import { useStore } from '../../../lib/store';
import { Plus, Search, Filter, MoreVertical, Edit2, Trash2, GripVertical, Eye } from 'lucide-react';
import ProductModal from '../ProductModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';
import ProductImage from '../../ProductImage';
import ProductVisibilityToggle from './ProductVisibilityToggle';
import SubscriptionLimitWarning from '../SubscriptionLimitWarning';
import { toast } from 'react-hot-toast';
import { Menu, Transition } from '@headlessui/react';
import { DndContext, DragEndEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Product } from '../../../types/supabase';

interface SortableRowProps {
  id: string;
  product: Product;
  onToggleVisibility: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

function SortableRow({ id, product, onToggleVisibility, onEdit, onDelete }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr ref={setNodeRef} style={style} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div {...attributes} {...listeners} className="cursor-grab mr-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
          <ProductImage
            src={product.image_url}
            alt={product.title}
            size="sm"
            className="flex-shrink-0"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{product.title}</div>
            <div className="text-sm text-gray-500">{product.brand}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {product.category?.name || 'Uncategorized'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]">
            <MoreVertical className="w-5 h-5" />
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onToggleVisibility(product)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {product.visible ? 'Hide' : 'Show'}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(product)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700`}
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onDelete(product)}
                      className={`${
                        active ? 'bg-gray-100' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-red-600`}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </td>
    </tr>
  );
}

export default function ProductList() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isProductListVisible, setIsProductListVisible] = useState(() => {
    const saved = localStorage.getItem('productListVisible');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const { products, categories, updateProduct } = useStore();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDelete = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = products.findIndex(p => p.id === active.id);
      const newIndex = products.findIndex(p => p.id === over.id);
      
      try {
        await updateProduct(active.id as string, { position: newIndex });
        toast.success('Product order updated');
      } catch (error: any) {
        if (error.message?.includes('Catalog limit reached')) {
          setSubscriptionError(error.message);
        } else {
          toast.error('Failed to update product order');
        }
      }
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    try {
      await updateProduct(product.id, { visible: !product.visible });
      toast.success(product.visible ? 'Product hidden' : 'Product shown');
    } catch (error) {
      toast.error('Failed to update product visibility');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-16rem)]">
      {subscriptionError && (
        <SubscriptionLimitWarning message={subscriptionError} />
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ed1c24] focus:border-[#ed1c24]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border-gray-300 focus:border-[#ed1c24] focus:ring-[#ed1c24]"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Grid/List */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900">Products</h3>
          <ProductVisibilityToggle 
            onChange={setIsProductListVisible} 
          />
        </div>
        
        {!isProductListVisible ? (
          <div className="p-8 text-center text-gray-500">
            Products are currently hidden. Toggle visibility to show the product list.
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No products yet</h3>
            <p className="text-gray-500 mb-4">Get started by adding your first product</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="overflow-hidden">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <SortableContext
                    items={filteredProducts.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {filteredProducts.map((product) => (
                      <SortableRow
                        key={product.id}
                        id={product.id}
                        product={product}
                        onEdit={handleEdit}
                        onToggleVisibility={handleToggleVisibility}
                        onDelete={handleDelete}
                      />
                    ))}
                  </SortableContext>
                </tbody>
              </table>
            </DndContext>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#ed1c24] text-white shadow-lg hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24] transition-all duration-200 hover:scale-110"
        aria-label="Add New Product"
      >
        <Plus className="w-6 h-6 mx-auto" />
        <span className="sr-only">Add New Product</span>
      </button>

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={selectedProduct || undefined}
          onClose={handleCloseModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedProduct && (
        <DeleteConfirmationModal
          product={selectedProduct}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}