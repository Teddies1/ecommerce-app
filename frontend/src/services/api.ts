import axios from 'axios';
import { Product, ProductsResponse, Order } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const productApi = {
  getProducts: async (params: {
    page?: number;
    limit?: number;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }): Promise<ProductsResponse> => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
};

export const orderApi = {
  createOrder: async (orderData: {
    productId: number;
    quantity: number;
    customerName: string;
    customerEmail: string;
  }): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};