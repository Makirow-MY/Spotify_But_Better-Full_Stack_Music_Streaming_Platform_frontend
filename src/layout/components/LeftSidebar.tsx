// components/LeftSidebar.tsx
import { useEffect} from "react";
import { Home,  Library,   X, ChevronLeft, ChevronRight, Volume2, } from "lucide-react";
import { useThemeStore } from "@/stores/useThemeStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAuthStore } from "@/stores/useAuthStore";


interface LeftSidebarProps {
  isOpen: boolean;           // For mobile drawer
  onClose: () => void;
  isCollapsed: boolean;      // For desktop collapse
  toggleCollapse: () => void;
  setShowAuthModal:(modal: boolean) => void
}

const LeftSidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }: LeftSidebarProps) => {
  	const { albums,setCurrentAlbum, currentAlbum,  fetchAlbums } = useMusicStore();
	const { currentSong, isPlaying, setCurrentSong, playAlbum } = usePlayerStore();
 
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
		  ${isCollapsed ? 'w-20' : 'w-[18rem]'}
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
		<nav className="px-3 space-y-1 py-2 w-full">
		  {[
			{ icon: Home, label: "Home", active: true },
			{ icon: Library, label: "Library", active: false },
		
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
	<div className="mt-6 px-3 flex-1 flex w-full flex-col overflow-hidden">
  <div className={`flex items-center justify-between mb-4 px-4 ${isCollapsed ? 'justify-center' : ''}`}>
    {!isCollapsed && (
      <h3 className="text-md font-semibold text-primary text-nowrap uppercase tracking-widest">
        My Albums Collections
      </h3>
    )}
   
  </div>

  <div className={`flex-1 ${isCollapsed ? "overflow-hidden" : "overflow-y-auto"} space-y-1 pr-2`}>
   {
	albums.length === 0 && <div className="w-full flex items-center flex-col gap-3 text-center pt-5 h-[50vh]">
  No album found yet. Visit studio to add one

	</div>
   }
    {albums.map((album) => {
      const isThisAlbumPlaying = 
        currentSong && 
        album.songs?.some((song: any) => song._id === currentSong._id) && 
        isPlaying;

      return (
        <button
          type="button"
          key={album._id}
          onClick={() => {setCurrentAlbum(album)
			setCurrentSong(null)
			playAlbum(album.songs, 0)
		  }}
          className={`group flex items-center gap-3 py-2.5 rounded-xl transition-all w-full relative overflow-hidden
            ${currentAlbum?._id === album._id 
              ? "bg-primary/10 border-l-4 border-primary" 
              : "hover:bg-secondary-foreground/10"
            }
            ${isCollapsed ? 'justify-center px-2' : 'px-4'}
          `}
        >
          {/* Album Art */}
          <div className="relative flex-shrink-0">
            <img 
              src={album.imageUrl} 
              className="w-10 h-10 bg-neutral-700 object-cover rounded-lg" 
              alt={album.title}
            />

            {/* Cool Playing Indicator */}
            {isThisAlbumPlaying && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 text-[10px] font-bold text-black px-1.5 py-0.5 rounded flex items-center gap-1 shadow-md">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-2 bg-black rounded-full animate-soundbar1" />
                  <div className="w-0.5 h-3 bg-black rounded-full animate-soundbar2" />
                  <div className="w-0.5 h-1.5 bg-black rounded-full animate-soundbar3" />
                </div>
              </div>
            )}
          </div>

          {/* Album Info - Only show when not collapsed */}
          {!isCollapsed && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium truncate line-clamp-1">
                {album.title}
              </p>
              
              <div className="flex items-center gap-2">
                <p className="text-xs text-muted-foreground truncate line-clamp-1">
                  {album.artist}
                </p>

                {isThisAlbumPlaying && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-500">
                    <Volume2 size={12} />
                    Playing
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Mini playing indicator when sidebar is collapsed */}
          {isCollapsed && isThisAlbumPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-black">
              <div className="w-2 h-2 bg-black rounded-full animate-ping" />
            </div>
          )}
        </button>
      );
    })}
  </div>
</div>
	  </aside>
	</>
  );
};

export default LeftSidebar;