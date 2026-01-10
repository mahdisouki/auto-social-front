import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import signupImage from '../assets/Group 37391.png';

export function SignupPage() {
	const navigate = useNavigate();
	const { register, isLoading, error, clearError } = useAuthStore();
	
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	
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
			
			// Redirect to dashboard after successful signup
			navigate('/', { replace: true });
		} catch (err) {
			// Error is handled by the store
			console.error('Registration failed:', err);
		}
	};

	return (
		<div className="w-screen h-screen flex relative overflow-hidden">
			{/* Left Column - Signup Form */}
			<div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-8 md:px-16 py-10 relative" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' }}>
				<div className="w-full max-w-2xl">
					{/* Back Button */}
					<Link 
						to="/login"
						className="flex items-center gap-2 text-purple-400 text-xs mb-8 hover:text-purple-600 transition-colors tracking-widest"
					>
						<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						RETOUR
					</Link>

					{/* White Container Box */}
					<div className="bg-white rounded-3xl shadow-lg px-6 sm:px-12 py-12">
						{/* Title */}
						<div className="text-center mb-8">
							<h1 className="text-3xl font-bold text-gray-900 mb-1">CREATION</h1>
							<h2 className="text-3xl font-bold text-[#9333EA]">
								DU COMPTE
							</h2>
						</div>
						
						{/* Error Message */}
						{error && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}
						
						{/* Signup Form */}
						<form onSubmit={handleSubmit} className='space-y-8'>
						{/* Row 1: Name and Email */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Name Input */}
							<div>
								<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">NOM COMPLET</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									</div>
									<input 
										type="text" 
										name="name"
										value={formData.name}
										onChange={handleInputChange}
										placeholder="azeem mhiri"
										required
										className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-gray-700 placeholder:text-gray-400 text-sm"
									/>
								</div>
							</div>

							{/* Email Input */}
							<div>
								<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">E-MAIL</label>
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
						</div>
						
						{/* Row 2: Password and Confirm */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							{/* Password Input */}
							<div>
								<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">MOT DE PASSE</label>
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
										minLength={6}
										className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-gray-700 placeholder:text-gray-400 text-sm"
									/>
								</div>
							</div>

							{/* Confirm Password Input */}
							<div>
								<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">CONFIRMER</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
										</svg>
									</div>
									<input 
										type="password" 
										name="confirmPassword"
										value={formData.confirmPassword}
										onChange={handleInputChange}
										placeholder="••••••••••••"
										required
										className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-0 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all text-gray-700 placeholder:text-gray-400 text-sm"
									/>
								</div>
							</div>
						</div>
						
						{/* Submit Button */}
						<button 
							type="submit"
							disabled={isLoading}
							className="w-full bg-[#9333EA] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wider hover:bg-[#7e22ce] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
						>
							{isLoading ? (
								<div className="flex items-center justify-center">
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
									Chargement...
								</div>
							) : (
								"CRÉER MON COMPTE"
							)}
						</button>
					</form>
					
					{/* Login Link */}
					<div className="text-center text-xs mt-6">
						<span className="text-gray-600">DÉJÀ MEMBRE? </span>
						<Link 
							to="/login"
							className="text-[#9333EA] font-semibold hover:text-[#7e22ce] transition-colors"
						>
							se connecter
						</Link>
					</div>
				</div>
				</div>
			</div>

			{/* Right Column - Image */}
			<div className="hidden lg:flex lg:w-2/5 relative overflow-hidden items-center justify-center">
				<img 
					src={signupImage} 
					alt="Signup" 
					className="w-full h-full object-cover"
				/>
			</div>
		</div>
	);
}
