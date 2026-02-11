import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DatePicker, { registerLocale } from 'react-datepicker';
import { fr } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { postsApi } from '../lib/api';
import { usePostsStore } from '../stores/postsStore';
import { CheckIcon, CloseIcon } from '../components/icons';
import type { Post } from '../types/api';
import postsRightImg from '../assets/postsR.png';
import postsLeftImg from '../assets/postsL.png';

registerLocale('fr', fr);

type EditForm = {
	caption: string;
	productName: string;
	description: string;
	price: number;
	currency: string;
	postType: string;
	platform: string[];
	scheduledAt: string; // ISO string or '' for payload
};

export function PostDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { updatePost } = usePostsStore();
	const [post, setPost] = useState<Post | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [editForm, setEditForm] = useState<EditForm>({
		caption: '',
		productName: '',
		description: '',
		price: 0,
		currency: 'TND',
		postType: '',
		platform: [],
		scheduledAt: '',
	});

	useEffect(() => {
		if (!id) {
			setError('Post ID is required');
			setIsLoading(false);
			return;
		}

		const fetchPost = async () => {
			try {
				setIsLoading(true);
				setError(null);
				const response = await postsApi.getPost(id);
				setPost(response.data.data);
			} catch (err: any) {
				setError(err.response?.data?.message || 'Failed to load post');
				console.error('Error fetching post:', err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPost();
	}, [id]);

	// Format time in UTC like MongoDB: "15:00:00"
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		const h = date.getUTCHours();
		const m = date.getUTCMinutes();
		const s = date.getUTCSeconds();
		return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
	};

	// Format date in UTC to match MongoDB (date + time 15:00:00)
	const formatDate = (dateString?: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		const datePart = date.toLocaleDateString('fr-FR', {
			timeZone: 'UTC',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
		return `${datePart}, ${formatTime(dateString)}`;
	};

	// Get platform display name
	const getPlatformName = (platform: string) => {
		return platform.charAt(0).toUpperCase() + platform.slice(1);
	};

	// Get status badge color (dark theme)
	const getStatusStyle = (status: string) => {
		switch (status) {
			case 'posted':
				return { background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80' };
			case 'scheduled':
				return { background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA' };
			case 'draft':
				return { background: 'rgba(255, 255, 255, 0.08)', color: '#D1D5DB' };
			case 'failed':
				return { background: 'rgba(239, 68, 68, 0.2)', color: '#F87171' };
			default:
				return { background: 'rgba(255, 255, 255, 0.08)', color: '#D1D5DB' };
		}
	};

		const getStatusLabel = (status: string) => {
		const labels: Record<string, string> = {
			posted: 'Publié',
			scheduled: 'Planifié',
			draft: 'Brouillon',
			failed: 'Échoué',
		};
		return labels[status] ?? status;
	};

	// Get post images
	const getPostImages = () => {
		if (post?.images && post.images.length > 0) {
			return post.images;
		}
		if (post?.mediaUrl) {
			return [post.mediaUrl];
		}
		if (post?.backgroundUrl) {
			return [post.backgroundUrl];
		}
		return [];
	};

	// Start editing: copy post into editForm (scheduledAt as ISO string for payload)
	const startEditing = () => {
		if (!post) return;
		setEditForm({
			caption: post.caption ?? '',
			productName: post.productName ?? '',
			description: post.description ?? '',
			price: post.price ?? 0,
			currency: post.currency ?? 'TND',
			postType: post.postType ?? '',
			platform: post.platform ?? [],
			scheduledAt: post.scheduledAt ?? '',
		});
		setIsEditing(true);
	};

	// DatePicker change: same logic as CreatePostPage — save exact time as UTC
	const handleScheduledDateChange = (date: Date | null) => {
		if (date) {
			const y = date.getFullYear();
			const m = date.getMonth();
			const d = date.getDate();
			const h = date.getHours();
			const min = date.getMinutes();
			const utcDate = new Date(Date.UTC(y, m, d, h, min, 0, 0));
			setEditForm((prev) => ({ ...prev, scheduledAt: utcDate.toISOString() }));
		} else {
			setEditForm((prev) => ({ ...prev, scheduledAt: '' }));
		}
	};

	// Save edits via updatePost API — send all fields so price, postType, etc. are updated
	const handleSaveEdit = async () => {
		if (!id || !post) return;
		setIsSaving(true);
		try {
			const payload: Record<string, unknown> = {
				caption: editForm.caption,
				productName: editForm.productName,
				description: editForm.description,
				price: editForm.price,
				currency: editForm.currency,
				postType: editForm.postType,
				platform: editForm.platform,
			};
			if (editForm.scheduledAt) {
				payload.scheduledAt = editForm.scheduledAt;
			} else {
				payload.scheduledAt = null;
			}
			const updated = await updatePost(id, payload);
			setPost(updated);
			setIsEditing(false);
		} catch (err: unknown) {
			console.error('Failed to update post:', err);
			setError(err instanceof Error ? err.message : 'Failed to update post');
		} finally {
			setIsSaving(false);
		}
	};

	const togglePlatform = (platform: string) => {
		setEditForm((prev) => ({
			...prev,
			platform: prev.platform.includes(platform)
				? prev.platform.filter((p) => p !== platform)
				: [...prev.platform, platform],
		}));
	};

	if (isLoading) {
		return (
			<div className="w-full h-full min-h-0 flex-1 flex flex-col py-6 px-4 md:px-6 lg:px-8 flex items-center justify-center" style={{ background: '#000000' }}>
				<div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#9747FF' }} />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="w-full h-full min-h-0 flex-1 flex flex-col py-6 px-4 md:px-6 lg:px-8 flex items-center justify-center" style={{ background: '#000000' }}>
				<div className="text-center">
					<p className="text-gray-400 mb-4">{error || 'Post not found'}</p>
					<button
						onClick={() => navigate('/posts')}
						className="px-6 py-2.5 rounded-xl text-white font-medium transition-colors"
						style={{ background: '#9747FF' }}
					>
						Retour aux posts
					</button>
				</div>
			</div>
		);
	}

	const images = getPostImages();

	const cardStyle = { background: '#0E0E13', border: '1px solid #FFFFFF1A', borderRadius: '1rem' };

	return (
		<div className="w-full h-full min-h-0 flex-1 flex flex-col overflow-y-auto py-6 px-4 md:px-6 lg:px-8 relative" style={{ background: '#000000' }}>
			{/* Gradient background on the left */}
			<div className="absolute top-0 left-0 w-1/2 h-full pointer-events-none z-0">
				<img 
					src={postsLeftImg} 
					alt="" 
					className="w-full h-full object-cover opacity-50"
					style={{ mixBlendMode: 'screen', transform: 'scaleX(2)' }}
				/>
			</div>
			
			{/* Gradient background on the right */}
			<div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0">
				<img 
					src={postsRightImg} 
					alt="" 
					className="w-full h-full object-cover opacity-50"
					style={{ mixBlendMode: 'screen',transform: 'scaleX(2)' }}
				/>
			</div>
			
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Images */}
					{images.length > 0 && (
						<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
							<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
								Média
							</h3>
							<div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
								{images.map((image, index) => (
									<div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
										<img
											src={image}
											alt={`Post image ${index + 1}`}
											className="w-full h-full object-cover"
											onError={(e) => {
												(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
											}}
										/>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Caption */}
					{isEditing ? (
						<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
							<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
								Légende
							</h3>
							<textarea
								value={editForm.caption}
								onChange={(e) => setEditForm((prev) => ({ ...prev, caption: e.target.value }))}
								rows={4}
								className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#9747FF] focus:border-transparent"
								placeholder="Légende"
							/>
						</div>
					) : (
						post.caption && (
							<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
								<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
									Légende
								</h3>
								<p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.caption}</p>
							</div>
						)
					)}
				</div>

				{/* Sidebar */}
				<div className="space-y-6">
					{/* Status & Actions */}
					<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
								Statut
							</h3>
							<div className="flex items-center gap-2">
								{isEditing && (
									<>
										<button
											type="button"
											onClick={() => setIsEditing(false)}
											disabled={isSaving}
											className="w-8 h-8 flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0 [&_svg]:w-4 [&_svg]:h-4"
											style={{ background: '#EF4444' }}
											title="Annuler"
										>
											<CloseIcon />
										</button>
										<button
											type="button"
											onClick={handleSaveEdit}
											disabled={isSaving || editForm.platform.length === 0}
											className="w-8 h-8 flex items-center justify-center rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-50 shrink-0 [&_svg]:w-4 [&_svg]:h-4"
											style={{ background: '#22C55E' }}
											title="Enregistrer"
										>
											<CheckIcon />
										</button>
									</>
								)}
								{!isEditing && (
									<span
										className="px-3 py-1 rounded-lg text-sm font-medium capitalize"
										style={getStatusStyle(post.status)}
									>
										{getStatusLabel(post.status)}
									</span>
								)}
							</div>
						</div>

						<div className="space-y-3">
							{post.publishedUrl && (
								<a
									href={post.publishedUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full py-2.5 rounded-xl text-white text-center font-medium transition-opacity hover:opacity-90"
									style={{ background: '#9747FF' }}
								>
									Voir sur la plateforme
								</a>
							)}

							{!isEditing && (
								<button
									onClick={startEditing}
									className="w-full px-4 py-2.5 rounded-xl text-white border border-white/20 hover:bg-white/10 transition-colors font-medium"
								>
									Modifier
								</button>
							)}

							<button
								onClick={() => navigate('/posts')}
								className="w-full px-4 py-2.5 rounded-xl text-white border border-white/20 hover:bg-white/5 transition-colors font-medium"
							>
								Retour aux posts
							</button>
						</div>
					</div>

					{/* Post Details */}
					<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
						<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
							Détails
						</h3>
						<div className="space-y-4">
							{isEditing ? (
								<>
									<div>
										<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Plateformes</label>
										<div className="flex flex-wrap gap-2 mt-2">
											{['facebook', 'instagram'].map((platform) => (
												<label key={platform} className="flex items-center gap-1.5 cursor-pointer">
													<input
														type="checkbox"
														checked={editForm.platform.includes(platform)}
														onChange={() => togglePlatform(platform)}
														className="rounded border-white/30 bg-white/5 text-[#9747FF] focus:ring-[#9747FF]"
													/>
													<span className="text-sm text-gray-300">{getPlatformName(platform)}</span>
												</label>
											))}
										</div>
									</div>
									<div>
										<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Type de post</label>
										<select
											value={editForm.postType}
											onChange={(e) => setEditForm((prev) => ({ ...prev, postType: e.target.value }))}
											className="w-full mt-1 px-3 py-2 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none"
											style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}
										>
											<option value="">Sélectionner</option>
											<option value="accessories">Accessories</option>
											<option value="clothing">Clothing</option>
											<option value="electronics">Electronics</option>
											<option value="furniture">Furniture</option>
											<option value="beauty">Beauty</option>
											<option value="food">Food</option>
											<option value="sports">Sports</option>
											<option value="books">Books</option>
											<option value="toys">Toys</option>
											<option value="automotive">Automotive</option>
											<option value="home">Home</option>
										</select>
									</div>
									<div>
										<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Planifié pour</label>
										<DatePicker
											selected={
												editForm.scheduledAt
													? (() => {
															const d = new Date(editForm.scheduledAt);
															return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes());
														})()
													: null
											}
											onChange={handleScheduledDateChange}
											showTimeSelect
											timeFormat="HH:mm"
											timeIntervals={15}
											dateFormat="d MMM yyyy HH:mm"
											locale="fr"
											timeZone="UTC"
											minDate={new Date()}
											placeholderText="Date et heure"
											className="w-full mt-1 px-3 py-2 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none bg-[#0E0E13] border border-white/10"
											wrapperClassName="w-full"
										/>
									</div>
								</>
							) : (
								<>
									<div>
										<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Plateformes</label>
										<div className="flex flex-wrap gap-2 mt-2">
											{post.platform.map((platform) => (
												<span
													key={platform}
													className="px-3 py-1 rounded-lg text-sm font-medium"
													style={{ background: 'rgba(151, 71, 255, 0.2)', color: '#9747FF' }}
												>
													{getPlatformName(platform)}
												</span>
											))}
										</div>
									</div>
									{post.postType && (
										<div>
											<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Type de post</label>
											<p className="text-white mt-1 capitalize">{post.postType}</p>
										</div>
									)}
									{post.scheduledAt && (
										<div>
											<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Planifié pour</label>
											<p className="text-gray-300 mt-1">{formatDate(post.scheduledAt)}</p>
										</div>
									)}
									{post.publishedAt && (
										<div>
											<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Publié le</label>
											<p className="text-gray-300 mt-1">{formatDate(post.publishedAt)}</p>
										</div>
									)}
								</>
							)}
						</div>
					</div>

					{/* Informations produit - under Détails */}
					{isEditing ? (
						<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
							<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
								Informations produit
							</h3>
							<div className="space-y-4">
								<div>
									<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Nom du produit</label>
									<input
										value={editForm.productName}
										onChange={(e) => setEditForm((prev) => ({ ...prev, productName: e.target.value }))}
										className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#9747FF]"
										placeholder="Nom du produit"
									/>
								</div>
								<div>
									<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Description</label>
									<textarea
										value={editForm.description}
										onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
										rows={3}
										className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#9747FF]"
										placeholder="Description"
									/>
								</div>
								<div className="flex gap-2">
									<div className="flex-1">
										<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Prix</label>
										<input
											type="number"
											value={editForm.price}
											onChange={(e) => setEditForm((prev) => ({ ...prev, price: Number(e.target.value) }))}
											className="w-full mt-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-[#9747FF]"
											placeholder="Prix"
										/>
									</div>
									<div className="w-24">
										<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Devise</label>
										<select
											value={editForm.currency}
											onChange={(e) => setEditForm((prev) => ({ ...prev, currency: e.target.value }))}
											className="w-full mt-1 px-3 py-2 rounded-lg text-gray-100 focus:ring-2 focus:ring-[#9747FF] focus:border-[#9747FF] focus:outline-none"
											style={{ background: '#0E0E13', border: '1px solid rgba(255,255,255,0.1)' }}
										>
											<option value="TND">DT</option>
											<option value="USD">USD</option>
											<option value="EUR">EUR</option>
										</select>
									</div>
								</div>
							</div>
						</div>
					) : (
						(post.productName || post.description || post.price) && (
							<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
								<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
									Informations produit
								</h3>
								<div className="space-y-4">
									{post.productName && (
										<div>
											<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Nom du produit</label>
											<p className="text-white mt-1">{post.productName}</p>
										</div>
									)}
									{post.description && (
										<div>
											<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Description</label>
											<p className="text-gray-300 mt-1 whitespace-pre-wrap">{post.description}</p>
										</div>
									)}
									{post.price !== undefined && post.currency && (
										<div>
											<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Prix</label>
											<p className="text-white mt-1 font-semibold text-lg">
												{post.currency} {post.price}
											</p>
										</div>
									)}
								</div>
							</div>
						)
					)}

					{/* AI Prompt (if available) */}
					{post.aiPrompt && (
						<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
							<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
								Prompt IA
							</h3>
							<p className="text-gray-300 text-sm whitespace-pre-wrap">{post.aiPrompt}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
