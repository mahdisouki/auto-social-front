import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsApi } from '../lib/api';
import type { Post } from '../types/api';

export function PostDetailPage() {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [post, setPost] = useState<Post | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

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

	// Format date helper
	const formatDate = (dateString?: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
		});
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

	if (isLoading) {
		return (
			<div className="w-full py-6 px-4 md:px-6 lg:px-8 min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
				<div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#9747FF' }} />
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="w-full py-6 px-4 md:px-6 lg:px-8 min-h-screen flex items-center justify-center" style={{ background: '#000000' }}>
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
		<div className="w-full py-6 px-4 md:px-6 lg:px-8 min-h-screen" style={{ background: '#000000' }}>
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
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
					{post.caption && (
						<div className="p-6 rounded-2xl overflow-hidden" style={cardStyle}>
							<h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
								Légende
							</h3>
							<p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{post.caption}</p>
						</div>
					)}

					{/* Product Information */}
					{(post.productName || post.description || post.price) && (
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
								{post.price && post.currency && (
									<div>
										<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Prix</label>
										<p className="text-white mt-1 font-semibold text-lg">
											{post.currency} {post.price}
										</p>
									</div>
								)}
							</div>
						</div>
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
							<span
								className="px-3 py-1 rounded-lg text-sm font-medium capitalize"
								style={getStatusStyle(post.status)}
							>
								{post.status}
							</span>
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

							<div>
								<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Créé le</label>
								<p className="text-gray-300 mt-1">{formatDate(post.createdAt)}</p>
							</div>

							<div>
								<label className="text-xs font-medium uppercase tracking-wider text-gray-400">Dernière mise à jour</label>
								<p className="text-gray-300 mt-1">{formatDate(post.updatedAt)}</p>
							</div>
						</div>
					</div>

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
