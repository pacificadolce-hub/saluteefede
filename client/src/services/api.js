const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getHeaders = (token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// ==================== PUBLIC API ====================

export const getPackages = async () => {
  const response = await fetch(`${API_URL}/api/packages`);
  if (!response.ok) throw new Error('Failed to fetch packages');
  return response.json();
};

export const getFeaturedPackages = async () => {
  const response = await fetch(`${API_URL}/api/packages/featured`);
  if (!response.ok) throw new Error('Failed to fetch featured packages');
  return response.json();
};

export const getPackageBySlug = async (slug) => {
  const response = await fetch(`${API_URL}/api/packages/${slug}`);
  if (!response.ok) throw new Error('Package not found');
  return response.json();
};

export const getTestimonials = async () => {
  const response = await fetch(`${API_URL}/api/testimonials`);
  if (!response.ok) throw new Error('Failed to fetch testimonials');
  return response.json();
};

export const createCheckoutSession = async (data) => {
  const response = await fetch(`${API_URL}/api/checkout`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create checkout session');
  return response.json();
};

export const sendContactMessage = async (data) => {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to send message');
  return response.json();
};

// ==================== ADMIN API ====================

export const adminApi = {
  // Packages
  getPackages: async (token) => {
    const response = await fetch(`${API_URL}/api/admin/packages`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch packages');
    return response.json();
  },

  createPackage: async (token, data) => {
    const response = await fetch(`${API_URL}/api/admin/packages`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create package');
    }
    return response.json();
  },

  updatePackage: async (token, id, data) => {
    const response = await fetch(`${API_URL}/api/admin/packages/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update package');
    }
    return response.json();
  },

  deletePackage: async (token, id) => {
    const response = await fetch(`${API_URL}/api/admin/packages/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete package');
    return response.json();
  },

  // Orders
  getOrders: async (token) => {
    const response = await fetch(`${API_URL}/api/admin/orders`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  updateOrderStatus: async (token, id, status) => {
    const response = await fetch(`${API_URL}/api/admin/orders/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },

  // Testimonials
  getTestimonials: async (token) => {
    const response = await fetch(`${API_URL}/api/admin/testimonials`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch testimonials');
    return response.json();
  },

  createTestimonial: async (token, data) => {
    const response = await fetch(`${API_URL}/api/admin/testimonials`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create testimonial');
    return response.json();
  },

  updateTestimonial: async (token, id, data) => {
    const response = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update testimonial');
    return response.json();
  },

  deleteTestimonial: async (token, id) => {
    const response = await fetch(`${API_URL}/api/admin/testimonials/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to delete testimonial');
    return response.json();
  },

  // Stats
  getStats: async (token) => {
    const response = await fetch(`${API_URL}/api/admin/stats`, {
      headers: getHeaders(token),
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};
