import { create } from "zustand";
import { Song } from "@/types"; // adjust path

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  originalQueue: Song[];   // important for unshuffling

  isLooping: boolean;      // Loop All (queue)
  isLoopingOne: boolean;   // Repeat One
  isShuffled: boolean;

  playbackRate: number;
  volume: number;
  isMuted: boolean;

  // Actions
  playAlbum: (songs: Song[], startIndex?: number) => void;
  setCurrentSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;

  toggleLoop: () => void;      // Loop All
  toggleLoopOne: () => void;   // Repeat One
  toggleShuffle: () => void;
initializeQueue: (songs: Song[]) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  originalQueue: [],

  isLooping: false,
  isLoopingOne: false,
  isShuffled: false,

  playbackRate: 1,
  volume: 70,
  isMuted: false,

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    set({
      queue: [...songs],
      originalQueue: [...songs],
      currentSong: song,
      currentIndex: startIndex,
      isPlaying: true,
      isShuffled: false,
    });
  },

  initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},
  setCurrentSong: (song: Song) => {
    const { queue } = get();
    const index = queue.findIndex((s) => s._id === song._id);

    set({
      currentSong: song,
      currentIndex: index !== -1 ? index : 0,
      isPlaying: true,
    });
  },

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

  playNext: () => {
    const state = get();
    const { currentIndex, queue, isLooping, isLoopingOne } = state;

    if (isLoopingOne) {
      // Restart current song
      if (state.currentSong) {
        set({ currentSong: { ...state.currentSong } }); // trigger re-render + audio reload
      }
      return;
    }

    let nextIndex = currentIndex + 1;

    if (nextIndex >= queue.length) {
      if (isLooping) {
        nextIndex = 0; // Loop All
      } else {
        set({ isPlaying: false });
        return;
      }
    }

    const nextSong = queue[nextIndex];

    set({
      currentSong: nextSong,
      currentIndex: nextIndex,
      isPlaying: true,
    });
  },

  playPrevious: () => {
    const state = get();
    const { currentIndex, queue, isLoopingOne } = state;

    if (isLoopingOne) {
      // For Repeat One, previous usually restarts current song (common behavior)
      if (state.currentSong) {
        set({ currentSong: { ...state.currentSong } });
      }
      return;
    }

    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      if (isLoopingOne) {
        prevIndex = queue.length - 1; // Loop All → go to last song
      } else {
        // Optional: restart current song instead of stopping
        if (state.currentSong) {
          set({ currentSong: { ...state.currentSong } });
        }
        return;
      }
    }

    const prevSong = queue[prevIndex];

    set({
      currentSong: prevSong,
      currentIndex: prevIndex,
      isPlaying: true,
    });
  },

  toggleLoop: () => {
    set((state) => ({
      isLooping: !state.isLooping,
      isLoopingOne: false,
    }));
  },

  toggleLoopOne: () => {
    set((state) => ({
      isLoopingOne: !state.isLoopingOne,
      isLooping: false,
    }));
  },

  toggleShuffle: () => {
    const { isShuffled,originalQueue, currentIndex, currentSong } = get();

    if (!isShuffled) {
      // Enable shuffle
      let newQueue = [...originalQueue];

      // Fisher-Yates shuffle
      for (let i = newQueue.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
      }

      // Keep current song at current position if possible
      if (currentSong) {
        const currentSongIndexInNew = newQueue.findIndex(s => s._id === currentSong._id);
        if (currentSongIndexInNew !== -1 && currentSongIndexInNew !== currentIndex) {
          [newQueue[currentIndex], newQueue[currentSongIndexInNew]] = 
          [newQueue[currentSongIndexInNew], newQueue[currentIndex]];
        }
      }

      set({
        queue: newQueue,
        isShuffled: true,
      });
    } else {
      // Disable shuffle → restore original
      const restoredIndex = originalQueue.findIndex(s => s._id === currentSong?._id) ?? currentIndex;

      set({
        queue: [...originalQueue],
        currentIndex: restoredIndex,
        isShuffled: false,
      });
    }
  },

  setPlaybackRate: (rate: number) => set({ playbackRate: rate }),
  setVolume: (vol: number) => set({ volume: vol, isMuted: vol === 0 }),
  toggleMute: () => set((s) => ({ 
    isMuted: !s.isMuted, 
    volume: s.isMuted ? s.volume || 70 : 0 
  })),
}));



