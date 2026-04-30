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

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
  const { authUser, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!authUser) {
    return <Navigate to="/" replace />;
  }
  
  if (adminOnly && !authUser) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

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
            <ProtectedRoute adminOnly={true}>
              <AdminPage />
            </ProtectedRoute>
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