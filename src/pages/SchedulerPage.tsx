import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/icons';
import { usePostsStore } from '../stores/postsStore';
import type { Post } from '../types/api';

export function SchedulerPage() {
	const navigate = useNavigate();
	const { posts, isLoading, error, fetchPosts, clearError } = usePostsStore();
	
	// Calendar state
	const [currentDate, setCurrentDate] = useState(new Date());
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	const DISPLAY_TZ = 'Africa/Tunis';

	// Fetch all posts (we filter for scheduledAt client-side so we don't miss posts with any status)
	useEffect(() => {
		fetchPosts({ limit: 1000 }).catch((err) => {
			console.error('Failed to fetch posts:', err);
		});
	}, [fetchPosts]);

	// Get current month/year
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();
	const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric', timeZone: DISPLAY_TZ });

	// Get first day of month and number of days
	const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
	const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

	// Get date string (YYYY-MM-DD) in Tunisia timezone to avoid timezone mismatches
	const toTunisDateString = (d: Date) => d.toLocaleDateString('en-CA', { timeZone: DISPLAY_TZ });

	// Get scheduled posts for a specific date (all posts on that day, using local date)
	const getPostsForDate = (date: Date): Post[] => {
			const dateStr = toTunisDateString(date);
		return posts.filter(post => {
			if (!post.scheduledAt) return false;
			const postDateStr = toTunisDateString(new Date(post.scheduledAt));
			return postDateStr === dateStr;
		});
	};

	// Get upcoming scheduled posts for a date (only posts whose scheduled time hasn't passed yet)
	const getUpcomingPostsForDate = (date: Date): Post[] => {
		const now = new Date();
		return getPostsForDate(date).filter(post => post.scheduledAt && new Date(post.scheduledAt) > now);
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

	// Format time in Tunisia timezone: "15:00:00"
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('fr-FR', {
			timeZone: DISPLAY_TZ,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hour12: false,
		}).format(date);
	};

	// Format date in Tunisia timezone, French locale
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const timePart = formatTime(dateString);

		const dateStrUtc = date.toLocaleDateString('en-CA', { timeZone: DISPLAY_TZ });
		const todayStrUtc = today.toLocaleDateString('en-CA', { timeZone: DISPLAY_TZ });
		const tomorrowStrUtc = tomorrow.toLocaleDateString('en-CA', { timeZone: DISPLAY_TZ });

		if (dateStrUtc === todayStrUtc) return `Aujourd'hui, ${timePart}`;
		if (dateStrUtc === tomorrowStrUtc) return `Demain, ${timePart}`;
		const datePart = date.toLocaleDateString('fr-FR', {
			timeZone: DISPLAY_TZ,
			day: 'numeric',
			month: 'short'
		});
		return `${datePart}, ${timePart}`;
	};

	// Get platform display name
	const getPlatformName = (platform: string) => {
		return platform.charAt(0).toUpperCase() + platform.slice(1);
	};

	// Price with currency (e.g. "29.99 DT" or "19.99 USD")
	const getPriceWithCurrency = (post: Post) => {
		if (post.price == null || post.price === '') return null;
		const currencyLabel = post.currency === 'TND' ? 'DT' : post.currency || '';
		return `${post.price} ${currencyLabel}`.trim();
	};

	// Status badge style (dark theme)
	const getStatusStyle = (status: string) => {
		switch (status) {
			case 'posted':
				return { background: 'rgba(34, 197, 94, 0.25)', color: '#4ADE80' };
			case 'scheduled':
				return { background: 'rgba(59, 130, 246, 0.25)', color: '#60A5FA' };
			case 'draft':
				return { background: 'rgba(255, 255, 255, 0.08)', color: '#D1D5DB' };
			case 'failed':
				return { background: 'rgba(239, 68, 68, 0.25)', color: '#F87171' };
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
		<div className="w-full h-full min-h-0 flex-1 flex flex-col overflow-y-auto py-6 px-4 md:px-6 lg:px-8" style={{ background: '#000000' }}>
			{/* Error Message */}
			{error && (
				<div className="mb-4 p-4 rounded-xl border border-red-500/30 text-red-400" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
					<p>{error}</p>
					<button onClick={clearError} className="mt-2 text-sm underline hover:no-underline text-red-300">
						Fermer
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
				{/* Calendar - full width of its column */}
				<div className="lg:col-span-2 w-full min-w-0">
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
											<div className="mt-1 flex flex-wrap gap-0.5 justify-center" title={`${dayPosts.length} publication(s)`}>
												{dayPosts.slice(0, 5).map((post) => (
													<div
														key={post._id}
														className="w-2 h-2 rounded-full shrink-0"
														style={{ background: '#9747FF' }}
														title={post.caption || post.productName || 'Publication planifiée'}
													/>
												))}
												{dayPosts.length > 5 && (
													<span className="text-xs text-gray-400">+{dayPosts.length - 5}</span>
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
				<div className="flex flex-col min-h-0 w-full min-w-0 lg:min-w-[280px]">
					<div className="p-6 rounded-2xl overflow-hidden flex flex-col min-h-0 w-full" style={{ background: '#0E0E13', border: '1px solid #FFFFFF1A' }}>
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
													<div className="flex items-start justify-between gap-2">
														<h4 className="font-medium text-white text-sm line-clamp-2 flex-1 min-w-0">
															{post.productName || post.caption?.substring(0, 50) || 'Sans titre'}
														</h4>
														<span
															className="shrink-0 px-2 py-0.5 rounded-md text-xs font-medium capitalize"
															style={getStatusStyle(post.status)}
														>
															{getStatusLabel(post.status)}
														</span>
													</div>
													<p className="text-xs text-gray-400 mt-1">
														{post.scheduledAt && formatTime(post.scheduledAt)}
													</p>
													{(post.postType || getPriceWithCurrency(post)) && (
														<p className="text-xs text-gray-400 mt-0.5">
															{post.postType && <span>{post.postType}</span>}
															{post.postType && getPriceWithCurrency(post) && <span> · </span>}
															{getPriceWithCurrency(post) && <span>{getPriceWithCurrency(post)}</span>}
														</p>
													)}
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
									<div className="text-center py-8 px-2">
										<p className="text-gray-400 text-sm">Aucune publication à venir</p>
										<p className="text-gray-500 text-xs mt-1">Les posts planifiés apparaîtront ici et les points sur le calendrier.</p>
										<button
											onClick={() => navigate('/create')}
											className="mt-4 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
											style={{ background: '#9747FF' }}
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
												<div className="flex items-start justify-between gap-2">
													<h4 className="font-medium text-white text-sm line-clamp-2 flex-1 min-w-0">
														{post.productName || post.caption?.substring(0, 50) || 'Sans titre'}
													</h4>
													<span
														className="shrink-0 px-2 py-0.5 rounded-md text-xs font-medium capitalize"
														style={getStatusStyle(post.status)}
													>
														{getStatusLabel(post.status)}
													</span>
												</div>
												<p className="text-xs text-gray-400 mt-1">
													{post.scheduledAt && formatDate(post.scheduledAt)}
												</p>
												{(post.postType || getPriceWithCurrency(post)) && (
													<p className="text-xs text-gray-400 mt-0.5">
														{post.postType && <span>{post.postType}</span>}
														{post.postType && getPriceWithCurrency(post) && <span> · </span>}
														{getPriceWithCurrency(post) && <span>{getPriceWithCurrency(post)}</span>}
													</p>
												)}
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
