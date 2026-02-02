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
		});

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

	// Handle date click - show posts for that day
	const handleDateClick = (day: number) => {
		const clickedDate = new Date(currentYear, currentMonth, day);
		setSelectedDate(prev => {
			// Toggle off if same date clicked again
			if (prev && prev.getTime() === clickedDate.getTime()) return null;
			return clickedDate;
		});
	};

	// Posts for the selected date (when user clicks a calendar day)
	const selectedDatePosts = selectedDate ? getPostsForDate(selectedDate) : [];

	const formatSelectedDateLabel = (date: Date) => {
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
		if (date.toDateString() === tomorrow.toDateString()) return 'Demain';
		return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
	};

	return (
		<div className="w-full min-h-screen overflow-y-auto py-6 px-4 md:px-6 lg:px-8" style={{ background: '#000000' }}>
			{/* Error Message */}
			{error && (
				<div className="mb-4 p-4 rounded-xl border border-red-500/30 text-red-400" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
					<p>{error}</p>
					<button onClick={clearError} className="mt-2 text-sm underline hover:no-underline text-red-300">
						Fermer
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
				{/* Calendar */}
				<div className="lg:col-span-2">
					<div className="p-6 rounded-2xl overflow-hidden" style={{ background: '#0E0E13', border: '1px solid #FFFFFF1A' }}>
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{monthName}</h3>
							<div className="flex items-center gap-2">
								<button
									onClick={goToPreviousMonth}
									className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
								>
									<ChevronLeftIcon />
								</button>
								<button
									onClick={() => setCurrentDate(new Date())}
									className="px-3 py-1 text-sm text-white rounded-lg hover:bg-white/10 transition-colors"
								>
									Aujourd'hui
								</button>
								<button
									onClick={goToNextMonth}
									className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
								>
									<ChevronRightIcon />
								</button>
							</div>
						</div>

						{/* Calendar Grid */}
						<div className="grid grid-cols-7 gap-1">
							{['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
								<div key={day} className="p-2 text-center text-xs font-medium text-gray-400">
									{day}
								</div>
							))}
							{Array.from({ length: firstDayOfMonth }, (_, i) => (
								<div key={`empty-${i}`} className="p-2" />
							))}
							{Array.from({ length: daysInMonth }, (_, i) => {
								const day = i + 1;
								const date = new Date(currentYear, currentMonth, day);
								const dayPosts = getPostsForDate(date);
								const hasPost = dayPosts.length > 0;
								const isTodayDate = isToday(day);
								const isSelected = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
								return (
									<div
										key={day}
										onClick={() => handleDateClick(day)}
										className={`
											p-2 text-center text-sm cursor-pointer rounded-lg relative min-h-[3rem] flex flex-col items-center justify-start transition-colors
											${isTodayDate ? 'text-white font-semibold' : 'text-gray-300'}
											hover:bg-white/10
											${isSelected ? 'ring-2 ring-[#9747FF] ring-inset' : ''}
										`}
										style={isTodayDate ? { background: 'rgba(151, 71, 255, 0.2)' } : isSelected ? { background: 'rgba(151, 71, 255, 0.25)' } : undefined}
									>
										<span className={isTodayDate ? 'font-bold' : ''}>{day}</span>
										{hasPost && (
											<div className="mt-1 flex flex-wrap gap-0.5 justify-center">
												{dayPosts.slice(0, 3).map((post) => (
													<div
														key={post._id}
														className="w-1.5 h-1.5 rounded-full"
														style={{ background: '#9747FF' }}
														title={post.caption || post.productName || 'Publication planifiée'}
													/>
												))}
												{dayPosts.length > 3 && (
													<span className="text-xs text-gray-400">+{dayPosts.length - 3}</span>
												)}
											</div>
										)}
									</div>
								);
							})}
						</div>

						{/* Legend */}
						<div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-4 text-xs text-gray-400">
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full" style={{ background: '#9747FF' }} />
								<span>Publications planifiées</span>
							</div>
						</div>
					</div>
				</div>

				{/* Right panel: selected day posts OR upcoming posts */}
				<div className="flex flex-col min-h-0">
					<div className="p-6 rounded-2xl overflow-hidden flex flex-col min-h-0" style={{ background: '#0E0E13', border: '1px solid #FFFFFF1A' }}>
						{selectedDate ? (
							<>
								<div className="flex items-center justify-between gap-2 mb-4 shrink-0 flex-wrap">
									<h3 className="text-lg font-semibold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
										Publications du {formatSelectedDateLabel(selectedDate)}
									</h3>
									<button
										onClick={() => setSelectedDate(null)}
										className="text-xs text-gray-400 hover:text-white transition-colors"
									>
										Voir toutes les publications
									</button>
								</div>
								{selectedDatePosts.length === 0 ? (
									<div className="text-center py-8">
										<p className="text-gray-400 text-sm">Aucune publication ce jour-là</p>
										<button
											onClick={() => navigate('/create', { state: { scheduledDate: selectedDate.toISOString() } })}
											className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
											style={{ background: '#9747FF' }}
										>
											Planifier pour ce jour
										</button>
									</div>
								) : (
									<>
										<div className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-1 mb-4" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
											{selectedDatePosts.map((post) => (
												<div
													key={post._id}
													onClick={() => navigate(`/posts/${post._id}`)}
													className="p-3 rounded-xl transition-colors cursor-pointer border hover:opacity-90"
													style={{ background: 'rgba(151, 71, 255, 0.15)', borderColor: 'rgba(151, 71, 255, 0.4)' }}
												>
													<h4 className="font-medium text-white text-sm line-clamp-2">
														{post.productName || post.caption?.substring(0, 50) || 'Sans titre'}
													</h4>
													<p className="text-xs text-gray-400 mt-1">
														{post.scheduledAt && formatTime(post.scheduledAt)}
													</p>
													<div className="flex items-center gap-2 mt-2 flex-wrap">
														{post.platform.map((platform) => (
															<div key={platform} className="flex items-center gap-1">
																<div className="w-2 h-2 rounded-full" style={{ background: '#9747FF' }} />
																<span className="text-xs text-gray-400">{getPlatformName(platform)}</span>
															</div>
														))}
													</div>
												</div>
											))}
										</div>
										<button
											onClick={() => navigate('/create', { state: { scheduledDate: selectedDate.toISOString() } })}
											className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 shrink-0"
											style={{ background: '#9747FF' }}
										>
											Planifier une autre publication ce jour
										</button>
									</>
								)}
							</>
						) : (
							<>
								<h3 className="text-lg font-semibold text-white mb-4 shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>
									Publications à venir
								</h3>
								{isLoading && (
									<div className="flex justify-center items-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#9747FF' }} />
									</div>
								)}
								{!isLoading && upcomingPosts.length === 0 && (
									<div className="text-center py-8">
										<p className="text-gray-400 text-sm">Aucune publication à venir</p>
										<button
											onClick={() => navigate('/create')}
											className="mt-4 text-sm font-medium transition-opacity hover:opacity-90"
											style={{ color: '#9747FF' }}
										>
											Planifier une publication
										</button>
									</div>
								)}
								{!isLoading && upcomingPosts.length > 0 && (
									<div className="space-y-3 overflow-y-auto flex-1 min-h-0 pr-1" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
										{upcomingPosts.map((post) => (
											<div
												key={post._id}
												onClick={() => navigate(`/posts/${post._id}`)}
												className="p-3 rounded-xl transition-colors cursor-pointer border hover:opacity-90"
												style={{ background: 'rgba(151, 71, 255, 0.15)', borderColor: 'rgba(151, 71, 255, 0.4)' }}
											>
												<h4 className="font-medium text-white text-sm line-clamp-2">
													{post.productName || post.caption?.substring(0, 50) || 'Sans titre'}
												</h4>
												<p className="text-xs text-gray-400 mt-1">
													{post.scheduledAt && formatDate(post.scheduledAt)}
												</p>
												<div className="flex items-center gap-2 mt-2 flex-wrap">
													{post.platform.map((platform) => (
														<div key={platform} className="flex items-center gap-1">
															<div className="w-2 h-2 rounded-full" style={{ background: '#9747FF' }} />
															<span className="text-xs text-gray-400">{getPlatformName(platform)}</span>
														</div>
													))}
												</div>
											</div>
										))}
									</div>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
