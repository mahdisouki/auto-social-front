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

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

const nav = [
	{ to: '/', label: 'Dashboard', icon: GridIcon },
	{ to: '/create-post', label: 'Create Post', icon: PlusIcon },
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
			<aside className={`
				fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
				${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
			`}>
				<div className="px-6 py-6">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
							<LightningIcon />
						</div>
						<span className="text-xl font-bold text-gray-900 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
							AutoSocial
						</span>
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
										? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg' 
										: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md'
								}`
							}
							style={{ animationDelay: `${index * 100}ms` }}
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
