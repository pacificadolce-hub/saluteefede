import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getSession, onAuthStateChange, isSupabaseConfigured } from '../services/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

// Demo admin user
const DEMO_USER = {
  id: 'demo-admin',
  email: 'admin@demo.com',
  role: 'admin',
  isDemo: true,
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for demo user in localStorage
    const demoUser = localStorage.getItem('demo_admin');
    if (demoUser) {
      setUser(JSON.parse(demoUser));
      setLoading(false);
      return;
    }

    // If Supabase is not configured, just set loading to false
    if (!isSupabaseConfigured()) {
      setLoading(false);
      return;
    }

    // Get initial session
    getSession().then(({ session }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    // Demo mode login
    if (!isSupabaseConfigured()) {
      if (email === 'admin@demo.com' && password === 'demo123') {
        localStorage.setItem('demo_admin', JSON.stringify(DEMO_USER));
        setUser(DEMO_USER);
        return { data: { user: DEMO_USER }, error: null };
      }
      return { data: null, error: { message: 'Credenziali non valide. Usa admin@demo.com / demo123' } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signInDemo = () => {
    localStorage.setItem('demo_admin', JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
    return { data: { user: DEMO_USER }, error: null };
  };

  const signOut = async () => {
    // Check for demo user
    const demoUser = localStorage.getItem('demo_admin');
    if (demoUser) {
      localStorage.removeItem('demo_admin');
      setUser(null);
      return { error: null };
    }

    if (!supabase) {
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signInDemo,
    signOut,
    getAccessToken: () => session?.access_token || 'demo-token',
    isConfigured: isSupabaseConfigured(),
    isDemo: user?.isDemo || false,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
