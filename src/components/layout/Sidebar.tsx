import { NavLink, Link } from 'react-router-dom';
import { 
	GridIcon, 
	PlusIcon, 
	CalendarIcon, 
	ImageIcon, 
	ChatIcon, 
	LightningIcon, 
	SettingsIcon,
	ShieldIcon,
	SparkleIcon
} from '../icons';
import { useAuthStore } from '../../stores/authStore';
import logoImage from '../../assets/postoruai.png';

const CREDITS_MAX = 100; // max for progress bar display

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const nav = [
	{ to: '/dashboard', label: 'Dashboard', icon: GridIcon },
	{ to: '/create', label: 'Create Post', icon: PlusIcon },
	{ to: '/scheduler', label: 'Scheduler', icon: CalendarIcon },
	{ to: '/posts', label: 'My Posts', icon: ImageIcon },
	{ to: '/chatbot', label: 'Chatbot', icon: ChatIcon },
	{ to: '/automations', label: 'Automations', icon: LightningIcon },
	{ to: '/settings', label: 'Settings', icon: SettingsIcon },
	{ to: '/privacy', label: 'Privacy Policy', icon: ShieldIcon },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const user = useAuthStore((s) => s.user);
	const credits = user?.credits ?? 0;
	const creditsPercent = Math.min(100, (credits / CREDITS_MAX) * 100);

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
				<div className="px-6 py-6">
					<div className="flex items-center justify-center">
						<img 
							src={logoImage} 
							alt="POSTORY AI" 
							className="h-auto w-full max-w-[180px] object-contain"
						/>
					</div>
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
				<div className="p-4 mt-auto">
					<div 
						className="rounded-xl p-4 border border-white/10"
						style={{ background: 'rgba(255,255,255,0.05)' }}
					>
						<div className="flex items-center justify-between mb-2">
							<span className="text-xs font-medium text-gray-400">Available Credit</span>
							<SparkleIcon className="w-4 h-4 text-primary" />
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
				</div>
			</aside>
		</>
	);
}
