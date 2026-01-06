import React from 'react';
import { SectionTitle } from '../components/layout';
import { PaperAirplaneIcon, CheckIcon, InstagramIcon, FacebookIcon, TwitterIcon } from '../components/icons';

export function ChatbotPage() {
	return (
		<div className="container-max py-6">
			<SectionTitle 
				title="AI Chatbot" 
				subtitle="Manage automated responses and customer interactions" 
			/>
			
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Conversation List */}
				<div className="lg:col-span-1">
					<div className="card p-4">
						<h3 className="font-semibold text-gray-900 mb-4">Recent Conversations</h3>
						<div className="space-y-3">
							{[
								{ name: "Sarah Johnson", platform: "Instagram", time: "2 min ago", unread: 2, active: true },
								{ name: "Mike Chen", platform: "Facebook", time: "15 min ago", unread: 0, active: false },
								{ name: "Emma Wilson", platform: "Twitter", time: "1 hour ago", unread: 1, active: false },
								{ name: "Alex Rodriguez", platform: "Instagram", time: "2 hours ago", unread: 0, active: false }
							].map((conversation, index) => (
								<div 
									key={index} 
									className={`p-3 rounded-lg cursor-pointer transition-colors ${
										conversation.active ? 'bg-primary text-white' : 'hover:bg-gray-50'
									}`}
								>
									<div className="flex items-center justify-between mb-1">
										<h4 className="font-medium text-sm">{conversation.name}</h4>
										{conversation.unread > 0 && (
											<span className={`text-xs px-2 py-1 rounded-full ${
												conversation.active ? 'bg-white/20 text-white' : 'bg-primary text-white'
											}`}>
												{conversation.unread}
											</span>
										)}
									</div>
									<div className="flex items-center gap-2">
										{conversation.platform === 'Instagram' && <InstagramIcon />}
										{conversation.platform === 'Facebook' && <FacebookIcon />}
										{conversation.platform === 'Twitter' && <TwitterIcon />}
										<span className={`text-xs ${conversation.active ? 'text-white/80' : 'text-gray-500'}`}>
											{conversation.time}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Chat Interface */}
				<div className="lg:col-span-3">
					<div className="card p-6 h-[600px] flex flex-col">
						{/* Chat Header */}
						<div className="flex items-center gap-3 pb-4 border-b border-gray-200 mb-4">
							<div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
								<span className="text-sm font-medium text-gray-600">SJ</span>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900">Sarah Johnson</h3>
								<p className="text-sm text-gray-500">Instagram • Online</p>
							</div>
						</div>

						{/* Messages */}
						<div className="flex-1 overflow-y-auto space-y-4 mb-4">
							{/* Customer Message */}
							<div className="flex gap-3">
								<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
									<span className="text-xs font-medium text-gray-600">SJ</span>
								</div>
								<div className="flex-1">
									<div className="bg-gray-100 rounded-lg p-3 max-w-md">
										<p className="text-sm text-gray-900">Hi! I'm interested in your new collection. Can you tell me more about the pricing?</p>
									</div>
									<p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
								</div>
							</div>

							{/* AI Response */}
							<div className="flex gap-3 justify-end">
								<div className="flex-1 flex justify-end">
									<div className="bg-primary text-white rounded-lg p-3 max-w-md">
										<p className="text-sm">Hello Sarah! Thank you for your interest in our new collection. Our prices range from $29.99 to $149.99 depending on the item. Would you like me to show you some specific products?</p>
									</div>
								</div>
								<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
									<span className="text-xs font-medium text-white">AI</span>
								</div>
							</div>

							{/* Customer Message */}
							<div className="flex gap-3">
								<div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
									<span className="text-xs font-medium text-gray-600">SJ</span>
								</div>
								<div className="flex-1">
									<div className="bg-gray-100 rounded-lg p-3 max-w-md">
										<p className="text-sm text-gray-900">Yes, I'd love to see the summer dresses!</p>
									</div>
									<p className="text-xs text-gray-500 mt-1">1 minute ago</p>
								</div>
							</div>
						</div>

						{/* AI Suggested Responses */}
						<div className="mb-4">
							<p className="text-sm text-gray-600 mb-2">AI Suggested Responses:</p>
							<div className="flex flex-wrap gap-2">
								{[
									"Here are our summer dresses: [link]",
									"Our summer collection features lightweight fabrics perfect for warm weather",
									"Would you like to see dresses in a specific size or color?"
								].map((suggestion, index) => (
									<button 
										key={index}
										className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
									>
										{suggestion}
									</button>
								))}
							</div>
						</div>

						{/* Message Input */}
						<div className="flex gap-3">
							<input 
								type="text" 
								placeholder="Type your message..." 
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
							/>
							<button className="btn-primary flex items-center gap-2">
								<PaperAirplaneIcon />
								Send
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
