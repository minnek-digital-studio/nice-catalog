import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createCatalogSlice, CatalogSlice } from './slices/catalogSlice';

export const useStore = create<AuthSlice & CatalogSlice>()((...args) => ({
  ...createAuthSlice(...args),
  ...createCatalogSlice(...args),
}));