import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { GoogleIcon } from '../components/icons';
import { useAuthStore } from '../stores/authStore';
import sunglassesImage from '../assets/Rectangle 9873.png';
import bannerImage from '../assets/Frame 2147227131.png';

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
		<div className="h-screen flex relative overflow-hidden">
			{/* Animated background particles */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5">
				<div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-ping"></div>
				<div className="absolute top-40 right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
				<div className="absolute bottom-32 left-40 w-3 h-3 bg-purple-400 rounded-full animate-bounce"></div>
				<div className="absolute top-60 right-20 w-2 h-2 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
			</div>

			{/* Left Column - Product Image Only */}
			<div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-purple-900">
				<img 
					src={sunglassesImage} 
					alt="Premium Sunglasses" 
					className="w-full h-full object-cover"
				/>
				{/* Overlay Banner - Positioned at bottom left */}
				<div className="absolute bottom-8 left-8">
					<img 
						src={bannerImage} 
						alt="Product Banner" 
						className="w-96 object-contain"
					/>
				</div>
			</div>

			{/* Right Column - Login Form */}
			<div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-8 md:px-16 py-10 relative z-10">
				<div className="w-full max-w-xl">
					

					{/* White Card Container */}
					<div className="bg-white rounded-3xl shadow-lg px-6 sm:px-12 py-12">
						{/* Title */}
						<div className="text-center mb-10">
							<h1 className="text-3xl font-bold text-gray-900 mb-1">ESPACE</h1>
							<h2 className="text-3xl font-bold text-[#9333EA]">
								DE CONNEXION
							</h2>
						</div>
						
						{/* Error Message */}
						{error && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}
						
						{/* Login Form */}
						<form onSubmit={handleSubmit} className='space-y-8'>
							{/* Email Input */}
							<div>
									<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">E-mail</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
											</svg>
										</div>
										<input 
											type="email" 
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											placeholder="ademmhiri489@gmail.com"
											required
											className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-gray-700 placeholder:text-gray-400 text-sm"
										/>
								</div>
							</div>
						
							{/* Password Input */}
							<div>
									<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">Mot de passe</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
											</svg>
										</div>
										<input 
											type="password" 
											name="password"
											value={formData.password}
											onChange={handleInputChange}
											placeholder="••••••••••••"
											required
											className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-gray-700 placeholder:text-gray-400 text-sm"
										/>
									</div>
								</div>
							
							{/* Submit Button */}
							<button 
								type="submit"
								disabled={isLoading}
								className="w-full bg-[#9333EA] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wider hover:bg-[#7e22ce] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"							>
								{isLoading ? (
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Chargement...
									</div>
								) : (
									"S'AUTHENTIFIER"
								)}
							</button>
						</form>
						
						{/* Sign Up Link */}
						<div className="text-center text-xs mt-6">
							<span className="text-gray-600">PAS DE COMPTE ? </span>
							<Link 
								to="/signup"
								className="text-[#9333EA] font-semibold hover:text-[#7e22ce] transition-colors"
							>
								Créer un accès
							</Link>
						</div>
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
