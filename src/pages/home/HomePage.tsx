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


const HomePage = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [isRSidebarOpen, setIsRSidebarOpen] = useState(false);
  const [isRCollapsed, setIsRCollapsed] = useState(true);

  const { authUser, checkAuth } = useAuthStore();
  const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, madeForYouSongs, featuredSongs, trendingSongs } = useMusicStore();
  const { initializeQueue } = usePlayerStore();
  const { isDark, toggleTheme } = useThemeStore();

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  // Fetch data + check auth
  useEffect(() => {
    checkAuth();
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [checkAuth, fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  // Initialize player queue
  useEffect(() => {
    if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
      const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
      initializeQueue(allSongs);
    }
  }, [initializeQueue, madeForYouSongs, featuredSongs, trendingSongs]);

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

            {/* Search Bar */}
            <form className="flex-1 mx-4 sm:flex hidden">
              <div className={`flex items-center px-4 py-2.5 flex-1 max-w-md rounded-full ${isDark ? 'bg-neutral-800' : 'bg-zinc-200'}`}>
                <SearchIcon size={20} className="text-gray-400" />
                <input
                  placeholder="What do you want to play?"
                  className={`bg-transparent outline-none ml-3 w-full text-sm ${isDark ? 'placeholder:text-gray-500' : 'placeholder:text-zinc-500'}`}
                />
              </div>
            </form>

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
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Good afternoon</h1>
            <FeaturedSection />
            <div className="space-y-8 mt-10">
              <SectionGrid title="Made For You" songs={madeForYouSongs || []} isLoading={false} />
              <SectionGrid title="Trending" songs={trendingSongs || []} isLoading={false} />
            
               <SectionGrid title="Albums" songs={trendingSongs || []} isLoading={false} />
            </div>
          </div>
        </ScrollArea>

        <AudioPlayer />
      </div>

      <RightSidebar isCollapsed={isRCollapsed} onClose={() => setIsRSidebarOpen(false)} toggleCollapse={() => setIsRCollapsed(!isRCollapsed)} isOpen={isRSidebarOpen} />

      {/* Auth Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default HomePage;