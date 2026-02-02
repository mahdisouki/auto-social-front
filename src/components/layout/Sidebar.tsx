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
	{ to: '/dashboard', label: 'Tableau de bord', icon: GridIcon },
	{ to: '/create', label: 'Creation de post', icon: PlusIcon },
	{ to: '/scheduler', label: 'Scheduler', icon: CalendarIcon },
	{ to: '/posts', label: 'Mes posts', icon: ImageIcon },
	{ to: '/chatbot', label: 'Chatbot', icon: ChatIcon },
	{ to: '/automations', label: 'Automations', icon: LightningIcon },
	{ to: '/settings', label: 'Paramètres', icon: SettingsIcon },
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
					fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out flex flex-col
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

				{/* Credit Disponible card - bottom of sidebar */}
				<div 
					className="mx-4 mb-6 p-4 rounded-xl"
					style={{ background: '#0E0E13', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', border: '1px solid #FFFFFF1A' }}
				>
					<div className="flex items-center justify-between mb-3">
						<span className="text-gray-300 text-xs font-medium uppercase tracking-wider">Credit Disponible</span>
						<svg className="w-4 h-4 text-[#9747FF]" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
							<path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm0 10l1.5 4.5L18 16l-4.5 1.5L12 22l-1.5-4.5L6 16l4.5-1.5L12 12z" />
						</svg>
					</div>
					<div className="flex items-baseline gap-2 mb-3">
						<span className="text-white text-2xl font-bold">75</span>
						<span className="text-white text-sm font-normal">TOKENS</span>
					</div>
					<div className="h-2 rounded-full mb-4 overflow-hidden" style={{ background: '#2A2A2A' }}>
						<div className="h-full rounded-full transition-all" style={{ width: '15%', background: '#9747FF' }} />
					</div>
					<button
						type="button"
						className="w-full py-2.5 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90"
						style={{ background: '#9747FF' }}
					>
						Acheter Credit
					</button>
				</div>
			</aside>
		</>
	);
}
