import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Link } from 'lucide-react';
import { Menu, Transition } from '@headlessui/react';
import CatalogEditModal from './CatalogEditModal';
import CatalogUrlModal from './CatalogUrlModal';
import DeleteCatalogModal from './DeleteCatalogModal';
import type { Database } from '../../types/supabase';

type Catalog = Database['public']['Tables']['catalogs']['Row'];

interface Props {
  catalog: Catalog;
  onUpdate: () => void;
}

export default function CatalogOptions({ catalog, onUpdate }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
          <MoreVertical className="w-5 h-5 text-gray-500" />
        </Menu.Button>

        <Transition
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Details
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setShowUrlModal(true)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Change URL
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } flex w-full items-center px-4 py-2 text-sm text-red-600`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Catalog
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {showEditModal && (
        <CatalogEditModal
          catalog={catalog}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            onUpdate();
          }}
        />
      )}

      {showUrlModal && (
        <CatalogUrlModal
          catalogId={catalog.id}
          currentUrl={catalog.slug}
          onClose={() => setShowUrlModal(false)}
          onSuccess={() => {
            setShowUrlModal(false);
            onUpdate();
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteCatalogModal
          catalog={catalog}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
}