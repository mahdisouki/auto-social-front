import { NavLink } from 'react-router-dom';
import { 
	GridIcon, 
	PlusIcon, 
	CalendarIcon, 
	ImageIcon, 
	ChatIcon, 
	LightningIcon, 
	SettingsIcon
} from '../icons';
import logoImage from '../../assets/postoruai.png';

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
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
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
					fixed inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 ease-in-out
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
				<nav className="px-4 space-y-1">
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
				
			</aside>
		</>
	);
}
