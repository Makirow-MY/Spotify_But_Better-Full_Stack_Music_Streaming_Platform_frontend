// components/Sidebar.tsx
import { useState } from "react";
import { Home, Search, Library, PlusCircle, Heart, X, ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;           // For mobile drawer
  onClose: () => void;
  isCollapsed: boolean;      // For desktop collapse
  toggleCollapse: () => void;
}

const Sidebar = ({ isOpen, onClose, isCollapsed, toggleCollapse }: SidebarProps) => {
  const [playlists] = useState(Array.from({ length: 6 }, (_, i) => `My Playlist ${i + 1}`));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          bg-black border-r border-neutral-800 
          flex flex-col h-full transition-all duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-72'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h1 className={`font-bold text-green-500 transition-all ${isCollapsed ? 'text-2xl' : 'text-2xl'}`}>
            {isCollapsed ? "S" : "Spotify"}
          </h1>

          {/* Collapse Toggle Button - Only visible on large screens */}
          <button 
            onClick={toggleCollapse}
            className="hidden lg:block text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            {isCollapsed ? <ChevronRight size={22} /> : <ChevronLeft size={22} />}
          </button>

          {/* Close button for mobile only */}
          <button 
            onClick={onClose} 
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={28} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1 py-2">
          {[
            { icon: Home, label: "Home", active: true },
            { icon: Search, label: "Search" },
            { icon: Library, label: "Your Library" },
          ].map((item, i) => (
            <a
              key={i}
              href="#"
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${item.active ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/10'}
                ${isCollapsed ? 'justify-center' : ''}`}
            >
              <item.icon size={24} />
              {!isCollapsed && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Playlists Section */}
        <div className="mt-6 px-3 flex-1 flex flex-col overflow-hidden">
          <div className={`flex items-center justify-between mb-4 px-4 ${isCollapsed ? 'justify-center' : ''}`}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Playlists
              </h3>
            )}
            <PlusCircle size={20} className="text-gray-400 hover:text-white cursor-pointer" />
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-2">
            {playlists.map((playlist, index) => (
              <a
                key={index}
                href="#"
                className={`flex items-center gap-3 py-2.5 rounded-xl hover:bg-white/10 transition-all
                  ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
              >
                <div className="w-10 h-10 bg-neutral-700 rounded flex-shrink-0" />
                {!isCollapsed && (
                  <span className="text-sm text-gray-300 truncate">{playlist}</span>
                )}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;