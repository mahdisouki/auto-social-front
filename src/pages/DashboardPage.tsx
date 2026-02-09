import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { usePostsStore } from '../stores/postsStore';
import sahmIcon from '../assets/sahm.png';
import calendarImage from '../assets/Group 37391.png';
import card3Image from '../assets/card3.png';
import rectangleImage from '../assets/Rectangle 9873.png';
import card1Image from '../assets/card1.png';
import dash1Image from '../assets/dash1.png';
import dash2Image from '../assets/dash2.png';
import backgrounddash from '../assets/backgrounddash.jpg';
import fbIcon from '../assets/fb.png';
import instaIcon from '../assets/insta.png';
import placeholderPost1 from '../assets/beauté/1.jpg';
import placeholderPost2 from '../assets/electronics/1.jpg';
import placeholderPost3 from '../assets/sports/1.jpg';
export function DashboardPage() {
	const navigate = useNavigate();
	const { 
		posts, 
		messages, 
		stats, 
		isLoading, 
		error, 
		fetchDashboardData,
		clearError 
	} = usePostsStore();

	useEffect(() => {
		// Fetch data on component mount and reload
		fetchDashboardData().catch((err) => {
			console.error('Failed to fetch dashboard data:', err);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Show loading state
		if (isLoading && !stats) {
		return (
			<div className="w-full h-full min-h-0 flex-1 flex flex-col py-6 px-4 md:px-6 lg:px-8 relative overflow-y-auto overflow-x-hidden" style={{ background: '#000000' }}>
				<div className="flex items-center justify-center h-64">
					<div 
						className="animate-spin rounded-full h-12 w-12 border-b-2"
						style={{ borderColor: '#9747FF' }}
					></div>
				</div>
			</div>
		);
	}

	// Show error state
	if (error) {
		return (
			<div className="w-full h-full min-h-0 flex-1 flex flex-col py-6 px-4 md:px-6 lg:px-8 relative overflow-y-auto overflow-x-hidden" style={{ background: '#000000' }}>
				<div 
					className="rounded-lg p-4"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A'
					}}
				>
					<p className="text-white mb-4">{error}</p>
					<button 
						onClick={() => {
							clearError();
							fetchDashboardData();
						}}
						className="px-4 py-2 rounded-lg text-white transition-colors"
						style={{
							background: '#9747FF'
						}}
					>
						Try again
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="w-full h-full min-h-0 flex-1 flex flex-col py-6 px-4 md:px-6 lg:px-8 relative overflow-y-auto overflow-x-hidden" style={{ background: '#000000' }}>
			{/* Left side decorative image */}
			<img 
				src={dash2Image} 
				alt="" 
				className="absolute pointer-events-none object-contain object-left rounded-2xl"
				style={{
					left: '-5%',
					top: '10%',
					width: 'min(420px, 45vw)',
					height: 'auto',
					maxHeight: '70vh',
					zIndex: 0
				}}
			/>
			{/* Right side decorative image */}
			<img 
				src={dash1Image} 
				alt="" 
				className="absolute pointer-events-none object-contain object-right rounded-2xl"
				style={{
					right: '-5%',
					top: '20%',
					width: 'min(380px, 42vw)',
					height: 'auto',
					maxHeight: '65vh',
					zIndex: 0
				}}
			/>

			<div className="relative z-10">
			{/* Create Post Card */}
			<div 
				className="relative rounded-2xl p-8 mb-6 overflow-hidden"
				style={{
					backgroundImage: `url(${backgrounddash}), linear-gradient(175.51deg, #000000 9.23%, #9747FF 96.09%)`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
				}}
			>
				{/* Wave pattern overlay at bottom right */}
				<div 
					className="absolute bottom-0 right-0 w-64 h-64"
					
				></div>
				
				<div className="relative z-10">
					{/* Main Title */}
					<h2 
						className="mb-2"
						style={{
							fontFamily: 'Playfair Display, serif',
							fontStyle: 'bold',
							fontSize: '30px',
							fontWeight: 700,
							lineHeight: '1.2',
							color: '#C098F5',
							textAlign: 'center'
						}}
					>
						Votre équipe créative, en une seule plateforme
					</h2>
					
					{/* Subtitle */}
					<p 
						className="mb-6"
						style={{
							fontFamily: 'Inter, sans-serif',
							textAlign: 'center',
							fontSize: '16px',
							color: '#FFFFFF',
							fontWeight: 300
						}}
					>
						Créez des visuels produits, générez des captions et publiez automatiquement sur vos réseaux sociaux.
					</p>
					
					
				</div>
			</div>
			
			

			{/* Cards Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
				{/* Card 1: Comptes sociaux connectés */}
				<div
					className="rounded-2xl p-6 overflow-hidden"
					style={{
						background: 'rgba(14, 14, 19, 0.95)',
						border: '1px solid rgba(255,255,255,0.1)',
					}}
				>
					<h3
						className="text-white mb-4 italic"
						style={{
							fontFamily: 'Playfair Display, serif',
							fontSize: '22px',
							fontWeight: 400,
						}}
					>
						Comptes sociaux connectés
					</h3>
					<div
						className="mb-4"
						style={{
							width: '120px',
							height: '3px',
							background: '#9747FF',
							borderRadius: '2px',
						}}
					/>
					<div className="grid grid-cols-2 gap-4">
						{/* Facebook card */}
						<div
							className="rounded-xl p-4 flex flex-col items-center justify-between"
							style={{
								background: 'rgba(255,255,255,0.05)',
								border: '1px solid rgba(255,255,255,0.1)',
								minHeight: '200px',
							}}
						>
							<div className="flex items-center gap-2 w-full">
								<img
									src={fbIcon}
									alt="Facebook"
									className="w-8 h-8 rounded-full object-contain flex-shrink-0"
								/>
								<span className="text-white text-sm font-medium">Facebook</span>
							</div>
							<div className="text-center my-4">
								<p className="text-white text-4xl font-bold">1</p>
								<p className="text-gray-400 text-xs mt-1">Total Posts</p>
							</div>
							<button
								type="button"
								className="w-full py-2 rounded-lg text-white text-sm font-medium"
								style={{ background: '#9747FF' }}
							>
								Voir Historique
							</button>
						</div>
						{/* Instagram card */}
						<div
							className="rounded-xl p-4 flex flex-col items-center justify-between"
							style={{
								background: 'rgba(255,255,255,0.05)',
								border: '1px solid rgba(255,255,255,0.1)',
								minHeight: '200px',
							}}
						>
							<div className="flex items-center gap-2 w-full">
								<img
									src={instaIcon}
									alt="Instagram"
									className="w-8 h-8 rounded-lg object-contain flex-shrink-0"
								/>
								<span className="text-white text-sm font-medium">Instagram</span>
							</div>
							<div className="text-center my-4">
								<p className="text-white text-3xl font-bold">—</p>
								<p className="text-gray-400 text-xs mt-1">Total Posts</p>
							</div>
							<button
								type="button"
								className="w-full py-2 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2"
								style={{ background: '#9747FF' }}
							>
								<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
								</svg>
								Connecter
							</button>
						</div>
					</div>
				</div>

				{/* Card 2: Publications mensuelles */}
				<div
					className="rounded-2xl p-6 overflow-hidden flex flex-col"
					style={{
						background: 'rgba(14, 14, 19, 0.95)',
						border: '1px solid rgba(255,255,255,0.1)',
						minHeight: '320px',
					}}
				>
					<div className="flex items-start justify-between gap-4 mb-4">
						<div>
							<h3
								className="text-white italic"
								style={{
									fontFamily: 'Playfair Display, serif',
									fontSize: '22px',
									fontWeight: 400,
								}}
							>
								Publications mensuelles
							</h3>
							<div
								className="mt-2"
								style={{
									width: '140px',
									height: '3px',
									background: '#9747FF',
									borderRadius: '2px',
								}}
							/>
						</div>
						{/* FACEBOOK | INSTAGRAM toggle */}
						<div
							className="flex rounded-lg overflow-hidden flex-shrink-0"
							style={{
								background: 'rgba(255,255,255,0.08)',
								border: '1px solid rgba(255,255,255,0.1)',
							}}
						>
							<button
								type="button"
								className="px-3 py-1.5 text-xs font-semibold text-white uppercase"
								style={{ background: '#9747FF' }}
							>
								Facebook
							</button>
							<button
								type="button"
								className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase hover:text-white transition-colors"
								style={{ background: 'transparent' }}
							>
								Instagram
							</button>
						</div>
					</div>
					{/* Histogram placeholder */}
					<div
						className="flex-1 flex items-center justify-center rounded-xl min-h-[180px]"
						style={{
							background: 'rgba(255,255,255,0.03)',
							border: '1px solid rgba(255,255,255,0.06)',
						}}
					>
						<span className="text-white/40 text-lg font-bold uppercase tracking-wider">
							Histogramme
						</span>
					</div>
				</div>
			</div>

			{/* Second row: Publications récentes (left, larger) + Vue d'ensemble (right, smaller) */}
			<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-6">
				{/* Card: Publications récentes */}
				<div
					className="rounded-2xl p-6 overflow-hidden"
					style={{
						background: 'rgba(14, 14, 19, 0.95)',
						border: '1px solid rgba(255,255,255,0.1)',
					}}
				>
					<div className="flex items-start justify-between gap-4 mb-4">
						<div>
							<h3
								className="text-white italic"
								style={{
									fontFamily: 'Playfair Display, serif',
									fontSize: '22px',
									fontWeight: 400,
								}}
							>
								Publications récentes
							</h3>
							<div
								className="mt-2"
								style={{
									width: '140px',
									height: '3px',
									background: '#9747FF',
									borderRadius: '2px',
								}}
							/>
						</div>
						<button
							type="button"
							className="rounded-lg px-4 py-2 text-[#9747FF] flex-shrink-0 capitalize"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontWeight: 500,
								fontSize: '10px',
								lineHeight: '12px',
								letterSpacing: '0.02em',
								border: '1px solid #9747FF',
							}}
						>
							Voir Tous
						</button>
					</div>
					<div className="grid grid-cols-3 gap-4">
						{[
							{ img: placeholderPost1, category: 'Food', status: 'Publié', name: 'S7an Kosksi' },
							{ img: placeholderPost2, category: 'Food', status: 'Publié', name: 'lablebi' },
							{ img: placeholderPost3, category: 'Food', status: 'Publié', name: 'chaneb' },
						].map((post, i) => (
							<div
								key={i}
								className="rounded-xl overflow-hidden flex flex-col"
								style={{
									background: 'rgba(0,0,0,0.3)',
									border: '1px solid rgba(255,255,255,0.08)',
								}}
							>
								<div className="relative aspect-[4/5] w-full overflow-hidden">
									<img
										src={post.img}
										alt=""
										className="absolute inset-0 w-full h-full object-cover"
									/>
									<div className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden bg-[#1877F2]">
										<img src={fbIcon} alt="" className="w-4 h-4 object-contain" />
									</div>
								</div>
								<div
									className="p-3 flex flex-col gap-1"
									style={{
										background: 'rgba(30, 20, 40, 0.9)',
									}}
								>
									<div className="flex items-center justify-between gap-1">
										<span className="text-[#C098F5] text-xs">{post.category}</span>
										<span
											className="rounded px-2 py-0.5 text-xs font-medium text-white"
											style={{ background: '#9747FF' }}
										>
											{post.status}
										</span>
									</div>
									<p className="text-white text-sm font-bold truncate">{post.name}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Card: Vue d'ensemble */}
				<div
					className="rounded-2xl p-6 overflow-hidden"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A',
					}}
				>
					<h3
						className="text-white mb-4 italic"
						style={{
							fontFamily: 'Playfair Display, serif',
							fontSize: '22px',
							fontWeight: 400,
						}}
					>
						Vue d'ensemble
					</h3>
					<div
						className="mb-5"
						style={{
							width: '120px',
							height: '3px',
							background: '#9747FF',
							borderRadius: '2px',
						}}
					/>
					<div className="flex flex-col gap-4">
						<div
							className="rounded-xl p-5"
							style={{
								background: '#171726',
								border: '1px solid rgba(255,255,255,0.08)',
							}}
						>
							<p className="text-gray-300 text-sm font-normal mb-1">Publications totales</p>
							<p className="text-white text-3xl font-bold">123</p>
						</div>
						<div
							className="rounded-xl p-5"
							style={{
								background: '#171726',
								border: '1px solid rgba(255,255,255,0.08)',
							}}
						>
							<p className="text-gray-300 text-sm font-normal mb-1">Publications</p>
							<p className="text-white text-3xl font-bold">123</p>
						</div>
						<div
							className="rounded-xl p-5"
							style={{
								background: '#171726',
								border: '1px solid rgba(255,255,255,0.08)',
							}}
						>
							<p className="text-gray-300 text-sm font-normal mb-1">Publications programmées</p>
							<p className="text-white text-3xl font-bold">123</p>
						</div>
					</div>
				</div>
			</div>
			</div>
			
		</div>
	);
}
