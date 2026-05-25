import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
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