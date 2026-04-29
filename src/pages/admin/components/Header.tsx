
import UserDropdown from "@/layout/components/UserDropdown";
import { useAuthStore } from "@/stores/useAuthStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useThemeStore } from "@/stores/useThemeStore";
import { Bell, MenuIcon, Moon, SearchIcon, Sun } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AdminHeader = () => {
	  const [showAuthModal, setShowAuthModal] = useState(false);
	  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	  const [isCollapsed, setIsCollapsed] = useState(false);
	
	  const [isRSidebarOpen, setIsRSidebarOpen] = useState(false);
	  const [isRCollapsed, setIsRCollapsed] = useState(true);
	
	  const { authUser, checkAuth } = useAuthStore();
	   const { isDark, toggleTheme } = useThemeStore();
	return (
		 <header >
          <div className="flex items-center justify-between max-w-screen-2xl mx-auto">

            {/* Mobile Menu Button */}
            {!isSidebarOpen && <button
              onClick={() => {
                setIsSidebarOpen(!isSidebarOpen)
                setIsCollapsed(false)
              }}
              className="lg:hidden p-2 hover:bg-secondary rounded-full transition"
            >
              <MenuIcon size={24} />
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
                <UserDropdown admin={true} user={authUser} />
              )}
            </div>
          </div>
        </header>

	);
};
export default AdminHeader;
