import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon, ListIcon } from '../components/icons';
import { usePostsStore } from '../stores/postsStore';
import type { Post } from '../types/api';

export function SchedulerPage() {
	const navigate = useNavigate();
	const { posts, isLoading, error, fetchPosts, schedulePost, clearError } = usePostsStore();
	
	// Calendar state
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

	// Fetch scheduled posts
	useEffect(() => {
		fetchPosts({ 
			status: 'scheduled',
			limit: 1000 // Get all scheduled posts for the calendar
		}).catch((err) => {
			console.error('Failed to fetch scheduled posts:', err);
		});
	}, [fetchPosts]);

	// Get current month/year
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();
	const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

	// Get first day of month and number of days
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	// Get scheduled posts for a specific date
	const getPostsForDate = (date: Date): Post[] => {
		const dateStr = date.toISOString().split('T')[0];
		return posts.filter(post => {
			if (!post.scheduledAt) return false;
			const postDate = new Date(post.scheduledAt).toISOString().split('T')[0];
			return postDate === dateStr;
		});
	};

	// Get all scheduled posts (upcoming)
	const upcomingPosts = posts
		.filter(post => post.scheduledAt && new Date(post.scheduledAt) >= new Date())
		.sort((a, b) => {
			const dateA = new Date(a.scheduledAt || 0);
			const dateB = new Date(b.scheduledAt || 0);
			return dateA.getTime() - dateB.getTime();
		})
		.slice(0, 10); // Show next 10 upcoming posts

	// Navigate months
	const goToPreviousMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
	};

	const goToNextMonth = () => {
		setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
	};

	// Check if date is today
	const isToday = (day: number) => {
		const today = new Date();
		return (
			day === today.getDate() &&
			currentMonth === today.getMonth() &&
			currentYear === today.getFullYear()
		);
	};

	// Format time helper
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', { 
			hour: 'numeric', 
			minute: '2-digit',
			hour12: true 
		});
	};

	// Format date helper
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return `Today, ${formatTime(dateString)}`;
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return `Tomorrow, ${formatTime(dateString)}`;
		} else {
			return date.toLocaleDateString('en-US', {
				month: 'short',
				day: 'numeric',
				hour: 'numeric',
				minute: '2-digit',
				hour12: true
			});
		}
	};

	// Get platform display name
	const getPlatformName = (platform: string) => {
		return platform.charAt(0).toUpperCase() + platform.slice(1);
	};

	// Handle date click
	const handleDateClick = (day: number) => {
		const clickedDate = new Date(currentYear, currentMonth, day);
		setSelectedDate(clickedDate);
		// Navigate to create post page with pre-filled date
		navigate('/create-post', {
			state: { scheduledDate: clickedDate.toISOString() }
		});
	};

	return (
		<div className="container-max py-6">
			

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

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Calendar */}
				<div className="lg:col-span-2">
					<div className="card p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-gray-900">{monthName}</h3>
							<div className="flex items-center gap-2">
								<button 
									onClick={goToPreviousMonth}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<ChevronLeftIcon />
								</button>
								<button 
									onClick={() => setCurrentDate(new Date())}
									className="px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
								>
									Today
								</button>
								<button 
									onClick={goToNextMonth}
									className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
								>
									<ChevronRightIcon />
								</button>
							</div>
						</div>
						
						{/* Calendar Grid */}
						<div className="grid grid-cols-7 gap-1">
							{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
								<div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
									{day}
								</div>
							))}
							
							{/* Empty cells for days before month starts */}
							{Array.from({ length: firstDayOfMonth }, (_, i) => (
								<div key={`empty-${i}`} className="p-2"></div>
							))}
							
							{/* Calendar Days */}
							{Array.from({ length: daysInMonth }, (_, i) => {
								const day = i + 1;
								const date = new Date(currentYear, currentMonth, day);
								const dayPosts = getPostsForDate(date);
								const hasPost = dayPosts.length > 0;
								const isTodayDate = isToday(day);
								
								return (
									<div 
										key={day} 
										onClick={() => handleDateClick(day)}
										className={`
											p-2 text-center text-sm cursor-pointer hover:bg-gray-100 rounded-lg relative min-h-[3rem] flex flex-col items-center justify-start
											${isTodayDate ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-900'}
										`}
									>
										<span className={isTodayDate ? 'font-bold' : ''}>{day}</span>
										{hasPost && (
											<div className="mt-1 flex flex-wrap gap-0.5 justify-center">
												{dayPosts.slice(0, 3).map((post, idx) => (
													<div 
														key={post._id}
														className={`w-1.5 h-1.5 rounded-full ${
															isTodayDate ? 'bg-primary' : 'bg-primary'
														}`}
														title={post.caption || post.productName || 'Scheduled post'}
													/>
												))}
												{dayPosts.length > 3 && (
													<span className="text-xs text-gray-500">+{dayPosts.length - 3}</span>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>

						{/* Legend */}
						<div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4 text-xs text-gray-600">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 bg-primary rounded-full"></div>
								<span>Scheduled posts</span>
							</div>
						</div>
					</div>
				</div>

				{/* Upcoming Posts */}
				<div>
					<div className="card p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Posts</h3>
						
						{isLoading && (
							<div className="flex justify-center items-center py-8">
								<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
							</div>
						)}

						{!isLoading && upcomingPosts.length === 0 && (
							<div className="text-center py-8">
								<p className="text-gray-500 text-sm">No upcoming posts</p>
								<button
									onClick={() => navigate('/create-post')}
									className="mt-4 text-primary hover:underline text-sm"
								>
									Schedule your first post
								</button>
							</div>
						)}

						{!isLoading && upcomingPosts.length > 0 && (
							<div className="space-y-4">
								{upcomingPosts.map((post) => (
									<div 
										key={post._id} 
										onClick={() => navigate(`/posts/${post._id}`)}
										className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
									>
										<h4 className="font-medium text-gray-900 text-sm line-clamp-2">
											{post.productName || post.caption?.substring(0, 50) || 'Untitled Post'}
										</h4>
										<p className="text-xs text-gray-500 mt-1">
											{post.scheduledAt && formatDate(post.scheduledAt)}
										</p>
										<div className="flex items-center gap-2 mt-2 flex-wrap">
											{post.platform.map((platform) => (
												<div key={platform} className="flex items-center gap-1">
													<div className="w-2 h-2 bg-primary rounded-full"></div>
													<span className="text-xs text-gray-600">{getPlatformName(platform)}</span>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
