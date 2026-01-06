import { create } from 'zustand';
import { postsApi, chatApi } from '../lib/api';
import type { Post, Message, DashboardStats } from '../types/api';

interface PostsState {
  posts: Post[];
  messages: Message[];
  stats: DashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

interface PostsActions {
  // Posts
  fetchPosts: (params?: { page?: number; limit?: number; status?: string; platform?: string }) => Promise<void>;
  createPost: (data: { 
    caption: string; 
    aiPrompt: string; 
    platform: string[]; 
    scheduledAt?: string; 
    images?: string[];
    postType?: string;
    currency?: string;
    price?: string;
    productName?: string;
    description?: string;
  }) => Promise<Post>;
  updatePost: (id: string, data: any) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  schedulePost: (id: string, scheduledAt: string) => Promise<Post>;
  publishPost: (id: string) => Promise<Post>;
  
  // Messages
  fetchMessages: (params?: { page?: number; limit?: number }) => Promise<void>;
  sendMessage: (message: string, context?: string) => Promise<{ incomingMessage: Message; response: Message }>;
  
  // Stats
  fetchStats: () => Promise<void>;
  fetchDashboardData: () => Promise<void>;
  
  // Utility
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type PostsStore = PostsState & PostsActions;

export const usePostsStore = create<PostsStore>((set, get) => ({
  // State
  posts: [],
  messages: [],
  stats: null,
  isLoading: false,
  error: null,

  // Actions
  fetchPosts: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await postsApi.getUserPosts(params);
      const { data } = response.data;
      
      set({
        posts: data.posts || [],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch posts';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  createPost: async (data) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await postsApi.createPost(data);
      const { data: postData } = response.data;
      
      set((state) => ({
        posts: [postData, ...state.posts],
        isLoading: false,
        error: null,
      }));
      
      return postData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create post';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },


  updatePost: async (id, data) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await postsApi.updatePost(id, data);
      const { data: postData } = response.data;
      
      set((state) => ({
        posts: state.posts.map(post => 
          post._id === id ? postData : post
        ),
        isLoading: false,
        error: null,
      }));
      
      return postData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update post';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      await postsApi.deletePost(id);
      
      set((state) => ({
        posts: state.posts.filter(post => post._id !== id),
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete post';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  schedulePost: async (id, scheduledAt) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await postsApi.schedulePost(id, scheduledAt);
      const { data: postData } = response.data;
      
      set((state) => ({
        posts: state.posts.map(post => 
          post._id === id ? postData : post
        ),
        isLoading: false,
        error: null,
      }));
      
      return postData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to schedule post';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  publishPost: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await postsApi.publishPost(id);
      const { data: postData } = response.data;
      
      set((state) => ({
        posts: state.posts.map(post => 
          post._id === id ? postData : post
        ),
        isLoading: false,
        error: null,
      }));
      
      return postData;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to publish post';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  fetchMessages: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await chatApi.getConversation(params);
      const { data } = response.data;
      
      set({
        messages: data.messages || [],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch messages';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  sendMessage: async (message, context) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await chatApi.respond({ message, context });
      const { data } = response.data;
      
      set((state) => ({
        messages: [...state.messages, data.incomingMessage, data.response],
        isLoading: false,
        error: null,
      }));
      
      return data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to send message';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const [postsResponse, chatStatsResponse] = await Promise.all([
        postsApi.getUserPosts({ limit: 1000 }), // Get all posts for stats
        chatApi.getStats(),
      ]);
      
      const posts = postsResponse.data.data?.posts || [];
      const chatStats = chatStatsResponse.data.data || {};
      
      const stats: DashboardStats = {
        totalPosts: posts.length,
        scheduledPosts: posts.filter((post: Post) => post.status === 'scheduled').length,
        todayMessages: chatStats.todayMessages || 0,
        engagementRate: 4.2, // Mock data for now
        aiUsage: {
          postsGenerated: posts.length,
          messagesResponded: chatStats.aiResponses || 0,
          accuracyRate: 98, // Mock data for now
        },
      };
      
      set({
        stats,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch stats';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    
    try {
      await Promise.all([
        get().fetchPosts({ limit: 5 }), // Recent posts
        get().fetchMessages({ limit: 5 }), // Recent messages
        get().fetchStats(), // Dashboard stats
      ]);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
}));
