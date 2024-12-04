import { supabase } from './supabase';

export async function checkUsernameAvailability(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username.toLowerCase())
      .single();

    if (error && error.code === 'PGRST116') {
      // No match found, username is available
      return true;
    }

    // Username exists
    return false;
  } catch (error) {
    console.error('Error checking username availability:', error);
    throw error;
  }
}

export async function checkCatalogUrlAvailability(url: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('catalogs')
      .select('slug')
      .eq('slug', url.toLowerCase())
      .single();

    if (error && error.code === 'PGRST116') {
      // No match found, URL is available
      return true;
    }

    // URL exists
    return false;
  } catch (error) {
    console.error('Error checking catalog URL availability:', error);
    throw error;
  }
}

export async function updateCatalogUrl(catalogId: string, newUrl: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('catalogs')
      .update({ slug: newUrl.toLowerCase() })
      .eq('id', catalogId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating catalog URL:', error);
    throw error;
  }
}