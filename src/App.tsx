// App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AdminPage from "./pages/admin/AdminPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import { useEffect } from "react";
import { initializeTheme } from "./stores/useThemeStore";
import { useAuthStore } from "./stores/useAuthStore";
import { useMusicStore } from "./stores/useMusicStore";



function App() {
  const { checkAuth} = useAuthStore();
  const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs } = useMusicStore();

  useEffect(() => {
    checkAuth();
    fetchFeaturedSongs();
    fetchMadeForYouSongs();
    fetchTrendingSongs();
  }, [checkAuth, fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<HomePage />} />
        
        {/* Admin Route - Protected */}
        <Route 
          path='/admin' 
          element={
              <AdminPage />
            
          } 
        />
        
        {/* 404 - Must be last */}
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <Toaster position="bottom-right" />
    </>
  );
}

export default App;