import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, EyeIcon } from '../components/icons';
import { usePostsStore } from '../stores/postsStore';
import type { Post } from '../types/api';

export function MyPostsPage() {
	const navigate = useNavigate();
	const { posts, isLoading, error, fetchPosts, clearError } = usePostsStore();
	
	// Filter and pagination state
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [limit] = useState(10);

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
	const filteredPosts = posts.filter((post) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			post.caption?.toLowerCase().includes(query) ||
			post.productName?.toLowerCase().includes(query) ||
			post.description?.toLowerCase().includes(query)
		);
	});

	// Format date helper
	const formatDate = (dateString?: string) => {
		if (!dateString) return 'N/A';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// Get platform display name
	const getPlatformName = (platform: string) => {
		return platform.charAt(0).toUpperCase() + platform.slice(1);
	};

	// Get status badge color (dark theme)
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'posted':
				return 'bg-green-500/30 text-green-200';
			case 'scheduled':
				return 'bg-blue-500/30 text-blue-200';
			case 'draft':
				return 'bg-gray-500/30 text-gray-300';
			case 'failed':
				return 'bg-red-500/30 text-red-200';
			default:
				return 'bg-gray-500/30 text-gray-300';
		}
	};

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
		<div className="container-max py-6 min-h-[80vh] bg-gray-900/70 backdrop-blur-2xl rounded-2xl">
			{/* Error Message */}
			{error && (
				<div className="mb-4 p-4 bg-red-500/20 border border-red-400/40 rounded-lg backdrop-blur-sm">
					<p className="text-red-200">{error}</p>
					<button
						onClick={clearError}
						className="mt-2 text-sm text-red-300 underline hover:no-underline"
					>
						Dismiss
					</button>
				</div>
			)}

			{/* Search and Filters */}
			<div className="mb-6">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input 
							placeholder="Search posts..." 
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-100 placeholder-gray-400"
						/>
					</div>
					<div className="flex gap-2 flex-wrap">
						{(['all', 'instagram', 'facebook', 'twitter', 'tiktok'] as const).map((platform) => (
							<button 
								key={platform}
								onClick={() => setSelectedPlatform(platform === 'all' ? 'all' : platform)}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
									selectedPlatform === platform
										? 'bg-primary text-white'
										: 'border border-white/20 text-gray-300 hover:bg-white/10'
								}`}
							>
								{platform === 'all' ? 'All' : platform.charAt(0).toUpperCase() + platform.slice(1)}
							</button>
						))}
					</div>
				</div>

				{/* Status Filter */}
				<div className="mt-4 flex gap-2 flex-wrap">
					{(['all', 'draft', 'scheduled', 'posted', 'failed'] as const).map((status) => (
						<button 
							key={status}
							onClick={() => setSelectedStatus(status)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedStatus === status
									? 'bg-primary text-white'
									: 'border border-white/20 text-gray-300 hover:bg-white/10'
							}`}
						>
							{status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
						</button>
					))}
				</div>
			</div>

			{/* Loading State */}
			{isLoading && (
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				</div>
			)}

			{/* Posts Grid */}
			{!isLoading && filteredPosts.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-400 text-lg">No posts found</p>
					<p className="text-gray-500 text-sm mt-2">
						{searchQuery || selectedPlatform !== 'all' || selectedStatus !== 'all'
							? 'Try adjusting your filters'
							: 'Create your first post to get started'}
					</p>
				</div>
			)}

			{!isLoading && filteredPosts.length > 0 && (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredPosts.map((post) => (
							<div 
								key={post._id} 
								onClick={() => navigate(`/posts/${post._id}`)}
								className="overflow-hidden rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
							>
								<div className="relative">
									<img 
										src={getPostImage(post)} 
										alt={post.caption || post.productName || 'Post image'}
										className="w-full h-48 object-cover"
										onError={(e) => {
											(e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop';
										}}
									/>
									<div className="absolute top-3 left-3 flex gap-2 flex-wrap">
										{post.platform.map((platform) => (
											<span 
												key={platform}
												className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-gray-200"
											>
												{getPlatformName(platform)}
											</span>
										))}
									</div>
									<div className="absolute top-3 right-3">
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
											{post.status}
										</span>
									</div>
								</div>
								<div className="p-4">
									<h3 className="font-semibold text-gray-100 mb-2 line-clamp-2">
										{post.productName || post.caption?.substring(0, 50) || 'Untitled Post'}
									</h3>
									{post.caption && (
										<p className="text-sm text-gray-400 mb-2 line-clamp-2">
											{post.caption}
										</p>
									)}
									<p className="text-sm text-gray-500 mb-3">
										{formatDate(post.publishedAt || post.scheduledAt || post.createdAt)}
									</p>
									{post.publishedUrl && (
										<a
											href={post.publishedUrl}
											target="_blank"
											rel="noopener noreferrer"
											onClick={(e) => e.stopPropagation()}
											className="flex items-center gap-1 text-primary hover:text-primary/80 text-sm mb-3"
										>
											<EyeIcon />
											View on Platform
										</a>
									)}
									{post.price && post.currency && (
										<div className="text-sm font-semibold text-gray-200 mb-2">
											{post.currency} {post.price}
										</div>
									)}
								</div>
							</div>
						))}
					</div>

					{/* Pagination */}
					<div className="mt-6 flex justify-center items-center gap-2">
						<button
							onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
							disabled={currentPage === 1 || isLoading}
							className="px-4 py-2 border border-white/20 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<span className="px-4 py-2 text-sm text-gray-400">
							Page {currentPage}
						</span>
						<button
							onClick={() => setCurrentPage((prev) => prev + 1)}
							disabled={filteredPosts.length < limit || isLoading}
							className="px-4 py-2 border border-white/20 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</>
			)}
		</div>
	);
}
