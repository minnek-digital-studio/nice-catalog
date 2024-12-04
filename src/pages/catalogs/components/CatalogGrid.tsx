import React from 'react';
import type { Database } from '../../../types/supabase';
import ProductCard from '../../../components/ProductCard';

type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row'] | null;
};

interface Props {
  product: Product;
}

export default function CatalogGrid({ product }: Props) {
  return <ProductCard product={product} category={product.category} />;
}