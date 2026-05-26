import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import { useAuthStore } from '../../stores/authStore';
import type { AdminUserPostCounts, AdminUserRow } from '../../types/admin';

export function AdminUserDetailPage() {
	const { userId } = useParams<{ userId: string }>();
	const navigate = useNavigate();
	const currentUser = useAuthStore((s) => s.user);

	const [user, setUser] = useState<AdminUserRow | null>(null);
	const [postCounts, setPostCounts] = useState<AdminUserPostCounts | null>(null);
	const [form, setForm] = useState({
		name: '',
		email: '',
		role: 'user' as 'admin' | 'user',
		plan: 'free' as 'free' | 'pro',
		credits: 0,
		generationCount: 0 as number | '',
	});
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!userId) return;
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await adminApi.getUser(userId);
				const payload = res.data.data as unknown as Record<string, unknown>;
				const u = (payload?.user ?? payload) as AdminUserRow & { generationCount?: number };
				const counts = payload?.postCounts as AdminUserPostCounts | undefined;
				if (!cancelled && u && u._id) {
					setUser(u);
					setPostCounts(counts ?? null);
					setForm({
						name: u.name ?? '',
						email: u.email ?? '',
						role: u.role ?? 'user',
						plan: u.plan ?? 'free',
						credits: typeof u.credits === 'number' ? u.credits : 0,
						generationCount: typeof u.generationCount === 'number' ? u.generationCount : '',
					});
				}
			} catch (e: unknown) {
				const msg =
					(e as { response?: { data?: { message?: string }; status?: number } })?.response?.data?.message ||
					'Impossible de charger l’utilisateur';
				if (!cancelled) setError(msg);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [userId]);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!userId) return;
		setSaving(true);
		setError(null);
		try {
			const body: Record<string, unknown> = {
				name: form.name.trim(),
				email: form.email.trim(),
				role: form.role,
				plan: form.plan,
				credits: Number(form.credits),
			};
			if (form.generationCount !== '') {
				body.generationCount = Number(form.generationCount);
			}
			await adminApi.updateUser(userId, body as Parameters<typeof adminApi.updateUser>[1]);
			const res = await adminApi.getUser(userId);
			const payload = res.data.data as unknown as Record<string, unknown>;
			const u = (payload?.user ?? payload) as AdminUserRow;
			setUser(u);
			if (currentUser?._id === userId) {
				try {
					await useAuthStore.getState().getProfile();
				} catch {
					/* profile refresh optional */
				}
			}
			alert('Utilisateur mis à jour');
		} catch (e: unknown) {
			setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Échec de la mise à jour');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!userId || !user) return;
		if (!window.confirm(`Supprimer définitivement ${user.email} ? Ses posts seront supprimés.`)) return;
		try {
			await adminApi.deleteUser(userId);
			if (currentUser?._id === userId) {
				useAuthStore.getState().logout();
				navigate('/login');
				return;
			}
			navigate('/admin/users');
		} catch (e: unknown) {
			alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Suppression impossible');
		}
	};

	if (loading) {
		return (
			<div className="container-max py-16 flex justify-center" style={{ background: '#000000' }}>
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
			</div>
		);
	}

	if (!user) {
		return (
			<div className="container-max py-6 text-gray-400">
				<p>{error || 'Utilisateur introuvable'}</p>
				<Link to="/admin/users" className="text-primary mt-4 inline-block">
					← Retour à la liste
				</Link>
			</div>
		);
	}

	return (
		<div className="container-max py-6 min-h-[80vh] bg-gray-900/70 backdrop-blur-2xl rounded-2xl">
			<div className="mb-6 flex items-center gap-4 flex-wrap">
				<Link to="/admin/users" className="text-sm text-gray-400 hover:text-gray-200">
					← Utilisateurs
				</Link>
			</div>

			<h1 className="text-xl font-semibold text-gray-100 mb-2">{user.name}</h1>
			<p className="text-sm text-gray-500 mb-6 font-mono">{user._id}</p>

			{postCounts && (
				<div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
					<div>
						<p className="text-gray-500">Brouillons</p>
						<p className="text-gray-100 font-semibold">{postCounts.draft ?? 0}</p>
					</div>
					<div>
						<p className="text-gray-500">Planifiés</p>
						<p className="text-gray-100 font-semibold">{postCounts.scheduled ?? 0}</p>
					</div>
					<div>
						<p className="text-gray-500">Publiés</p>
						<p className="text-gray-100 font-semibold">{postCounts.posted ?? 0}</p>
					</div>
					<div>
						<p className="text-gray-500">Échoués</p>
						<p className="text-gray-100 font-semibold">{postCounts.failed ?? 0}</p>
					</div>
					<div>
						<p className="text-gray-500">Total</p>
						<p className="text-gray-100 font-semibold">{postCounts.total ?? '—'}</p>
					</div>
				</div>
			)}

			{error && (
				<div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg text-red-200 text-sm">{error}</div>
			)}

			<form onSubmit={handleSave} className="max-w-xl space-y-4 p-6 rounded-xl bg-white/5 border border-white/10">
				<div>
					<label className="block text-sm text-gray-400 mb-1">Nom</label>
					<input
						value={form.name}
						onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
						className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						required
					/>
				</div>
				<div>
					<label className="block text-sm text-gray-400 mb-1">Email</label>
					<input
						type="email"
						value={form.email}
						onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
						className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						required
					/>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm text-gray-400 mb-1">Rôle</label>
						<select
							value={form.role}
							onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as 'admin' | 'user' }))}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						>
							<option value="user">user</option>
							<option value="admin">admin</option>
						</select>
					</div>
					<div>
						<label className="block text-sm text-gray-400 mb-1">Plan</label>
						<select
							value={form.plan}
							onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value as 'free' | 'pro' }))}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						>
							<option value="free">free</option>
							<option value="pro">pro</option>
						</select>
					</div>
				</div>
				<div className="grid grid-cols-2 gap-4">
					<div>
						<label className="block text-sm text-gray-400 mb-1">Crédits</label>
						<input
							type="number"
							min={0}
							value={form.credits}
							onChange={(e) => setForm((f) => ({ ...f, credits: Number(e.target.value) }))}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-400 mb-1">generationCount</label>
						<input
							type="number"
							min={0}
							value={form.generationCount}
							onChange={(e) =>
								setForm((f) => ({
									...f,
									generationCount: e.target.value === '' ? '' : Number(e.target.value),
								}))
							}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
							placeholder="optionnel"
						/>
					</div>
				</div>

				<div className="flex flex-wrap gap-3 pt-4">
					<button
						type="submit"
						disabled={saving}
						className="btn-primary disabled:opacity-50"
					>
						{saving ? 'Enregistrement…' : 'Enregistrer'}
					</button>
					<Link
						to={`/admin/posts?userId=${user._id}`}
						className="px-4 py-2 border border-white/20 rounded-lg text-sm text-gray-300 hover:bg-white/10"
					>
						Voir ses posts
					</Link>
					<button
						type="button"
						onClick={handleDelete}
						className="px-4 py-2 rounded-lg text-sm bg-red-500/30 text-red-200 hover:bg-red-500/40 ml-auto"
					>
						Supprimer le compte
					</button>
				</div>
			</form>
		</div>
	);
}
