// components/AudioPlayer.tsx - FULLY MODIFIED WITH ALL SPOTIFY FEATURES
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useChatStore } from "@/stores/useChatStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, Repeat1, Shuffle, Heart, Mic2, ListMusic, 
  Laptop2, Plus, ChevronUp, SkipBack as SkipBack10,
  SkipForward as SkipForward10, FastForward, Rewind,
  PlusCircle, Music2, Trash2,
  Volume1
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// NEW: Playlist Drawer Component
const PlaylistDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const {albums, deleteAlbum  } = useMusicStore();
   const {currentSong, isPlaying  } = usePlayerStore();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { isDark } = useThemeStore();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
    //  createPlaylist(newPlaylistName);
      setNewPlaylistName("");
      toast.success(`Playlist "${newPlaylistName}" created!`);
    }
  };
  const isCurrentAlbumPlaying = 
    currentSong &&  isPlaying && albums.find((album) => album?.songs?.some(song => song._id === currentSong._id))

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className={`fixed bottom-20 right-4 w-80 ${isDark ? 'bg-zinc-900' : 'bg-white'} rounded-xl shadow-2xl border ${isDark ? 'border-zinc-800' : 'border-gray-200'} z-50 max-h-96 overflow-y-auto`}>
        <div className="p-4">
          <h3 className="font-bold mb-3">Your Playlists</h3>
          
          {/* Create new playlist */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="New playlist name..."
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              className={`flex-1 px-3 py-2 text-sm rounded-lg ${isDark ? 'bg-zinc-800 text-white' : 'bg-gray-100 text-black'} outline-none`}
            />
            <Button size="sm" onClick={handleCreatePlaylist} disabled={!newPlaylistName.trim()}>
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Playlists list */}
          <div className="space-y-2">
            {albums.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No playlists yet</p>
            ) : (
              albums.map((playlist) => (
                <div
                  key={playlist._id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                 isCurrentAlbumPlaying &&   isCurrentAlbumPlaying._id === playlist._id ? 'bg-green-500/20' : 'hover:bg-zinc-800/50'
                  }`}
                  onClick={() => {
                    //loadPlaylist(playlist.id);
                    onClose();
                    toast.success(`Loaded playlist: ${playlist.title}`);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Music2 className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{playlist.title}</p>
                      <p className="text-xs text-zinc-500">{playlist.songs.length} songs</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                     deleteAlbum(playlist._id);
                      toast.success("Playlist deleted");
                    }}
                  >
                    <Trash2 className="h-3 w-3 text-red-400" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// NEW: Queue Drawer Component
const QueueDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { queue, currentIndex, setCurrentSong, currentSong } = usePlayerStore();
  //const { currentAlbum } = useMusicStore();
  const { isDark } = useThemeStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className={`fixed bottom-20 right-4 w-96 ${isDark ? 'bg-zinc-900' : 'bg-white'} rounded-xl shadow-2xl border ${isDark ? 'border-zinc-800' : 'border-gray-200'} z-50 max-h-96 overflow-y-auto`}>
        <div className="p-4">
          <h3 className="font-bold mb-3">Queue</h3>
          <div className="space-y-2">
            {queue.map((song, idx) => (
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
                <img src={song.imageUrl} alt={song.title} className="w-10 h-10 rounded object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {idx === currentIndex && "▶ "}{song.title}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{song.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const AudioPlayer = () => {
  const { 
    currentSong, isPlaying, togglePlay, playNext, playPrevious,
    isLooping, isLoopingOne, toggleLoop, toggleLoopOne,
    isShuffled, toggleShuffle,
   // skipBackward, skipForward,
	 playbackRate, setPlaybackRate,
    volume, setVolume, isMuted, toggleMute,
   // saveCurrentQueueAsPlaylist
  } = usePlayerStore();
  
  const { isDark } = useThemeStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [prevSongRef, setPrevSongRef] = useState<string | null>(null);
  const [isPlaylistDrawerOpen, setIsPlaylistDrawerOpen] = useState(false);
  const [isQueueDrawerOpen, setIsQueueDrawerOpen] = useState(false);


  // Handle play/pause
  useEffect(() => {
    if (isPlaying) audioRef.current?.play();
    else audioRef.current?.pause();
  }, [isPlaying]);

  // Handle song changes
  useEffect(() => {
    if (!audioRef.current || !currentSong) return;

    const audio = audioRef.current;
    const isSongChange = prevSongRef !== currentSong?.audioUrl;
    
    if (isSongChange) {
      audio.src = currentSong?.audioUrl;
      audio.currentTime = 0;
      audio.playbackRate = playbackRate;
      setPrevSongRef(currentSong?.audioUrl);
      setCurrentTime(0);
      setDuration(0);

      if (isPlaying) {
        audio.play().catch(err => console.error("Play error:", err));
      }
    }
  }, [currentSong, isPlaying, playbackRate, prevSongRef]);

  // Setup audio event listeners
 useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const updateTime = () => setCurrentTime(audio.currentTime);
  const updateDuration = () => setDuration(audio.duration || 0);

  const handleEnded = () => {
    const { isLoopingOne } = usePlayerStore.getState();

    if (isLoopingOne) {
      audio.currentTime = 0;
      audio.play().catch(console.error);
    } else {
      playNext();   // This now handles Loop All + Shuffle correctly
    }
  };

  audio.addEventListener("timeupdate", updateTime);
  audio.addEventListener("loadedmetadata", updateDuration);
  audio.addEventListener("ended", handleEnded);

  return () => {
    audio.removeEventListener("timeupdate", updateTime);
    audio.removeEventListener("loadedmetadata", updateDuration);
    audio.removeEventListener("ended", handleEnded);
  };
}, [playNext]); // playNext is stable now

  // Sync volume with store
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Sync playback rate
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };



  const handlePlaybackRateChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
   
  };


  if (!currentSong) {
    return (
      <footer className={`h-20 ${isDark ? 'bg-black' : 'bg-white'} border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'} flex items-center justify-center px-4`}>
        <p className="text-zinc-500 text-sm">Select a song to start playing</p>
      </footer>
    );
  }

  return (
    <>
      <audio ref={audioRef} />
      
     
      	<footer className={`h-20 ${isDark ? 'bg-black' : "bg-white "} border-t border-neutral-800 flex items-center px-4`}>
	  {/* Now Playing Left */}
	  <div className="flex items-center space-x-4 flex-1 max-w-xs">
		<img
		  src={currentSong?.imageUrl || "/placeholder.jpg"}
		  alt={currentSong?.title}
		  className="w-12 h-12 rounded object-cover"
		/>
		<div className="min-w-0">
		  <p className="text-sm font-medium text-primary line-clamp-1 truncate">{currentSong?.title}</p>
		  <p className="text-xs text-muted-foreground line-clamp-1 truncate">{currentSong?.artist}</p>
		</div>
		{/* <Heart size={16} className="text-muted-foreground shrink-0 hover:text-primary cursor-pointer" /> */}
    <Button size='icon' variant='ghost' onClick={() => setIsPlaylistDrawerOpen(!isPlaylistDrawerOpen)}
                >
    <Plus   size={16} className="text-muted-foreground shrink-0 hover:text-primary cursor-pointer" />
	  </Button>
    </div>

	  {/* Controls Center */}
	  <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-lg'>

	  <div className="flex items-center flex-1 gap-1 justify-center">
      <Button size='icon' variant='ghost'
                  className={` ${isShuffled && 'text-green-500'}`}
                   onClick={toggleShuffle}
                 >
                   <Shuffle className="h-4 w-4" />
                 </Button>
		<Button 
    size='icon' variant='ghost'
		onClick={playPrevious}
							disabled={!currentSong}
	>
		  <SkipBack size={20} className="text-muted-foreground" />
		</Button>
		<Button
		  onClick={togglePlay}
		  disabled={!currentSong}
		  className="w-12 h-12 mr-1 ml-1 bg-primary rounded-full flex items-center justify-center text-black text-xl font-bold"
		>
		  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
		</Button>
		<audio ref={audioRef} />
		<Button onClick={playNext}  size='icon' variant='ghost'
							disabled={!currentSong}>
		  <SkipForward size={20} className="text-muted-foreground" />
		</Button>
		<Button  className={`${(isLooping || isLoopingOne) && 'text-green-500'}`}
  onClick={() => {
    if (!isLoopingOne && !isLooping) {
      toast.dismiss()
      toast.success("Repeat one")
      toggleLoopOne();        // First click → Repeat One
    } else if (isLoopingOne) {
      toast.dismiss()
      toast.success("Repeat all")
      toggleLoop();           // Second click → Loop All (Repeat)
    } else {
      toast.dismiss()
      toast.success("Repeat off")
      toggleLoop();           // Third click → Off
    }
   }} size='icon' variant='ghost'>
								  {isLoopingOne ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
								</Button>
		{/* <div className="flex items-center space-x-2">
		  <Square size={16} className="text-muted-foreground" />
		  <span className="text-xs text-gray-400">Queue</span>
		</div>
		<ChevronDown size={16} className="text-muted-foreground rotate-180" /> */}
	  </div>
	  <div className='hidden sm:flex items-center gap-2 w-full'>
							<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
							<Slider
								value={[currentTime]}
								max={duration || 100}
								step={1}
								className='w-full hover:cursor-grab active:cursor-grabbing'
								onValueChange={handleSeek}
							/>
							<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
						</div>

</div>
	  <div className='hidden sm:flex flex-col items-center  min-w-[180px] w-[30%] justify-end'>
					
          <div className="flex items-center gap-4">
          	<Button size='icon'
            onClick={handlePlaybackRateChange}
            variant='ghost' className='hover:text-white text-zinc-400'>
							{playbackRate}x
						</Button>
						<Button size='icon' variant='ghost'  onClick={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)} className='hover:text-white text-zinc-400'>
							<ListMusic className='h-4 w-4' />
						</Button>
						<Button onClick={() => setIsPlaylistDrawerOpen(!isPlaylistDrawerOpen)} size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
							<Laptop2 className='h-4 w-4' />
						</Button>
	  </div>

						 <div className="flex items-center gap-2">
                             <Button variant="ghost" size="icon" onClick={toggleMute} className="text-zinc-400 hover:text-white">
                               {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                             </Button>
                             <Slider
                               value={[isMuted ? 0 : volume]}
                               max={100}
                               step={1}
                               className="w-24"
                               onValueChange={(value) => setVolume(value[0])}
                             />
                           </div>

					</div>
	</footer>

      {/* Drawers */}
      <PlaylistDrawer isOpen={isPlaylistDrawerOpen} onClose={() => setIsPlaylistDrawerOpen(false)} />
      <QueueDrawer isOpen={isQueueDrawerOpen} onClose={() => setIsQueueDrawerOpen(false)} />
    </>
  );
};

export default AudioPlayer;
