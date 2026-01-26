import { create } from 'zustand';
import { metaApi } from '../lib/api';
import type { FacebookPage } from '../types/api';

interface MetaState {
  pages: FacebookPage[];
  isLoading: boolean;
  error: string | null;
}

interface MetaActions {
  fetchPages: () => Promise<void>;
  refreshPages: () => Promise<void>;
  disconnectPage: (pageId: string) => Promise<void>;
  initiateOAuth: () => Promise<void>;
  clearError: () => void;
}

type MetaStore = MetaState & MetaActions;

export const useMetaStore = create<MetaStore>((set, get) => ({
  // State
  pages: [],
  isLoading: false,
  error: null,

  // Actions
  fetchPages: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await metaApi.getPages();
      const { data } = response.data;
      
      set({
        pages: data?.pages || [],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch Facebook pages';
      set({
        pages: [],
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  refreshPages: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await metaApi.refreshPages();
      const { data } = response.data;
      
      set({
        pages: data?.pages || [],
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to refresh Facebook pages';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  disconnectPage: async (pageId: string) => {
    set({ isLoading: true, error: null });
    
    try {
      await metaApi.disconnectPage(pageId);
      
      set((state) => ({
        pages: state.pages.filter(page => page.pageId !== pageId),
        isLoading: false,
        error: null,
      }));
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to disconnect page';
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },

  initiateOAuth: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await metaApi.getFacebookAuthUrl();
      const { data } = response.data;
      
      if (data?.authUrl) {
        // Redirect user to Facebook OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error('Failed to get OAuth URL');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to initiate Facebook OAuth';
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
}));
