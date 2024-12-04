import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
  global: {
    headers: {
      'x-application-name': 'catalog-pro'
    }
  },
  db: {
    schema: 'public'
  }
});

// Add error handling for network issues
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Clear any cached data
    localStorage.removeItem('catalogFormDraft');
    localStorage.removeItem('productFormDraft');
  }
});

// Add network error detection
let isOffline = false;

window.addEventListener('online', () => {
  if (isOffline) {
    isOffline = false;
    // Refresh data when coming back online
    window.location.reload();
  }
});

window.addEventListener('offline', () => {
  isOffline = true;
});

// Add request retry logic
export async function retryRequest<T>(
  request: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await request();
    } catch (error: any) {
      lastError = error;
      if (error.message === 'Failed to fetch' || error.code === 'NETWORK_ERROR') {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      throw error;
    }
  }
  
  throw lastError;
}