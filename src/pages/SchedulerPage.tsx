import React from 'react';
import { SectionTitle } from '../components/layout';
import { ChevronLeftIcon, ChevronRightIcon, ListIcon } from '../components/icons';

export function SchedulerPage() {
	return (
		<div className="container-max py-6">
			<SectionTitle 
				title="Content Scheduler" 
				subtitle="Plan and schedule your social media posts" 
				cta={
					<div className="flex gap-2">
						<button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
							<ListIcon />
						</button>
						<button className="btn-primary">New Schedule</button>
					</div>
				}
			/>
			
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Calendar */}
				<div className="lg:col-span-2">
					<div className="card p-6">
						<div className="flex items-center justify-between mb-6">
							<h3 className="text-lg font-semibold text-gray-900">December 2024</h3>
							<div className="flex items-center gap-2">
								<button className="p-2 hover:bg-gray-100 rounded-lg">
									<ChevronLeftIcon />
								</button>
								<button className="p-2 hover:bg-gray-100 rounded-lg">
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
							
							{/* Calendar Days */}
							{Array.from({ length: 31 }, (_, i) => {
								const day = i + 1;
								const hasPost = [3, 7, 12, 15, 18, 22, 25, 28].includes(day);
								const isToday = day === 15;
								
								return (
									<div 
										key={day} 
										className={`
											p-2 text-center text-sm cursor-pointer hover:bg-gray-100 rounded-lg relative
											${isToday ? 'bg-primary text-white' : 'text-gray-900'}
										`}
									>
										{day}
										{hasPost && (
											<div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${isToday ? 'bg-white' : 'bg-primary'}`}></div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Upcoming Posts */}
				<div>
					<div className="card p-6">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Posts</h3>
						<div className="space-y-4">
							{[
								{ title: "Holiday Sale Announcement", time: "Today, 2:00 PM", platform: "Instagram" },
								{ title: "Product Feature", time: "Tomorrow, 10:00 AM", platform: "Facebook" },
								{ title: "Behind the Scenes", time: "Dec 18, 3:00 PM", platform: "Twitter" },
								{ title: "Customer Testimonial", time: "Dec 20, 1:00 PM", platform: "Instagram" }
							].map((post, index) => (
								<div key={index} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
									<h4 className="font-medium text-gray-900 text-sm">{post.title}</h4>
									<p className="text-xs text-gray-500 mt-1">{post.time}</p>
									<div className="flex items-center gap-2 mt-2">
										<div className="w-2 h-2 bg-primary rounded-full"></div>
										<span className="text-xs text-gray-600">{post.platform}</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
