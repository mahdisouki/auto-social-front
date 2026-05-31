import type { Post, User } from './api';

/** Admin list row — subset of user fields */
export interface AdminUserRow {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  plan: 'free' | 'pro';
  credits?: number;
  generationCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminUsersListData {
  users: AdminUserRow[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
}

export interface AdminUserPostCounts {
  draft?: number;
  scheduled?: number;
  posted?: number;
  failed?: number;
  total?: number;
}

export interface AdminUserDetailData {
  user: AdminUserRow & Partial<Omit<User, '_id'>>;
  postCounts?: AdminUserPostCounts;
}

export interface AdminPostOwner {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
}

/** Post returned by admin GET may populate userId */
export interface AdminPost extends Omit<Post, 'userId'> {
  userId: string | AdminPostOwner;
}

export interface AdminPostsListData {
  posts: AdminPost[];
  total?: number;
  page?: number;
  limit?: number;
  pages?: number;
}
