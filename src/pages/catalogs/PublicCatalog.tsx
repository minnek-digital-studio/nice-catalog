import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../types/supabase';
import CatalogLayout from './components/CatalogLayout';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

type Product = Database['public']['Tables']['products']['Row'] & {
  category: Database['public']['Tables']['categories']['Row'] | null;
};

type Catalog = Database['public']['Tables']['catalogs']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'];
  products: Product[];
  categories: Database['public']['Tables']['categories']['Row'][];
};

export default function PublicCatalog() {
  const { username, slug } = useParams<{ username: string; slug: string }>();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        if (!username || !slug) {
          throw new Error('Missing username or catalog URL');
        }

        // First get the user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username.toLowerCase())
          .single();

        if (profileError) {
          throw new Error('User not found');
        }

        // Then get the catalog
        const { data: catalogData, error: catalogError } = await supabase
          .from('catalogs')
          .select('*, profile:profiles(*)')
          .eq('user_id', profile.id)
          .eq('slug', slug.toLowerCase())
          .eq('is_published', true)
          .single();

        if (catalogError) {
          throw new Error('Catalog not found');
        }

        // Get products for this catalog
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*, category:categories(*)')
          .eq('catalog_id', catalogData.id)
          .eq('visible', true)
          .order('position', { ascending: true });

        if (productsError) {
          throw new Error('Failed to load products');
        }

        // Get categories for this catalog
        const { data: categories, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .eq('catalog_id', catalogData.id)
          .order('name');

        if (categoriesError) {
          throw new Error('Failed to load categories');
        }

        setCatalog({
          ...catalogData,
          products: products || [],
          categories: categories || []
        });
      } catch (error: any) {
        console.error('Error fetching catalog:', error);
        toast.error(error.message || 'Failed to load catalog');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [username, slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ed1c24] animate-spin" />
      </div>
    );
  }

  if (!catalog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Catalog Not Found</h1>
          <p className="text-gray-600 mb-6">This catalog might be private or doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ed1c24] hover:bg-[#d91920]"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  const filteredProducts = catalog.products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <>
      <Helmet>
        <title>{catalog.name}</title>
        <meta name="description" content={catalog.description || `Product catalog by ${catalog.profile.full_name}`} />
        <meta name="robots" content="noindex" />
      </Helmet>
      <CatalogLayout
        catalog={catalog}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedBrands={selectedBrands}
        onBrandsChange={setSelectedBrands}
        filteredProducts={filteredProducts}
      />
    </>
  );
}