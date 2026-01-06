import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleIcon } from '../components/icons';
import { useAuthStore } from '../stores/authStore';

export function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, register, isLoading, error, clearError } = useAuthStore();
	
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [isSignUp, setIsSignUp] = useState(false);
	
	const from = location.state?.from?.pathname || '/';
	
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
		// Clear error when user starts typing
		if (error) clearError();
	};
	
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		
		try {
			if (isSignUp) {
				// Validate registration form
				if (!formData.name.trim()) {
					alert('Please enter your name');
					return;
				}
				if (formData.password !== formData.confirmPassword) {
					alert('Passwords do not match');
					return;
				}
				if (formData.password.length < 6) {
					alert('Password must be at least 6 characters long');
					return;
				}
				
				await register(formData.name, formData.email, formData.password);
			} else {
				await login(formData.email, formData.password);
			}
			
			// Redirect to the page they were trying to access, or dashboard
			navigate(from, { replace: true });
		} catch (err) {
			// Error is handled by the store
			console.error(isSignUp ? 'Registration failed:' : 'Login failed:', err);
		}
	};
	
	const handleGoogleLogin = () => {
		// TODO: Implement Google OAuth
		console.log('Google login clicked');
	};

	return (
		<div className="min-h-screen flex relative overflow-hidden">
			{/* Animated background particles */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5">
				<div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-ping"></div>
				<div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
				<div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
				<div className="absolute top-60 right-20 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
			</div>

			{/* Left Column - Promotional Panel */}
			<div className="hidden lg:flex lg:w-2/3 bg-gradient-to-br from-primary to-blue-600 rounded-r-3xl relative overflow-hidden">
				{/* Animated gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
				
				<div className="flex flex-col justify-center px-12 py-16 text-white relative z-10">
					<h1 className="text-4xl font-bold mb-6 animate-fade-in-up">
						Welcome to <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">AutoSocial</span>
					</h1>
					<p className="text-xl mb-8 opacity-90 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
						Automate your social media workflow with AI-powered content generation, smart scheduling, and intelligent chat responses.
					</p>
					
					{/* Visual Asset Placeholder */}
					<div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
						<div className="w-full h-64 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105">
							<div className="text-center">
								<div className="text-6xl mb-4 animate-bounce">📚</div>
								<p className="text-lg opacity-75">Creative workspace</p>
							</div>
						</div>
					</div>
					
					{/* Statistics */}
					<div className="grid grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
						<div className="text-center group">
							<div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">10k+</div>
							<div className="text-sm opacity-75">Posts Generated</div>
						</div>
						<div className="text-center group">
							<div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">500+</div>
							<div className="text-sm opacity-75">Active Users</div>
						</div>
						<div className="text-center group">
							<div className="text-3xl font-bold group-hover:scale-110 transition-transform duration-300">99%</div>
							<div className="text-sm opacity-75">Satisfaction</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right Column - Login Form */}
			<div className="w-full lg:w-1/3 flex items-center justify-center px-8 py-16 relative z-10">
				<div className="w-full max-w-sm animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
					<h2 className="text-3xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-gray-900 to-primary bg-clip-text text-transparent">
						{isSignUp ? 'Create Account' : 'Welcome Back'}
					</h2>
					<p className="text-gray-600 mb-8">
						{isSignUp ? 'Sign up to get started with AutoSocial' : 'Sign in to continue to AutoSocial'}
					</p>
					
					{/* Continue with Google Button */}
					<button 
						type="button"
						onClick={handleGoogleLogin}
						className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 mb-6 hover:scale-105 hover:shadow-lg group"
					>
						<GoogleIcon />
						<span className="text-gray-700 font-medium group-hover:text-gray-900">Continue with Google</span>
					</button>
					
					{/* Separator */}
					<div className="relative mb-6">
						<div className="absolute inset-0 flex items-center">
							<div className="w-full border-t border-gray-300"></div>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">Or continue with email</span>
						</div>
					</div>
					
					{/* Error Message */}
					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}
					
					{/* Login/Register Form */}
					<form onSubmit={handleSubmit}>
						{/* Name Input - Only for Sign Up */}
						{isSignUp && (
							<div className="mb-4 group">
								<label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
								<input 
									type="text" 
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="John Doe"
									required={isSignUp}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg"
								/>
							</div>
						)}
						
						{/* Email Input */}
						<div className="mb-4 group">
							<label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
							<input 
								type="email" 
								name="email"
								value={formData.email}
								onChange={handleInputChange}
								placeholder="you@example.com"
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg"
							/>
						</div>
						
						{/* Password Input */}
						<div className="mb-4 group">
							<label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
							<input 
								type="password" 
								name="password"
								value={formData.password}
								onChange={handleInputChange}
								placeholder="********"
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg"
							/>
						</div>
						
						{/* Confirm Password Input - Only for Sign Up */}
						{isSignUp && (
							<div className="mb-6 group">
								<label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
								<input 
									type="password" 
									name="confirmPassword"
									value={formData.confirmPassword}
									onChange={handleInputChange}
									placeholder="********"
									required={isSignUp}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:shadow-md focus:shadow-lg"
								/>
							</div>
						)}
						
						{/* Add margin for sign in form */}
						{!isSignUp && <div className="mb-6"></div>}
					
						{/* Submit Button */}
						<button 
							type="submit"
							disabled={isLoading}
							className="w-full bg-gradient-to-r from-primary to-blue-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 mb-4 hover:scale-105 hover:shadow-xl relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									{isSignUp ? 'Creating Account...' : 'Signing In...'}
								</div>
							) : (
								<>
									<span className="relative z-10">{isSignUp ? 'Create Account' : 'Sign In'}</span>
									<div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</>
							)}
						</button>
					</form>
					
					{/* Toggle Link */}
					<div className="text-center">
						{isSignUp ? (
							<>
								<span className="text-gray-600">Already have an account? </span>
								<button 
									type="button"
									onClick={() => setIsSignUp(false)}
									className="text-primary hover:text-primary/80 underline transition-colors duration-300 hover:scale-105 inline-block"
								>
									Sign In
								</button>
							</>
						) : (
							<>
								<span className="text-gray-600">Don't have an account? </span>
								<button 
									type="button"
									onClick={() => setIsSignUp(true)}
									className="text-primary hover:text-primary/80 underline transition-colors duration-300 hover:scale-105 inline-block"
								>
									Sign Up
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			
			{/* Help Icon */}
			<div className="fixed bottom-6 right-6">
				<button className="w-12 h-12 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
					<span className="text-gray-600 font-bold">?</span>
				</button>
			</div>
		</div>
	);
}
