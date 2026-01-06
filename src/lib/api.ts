import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse } from '../types/api';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// Auth API
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<ApiResponse>('/auth/register', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse>('/auth/login', data),
  
  getProfile: () =>
    api.get<ApiResponse>('/auth/me'),
  
  updateProfile: (data: { name?: string; email?: string }) =>
    api.put<ApiResponse>('/auth/profile', data),
  
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put<ApiResponse>('/auth/change-password', data),
};

// Posts API
export const postsApi = {
  createPost: (data: {
    caption?: string;
    platform: string[];
    scheduledAt?: string;
    images?: string[];
    postType?: string;
    currency?: string;
    price?: string;
    productName?: string;
    description?: string;
    backgroundType?: string;
    backgroundColor?: string;
    useModel?: string;
    modelGender?: string;
    addText?: string;
  }) =>
    api.post<ApiResponse>('/posts', data),
  
  getUserPosts: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    platform?: string;
  }) =>
    api.get<ApiResponse>('/posts', { params }),
  
  getPost: (id: string) =>
    api.get<ApiResponse>(`/posts/${id}`),
  
  updatePost: (id: string, data: any) =>
    api.put<ApiResponse>(`/posts/${id}`, data),
  
  deletePost: (id: string) =>
    api.delete<ApiResponse>(`/posts/${id}`),
  
  schedulePost: (id: string, scheduledAt: string) =>
    api.post<ApiResponse>(`/posts/${id}/schedule`, { scheduledAt }),
  
  publishPost: (id: string) =>
    api.post<ApiResponse>(`/posts/${id}/publish`),
  
  // AI Caption Generation
  generateCaption: (data: {
    prompt: string;
    platform?: string;
    language?: 'english' | 'french' | 'tunisian' | 'arabic';
    tone?: 'luxury' | 'friendly' | 'funny' | 'professional' | 'casual';
    audience?: 'men' | 'women' | 'teens' | 'general' | 'luxury_buyers';
    length?: 'short' | 'medium' | 'long';
    count?: number;
  }) =>
    api.post<ApiResponse>('/posts/generate-caption', data),
  
  generateTunisianCaption: (data: {
    prompt: string;
    platform?: string;
    tone?: 'luxury' | 'friendly' | 'funny' | 'casual';
    audience?: 'men' | 'women' | 'teens' | 'general';
  }) =>
    api.post<ApiResponse>('/posts/generate-tunisian-caption', data),
  
  generateMultipleCaptions: (data: {
    prompt: string;
    platform?: string;
    count?: number;
    language?: 'english' | 'french' | 'tunisian' | 'arabic';
    tone?: 'luxury' | 'friendly' | 'funny' | 'professional' | 'casual';
    audience?: 'men' | 'women' | 'teens' | 'general' | 'luxury_buyers';
  }) =>
    api.post<ApiResponse>('/posts/generate-multiple-captions', data),
};

// Chat API
export const chatApi = {
  respond: (data: { message: string; context?: string }) =>
    api.post<ApiResponse>('/chat/respond', data),
  
  getConversation: (params?: { page?: number; limit?: number }) =>
    api.get<ApiResponse>('/chat/conversation', { params }),
  
  getStats: () =>
    api.get<ApiResponse>('/chat/stats'),
};

// Upload API
export const uploadApi = {
  uploadImages: (formData: FormData) =>
    api.post<ApiResponse>('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  deleteImage: (publicId: string) =>
    api.delete<ApiResponse>(`/upload/images/${publicId}`),
};

// Health check
export const healthApi = {
  check: () =>
    api.get<ApiResponse>('/health'),
};

export default api;
