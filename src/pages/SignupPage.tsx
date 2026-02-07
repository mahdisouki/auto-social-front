import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import signupImage from '../assets/Group 37391.png';
import LoginR from '../assets/LoginR.png';
import LoginL from '../assets/LoginL.png';

export function SignupPage() {
	const navigate = useNavigate();
	const { register, isLoading, error, clearError } = useAuthStore();
	
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		password: '',
		confirmPassword: '',
	});
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	
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
			if (!formData.firstName.trim()) {
				alert('Please enter your first name');
				return;
			}
			if (!formData.lastName.trim()) {
				alert('Please enter your last name');
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
			if (!acceptedTerms) {
				alert('Please accept the Terms of Use and Privacy Policy');
				return;
			}
			
			const fullName = `${formData.firstName} ${formData.lastName}`;
			await register(fullName, formData.email, formData.password);
			
			// Redirect to dashboard after successful signup
			navigate('/dashboard', { replace: true });
		} catch (err) {
			// Error is handled by the store
			console.error('Registration failed:', err);
		}
	};

	return (
		<div className="h-screen flex relative overflow-hidden" style={{ background: '#000000' }}>
			{/* Background Image - Top Left */}
			<img 
				src={LoginL} 
				alt="" 
				className="absolute pointer-events-none"
				style={{
					left: '15%',
					top: '-20%',
					width: '1500px',
					height: '700px',
					objectFit: 'contain',
					zIndex: 0,
					transform: 'rotate(270deg)'
				}}
			/>

			{/* Background Image - Bottom Right */}
			<img 
				src={LoginR} 
				alt="" 
				className="absolute pointer-events-none"
				style={{
					right: '-10%',
					bottom: '0%',
					width: '800px',
					height: '700px',
					objectFit: 'contain',
					zIndex: 10
				}}
			/>

			{/* Left Column - Image */}
			<div className="hidden lg:flex lg:w-2/5 relative overflow-hidden bg-purple-900 z-10">
				<img 
					src={signupImage} 
					alt="Signup" 
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Right Column - Signup Form */}
			<div className="w-full lg:w-3/5 flex items-center justify-center px-4 sm:px-8 md:px-16 py-10 relative z-10">
				{/* Return Arrow - Top Left */}
				<Link 
					to="/login"
					className="absolute top-10 left-10 z-20 flex items-center justify-center transition-colors"
				>
					{/* Inner dotted border container */}
					<div
						className="flex items-center gap-2"
					>
						<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						<span className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>RETOUR</span>
					</div>
				</Link>
				
				<div className="w-full max-w-lg relative z-10 mx-auto">
					{/* White Card Container */}
					<div 
						className="rounded-3xl shadow-lg px-6 sm:px-8 py-4"
						style={{
							background: '#0E0E13',
							border: '1px solid #FFFFFF0D',
							width: '100%',
							maxWidth: '450px',
							margin: '0 auto'
						}}
					>
						{/* Title */}
						<div className="mb-6">
							<h1 
								className="mb-3 text-white"
								style={{
									fontFamily: 'Playfair Display, serif',
									fontWeight: 700,
									fontSize: '32px',
									lineHeight: '50px',
									letterSpacing: '-2.4px',
									textAlign: 'left',
									verticalAlign: 'middle',
									textTransform: 'capitalize'
								}}
							>
								Créer un compte
							</h1>
							{/* Purple Rectangle Line */}
							<div 
								className="mt-2"
								style={{
									width: '220px',
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
						
						{/* Signup Form */}
						<form onSubmit={handleSubmit} className='space-y-6'>
							{/* First Name and Last Name Inputs */}
							<div className="grid grid-cols-2 gap-4">
								{/* First Name Input */}
								<div>
									<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">Prénom</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										</div>
										<input 
											type="text" 
											name="firstName"
											value={formData.firstName}
											onChange={handleInputChange}
											placeholder="azeem"
											required
											className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#9747FF] focus:ring-0 transition-all text-white placeholder:text-gray-500 text-sm border border-[#374151] focus:border-[#9747FF]"
											style={{
												background: '#000000'
											}}
										/>
									</div>
								</div>

								{/* Last Name Input */}
								<div>
									<label className="block text-xs font-medium text-gray-400 uppercase mb-2 tracking-wider">Nom</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
											</svg>
										</div>
										<input 
											type="text" 
											name="lastName"
											value={formData.lastName}
											onChange={handleInputChange}
											placeholder="mhiri"
											required
											className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#9747FF] focus:ring-0 transition-all text-white placeholder:text-gray-500 text-sm border border-[#374151] focus:border-[#9747FF]"
											style={{
												background: '#000000'
											}}
										/>
									</div>
								</div>
							</div>

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
										className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#9747FF] focus:ring-0 transition-all text-white placeholder:text-gray-500 text-sm border border-[#374151] focus:border-[#9747FF]"
										style={{
											background: '#000000'
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
										minLength={6}
										className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:border-[#9747FF] focus:ring-0 transition-all text-white placeholder:text-gray-500 text-sm border border-[#374151] focus:border-[#9747FF]"
										style={{
											background: '#000000'
										}}
									/>
								</div>
							</div>

							

							{/* Terms and Privacy Checkbox */}
							<div className="flex items-start">
								<input 
									type="checkbox" 
									id="terms"
									checked={acceptedTerms}
									onChange={(e) => setAcceptedTerms(e.target.checked)}
									required
									className="mt-1 mr-3 w-7 h-5 rounded appearance-none cursor-pointer focus:ring-[#9747FF] focus:ring-2"
									style={{
										backgroundColor: acceptedTerms ? '#9747FF' : '#000000',
										borderColor: '#9747FF',
										borderWidth: '1px',
										borderStyle: 'solid',
										backgroundImage: acceptedTerms ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%23ffffff' stroke-width='2' d='M2 6l3 3 5-5'/%3E%3C/svg%3E\")" : 'none',
										backgroundRepeat: 'no-repeat',
										backgroundPosition: 'center',
										backgroundSize: 'contain'
									}}
								/>
								<label htmlFor="terms" className="text-xs text-gray-300 leading-relaxed">
									En créant un compte, j'accepte les{' '}
									<Link to="/terms" className="text-[#9747FF] hover:text-[#7e22ce] underline">
										Conditions d'Utilisation
									</Link>
									{' '}et la{' '}
									<Link to="/privacy" className="text-[#9747FF] hover:text-[#7e22ce] underline">
										Politique de Confidentialité
									</Link>
									.
								</label>
							</div>
							
							{/* Submit Button */}
							<button 
								type="submit"
								disabled={isLoading}
								className="w-full bg-[#9333EA] text-white py-3.5 rounded-xl font-semibold text-sm tracking-wider hover:bg-[#7e22ce] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
							>
								{isLoading ? (
									<div className="flex items-center justify-center">
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
										Chargement...
									</div>
								) : (
									"Créer mon compte"
								)}
							</button>
						</form>
						
						{/* Login Link */}
						<div className="text-center text-xs mt-10">
							<span className="text-white pr-2">DÉJÀ MEMBRE ? </span>
							<Link 
								to="/login"
								className="text-[#9333EA] font-semibold hover:text-[#7e22ce] transition-colors"
							>
								Se connecter
							</Link>
						</div>
					</div>
				</div>
			</div>

			
		</div>
	);
}
