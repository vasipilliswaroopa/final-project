import axios from "axios";

const getBaseURL = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined") {
    // If we are in production deployment (e.g. Vercel), we use the relative /api proxy
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && !window.location.hostname.startsWith("192.168.") && !window.location.hostname.startsWith("10.") && !window.location.hostname.startsWith("172.")) {
      return "/api";
    }
    // For local network / development, use the current host with backend port 10000
    return `${window.location.protocol}//${window.location.hostname}:10000/api`;
  }
  return "http://localhost:10000/api";
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const currentUserStr = localStorage.getItem("currentUser");
    if (currentUserStr) {
      const currentUser = JSON.parse(currentUserStr);
      if (currentUser && currentUser.token) {
        config.headers.Authorization = `Bearer ${currentUser.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface Product {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

export interface User {
  id?: number;
  name?: string;
  email: string;
  password?: string;
  token?: string;
}

export interface DashboardStats {
  categories: number;
  products: number;
  inStock: number;
  outOfStock: number;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>("/dashboard/stats");
    return response.data;
  },
};

export const productService = {
  getAllProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/products");
    return response.data;
  },
  createProduct: async (product: Product): Promise<Product> => {
    const response = await apiClient.post<Product>("/products", product);
    return response.data;
  },
  deleteProduct: async (id: number): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

export const userService = {
  login: async (user: User): Promise<User> => {
    const response = await apiClient.post<User>("/auth/login", user);
    return response.data;
  },
  signup: async (user: User): Promise<User> => {
    const response = await apiClient.post<User>("/auth/register", user);
    return response.data;
  },
  updateProfile: async (id: number, user: User): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, user);
    return response.data;
  },
};

export interface Stock {
  symbol: string;
  price: number;
}

export const stockService = {
  getStocks: async (): Promise<Stock[]> => {
    const response = await apiClient.get<Stock[]>("/stocks");
    return response.data;
  },
};

export const healthService = {
  checkHealth: async (): Promise<boolean> => {
    try {
      const apiURL = getBaseURL();
      const rootURL = apiURL.endsWith("/api") ? apiURL.substring(0, apiURL.length - 4) : apiURL;
      const response = await axios.get<string>(`${rootURL}/health`);
      return response.data === "OK";
    } catch (err) {
      console.error("Health check failed", err);
      return false;
    }
  },
};

export default apiClient;