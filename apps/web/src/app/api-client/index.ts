// API Client for making requests to the backend

export const apiClient = {
  // Base URL for API requests
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',

  // Helper method for making requests
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    token?: string
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(url, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API request failed with status ${response.status}`);
    }

    return response.json();
  },

  // Auth endpoints
  auth: {
    login: (email: string, password: string) =>
      apiClient.request('/auth/login', 'POST', { email, password }),

    register: (userData: any) => apiClient.request('/auth/register', 'POST', userData),
  },

  // Suppliers endpoints
  suppliers: {
    getAll: (token: string) => apiClient.request('/suppliers', 'GET', undefined, token),

    getById: (id: string, token: string) =>
      apiClient.request(`/suppliers/${id}`, 'GET', undefined, token),

    create: (data: any, token: string) => apiClient.request('/suppliers', 'POST', data, token),

    update: (id: string, data: any, token: string) =>
      apiClient.request(`/suppliers/${id}`, 'PUT', data, token),

    delete: (id: string, token: string) =>
      apiClient.request(`/suppliers/${id}`, 'DELETE', undefined, token),
  },

  // Orders endpoints
  orders: {
    getAll: (token: string) => apiClient.request('/orders', 'GET', undefined, token),

    getById: (id: string, token: string) =>
      apiClient.request(`/orders/${id}`, 'GET', undefined, token),

    create: (data: any, token: string) => apiClient.request('/orders', 'POST', data, token),

    update: (id: string, data: any, token: string) =>
      apiClient.request(`/orders/${id}`, 'PUT', data, token),

    delete: (id: string, token: string) =>
      apiClient.request(`/orders/${id}`, 'DELETE', undefined, token),
  },

  // Products endpoints
  products: {
    getAll: (token: string) => apiClient.request('/products', 'GET', undefined, token),

    getById: (id: string, token: string) =>
      apiClient.request(`/products/${id}`, 'GET', undefined, token),

    create: (data: any, token: string) => apiClient.request('/products', 'POST', data, token),

    update: (id: string, data: any, token: string) =>
      apiClient.request(`/products/${id}`, 'PUT', data, token),

    delete: (id: string, token: string) =>
      apiClient.request(`/products/${id}`, 'DELETE', undefined, token),
  },
};
