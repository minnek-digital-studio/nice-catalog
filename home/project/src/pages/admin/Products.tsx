import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductTabs from '../../components/admin/ProductTabs';
import { toast } from 'react-hot-toast';

export default function ProductsPage() {
  const { catalogId } = useParams<{ catalogId: string }>();
  const navigate = useNavigate();
  const { catalogs, setCurrentCatalog } = useStore();

  useEffect(() => {
    const loadCatalog = async () => {
      if (!catalogId) {
        navigate('/admin/catalogs');
        return;
      }

      const catalog = catalogs.find(c => c.id === catalogId);
      if (catalog) {
        setCurrentCatalog(catalog);
      } else {
        toast.error('Catalog not found');
        navigate('/admin/catalogs');
      }
    };

    loadCatalog();
  }, [catalogId, catalogs, navigate, setCurrentCatalog]);

  return (
    <AdminLayout>
      <ProductTabs />
    </AdminLayout>
  );
}