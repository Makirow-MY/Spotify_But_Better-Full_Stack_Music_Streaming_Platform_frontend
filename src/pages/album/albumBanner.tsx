// components/AlbumBanner.tsx
import { Play, Pause, Heart, MoreHorizontal, Clock, ChevronDown, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useState } from "react";
import toast from "react-hot-toast";

interface AlbumBannerProps {
  album: {
    _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    year?: number;
    songs?: any[];
    description?: string;
  };
}

const AlbumBanner = ({ album }: AlbumBannerProps) => {
  const { 
    playAlbum, 
    currentSong, 
    isPlaying, 
    togglePlay 
  } = usePlayerStore();

  const { isDark } = useThemeStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePlayAlbum = () => {
    if (album.songs && album.songs.length > 0) {
      playAlbum(album.songs, 0);
      toast.success(`Now playing: ${album.title}`);
    }
  };

  // Check if this album is currently playing
  const isCurrentAlbumPlaying = 
    currentSong && 
    album.songs?.some(song => song._id === currentSong._id) && 
    isPlaying;

  return (
    <div className="relative group mb-8">
      {/* Background Gradient & Blur Effect */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent rounded-xl"
        style={{
          backgroundImage: `linear-gradient(to bottom, ${!isDark ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.4)'}, transparent)`
        }}
      />
      
      {/* Main Banner Container */}
      <div className="relative flex flex-col md:flex-row gap-6 md:gap-8 p-6 md:p-10 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
        
        {/* Background Image */}
        <div className="absolute inset-0 -z-10">
          <img 
            src={album.imageUrl} 
            alt={album.title}
            className="w-full h-full object-cover scale-110 blur-md brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
        </div>

        {/* Album Art */}
        <div className="flex-shrink-0 relative">
          <div className="w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/20">
            <img 
              src={album.imageUrl} 
              alt={album.title}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
            />
          </div>

          {/* Cool Playing Indicator Overlay */}
          {isCurrentAlbumPlaying && (
            <div className="absolute -top-3 -right-3 bg-green-500 text-black text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg animate-pulse">
              <div className="flex gap-1">
                <div className="w-1.5 h-3 bg-black rounded-full animate-soundbar1" />
                <div className="w-1.5 h-4 bg-black rounded-full animate-soundbar2" />
                <div className="w-1.5 h-2 bg-black rounded-full animate-soundbar3" />
              </div>
              <span>NOW PLAYING</span>
            </div>
          )}

          {/* Play Button Overlay
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 rounded-2xl">
            <Button
              onClick={handlePlayAlbum}
              className="w-20 h-20 rounded-full bg-green-500 hover:bg-green-400 hover:scale-110 transition-all shadow-2xl flex items-center justify-center"
            >
              {isCurrentAlbumPlaying ? (
                <Pause className="h-10 w-10 fill-black text-black" />
              ) : (
                <Play className="h-10 w-10 fill-black text-black ml-1" />
              )}
            </Button>
          </div> */}
        </div>

        {/* Album Info */}
        <div className="flex-1 flex flex-col justify-end text-white pt-6 md:pt-0">
          <p className="text-sm uppercase tracking-[3px] font-medium text-green-400 mb-1">
            ALBUM • {album.year || new Date().getFullYear()}
          </p>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-3">
            {album.title}
          </h1>

          <div className="flex items-center gap-3 text-zinc-300 mb-6">
            <span className="font-semibold text-white text-xl">{album.artist}</span>
            <span className="text-2xl text-zinc-500">•</span>
            <span className="text-lg">{album.songs?.length || 0} songs</span>
          </div>

          {album.description && (
            <p className="text-zinc-400 max-w-2xl leading-relaxed mb-8">
              {album.description}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button
              onClick={isCurrentAlbumPlaying ? togglePlay : handlePlayAlbum}
              className="bg-green-500 hover:bg-green-400 text-black font-bold px-10 py-3 rounded-full text-lg transition-all hover:scale-105 shadow-xl flex items-center gap-3"
            >
              {isCurrentAlbumPlaying ? (
                <>
                  <Pause className="h-6 w-6 fill-black" /> Pause
                </>
              ) : (
                <>
                  <Play className="h-6 w-6 fill-black ml-1" /> Play
                </>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsLiked(!isLiked);
                toast.success(isLiked ? "Removed from Liked Songs" : "Added to Liked Songs");
              }}
              className="w-14 h-14 hover:bg-white/10 rounded-full transition-all"
            >
              <Heart 
                className={`h-7 w-7 transition-all ${isLiked ? 'fill-green-500 text-green-500 scale-110' : 'text-white'}`} 
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-14 h-14 hover:bg-white/10 rounded-full transition-all"
            >
              <MoreHorizontal className="h-7 w-7 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className={`absolute top-20 right-6 w-56 rounded-xl shadow-2xl ${isDark ? 'bg-zinc-900 border border-zinc-700' : 'bg-white border border-gray-200'} z-50 py-2`}>
          <button className="w-full text-left px-5 py-3 hover:bg-white/10 flex items-center gap-3 text-sm">
            <Heart className="h-4 w-4" /> Add to Playlist
          </button>
          <button className="w-full text-left px-5 py-3 hover:bg-white/10 flex items-center gap-3 text-sm">
            <Clock className="h-4 w-4" /> Go to Artist
          </button>
          <button className="w-full text-left px-5 py-3 hover:bg-white/10 flex items-center gap-3 text-sm">
            <ChevronDown className="h-4 w-4" /> Share Album
          </button>
        </div>
      )}
    </div>
  );
};

export default AlbumBanner;
