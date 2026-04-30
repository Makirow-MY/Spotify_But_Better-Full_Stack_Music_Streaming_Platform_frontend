// New component: Header.tsx (Minimal top bar for profile/settings)
//import { useAuthStore } from "../stores/useAuthStore";
import {Bell, Sun} from "lucide-react";

 const MainHeader = () => {
    const [setShowAuthModal] = useState(false);
    const [setIsSidebarOpen] = useState(false);
  
    const { authUser, checkAuth } = useAuthStore();
    const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs, madeForYouSongs, featuredSongs, trendingSongs } = useMusicStore();
    const { initializeQueue } = usePlayerStore();
    const { isDark, toggleTheme } = useThemeStore();
  
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
     <header className={`border-b ${isDark ? 'border-neutral-800 bg-black/80' : 'border-zinc-200 bg-white/80'} backdrop-blur-md px-4 py-3 z-50`}>
              <div className="flex items-center justify-between max-w-screen-2xl mx-auto">
                
                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-white/10 rounded-full transition"
                >
                  <Menu size={24} />
                </button>
    
                {/* Search Bar */}
                <form className="flex-1 max-w-md mx-4">
                  <div className={`flex items-center px-4 py-2.5 rounded-full ${isDark ? 'bg-neutral-800' : 'bg-zinc-200'}`}>
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
              <button
                              onClick={toggleTheme}
                              className={`p-2 rounded-full hover:bg-secondary transition ${isDark ? 'text-gray-300' : 'text-zinc-700'}`}
                            >
                              {!isDark ? <Moon /> :<Sun/>}
                            </button>
    
                  {/* Bell Icon */}
                  <button className={`p-2 rounded-full hover:bg-white/10 transition ${isDark ? 'text-gray-300' : 'text-zinc-700'}`}>
                    <Bell size={20} />
                  </button>
    
                  {!authUser ? (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="bg-green-500 hover:bg-green-600 text-black px-6 py-2 rounded-full font-bold text-sm transition"
                    >
                      Sign up
                    </button>
                  ) : (
                    <UserDropdown user={authUser} />
                  )}
                </div>
              </div>
 </header>
    
  );
};

export default MainHeader
