import { useEffect, useState } from 'react';
import { useStore } from '../../lib/store';
import AdminLayout from '../../components/admin/AdminLayout';
import CatalogForm from '../../components/admin/CatalogForm';
import TopNav from '../../components/admin/TopNav';
import CatalogOptions from '../../components/admin/CatalogOptions';
import SubscriptionLimitWarning from '../../components/admin/SubscriptionLimitWarning';
import { Plus, Book, Globe, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../lib/auth/AuthProvider';
import { useNavigate } from 'react-router-dom';


export default function CatalogsPage() {
  const { user, catalogs, fetchCatalogs, updateCatalog } = useStore();
  const [showCatalogForm, setShowCatalogForm] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    fetchCatalogs();
  }, [fetchCatalogs]);

  const handleTogglePublish = async (id: string, isPublished: boolean) => {
    try {
      await updateCatalog(id, { is_published: !isPublished });
      toast.success(isPublished ? 'Catalog unpublished' : 'Catalog published');
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes('Catalog limit reached')) {
        setSubscriptionError(error.message);
      } else {
        toast.error('Failed to update catalog');
      }
    }
  };

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

  const handleCreateSuccess = () => {
    setShowCatalogForm(false);
    fetchCatalogs();
    toast.success('Catalog created successfully');
    setSubscriptionError(null);
  };

  const handleCreateError = (error: Error) => {
    if (error.message?.includes('Catalog limit reached')) {
      setSubscriptionError(error.message);
      setShowCatalogForm(false);
    } else {
      toast.error(error.message || 'Failed to create catalog');
    }
  };

  return (
    <AdminLayout>
      <TopNav onSignOut={handleSignOut} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {subscriptionError && (
          <SubscriptionLimitWarning message={subscriptionError} />
        )}

        {catalogs.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center">
            <Book className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No catalogs yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first product catalog.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCatalogForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ed1c24] hover:bg-[#d91920] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ed1c24]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Catalog
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (subscriptionError) return;
                  setShowCatalogForm(true)
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#ed1c24] hover:bg-[#d91920] disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={subscriptionError !== null}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Catalog
              </button>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {catalogs.map((catalog) => (
                <div
                  key={catalog.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">{catalog.name}</h3>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTogglePublish(catalog.id, !!catalog.is_published)}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            catalog.is_published
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {catalog.is_published ? (
                            <>
                              <Globe className="w-3 h-3 mr-1" />
                              Published
                            </>
                          ) : (
                            <>
                              <Lock className="w-3 h-3 mr-1" />
                              Private
                            </>
                          )}
                        </button>
                        <CatalogOptions
                          catalog={catalog}
                          onUpdate={fetchCatalogs}
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-500 mb-4">
                      {catalog.description || 'No description provided'}
                    </p>

                    <div className="space-y-3">
                      <Link
                        to={`/admin/catalogs/${catalog.id}/products`}
                        className="block w-full text-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Manage Products
                      </Link>
                      {catalog.is_published && user && (
                        <Link
                          to={`/${user.username}/${catalog.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#ed1c24] hover:bg-[#d91920]"
                        >
                          View Public Page
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showCatalogForm && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <h2 className="text-lg font-medium mb-4">Create New Catalog</h2>
              <CatalogForm
                onSuccess={handleCreateSuccess}
                onError={handleCreateError}
                onCancel={() => setShowCatalogForm(false)}
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
