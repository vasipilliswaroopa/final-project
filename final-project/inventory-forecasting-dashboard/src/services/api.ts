import axios from "axios";

const getBaseURL = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return "https://stock-backend-api-zwy1.onrender.com/api"; // <-- Fixed: Your Render URL
  }
  return "http://localhost:8080/api";
};

const apiClient = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Added: Auto attach JWT for ProtectedRoute
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Added: Auto logout on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Product {
  id?: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  inStock?: boolean; // Added for stock pages
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

export interface Category {
  id?: number;
  name: string;
}

export interface PredictionData {
  productId: number;
  productName: string;
  predictedStock: number;
  date: string;
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
  // Added: For InStock.tsx page
  getInStockProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/products/in-stock");
    return response.data;
  },
  // Added: For Outofstock.tsx page
  getOutOfStockProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/products/out-of-stock");
    return response.data;
  },
};

export const userService = {
  login: async (user: User): Promise<any> => { // Changed: return type to any for token
    const response = await apiClient.post("/users/login", user);
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

// Added: For Category.tsx page
export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>("/categories");
    return response.data;
  },
  createCategory: async (category: Category): Promise<Category> => {
    const response = await apiClient.post<Category>("/categories", category);
    return response.data;
  },
};

// Added: For Futureprediction.tsx page
export const predictionService = {
  getPrediction: async (): Promise<PredictionData[]> => {
    const response = await apiClient.get<PredictionData[]>("/prediction");
    return response.data;
  },
};

export default apiClient;