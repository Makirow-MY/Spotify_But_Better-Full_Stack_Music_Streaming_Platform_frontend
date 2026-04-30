
import UserDropdown from "@/layout/components/UserDropdown";
import { useAuthStore } from "@/stores/useAuthStore";

import { useThemeStore } from "@/stores/useThemeStore";
import { Bell, Moon, SearchIcon, Sun } from "lucide-react";

const AdminHeader = () => {
	  const { authUser } = useAuthStore();
	   const { isDark, toggleTheme } = useThemeStore();
	return (
		 <header >
          <div className="flex items-center justify-between max-w-screen-2xl mx-auto">

            
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

               <UserDropdown admin={true} user={authUser} />
             
            </div>
          </div>
        </header>

	);
};
export default AdminHeader;
