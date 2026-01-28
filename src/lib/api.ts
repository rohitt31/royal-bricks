// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('adminToken');
};

// Set token to localStorage
export const setToken = (token: string) => {
    localStorage.setItem('adminToken', token);
};

// Remove token from localStorage
export const removeToken = () => {
    localStorage.removeItem('adminToken');
};

// API request helper
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'API request failed');
    }

    return data;
};

// Auth API
export const authAPI = {
    login: async (email: string, password: string) => {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.success && data.data.token) {
            setToken(data.data.token);
        }
        return data;
    },

    getCurrentUser: async () => {
        return await apiRequest('/auth/me');
    },

    updatePassword: async (currentPassword: string, newPassword: string) => {
        return await apiRequest('/auth/update-password', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },

    logout: () => {
        removeToken();
    },
};

// Bookings API
export const bookingsAPI = {
    getAll: async (params?: {
        status?: string;
        area?: string;
        city?: string;
        search?: string;
        page?: number;
        limit?: number;
        fromDate?: string;
        toDate?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }
        const query = queryParams.toString();
        return await apiRequest(`/bookings${query ? `?${query}` : ''}`);
    },

    getById: async (id: string) => {
        return await apiRequest(`/bookings/${id}`);
    },

    create: async (bookingData: any) => {
        return await apiRequest('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    },

    update: async (id: string, bookingData: any) => {
        return await apiRequest(`/bookings/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookingData),
        });
    },

    delete: async (id: string) => {
        return await apiRequest(`/bookings/${id}`, {
            method: 'DELETE',
        });
    },

    getStats: async (params?: { fromDate?: string; toDate?: string }) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
        }
        const query = queryParams.toString();
        return await apiRequest(`/bookings/stats/overview${query ? `?${query}` : ''}`);
    },

    getRevenueByArea: async (params?: { limit?: number; fromDate?: string; toDate?: string }) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) queryParams.append(key, value.toString());
            });
        }
        const query = queryParams.toString();
        return await apiRequest(`/bookings/stats/revenue-by-area${query ? `?${query}` : ''}`);
    },
};

// Queries API
export const queriesAPI = {
    getAll: async (params?: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
        fromDate?: string;
        toDate?: string;
    }) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value.toString());
                }
            });
        }
        const query = queryParams.toString();
        return await apiRequest(`/queries${query ? `?${query}` : ''}`);
    },

    getById: async (id: string) => {
        return await apiRequest(`/queries/${id}`);
    },

    create: async (queryData: any) => {
        return await apiRequest('/queries', {
            method: 'POST',
            body: JSON.stringify(queryData),
        });
    },

    update: async (id: string, queryData: any) => {
        return await apiRequest(`/queries/${id}`, {
            method: 'PUT',
            body: JSON.stringify(queryData),
        });
    },

    delete: async (id: string) => {
        return await apiRequest(`/queries/${id}`, {
            method: 'DELETE',
        });
    },

    getStats: async (params?: { fromDate?: string; toDate?: string }) => {
        const queryParams = new URLSearchParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });
        }
        const query = queryParams.toString();
        return await apiRequest(`/queries/stats/overview${query ? `?${query}` : ''}`);
    },
};
