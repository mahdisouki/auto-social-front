import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Topbar, Sidebar } from './components/layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { 
	LoginPage,
	SignupPage,
	DashboardPage,
	CreatePostPage,
	SchedulerPage,
	MyPostsPage,
	PostDetailPage,
	ChatbotPage,
	AutomationsPage,
	SettingsPage,
	LandingPage,
	FacebookCallbackPage,
	PrivacyPolicyPage
} from './pages';
import { initializeAuth } from './stores/authStore';

function Shell() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const closeMenu = () => setIsMenuOpen(false);

	return (
		<div className="min-h-screen flex" style={{ background: '#000000' }}>
			<Sidebar isOpen={isMenuOpen} onClose={closeMenu} />
			<div className="flex-1 flex flex-col md:ml-60" style={{ background: '#000000' }}>
				<Topbar onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
				<main className="flex-1 overflow-x-hidden hide-scrollbar" style={{ overflowY: 'auto', background: '#000000' }}>
					<Routes>
						<Route path="/" element={
							<ProtectedRoute>
								<Navigate to="/dashboard" replace />
							</ProtectedRoute>
						} />
						<Route path="/dashboard" element={
							<ProtectedRoute>
								<DashboardPage />
							</ProtectedRoute>
						} />
						
						<Route path="/create" element={
							<ProtectedRoute>
								<CreatePostPage />
							</ProtectedRoute>
						} />
						<Route path="/scheduler" element={
							<ProtectedRoute>
								<SchedulerPage />
							</ProtectedRoute>
						} />
						<Route path="/posts" element={
							<ProtectedRoute>
								<MyPostsPage />
							</ProtectedRoute>
						} />
						<Route path="/posts/:id" element={
							<ProtectedRoute>
								<PostDetailPage />
							</ProtectedRoute>
						} />
						<Route path="/chatbot" element={
							<ProtectedRoute>
								<ChatbotPage />
							</ProtectedRoute>
						} />
						<Route path="/automations" element={
							<ProtectedRoute>
								<AutomationsPage />
							</ProtectedRoute>
						} />
					<Route path="/settings" element={
						<ProtectedRoute>
							<SettingsPage />
						</ProtectedRoute>
					} />
					<Route path="/privacy" element={<PrivacyPolicyPage />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}

export default function App() {
	useEffect(() => {
		// Initialize authentication state on app start
		initializeAuth();
	}, []);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/landing" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/auth/facebook/callback" element={<FacebookCallbackPage />} />
				<Route path="/auth/facebook/error" element={<FacebookCallbackPage />} />
				<Route path="/*" element={<Shell />} />
			</Routes>
		</BrowserRouter>
	);
}