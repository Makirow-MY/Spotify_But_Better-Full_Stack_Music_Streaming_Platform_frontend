// components/AlbumBanner.tsx
import { Play, Pause} from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore";

import toast from "react-hot-toast";
import { useMusicStore } from "@/stores/useMusicStore";
import { Song} from "@/types";

interface AlbumBannerProps {
  album: {
   _id: string;
    title: string;
    artist: string;
    imageUrl: string;
    releaseYear: number;
    songs: Song[];
    description: string; 
  };
}

const AlbumBanner = ({ album }: AlbumBannerProps) => {
  const { 
    playAlbum, 
    currentSong, 
    isPlaying, 
    togglePlay ,
    setCurrentSong,
  } = usePlayerStore();
const {setCurrentAlbum} = useMusicStore()
  const { isDark } = useThemeStore();


  const handlePlayAlbum = () => {
    if (album.songs && album.songs.length > 0) {
        setCurrentAlbum(album)
        setCurrentSong(null)
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
        <div className="flex-1 flex flex-col justify-end text-secondary-foreground/50 pt-6 md:pt-0">
          <p className="text-sm uppercase tracking-[3px] font-medium text-green-400 mb-1">
            ALBUM • {album.songs?.length || 0} songs
          </p>

          <h1 className="text-5xl md:text-6xl text-white font-bold tracking-tighter mb-3">
            {album.title}
          </h1>

          <div className="flex items-center gap-3 text-zinc-300 mb-6">
            <span className="font-semibold text-secondary-foreground/50 text-xl">{album.artist}</span>
          </div>

          {album.description && (
            <p className=" line-clamp-2 max-w-2xl leading-relaxed mb-8">
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
         </div>
        </div>
      </div>

      
    </div>
  );
};

export default AlbumBanner;
