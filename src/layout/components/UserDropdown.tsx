// components/UserDropdown.tsx
import { useState } from "react";
import { ChevronDown, LogOut, HomeIcon, VideoIcon, UserIcon } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom"; // ← Add this import
import ProfileModal from "./ProfileModal";
import { User } from "@/types";

const UserDropdown = ({ user, admin = false}: { user: User | null; admin?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { logout } = useAuthStore();
  const navigate = useNavigate(); // ← Add this

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-primary px-3 py-1.5 rounded-full transition"
      >
        <img
          src={user?.imageUrl || "/default-avatar.png"}
          alt="profile"
          className="w-8 h-8 rounded-full object-cover border border-green-500"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium truncate">{user?.fullName || user?.email?.split('@')[0]}</p>
        </div>
        <ChevronDown size={18} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-56 bg-secondary border border-neutral-700 rounded-xl shadow-2xl py-2 z-50"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="px-4 py-3 border-b border-neutral-700">
            <p className="font-medium truncate">{user?.fullName || user?.email?.split('@')[0]}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          <div className="py-1">
            <button
              onClick={() => { 
                setShowProfileModal(true); 
                setIsOpen(false); 
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left transition"
            >
              <UserIcon size={18} />
              <span>Profile</span>
            </button>

            {/* Show Studio link for non-admin users */}
        { 
        user && user.isAdmin && <>
            {!admin && (
              <button
                onClick={() => handleNavigate('/admin')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left transition"
              >
                <VideoIcon size={18} />
                <span>Studio (Admin)</span>
              </button>
            )}
            
            {/* Show Home link for admin users */}
            {admin && (
              <button
                onClick={() => handleNavigate('/')}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 text-left transition"
              >
                <HomeIcon size={18} />
                <span>Home</span>
              </button>
            )}
            </>
            }
          </div>

          <div className="border-t border-neutral-700 py-1">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
                navigate('/');
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400 text-left transition"
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