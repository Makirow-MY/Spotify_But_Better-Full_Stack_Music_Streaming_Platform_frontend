import { axiosInstance } from "@/lib/axios";
import { Album, Song, Stats } from "@/types";

import toast from "react-hot-toast";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";


interface MusicStore {
	songs: Song[];
	albums: Album[];
	isLoading: boolean;
	error: string | null;
	currentAlbum: Album | null;
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
	stats: Stats;

	// Infinite scroll states
  allSongs: Song[];           // For main "All Songs" or big grid
  page: number;
  hasMore: boolean;
  isLoadingMore: boolean;


	fetchAlbums: () => Promise<void>;
	setCurrentAlbum: (album: Album | null) => void;
	fetchAlbumById: (id: string) => Promise<void>;
	fetchFeaturedSongs: () => Promise<void>;
	fetchMadeForYouSongs: () => Promise<void>;
	fetchTrendingSongs: () => Promise<void>;
	fetchStats: () => Promise<void>;
	fetchSongs: () => Promise<void>;
	deleteSong: (id: string) => Promise<void>;
	editSong: (id: string) => Promise<void>;
	deleteAlbum: (id: string) => Promise<void>;
	 // New infinite scroll functions
  fetchAllSongs: (reset?: boolean) => Promise<void>;
  loadMoreSongs: () => Promise<void>;
}


export const useMusicStore = create<MusicStore>((set, get) => ({
	albums: [],
	songs: [],
	isLoading: false,
	error: null,
	currentAlbum: null,
	madeForYouSongs: [],
	featuredSongs: [],
	trendingSongs: [],
	allSongs: [],
  page: 1,
  hasMore: true,
  isLoadingMore: false,
	stats: {
		totalSongs: 0,
		totalAlbums: 0,
		totalUsers: 0,
		totalArtists: 0,
	},

	setCurrentAlbum: (album: Album | null) => {
			if (!album) return;
	
			const socket = useChatStore.getState().socket;
		
			if (socket.auth) {
				socket.emit("update_activity", {
					userId: socket.auth.userId,
					activity: `Playing ${album.title} by ${album.artist}`,
				});
			}
	
			set({
				currentAlbum: album,
			
			});
		},
	

	deleteSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/songs/${id}`);

			set((state) => ({
				songs: state.songs.filter((song) => song._id !== id),
			}));
			toast.success("Song deleted successfully");
		} catch (error: any) {
			//console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},
	editSong: async (id) => {
		set({ isLoading: true, error: null });
		try {
		const res =	await axiosInstance.delete(`/admin/songs/${id}`);

			set({
				songs: res.data,
		});
			toast.success("Song deleted successfully");
		} catch (error: any) {
			//console.log("Error in deleteSong", error);
			toast.error("Error deleting song");
		} finally {
			set({ isLoading: false });
		}
	},
fetchAllSongs: async (reset = false) => {
  if (reset) {
    set({ allSongs: [], page: 1, hasMore: true, isLoadingMore: false });
  }

  set({ isLoading: true, error: null });

  try {
    const response = await axiosInstance.get(`/songs?page=1&limit=12`);
    const songs = response.data.songs || response.data;
    const hasMore = response.data.hasMore ?? (songs.length === 12);

    set({
      allSongs: songs,
      page: 2,
      hasMore,
    });
  } catch (error: any) {
    //console.error(error);
    set({ error: "Failed to load songs" });
   // toast.error("Failed to load songs");
  } finally {
    set({ isLoading: false });
  }
},

loadMoreSongs: async () => {
  const { page, hasMore, isLoadingMore } = get();
  if (!hasMore || isLoadingMore) return;

  set({ isLoadingMore: true });

  try {
    const response = await axiosInstance.get(`/songs?page=${page}&limit=12`);
    const newSongs = response.data.songs || response.data;
    const hasMoreNew = response.data.hasMore ?? (newSongs.length === 12);

    set((state) => ({
      allSongs: [...state.allSongs, ...newSongs],
      page: state.page + 1,
      hasMore: hasMoreNew,
    }));
  } catch (error) {
    //console.error("Error loading more songs:", error);
   // toast.error("Failed to load more songs");
  } finally {
    set({ isLoadingMore: false });
  }
},
	deleteAlbum: async (id) => {
		set({ isLoading: true, error: null });
		try {
			await axiosInstance.delete(`/admin/albums/${id}`);
			set((state) => ({
				albums: state.albums.filter((album) => album._id !== id),
				songs: state.songs.map((song) =>
					song.albumId === state.albums.find((a) => a._id === id)?.title ? { ...song, album: null } : song
				),
			}));
			toast.success("Album deleted successfully");
		} catch (error: any) {
			toast.error("Failed to delete album: " + error.message);
		} finally {
			set({ isLoading: false });
		}
	},

	fetchSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs`);
			set({ songs: response.data });
		} catch (error: any) {
				//console.error(error)
			//set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchStats: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/stats`);
			set({ stats: response.data });
		} catch (error: any) {
			set({ error: error.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbums: async () => {
		set({ isLoading: true, error: null });

		try {
			const response = await axiosInstance.get(`/albums`);
			//set({ currentAlbum: response.data[Math.floor(Math.random() * response.data?.length)] });
			set({ albums: response.data });
		} catch (error: any) {
			set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchAlbumById: async (id) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/albums/${id}`);
			set({ currentAlbum: response.data });
		} catch (error: any) {
				//console.error(error)
			//set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchFeaturedSongs: async () => {
		set({ isLoading: true, error: null });
		
		try {
			const response = await axiosInstance.get(`/songs/featured`);
			set({ featuredSongs: response.data });
		} catch (error: any) {
			//toast.success(error.response.data.message)
			//console.error("Error fetching featured songs:", error);
			//set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchMadeForYouSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs/made-for-you`);
		//console.log("Made for you songs:", response.data);
			set({ madeForYouSongs: response.data });
		} catch (error: any) {
			//console.error(error)
			//set({ error: error?.response?.data?.message });
		} finally {
			set({ isLoading: false });
		}
	},

	fetchTrendingSongs: async () => {
		set({ isLoading: true, error: null });
		try {
			const response = await axiosInstance.get(`/songs/trending`);
			//console.log(response.data)
			set({ trendingSongs: response.data });
		} catch (error: any) {
				//console.error(error)
		//	set({ error: error.response.data.message });
		} finally {
			set({ isLoading: false });
		}
	},
}));
