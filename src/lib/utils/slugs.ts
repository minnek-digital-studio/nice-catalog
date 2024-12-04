import { supabase } from '../supabase';
import slugify from 'slugify';

export async function generateUniqueSlug(
  title: string,
  catalogId: string,
  currentProductId?: string
): Promise<string> {
  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query = supabase
      .from('products')
      .select('id')
      .eq('catalog_id', catalogId)
      .eq('slug', slug);

    // If updating an existing product, exclude it from the check
    if (currentProductId) {
      query.neq('id', currentProductId);
    }

    const { data, error } = await query.single();

    if (error && error.code === 'PGRST116') {
      // No match found, slug is available
      break;
    }

    if (error) {
      throw error;
    }

    if (!data) {
      break;
    }

    // Slug exists, try next counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}