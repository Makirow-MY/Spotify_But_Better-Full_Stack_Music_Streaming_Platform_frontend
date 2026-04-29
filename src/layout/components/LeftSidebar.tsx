// components/LeftSidebar.tsx
import { useEffect, useState } from "react";
import { Home, Search, Library, PlusCircle,  X, ChevronLeft, ChevronRight, } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useMusicStore } from "@/stores/useMusicStore";

interface LeftSidebarProps {
  isOpen: boolean;           // For mobile drawer
  onClose: () => void;
  isCollapsed: boolean;      // For desktop collapse
  toggleCollapse: () => void;
}

const LeftSidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }: LeftSidebarProps) => {
  	const { albums, deleteAlbum, fetchAlbums } = useMusicStore();
  

	const [playlists] = useState(Array.from({ length: 6 }, (_, i) => `My Playlist ${i + 1}`));
const { isDark } = useThemeStore();
	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);
  return (
	<>
	  {/* Mobile Overlay */}
	  {isOpen && (
		<div 
		  className="fixed inset-0 bg-black/70 z-50 lg:hidden"
		  onClick={onClose}
		/>
	  )}

	  <aside 
		className={`
		  fixed lg:static inset-y-0 left-0 z-50 
		  border-r border-neutral-800 
		  flex flex-col h-full transition-all duration-300
		  ${isOpen ? isDark ? 'bg-black/80 translate-x-0' : "bg-white/80 translate-x-0" : '-translate-x-full lg:translate-x-0'}
		  ${isCollapsed ? 'w-20' : 'w-60'}
		`}
	  >
		{/* Header */}
		<div className="flex items-center justify-between p-6">
		  <h1 className={`font-bold text-green-500 transition-all ${isCollapsed ? 'text-2xl' : 'text-2xl'}`}>
			{isCollapsed ? "S" : "Spotify"}
		  </h1>

		  {/* Collapse Toggle Button - Only visible on large screens */}
		  <button 
			onClick={toggleCollapse}
			className="hidden lg:block text-primary p-1 rounded-full hover:bg-primary/10"
		  >
			{isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
		  </button>
        
		  {/* Close button for mobile only */}
		  <button 
			onClick={onClose} 
			className="lg:hidden text-primary"
		  >
			<X size={28} />
		  </button>
		</div>

		{/* Navigation */}
		<nav className="px-3 space-y-1 py-2">
		  {[
			{ icon: Home, label: "Home", active: true },
			{ icon: Search, label: "Search" },
			{ icon: Library, label: "Your Library" },
		  ].map((item, i) => (
			<a
			  key={i}
			  href="#"
			  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all
				${item.active ? 'bg-primary' : 'hover:bg-primary'}
				${isCollapsed ? 'justify-center' : ''}`}
			>
			  <item.icon size={24} />
			  {!isCollapsed && <span>{item.label}</span>}
			</a>
		  ))}
		</nav>

		{/* Playlists Section */}
		<div className="mt-6 px-3 flex-1 flex flex-col overflow-hidden">
		  <div className={`flex items-center justify-between mb-4 px-4 ${isCollapsed ? 'justify-center' : ''}`}>
			{!isCollapsed && (
			  <h3 className="text-xs font-semibold text-primary uppercase tracking-widest">
				My Albums
			  </h3>
			)}
			<PlusCircle size={20} className="text-primary cursor-pointer" />
		  </div>

		  <div className={`flex-1 ${isCollapsed ? "overflow-hidden" : "overflow-y-auto"}  space-y-1 pr-2`}>
			{albums.map((playlist, index) => (
			  <a
				key={index}
				href={`/album/${playlist._id}`}
				className={`flex items-center gap-3 py-2.5 rounded-xl hover:bg-secondary-foreground/20 transition-all
				  ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
			  >
				<img src={playlist.imageUrl} className="w-10 h-10 bg-neutral-700 object-cover rounded flex-shrink-0" />
				{!isCollapsed && (
				  <span className="text-sm truncate">{playlist.title}</span>
				)}
			  </a>
			))}
		  </div>
		</div>
	  </aside>
	</>
  );
};

export default LeftSidebar;