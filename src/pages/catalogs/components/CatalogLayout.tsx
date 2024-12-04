import React from 'react';
import type { Database } from '../../../types/supabase';
import SearchBar from '../../../components/SearchBar';
import FilterPanel from '../../../components/FilterPanel';
import ProductCard from '../../../components/ProductCard';
import CategoryIcons from '../../../components/CategoryIcons';

type Product = Database['public']['Tables']['products']['Row'] & {
  category: Database['public']['Tables']['categories']['Row'] | null;
};

type Catalog = Database['public']['Tables']['catalogs']['Row'] & {
  profile: Database['public']['Tables']['profiles']['Row'];
  products: Product[];
  categories: Database['public']['Tables']['categories']['Row'][];
};

interface Props {
  catalog: Catalog;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
  filteredProducts: Product[];
}

export default function CatalogLayout({
  catalog,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedBrands,
  onBrandsChange,
  filteredProducts,
}: Props) {
  const uniqueBrands = Array.from(new Set(catalog.products.map(p => p.brand)));

  // Group products by category
  const productsByCategory = catalog.categories.reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(
      product => product.category_id === category.id
    );
    if (categoryProducts.length > 0) {
      acc[category.id] = {
        name: category.name,
        products: categoryProducts,
      };
    }
    return acc;
  }, {} as Record<string, { name: string; products: Product[] }>);

  // Get products without category
  const uncategorizedProducts = filteredProducts.filter(
    product => !product.category_id
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{catalog.name}</h1>
              {catalog.description && (
                <p className="mt-2 text-gray-600">{catalog.description}</p>
              )}
            </div>
            {catalog.profile.logo_url && (
              <div className="flex-shrink-0 ml-4">
                <img
                  src={catalog.profile.logo_url}
                  alt="Brand Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
            <CategoryIcons
              categories={catalog.categories}
              selectedCategory={selectedCategory}
              onSelect={onCategoryChange}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FilterPanel
                categories={catalog.categories}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                brands={uniqueBrands}
                selectedBrands={selectedBrands}
                onBrandsChange={onBrandsChange}
              />
            </div>

            <div className="lg:col-span-3 space-y-12">
              <SearchBar
                value={searchQuery}
                onChange={onSearchChange}
                placeholder="Search products..."
              />

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
              ) : selectedCategory ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        category={product.category}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Display products by category */}
                  {Object.entries(productsByCategory).map(([categoryId, { name, products }]) => (
                    <div key={categoryId} className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
                        {products.length > 0 && (
                          <span className="text-sm text-gray-500">
                            {products.length} {products.length === 1 ? 'product' : 'products'}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            category={product.category}
                          />
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Display uncategorized products if any */}
                  {uncategorizedProducts.length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Other Products</h2>
                        <span className="text-sm text-gray-500">
                          {uncategorizedProducts.length} {uncategorizedProducts.length === 1 ? 'product' : 'products'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                        {uncategorizedProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            category={null}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}