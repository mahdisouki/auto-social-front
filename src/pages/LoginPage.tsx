import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import loginImage from '../assets/login.webp';
import LoginR from '../assets/LoginR.png';
import LoginL from '../assets/LoginL.png';

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
			
			// Redirect to dashboard
			navigate('/dashboard', { replace: true });
		} catch (err) {
			// Error is handled by the store
			console.error(isSignUp ? 'Registration failed:' : 'Login failed:', err);
		}
	};
	
	

	return (
		<div className="h-screen flex relative overflow-hidden" style={{ background: '#000000' }}>
			{/* Keep same colors after autofill: black background, white text */}
			<style>{`
				.login-form-input:-webkit-autofill,
				.login-form-input:-webkit-autofill:hover,
				.login-form-input:-webkit-autofill:focus,
				.login-form-input:-webkit-autofill:active {
					-webkit-box-shadow: 0 0 0 1000px #000000 inset !important;
					box-shadow: 0 0 0 1000px #000000 inset !important;
					-webkit-text-fill-color: #ffffff !important;
					transition: background-color 5000s ease-in-out 0s;
					border: 1px solid #9747FF !important;
				}

				/* Login background images: mobile - one top-left, one bottom-right */
				.login-bg-left {
					position: absolute;
					pointer-events: none;
					
					z-index: 0;
					left: 0;
					top: 0;
					width: 300px;
					height: 300px;
					transform: rotate(270deg);
					opacity: 0.6;
				}
				.login-bg-right {
					position: absolute;
					pointer-events: none;
					z-index: 0;
					right: 0;
					bottom: 0;
					width: 300px;
					height: 300px;
					opacity: 0.6;
				}

				/* Login background images: desktop (md and up) */
				@media (min-width: 768px) {
					.login-bg-left {
						left: 10%;
						top: -40%;
						width: 1400px;
						height: 700px;
						opacity: 1;
					}
					.login-bg-right {
						right: -10%;
						bottom: 0%;
						width: 800px;
						height: 700px;
						z-index: 10;
						opacity: 1;
					}
				}
			`}</style>
			{/* Background Image - Top Left */}
			<img src={LoginL} alt="" className="login-bg-left" />

			{/* Background Image - Bottom Right */}
			<img src={LoginR} alt="" className="login-bg-right" />

			{/* Left Column - Product Image Only */}
			<div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-purple-900 z-10">
				<img 
					src={loginImage} 
					alt="Premium Watch" 
					className="w-full h-full object-cover"
				/>
				
			</div>

			{/* Right Column - Login Form */}
			<div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-8 md:px-16 py-10 relative z-10">
				{/* Return Arrow - Top Left */}
				<Link 
					to="/"
					className="absolute top-10 left-10 z-20 flex items-center justify-center transition-colors"
					
				>
					{/* Inner dotted border container */}
					<div
						className="flex items-center gap-2"
						
					>
						<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						<span className="text-white text-sm " style={{ fontFamily: 'Inter, sans-serif' }}>RETOUR</span>
					</div>
				</Link>
				
				<div className="w-full max-w-md relative z-10">
					

					{/* White Card Container */}
					<div 
						className="rounded-3xl shadow-lg px-6 sm:px-8 py-12"
						style={{
							background: '#0E0E13',
							border: '1px solid #FFFFFF0D',
							width: '100%',
							maxWidth: '500px'
						}}
					>
						{/* Title */}
						<div className="mb-6">
							<h1 
								className="mb-3 text-white"
								style={{
									fontFamily: 'Playfair Display, serif',
									fontWeight: 700,
									fontSize: '40px',
									lineHeight: '50px',
									letterSpacing: '-2.4px',
									textAlign: 'left',
									verticalAlign: 'middle',
									textTransform: 'capitalize'
								}}
							>
								Se Connecter
							</h1>
							{/* Purple Rectangle Line */}
							<div 
								className="mt-2"
								style={{
									width: '180px',
									height: '4px',
									background: '#9747FF',
									borderRadius: '2px'
								}}
							></div>
						</div>
						
						{/* Error Message */}
						{error && (
							<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
								<p className="text-sm text-red-600">{error}</p>
							</div>
						)}
						
						{/* Login Form */}
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* Email Input */}
							<div>
									<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">Adresse E-mail</label>
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
											className="login-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#9747FF] focus:ring-0 text-white placeholder:text-gray-500 text-sm"
											style={{
												background: '#000000',
												border: '1px solid #9747FF'
											}}
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
											className="login-form-input w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#9747FF] focus:ring-0 text-white placeholder:text-gray-500 text-sm"
											style={{
												background: '#000000',
												border: '1px solid #9747FF'
											}}
										/>
									</div>
								</div>
							
							{/* Submit Button */}
							<button 
								type="submit"
								disabled={isLoading}
								className="w-full bg-[#9333EA] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wider hover:bg-[#7e22ce] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"							>
								{isLoading ? (
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Chargement...
									</div>
								) : (
									"Se Connecter"
								)}
							</button>
						</form>
						
						{/* Sign Up Link */}
						<div className="text-center text-xs mt-10">
							<span className="text-white pr-2">PAS DE COMPTE ? </span>
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

			
		</div>
	);
}
