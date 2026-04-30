// stores/useThemeStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: true, // Default to dark mode (Spotify style)

      toggleTheme: () => {
        set((state) => {
          const newTheme = !state.isDark;
          // Apply theme to document root
          if (newTheme) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDark: newTheme };
        });
      },

      setTheme: (isDark: boolean) => {
        set({ isDark });
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'spotify-theme-storage', // localStorage key
    }
  )
);

// Initialize theme on app load
export const initializeTheme = () => {
  const stored = localStorage.getItem('spotify-theme-storage');
  if (stored) {
    const { state } = JSON.parse(stored);
    if (state.isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } else {
    // Default to dark
    document.documentElement.classList.add('dark');
  }
};