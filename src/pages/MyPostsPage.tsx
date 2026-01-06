import React from 'react';
import { SectionTitle } from '../components/layout';
import { SearchIcon, EyeIcon, HeartIcon, ChatIcon } from '../components/icons';

export function MyPostsPage() {
	return (
		<div className="container-max py-6">
			<SectionTitle 
				title="My Posts" 
				subtitle="Manage and track your published content" 
			/>
			
			{/* Search and Filters */}
			<div className="mb-6">
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex-1 relative">
						<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
						<input 
							placeholder="Search posts..." 
							className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
						/>
					</div>
					<div className="flex gap-2">
						<button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium">All</button>
						<button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Instagram</button>
						<button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Facebook</button>
						<button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Twitter</button>
					</div>
				</div>
			</div>

			{/* Posts Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{[
					{ 
						title: "Summer Collection Launch", 
						platform: "Instagram", 
						date: "Dec 10, 2024", 
						likes: 124, 
						comments: 23, 
						shares: 8,
						image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
					},
					{ 
						title: "Behind the Scenes", 
						platform: "Facebook", 
						date: "Dec 8, 2024", 
						likes: 89, 
						comments: 12, 
						shares: 5,
						image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop"
					},
					{ 
						title: "Product Spotlight", 
						platform: "Twitter", 
						date: "Dec 5, 2024", 
						likes: 67, 
						comments: 8, 
						shares: 12,
						image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
					},
					{ 
						title: "Customer Testimonial", 
						platform: "Instagram", 
						date: "Dec 3, 2024", 
						likes: 156, 
						comments: 34, 
						shares: 9,
						image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=300&fit=crop"
					},
					{ 
						title: "Holiday Promotion", 
						platform: "Facebook", 
						date: "Dec 1, 2024", 
						likes: 203, 
						comments: 45, 
						shares: 18,
						image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop"
					},
					{ 
						title: "Team Introduction", 
						platform: "Twitter", 
						date: "Nov 28, 2024", 
						likes: 78, 
						comments: 15, 
						shares: 6,
						image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop"
					}
				].map((post, index) => (
					<div key={index} className="card overflow-hidden hover:shadow-lg transition-shadow">
						<div className="relative">
							<img 
								src={post.image} 
								alt={post.title}
								className="w-full h-48 object-cover"
							/>
							<div className="absolute top-3 left-3">
								<span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
									{post.platform}
								</span>
							</div>
						</div>
						<div className="p-4">
							<h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
							<p className="text-sm text-gray-500 mb-3">{post.date}</p>
							<div className="flex items-center justify-between text-sm text-gray-600">
								<div className="flex items-center gap-4">
									<div className="flex items-center gap-1">
										<HeartIcon />
										<span>{post.likes}</span>
									</div>
									<div className="flex items-center gap-1">
										<ChatIcon />
										<span>{post.comments}</span>
									</div>
									<div className="flex items-center gap-1">
										<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
										</svg>
										<span>{post.shares}</span>
									</div>
								</div>
								<button className="flex items-center gap-1 text-primary hover:text-primary/80">
									<EyeIcon />
									View
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
