// components/SearchBar.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Music, AlbumIcon} from "lucide-react";
import { Song, Album } from "@/types";

import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { useMusicStore } from "@/stores/useMusicStore";
import toast from "react-hot-toast";

type SearchResult = {
  type: "song" | "album";
  id: string;
  title: string;
  subtitle: string;
  imageUrl?: string;
  data: Song | Album;
  song: Song[];
  matchType?: "title" | "artist" | "album";
};

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useThemeStore();
 const searchRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    allSongs = [],
    albums = [],
 
  } = useMusicStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // Enhanced search function with filtering by title, artist, or album name
  const search = useCallback(async (searchTerm: string) => {
    const trimmedTerm = searchTerm.trim();
    
    if (!trimmedTerm) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert search term to lowercase for case-insensitive search
      const lowerSearchTerm = trimmedTerm.toLowerCase();
      
      // Filter songs by title OR artist
      const matchedSongs: SearchResult[] = (allSongs || [])
        .filter((song) => {
          const matchesTitle = song.title?.toLowerCase().includes(lowerSearchTerm);
          const matchesArtist = song.artist?.toLowerCase().includes(lowerSearchTerm);
          return matchesTitle || matchesArtist;
        })
        .map((song) => ({
          type: "song" as const,
          id: song._id,
          title: song.title,
          subtitle: song.artist || "Unknown Artist",
          imageUrl: song.imageUrl,
          data: song,
          song:[{...song}],
          matchType: song.title?.toLowerCase().includes(lowerSearchTerm) ? "title" : "artist"
        }));

      // Filter albums by title OR artist
      const matchedAlbums: SearchResult[] = (albums || [])
        .filter((album) => {
          const matchesTitle = album.title?.toLowerCase().includes(lowerSearchTerm);
          const matchesArtist = album.artist?.toLowerCase().includes(lowerSearchTerm);
          return matchesTitle || matchesArtist;
        })
        .map((album) => ({
          type: "album" as const,
          id: album._id,
          title: album.title,
          subtitle: album.artist || "Unknown Artist",
          imageUrl: album.imageUrl,
          data: album,
          song:album.songs,
          matchType: album.title?.toLowerCase().includes(lowerSearchTerm) ? "title" : "artist"
        }));

      // Combine and sort results by relevance
      let combinedResults = [...matchedSongs, ...matchedAlbums];
      
      // Sort: Exact matches first, then starts with, then contains
      combinedResults.sort((a, b) => {
        const aExact = a.title.toLowerCase() === lowerSearchTerm;
        const bExact = b.title.toLowerCase() === lowerSearchTerm;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const aStarts = a.title.toLowerCase().startsWith(lowerSearchTerm);
        const bStarts = b.title.toLowerCase().startsWith(lowerSearchTerm);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        
        return 0;
      });

      // Limit to top 15 results for performance
      setResults(combinedResults.slice(0, 10).sort(() => Math.random() * 0.5));
      
       } catch (error) {
      //console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [allSongs, albums]);

  // Debounced search with loading indicator
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (query.trim()) {
      debounceTimeout.current = setTimeout(() => {
        search(query);
      }, 300);
    } else {
      setResults([]);
      setIsLoading(false);
    }

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [query, search]);

  const handleSelect = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    setResults([]);

    if (result.type === "song") {
      // Play the selected song
      const { setCurrentSong, currentSong,  togglePlay } = usePlayerStore.getState();
     togglePlay();
      setCurrentSong(result.data as Song);
      if (currentSong) {
        togglePlay();
      }
      
      toast.success(`Now playing: ${result.title}`);
    } else if (result.type === "album") {
        const { setCurrentAlbum, currentAlbum } = useMusicStore.getState();
          const { playAlbum  } = usePlayerStore.getState();
        setCurrentAlbum(result.data as Album)
       if (currentAlbum) {
        playAlbum(currentAlbum.songs, 0);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
   // navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Get icon based on result type
  const getResultIcon = (result: SearchResult) => {
    if (result.type === "song") {
      return <Music className="h-4 w-4 text-green-500" />;
    }
    return <AlbumIcon className="h-4 w-4 text-blue-500" />;
  };

  // Get match badge
  const getMatchBadge = (result: SearchResult) => {
    if (result.matchType === "artist") {
      return (
        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
          By Artist
        </span>
      );
    }
    if (result.type === "album") {
      return (
        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
          Album
        </span>
      );
    }
    return null;
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`flex items-center px-4 py-2.5 rounded-full transition-all border ${
            isOpen 
              ? isDark 
                ? "bg-neutral-800 border-green-500 ring-2 ring-green-500/20" 
                : "bg-white border-green-400 ring-2 ring-green-400/20"
              : isDark 
                ? "bg-neutral-800 border-transparent" 
                : "bg-zinc-200 border-transparent"
          }`}
        >
          <Search size={20} className="text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="Search by song, artist, or album..."
            className={`bg-transparent outline-none ml-3 w-full text-sm ${
              isDark ? "placeholder:text-gray-500 text-white" : "placeholder:text-zinc-500 text-zinc-900"
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="text-gray-400 hover:text-secondary-foreground p-1 transition"
            >
              <X size={18} />
            </button>
          )}
        </div>
         </form>

      {/* Search Suggestions Dropdown */}
      {isOpen && (query || isLoading) && (
        <div className={`absolute mt-2 w-full rounded-xl shadow-2xl overflow-hidden z-50 border ${
          isDark ? "bg-neutral-900 border-neutral-700" : "bg-white border-zinc-200"
        }`}>
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent" />
                <span className="text-sm text-gray-500">Searching...</span>
              </div>
            </div>
          ) : results.length > 0 ? (
            <>
              {/* Results header */}
              <div className="px-4 py-2 border-b border-zinc-800">
                <p className="text-xs text-zinc-500 uppercase tracking-wider">
                  Top Results ({results.length})
                </p>
              </div>
              
              <div className="max-h-[460px] overflow-auto py-2">
                {results.map((result, index) => (
                  <div
                    key={`${result.type}-${result.id}-${index}`}
                    onClick={() => handleSelect(result)}
                    className={`flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/50 cursor-pointer transition group ${
                      isDark ? "hover:bg-zinc-800" : "hover:bg-zinc-100"
                    }`}
                  >
                    {/* Album Art */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={result.imageUrl || "/default-cover.jpg"}
                        alt={result.title}
                        className="w-12 h-12 rounded-md object-cover shadow-md"
                      />
                      <div className="absolute inset-0 bg-black/50 rounded-md opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        {getResultIcon(result)}
                      </div>
                    </div>
                    
                    {/* Result Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-medium truncate">
                          {result.title}
                        </p>
                        {getMatchBadge(result)}
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-zinc-500 truncate">
                          {result.subtitle}
                        </p>
                       {result.type === "album"  &&
                    <><span className="text-xs text-zinc-600">•</span>
                        <p className="text-xs text-zinc-500 capitalize">
                        {result.song.length} Songs
                        </p>
                        </>}
                      </div>
                    </div>
                    
                    {/* Play indicator on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <Music className="h-4 w-4 text-black" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* View all results footer */}
              {results.length > 0 && (
                <div className={`border-t ${isDark ? 'border-zinc-800' : 'border-zinc-200'} p-2`}>
                  <button
                    onClick={handleSubmit}
                    className="w-full text-center text-sm text-green-500 hover:text-green-400 py-2 transition"
                  >
                    View all results for "{query}"
                  </button>
                </div>
              )}
            </>
          ) : query && !isLoading ? (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center gap-2">
                <Search className="h-12 w-12 text-zinc-600" />
                <p className="text-zinc-500 font-medium">No results found</p>
                <p className="text-sm text-zinc-600">
                  We couldn't find anything matching "{query}"
                </p>
                <button
                  onClick={handleSubmit}
                  className="mt-2 text-sm text-green-500 hover:text-green-400 transition"
                >
                  Search for "{query}" anyway
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
      
      {/* Search hint when dropdown is closed but has query */}
      {!isOpen && query && results.length > 0 && (
        <div className="absolute -bottom-8 left-0 text-xs text-zinc-500">
          Press Enter to see all results
        </div>
      )}
    </div>
  );
};

export default SearchBar;