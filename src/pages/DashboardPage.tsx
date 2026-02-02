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
					background: 'linear-gradient(175.51deg, #000000 30%, #9747FF 70%)',
					border: '1px solid #FFFFFF1A'
				}}
			>
				{/* Wave pattern overlay at bottom right */}
				<div 
					className="absolute bottom-0 right-0 w-64 h-64"
					style={{
						background: 'radial-gradient(circle at bottom right, rgba(74, 0, 176, 0.6) 0%, transparent 70%)',
						filter: 'blur(40px)',
						opacity: 0.68,
						mixBlendMode: 'multiply'
					}}
				></div>
				
				<div className="relative z-10">
					{/* Main Title */}
					<h2 
						className="text-white mb-2"
						style={{
							fontFamily: 'Playfair Display, serif',
							fontStyle: 'italic',
							fontSize: '38px',
							fontWeight: 400,
							lineHeight: '1.2'
						}}
					>
						Créez des visuels produits
					</h2>
					
					{/* Subtitle */}
					<p 
						className="mb-6"
						style={{
							fontFamily: 'Playfair Display, serif',
							fontStyle: 'italic',

							fontSize: '18px',
							color: '#A29BFE',
							fontWeight: 400
						}}
					>
						professionnels avec l'IA
					</p>
					
					{/* Button */}
					<button
						onClick={() => navigate('/create')}
						className="px-8 py-4 rounded-xl text-white font-bold uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg"
						style={{
							background: '#9747FF',
							boxShadow: '0px 0px 27.1px 0px #9747FF8A',
							fontSize: '10px'
						}}
					>
						CRÉER UN POSTE
					</button>
				</div>
			</div>
			
			{/* Metrics Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
				{/* Posts Generated */}
				<div 
					className="rounded-2xl p-4"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A'
					}}
				>
					<div className="flex items-start gap-3 mb-3">
						<img 
							src={sahmIcon} 
							alt="Posts Generated" 
							className="w-10 h-10 object-contain"
						/>
						<h3 
							className="uppercase"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '12px',
								fontWeight: 600,
								lineHeight: '24px',
								letterSpacing: '0.02em',
								color: '#FFFFFFB2'
							}}
						>
							POSTS GÉNÉRÉS
						</h3>
					</div>
					<div 
						className="text-white font-bold"
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '30px',
							fontWeight: 800,
							lineHeight: '24px',
							letterSpacing: '0'
						}}
					>
						{stats?.aiUsage.postsGenerated || 0}
					</div>
				</div>

				{/* Scheduled Posts */}
				<div 
					className="rounded-2xl p-4"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A'
					}}
				>
					<div className="flex items-start gap-3 mb-3">
						<img 
							src={sahmIcon} 
							alt="Scheduled Posts" 
							className="w-10 h-10 object-contain"
						/>
						<h3 
							className="uppercase"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '12px',
								fontWeight: 600,
								lineHeight: '24px',
								letterSpacing: '0.02em',
								color: '#FFFFFFB2'
							}}
						>
							POSTS PROGRAMMÉS
						</h3>
					</div>
					<div 
						className="text-white font-bold"
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '30px',
							fontWeight: 800,
							lineHeight: '24px',
							letterSpacing: '0'
						}}
					>
						{stats?.scheduledPosts || 0}
					</div>
				</div>

				{/* Average Engagement */}
				<div 
					className="rounded-2xl p-4"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A'
					}}
				>
					<div className="flex items-start gap-3 mb-3">
						<img 
							src={sahmIcon} 
							alt="Average Engagement" 
							className="w-10 h-10 object-contain"
						/>
						<h3 
							className="uppercase"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '12px',
								fontWeight: 600,
								lineHeight: '24px',
								letterSpacing: '0.02em',
								color: '#FFFFFFB2'
							}}
						>
							ENGAGEMENT MOYEN
						</h3>
					</div>
					<div 
						className="text-white font-bold"
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '30px',
							fontWeight: 800,
							lineHeight: '24px',
							letterSpacing: '0%'
						}}
					>
						{stats?.engagementRate || 0}%
					</div>
				</div>

				{/* Messages Today */}
				<div 
					className="rounded-2xl p-4"
					style={{
						background: '#0E0E13',
						border: '1px solid #FFFFFF1A'
					}}
				>
					<div className="flex items-start gap-3 mb-3">
						<img 
							src={sahmIcon} 
							alt="Messages Today" 
							className="w-10 h-10 object-contain"
						/>
						<h3 
							className="uppercase"
							style={{
								fontFamily: 'Inter, sans-serif',
								fontSize: '12px',
								fontWeight: 600,
								lineHeight: '24px',
								letterSpacing: '0.02em',
								color: '#FFFFFFB2'
							}}
						>
							MESSAGES AUJOURD'HUI
						</h3>
					</div>
					<div 
						className="text-white font-bold"
						style={{
							fontFamily: 'Inter, sans-serif',
							fontSize: '30px',
							fontWeight: 800,
							lineHeight: '24px',
							letterSpacing: '0%'
						}}
					>
						{stats?.todayMessages || 0}
					</div>
				</div>
			</div>

			{/* Postes Recent Section */}
			<div className="mt-6">
				<h3 
					className="text-white mb-4"
					style={{
						fontFamily: 'Playfair Display, serif',
						fontWeight: 600,
						fontStyle: 'italic',
						fontSize: '35px',
						lineHeight: '100%',
						letterSpacing: '0.02em'
					}}
				>
					Postes Recent
				</h3>
				<p 
					className="mb-6"
					style={{
						color: '#FFFFFF66'
					}}
				>
					lorem ipsum lorem ipsum lorem ipsum
				</p>
			</div>

			{/* Images Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<div className="w-full">
					<img 
						src={rectangleImage} 
						alt="Post preview" 
						className="w-full h-full object-cover"
						style={{
							border: '1px solid #FFFFFF1A',
							borderRadius: '16px',
							height: '300px',
							width: '100%'
						}}
					/>
				</div>
				<div className="w-full">
					<img 
						src={calendarImage} 
						alt="Calendar" 
						className="w-full h-full object-cover"
						style={{
							border: '1px solid #FFFFFF1A',
							borderRadius: '16px',
							height: '300px',
							width: '100%'
						}}
					/>
				</div>
				<div className="w-full">
					<img 
						src={card3Image} 
						alt="Product card" 
						className="w-full h-full object-cover"
						style={{
							border: '1px solid #FFFFFF1A',
							borderRadius: '16px',
							height: '300px',
							width: '100%'
						}}
					/>
				</div>
				<div className="w-full">
					<img 
						src={card1Image} 
						alt="Product card" 
						className="w-full h-full object-cover"
						style={{
							border: '1px solid #FFFFFF1A',
							borderRadius: '16px',
							height: '300px',
							width: '100%'
						}}
					/>
				</div>
			</div>
			</div>
			
		</div>
	);
}
