import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
	LightningIcon, 
	PlusIcon, 
	BellIcon, 
	SearchIcon, 
	ShareIcon, 
	ChevronDownIcon,
	MenuIcon,
	CloseIcon
} from '../icons';
import { useAuthStore } from '../../stores/authStore';

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
		navigate('/create');
	};

	return (
		<>
			{/* Dark header bar */}
			{/* <header className="bg-gray-800 text-blue-500">
				<div className="container-max h-12 flex items-center justify-between">
					<div className="flex items-center gap-4">
						<span className="text-sm font-medium">AI</span>
						<div className="hidden md:flex items-center gap-2">
							<span className="text-sm">SaaS Dashboard UI/UX Design</span>
							<ChevronDownIcon />
						</div>
					</div>
					<div className="flex items-center gap-3">
						<button className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary rounded-lg text-sm font-medium hover:bg-primary/90 transition-all duration-300 hover:scale-105">
							<ShareIcon />
							Share
						</button>
					</div>
				</div>
			</header> */}
			
			{/* Main header */}
			<header className="bg-white border-b border-gray-200 relative">
				<div className="container-max h-16 flex items-center justify-between">
					<div className="flex items-center gap-4">
						{/* Mobile menu button */}
						<button 
							onClick={onMenuToggle}
							className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300"
						>
							{isMenuOpen ? <CloseIcon /> : <MenuIcon />}
						</button>
						
						<div className="flex items-center gap-2">
							
							<span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
								welcome back
							</span>
						</div>
					</div>
					
					<div className="hidden md:flex flex-1 max-w-md mx-8">
						<div className="relative w-full">
							<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input 
								placeholder="Search posts, messages..." 
								className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:shadow-md"
							/>
						</div>
					</div>
					
					<div className="flex items-center gap-3">
						<button 
							onClick={handleNewPost}
							className="hidden sm:flex btn-primary items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
						>
							<PlusIcon />
							<span className="hidden lg:inline">New Post</span>
						</button>
						<div className="relative group">
							<button className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-110">
								<BellIcon />
							</button>
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
						</div>
						<div className="relative" ref={userMenuRef}>
							<button 
								onClick={() => setShowUserMenu(!showUserMenu)}
								className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
							>
								<span className="text-xs font-medium text-gray-600">
									{user?.name?.charAt(0).toUpperCase() || '👥'}
								</span>
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
