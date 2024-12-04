import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Database } from '../types/supabase';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
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

export default function CatalogPage() {
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
          throw new Error('Invalid URL');
        }

        // First get the user's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username.toLowerCase())
          .single();

        if (profileError) throw new Error('User not found');

        // Then get the catalog with related data
        const { data: catalogData, error: catalogError } = await supabase
          .from('catalogs')
          .select(`
            *,
            profile:profiles(*),
            products:products(
              *,
              category:categories(*)
            ),
            categories:categories(*)
          `)
          .eq('user_id', profile.id)
          .eq('slug', slug.toLowerCase())
          .eq('is_published', true)
          .single();

        if (catalogError) throw new Error('Catalog not found');

        setCatalog(catalogData);
      } catch (error: any) {
        console.error('Error fetching catalog:', error);
        toast.error(error.message);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Catalog Not Found</h1>
          <p className="text-gray-600">This catalog might be private or doesn't exist.</p>
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

  const uniqueBrands = Array.from(new Set(catalog.products.map(p => p.brand)));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">{catalog.name}</h1>
          {catalog.description && (
            <p className="mt-2 text-gray-600">{catalog.description}</p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterPanel
              categories={catalog.categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              brands={uniqueBrands}
              selectedBrands={selectedBrands}
              onBrandsChange={setSelectedBrands}
            />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search products..."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={product.category}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}