import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from '../../types/supabase';
import { useStore } from '../store';
import { saveSession, clearSession } from './sessionStorage';
import LoadingScreen from '../../components/common/LoadingScreen';
import { signOut as authSignOut } from '../auth';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthState {
    user: User | null;
    profile: Profile | null;
    loading: boolean;
    initialized: boolean;
}

interface AuthContextType extends AuthState {
    signIn: (email: string, password: string, remember?: boolean) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const setUser = useStore((state) => state.setUser);
    const [state, setState] = useState<AuthState>({
        user: null,
        profile: null,
        loading: false,
        initialized: false,
    });

    useEffect(() => {
        const initialize = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    await fetchProfile(session.user.id);
                } else {
                    setState(prev => ({
                        ...prev,
                        loading: false,
                        initialized: true
                    }));
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setState(prev => ({
                    ...prev,
                    loading: false,
                    initialized: true
                }));
            }
        };
        if (!state.initialized) initialize();
    }, [setUser]);// eslint-disable-line react-hooks/exhaustive-deps

    const fetchProfile = async (userId: string) => {
        try {
            console.log('fetching profile');
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            console.log('profile', profile);
            console.log(error);
            const { data: { user } } = await supabase.auth.getUser();

            setUser(profile);
            setState({
                user: user,
                profile: profile,
                loading: false,
                initialized: true
            });
        } catch (error) {
            console.log(error);
            console.error('Error fetching profile:', error);
            setState(prev => ({
                ...prev,
                loading: false,
                initialized: true
            }));
        }
    };

    const signIn = async (email: string, password: string, remember: boolean = false) => {
        setState(prev => ({ ...prev, loading: true }));

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.session) {
                saveSession(data.session, remember);
                if (data.user) {
                    await fetchProfile(data.user.id);
                }
            }
        } catch (error) {
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    const signOut = async () => {
        setState(prev => ({ ...prev, loading: true }));

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            clearSession();
            setUser(null);
            setState({
                user: null,
                profile: null,
                loading: false,
                initialized: true
            });
            await authSignOut();
            
        } catch (error) {
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    const updateProfile = async (updates: Partial<Profile>) => {
        if (!state.user) throw new Error('No user logged in');

        setState(prev => ({ ...prev, loading: true }));

        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', state.user.id)
                .select()
                .single();

            if (error) throw error;

            setUser(data);
            setState(prev => ({
                ...prev,
                profile: data,
                loading: false
            }));
        } catch (error) {
            setState(prev => ({ ...prev, loading: false }));
            throw error;
        }
    };

    if (!state.initialized) {
        return <LoadingScreen />;
    }

    const value = {
        ...state,
        signIn,
        signOut,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
