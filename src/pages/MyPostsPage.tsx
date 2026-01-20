import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionTitle } from '../components/layout';
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

	// Get status badge color
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'posted':
				return 'bg-green-100 text-green-800';
			case 'scheduled':
				return 'bg-blue-100 text-blue-800';
			case 'draft':
				return 'bg-gray-100 text-gray-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
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
		<div className="container-max py-6">
			<SectionTitle 
				title="My Posts" 
				subtitle="Manage and track your published content" 
			/>

			{/* Error Message */}
			{error && (
				<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
					<p>{error}</p>
					<button
						onClick={clearError}
						className="mt-2 text-sm underline hover:no-underline"
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
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
					<div className="flex gap-2 flex-wrap">
						<button 
							onClick={() => setSelectedPlatform('all')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedPlatform === 'all'
									? 'bg-primary text-white'
									: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
						>
							All
						</button>
						<button 
							onClick={() => setSelectedPlatform('instagram')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedPlatform === 'instagram'
									? 'bg-primary text-white'
									: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
						>
							Instagram
						</button>
						<button 
							onClick={() => setSelectedPlatform('facebook')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedPlatform === 'facebook'
									? 'bg-primary text-white'
									: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
						>
							Facebook
						</button>
						<button 
							onClick={() => setSelectedPlatform('twitter')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedPlatform === 'twitter'
									? 'bg-primary text-white'
									: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
						>
							Twitter
						</button>
						<button 
							onClick={() => setSelectedPlatform('tiktok')}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								selectedPlatform === 'tiktok'
									? 'bg-primary text-white'
									: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
							}`}
						>
							TikTok
						</button>
					</div>
				</div>

				{/* Status Filter */}
				<div className="mt-4 flex gap-2 flex-wrap">
					<button 
						onClick={() => setSelectedStatus('all')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							selectedStatus === 'all'
								? 'bg-primary text-white'
								: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
						}`}
					>
						All Status
					</button>
					<button 
						onClick={() => setSelectedStatus('draft')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							selectedStatus === 'draft'
								? 'bg-primary text-white'
								: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
						}`}
					>
						Draft
					</button>
					<button 
						onClick={() => setSelectedStatus('scheduled')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							selectedStatus === 'scheduled'
								? 'bg-primary text-white'
								: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
						}`}
					>
						Scheduled
					</button>
					<button 
						onClick={() => setSelectedStatus('posted')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							selectedStatus === 'posted'
								? 'bg-primary text-white'
								: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
						}`}
					>
						Posted
					</button>
					<button 
						onClick={() => setSelectedStatus('failed')}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							selectedStatus === 'failed'
								? 'bg-primary text-white'
								: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
						}`}
					>
						Failed
					</button>
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
					<p className="text-gray-500 text-lg">No posts found</p>
					<p className="text-gray-400 text-sm mt-2">
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
								className="card overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
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
												className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700"
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
									<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
										{post.productName || post.caption?.substring(0, 50) || 'Untitled Post'}
									</h3>
									{post.caption && (
										<p className="text-sm text-gray-600 mb-2 line-clamp-2">
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
										<div className="text-sm font-semibold text-gray-900 mb-2">
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
							className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Previous
						</button>
						<span className="px-4 py-2 text-sm text-gray-700">
							Page {currentPage}
						</span>
						<button
							onClick={() => setCurrentPage((prev) => prev + 1)}
							disabled={filteredPosts.length < limit || isLoading}
							className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Next
						</button>
					</div>
				</>
			)}
		</div>
	);
}
