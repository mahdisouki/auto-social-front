import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon } from '../../components/icons';
import { adminApi } from '../../lib/api';
import type { AdminUserRow } from '../../types/admin';
import { normalizeAdminUsersList } from './adminApiHelpers';

export function AdminUsersPage() {
	const [users, setUsers] = useState<AdminUserRow[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [role, setRole] = useState<string>('');
	const [plan, setPlan] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const t = window.setTimeout(() => setDebouncedSearch(search.trim()), 350);
		return () => window.clearTimeout(t);
	}, [search]);

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, role, plan]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await adminApi.listUsers({
					page,
					limit,
					search: debouncedSearch || undefined,
					...(role ? { role: role as 'admin' | 'user' } : {}),
					...(plan ? { plan: plan as 'free' | 'pro' } : {}),
				});
				const norm = normalizeAdminUsersList(res.data.data);
				if (!cancelled) {
					setUsers(norm.users);
					setTotal(norm.total);
				}
			} catch (e: unknown) {
				const msg =
					(e as { response?: { status?: number; data?: { message?: string } } })?.response?.status === 403
						? 'Accès refusé (admin requis)'
						: (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
						  'Échec du chargement des utilisateurs';
				if (!cancelled) setError(msg);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [page, limit, debouncedSearch, role, plan]);

	const pagesCount = Math.max(1, Math.ceil(total / limit));

	return (
		<div className="container-max py-6 min-h-[80vh] bg-gray-900/70 backdrop-blur-2xl rounded-2xl overflow-x-auto">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-xl font-semibold text-gray-100">Admin · Utilisateurs</h1>
					<p className="text-sm text-gray-400 mt-1">Gérer les comptes et les crédits</p>
				</div>
				<div className="flex items-center gap-3 flex-wrap">
					<Link
						to="/admin/dashboard"
						className="text-sm text-primary hover:text-primary/80 shrink-0"
					>
						← Dashboard admin
					</Link>
					<Link
						to="/admin/posts"
						className="text-sm text-primary hover:text-primary/80 shrink-0"
					>
						Voir tous les posts →
					</Link>
				</div>
			</div>

			<div className="flex flex-col lg:flex-row gap-4 mb-6 flex-wrap">
				<div className="flex-1 min-w-[200px] relative">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Rechercher (nom, email)…"
						className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent"
					/>
				</div>
				<select
					value={role}
					onChange={(e) => setRole(e.target.value)}
					className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 min-w-[140px]"
				>
					<option value="">Tous les rôles</option>
					<option value="admin">Admin</option>
					<option value="user">Utilisateur</option>
				</select>
				<select
					value={plan}
					onChange={(e) => setPlan(e.target.value)}
					className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 min-w-[140px]"
				>
					<option value="">Tous les plans</option>
					<option value="free">Free</option>
					<option value="pro">Pro</option>
				</select>
			</div>

			{error && (
				<div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">{error}</div>
			)}

			{isLoading ? (
				<div className="flex justify-center py-16">
					<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
				</div>
			) : (
				<>
					<div className="rounded-xl border border-white/10 overflow-hidden">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-white/5 border-b border-white/10 text-left text-gray-400">
									<th className="px-4 py-3 font-medium">Nom</th>
									<th className="px-4 py-3 font-medium">Email</th>
									<th className="px-4 py-3 font-medium">Rôle</th>
									<th className="px-4 py-3 font-medium">Plan</th>
									<th className="px-4 py-3 font-medium">Crédits</th>
									<th className="px-4 py-3 font-medium text-right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{users.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-4 py-8 text-center text-gray-500">
											Aucun utilisateur
										</td>
									</tr>
								) : (
									users.map((u) => (
										<tr key={u._id} className="border-b border-white/5 hover:bg-white/5">
											<td className="px-4 py-3 text-gray-100">{u.name}</td>
											<td className="px-4 py-3 text-gray-300">{u.email}</td>
											<td className="px-4 py-3">
												<span
													className={
														u.role === 'admin'
															? 'px-2 py-0.5 rounded-full text-xs bg-purple-500/30 text-purple-200'
															: 'px-2 py-0.5 rounded-full text-xs bg-gray-500/30 text-gray-300'
													}
												>
													{u.role}
												</span>
											</td>
											<td className="px-4 py-3 text-gray-300">{u.plan}</td>
											<td className="px-4 py-3 text-gray-300">{u.credits ?? '—'}</td>
											<td className="px-4 py-3 text-right">
												<Link
													to={`/admin/users/${u._id}`}
													className="text-primary hover:text-primary/80 font-medium"
												>
													Détail
												</Link>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					<div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
						<button
							type="button"
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							disabled={page <= 1}
							className="px-4 py-2 border border-white/20 rounded-lg text-sm text-gray-300 hover:bg-white/10 disabled:opacity-40"
						>
							Précédent
						</button>
						<span className="text-sm text-gray-400 px-2">
							Page {page} / {pagesCount} ({total} utilisateurs)
						</span>
						<button
							type="button"
							onClick={() => setPage((p) => p + 1)}
							disabled={page >= pagesCount}
							className="px-4 py-2 border border-white/20 rounded-lg text-sm text-gray-300 hover:bg-white/10 disabled:opacity-40"
						>
							Suivant
						</button>
					</div>
				</>
			)}
		</div>
	);
}
