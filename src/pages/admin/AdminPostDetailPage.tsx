import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../lib/api';
import type { AdminPost, AdminPostOwner } from '../../types/admin';

const PLATFORMS = ['facebook', 'instagram', 'tiktok', 'twitter'] as const;

function isPopulatedUser(uid: AdminPost['userId']): uid is AdminPostOwner {
	return typeof uid === 'object' && uid !== null && '_id' in uid;
}

export function AdminPostDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [post, setPost] = useState<AdminPost | null>(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [caption, setCaption] = useState('');
	const [productName, setProductName] = useState('');
	const [description, setDescription] = useState('');
	const [status, setStatus] = useState<AdminPost['status']>('draft');
	const [platform, setPlatform] = useState<string[]>([]);
	const [scheduledAt, setScheduledAt] = useState('');

	useEffect(() => {
		if (!id) return;
		let cancelled = false;
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await adminApi.getPost(id);
				const p = res.data.data as AdminPost;
				if (!cancelled && p?._id) {
					setPost(p);
					setCaption(p.caption ?? '');
					setProductName(p.productName ?? '');
					setDescription(p.description ?? '');
					setStatus(p.status);
					setPlatform([...(p.platform ?? [])]);
					setScheduledAt(p.scheduledAt ? new Date(p.scheduledAt).toISOString().slice(0, 16) : '');
				}
			} catch (e: unknown) {
				const msg =
					(e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
					'Impossible de charger le post';
				if (!cancelled) setError(msg);
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [id]);

	const togglePlatform = (pf: string) => {
		setPlatform((prev) =>
			prev.includes(pf) ? prev.filter((x) => x !== pf) : [...prev, pf]
		);
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!id) return;
		setSaving(true);
		setError(null);
		try {
			const payload: Record<string, unknown> = {
				caption,
				productName,
				description,
				status,
				platform,
			};
			if (scheduledAt) {
				payload.scheduledAt = new Date(scheduledAt).toISOString();
			}
			await adminApi.updatePost(id, payload);
			const res = await adminApi.getPost(id);
			setPost(res.data.data as AdminPost);
			alert('Post mis à jour');
		} catch (e: unknown) {
			setError((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Échec');
		} finally {
			setSaving(false);
		}
	};

	const handleDelete = async () => {
		if (!id) return;
		if (!window.confirm('Supprimer ce post définitivement ?')) return;
		try {
			await adminApi.deletePost(id);
			navigate('/admin/posts');
		} catch (e: unknown) {
			alert((e as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Échec suppression');
		}
	};

	if (loading) {
		return (
			<div className="container-max py-16 flex justify-center">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
			</div>
		);
	}

	if (!post) {
		return (
			<div className="container-max py-6 text-gray-400">
				<p>{error || 'Post introuvable'}</p>
				<Link to="/admin/posts" className="text-primary mt-4 inline-block">
					← Liste des posts
				</Link>
			</div>
		);
	}

	const img = post.images?.[0] || post.mediaUrl;

	return (
		<div className="container-max py-6 min-h-[80vh] bg-gray-900/70 backdrop-blur-2xl rounded-2xl">
			<Link to="/admin/posts" className="text-sm text-gray-400 hover:text-gray-200 mb-6 inline-block">
				← Posts admin
			</Link>

			<div className="grid lg:grid-cols-2 gap-8 mt-4">
				<div>
					{img && (
						<img src={img} alt="" className="w-full max-h-[420px] object-contain rounded-xl border border-white/10" />
					)}
					<p className="text-xs text-gray-500 font-mono mt-2">{post._id}</p>
					{isPopulatedUser(post.userId) && (
						<div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-sm">
							<p className="text-gray-400 mb-1">Auteur</p>
							<p className="text-gray-100">{post.userId.name}</p>
							<p className="text-gray-400">{post.userId.email}</p>
							<p className="text-gray-500 text-xs mt-1">{post.userId._id}</p>
							<Link
								to={`/admin/users/${post.userId._id}`}
								className="text-primary text-sm mt-2 inline-block"
							>
								Fiche utilisateur
							</Link>
						</div>
					)}
				</div>

				<form onSubmit={handleSave} className="space-y-4 p-6 rounded-xl bg-white/5 border border-white/10">
					<h2 className="text-lg font-semibold text-gray-100 mb-2">Édition admin</h2>
					{error && <div className="p-3 rounded-lg bg-red-500/20 text-red-200 text-sm">{error}</div>}

					<div>
						<label className="block text-sm text-gray-400 mb-1">Statut</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value as AdminPost['status'])}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						>
							<option value="draft">draft</option>
							<option value="scheduled">scheduled</option>
							<option value="posted">posted</option>
							<option value="failed">failed</option>
						</select>
					</div>

					<div>
						<label className="block text-sm text-gray-400 mb-1">Plateformes</label>
						<div className="flex flex-wrap gap-2">
							{PLATFORMS.map((pf) => (
								<button
									key={pf}
									type="button"
									onClick={() => togglePlatform(pf)}
									className={`px-3 py-1.5 rounded-lg text-xs capitalize border ${
										platform.includes(pf)
											? 'border-primary bg-primary/30 text-white'
											: 'border-white/20 text-gray-400 hover:bg-white/5'
									}`}
								>
									{pf}
								</button>
							))}
						</div>
					</div>

					<div>
						<label className="block text-sm text-gray-400 mb-1">Planifié le (local)</label>
						<input
							type="datetime-local"
							value={scheduledAt}
							onChange={(e) => setScheduledAt(e.target.value)}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						/>
					</div>

					<div>
						<label className="block text-sm text-gray-400 mb-1">Nom du produit</label>
						<input
							value={productName}
							onChange={(e) => setProductName(e.target.value)}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						/>
					</div>

					<div>
						<label className="block text-sm text-gray-400 mb-1">Caption</label>
						<textarea
							rows={4}
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						/>
					</div>

					<div>
						<label className="block text-sm text-gray-400 mb-1">Description</label>
						<textarea
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-100"
						/>
					</div>

					<div className="flex flex-wrap gap-3 pt-4">
						<button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
							{saving ? '…' : 'Enregistrer'}
						</button>
						<button
							type="button"
							onClick={handleDelete}
							className="px-4 py-2 rounded-lg text-sm bg-red-500/30 text-red-200 hover:bg-red-500/40"
						>
							Supprimer
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
