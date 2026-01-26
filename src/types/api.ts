// API Response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// User interface
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  plan: 'free' | 'pro';
  connectedAccounts: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Post interface
export interface Post {
  _id: string;
  userId: string;
  caption: string;
  aiPrompt: string;
  mediaUrl?: string;
  backgroundUrl?: string;
  images?: string[];
  platform: string[];
  postType?: string;
  currency?: string;
  price?: string;
  productName?: string;
  description?: string;
  scheduledAt?: string;
  publishedAt?: string;
  publishedUrl?: string;
  status: 'draft' | 'scheduled' | 'posted' | 'failed';
  createdAt: string;
  updatedAt: string;
}

// Message interface
export interface Message {
  _id: string;
  userId: string;
  sender: 'client' | 'page';
  content: string;
  aiResponse: boolean;
  platform: string;
  timestamp: string;
}

// Dashboard stats interface
export interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  todayMessages: number;
  engagementRate: number;
  aiUsage: {
    postsGenerated: number;
    messagesResponded: number;
    accuracyRate: number;
  };
}

// Facebook Page interface
export interface FacebookPage {
  pageId: string;
  pageName: string;
  category: string;
  connectedAt: string;
  hasInstagram: boolean;
  instagramUsername?: string;
}

// Published result interface
export interface PublishedResult {
  platform: 'facebook' | 'instagram';
  pageId: string;
  pageName: string;
  postId: string;
  instagramAccountId?: string;
  instagramUsername?: string;
}
