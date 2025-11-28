import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume, Volume1, Volume2, VolumeX, Music, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Play, Pause, ListMusic } from 'lucide-react';
import { usePortfolioStore } from '../store/usePortfolioStore';
import { useMusicPlayerStore, getDefaultPlaylist } from '../store/useMusicPlayerStore';
import type { Song } from '../store/useMusicPlayerStore';
import { shallow } from 'zustand/shallow';

const mediaElementSourceCache = new WeakMap<HTMLMediaElement, MediaElementAudioSourceNode>();

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [audioData, setAudioData] = useState<number[]>(Array(32).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const originalPlaylistRef = useRef<Song[]>(getDefaultPlaylist());
  const connectionsActiveRef = useRef(false);

  const { hasEntered, introComplete } = usePortfolioStore((state) => ({
    hasEntered: state.hasEntered,
    introComplete: state.introComplete,
  }));

  const {
    playlist,
    setPlaylist,
    currentTrackIndex,
    setCurrentTrackIndex,
    isShuffled,
    setIsShuffled,
    repeatMode,
    setRepeatMode,
    volume,
    setVolume,
    showPlaylist,
    isExpanded,
    setIsExpanded,
    isPlaying,
    setIsPlaying,
    togglePlaylist,
  } = useMusicPlayerStore((state) => ({
    playlist: state.playlist,
    setPlaylist: state.setPlaylist,
    currentTrackIndex: state.currentTrackIndex,
    setCurrentTrackIndex: state.setCurrentTrackIndex,
    isShuffled: state.isShuffled,
    setIsShuffled: state.setIsShuffled,
    repeatMode: state.repeatMode,
    setRepeatMode: state.setRepeatMode,
    volume: state.volume,
    setVolume: state.setVolume,
    showPlaylist: state.showPlaylist,
    isExpanded: state.isExpanded,
    setIsExpanded: state.setIsExpanded,
    isPlaying: state.isPlaying,
    setIsPlaying: state.setIsPlaying,
    togglePlaylist: state.togglePlaylist,
  }), shallow);

  const previousVolumeRef = useRef(volume || 0.5);

  const initializeAudio = useCallback(() => {
    if (isInitialized || !audioRef.current) {
      return;
    }

    setIsInitialized(true);
    audioRef.current.load();

    const playAttempt = audioRef.current.play();

    if (playAttempt !== undefined) {
      playAttempt
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error('Playback failed:', error);
          setIsPlaying(false);

          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch((err) => console.error('Retry playback failed:', err));
            }
          }, 1000);
        });
    }
  }, [isInitialized, setIsInitialized, setIsPlaying]);

  const safelyPlayAudio = useCallback(() => {
    if (!audioRef.current) return;

    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsInitialized(true);
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error('Play failed:', err);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current
                .play()
                .then(() => setIsPlaying(true))
                .catch((e) => console.error('Retry play failed:', e));
            }
          }, 100);
        });
    }
  }, [setIsPlaying]);

  const togglePlayPause = useCallback(() => {
    if (!isInitialized) {
      initializeAudio();
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      safelyPlayAudio();
    }
  }, [initializeAudio, isInitialized, isPlaying, safelyPlayAudio, setIsPlaying]);

  const playNextTrack = useCallback(() => {
    if (!playlist.length) return;
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        safelyPlayAudio();
      }, 100);
    }
  }, [currentTrackIndex, isPlaying, playlist, safelyPlayAudio, setCurrentTrackIndex]);

  const playPrevTrack = useCallback(() => {
    if (!playlist.length) return;
    const prevIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrackIndex(prevIndex);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        safelyPlayAudio();
      }, 100);
    }
  }, [currentTrackIndex, isPlaying, playlist, safelyPlayAudio, setCurrentTrackIndex]);

  useEffect(() => {
    const handlePortfolioEnter = () => {
      initializeAudio();
    };

    window.addEventListener('portfolio:enter', handlePortfolioEnter);

    return () => {
      window.removeEventListener('portfolio:enter', handlePortfolioEnter);
    };
  }, [initializeAudio]);

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      previousVolumeRef.current = volume;
      setVolume(0);
    } else {
      const restoredVolume = previousVolumeRef.current > 0 ? previousVolumeRef.current : 0.5;
      setVolume(restoredVolume);
    }
  }, [setVolume, volume]);

  const toggleShuffle = useCallback(() => {
    const nextIsShuffled = !isShuffled;
    setIsShuffled(nextIsShuffled);

    if (!playlist.length) {
      const restoredPlaylist = originalPlaylistRef.current.map((song) => ({ ...song }));
      setPlaylist(restoredPlaylist);
      setCurrentTrackIndex(0);
      return;
    }

    if (nextIsShuffled) {
      const currentSong = playlist[currentTrackIndex];
      const shuffled = [...playlist];

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      const newIndex = shuffled.findIndex((song) => song.id === currentSong.id);
      if (newIndex !== -1 && newIndex !== 0) {
        [shuffled[0], shuffled[newIndex]] = [shuffled[newIndex], shuffled[0]];
      }

      setPlaylist(shuffled);
      setCurrentTrackIndex(0);
    } else {
      const currentSong = playlist[currentTrackIndex];
      const originalPlaylist = originalPlaylistRef.current;
      const restoredPlaylist = originalPlaylist.map((song) => ({ ...song }));
      setPlaylist(restoredPlaylist);

      const newIndex = originalPlaylist.findIndex((song) => song.id === currentSong.id);
      if (newIndex !== -1) {
        setCurrentTrackIndex(newIndex);
      }
    }
  }, [
    currentTrackIndex,
    isShuffled,
    playlist,
    setCurrentTrackIndex,
    setIsShuffled,
    setPlaylist,
  ]);

  const toggleRepeat = useCallback(() => {
    if (repeatMode === 'off') {
      setRepeatMode('all');
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
    } else {
      setRepeatMode('off');
    }
  }, [repeatMode, setRepeatMode]);

  // Track the last non-zero volume level for mute toggling
  useEffect(() => {
    if (volume > 0) {
      previousVolumeRef.current = volume;
    }
  }, [volume]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeatMode === 'one') {
        // Repeat the current track
        audio.currentTime = 0;
        audio.play()
          .catch(err => console.error("Error replaying track:", err));
      } else if (repeatMode === 'all' && currentTrackIndex === playlist.length - 1) {
        // If we're at the end of the playlist and repeat all is on, go back to first track
        setCurrentTrackIndex(0);
      } else {
        // Otherwise just play next track (or stop if at end and repeat is off)
        if (currentTrackIndex < playlist.length - 1 || repeatMode === 'all') {
      playNextTrack();
        } else {
          setIsPlaying(false);
        }
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, playNextTrack, playlist.length, repeatMode, setCurrentTrackIndex, setIsPlaying]);

  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts if player is expanded
      if (!isExpanded || !hasEntered) return;
      
      switch (e.key) {
        case ' ': // Space bar
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          // Skip forward 5 seconds
          if (audioRef.current) {
            audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 5, duration);
          }
          break;
        case 'ArrowLeft':
          // Skip backward 5 seconds
          if (audioRef.current) {
            audioRef.current.currentTime = Math.max(audioRef.current.currentTime - 5, 0);
          }
          break;
        case 'ArrowUp':
          // Increase volume
          e.preventDefault(); // Prevent page scrolling
          setVolume((prev: number) => Math.min(prev + 0.1, 1));
          break;
        case 'ArrowDown':
          // Decrease volume
          e.preventDefault(); // Prevent page scrolling
          setVolume((prev: number) => Math.max(prev - 0.1, 0));
          break;
        case 'n':
          playNextTrack();
          break;
        case 'p':
          playPrevTrack();
          break;
        case 's':
          toggleShuffle();
          break;
        case 'r':
          toggleRepeat();
          break;
        case 'l':
          togglePlaylist();
          break;
        case 'm':
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    duration,
    hasEntered,
    isExpanded,
    playNextTrack,
    playPrevTrack,
    setVolume,
    toggleMute,
    togglePlayPause,
    togglePlaylist,
    toggleRepeat,
    toggleShuffle,
  ]);
  // Set up audio analyzer when component mounts
  useEffect(() => {
    const audioElement = audioRef.current;

    if (!hasEntered || !audioElement) return;

    if (!audioContextRef.current || audioContextRef.current.state === 'closed') {
      audioContextRef.current = new AudioContext();
    }

    if (!analyserRef.current && audioContextRef.current) {
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 128;
      analyserRef.current = analyser;
    }

    if (!mediaSourceRef.current && audioContextRef.current) {
      const cachedSource = mediaElementSourceCache.get(audioElement);

      if (cachedSource) {
        mediaSourceRef.current = cachedSource;
      } else {
        const source = audioContextRef.current.createMediaElementSource(audioElement);
        mediaElementSourceCache.set(audioElement, source);
        mediaSourceRef.current = source;
      }
    }

    if (
      mediaSourceRef.current &&
      analyserRef.current &&
      audioContextRef.current &&
      !connectionsActiveRef.current
    ) {
      mediaSourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
      connectionsActiveRef.current = true;
    }

    return () => {
      if (connectionsActiveRef.current) {
        try {
          if (mediaSourceRef.current && analyserRef.current) {
            mediaSourceRef.current.disconnect(analyserRef.current);
          } else if (mediaSourceRef.current) {
            mediaSourceRef.current.disconnect();
          }
        } catch (err) {
          console.error('Error disconnecting media source:', err);
        }

        try {
          analyserRef.current?.disconnect();
        } catch (err) {
          console.error('Error disconnecting analyser:', err);
        }

        connectionsActiveRef.current = false;
      }

      if (audioContextRef.current?.state === 'running') {
        audioContextRef.current
          .suspend()
          .catch((err) => console.error('Error suspending audio context:', err));
      }
    };
  }, [hasEntered]);

  // Update audio data for visualization
  useEffect(() => {
    if (!isPlaying || !analyserRef.current) return;
    
    const analyser = analyserRef.current;
    analyser.fftSize = 128; // Increase for more frequency resolution
    analyser.smoothingTimeConstant = 0.8; // Add smoothing (0-1)
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    // Keep previous frame data for smoothing
    const prevData = Array(analyser.frequencyBinCount).fill(0);
    
    const updateAudioData = () => {
      // Get frequency data
      analyser.getByteFrequencyData(dataArray);
      
      // Process and enhance the data with better balancing
      const processedData = Array.from(dataArray).map((val, i, arr) => {
        // Apply frequency-specific scaling to balance the response
        // Lower frequencies often have more energy, so we attenuate them
        let frequencyBalance;
        const normalizedIndex = i / arr.length;
        
        if (normalizedIndex < 0.1) {
          // Very low frequencies (0-10%) - apply significant attenuation
          frequencyBalance = 0.5; // 50% reduction
        } else if (normalizedIndex < 0.2) {
          // Low frequencies (10-20%) - apply moderate attenuation
          frequencyBalance = 0.7; // 30% reduction
        } else if (normalizedIndex < 0.6) {
          // Mid frequencies (20-60%) - apply slight boost
          frequencyBalance = 1.1; // 10% boost
        } else {
          // High frequencies (60-100%) - apply moderate boost
          frequencyBalance = 1.2; // 20% boost
        }
        
        // Normalize and apply frequency balance
        let normalizedValue = (val * frequencyBalance) / 255;
        
        // Apply temporal smoothing between frames
        normalizedValue = normalizedValue * 0.7 + prevData[i] * 0.3;
        
        // Apply non-linear scaling to better represent how we perceive audio
        // Use a quasi-logarithmic curve (x^0.6) to better match human perception
        normalizedValue = Math.pow(normalizedValue, 0.6);
        
        // Update previous data for next frame
        prevData[i] = normalizedValue;
        
        return normalizedValue;
      });
      
      // Update state with new data
      setAudioData(processedData);
      
      // Continue loop
      animationFrameRef.current = requestAnimationFrame(updateAudioData);
    };
    
    updateAudioData();
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Updated playSpecificTrack to use safe play
  const playSpecificTrack = (index: number) => {
    setCurrentTrackIndex(index);
    if (audioRef.current) {
      setTimeout(() => {
        safelyPlayAudio();
      }, 100);
    }
  };

  const filteredPlaylist = searchTerm 
    ? playlist.filter(song => 
        song.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        song.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    : playlist;

  const currentSong = playlist[currentTrackIndex];

  // Don't render anything if intro hasn't completed
  if (!introComplete) {
    return (
      <audio 
        ref={audioRef} 
        src={currentSong.src} 
        preload="metadata"
      />
    );
  }

  // Render the full player when user has entered
  return (
    <>
      <audio 
        ref={audioRef} 
        src={currentSong.src} 
        preload="metadata"
      />

        <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end gap-3">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0, width: 0, originY: 0, originX: 0 }}
                animate={{ opacity: 1, height: 'auto', width: 'auto' }}
                exit={{ opacity: 0, height: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-black/80 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] border border-white/10 overflow-hidden"
              >
              <div className={`p-5 w-[22rem] ${showPlaylist ? 'max-h-[26rem] overflow-y-auto' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={togglePlaylist}
                    className="text-neutral-500 hover:text-[#D4AF37] transition-colors"
                    title="Toggle playlist view"
                  >
                    <ListMusic className="h-5 w-5" />
                  </button>
                    <div className="text-center flex-1">
                      <h3 className="text-white font-medium tracking-wide">Music Player</h3>
                    </div>
                    <button 
                      onClick={() => setIsExpanded(false)} 
                      className="text-neutral-500 hover:text-white transition-colors"
                    title="Collapse player"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>

                {showPlaylist ? (
                  <>
                    <div className="mb-4">
                      <input
                        type="text"
                        placeholder="Search songs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 bg-white/5 text-white border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
                      />
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredPlaylist.map((song) => (
                        <div 
                          key={song.id}
                          onClick={() => playSpecificTrack(playlist.findIndex(s => s.id === song.id))}
                          className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
                            currentSong.id === song.id 
                              ? 'bg-[#D4AF37]/10 border border-[#D4AF37]/40' 
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="text-white font-medium truncate">{song.name}</div>
                            <div className="text-gray-400 text-xs">{song.artist}</div>
                          </div>
                          {currentSong.id === song.id && isPlaying && (
                            <div className="flex space-x-0.5 items-center">
                              <motion.div 
                                className="bg-[#D4AF37] w-1 h-3 rounded-full"
                                animate={{ height: [3, 6, 3] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                              />
                              <motion.div 
                                className="bg-[#D4AF37] w-1 h-4 rounded-full"
                                animate={{ height: [4, 8, 4] }}
                                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.2 }}
                              />
                              <motion.div 
                                className="bg-[#D4AF37] w-1 h-2 rounded-full"
                                animate={{ height: [2, 5, 2] }}
                                transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: 0.1 }}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                  <div className="text-center mb-4">
                    <h4 className="text-white text-lg font-bold truncate">{currentSong.name}</h4>
                    <p className="text-gray-400 text-sm">{currentSong.artist}</p>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleProgressChange}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                    />
                  </div>

                  {/* Controls */}
                    <div className="flex justify-center items-center space-x-4 mb-4">
                      <div className="relative">
                        <button 
                          onClick={toggleShuffle}
                          className={`p-1.5 rounded-md transition-colors ${
                            isShuffled 
                              ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50' 
                              : 'text-neutral-400 hover:text-white hover:bg-white/5'
                          }`}
                          title="Shuffle"
                        >
                          <Shuffle className="h-5 w-5" strokeWidth={isShuffled ? 2.5 : 2} />
                        </button>
                        {isShuffled && (
                          <span className="absolute -top-1 -right-1 text-xs bg-[#D4AF37] text-black rounded-full w-3 h-3 flex items-center justify-center">
                            ⤭
                          </span>
                        )}
                      </div>
                      
                    <button 
                      onClick={playPrevTrack}
                      className="text-neutral-400 hover:text-white transition-colors"
                        title="Previous track"
                    >
                        <SkipBack className="h-6 w-6" />
                    </button>
                    
                    <button 
                      onClick={togglePlayPause}
                      className="bg-[#D4AF37] hover:bg-[#c79c2c] text-black rounded-full p-3 focus:outline-none transition-colors shadow-[0_10px_30px_rgba(212,175,55,0.35)]"
                        title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                          <Pause className="h-5 w-5" />
                      ) : (
                          <Play className="h-5 w-5" />
                      )}
                    </button>
                    
                    <button 
                      onClick={playNextTrack}
                      className="text-neutral-400 hover:text-white transition-colors"
                        title="Next track"
                      >
                        <SkipForward className="h-6 w-6" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={toggleRepeat}
                          className={`p-1.5 rounded-md transition-colors ${
                            repeatMode === 'off'
                              ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                              : repeatMode === 'one'
                                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50'
                                : 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40'
                          }`}
                          title={`Repeat mode: ${repeatMode}`}
                        >
                          {repeatMode === 'one' ? (
                            <Repeat1 className="h-5 w-5" strokeWidth={2.5} />
                          ) : (
                            <Repeat className="h-5 w-5" strokeWidth={repeatMode === 'all' ? 2.5 : 2} />
                          )}
                    </button>
                        {repeatMode !== 'off' && (
                          <span className="absolute -top-1 -right-1 text-xs bg-[#D4AF37] text-black rounded-full w-3 h-3 flex items-center justify-center">
                            {repeatMode === 'one' ? '1' : '∞'}
                          </span>
                        )}
                    </div>
                  </div>
                  </>
                )}

                  {/* Volume control - only show when playlist is not visible */}
                  {!showPlaylist && (
                    <div className="flex items-center space-x-2 mt-2">
                      <button onClick={toggleMute} className="text-neutral-400 hover:text-white">
                        {volume === 0 ? (
                          <VolumeX className="h-5 w-5" />
                        ) : volume < 0.33 ? (
                          <Volume className="h-5 w-5" />
                        ) : volume < 0.67 ? (
                          <Volume1 className="h-5 w-5" />
                        ) : (
                          <Volume2 className="h-5 w-5" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#D4AF37]"
                      />
                    </div>
                  )}
                
                {/* Keyboard shortcuts info - only show in main player view */}
                {!showPlaylist && (
                  <div className="mt-2 text-xs text-neutral-500">
                    <p>Keyboard shortcuts: Space (play/pause), ←→ (seek), ↑↓ (volume), N (next), P (prev), R (repeat), S (shuffle), L (playlist), M (mute)</p>
                  </div>
                )}
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsExpanded(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              className="bg-black/80 backdrop-blur-md text-white p-0 rounded-full shadow-[0_12px_32px_rgba(0,0,0,0.5)] border border-white/10 group flex items-center justify-center relative overflow-hidden w-16 h-16"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {isPlaying && (
                  <>
                    {/* Audio reactive lighting effect */}
                    {audioData.map((level, i, arr) => {
                      // Only use a few samples for the effect to avoid excessive rendering
                      if (i % 8 !== 0) return null;
                      
                      // Analyze audio frequency ranges for different effects
                      const bassLevel = Math.max(...audioData.slice(0, Math.floor(arr.length * 0.2)));
                      const midLevel = Math.max(...audioData.slice(Math.floor(arr.length * 0.2), Math.floor(arr.length * 0.6)));
                      const highLevel = Math.max(...audioData.slice(Math.floor(arr.length * 0.6)));
                      
                      // Calculate dynamic color based on frequency content
                      const hue = 210 + (bassLevel * 20) + (highLevel * 40);
                      const saturation = 100 - (midLevel * 30);
                      const lightness = 50 + (level * 30);
                      const color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.25 + level * 0.5})`;
                      
                      // Create pulsing circles at different sizes/opacities for depth
                      return (
                        <motion.div
                          key={i}
                          className="absolute inset-0 rounded-full mix-blend-screen"
                          style={{ 
                            backgroundColor: color,
                            boxShadow: `0 0 ${15 + level * 15}px ${color}`,
                          }}
                          animate={{ 
                            scale: [
                              0.95 + (level * 0.05), 
                              0.97 + (level * 0.08), 
                              0.95 + (level * 0.05)
                            ],
                            opacity: [
                              0.2 + (level * 0.3),
                              0.3 + (level * 0.5),
                              0.2 + (level * 0.3)
                            ],
                          }}
                          transition={{
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                        />
                      );
                    })}
                    
                    {/* Bass impact ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/10"
                      animate={{ 
                        scale: [
                          1,
                          1 + Math.max(...audioData.slice(0, 5)) * 0.15,
                          1
                        ],
                        opacity: [0.5, 0.2, 0.5]
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "easeOut"
                      }}
                    />
                    
                    {/* Add an inner glow effect */}
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'radial-gradient(circle, rgba(212,175,55,0.22) 0%, rgba(16,24,39,0) 70%)',
                      }}
                    />
                  </>
                )}
                
                {/* Music icon */}
                <Music className={`h-6 w-6 z-10 ${isPlaying ? 'text-white' : 'text-gray-200'}`} />
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 
