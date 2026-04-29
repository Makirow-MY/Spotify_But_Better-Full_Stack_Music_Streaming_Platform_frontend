// New component: PlayerBar.tsx (Bottom player bar)
import { usePlayerStore } from "@/stores/usePlayerStore"; // Assuming it has current song, controls
import { Play, Pause, SkipBack, SkipForward, Volume2, Square, Maximize2, ChevronDown, Heart } from "lucide-react";
import { useState } from "react";

const PlayerBar = () => {
  const { currentSong, isPlaying, togglePlay, nextSong, prevSong } = usePlayerStore(); // Assume these exist or add
  const [volume, setVolume] = useState(50);
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <footer className="h-20 bg-black border-t border-neutral-800 flex items-center px-4">
      {/* Now Playing Left */}
      <div className="flex items-center space-x-4 flex-1 max-w-xs">
        <img
          src={currentSong?.imageUrl || "/placeholder.jpg"}
          alt={currentSong?.title}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{currentSong?.title}</p>
          <p className="text-xs text-gray-400 truncate">{currentSong?.artist}</p>
        </div>
        <Heart size={16} className="text-gray-300 hover:text-red-500 cursor-pointer" />
      </div>

      {/* Controls Center */}
      <div className="flex items-center space-x-6 flex-1 max-w-lg justify-center">
        <button className="p-1 hover:bg-white/10 rounded-full">
          <SkipBack size={20} className="text-gray-300" />
        </button>
        <button
          onClick={togglePlay}
          className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black text-xl font-bold"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="p-1 hover:bg-white/10 rounded-full">
          <SkipForward size={20} className="text-gray-300" />
        </button>
        <div className="flex items-center space-x-2">
          <Square size={16} className="text-gray-300" />
          <span className="text-xs text-gray-400">Queue</span>
        </div>
        <ChevronDown size={16} className="text-gray-300 rotate-180" />
      </div>

      {/* Volume Right */}
      <div className="flex items-center space-x-2 flex-1 max-w-xs justify-end">
        <div className="flex items-center space-x-2 w-24">
          <Square size={16} className="text-gray-300" />
          <div className="flex-1 bg-gray-600 rounded-full h-1">
            <div className="bg-white rounded-full h-1" style={{ width: `${volume}%` }} />
          </div>
          <Volume2 size={16} className="text-gray-300" />
        </div>
        <button className="ml-4 p-1 hover:bg-white/10 rounded-full">
          <Maximize2 size={16} className="text-gray-300" />
        </button>
      </div>
    </footer>
  );
};

export default PlayerBar;