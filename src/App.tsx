import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";
import { useEffect } from "react";;
import { initializeTheme } from "./stores/useThemeStore";
import { useAuthStore } from "./stores/useAuthStore";
import { useMusicStore } from "./stores/useMusicStore";


function App() {
	  const { authUser, checkAuth } = useAuthStore();
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
				<Route
					path=' '
					element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
				
				<Route path='/admin' element={<AdminPage />} />

			
					<Route path='/' element={<HomePage />} />
					<Route path='/chat' element={<ChatPage />} />
					<Route path='/albums/:albumId' element={<AlbumPage />} />
					<Route path='*' element={<NotFoundPage />} />
			
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
