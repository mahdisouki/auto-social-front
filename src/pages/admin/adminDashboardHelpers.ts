import { adminApi } from '../../lib/api';
import type { AdminPost, AdminUserRow } from '../../types/admin';
import { normalizeAdminPostsList, normalizeAdminUsersList } from './adminApiHelpers';

export type ChartPoint = {
  key: string;
  label: string;
  count: number;
  height: number;
};

export type DistributionSlice = {
  label: string;
  value: number;
  color: string;
};

export type AdminDashboardStats = {
  totalUsers: number;
  adminCount: number;
  userCount: number;
  proCount: number;
  freeCount: number;
  totalCredits: number;
  avgCredits: number;
  totalGenerations: number;
  totalPosts: number;
  postsByStatus: Record<string, number>;
  usersByMonth: ChartPoint[];
  postsByMonth: ChartPoint[];
  planDistribution: DistributionSlice[];
  statusDistribution: DistributionSlice[];
  recentUsers: AdminUserRow[];
};

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

async function fetchAllPages<T>(
  fetchPage: (page: number, limit: number) => Promise<{ items: T[]; total: number }>
): Promise<T[]> {
  const limit = 100;
  const all: T[] = [];
  let page = 1;

  while (true) {
    const { items, total } = await fetchPage(page, limit);
    all.push(...items);
    if (items.length < limit || all.length >= total) break;
    page += 1;
  }

  return all;
}

export async function fetchAllAdminUsers(): Promise<AdminUserRow[]> {
  return fetchAllPages(async (page, limit) => {
    const res = await adminApi.listUsers({ page, limit });
    const norm = normalizeAdminUsersList(res.data.data);
    return { items: norm.users, total: norm.total };
  });
}

export async function fetchAllAdminPosts(): Promise<AdminPost[]> {
  return fetchAllPages(async (page, limit) => {
    const res = await adminApi.listPosts({ page, limit });
    const norm = normalizeAdminPostsList(res.data.data);
    return { items: norm.posts, total: norm.total };
  });
}

function buildMonthlySeries(
  dates: (string | undefined)[],
  monthsCount = 6
): ChartPoint[] {
  const currentDate = new Date();
  const monthKeys: string[] = [];
  const monthCounts: Record<string, number> = {};

  for (let i = monthsCount - 1; i >= 0; i -= 1) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthKeys.push(key);
    monthCounts[key] = 0;
  }

  for (const dateValue of dates) {
    if (!dateValue) continue;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) continue;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (monthCounts[key] !== undefined) {
      monthCounts[key] += 1;
    }
  }

  const maxCount = Math.max(...Object.values(monthCounts), 1);

  return monthKeys.map((key) => {
    const monthIndex = Number(key.split('-')[1]) - 1;
    const count = monthCounts[key];
    return {
      key,
      label: MONTH_LABELS[monthIndex] ?? key,
      count,
      height: (count / maxCount) * 100,
    };
  });
}

export function computeAdminDashboardStats(
  users: AdminUserRow[],
  posts: AdminPost[]
): AdminDashboardStats {
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const proCount = users.filter((u) => u.plan === 'pro').length;
  const freeCount = users.filter((u) => u.plan === 'free').length;
  const totalCredits = users.reduce((sum, u) => sum + (u.credits ?? 0), 0);
  const totalGenerations = users.reduce((sum, u) => sum + (u.generationCount ?? 0), 0);

  const postsByStatus: Record<string, number> = {
    draft: 0,
    scheduled: 0,
    posted: 0,
    failed: 0,
  };

  for (const post of posts) {
    const status = post.status ?? 'draft';
    postsByStatus[status] = (postsByStatus[status] ?? 0) + 1;
  }

  const statusColors: Record<string, string> = {
    draft: '#9CA3AF',
    scheduled: '#22C55E',
    posted: '#9747FF',
    failed: '#EF4444',
  };

  const statusDistribution: DistributionSlice[] = Object.entries(postsByStatus)
    .filter(([, value]) => value > 0)
    .map(([label, value]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value,
      color: statusColors[label] ?? '#6B7280',
    }));

  const planDistribution: DistributionSlice[] = [
    { label: 'Free', value: freeCount, color: '#6B7280' },
    { label: 'Pro', value: proCount, color: '#9747FF' },
  ].filter((slice) => slice.value > 0);

  const recentUsers = [...users]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  return {
    totalUsers: users.length,
    adminCount,
    userCount: users.length - adminCount,
    proCount,
    freeCount,
    totalCredits,
    avgCredits: users.length > 0 ? Math.round(totalCredits / users.length) : 0,
    totalGenerations,
    totalPosts: posts.length,
    postsByStatus,
    usersByMonth: buildMonthlySeries(users.map((u) => u.createdAt)),
    postsByMonth: buildMonthlySeries(posts.map((p) => p.createdAt)),
    planDistribution,
    statusDistribution,
    recentUsers,
  };
}
