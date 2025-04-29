import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(
      new Error(error.message ?? "An unknown error occurred"),
    );
  },
);

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },
};

export const orders = {
  getAll: async () => {
    const response = await api.get("/orders");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  create: async (orderData: any) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },
  update: async (id: string, orderData: any) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export const products = {
  getAll: async () => {
    const response = await api.get("/products");
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (productData: any) => {
    const response = await api.post("/products", productData);
    return response.data;
  },
  update: async (id: string, productData: any) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default api;
