import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionTitle } from '../components/layout';
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
			<div className="container-max py-6">
				<div className="flex justify-center items-center py-12">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				</div>
			</div>
		);
	}

	if (error || !post) {
		return (
			<div className="container-max py-6">
				<SectionTitle title="Post Not Found" subtitle={error || 'The post you are looking for does not exist'} />
				<div className="mt-6 text-center">
					<button
						onClick={() => navigate('/posts')}
						className="btn-primary"
					>
						Back to Posts
					</button>
				</div>
			</div>
		);
	}

	const images = getPostImages();

	return (
		<div className="container-max py-6">
			<SectionTitle 
				title="Post Details" 
				subtitle={post.productName || post.caption?.substring(0, 50) || 'View post information'} 
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-6">
					{/* Images */}
					{images.length > 0 && (
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Media</h3>
							<div className={`grid gap-4 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
								{images.map((image, index) => (
									<div key={index} className="relative aspect-square rounded-lg overflow-hidden">
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
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Caption</h3>
							<p className="text-gray-700 whitespace-pre-wrap">{post.caption}</p>
						</div>
					)}

					{/* Product Information */}
					{(post.productName || post.description || post.price) && (
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
							<div className="space-y-3">
								{post.productName && (
									<div>
										<label className="text-sm font-medium text-gray-500">Product Name</label>
										<p className="text-gray-900 mt-1">{post.productName}</p>
									</div>
								)}
								{post.description && (
									<div>
										<label className="text-sm font-medium text-gray-500">Description</label>
										<p className="text-gray-700 mt-1 whitespace-pre-wrap">{post.description}</p>
									</div>
								)}
								{post.price && post.currency && (
									<div>
										<label className="text-sm font-medium text-gray-500">Price</label>
										<p className="text-gray-900 mt-1 font-semibold text-lg">
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
					<div className="card p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Status</h3>
							<span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(post.status)}`}>
								{post.status}
							</span>
						</div>

						<div className="space-y-4">
							{post.publishedUrl && (
								<a
									href={post.publishedUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="block w-full btn-primary text-center"
								>
									View on Platform
								</a>
							)}

							<button
								onClick={() => navigate('/posts')}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
							>
								Back to Posts
							</button>
						</div>
					</div>

					{/* Post Details */}
					<div className="card p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
						<div className="space-y-4">
							{/* Platforms */}
							<div>
								<label className="text-sm font-medium text-gray-500">Platforms</label>
								<div className="flex flex-wrap gap-2 mt-2">
									{post.platform.map((platform) => (
										<span
											key={platform}
											className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
										>
											{getPlatformName(platform)}
										</span>
									))}
								</div>
							</div>

							{/* Post Type */}
							{post.postType && (
								<div>
									<label className="text-sm font-medium text-gray-500">Post Type</label>
									<p className="text-gray-900 mt-1 capitalize">{post.postType}</p>
								</div>
							)}

							{/* Scheduled Date */}
							{post.scheduledAt && (
								<div>
									<label className="text-sm font-medium text-gray-500">Scheduled For</label>
									<p className="text-gray-900 mt-1">{formatDate(post.scheduledAt)}</p>
								</div>
							)}

							{/* Published Date */}
							{post.publishedAt && (
								<div>
									<label className="text-sm font-medium text-gray-500">Published At</label>
									<p className="text-gray-900 mt-1">{formatDate(post.publishedAt)}</p>
								</div>
							)}

							{/* Created Date */}
							<div>
								<label className="text-sm font-medium text-gray-500">Created</label>
								<p className="text-gray-900 mt-1">{formatDate(post.createdAt)}</p>
							</div>

							{/* Last Updated */}
							<div>
								<label className="text-sm font-medium text-gray-500">Last Updated</label>
								<p className="text-gray-900 mt-1">{formatDate(post.updatedAt)}</p>
							</div>
						</div>
					</div>

					{/* AI Prompt (if available) */}
					{post.aiPrompt && (
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-4">AI Prompt</h3>
							<p className="text-gray-700 text-sm whitespace-pre-wrap">{post.aiPrompt}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
