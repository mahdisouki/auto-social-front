import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { SearchIcon } from '../../components/icons';
import { adminApi } from '../../lib/api';
import type { AdminPost } from '../../types/admin';
import { normalizeAdminPostsList } from './adminApiHelpers';

function ownerLabel(post: AdminPost): string {
	const uid = post.userId;
	if (uid && typeof uid === 'object') {
		return `${uid.name ?? '?'} · ${uid.email ?? uid._id}`;
	}
	return String(uid ?? '');
}

export function AdminPostsPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialUserId = searchParams.get('userId') ?? '';

	const [posts, setPosts] = useState<AdminPost[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [limit] = useState(20);
	const [userIdFilter, setUserIdFilter] = useState(initialUserId);
	const [debouncedUserId, setDebouncedUserId] = useState(initialUserId.trim());
	const [status, setStatus] = useState<string>('');
	const [platform, setPlatform] = useState<string>('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const t = window.setTimeout(() => setDebouncedUserId(userIdFilter.trim()), 400);
		return () => window.clearTimeout(t);
	}, [userIdFilter]);

	useEffect(() => {
		setPage(1);
	}, [debouncedUserId, status, platform]);

	useEffect(() => {
		const uid = searchParams.get('userId');
		if (uid && uid !== userIdFilter) {
			setUserIdFilter(uid);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL → field once
	}, [searchParams]);

	useEffect(() => {
		let cancelled = false;
		(async () => {
			setIsLoading(true);
			setError(null);
			try {
				const res = await adminApi.listPosts({
					page,
					limit,
					...(debouncedUserId ? { userId: debouncedUserId } : {}),
					...(status ? { status: status as 'draft' | 'scheduled' | 'posted' | 'failed' } : {}),
					...(platform ? { platform: platform.toLowerCase() } : {}),
				});
				const norm = normalizeAdminPostsList(res.data.data);
				if (!cancelled) {
					setPosts(norm.posts);
					setTotal(norm.total);
				}
			} catch (e: unknown) {
				const msg =
					(e as { response?: { status?: number } })?.response?.status === 403
						? 'Accès refusé (admin requis)'
						: (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
						  'Échec du chargement des posts';
				if (!cancelled) setError(msg);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [page, limit, debouncedUserId, status, platform]);

	const applyUserFilterToUrl = () => {
		const next = new URLSearchParams(searchParams);
		if (debouncedUserId) next.set('userId', debouncedUserId);
		else next.delete('userId');
		setSearchParams(next);
	};

	const pagesCount = Math.max(1, Math.ceil(total / limit));

	const formatDate = (d?: string) => {
		if (!d) return '—';
		return new Date(d).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
	};

	return (
		<div className="container-max py-6 min-h-[80vh] bg-gray-900/70 backdrop-blur-2xl rounded-2xl overflow-x-auto">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
				<div>
					<h1 className="text-xl font-semibold text-gray-100">Admin · Posts</h1>
					<p className="text-sm text-gray-400 mt-1">Tous les posts (tous utilisateurs)</p>
				</div>
				<Link to="/admin/users" className="text-sm text-primary hover:text-primary/80 shrink-0">
					← Utilisateurs
				</Link>
			</div>

			<div className="flex flex-col lg:flex-row gap-4 mb-6 flex-wrap">
				<div className="flex-1 min-w-[200px] relative">
					<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
					<input
						value={userIdFilter}
						onChange={(e) => setUserIdFilter(e.target.value)}
						onBlur={applyUserFilterToUrl}
						placeholder="Filtrer par userId (Mongo ObjectId)"
						className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 placeholder-gray-500 font-mono text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
					/>
				</div>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}
					className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 min-w-[160px]"
				>
					<option value="">Tous les statuts</option>
					<option value="draft">draft</option>
					<option value="scheduled">scheduled</option>
					<option value="posted">posted</option>
					<option value="failed">failed</option>
				</select>
				<select
					value={platform}
					onChange={(e) => setPlatform(e.target.value)}
					className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100 min-w-[140px]"
				>
					<option value="">Toutes plateformes</option>
					<option value="facebook">Facebook</option>
					<option value="instagram">Instagram</option>
					<option value="tiktok">TikTok</option>
					<option value="twitter">Twitter</option>
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
									<th className="px-4 py-3 font-medium">Aperçu</th>
									<th className="px-4 py-3 font-medium">Produit / caption</th>
									<th className="px-4 py-3 font-medium">Utilisateur</th>
									<th className="px-4 py-3 font-medium">Statut</th>
									<th className="px-4 py-3 font-medium">Créé</th>
									<th className="px-4 py-3 font-medium text-right">Actions</th>
								</tr>
							</thead>
							<tbody>
								{posts.length === 0 ? (
									<tr>
										<td colSpan={6} className="px-4 py-8 text-center text-gray-500">
											Aucun post
										</td>
									</tr>
								) : (
									posts.map((p) => (
										<tr key={p._id} className="border-b border-white/5 hover:bg-white/5">
											<td className="px-4 py-2 w-20">
												{(p.images?.[0] || p.mediaUrl) && (
													<img
														src={p.images?.[0] || p.mediaUrl}
														alt=""
														className="w-14 h-14 object-cover rounded-lg"
													/>
												)}
											</td>
											<td className="px-4 py-3 text-gray-100 max-w-[200px] truncate">
												{p.productName || p.caption?.slice(0, 60) || '—'}
											</td>
											<td className="px-4 py-3 text-gray-400 text-xs max-w-[180px] truncate">
												{ownerLabel(p)}
											</td>
											<td className="px-4 py-3">
												<span className="px-2 py-0.5 rounded-full text-xs bg-gray-500/30 text-gray-200">
													{p.status}
												</span>
											</td>
											<td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(p.createdAt)}</td>
											<td className="px-4 py-3 text-right">
												<Link
													to={`/admin/posts/${p._id}`}
													className="text-primary hover:text-primary/80 font-medium"
												>
													Éditer
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
							onClick={() => setPage((pg) => Math.max(1, pg - 1))}
							disabled={page <= 1}
							className="px-4 py-2 border border-white/20 rounded-lg text-sm text-gray-300 hover:bg-white/10 disabled:opacity-40"
						>
							Précédent
						</button>
						<span className="text-sm text-gray-400 px-2">
							Page {page} / {pagesCount} ({total} posts)
						</span>
						<button
							type="button"
							onClick={() => setPage((pg) => pg + 1)}
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
