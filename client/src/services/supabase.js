import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if URL and key are valid
const isConfigured = supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey;

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => isConfigured;

export const signIn = async (email, password) => {
  if (!supabase) {
    return { data: null, error: { message: 'Supabase non configurato' } };
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  if (!supabase) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getSession = async () => {
  if (!supabase) {
    return { session: null, error: null };
  }
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const onAuthStateChange = (callback) => {
  if (!supabase) {
    // Return a mock subscription object
    return { data: { subscription: { unsubscribe: () => {} } } };
  }
  return supabase.auth.onAuthStateChange(callback);
};

export const uploadFile = async (bucket, path, file) => {
  if (!supabase) {
    throw new Error('Supabase non configurato');
  }
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return publicUrl;
};
