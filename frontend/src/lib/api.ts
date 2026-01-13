import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add token to requests if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token and redirect to login
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export const api = {
    // Auth endpoints
    auth: {
        register: (data: { name: string; email: string; password: string }) =>
            apiClient.post("/auth/register", data),
        login: (data: { email: string; password: string }) =>
            apiClient.post("/auth/login", data),
        me: () => apiClient.get("/auth/me"),
    },

    // Contact endpoints
    contacts: {
        list: (params?: {
            page?: number;
            limit?: number;
            search?: string;
            sortBy?: string;
            sortOrder?: string;
        }) => apiClient.get("/contacts", { params }),

        get: (id: string) => apiClient.get(`/contacts/${id}`),

        create: (data: { name: string; email: string; phone: string }) =>
            apiClient.post("/contacts", data),

        update: (id: string, data: Partial<{ name: string; email: string; phone: string }>) =>
            apiClient.put(`/contacts/${id}`, data),

        delete: (id: string) => apiClient.delete(`/contacts/${id}`),
    },
};

export default api;
