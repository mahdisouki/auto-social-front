import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionTitle } from '../components/layout';
import { PersonIcon, KeyIcon, CreditCardIcon, ShieldIcon, ToggleOnIcon, ToggleOffIcon, FacebookIcon } from '../components/icons';
import { useAuthStore } from '../stores/authStore';
import { useMetaStore } from '../stores/metaStore';

export function SettingsPage() {
	const { user, updateProfile, changePassword, isLoading, error, clearError } = useAuthStore();
	const { pages, isLoading: metaLoading, error: metaError, fetchPages, refreshPages, disconnectPage, initiateOAuth, clearError: clearMetaError } = useMetaStore();
	const [searchParams, setSearchParams] = useSearchParams();
	const [activeTab, setActiveTab] = useState('account');
	const [notifications, setNotifications] = useState({
		email: true,
		push: false,
		sms: true
	});
	
	// Profile form state
	const [profileForm, setProfileForm] = useState({
		name: '',
		email: '',
	});
	
	// Password form state
	const [passwordForm, setPasswordForm] = useState({
		currentPassword: '',
		newPassword: '',
		confirmPassword: '',
	});
	
	// Initialize form with user data
	useEffect(() => {
		if (user) {
			setProfileForm({
				name: user.name || '',
				email: user.email || '',
			});
		}
	}, [user]);

	// Check URL params for tab and error
	useEffect(() => {
		const tabParam = searchParams.get('tab');
		const errorParam = searchParams.get('error');
		if (tabParam) {
			setActiveTab(tabParam);
		}
		if (errorParam && tabParam === 'facebook') {
			// Error will be shown in the Facebook tab
		}
	}, [searchParams]);

	// Fetch Facebook pages when Facebook tab is active
	useEffect(() => {
		if (activeTab === 'facebook') {
			fetchPages();
		}
	}, [activeTab, fetchPages]);
	
	const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setProfileForm(prev => ({
			...prev,
			[name]: value,
		}));
		if (error) clearError();
	};
	
	const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setPasswordForm(prev => ({
			...prev,
			[name]: value,
		}));
		if (error) clearError();
	};
	
	const handleProfileUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			await updateProfile({
				name: profileForm.name,
				email: profileForm.email,
			});
			alert('Profile updated successfully!');
		} catch (err) {
			console.error('Profile update failed:', err);
		}
	};
	
	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (passwordForm.newPassword !== passwordForm.confirmPassword) {
			alert('New passwords do not match');
			return;
		}
		
		if (passwordForm.newPassword.length < 6) {
			alert('New password must be at least 6 characters long');
			return;
		}
		
		try {
			await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
			alert('Password changed successfully!');
			setPasswordForm({
				currentPassword: '',
				newPassword: '',
				confirmPassword: '',
			});
		} catch (err) {
			console.error('Password change failed:', err);
		}
	};

	const tabs = [
		{ id: 'account', label: 'Account', icon: PersonIcon },
		{ id: 'facebook', label: 'Facebook', icon: FacebookIcon },
		{ id: 'api', label: 'API Keys', icon: KeyIcon },
		{ id: 'notifications', label: 'Notifications', icon: ShieldIcon },
		{ id: 'billing', label: 'Billing', icon: CreditCardIcon }
	];

	const handleConnectFacebook = async () => {
		try {
			await initiateOAuth();
		} catch (err: any) {
			alert(err.message || 'Failed to initiate Facebook connection');
		}
	};

	const handleRefreshPages = async () => {
		try {
			await refreshPages();
			alert('Pages refreshed successfully!');
		} catch (err: any) {
			alert(err.message || 'Failed to refresh pages');
		}
	};

	const handleDisconnectPage = async (pageId: string, pageName: string) => {
		if (!confirm(`Are you sure you want to disconnect "${pageName}"?`)) {
			return;
		}
		try {
			await disconnectPage(pageId);
			alert('Page disconnected successfully!');
		} catch (err: any) {
			alert(err.message || 'Failed to disconnect page');
		}
	};

	return (
		<div className="container-max py-6">
			<SectionTitle 
				title="Settings" 
				subtitle="Manage your account preferences and configuration" 
			/>
			
			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				{/* Settings Navigation */}
				<div className="lg:col-span-1">
					<div className="card p-4">
						<nav className="space-y-1">
							{tabs.map(tab => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
										activeTab === tab.id
											? 'bg-primary text-white'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
									}`}
								>
									<tab.icon />
									{tab.label}
								</button>
							))}
						</nav>
					</div>
				</div>

				{/* Settings Content */}
				<div className="lg:col-span-3">
					{activeTab === 'account' && (
						<div className="space-y-6">
							{/* Error Message */}
							{error && (
								<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-600">{error}</p>
								</div>
							)}
							
							{/* Profile Information */}
							<div className="card p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
								<form onSubmit={handleProfileUpdate}>
									<div className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
											<input 
												type="text" 
												name="name"
												value={profileForm.name}
												onChange={handleProfileInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
											<input 
												type="email" 
												name="email"
												value={profileForm.email}
												onChange={handleProfileInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
												required
											/>
										</div>
										<div className="flex items-center gap-4">
											<button 
												type="submit"
												disabled={isLoading}
												className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{isLoading ? 'Saving...' : 'Save Changes'}
											</button>
											<button 
												type="button"
												onClick={() => {
													if (user) {
														setProfileForm({
															name: user.name || '',
															email: user.email || '',
														});
													}
												}}
												className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
											>
												Cancel
											</button>
										</div>
									</div>
								</form>
							</div>
							
							{/* Change Password */}
							<div className="card p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
								<form onSubmit={handlePasswordChange}>
									<div className="space-y-6">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
											<input 
												type="password" 
												name="currentPassword"
												value={passwordForm.currentPassword}
												onChange={handlePasswordInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
											<input 
												type="password" 
												name="newPassword"
												value={passwordForm.newPassword}
												onChange={handlePasswordInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
												required
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
											<input 
												type="password" 
												name="confirmPassword"
												value={passwordForm.confirmPassword}
												onChange={handlePasswordInputChange}
												className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" 
												required
											/>
										</div>
										<div className="flex items-center gap-4">
											<button 
												type="submit"
												disabled={isLoading}
												className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
											>
												{isLoading ? 'Changing...' : 'Change Password'}
											</button>
											<button 
												type="button"
												onClick={() => setPasswordForm({
													currentPassword: '',
													newPassword: '',
													confirmPassword: '',
												})}
												className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
											>
												Cancel
											</button>
										</div>
									</div>
								</form>
							</div>
							
							{/* Account Information */}
							<div className="card p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
								<div className="space-y-4">
									<div className="flex items-center justify-between py-2">
										<div>
											<p className="font-medium text-gray-900">Account Type</p>
											<p className="text-sm text-gray-600 capitalize">{user?.role || 'User'}</p>
										</div>
										<span className={`px-3 py-1 rounded-full text-sm font-medium ${
											user?.plan === 'pro' 
												? 'bg-primary text-white' 
												: 'bg-gray-100 text-gray-800'
										}`}>
											{user?.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
										</span>
									</div>
									<div className="flex items-center justify-between py-2">
										<div>
											<p className="font-medium text-gray-900">Member Since</p>
											<p className="text-sm text-gray-600">
												{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
											</p>
										</div>
									</div>
									<div className="flex items-center justify-between py-2">
										<div>
											<p className="font-medium text-gray-900">User ID</p>
											<p className="text-sm text-gray-600 font-mono">{user?._id || 'N/A'}</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'facebook' && (
						<div className="space-y-6">
							{/* Error Message */}
							{(metaError || searchParams.get('error')) && (
								<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
									<p className="text-sm text-red-600">{metaError || searchParams.get('error')}</p>
									<button
										onClick={() => {
											clearMetaError();
											setSearchParams({});
										}}
										className="mt-2 text-sm text-red-700 underline"
									>
										Dismiss
									</button>
								</div>
							)}

							{/* Connect Facebook Section */}
							<div className="card p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">Connect Facebook</h3>
								<p className="text-sm text-gray-600 mb-4">
									Connect your Facebook Pages to post directly to Facebook and Instagram.
								</p>
								<button
									onClick={handleConnectFacebook}
									disabled={metaLoading}
									className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
								>
									<FacebookIcon />
									{metaLoading ? 'Connecting...' : 'Connect Facebook Pages'}
								</button>
							</div>

							{/* Connected Pages */}
							<div className="card p-6">
								<div className="flex items-center justify-between mb-4">
									<h3 className="text-lg font-semibold text-gray-900">Connected Pages</h3>
									<button
										onClick={handleRefreshPages}
										disabled={metaLoading}
										className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
									>
										Refresh
									</button>
								</div>

								{metaLoading && pages.length === 0 ? (
									<div className="flex justify-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
									</div>
								) : pages.length === 0 ? (
									<div className="text-center py-8">
										<p className="text-gray-600 mb-4">No Facebook Pages connected yet.</p>
										<p className="text-sm text-gray-500">Click "Connect Facebook Pages" to get started.</p>
									</div>
								) : (
									<div className="space-y-4">
										{pages.map((page) => (
											<div key={page.pageId} className="p-4 border border-gray-200 rounded-lg">
												<div className="flex items-start justify-between">
													<div className="flex-1">
														<div className="flex items-center gap-3 mb-2">
															<h4 className="font-medium text-gray-900">{page.pageName}</h4>
															<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
																Connected
															</span>
														</div>
														<div className="space-y-1 text-sm text-gray-600">
															<p>Page ID: <span className="font-mono">{page.pageId}</span></p>
															<p>Category: {page.category}</p>
															{page.hasInstagram && page.instagramUsername && (
																<p className="text-primary">
																	Instagram: @{page.instagramUsername}
																</p>
															)}
															<p>Connected: {new Date(page.connectedAt).toLocaleDateString()}</p>
														</div>
													</div>
													<button
														onClick={() => handleDisconnectPage(page.pageId, page.pageName)}
														disabled={metaLoading}
														className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 disabled:opacity-50 ml-4"
													>
														Disconnect
													</button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					)}

					{activeTab === 'api' && (
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-6">API Keys</h3>
							<div className="space-y-6">
								<div className="p-4 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-medium text-gray-900">Instagram API</h4>
										<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Connected</span>
									</div>
									<p className="text-sm text-gray-600 mb-3">Connected to Instagram Business Account</p>
									<div className="flex gap-2">
										<button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Regenerate</button>
										<button className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200">Disconnect</button>
									</div>
								</div>
								<div className="p-4 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-medium text-gray-900">Facebook API</h4>
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${
											pages.length > 0
												? 'bg-green-100 text-green-800'
												: 'bg-gray-100 text-gray-800'
										}`}>
											{pages.length > 0 ? `${pages.length} Page(s) Connected` : 'Not Connected'}
										</span>
									</div>
									<p className="text-sm text-gray-600 mb-3">
										{pages.length > 0 
											? `Connected to ${pages.length} Facebook Page(s)`
											: 'Connect your Facebook Pages to enable posting'
										}
									</p>
									<div className="flex gap-2">
										<button
											onClick={() => setActiveTab('facebook')}
											className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
										>
											{pages.length > 0 ? 'Manage Pages' : 'Connect Facebook'}
										</button>
									</div>
								</div>
								<div className="p-4 bg-gray-50 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-medium text-gray-900">Twitter API</h4>
										<span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Not Connected</span>
									</div>
									<p className="text-sm text-gray-600 mb-3">Connect your Twitter account to enable posting</p>
									<button className="px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">Connect</button>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'notifications' && (
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
							<div className="space-y-6">
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium text-gray-900">Email Notifications</h4>
										<p className="text-sm text-gray-600">Receive notifications via email</p>
									</div>
									<button 
										onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
										className="text-2xl"
									>
										{notifications.email ? <ToggleOnIcon /> : <ToggleOffIcon />}
									</button>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium text-gray-900">Push Notifications</h4>
										<p className="text-sm text-gray-600">Receive push notifications in browser</p>
									</div>
									<button 
										onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
										className="text-2xl"
									>
										{notifications.push ? <ToggleOnIcon /> : <ToggleOffIcon />}
									</button>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<h4 className="font-medium text-gray-900">SMS Notifications</h4>
										<p className="text-sm text-gray-600">Receive notifications via SMS</p>
									</div>
									<button 
										onClick={() => setNotifications(prev => ({ ...prev, sms: !prev.sms }))}
										className="text-2xl"
									>
										{notifications.sms ? <ToggleOnIcon /> : <ToggleOffIcon />}
									</button>
								</div>
								<div className="pt-4 border-t border-gray-200">
									<h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
									<div className="space-y-3">
										<label className="flex items-center">
											<input type="checkbox" defaultChecked className="mr-3" />
											<span className="text-sm text-gray-700">New comments and mentions</span>
										</label>
										<label className="flex items-center">
											<input type="checkbox" defaultChecked className="mr-3" />
											<span className="text-sm text-gray-700">Post performance updates</span>
										</label>
										<label className="flex items-center">
											<input type="checkbox" className="mr-3" />
											<span className="text-sm text-gray-700">Weekly analytics reports</span>
										</label>
										<label className="flex items-center">
											<input type="checkbox" defaultChecked className="mr-3" />
											<span className="text-sm text-gray-700">System maintenance alerts</span>
										</label>
									</div>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'billing' && (
						<div className="card p-6">
							<h3 className="text-lg font-semibold text-gray-900 mb-6">Billing & Subscription</h3>
							<div className="space-y-6">
								<div className="p-4 bg-primary/5 rounded-lg">
									<div className="flex items-center justify-between mb-2">
										<h4 className="font-medium text-gray-900">Current Plan</h4>
										<span className={`px-2 py-1 rounded-full text-xs font-medium ${
											user?.plan === 'pro' 
												? 'bg-primary text-white' 
												: 'bg-gray-100 text-gray-800'
										}`}>
											{user?.plan === 'pro' ? 'Pro' : 'Free'}
										</span>
									</div>
									<p className="text-sm text-gray-600 mb-3">
										{user?.plan === 'pro' ? '$29/month • Billed monthly' : 'Free plan with limited features'}
									</p>
									<button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
										{user?.plan === 'pro' ? 'Change Plan' : 'Upgrade to Pro'}
									</button>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
									<div className="p-4 border border-gray-200 rounded-lg">
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
												<CreditCardIcon />
											</div>
											<div>
												<p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
												<p className="text-sm text-gray-600">Expires 12/25</p>
											</div>
											<button className="ml-auto px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">Update</button>
										</div>
									</div>
								</div>
								<div>
									<h4 className="font-medium text-gray-900 mb-3">Billing History</h4>
									<div className="space-y-2">
										{[
											{ date: "Dec 15, 2024", amount: "$29.00", status: "Paid" },
											{ date: "Nov 15, 2024", amount: "$29.00", status: "Paid" },
											{ date: "Oct 15, 2024", amount: "$29.00", status: "Paid" }
										].map((invoice, index) => (
											<div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
												<div>
													<p className="font-medium text-gray-900">{invoice.date}</p>
													<p className="text-sm text-gray-600">{invoice.amount}</p>
												</div>
												<div className="flex items-center gap-2">
													<span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{invoice.status}</span>
													<button className="text-primary hover:text-primary/80 text-sm">Download</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
