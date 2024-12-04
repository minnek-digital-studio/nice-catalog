import { StateCreator } from 'zustand';
import { supabase } from '../../supabase';
import type { Database } from '../../../types/supabase';
import type { AuthSlice } from './authSlice';

type Catalog = Database['public']['Tables']['catalogs']['Row'];

export interface CatalogSlice {
  catalogs: Catalog[];
  currentCatalog: Catalog | null;
  fetchCatalogs: () => Promise<void>;
  setCurrentCatalog: (catalog: Catalog | null) => void;
  createCatalog: (catalog: Omit<Database['public']['Tables']['catalogs']['Insert'], 'user_id'>) => Promise<Catalog | null>;
  updateCatalog: (id: string, updates: Partial<Database['public']['Tables']['catalogs']['Update']>) => Promise<Catalog | null>;
}

export const createCatalogSlice: StateCreator<
  CatalogSlice & AuthSlice,
  [],
  [],
  CatalogSlice
> = (set, get) => ({
  catalogs: [],
  currentCatalog: null,

  fetchCatalogs: async () => {
    const user = get().user;
    if (!user?.id) return;

    try {
      const { data: catalogs, error } = await supabase
        .from('catalogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ catalogs: catalogs || [] });
    } catch (error) {
      console.error('Error fetching catalogs:', error);
      set({ catalogs: [] });
    }
  },

  setCurrentCatalog: (catalog) => {
    set({ currentCatalog: catalog });
  },

  createCatalog: async (catalog) => {
    const user = get().user;
    if (!user?.id) return null;

    try {
      const { data, error } = await supabase
        .from('catalogs')
        .insert({
          ...catalog,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const catalogs = get().catalogs;
      set({ catalogs: [data, ...catalogs] });
      return data;
    } catch (error) {
      console.error('Error creating catalog:', error);
      return null;
    }
  },

  updateCatalog: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('catalogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const catalogs = get().catalogs.map((c) => (c.id === id ? data : c));
      set({ catalogs });
      return data;
    } catch (error) {
      console.error('Error updating catalog:', error);
      return null;
    }
  },
});