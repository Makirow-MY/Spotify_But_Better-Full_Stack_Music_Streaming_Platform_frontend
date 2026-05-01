
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { ChevronLeft, Music4Icon, X } from "lucide-react";
import { useEffect,  } from "react";


interface RightSidebarProps {
  isOpen: boolean;           // For mobile drawer
  onClose: () => void;
  isCollapsed: boolean;      // For desktop collapse
  toggleCollapse: () => void;
}

const RightSidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }: RightSidebarProps) => {
const { isDark} = useThemeStore();
		const { fetchUsers, authUser } = useAuthStore();
		const { currentAlbum } = useMusicStore();
   const {currentSong, currentIndex, isPlaying, queue, setCurrentSong , } = usePlayerStore();
  		useEffect(() => {
			if (authUser) fetchUsers();
		}, [fetchUsers, authUser]);


  return (
	<>
	  {/* Mobile Overlay */}
	  {isOpen && (
		<div 
		  className="fixed inset-0  bg-black/70 z-50 lg:hidden"
		  onClick={onClose}
		/>
	  )}

	  <aside 
		className={`
		  fixed lg:static inset-y-0 right-0 z-50 
		  border-l border-neutral-800 
		   flex flex-col h-full transition-all duration-300
		  ${isOpen  ? isDark ? ' translate-x-0' : " bg-red-600 translate-x-0" : 'translate-x-0'}
		  ${isCollapsed ? 'w-20' : 'w-60'}
		`}
	  >
		{/* Header */}
		<div className="flex items-center  gap-2 justify-between  p-6 pb-0">
			{
			!isCollapsed &&  <Button size={"icon"} variant={"ghost"}
			onClick={toggleCollapse}
			className="hidden lg:block absolute top-1 right-2 hover:text-red-500 p-1 hover:bg-secondary/10"
		  > <X size={22} /> </Button>
			}
			{
			authUser && authUser.isAdmin && isCollapsed &&  <Button
			variant={"outline"}
			size={"icon"} 
			onClick={toggleCollapse}
			className="hidden lg:block p-1 hover:bg-secondary/10"
		  > <ChevronLeft size={22} /> </Button>
			}

			{!isCollapsed && <div className='flex items-center text-primary flex-1 shrink-0 gap-1'>
				<button
			className="pointer-events-none bg-transparent"
		  > <Music4Icon size={22} /> </button>
				 <h1 className={`font-bold text-nowrap transition-all ${!isCollapsed && 'text-lg md:text-md'}`}>
			{currentAlbum ? `${currentAlbum.title} (Playing...)` : "My Song Playlist"}
		  </h1>

							</div>}
		
			</div>
		<ScrollArea className='flex-1'>
						<div className='p-4 space-y-4'>
						 <div className="space-y-2">
            {queue.map((song, idx) => 
			{
				const isThisAlbumPlaying = 
        currentSong &&  song._id === currentSong._id && isPlaying;

				return(
				
              <div
                key={song._id}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition ${
                  currentSong?._id === song._id ? 'bg-green-500/20' : 'hover:bg-zinc-800/50'
                }`}
                onClick={() => {
                  setCurrentSong(song);
                  onClose();
                }}
              >
                 <div className="relative flex-shrink-0">
            <img 
              src={song.imageUrl} 
              className="w-10 h-10 bg-neutral-700 object-cover rounded-lg" 
              alt={song.title}
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

 <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {idx === currentIndex && "▶ "}{song.title}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{song.artist} </p>
                </div>
              </div>
            )})}
          </div>
						</div>
					</ScrollArea>
	  </aside>
	</>
  );
};

export default RightSidebar;

