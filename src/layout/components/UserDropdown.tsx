// components/UserDropdown.tsx
import { useState } from "react";
import { ChevronDown, User, LogOut, Mic, HomeIcon, VideoIcon } from "lucide-react";
//import ProfileModal from "./ProfileModal";
import { useAuthStore } from "@/stores/useAuthStore";
import ProfileModal from "./ProfileModal";

const UserDropdown = ({ user, admin }: {user:any; admin?:boolean}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { logout } = useAuthStore();

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-primary px-3 py-1.5 rounded-full transition"
      >
        <img
          src={user.imageUrl || "/default-avatar.png"}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover border border-green-500"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium truncate">{user.fullName}</p>
        </div>
        <ChevronDown size={18} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div onMouseLeave={() => setIsOpen(false)} className="absolute right-0 mt-2 w-56 bg-secondary border shadow-lg rounded-xl shadow-2xl py-2 z-50">
          <div className="px-4 py-3 border-b border-neutral-700">
            <p className="font-medium truncate">{user.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => { setShowProfileModal(true); setIsOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary text-left"
            >
              <User size={18} />
              <span>Profile</span>
            </button>

            {!admin && <a href="/admin" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary text-left">
              <VideoIcon size={18} />
              <span>Studio</span>
            </a>}
            {admin && <a href="/" className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary text-left">
              <HomeIcon size={18} />
              <span>Home</span>
            </a>}
          </div>

          <div className="border-t border-neutral-700 py-1">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 text-left"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
      />
    </div>
  );
};

export default UserDropdown;