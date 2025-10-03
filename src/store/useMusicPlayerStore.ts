import { createWithEqualityFn } from 'zustand/traditional';
import { persist } from 'zustand/middleware';

import morningAgain from '../assets/audio/Morning Again.mp3';
import cavalier from '../assets/audio/Cavalier.mp3';
import sipSlow from '../assets/audio/Sip Slow.mp3';
import unexplainable from '../assets/audio/Unexplainable (feat. The KID LAROI).mp3';
import doubleDate from '../assets/audio/Double Date.mp3';
import swerve from '../assets/audio/Swerve.mp3';
import time from '../assets/audio/Time.mp3';
import threeEightSpecial from '../assets/audio/38 Special.mp3';
import merica from '../assets/audio/Mercia.mp3';

export interface Song {
  src: string;
  name: string;
  artist: string;
  id: string;
}

export type RepeatMode = 'off' | 'all' | 'one';

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

const createDefaultPlaylist = (): Song[] => [
  { src: morningAgain, name: 'Morning Again', artist: 'Juice WRLD', id: '1' },
  { src: cavalier, name: 'Cavalier', artist: 'Juice WRLD', id: '2' },
  { src: sipSlow, name: 'Sip Slow', artist: 'Juice WRLD', id: '3' },
  { src: unexplainable, name: 'Unexplainable', artist: 'Juice WRLD & Kid LAROI', id: '4' },
  { src: doubleDate, name: 'Double Date', artist: 'Juice WRLD', id: '5' },
  { src: swerve, name: 'Swerve', artist: 'Juice WRLD', id: '6' },
  { src: time, name: 'Time', artist: 'Juice WRLD', id: '7' },
  { src: threeEightSpecial, name: '38 Special', artist: 'Juice WRLD', id: '8' },
  { src: merica, name: 'Mercia', artist: 'Juice WRLD', id: '9' },
];

interface MusicPlayerState {
  playlist: Song[];
  currentTrackIndex: number;
  isShuffled: boolean;
  repeatMode: RepeatMode;
  volume: number;
  isExpanded: boolean;
  showPlaylist: boolean;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  setVolume: (value: number | ((prev: number) => number)) => void;
  setCurrentTrackIndex: (index: number) => void;
  setPlaylist: (playlist: Song[]) => void;
  resetPlaylist: () => void;
  setIsShuffled: (value: boolean) => void;
  setRepeatMode: (mode: RepeatMode) => void;
  setIsExpanded: (value: boolean) => void;
  toggleExpanded: () => void;
  setShowPlaylist: (value: boolean) => void;
  togglePlaylist: () => void;
}

const ensureIndexBounds = (index: number, length: number) => {
  if (length <= 0) return 0;
  if (index < 0) return 0;
  if (index >= length) return length - 1;
  return index;
};

export const useMusicPlayerStore = createWithEqualityFn<MusicPlayerState>()(
  persist(
    (set) => ({
      playlist: createDefaultPlaylist(),
      currentTrackIndex: 0,
      isShuffled: false,
      repeatMode: 'off',
      volume: 0.5,
      isExpanded: false,
      showPlaylist: false,
      isPlaying: false,
      setIsPlaying: (value) => set({ isPlaying: value }),
      setVolume: (value) =>
        set((state) => {
          const nextValue = typeof value === 'function' ? value(state.volume) : value;
          return { volume: clamp(nextValue) };
        }),
      setCurrentTrackIndex: (index) =>
        set((state) => ({
          currentTrackIndex: ensureIndexBounds(index, state.playlist.length),
        })),
      setPlaylist: (playlist) =>
        set((state) => {
          const nextPlaylist = playlist.length ? playlist : createDefaultPlaylist();
          return {
            playlist: nextPlaylist,
            currentTrackIndex: ensureIndexBounds(state.currentTrackIndex, nextPlaylist.length),
          };
        }),
      resetPlaylist: () =>
        set((state) => {
          const defaultPlaylist = createDefaultPlaylist();
          return {
            playlist: defaultPlaylist,
            currentTrackIndex: ensureIndexBounds(state.currentTrackIndex, defaultPlaylist.length),
          };
        }),
      setIsShuffled: (value) => set({ isShuffled: value }),
      setRepeatMode: (mode) => set({ repeatMode: mode }),
      setIsExpanded: (value) => set({ isExpanded: value }),
      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
      setShowPlaylist: (value) => set({ showPlaylist: value }),
      togglePlaylist: () => set((state) => ({ showPlaylist: !state.showPlaylist })),
    }),
    {
      name: 'music-player-store',
      partialize: (state) => ({
        playlist: state.playlist,
        currentTrackIndex: state.currentTrackIndex,
        isShuffled: state.isShuffled,
        repeatMode: state.repeatMode,
        volume: state.volume,
      }),
    }
  )
);

export const getDefaultPlaylist = () => createDefaultPlaylist();
