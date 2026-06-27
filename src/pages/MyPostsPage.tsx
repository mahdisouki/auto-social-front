import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, TrashIcon } from '../components/icons';
import { usePostsStore } from '../stores/postsStore';
import { postsApi } from '../lib/api';
import type { Post } from '../types/api';
import postsRightImg from '../assets/postsR.png';
import postsLeftImg from '../assets/postsL.png';
import instagramIcon from '../assets/insta.png';
import facebookIcon from '../assets/fb.png';

export function MyPostsPage() {
	const APP_TIMEZONE = 'Africa/Tunis';
	const { posts, isLoading, error, fetchPosts, deletePost, clearError } = usePostsStore();
	
	// Filter and pagination state
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [limit, setLimit] = useState(10);
	// Delete confirmation toast: post id when waiting for confirm, null otherwise
	const [deleteConfirmPostId, setDeleteConfirmPostId] = useState<string | null>(null);
	const [engagementByPostId, setEngagementByPostId] = useState<
		Record<string, { likesCount: number; commentsCount: number; loading: boolean }>
	>({});
	const [engagementError, setEngagementError] = useState<string | null>(null);

	// Fetch posts on mount and when filters change
	useEffect(() => {
		const params: {
			page?: number;
			limit?: number;
			status?: string;
			platform?: string;
		} = {
			page: currentPage,
			limit: limit,
		};

		if (selectedStatus !== 'all') {
			params.status = selectedStatus;
		}

		if (selectedPlatform !== 'all') {
			params.platform = selectedPlatform.toLowerCase();
		}

		fetchPosts(params).catch((err) => {
			console.error('Failed to fetch posts:', err);
		});
	}, [currentPage, selectedPlatform, selectedStatus, limit, fetchPosts]);

	// Filter posts by search query (client-side filtering)
	const filteredPosts = useMemo(() => {
		if (!searchQuery) return posts;
		const query = searchQuery.toLowerCase();
		return posts.filter(
			(post) =>
				post.caption?.toLowerCase().includes(query) ||
				post.productName?.toLowerCase().includes(query) ||
				post.description?.toLowerCase().includes(query)
		);
	}, [posts, searchQuery]);

	const postedPosts = useMemo(
		() => filteredPosts.filter((post) => post.status === 'posted'),
		[filteredPosts]
	);

	// Fetch likes/comments for published posts
	useEffect(() => {
		if (postedPosts.length === 0) {
			setEngagementByPostId({});
			return;
		}

		let cancelled = false;
		let failedCount = 0;

		setEngagementError(null);
		setEngagementByPostId(
			Object.fromEntries(
				postedPosts.map((post) => [
					post._id,
					{ likesCount: 0, commentsCount: 0, loading: true },
				])
			)
		);

		const fetchEngagements = async () => {
			const results = await Promise.all(
				postedPosts.map(async (post) => {
					try {
						const response = await postsApi.getPostEngagement(post._id, { sync: false });
						const engagement = response.data.data?.engagement;
						return {
							postId: post._id,
							likesCount: engagement?.likesCount ?? 0,
							commentsCount: engagement?.commentsCount ?? 0,
							failed: false,
						};
					} catch (error) {
						failedCount += 1;
						return {
							postId: post._id,
							likesCount: 0,
							commentsCount: 0,
							failed: true,
						};
					}
				})
			);

			if (cancelled) return;

			if (failedCount > 0) {
				setEngagementError(
					`Impossible de charger l'engagement pour ${failedCount} publication${failedCount > 1 ? 's' : ''}.`
				);
			}

			setEngagementByPostId(
				Object.fromEntries(
					results.map((result) => [
						result.postId,
						{
							likesCount: result.likesCount,
							commentsCount: result.commentsCount,
							loading: false,
						},
					])
				)
			);
		};

		fetchEngagements();

		return () => {
			cancelled = true;
		};
	}, [postedPosts]);

	// Format date helper
	const formatDate = (dateString?: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			timeZone: APP_TIMEZONE,
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// Get platform display name
	const getPlatformName = (platform: string) => {
		return platform.charAt(0).toUpperCase() + platform.slice(1);
	};

	// Get status badge color (dashboard-style purple accent)
	const getStatusStyle = (status: string) => {
		switch (status) {
			case 'posted':
				return { background: 'rgba(151, 71, 255, 0.25)', color: '#C098F5' };
			case 'scheduled':
				return { background: 'rgba(34, 197, 94, 0.2)', color: '#86efac' };
			case 'draft':
				return { background: 'rgba(255,255,255,0.08)', color: '#d1d5db' };
			case 'failed':
				return { background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' };
			default:
				return { background: 'rgba(255,255,255,0.08)', color: '#d1d5db' };
		}
	};

	const handleDeleteClick = (e: React.MouseEvent, postId: string) => {
		e.preventDefault();
		e.stopPropagation();
		setDeleteConfirmPostId(postId);
	};

	const handleDeleteConfirm = async () => {
		if (!deleteConfirmPostId) return;
		try {
			await deletePost(deleteConfirmPostId);
			setDeleteConfirmPostId(null);
		} catch (err) {
			console.error('Failed to delete post:', err);
		} finally {
			setDeleteConfirmPostId(null);
		}
	};

	const handleDeleteCancel = (e?: React.MouseEvent) => {
		e?.stopPropagation();
		setDeleteConfirmPostId(null);
	};

	const canDeletePost = (status: string) => status !== 'posted';

	// Get first image from post
	const getPostImage = (post: Post) => {
		if (post.images && post.images.length > 0) {
			return post.images[0];
		}
		if (post.mediaUrl) {
			return post.mediaUrl;
		}
		if (post.backgroundUrl) {
			return post.backgroundUrl;
		}
		return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
	};

	return (
		<div className="w-full h-full min-h-0 flex-1 flex flex-col py-6 px-4 md:px-6 lg:px-8 overflow-y-auto overflow-x-hidden relative" style={{ background: '#000000', zoom: '0.8' }}>
			{/* Gradient background on the left */}
			<div className="absolute top-0 left-0 w-1/2 h-full pointer-events-none z-0">
				<img 
					src={postsLeftImg} 
					alt="" 
					className="w-full h-full object-cover "
					style={{ mixBlendMode: 'screen', transform: 'scaleX(2)' }}
				/>
			</div>
			
			{/* Gradient background on the right */}
			<div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none z-0">
				<img 
					src={postsRightImg} 
					alt="" 
					className="w-full h-full object-cover opacity-50"
					style={{ mixBlendMode: 'screen' }}
				/>
			</div>
			
			<div className="relative z-10 flex flex-col min-h-0 flex-1">
				
			

				{/* Error Message */}
				{error && (
					<div
						className="mb-6 p-4 rounded-xl"
						style={{
							background: '#0E0E13',
							border: '1px solid rgba(255,255,255,0.1)',
						}}
					>
						<p className="text-white mb-4">{error}</p>
						<button
							onClick={clearError}
							className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
							style={{ background: '#9747FF' }}
						>
							Fermer
						</button>
					</div>
				)}

				{engagementError && (
					<div
						className="mb-6 p-4 rounded-xl"
						style={{
							background: '#0E0E13',
							border: '1px solid rgba(239, 68, 68, 0.3)',
						}}
					>
						<p className="text-red-400 mb-4">{engagementError}</p>
						<button
							onClick={() => setEngagementError(null)}
							className="px-4 py-2 rounded-lg text-white text-sm font-medium transition-opacity hover:opacity-90"
							style={{ background: '#9747FF' }}
						>
							Fermer
						</button>
					</div>
				)}

				{/* Search and Filters card */}
				<div
					className="rounded-2xl p-4 relative"
					style={{
						background: '#0E0E13',
						borderRight: '1px solid #FFFFFF1A',
						minHeight: '150px',
						zIndex: 20,
					}}
				>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1 relative">
							<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								placeholder="Rechercher des publications..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-colors"
								style={{
									background: 'rgba(255,255,255,0.05)',
									border: '1px solid rgba(255,255,255,0.1)',
								}}
							/>
						</div>
						<div className="flex gap-2 flex-wrap">
							{(['all', 'instagram', 'facebook'] as const).map((platform) => (
								<button
									key={platform}
									type="button"
									onClick={() => setSelectedPlatform(platform === 'all' ? 'all' : platform)}
									className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
									style={
										selectedPlatform === platform
											? { background: '#9747FF', color: '#fff' }
											: { background: 'rgba(255,255,255,0.05)', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.1)' }
									}
								>
									{platform === 'all' ? 'Tous' : getPlatformName(platform)}
								</button>
							))}
						</div>
					</div>
					<div className="mt-4 flex gap-2 flex-wrap">
						{(['all', 'draft', 'scheduled', 'posted', 'failed'] as const).map((status) => (
							<button
								key={status}
								type="button"
								onClick={() => setSelectedStatus(status)}
								className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
								style={
									selectedStatus === status
										? { background: '#9747FF', color: '#fff' }
										: { background: 'rgba(255,255,255,0.05)', color: '#d1d5db', border: '1px solid rgba(255,255,255,0.1)' }
								}
							>
								{status === 'all' ? 'Tous les statuts' : status.charAt(0).toUpperCase() + status.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Loading State */}
				{isLoading && (
					<div className="flex justify-center items-center py-12 mt-8">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#9747FF' }} />
					</div>
				)}

				{/* Empty state */}
				{!isLoading && filteredPosts.length === 0 && (
					<div
						className="rounded-2xl p-12 text-center mt-8"
						style={{
							background: 'rgba(14, 14, 19, 0.95)',
							border: '1px solid rgba(255,255,255,0.1)',
						}}
					>
						<p className="text-gray-400 text-lg">Aucune publication trouvée</p>
						<p className="text-gray-500 text-sm mt-2">
							{searchQuery || selectedPlatform !== 'all' || selectedStatus !== 'all'
								? 'Modifiez vos filtres pour afficher plus de résultats'
								: 'Créez votre première publication pour commencer'}
						</p>
					</div>
				)}

				{/* Posts Grid */}
				{!isLoading && filteredPosts.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full mt-8">
						{filteredPosts.map((post) => (
							<Link
								key={post._id}
								to={`/posts/${post._id}`}
								className="block overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02] no-underline"
								style={{
									background: '#0E0E13',
									border: '1px solid #FFFFFF1A',
								}}
							>
								<div className="relative">
									<img
										src={getPostImage(post)}
										alt={post.caption || post.productName || 'Post image'}
									className="w-full h-96 object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
										}}
									/>
									{/* Platform icons in top right */}
									<div className="absolute top-3 right-3 flex gap-2">
										{post.platform.includes('instagram') && (
											<img src={instagramIcon} alt="Instagram" className="w-8 h-8" />
										)}
										{post.platform.includes('facebook') && (
											<img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
										)}
									</div>
									{/* Delete button only for non-posted statuses */}
									{canDeletePost(post.status) && (
										<button
											type="button"
											onClick={(e) => handleDeleteClick(e, post._id)}
											className="absolute top-3 left-3 p-1.5 rounded-lg text-white transition-opacity hover:opacity-90 opacity-100"
											style={{ background: 'rgba(239, 68, 68, 0.8)' }}
											title="Supprimer"
										>
											<TrashIcon className="w-4 h-4" />
										</button>
									)}
								</div>
								<div className="p-4">
									{/* Category and Status row */}
									<div className="flex justify-between items-center mb-2">
										<span className="text-sm font-medium" style={{ color: '#9747FF' }}>
											{post.postType}
										</span>
										<span 
											className="px-3 py-1 rounded-lg text-xs font-medium"
											style={{ 
												background: '#9747FF',
												color: '#FFFFFF'
											}}
										>
											{post.status === 'posted' ? 'Publié' : post.status === 'scheduled' ? 'Planifié' : post.status.charAt(0).toUpperCase() + post.status.slice(1)}
										</span>
									</div>
									
									{/* Title */}
									<h3 className="font-semibold mb-3 line-clamp-2 text-white text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
										{post.caption?.substring(0, 50) || post.productName || 'Sans titre'}
									</h3>
									
									{/* Planification */}
									<div className="text-sm text-gray-400 mb-1">Planification</div>
									<div className="text-sm text-white">
										{formatDate(post.scheduledAt || post.createdAt)}
									</div>

									{post.status === 'posted' && (
										<div className="mt-3 flex items-center gap-4 text-sm">
											<div className="text-gray-400">
												J'aime{' '}
												<span className="text-white font-medium">
													{engagementByPostId[post._id]?.loading
														? '...'
														: engagementByPostId[post._id]?.likesCount ?? 0}
												</span>
											</div>
											<div className="text-gray-400">
												Commentaires{' '}
												<span className="text-white font-medium">
													{engagementByPostId[post._id]?.loading
														? '...'
														: engagementByPostId[post._id]?.commentsCount ?? 0}
												</span>
											</div>
										</div>
									)}
								</div>
							</Link>
						))}
					</div>
				)}

				{/* Pagination */}
				{!isLoading && filteredPosts.length > 0 && (
					<div
						className="shrink-0 pt-6 mt-4 flex justify-center items-center gap-4 "
						style={{ borderTop: '1px solid rgba(255,255,255,0.1)', zIndex: 20 }}
					>
						<label className="text-sm text-gray-400">Publications par page:</label>
						<select
							value={limit}
							onChange={(e) => {
								setLimit(Number(e.target.value));
								setCurrentPage(1);
							}}
							className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
							style={{
								background: '#0E0E13',
								border: '1px solid rgba(255,255,255,0.1)',
								color: '#d1d5db',
							}}
						>
							<option value="5">5</option>
							<option value="10">10</option>
							<option value="20">20</option>
							<option value="50">50</option>
						</select>
					</div>
				)}
			</div>

				{/* Delete confirmation modal */}
				{deleteConfirmPostId && (
					<div
						className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center sm:p-0"
						onClick={handleDeleteCancel}
						role="presentation"
					>
						<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />
						<div
							className="relative w-full max-w-sm rounded-2xl transition-all duration-200"
							onClick={(e) => e.stopPropagation()}
							style={{
								background: '#0E0E13',
								border: '1px solid rgba(255,255,255,0.1)',
								boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
							}}
						>
							<div className="p-6">
								<div className="flex items-center gap-4">
									<div
										className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
										style={{ background: 'rgba(239, 68, 68, 0.15)' }}
									>
										<TrashIcon className="w-6 h-6 text-red-400" />
									</div>
									<div>
										<h3 className="text-base font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
											Supprimer cette publication ?
										</h3>
										<p className="mt-0.5 text-sm text-gray-400">
											Cette action est irréversible.
										</p>
									</div>
								</div>
								<div className="mt-6 flex gap-3">
									<button
										type="button"
										onClick={handleDeleteCancel}
										className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:opacity-90"
										style={{
											background: 'rgba(255,255,255,0.05)',
											border: '1px solid rgba(255,255,255,0.1)',
										}}
									>
										Annuler
									</button>
									<button
										type="button"
										onClick={handleDeleteConfirm}
										className="flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
										style={{ background: '#EF4444' }}
									>
										Supprimer
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
		</div>
	);
}
