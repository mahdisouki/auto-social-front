import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {  
	MenuIcon,
	CloseIcon
} from '../icons';
import { useAuthStore } from '../../stores/authStore';
import fbIcon from '../../assets/fb.png';
import instaIcon from '../../assets/insta.png';
import tikIcon from '../../assets/tik.png';
import bell from '../../assets/bell.png';
interface TopbarProps {
	onMenuToggle: () => void;
	isMenuOpen: boolean;
}

export function Topbar({ onMenuToggle, isMenuOpen }: TopbarProps) {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();
	const [showUserMenu, setShowUserMenu] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	// Close user menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setShowUserMenu(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	const handleNewPost = () => {
		navigate('/create-post');
	};

	return (
		<>
			{/* Main header */}
			<header 
				className="relative"
				style={{ background: '#000000' }}
			>
				<div className="container-max h-24 flex items-center justify-between">
					<div className="flex items-center gap-4">
						{/* Mobile menu button */}
						<button 
							onClick={onMenuToggle}
							className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300"
						>
							{isMenuOpen ? <CloseIcon className="text-white" /> : <MenuIcon className="text-white" />}
						</button>
					</div>
					
					{/* Right side container with social icons, notification, and user */}
					<div 
						className="flex items-center gap-3 px-4 py-2 rounded-lg mt-6"
						style={{ background: '#0E0E13', border: '1px solid #FFFFFF1A' }}
					>
						{/* Social Media Icons */}
						<div className="flex items-center gap-3">
							{/* Facebook Icon */}
							<button className="relative p-2 hover:opacity-80 transition-opacity">
								<img src={fbIcon} alt="Facebook" className="w-5 h-5" />
								<div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#9747FF] rounded-full"></div>
							</button>
							
							{/* Instagram Icon */}
							<button className="p-2 hover:opacity-80 transition-opacity">
								<img src={instaIcon} alt="Instagram" className="w-5 h-5" />
							</button>
							
							{/* TikTok Icon */}
							<button className="p-2 hover:opacity-80 transition-opacity">
								<img src={tikIcon} alt="TikTok" className="w-5 h-5" />
							</button>
						</div>
						
						{/* Vertical Separator */}
						<div className="w-px h-6 bg-white opacity-20"></div>
						
						{/* Notification Icon */}
						<div className="relative">
							<button className="p-2 hover:opacity-80 transition-opacity">
								<img src={bell} alt="Notifications" className="w-4 h-4" />
							</button>
						</div>
						
						{/* User Profile Image */}
						<div className="relative" ref={userMenuRef}>
							<button 
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#FF6B35] hover:opacity-80 transition-opacity"
							>
								{user?.profileImage ? (
									<img 
										src={user.profileImage} 
										alt={user?.name || 'User'} 
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
										<span className="text-xs font-medium text-gray-600">
											{user?.name?.charAt(0).toUpperCase() || '👥'}
										</span>
									</div>
								)}
							</button>
							
							{/* User Dropdown Menu */}
							{showUserMenu && (
								<div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
									<div className="px-4 py-2 border-b border-gray-100">
										<p className="text-sm font-medium text-gray-900">{user?.name}</p>
										<p className="text-xs text-gray-500">{user?.email}</p>
									</div>
									<button 
										onClick={() => {
											navigate('/settings');
											setShowUserMenu(false);
										}}
										className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
									>
										Settings
									</button>
									<button 
										onClick={handleLogout}
										className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
									>
										Sign Out
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</header>
		</>
	);
}
