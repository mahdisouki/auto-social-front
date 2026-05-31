import type { AdminPost, AdminUserRow } from '../../types/admin';

export function normalizeAdminUsersList(data: unknown): {
  users: AdminUserRow[];
  total: number;
  page: number;
  limit: number;
} {
  const raw = (data ?? {}) as Record<string, unknown>;
  const users = (raw.users ?? raw.items ?? []) as AdminUserRow[];
  const pagination = (raw.pagination ?? {}) as Record<string, unknown>;
  return {
    users,
    total: Number(raw.total ?? pagination.total ?? users.length),
    page: Number(raw.page ?? pagination.page ?? 1),
    limit: Number(raw.limit ?? pagination.limit ?? 20),
  };
}

export function normalizeAdminPostsList(data: unknown): {
  posts: AdminPost[];
  total: number;
  page: number;
  limit: number;
} {
  const raw = (data ?? {}) as Record<string, unknown>;
  const posts = (raw.posts ?? raw.items ?? []) as AdminPost[];
  const pagination = (raw.pagination ?? {}) as Record<string, unknown>;
  return {
    posts,
    total: Number(raw.total ?? pagination.total ?? posts.length),
    page: Number(raw.page ?? pagination.page ?? 1),
    limit: Number(raw.limit ?? pagination.limit ?? 20),
  };
}
