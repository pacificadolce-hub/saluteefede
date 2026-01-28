import { supabase, isSupabaseConfigured } from './supabase';

// ==================== PUBLIC API ====================

export const getPackages = async () => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured');
    return [];
  }

  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const getFeaturedPackages = async () => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .limit(10);

  if (error) throw new Error(error.message);
  return data || [];
};

export const getPackageBySlug = async (slug) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) throw new Error('Package not found');
  return data;
};

export const getTestimonials = async () => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

export const createCheckoutSession = async (data) => {
  // Calls Vercel serverless function for Stripe
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create checkout session');
  return response.json();
};

export const sendContactMessage = async ({ name, email, message }) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { error } = await supabase
    .from('contacts')
    .insert({ name, email, message });

  if (error) throw new Error(error.message);
  return { success: true, message: 'Message sent successfully' };
};

// ==================== ADMIN API ====================

export const adminApi = {
  // Packages
  getPackages: async () => {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  createPackage: async (token, packageData) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('packages')
      .insert(packageData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updatePackage: async (token, id, packageData) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('packages')
      .update(packageData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deletePackage: async (token, id) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Orders
  getOrders: async () => {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('orders')
      .select('*, packages (name, price)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  updateOrderStatus: async (token, id, status) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // Testimonials
  getTestimonials: async () => {
    if (!isSupabaseConfigured()) return [];

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  createTestimonial: async (token, testimonialData) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('testimonials')
      .insert(testimonialData)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  updateTestimonial: async (token, id, testimonialData) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('testimonials')
      .update(testimonialData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  deleteTestimonial: async (token, id) => {
    if (!isSupabaseConfigured()) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return { success: true };
  },

  // Stats
  getStats: async () => {
    if (!isSupabaseConfigured()) {
      return { activePackages: 0, totalOrders: 0, totalRevenue: 0 };
    }

    const [packagesRes, ordersRes, revenueRes] = await Promise.all([
      supabase.from('packages').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('orders').select('id', { count: 'exact' }),
      supabase.from('orders').select('amount').eq('status', 'completed'),
    ]);

    const totalRevenue = revenueRes.data?.reduce((sum, order) => sum + parseFloat(order.amount || 0), 0) || 0;

    return {
      activePackages: packagesRes.count || 0,
      totalOrders: ordersRes.count || 0,
      totalRevenue
    };
  },
};
