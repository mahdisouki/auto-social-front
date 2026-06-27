import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getErrorMessage } from '../../lib/getErrorMessage';
import type { AdminDashboardStats, ChartPoint, DistributionSlice } from './adminDashboardHelpers';
import {
  computeAdminDashboardStats,
  fetchAllAdminPosts,
  fetchAllAdminUsers,
} from './adminDashboardHelpers';

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{ background: '#171726', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-white text-3xl font-bold">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-4">
      <h3
        className="text-white italic"
        style={{ fontFamily: 'Playfair Display, serif', fontSize: '22px', fontWeight: 400 }}
      >
        {children}
      </h3>
      <div className="mt-2" style={{ width: '120px', height: '3px', background: '#9747FF', borderRadius: '2px' }} />
    </div>
  );
}

function VerticalBarChart({ data }: { data: ChartPoint[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-gray-500">Aucune donnée</p>;
  }

  return (
    <div className="w-full min-h-[220px] flex items-end justify-between gap-3 px-2">
      {data.map((point) => {
        const barHeight = point.count > 0 ? Math.max(point.height, 8) : 0;
        return (
          <div key={point.key} className="flex-1 flex flex-col items-center h-[200px]">
            <div className="relative flex-1 w-full flex items-end justify-center">
              {point.count > 0 && (
                <>
                  <div className="absolute -top-5 text-xs font-semibold text-white/80">{point.count}</div>
                  <div
                    className="w-3 rounded-full transition-all duration-300"
                    style={{
                      height: `${barHeight}%`,
                      background: 'linear-gradient(180deg, #C098F5 0%, #9747FF 100%)',
                      boxShadow: '0 0 12px rgba(151, 71, 255, 0.35)',
                    }}
                  />
                </>
              )}
            </div>
            <span className="text-xs text-gray-400 mt-3">{point.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DistributionChart({ slices, total }: { slices: DistributionSlice[]; total: number }) {
  if (slices.length === 0 || total === 0) {
    return <p className="text-sm text-gray-500">Aucune donnée</p>;
  }

  const gradient = slices.reduce(
    (acc, slice, index) => {
      const start = slices
        .slice(0, index)
        .reduce((sum, item) => sum + (item.value / total) * 100, 0);
      const end = start + (slice.value / total) * 100;
      acc.stops.push(`${slice.color} ${start}% ${end}%`);
      return acc;
    },
    { stops: [] as string[] }
  );

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div
        className="w-40 h-40 rounded-full shrink-0"
        style={{ background: `conic-gradient(${gradient.stops.join(', ')})` }}
      />
      <div className="flex-1 space-y-3 w-full">
        {slices.map((slice) => {
          const percent = total > 0 ? Math.round((slice.value / total) * 100) : 0;
          return (
            <div key={slice.label}>
              <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ background: slice.color }} />
                  <span className="text-gray-300">{slice.label}</span>
                </div>
                <span className="text-gray-400">
                  {slice.value} ({percent}%)
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${percent}%`, background: slice.color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [users, posts] = await Promise.all([fetchAllAdminUsers(), fetchAllAdminPosts()]);
      setStats(computeAdminDashboardStats(users, posts));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 403) {
        setError('Accès refusé (admin requis)');
      } else {
        setError(getErrorMessage(err, 'Échec du chargement du tableau de bord admin'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="container-max py-6 min-h-[80vh] bg-gray-900/70 backdrop-blur-2xl rounded-2xl overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-100">Admin · Tableau de bord</h1>
          <p className="text-sm text-gray-400 mt-1">Statistiques globales des utilisateurs et des publications</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={loadDashboard}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            style={{ background: '#9747FF' }}
          >
            Actualiser
          </button>
          <Link to="/admin/users" className="text-sm text-primary hover:text-primary/80">
            Utilisateurs →
          </Link>
          <Link to="/admin/posts" className="text-sm text-primary hover:text-primary/80">
            Posts →
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
        </div>
      ) : stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Utilisateurs" value={stats.totalUsers} hint={`${stats.adminCount} admin · ${stats.userCount} utilisateurs`} />
            <StatCard label="Plans Pro" value={stats.proCount} hint={`${stats.freeCount} comptes free`} />
            <StatCard label="Publications" value={stats.totalPosts} hint={`${stats.postsByStatus.posted ?? 0} publiées`} />
            <StatCard label="Crédits totaux" value={stats.totalCredits} hint={`Moyenne ${stats.avgCredits} / utilisateur`} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard label="Générations IA" value={stats.totalGenerations} />
            <StatCard label="Brouillons" value={stats.postsByStatus.draft ?? 0} />
            <StatCard label="Planifiés" value={stats.postsByStatus.scheduled ?? 0} />
            <StatCard label="Échoués" value={stats.postsByStatus.failed ?? 0} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
              <SectionTitle>Nouveaux utilisateurs (6 mois)</SectionTitle>
              <VerticalBarChart data={stats.usersByMonth} />
            </div>

            <div className="rounded-2xl p-6" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
              <SectionTitle>Publications créées (6 mois)</SectionTitle>
              <VerticalBarChart data={stats.postsByMonth} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl p-6" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
              <SectionTitle>Répartition des plans</SectionTitle>
              <DistributionChart slices={stats.planDistribution} total={stats.totalUsers} />
            </div>

            <div className="rounded-2xl p-6" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
              <SectionTitle>Statut des publications</SectionTitle>
              <DistributionChart slices={stats.statusDistribution} total={stats.totalPosts} />
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}>
            <SectionTitle>Derniers inscrits</SectionTitle>
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10 text-left text-gray-400">
                    <th className="px-4 py-3 font-medium">Nom</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Plan</th>
                    <th className="px-4 py-3 font-medium">Inscription</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        Aucun utilisateur
                      </td>
                    </tr>
                  ) : (
                    stats.recentUsers.map((user) => (
                      <tr key={user._id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-gray-100">{user.name}</td>
                        <td className="px-4 py-3 text-gray-300">{user.email}</td>
                        <td className="px-4 py-3 text-gray-300">{user.plan}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString('fr-FR')
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Link to={`/admin/users/${user._id}`} className="text-primary hover:text-primary/80 font-medium">
                            Détail
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
