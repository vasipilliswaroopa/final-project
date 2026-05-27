import axios from "axios";

const getBaseURL = (): string => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "/api";
  }
  return "http://localhost:8080/api";
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

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
    const response = await apiClient.post<User>("/users/login", user);
    return response.data;
  },
  signup: async (user: User): Promise<User> => {
    const response = await apiClient.post<User>("/users", user);
    return response.data;
  },
  updateProfile: async (id: number, user: User): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, user);
    return response.data;
  },
};

export default apiClient;