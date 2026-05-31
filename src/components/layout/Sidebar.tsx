import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
	GridIcon, 
	PlusIcon, 
	CalendarIcon, 
	ImageIcon, 
	SettingsIcon,
	CloseIcon,
	LogoutIcon,
	PersonIcon,
	ListIcon,
} from '../icons';
import { useAuthStore } from '../../stores/authStore';
import logoImage from '../../assets/postoruai.png';
import creditstarImage from '../../assets/creditstar.png';

const CREDITS_MAX = 100; // max for progress bar display

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
	onMenuToggle?: () => void;
}

const baseNav = [
	{ to: '/dashboard', label: 'Dashboard', icon: GridIcon },
	{ to: '/create', label: 'Créer un Post', icon: PlusIcon },
	{ to: '/scheduler', label: 'Scheduler', icon: CalendarIcon },
	{ to: '/posts', label: 'Mes Posts', icon: ImageIcon },
	{ to: '/settings', label: 'Paramètres', icon: SettingsIcon },
];

export function Sidebar({ isOpen, onClose, onMenuToggle }: SidebarProps) {
	const navigate = useNavigate();
	const { user, logout } = useAuthStore();

	const nav =
		user?.role === 'admin'
			? [
					...baseNav.slice(0, -1),
					{ to: '/admin/users', label: 'Admin · Utilisateurs', icon: PersonIcon },
					{ to: '/admin/posts', label: 'Admin · Posts', icon: ListIcon },
					baseNav[baseNav.length - 1],
				]
			: baseNav;
	const credits = user?.credits ?? 0;
	const creditsPercent = Math.min(100, (credits / CREDITS_MAX) * 100);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (e: MouseEvent) => {
			if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
				setUserMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleLogout = () => {
		setUserMenuOpen(false);
		logout();
		navigate('/login');
		onClose();
	};

	return (
		<>
			{/* Mobile overlay */}
			{isOpen && (
				<div 
					className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
					onClick={onClose}
				/>
			)}
			
			{/* Sidebar */}
			<aside 
				className={`
					fixed inset-y-0 left-0 z-50 w-60 flex flex-col transform transition-transform duration-300 ease-in-out
					${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
				`}
				style={{
					background: '#0E0E13',
					borderRight: '1px solid #FFFFFF1A'
				}}
			>
				<div className="px-6 py-6 flex items-center justify-between gap-2">
					<div className="flex-1 flex justify-center min-w-0">
						<img 
							src={logoImage} 
							alt="POSTORY AI" 
							className="h-auto w-full max-w-[180px] object-contain"
						/>
					</div>
					{onMenuToggle && (
						<button
							type="button"
							onClick={onMenuToggle}
							className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 shrink-0"
							aria-label="Close menu"
						>
							<CloseIcon />
						</button>
					)}
				</div>
				<nav className="px-4 space-y-1 flex-1">
					{nav.map((item, index) => (
						<NavLink 
							key={item.to} 
							to={item.to} 
							end 
							onClick={onClose}
							className={({ isActive }) => 
								`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${
									isActive 
										? 'text-white shadow-lg' 
										: 'text-gray-400 hover:bg-gray-800 hover:text-white hover:shadow-md'
								}`
							}
							style={({ isActive }) => ({ 
								animationDelay: `${index * 100}ms`,
								backgroundColor: isActive ? '#9747FF52' : 'transparent'
							})}
						>
							<item.icon />
							{item.label}
						</NavLink>
					))}
				</nav>

				{/* Credits card */}
				<div className="p-4 mt-auto space-y-3">
					<div 
						className="rounded-xl p-4 border border-white/10"
						style={{ background: 'rgba(255,255,255,0.05)' }}
					>
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium text-gray-400">Credit Disponible</span>
							<img src={creditstarImage} alt="" className="w-6 h-6 object-contain" />
						</div>
						<div className="flex items-baseline gap-1.5 mb-3">
							<span className="text-2xl font-bold text-white">{credits}</span>
							<span className="text-sm text-gray-400">TOKENS</span>
						</div>
						<div className="h-2 rounded-full bg-gray-700 overflow-hidden mb-4">
							<div 
								className="h-full rounded-full transition-all duration-300"
								style={{ 
									width: `${creditsPercent}%`, 
									background: 'linear-gradient(90deg, #6C5CE7, #9747FF)' 
								}}
							/>
						</div>
						<Link
							to="/settings?tab=billing"
							onClick={onClose}
							className="block w-full py-2.5 rounded-lg text-sm font-medium text-white text-center transition-opacity hover:opacity-90"
							style={{ backgroundColor: '#6C5CE7' }}
						>
							Buy Credit
						</Link>
					</div>

					{/* User and Déconnexion */}
					<div className="relative" ref={userMenuRef}>
						<button
							type="button"
							onClick={() => setUserMenuOpen((prev) => !prev)}
							className="flex items-center gap-3 w-full rounded-lg p-2 transition-colors hover:bg-white/5"
						>
							<div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-semibold text-lg" style={{ background: 'linear-gradient(135deg, #6C5CE7, #9747FF)' }}>
								{user?.name?.charAt(0).toUpperCase() || '?'}
							</div>
							<span className="text-sm font-medium text-white truncate text-left flex-1 min-w-0">{user?.name || 'User'}</span>
						</button>
						{userMenuOpen && (
							<div
								className="absolute bottom-full left-0 right-0 mb-1 py-3 rounded-xl min-w-[200px] z-50"
								style={{ background: 'rgba(15, 15, 19, 0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
							>
								{/* Header: icon + username + email */}
								<div className="flex items-center gap-3 px-4 pb-3 mb-3 border-b border-white/10">
									<div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-semibold text-lg" style={{ background: 'linear-gradient(135deg, #6C5CE7, #9747FF)' }}>
										{user?.name?.charAt(0).toUpperCase() || '?'}
									</div>
									<div className="min-w-0 flex-1">
										<p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
										<p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
									</div>
								</div>
								{/* Paramètres */}
								<Link
									to="/settings"
									onClick={() => { setUserMenuOpen(false); onClose(); }}
									className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white transition-colors"
								>
									<SettingsIcon />
									<span>Paramètres</span>
								</Link>
								{/* Separator */}
								<div className="border-t border-white/10 my-1" />
								{/* Se déconnecter */}
								<button
									type="button"
									onClick={handleLogout}
									className="flex items-center gap-3 w-full px-4 py-2.5 text-left text-sm font-medium text-red-300 hover:text-red-200 hover:bg-red-500/10 transition-colors"
								>
									<LogoutIcon />
									<span>Se déconnecter</span>
								</button>
							</div>
						)}
					</div>
				</div>
			</aside>
		</>
	);
}