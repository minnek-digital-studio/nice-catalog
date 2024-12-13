import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../lib/store';
import AdminLayout from '../../components/admin/AdminLayout';
import ProductTabs from '../../components/admin/ProductTabs';
import TopNav from '../../components/admin/TopNav';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../lib/auth/AuthProvider';

export default function ProductsPage() {
  const { catalogId } = useParams<{ catalogId: string }>();
  const navigate = useNavigate();
  const { catalogs, setCurrentCatalog } = useStore();
  const { signOut } = useAuth();

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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Failed to sign out');
      } else {
        toast.error('Failed to sign out');
      }
    }
  };

  return (
    <AdminLayout>
      <TopNav onSignOut={handleSignOut} />
      <ProductTabs />
    </AdminLayout>
  );
}