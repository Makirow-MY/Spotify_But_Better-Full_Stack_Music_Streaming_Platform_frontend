// New component: PlayerBar.tsx (Bottom player bar)
import { usePlayerStore } from "@/stores/usePlayerStore"; // Assuming it has current song, controls
import { Play, Pause, SkipBack, SkipForward, Volume2, Square, Maximize2, ChevronDown, Heart } from "lucide-react";
import { useState } from "react";

const PlayerBar = () => {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong } = usePlayerStore(); // Assume these exist or add
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
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
  );
};

export default PlayerBar;