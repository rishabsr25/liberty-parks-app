import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/supabase-client';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    role: 'admin' | 'user' | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [role, setRole] = useState<'admin' | 'user' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if supabase client is available
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserRole(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserRole(session.user.id);
            } else {
                setRole(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserRole = async (userId: string) => {
        if (!supabase) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching role:', error);
                setRole('user'); // Default to user on error
            } else {
                setRole(data?.role as 'admin' | 'user' ?? 'user');
            }
        } catch (err) {
            console.error('Error fetching role:', err);
            setRole('user');
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        if (!supabase) {
            return { error: { message: 'Authentication is not configured' } as AuthError };
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return { error };
    };

    const signUp = async (email: string, password: string) => {
        if (!supabase) {
            return { error: { message: 'Authentication is not configured' } as AuthError };
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        return { error };
    };

    const signInWithGoogle = async () => {
        if (!supabase) {
            return { error: { message: 'Authentication is not configured' } as AuthError };
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            },
        });

        return { error };
    };

    const signOut = async () => {
        try {
            if (supabase) {
                await supabase.auth.signOut();
            }
        } catch (error) {
            console.error('Error signing out:', error);
        } finally {
            // Always clear local state
            setSession(null);
            setUser(null);
            setRole(null);
        }
    };

    const value = {
        user,
        session,
        role,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
