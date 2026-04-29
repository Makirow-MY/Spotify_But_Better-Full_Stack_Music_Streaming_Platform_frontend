// components/AudioPlayer.tsx - FULLY MODIFIED WITH ALL SPOTIFY FEATURES
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, 
  Repeat, Repeat1, Shuffle, Heart, Mic2, ListMusic, 
  Laptop2, Plus, ChevronUp, SkipBack as SkipBack10,
  SkipForward as SkipForward10, FastForward, Rewind,
  PlusCircle, Music2, Trash2
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
  const { playlists, //createPlaylist, deletePlaylist, loadPlaylist,
	 currentPlaylistId } = usePlayerStore();
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const { isDark } = useThemeStore();

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
    //  createPlaylist(newPlaylistName);
      setNewPlaylistName("");
      toast.success(`Playlist "${newPlaylistName}" created!`);
    }
  };

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
            {playlists.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-4">No playlists yet</p>
            ) : (
              playlists.map((playlist) => (
                <div
                  key={playlist.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                    currentPlaylistId === playlist.id ? 'bg-green-500/20' : 'hover:bg-zinc-800/50'
                  }`}
                  onClick={() => {
                    //loadPlaylist(playlist.id);
                    onClose();
                    toast.success(`Loaded playlist: ${playlist.name}`);
                  }}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Music2 className="h-4 w-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{playlist.name}</p>
                      <p className="text-xs text-zinc-500">{playlist.songs.length} songs</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                     // deletePlaylist(playlist.id);
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
  const [isLiked, setIsLiked] = useState(false);

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
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);
    audio.volume = volume / 100;

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playNext, volume]);

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

  const handleSkipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
    }
  };

  const handlePlaybackRateChange = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    toast.success(`${nextRate}x speed`);
  };

  const handleSaveAsPlaylist = () => {
    const name = prompt("Enter playlist name:", `Playlist ${new Date().toLocaleDateString()}`);
    if (name) {
      //saveCurrentQueueAsPlaylist(name);
    }
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
      
      <footer className={`h-20 ${isDark ? 'bg-gradient-to-r from-zinc-900 to-black' : 'bg-white'} border-t ${isDark ? 'border-neutral-800' : 'border-gray-200'} fixed bottom-0 left-0 right-0 z-40`}>
        <div className="h-full flex items-center px-4 gap-4">
          
          {/* === NOW PLAYING (LEFT) === */}
          <div className="flex items-center gap-3 w-[30%] min-w-[180px]">
            <img
              src={currentSong?.imageUrl || "/placeholder.jpg"}
              alt={currentSong?.title}
              className="w-14 h-14 rounded-md object-cover shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentSong?.title}</p>
              <p className="text-xs text-zinc-400 truncate">{currentSong?.artist}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-400'}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 hidden sm:flex"
              onClick={handleSaveAsPlaylist}
            >
              <Plus className="h-5 w-5 text-zinc-400" />
            </Button>
          </div>

          {/* === PLAYBACK CONTROLS (CENTER) === */}
          <div className="flex-1 flex flex-col items-center gap-2 max-w-[45%]">
            <div className="flex items-center gap-2 md:gap-4">
              {/* Shuffle Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`hidden sm:flex ${isShuffled ? 'text-green-500' : 'text-zinc-400'}`}
                onClick={toggleShuffle}
              >
                <Shuffle className="h-4 w-4" />
              </Button>

              {/* Previous Button */}
              <Button variant="ghost" size="icon" onClick={playPrevious} className="text-zinc-400 hover:text-white">
                <SkipBack className="h-5 w-5" />
              </Button>

              {/* 10s Backward */}
              <Button variant="ghost" size="icon" onClick={handleSkipBackward} className="text-zinc-400 hover:text-white">
                <SkipBack10 className="h-5 w-5" />
              </Button>

              {/* Play/Pause Button */}
              <Button
                onClick={togglePlay}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause className="h-5 w-5 fill-black text-black" /> : <Play className="h-5 w-5 fill-black text-black ml-0.5" />}
              </Button>

              {/* 10s Forward */}
              <Button variant="ghost" size="icon" onClick={handleSkipForward} className="text-zinc-400 hover:text-white">
                <SkipForward10 className="h-5 w-5" />
              </Button>

              {/* Next Button */}
              <Button variant="ghost" size="icon" onClick={playNext} className="text-zinc-400 hover:text-white">
                <SkipForward className="h-5 w-5" />
              </Button>

              {/* Loop Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`hidden sm:flex ${isLooping || isLoopingOne ? 'text-green-500' : 'text-zinc-400'}`}
                onClick={isLoopingOne ? toggleLoopOne : toggleLoop}
              >
                {isLoopingOne ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
              </Button>
            </div>

            {/* Progress Bar */}
            <div className="hidden sm:flex items-center gap-2 w-full">
              <span className="text-xs text-zinc-400">{formatTime(currentTime)}</span>
              <Slider
                value={[currentTime]}
                max={duration || 100}
                step={1}
                className="flex-1"
                onValueChange={handleSeek}
              />
              <span className="text-xs text-zinc-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* === VOLUME & EXTRAS (RIGHT) === */}
          <div className="hidden sm:flex items-center justify-end gap-2 w-[30%] min-w-[180px]">
            {/* Playback Speed */}
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              onClick={handlePlaybackRateChange}
            >
              <span className="text-xs font-mono">{playbackRate}x</span>
            </Button>

            {/* Mic / Lyrics */}
            <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
              <Mic2 className="h-4 w-4" />
            </Button>

            {/* Queue Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              onClick={() => setIsQueueDrawerOpen(!isQueueDrawerOpen)}
            >
              <ListMusic className="h-4 w-4" />
            </Button>

            {/* Playlists Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-white"
              onClick={() => setIsPlaylistDrawerOpen(!isPlaylistDrawerOpen)}
            >
              <Laptop2 className="h-4 w-4" />
            </Button>

            {/* Volume Control */}
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
        </div>
      </footer>

      {/* Drawers */}
      <PlaylistDrawer isOpen={isPlaylistDrawerOpen} onClose={() => setIsPlaylistDrawerOpen(false)} />
      <QueueDrawer isOpen={isQueueDrawerOpen} onClose={() => setIsQueueDrawerOpen(false)} />
    </>
  );
};

export default AudioPlayer;

// // New component: PlayerBar.tsx (Bottom player bar)
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { usePlayerStore } from "@/stores/usePlayerStore"; // Assuming it has current song, controls
// import { useThemeStore } from "@/stores/useThemeStore";
// import { Play, Pause, SkipBack, SkipForward, Volume2, Square, Maximize2, ChevronDown, Heart, Repeat, Mic2, ListMusic, Laptop2, Volume1 } from "lucide-react";
// import { useEffect, useRef, useState } from "react";



// const formatTime = (seconds: number) => {
// 	const minutes = Math.floor(seconds / 60);
// 	const remainingSeconds = Math.floor(seconds % 60);
// 	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
// };


// const AudioPlayer = () => {
//   const { currentSong, isPlaying, togglePlay, // nextSong, prevSong 
//  playNext, playPrevious
//   } = usePlayerStore(); // Assume these exist or add
//   const audioRef = useRef<HTMLAudioElement>(null);
//   const { isDark, toggleTheme } = useThemeStore();
//   const [duration, setDuration] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//  const prevSongRef = useRef<string | null>(null);
//   const [volume, setVolume] = useState(50);
//   const [isExpanded, setIsExpanded] = useState(false);
// console.log({ currentSong, isPlaying, togglePlay})

// useEffect(() => {
// 		if (isPlaying) audioRef.current?.play();
// 		else audioRef.current?.pause();
// }, [isPlaying]);

// 	useEffect(() => {
// 		const audio = audioRef.current;

// 		const handleEnded = () => {
// 			playNext();
// 		};

// 		audio?.addEventListener("ended", handleEnded);

// 		return () => audio?.removeEventListener("ended", handleEnded);
// 	}, [playNext]);


// 		useEffect(() => {
			
// 			const audio = audioRef.current;
// 			if (!audio) return;
	
// 			const updateTime = () => setCurrentTime(audio.currentTime);
// 			const updateDuration = () => setDuration(audio.duration);
	
// 			audio.addEventListener("timeupdate", updateTime);
// 			audio.addEventListener("loadedmetadata", updateDuration);
	
// 			const handleEnded = () => {
// 				usePlayerStore.setState({ isPlaying: false });
// 			};
	
// 			audio.addEventListener("ended", handleEnded);
	
// 			return () => {
// 				audio.removeEventListener("timeupdate", updateTime);
// 				audio.removeEventListener("loadedmetadata", updateDuration);
// 				audio.removeEventListener("ended", handleEnded);
// 			};
// 		}, [currentSong]);

// 	useEffect(() => {
// 		if (!audioRef.current || !currentSong) return;

// 		const audio = audioRef.current;

// 		//check if this is actually a new song
// 		const isSongChange = prevSongRef.current !== currentSong?.audioUrl;
// 		if (isSongChange) {
// 			audio.src = currentSong?.audioUrl;
// 		//	reset the playback position
// 			audio.currentTime = 0;

// 			prevSongRef.current = currentSong?.audioUrl;

// 			if (isPlaying) audio.play();
// 		}
// 	}, [currentSong, isPlaying]);

// const handleSeek = (value: number[]) => {
// 		if (audioRef.current) {
// 			audioRef.current.currentTime = value[0];
// 		}
// 	};

//   return (
// 	<footer className={`h-20 ${isDark ? 'bg-black' : "bg-white "} border-t border-neutral-800 flex items-center px-4`}>
// 	  {/* Now Playing Left */}
// 	  <div className="flex items-center space-x-4 flex-1 max-w-xs">
// 		<img
// 		  src={currentSong?.imageUrl || "/placeholder.jpg"}
// 		  alt={currentSong?.title}
// 		  className="w-12 h-12 rounded object-cover"
// 		/>
// 		<div className="min-w-0">
// 		  <p className="text-sm font-medium text-primary line-clamp-1 truncate">{currentSong?.title}</p>
// 		  <p className="text-xs text-muted-foreground line-clamp-1 truncate">{currentSong?.artist}</p>
// 		</div>
// 		<Heart size={16} className="text-muted-foreground shrink-0 hover:text-red-500 cursor-pointer" />
// 	  </div>

// 	  {/* Controls Center */}
// 	  <div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>

// 	  <div className="flex items-center space-x-3 flex-1  justify-center">
// 		<button 
// 		onClick={playPrevious}
// 							disabled={!currentSong}
// 		className="p-1 hover:bg-white/10 rounded-full">
// 		  <SkipBack size={20} className="text-muted-foreground" />
// 		</button>
// 		<button
// 		  onClick={togglePlay}
// 		  disabled={!currentSong}
// 		  className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black text-xl font-bold"
// 		>
// 		  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
// 		</button>
// 		<audio ref={audioRef} />
// 		<button onClick={playNext}
// 							disabled={!currentSong} 	className="p-1 hover:bg-white/10 rounded-full">
// 		  <SkipForward size={20} className="text-muted-foreground" />
// 		</button>
// 		<button className="p-1 hover:bg-white/10 rounded-full" 					>
// 									<Repeat className='h-4 w-4' />
// 								</button>
// 		{/* <div className="flex items-center space-x-2">
// 		  <Square size={16} className="text-muted-foreground" />
// 		  <span className="text-xs text-gray-400">Queue</span>
// 		</div>
// 		<ChevronDown size={16} className="text-muted-foreground rotate-180" /> */}
// 	  </div>
// 	  <div className='hidden sm:flex items-center gap-2 w-full'>
// 							<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
// 							<Slider
// 								value={[currentTime]}
// 								max={duration || 100}
// 								step={1}
// 								className='w-full hover:cursor-grab active:cursor-grabbing'
// 								onValueChange={handleSeek}
// 							/>
// 							<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
// 						</div>

// </div>
// 	  {/* Volume Right */}
// 	  {/* <div className="flex items-center space-x-2 flex-1 max-w-xs justify-end">
// 		<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
// 								<Mic2 className='h-4 w-4' />
// 							</Button>
// 							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
// 								<ListMusic className='h-4 w-4' />
// 							</Button>
// 							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
// 								<Laptop2 className='h-4 w-4' />
// 							</Button>
// 		<div className="flex items-center space-x-2 w-24">
// 		  <Square size={16} className="text-muted-foreground" />
// 		 <div className='flex items-center gap-2'>
// 						<button className='hover:text-muted-foreground text-zinc-400'>
// 							  <Volume2 size={16} className="text-muted-foreground" />
// 						</button>

// 						<Slider
// 							value={[volume]}
// 							max={100}
// 							step={1}
// 							className='w-24 hover:cursor-grab active:cursor-grabbing'
// 							onValueChange={(value) => {
// 								setVolume(value[0]);
// 								if (audioRef.current) {
// 									audioRef.current.volume = value[0] / 100;
// 								}
// 							}}
// 						/>
// 					</div>
		
// 		</div>
// 		<button className="ml-4 p-1 hover:bg-white/10 rounded-full">
// 		  <Maximize2 size={16} className="text-muted-foreground" />
// 		</button>
// 	  </div> */}
// 	  <div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
// 						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
// 							<Mic2 className='h-4 w-4' />
// 						</Button>
// 						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
// 							<ListMusic className='h-4 w-4' />
// 						</Button>
// 						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
// 							<Laptop2 className='h-4 w-4' />
// 						</Button>
	  
// 						<div className='flex items-center gap-2'>
// 							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
// 								<Volume1 className='h-4 w-4' />
// 							</Button>
	  
// 							<Slider
// 								value={[volume]}
// 								max={100}
// 								step={1}
// 								className='w-24 hover:cursor-grab active:cursor-grabbing'
// 								onValueChange={(value) => {
// 									setVolume(value[0]);
// 									if (audioRef.current) {
// 										audioRef.current.volume = value[0] / 100;
// 									}
// 								}}
// 							/>
// 						</div>
// 					</div>
// 	</footer>
//   );
// };

// export default AudioPlayer;


