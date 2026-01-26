import React from 'react';
import { LightningIcon, CheckIcon, TrendingUpIcon } from '../components/icons';

export function AutomationsPage() {
	return (
		<div className="container-max py-6">
			
			
			{/* Automation Cards */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
				{[
					{
						title: "Auto-Respond to Comments",
						description: "Automatically reply to comments with personalized messages",
						status: "Active",
						icon: <CheckIcon />,
						stats: "1,247 responses sent"
					},
					{
						title: "Post Scheduling",
						description: "Automatically publish posts at optimal times",
						status: "Active",
						icon: <LightningIcon />,
						stats: "38 posts scheduled"
					},
					{
						title: "Hashtag Optimization",
						description: "Automatically add trending hashtags to your posts",
						status: "Inactive",
						icon: <TrendingUpIcon />,
						stats: "0 posts optimized"
					},
					{
						title: "Engagement Tracking",
						description: "Monitor and report on post performance automatically",
						status: "Active",
						icon: <CheckIcon />,
						stats: "Daily reports sent"
					},
					{
						title: "Content Curation",
						description: "Automatically find and suggest relevant content",
						status: "Inactive",
						icon: <LightningIcon />,
						stats: "0 suggestions made"
					},
					{
						title: "Cross-Platform Sync",
						description: "Sync content across all your social media platforms",
						status: "Active",
						icon: <CheckIcon />,
						stats: "156 posts synced"
					}
				].map((automation, index) => (
					<div key={index} className="card p-6 hover:shadow-lg transition-shadow">
						<div className="flex items-start justify-between mb-4">
							<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
								{automation.icon}
							</div>
							<span className={`px-2 py-1 rounded-full text-xs font-medium ${
								automation.status === 'Active' 
									? 'bg-green-100 text-green-800' 
									: 'bg-gray-100 text-gray-800'
							}`}>
								{automation.status}
							</span>
						</div>
						<h3 className="font-semibold text-gray-900 mb-2">{automation.title}</h3>
						<p className="text-sm text-gray-600 mb-3">{automation.description}</p>
						<p className="text-xs text-gray-500 mb-4">{automation.stats}</p>
						<button className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
							automation.status === 'Active'
								? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								: 'bg-primary text-white hover:bg-primary/90'
						}`}>
							{automation.status === 'Active' ? 'Configure' : 'Activate'}
						</button>
					</div>
				))}
			</div>

			{/* Recent Activity */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
					<div className="space-y-4">
						{[
							{ action: "Auto-response sent", target: "Sarah Johnson", time: "2 minutes ago", type: "success" },
							{ action: "Post scheduled", target: "Holiday Sale Announcement", time: "15 minutes ago", type: "info" },
							{ action: "Hashtag optimization failed", target: "Product Spotlight", time: "1 hour ago", type: "error" },
							{ action: "Daily report generated", target: "Engagement Summary", time: "2 hours ago", type: "success" }
						].map((activity, index) => (
							<div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50">
								<div className={`w-2 h-2 rounded-full ${
									activity.type === 'success' ? 'bg-green-500' :
									activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
								}`}></div>
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-900">{activity.action}</p>
									<p className="text-xs text-gray-500">{activity.target}</p>
								</div>
								<span className="text-xs text-gray-500">{activity.time}</span>
							</div>
						))}
					</div>
				</div>

				<div className="card p-6">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">Automation Stats</h3>
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Total Automations</span>
							<span className="font-semibold text-gray-900">6</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Active Automations</span>
							<span className="font-semibold text-green-600">4</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Tasks Completed Today</span>
							<span className="font-semibold text-gray-900">47</span>
						</div>
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Time Saved</span>
							<span className="font-semibold text-primary">12.5 hours</span>
						</div>
					</div>
				</div>
			</div>

			{/* Upgrade Prompt */}
			<div className="card p-6 bg-gradient-to-r from-primary to-purple-600 text-white">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold mb-2">Unlock Advanced Automations</h3>
						<p className="text-white/90">Get access to AI-powered content generation, advanced scheduling, and custom automation workflows.</p>
					</div>
					<button className="px-6 py-3 bg-white text-primary rounded-lg font-medium hover:bg-gray-100 transition-colors">
						Upgrade Now
					</button>
				</div>
			</div>
		</div>
	);
}
