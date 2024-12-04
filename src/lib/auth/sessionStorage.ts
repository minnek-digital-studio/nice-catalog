import { Session } from '@supabase/supabase-js';

const SESSION_KEY = 'sb-session';
const REMEMBER_KEY = 'sb-remember';

export function saveSession(session: Session, remember: boolean = false) {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem(REMEMBER_KEY, remember.toString());
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

export function getSession(): Session | null {
  try {
    const remembered = localStorage.getItem(REMEMBER_KEY) === 'true';
    const storage = remembered ? localStorage : sessionStorage;
    const sessionStr = storage.getItem(SESSION_KEY);
    
    if (!sessionStr) return null;

    return JSON.parse(sessionStr);
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}