import axios, { type AxiosInstance, type AxiosResponse } from 'axios';
import type { ApiResponse, FacebookPage } from '../types/api';
import type {
  AdminUserDetailData,
  AdminUsersListData,
  AdminPostsListData,
  AdminPost,
} from '../types/admin';

// API Configuration
// Use VITE_API_URL if set, otherwise default to the provided backend endpoint
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.postoryai.com/api';

if (!import.meta.env.VITE_API_URL) {
  console.warn('⚠️ VITE_API_URL is not set! Using default:', API_BASE_URL);
} else {
  console.log('✅ API Base URL:', API_BASE_URL);
}

// Timeouts: default for most requests; longer for uploads and post creation
const DEFAULT_TIMEOUT = 15000; // 15s for normal API calls
const UPLOAD_AND_CREATE_TIMEOUT = 360000; // 6 min for AI generation, uploads and create post (images, processing)

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
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
      const requestUrl = error.config?.url || '';
      // Don't redirect when 401 is from login/register - let the page show the error
      if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/register')) {
        return Promise.reject(error);
      }
      // Don't auto-redirect for Meta API calls - let them handle the error
      if (requestUrl.includes('/meta/')) {
        return Promise.reject(error);
      }
      // Forbidden — stay logged in (e.g. non-admin hitting admin routes)
      if (error.response?.status === 403) {
        return Promise.reject(error);
      }

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
    api.post<ApiResponse>('/posts', data, { timeout: UPLOAD_AND_CREATE_TIMEOUT }),
  
  // Generate post with AI (calls Python AI service, returns base64 image and caption)
  generateAndCreatePost: (data: {
    imageBase64: string;
    postType?: string;
    currency?: string;
    price?: string;
    backgroundType?: string;
    backgroundColor?: string;
    useModel?: string;
    modelType?: string;
    modelEthnicity?: string;
    modelGender?: string;
    customModelImage?: string; // base64
    sceneReference?: string; // base64 - scene background reference image
    addText?: string;
    addPrice?: string;
    generateCaption?: string;
    captionLanguage?: string;
  }) =>
    api.post<ApiResponse>('/posts/generate', data, { timeout: UPLOAD_AND_CREATE_TIMEOUT }),
  
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
  
  publishPost: (id: string, targetPageIds?: string[]) =>
    api.post<ApiResponse>(`/posts/${id}/publish`, targetPageIds ? { targetPageIds } : {}),
  
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
      timeout: UPLOAD_AND_CREATE_TIMEOUT,
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

// Meta/Facebook API
export const metaApi = {
  getFacebookAuthUrl: () =>
    api.get<ApiResponse<{ authUrl: string; state: string }>>('/meta/auth/facebook'),
  
  getPages: () =>
    api.get<ApiResponse<{ pages: FacebookPage[]; count: number }>>('/meta/pages'),
  
  refreshPages: () =>
    api.get<ApiResponse<{ pages: FacebookPage[]; count: number }>>('/meta/pages/refresh'),
  
  disconnectPage: (pageId: string) =>
    api.delete<ApiResponse>(`/meta/pages/${pageId}`),
};

// Admin API (JWT + role admin required)
export const adminApi = {
  listUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: 'admin' | 'user';
    plan?: 'free' | 'pro';
  }) =>
    api.get<ApiResponse<AdminUsersListData>>('/admin/users', { params }),

  getUser: (userId: string) =>
    api.get<ApiResponse<AdminUserDetailData>>(`/admin/users/${userId}`),

  updateUser: (
    userId: string,
    data: Partial<{
      name: string;
      email: string;
      role: 'admin' | 'user';
      plan: 'free' | 'pro';
      credits: number;
      generationCount: number;
    }>
  ) => api.patch<ApiResponse>(`/admin/users/${userId}`, data),

  deleteUser: (userId: string) =>
    api.delete<ApiResponse>(`/admin/users/${userId}`),

  listPosts: (params?: {
    page?: number;
    limit?: number;
    userId?: string;
    status?: 'draft' | 'scheduled' | 'posted' | 'failed';
    platform?: string;
    createdAt?: string;
  }) =>
    api.get<ApiResponse<AdminPostsListData>>('/admin/posts', { params }),

  getPost: (id: string) =>
    api.get<ApiResponse<AdminPost>>(`/admin/posts/${id}`),

  updatePost: (id: string, data: Record<string, unknown>) =>
    api.put<ApiResponse>(`/admin/posts/${id}`, data),

  deletePost: (id: string) =>
    api.delete<ApiResponse>(`/admin/posts/${id}`),
};

export default api;