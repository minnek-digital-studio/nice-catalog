import { supabase } from './supabase';
import { useStore } from './store';
import type { SignUpData } from '../types';
import { clearSession } from './auth/sessionStorage';

export async function signUp({ email, password, fullName, username }: SignUpData) {
  const { data: auth, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (signUpError) throw signUpError;

  if (auth.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: auth.user.id,
      email,
      full_name: fullName,
      username: username.toLowerCase(),
    });

    if (profileError) throw profileError;
  }
  return auth;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profile) {
      useStore.getState().setUser(profile);
    }
  }

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  useStore.getState().setUser(null);
  localStorage.removeItem('catalogFormDraft');
  localStorage.removeItem('productFormDraft');
  clearSession();
}

export async function initializeAuth() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        useStore.getState().setUser(profile);
      }
    }
  } catch (error) {
    console.error('Error initializing auth:', error);
  }
}