import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout';
import { MenuIcon } from './components/icons';
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
	PrivacyPolicyPage,
	TermsPage
} from './pages';
import { initializeAuth } from './stores/authStore';

function Shell() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
	const closeMenu = () => setIsMenuOpen(false);

	return (
		<div className="h-screen min-h-screen flex overflow-hidden" style={{ background: '#000000' }}>
			<Sidebar isOpen={isMenuOpen} onClose={closeMenu} onMenuToggle={toggleMenu} />
			<div className="flex-1 flex flex-col min-h-0 md:ml-60 relative overflow-hidden" style={{ background: '#000000' }}>
				{/* Mobile menu button - visible when sidebar is closed */}
				<button
					type="button"
					onClick={toggleMenu}
					className="fixed top-4 left-4 z-30 p-2 rounded-lg md:hidden text-white hover:bg-white/10 transition-colors"
					style={{ background: 'rgba(15, 15, 19, 0.9)', border: '1px solid rgba(255,255,255,0.1)' }}
					aria-label="Open menu"
				>
					<MenuIcon />
				</button>
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
				</Routes>
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
				<Route path="/" element={<LandingPage />} />
				<Route path="/landing" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/auth/facebook/callback" element={<FacebookCallbackPage />} />
				<Route path="/auth/facebook/error" element={<FacebookCallbackPage />} />
				<Route path="/privacy" element={<PrivacyPolicyPage />} />
				<Route path="/terms" element={<TermsPage />} />
				{/* Single selector: all app routes (dashboard, create, posts, etc.) render Shell */}
				<Route path="*" element={<Shell />} />
			</Routes>
		</BrowserRouter>
	);
}