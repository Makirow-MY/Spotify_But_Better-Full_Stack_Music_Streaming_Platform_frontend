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

