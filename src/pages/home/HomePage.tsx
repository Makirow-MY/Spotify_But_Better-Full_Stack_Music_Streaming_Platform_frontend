// HomePage.tsx
import { useEffect, useState } from "react";
import { Menu,Bell, Sun, Moon,SearchIcon } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore"; // We'll create this

import AuthModal from "@/layout/components/AuthModal";

import FeaturedSection from "./components/FeaturedSection";
import SectionGrid from "./components/SectionGrid";
import { ScrollArea } from "@/components/ui/scroll-area";
import LeftSidebar from "@/layout/components/LeftSidebar";
import AudioPlayer from "@/layout/components/AudioPlayer";
import UserDropdown from "@/layout/components/UserDropdown";
import RightSidebar from "@/layout/components/RightSidebar";
import AlbumBanner from "../album/albumBanner";
import InfiniteScroll from "@/layout/components/InfiniteScroll";
import SearchBar from "@/layout/components/SearchBar";


const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isRSidebarOpen, setIsRSidebarOpen] = useState(false);
  const [isRCollapsed, setIsRCollapsed] = useState(true);

  const { authUser, checkAuth } = useAuthStore();
  const { fetchFeaturedSongs, fetchMadeForYouSongs, 
    allSongs,
    isLoading,
    isLoadingMore,
    hasMore,
    
    loadMoreSongs,
    fetchAllSongs,
    fetchTrendingSongs, albums, currentAlbum } = useMusicStore();
  const { initializeQueue , currentSong} = usePlayerStore();
  const { isDark, toggleTheme } = useThemeStore();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Fetch data + check auth
  useEffect(() => {
    checkAuth();
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
    fetchAllSongs(true);
  }, [checkAuth]);

  // Initialize player queue
  useEffect(() => {
   if (currentSong || currentAlbum) {
     initializeQueue(allSongs);
    }
   
  }, [initializeQueue, fetchMadeForYouSongs,fetchAllSongs, currentSong, currentAlbum ]);

  return (
    <div className={`flex h-screen overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-900'}`}>

      {/* Responsive Sidebar */}
      <LeftSidebar isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}

        <header className={`border-b ${isDark ? 'border-neutral-800 bg-black/80' : 'border-zinc-200 bg-white/80'} backdrop-blur-md px-4 py-3 z-40`}>
          <div className="flex items-center justify-between max-w-screen-2xl mx-auto">

            {/* Mobile Menu Button */}
            {!isSidebarOpen && <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen)
                setIsCollapsed(false)
              }}
              className="lg:hidden p-2 hover:bg-secondary rounded-full transition"
            >
              <Menu size={24} />
            </button>}

            <div className="flex-1 mx-4 hidden sm:block">
  <SearchBar />
</div>

            {/* Right Side Icons */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
                 <button className={`p-2 sm:hidden block rounded-full hover:bg-secondary transition ${isDark ? 'text-gray-300' : 'text-zinc-700'}`}>
                <SearchIcon size={20} />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full hover:bg-secondary transition ${isDark ? 'text-gray-300' : 'text-zinc-700'}`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Bell Icon */}
            
              <button className={`p-2 rounded-full hover:bg-secondary transition ${isDark ? 'text-gray-300' : 'text-zinc-700'}`}>
                <Bell size={20} />
              </button>

              {!authUser ? (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-full font-bold text-sm transition"
                >
                  Sign in
                </button>
              ) : (
                <UserDropdown user={authUser} />
              )}
            </div>
          </div>
        </header>

        {/* Main Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 md:p-6 lg:p-8 max-w-screen-2xl mx-auto">
            {/* {currentAlbum && <div className="h-[50vh] relative bg-white overflow-hidden rounded-sm">
              <img src={currentAlbum?.imageUrl || "/placeholder.svg"} className="absolute top-0 left-0 z-50 w-full h-full object-cover "/>
              <div className="absolute top-0 flex items-center justify-start left-0 bg-secondary-foreground/10 z-50 w-full h-full object-cover ">
                   <button className="mt-auto ml-[20%] mb-5 py-2 px-3 bg-primary">Play</button>
              </div>
            </div>} */}
                        {(albums.length > 0 && !currentAlbum) && <AlbumBanner album={albums[Math.floor(Math.random() * albums?.length)]} />}
            {(albums.length > 0 && !currentAlbum) && <FeaturedSection />}
                        {currentAlbum && <AlbumBanner album={currentAlbum} />}
            {currentAlbum && <FeaturedSection />}
            <div className="space-y-8">
           <div className="mt-12">
              <h2 className="text-3xl font-bold tracking-tight mb-6 px-2">Discover All Songs</h2>
              
              <InfiniteScroll
                loadMore={loadMoreSongs}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
              >
                <SectionGrid 
                  title="" 
                  songs={allSongs} 
                  isLoading={isLoading} 
                  columns={4}
                  showAllLink={false}
                />
              </InfiniteScroll>
            </div>
            </div>
          </div>
        </ScrollArea>

       {(currentSong || currentAlbum) && <AudioPlayer />}
      </div>

     {currentSong && <RightSidebar isCollapsed={isRCollapsed} onClose={() => setIsRSidebarOpen(false)} toggleCollapse={() => setIsRCollapsed(!isRCollapsed)} isOpen={isRSidebarOpen} />}

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default HomePage;