import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/supabase-client';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
    signUp: (email: string, password: string, firstName: string, lastName: string) => Promise<{ session: Session | null; error: AuthError | null }>;
    signInWithGoogle: () => Promise<{ error: AuthError | null }>;
    signOut: () => Promise<void>;
    verifyOtp: (email: string, token: string) => Promise<{ session: Session | null; error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if supabase client is available
        if (!supabase) {
            // Local mock session for Google review
            const savedUser = localStorage.getItem('mock_user');
            const savedSession = localStorage.getItem('mock_session');
            if (savedUser && savedSession) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                    setSession(JSON.parse(savedSession));
                    setIsAdmin(parsedUser.email?.includes('admin') ?? false);
                } catch (e) {
                    console.error('Failed to parse mock session:', e);
                }
            }
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                checkAdminStatus(session.user.id);
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
                checkAdminStatus(session.user.id);
            } else {
                setIsAdmin(false);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const checkAdminStatus = async (userId: string) => {
        if (!supabase) return;

        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('admin')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching admin status:', error);
                setIsAdmin(false);
            } else {
                setIsAdmin(data?.admin ?? false);
            }
        } catch (err) {
            console.error('Error fetching admin status:', err);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const signIn = async (email: string, password: string) => {
        if (supabase) {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            return { error };
        }

        // Local mock sign in for Google review
        const mockUser = {
            id: 'mock-user-' + Math.random().toString(36).substring(2, 11),
            email,
            user_metadata: {
                full_name: email.split('@')[0],
            },
        } as User;

        const mockSession = {
            access_token: 'mock-access-token',
            user: mockUser,
        } as Session;

        setUser(mockUser);
        setSession(mockSession);
        setIsAdmin(email.toLowerCase().includes('admin'));
        setLoading(false);

        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_session', JSON.stringify(mockSession));

        return { error: null };
    };

    const signUp = async (email: string, password: string, firstName: string, lastName: string) => {
        if (supabase) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: `${firstName} ${lastName}`.trim(),
                    },
                },
            });
            return { session: data?.session ?? null, error };
        }

        // Local mock sign up for Google review
        const mockUser = {
            id: 'mock-user-' + Math.random().toString(36).substring(2, 11),
            email,
            user_metadata: {
                full_name: `${firstName} ${lastName}`.trim(),
            },
        } as User;

        const mockSession = {
            access_token: 'mock-access-token',
            user: mockUser,
        } as Session;

        setUser(mockUser);
        setSession(mockSession);
        setIsAdmin(email.toLowerCase().includes('admin'));
        setLoading(false);

        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_session', JSON.stringify(mockSession));

        return { session: mockSession, error: null };
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
            setIsAdmin(false);
            localStorage.removeItem('mock_user');
            localStorage.removeItem('mock_session');
        }
    };

    const verifyOtp = async (email: string, token: string) => {
        if (supabase) {
            const { data, error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup',
            });

            if (data?.session) {
                setSession(data.session);
                setUser(data.session.user);
                if (data.session.user) {
                    checkAdminStatus(data.session.user.id);
                }
            }

            return { session: data?.session ?? null, error };
        }

        // Mock verification fallback (if no supabase backend, e.g. for preview testing)
        const mockUser = {
            id: 'mock-user-verified',
            email,
            user_metadata: {
                full_name: email.split('@')[0],
            },
        } as User;

        const mockSession = {
            access_token: 'mock-access-token-verified',
            user: mockUser,
        } as Session;

        setUser(mockUser);
        setSession(mockSession);
        setIsAdmin(email.toLowerCase().includes('admin'));
        setLoading(false);

        localStorage.setItem('mock_user', JSON.stringify(mockUser));
        localStorage.setItem('mock_session', JSON.stringify(mockSession));

        return { session: mockSession, error: null };
    };

    const value = {
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        verifyOtp,
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