// import { create } from "zustand";
// import { Playlist, Song } from "@/types";
// import { useChatStore } from "./useChatStore";

// interface PlayerStore {
// 	currentSong: Song | null;
// 	isPlaying: boolean;
// 	queue: Song[];
// 	currentIndex: number;

// 	isLooping: boolean;
//   isLoopingOne: boolean;
//   isShuffled: boolean;
//   originalQueue: Song[];
//   playlists: Playlist[];
//   currentPlaylistId: string | null;
//   playbackRate: number;
//   volume: number;
//   isMuted: boolean;

// 	initializeQueue: (songs: Song[]) => void;
// 	playAlbum: (songs: Song[], startIndex?: number) => void;
// 	setCurrentSong: (song: Song | null) => void;
// 	togglePlay: () => void;
// 	playNext: () => void;
// 	playPrevious: () => void;

// 	  toggleLoop: () => void;
//   toggleLoopOne: () => void;
//   toggleShuffle: () => void;
//  // skipBackward: (seconds?: number) => void;
//  // skipForward: (seconds?: number) => void;
//  // seekTo: (time: number) => void;
//   setPlaybackRate: (rate: number) => void;
//   setVolume: (vol: number) => void;
//   toggleMute: () => void;


// // 	 createPlaylist: (name: string) => string;
// //   addToPlaylist: (playlistId: string, song: Song) => void;
// //   removeFromPlaylist: (playlistId: string, songId: string) => void;
// //   deletePlaylist: (playlistId: string) => void;
// //   loadPlaylist: (playlistId: string) => void;
// //   saveCurrentQueueAsPlaylist: (name: string) => void;
// }

// export const usePlayerStore = create<PlayerStore>((set, get) => ({
// 	currentSong: null,
// 	isPlaying: false,
// 	queue: [],
// 	currentIndex: -1,

// 	isLooping: false,
//   isLoopingOne: false,
//   isShuffled: false,
//   originalQueue: [],
//   playlists: [],
//   currentPlaylistId: null,
//   playbackRate: 1,
//   volume: 70,
//   isMuted: false,

// 	initializeQueue: (songs: Song[]) => {
// 		set({
// 			queue: songs,
// 			currentSong: get().currentSong || songs[0],
// 			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
// 		});
// 	},

// 	playAlbum: (songs: Song[], startIndex = 0) => {
// 		if (songs.length === 0) return;

// 		const song = songs[startIndex];

// 		const socket = useChatStore.getState().socket;
// 		if (socket.auth) {
// 			socket.emit("update_activity", {
// 				userId: socket.auth.userId,
// 				activity: `Playing ${song.title} by ${song.artist}`,
// 			});
// 		}
// 		set({
// 			queue: songs,
// 			currentSong: song,
// 			currentIndex: startIndex,
// 			isPlaying: true,
// 		});
// 	},

// 	setCurrentSong: (song: Song | null) => {
// 		if (!song) return;

// 		const socket = useChatStore.getState().socket;
// 		if (socket.auth) {
// 			socket.emit("update_activity", {
// 				userId: socket.auth.userId,
// 				activity: `Playing ${song.title} by ${song.artist}`,
// 			});
// 		}

// 		const songIndex = get().queue.findIndex((s) => s._id === song._id);
// 		set({
// 			currentSong: song,
// 			isPlaying: true,
// 			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
// 		});
// 	},
	
// 	togglePlay: () => {
// 		const willStartPlaying = !get().isPlaying;

// 		const currentSong = get().currentSong;
// 		const socket = useChatStore.getState().socket;
// 		if (socket.auth) {
// 			socket.emit("update_activity", {
// 				userId: socket.auth.userId,
// 				activity:
// 					willStartPlaying && currentSong ? `Playing ${currentSong.title} by ${currentSong.artist}` : "Idle",
// 			});
// 		}

