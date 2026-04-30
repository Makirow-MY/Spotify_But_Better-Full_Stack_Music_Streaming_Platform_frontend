import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";

import AdminPage from "./pages/admin/AdminPage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import { useEffect } from "react";;
import { initializeTheme } from "./stores/useThemeStore";
import { useAuthStore } from "./stores/useAuthStore";
import { useMusicStore } from "./stores/useMusicStore";


function App() {
	  const {checkAuth } = useAuthStore();
	  const { fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs} = useMusicStore();
	
	  // Fetch data + check auth
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
					<Route path='/admin' element={<AdminPage />} />

			
					<Route path='/' element={<HomePage />} />
					<Route path='*' element={<NotFoundPage />} />
			
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
