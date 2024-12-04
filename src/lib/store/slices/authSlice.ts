import { StateCreator } from 'zustand';
import type { Database } from '../../../types/supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthSlice {
  user: Profile | null;
  setUser: (user: Profile | null) => void;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateProfile: async (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }));
  }
});