// 		set({
// 			isPlaying: willStartPlaying,
// 		});
// 	},

// 	playNext: () => {
// 		const { currentIndex, queue } = get();
// 		const nextIndex = currentIndex + 1;

// 		// if there is a next song to play, let's play it
// 		if (nextIndex < queue.length) {
// 			const nextSong = queue[nextIndex];

// 			const socket = useChatStore.getState().socket;
// 			if (socket.auth) {
// 				socket.emit("update_activity", {
// 					userId: socket.auth.userId,
// 					activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
// 				});
// 			}

// 			set({
// 				currentSong: nextSong,
// 				currentIndex: nextIndex,
// 				isPlaying: true,
// 			});
// 		} else {
// 			// no next song
// 			set({ isPlaying: false });

// 			const socket = useChatStore.getState().socket;
// 			if (socket.auth) {
// 				socket.emit("update_activity", {
// 					userId: socket.auth.userId,
// 					activity: `Idle`,
// 				});
// 			}
// 		}
// 	},
// 	  toggleLoop: () => {
//     set((state) => ({ 
//       isLooping: !state.isLooping,
//       isLoopingOne: false 
//     }));
//   },
  
//   toggleLoopOne: () => {
//     set((state) => ({ 
//       isLoopingOne: !state.isLoopingOne,
//       isLooping: false 
//     }));
// 	 },

// 	   toggleShuffle: () => {
//     const { queue, originalQueue, isShuffled, currentSong } = get();
    
//     if (!isShuffled) {
//       // Shuffle the queue while keeping current song at its position
//       const newQueue = [...originalQueue];
//       const currentSongId = currentSong?._id;
	

// 	for (let i = newQueue.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [newQueue[i], newQueue[j]] = [newQueue[j], newQueue[i]];
//       }

// 	   if (currentSongId) {
//         const currentSongObj = newQueue.find(s => s._id === currentSongId);
//         if (currentSongObj) {
//           const currentIndexInShuffled = newQueue.findIndex(s => s._id === currentSongId);
//           const currentIndex = get().currentIndex;
//           if (currentIndexInShuffled !== currentIndex) {
//             [newQueue[currentIndex], newQueue[currentIndexInShuffled]] = 
//             [newQueue[currentIndexInShuffled], newQueue[currentIndex]];
//           }
//         }
// 	   }

// 	set({ 
//         queue: newQueue, 
//         isShuffled: true 
//       });
// 	}
//  else {
//       // Restore original order
//       set({ 
//         queue: [...originalQueue], 
//         isShuffled: false 
//       });
//     }
	
// },

//  setPlaybackRate: (rate: number) => {
//     set({ playbackRate: rate });
//   },
  
//   setVolume: (vol: number) => {
//     set({ volume: vol, isMuted: vol === 0 });
//   },
//     toggleMute: () => {
//     set((state) => ({ 
//       isMuted: !state.isMuted,
//       volume: state.isMuted ? state.volume : 0
//     }));
//   },
// 	playPrevious: () => {
// 		const { currentIndex, queue } = get();
// 		const prevIndex = currentIndex - 1;

// 		// theres a prev song
// 		if (prevIndex >= 0) {
// 			const prevSong = queue[prevIndex];

// 			const socket = useChatStore.getState().socket;
// 			if (socket.auth) {
// 				socket.emit("update_activity", {
// 					userId: socket.auth.userId,
// 					activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
// 				});
// 			}

// 			set({
// 				currentSong: prevSong,
// 				currentIndex: prevIndex,
// 				isPlaying: true,
// 			});
// 		} else {
// 			// no prev song
// 			set({ isPlaying: false });

// 			const socket = useChatStore.getState().socket;
// 			if (socket.auth) {
// 				socket.emit("update_activity", {
// 					userId: socket.auth.userId,
// 					activity: `Idle`,
// 				});
// 			}
// 		}
// 	},
// }));
