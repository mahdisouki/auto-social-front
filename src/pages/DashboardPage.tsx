import React, { useEffect } from 'react';
import { SectionTitle } from '../components/layout';
import { 
	ImageIcon, 
	CalendarIcon, 
	ChatIcon, 
	TrendingUpIcon, 
	TrendingDownIcon,
	HeartIcon,
	EyeIcon,
	PaperAirplaneIcon,
	CheckIcon
} from '../components/icons';
import { usePostsStore } from '../stores/postsStore';

export function DashboardPage() {
	const { 
		posts, 
		messages, 
		stats, 
		isLoading, 
		error, 
		fetchDashboardData,
		clearError 
	} = usePostsStore();

	useEffect(() => {
		fetchDashboardData().catch((err) => {
			console.error('Failed to fetch dashboard data:', err);
		});
	}, [fetchDashboardData]);

	// Show loading state
	if (isLoading && !stats) {
		return (
			<div className="container-max py-6" style={{ background: '#000000', minHeight: '100vh' }}>
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="container-max py-6" style={{ background: '#000000', minHeight: '100vh' }}>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<p className="text-red-600">{error}</p>
					<button 
						onClick={() => {
							clearError();
							fetchDashboardData();
						}}
						className="mt-2 text-red-600 hover:text-red-800 underline"
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="container-max py-6" style={{ background: '#000000', minHeight: '100vh' }}>
			<SectionTitle 
				title="Dashboard" 
				subtitle="Welcome back! Here's what's happening with your social media." 
			/>
			
			{/* Metrics Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
				{/* Posts Generated */}
				<div className="card p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-blue-50 border border-blue-100 group">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
							<ImageIcon />
						</div>
						<div className="flex items-center gap-1 text-green-600 text-sm animate-pulse">
							<TrendingUpIcon />
							<span className="font-medium">+12.5%</span>
						</div>
					</div>
					<div className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
						{stats?.aiUsage.postsGenerated || 0}
					</div>
					<div className="text-sm text-gray-500">Posts Generated</div>
					<div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
				</div>

				{/* Scheduled Posts */}
				<div className="card p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-purple-50 border border-purple-100 group relative overflow-hidden">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
							<CalendarIcon />
						</div>
						<div className="flex items-center gap-1 text-green-600 text-sm animate-pulse">
							<TrendingUpIcon />
							<span className="font-medium">+5</span>
						</div>
					</div>
					<div className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
						{stats?.scheduledPosts || 0}
					</div>
					<div className="text-sm text-gray-500">Scheduled Posts</div>
					<div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
				</div>

				{/* Messages Today */}
				<div className="card p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-green-50 border border-green-100 group relative overflow-hidden">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
							<ChatIcon />
						</div>
						<div className="flex items-center gap-1 text-red-600 text-sm animate-pulse">
							<TrendingDownIcon />
							<span className="font-medium">-8.2%</span>
						</div>
					</div>
					<div className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">
						{stats?.todayMessages || 0}
					</div>
					<div className="text-sm text-gray-500">Messages Today</div>
					<div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
				</div>

				{/* Engagement Rate */}
				<div className="card p-6 hover:shadow-2xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-white to-pink-50 border border-pink-100 group relative overflow-hidden">
					<div className="flex items-center justify-between mb-4">
						<div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
							<svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<div className="flex items-center gap-1 text-green-600 text-sm animate-pulse">
							<TrendingUpIcon />
							<span className="font-medium">+0.8%</span>
						</div>
					</div>
					<div className="text-3xl font-bold text-gray-900 mb-1 bg-gradient-to-r from-gray-900 to-pink-600 bg-clip-text text-transparent">
						{stats?.engagementRate || 0}%
					</div>
					<div className="text-sm text-gray-500">Engagement Rate</div>
					<div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
				</div>
			</div>

			{/* Main Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
				{/* Recent Posts */}
				<div className="lg:col-span-2">
					<div className="card p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Recent Posts</h3>
							<button className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
						</div>
						<div className="space-y-4">
							{posts.length > 0 ? (
								posts.slice(0, 3).map((post) => (
									<div key={post._id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
										<div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
											<ImageIcon />
										</div>
										<div className="flex-1">
											<h4 className="font-medium text-gray-900 truncate">{post.caption.substring(0, 50)}...</h4>
											<p className="text-sm text-gray-500">
												{post.platform.join(', ')} • {new Date(post.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div className="flex items-center gap-2">
											<span className={`px-2 py-1 text-xs rounded-full ${
												post.status === 'posted' ? 'bg-green-100 text-green-800' :
												post.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
												post.status === 'draft' ? 'bg-gray-100 text-gray-800' :
												'bg-red-100 text-red-800'
											}`}>
												{post.status}
											</span>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8 text-gray-500">
									<ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
									<p>No posts yet</p>
									<p className="text-sm">Create your first post to get started</p>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Recent Messages */}
				<div>
					<div className="card p-6">
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
							<button className="text-primary hover:text-primary/80 text-sm font-medium">View All</button>
						</div>
						<div className="space-y-4">
							{messages.length > 0 ? (
								messages.slice(0, 3).map((message) => (
									<div key={message._id} className={`p-3 rounded-lg ${message.sender === 'client' ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'} transition-colors`}>
										<div className="flex items-start gap-3">
											<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
												<span className="text-xs font-medium text-gray-600">
													{message.sender === 'client' ? '👤' : '🤖'}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<h4 className="font-medium text-gray-900 text-sm">
														{message.sender === 'client' ? 'Customer' : 'AI Assistant'}
													</h4>
													{message.sender === 'client' && <div className="w-2 h-2 bg-primary rounded-full"></div>}
												</div>
												<p className="text-sm text-gray-600 truncate">{message.content}</p>
												<p className="text-xs text-gray-500">
													{new Date(message.timestamp).toLocaleTimeString()}
												</p>
											</div>
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8 text-gray-500">
									<ChatIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
									<p>No messages yet</p>
									<p className="text-sm">Customer messages will appear here</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* AI Usage Stats */}
			<div className="mt-6">
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">AI Usage This Month</h3>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="text-center">
							<div className="text-2xl font-bold text-primary mb-1">
								{stats?.aiUsage.postsGenerated || 0}
							</div>
							<div className="text-sm text-gray-500">Posts Generated</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary mb-1">
								{stats?.aiUsage.messagesResponded || 0}
							</div>
							<div className="text-sm text-gray-500">Messages Responded</div>
						</div>
						<div className="text-center">
							<div className="text-2xl font-bold text-primary mb-1">
								{stats?.aiUsage.accuracyRate || 0}%
							</div>
							<div className="text-sm text-gray-500">Accuracy Rate</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
