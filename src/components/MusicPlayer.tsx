import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume, Volume1, Volume2, VolumeX, Music, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Play, Pause, ListMusic } from 'lucide-react';

// Import all audio files
import morningAgain from '../assets/audio/Morning Again.mp3';
import cavalier from '../assets/audio/Cavalier.mp3';
import sipSlow from '../assets/audio/Sip Slow.mp3';
import unexplainable from '../assets/audio/Unexplainable (feat. The KID LAROI).mp3';
import doubleDate from '../assets/audio/Double Date.mp3';
import swerve from '../assets/audio/Swerve.mp3';

interface Song {
  src: string;
  name: string;
  artist: string;
  id: string;
}

type RepeatMode = 'off' | 'all' | 'one';

export default function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem('musicPlayerVolume');
    return savedVolume ? parseFloat(savedVolume) : 0.5;
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const savedIndex = localStorage.getItem('musicPlayerTrackIndex');
    return savedIndex ? parseInt(savedIndex) : 0;
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isShuffled, setIsShuffled] = useState(() => {
    return localStorage.getItem('musicPlayerShuffle') === 'true';
  });
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => {
    const savedMode = localStorage.getItem('musicPlayerRepeat') as RepeatMode;
    return savedMode || 'off';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [hasEntered, setHasEntered] = useState(() => {
    try {
      return localStorage.getItem('hasEntered') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isMuted, setIsMuted] = useState(false);
  const [audioData, setAudioData] = useState<number[]>(Array(32).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [playlist, setPlaylist] = useState<Song[]>(() => {
    const initial = [
      { src: morningAgain, name: "Morning Again", artist: "Juice WRLD", id: "1" },
      { src: cavalier, name: "Cavalier", artist: "Juice WRLD", id: "2" },
      { src: sipSlow, name: "Sip Slow", artist: "Juice WRLD", id: "3" },
      { src: unexplainable, name: "Unexplainable", artist: "Juice WRLD & Kid LAROI", id: "4" },
      { src: doubleDate, name: "Double Date", artist: "Juice WRLD", id: "5" },
      { src: swerve, name: "Swerve", artist: "Juice WRLD", id: "6" }
    ];

    // Try to restore the order from localStorage
    try {
      const savedOrder = localStorage.getItem('musicPlayerPlaylistOrder');
      if (savedOrder) {
        const orderIds = JSON.parse(savedOrder);
        if (Array.isArray(orderIds)) {
          // Re-order based on saved order
          return orderIds.map(id => initial.find(song => song.id === id))
            .filter(Boolean) as Song[];
        }
      }
    } catch (e) {
      console.error("Error restoring playlist order:", e);
    }

    return initial;
  });

  // Original, unshuffled playlist for reference
  const [originalPlaylist] = useState<Song[]>([...playlist]);

  // Function to check if user has entered (to use in multiple places)
  const checkEntered = () => {
    try {
      return localStorage.getItem('hasEntered') === 'true';
    } catch (e) {
      return false;
    }
  };

  // Monitor the entry state and initialize audio when user enters
  useEffect(() => {
    // Set up event listener for when user enters
    const handleUserEntered = () => {
      console.log('User entered event detected');
      setHasEntered(true);
      
      // Wait a moment to initialize audio
      setTimeout(() => {
        initializeAudio();
      }, 1000);
    };
    
    window.addEventListener('userEntered', handleUserEntered);
    
    // Check for changes to localStorage
    const intervalCheck = setInterval(() => {
      const entered = checkEntered();
      if (entered && !hasEntered) {
        setHasEntered(true);
        setTimeout(() => {
          initializeAudio();
        }, 1000);
      }
    }, 500);
    
    // Initial check on mount
    if (checkEntered() && !isInitialized) {
      setHasEntered(true);
      setTimeout(() => {
        initializeAudio();
      }, 1000);
    }
    
    // Cleanup event listeners
    return () => {
      window.removeEventListener('userEntered', handleUserEntered);
      clearInterval(intervalCheck);
    };
  }, [hasEntered, isInitialized]);

  // Handle shuffle state
  useEffect(() => {
    if (isShuffled) {
      shufflePlaylist();
    } else {
      // Restore original order but keep current song as current
      const currentSong = playlist[currentTrackIndex];
      setPlaylist([...originalPlaylist]);
      
      // Find where current song is in original list
      const newIndex = originalPlaylist.findIndex(song => song.id === currentSong.id);
      if (newIndex !== -1) {
        setCurrentTrackIndex(newIndex);
      }
    }
    
    localStorage.setItem('musicPlayerShuffle', isShuffled.toString());
  }, [isShuffled]);

  // Save current track index to localStorage
  useEffect(() => {
    localStorage.setItem('musicPlayerTrackIndex', currentTrackIndex.toString());
    
    // Also save the current playlist order
    try {
      const playlistOrder = playlist.map(song => song.id);
      localStorage.setItem('musicPlayerPlaylistOrder', JSON.stringify(playlistOrder));
    } catch (e) {
      console.error("Error saving playlist order:", e);
    }
  }, [currentTrackIndex, playlist]);

  // Save volume to localStorage
  useEffect(() => {
    localStorage.setItem('musicPlayerVolume', volume.toString());
    
    // Update muted state based on volume
    if (volume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  }, [volume, isMuted]);

  // Save repeat mode to localStorage
  useEffect(() => {
    localStorage.setItem('musicPlayerRepeat', repeatMode);
  }, [repeatMode]);

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

    // Set initial volume
    audio.volume = volume;

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrackIndex, repeatMode, playlist.length]);

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
          setVolume(prev => Math.min(prev + 0.1, 1));
          break;
        case 'ArrowDown':
          // Decrease volume
          e.preventDefault(); // Prevent page scrolling
          setVolume(prev => Math.max(prev - 0.1, 0));
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
          setShowPlaylist(prev => !prev);
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
  }, [isExpanded, duration, hasEntered]);

  // Initialize audio when user enters
  const initializeAudio = () => {
    console.log('Initializing audio');
    if (!isInitialized && audioRef.current) {
      setIsInitialized(true);
      
      // Load the audio first
      audioRef.current.load();
      
      // Force a user interaction before playing to deal with autoplay policies
      const playAttempt = audioRef.current.play();
      
      if (playAttempt !== undefined) {
        playAttempt
          .then(() => {
            console.log('Audio started playing successfully');
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Playback failed:", error);
            setIsPlaying(false);
            // Retry once more after a delay
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play()
                  .then(() => {
                    console.log('Audio retry successful');
                    setIsPlaying(true);
                  })
                  .catch(err => {
                    console.error("Retry playback failed:", err);
                  });
              }
            }, 1000);
          });
      }
    }
  };

  // Set up audio analyzer when component mounts
  useEffect(() => {
    if (!hasEntered || !audioRef.current) return;
    
    // Create audio context and analyzer
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 128; // Increase for more frequency resolution
    
    // Connect audio element to analyzer
    const source = audioContext.createMediaElementSource(audioRef.current);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    // Save references
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
    let prevData = Array(analyser.frequencyBinCount).fill(0);
    
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

  // Function to safely play audio
  const safelyPlayAudio = () => {
    if (!audioRef.current) return;
    
    // Resume audio context if it was suspended
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    const playPromise = audioRef.current.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch(err => {
          console.error("Play failed:", err);
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => console.error("Retry play failed:", e));
            }
          }, 100);
        });
    }
  };

  // Modified togglePlayPause to use the safe play function
  const togglePlayPause = () => {
    if (!isInitialized) {
      initializeAudio();
      return;
    }

    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        safelyPlayAudio();
      }
    }
  };

  // Updated playNextTrack to use safe play
  const playNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        safelyPlayAudio();
      }, 100);
    }
  };

  // Updated playPrevTrack to use safe play
  const playPrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    if (isPlaying && audioRef.current) {
      setTimeout(() => {
        safelyPlayAudio();
      }, 100);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume > 0 && !isMuted) {
      // Store the current volume to restore later
      localStorage.setItem('previousVolume', volume.toString());
      setVolume(0);
      setIsMuted(true);
    } else {
      // Restore the previous volume or set to 0.5 if none
      const previousVolume = localStorage.getItem('previousVolume');
      setVolume(previousVolume ? parseFloat(previousVolume) : 0.5);
      setIsMuted(false);
    }
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

  const shufflePlaylist = () => {
    // Keep track of the current song
    const currentSong = playlist[currentTrackIndex];
    
    // Create a copy and shuffle it
    const newPlaylist = [...playlist];
    for (let i = newPlaylist.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newPlaylist[i], newPlaylist[j]] = [newPlaylist[j], newPlaylist[i]];
    }
    
    // Make sure the current song stays as current
    const newIndex = newPlaylist.findIndex(song => song.id === currentSong.id);
    if (newIndex !== -1 && newIndex !== 0) {
      // Swap current song to first position
      [newPlaylist[0], newPlaylist[newIndex]] = [newPlaylist[newIndex], newPlaylist[0]];
    }
    
    setPlaylist(newPlaylist);
    setCurrentTrackIndex(0); // Reset to beginning of shuffled playlist (where current song is)
  };

  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
  };

  const toggleRepeat = () => {
    setRepeatMode(current => {
      if (current === 'off') return 'all';
      if (current === 'all') return 'one';
      return 'off';
    });
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

  // Don't render anything if user hasn't entered
  if (!hasEntered) {
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

        <div className="fixed top-8 left-8 z-50">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, height: 0, width: 0, originY: 0, originX: 0 }}
                animate={{ opacity: 1, height: 'auto', width: 'auto' }}
                exit={{ opacity: 0, height: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="bg-black/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-800 overflow-hidden"
              >
              <div className={`p-5 w-80 ${showPlaylist ? 'h-96 overflow-y-auto' : ''}`}>
                  <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={() => setShowPlaylist(prev => !prev)}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Toggle playlist view"
                  >
                    <ListMusic className="h-5 w-5" />
                  </button>
                    <div className="text-center flex-1">
                      <h3 className="text-white font-medium">Music Player</h3>
                    </div>
                    <button 
                      onClick={() => setIsExpanded(false)} 
                      className="text-gray-400 hover:text-white transition-colors"
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
                        className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {filteredPlaylist.map((song) => (
                        <div 
                          key={song.id}
                          onClick={() => playSpecificTrack(playlist.findIndex(s => s.id === song.id))}
                          className={`p-2 rounded-md cursor-pointer flex items-center justify-between ${
                            currentSong.id === song.id 
                              ? 'bg-blue-900/50 border border-blue-500' 
                              : 'hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="text-white font-medium truncate">{song.name}</div>
                            <div className="text-gray-400 text-xs">{song.artist}</div>
                          </div>
                          {currentSong.id === song.id && isPlaying && (
                            <div className="flex space-x-0.5 items-center">
                              <motion.div 
                                className="bg-blue-500 w-1 h-3 rounded-full"
                                animate={{ height: [3, 6, 3] }}
                                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
                              />
                              <motion.div 
                                className="bg-blue-500 w-1 h-4 rounded-full"
                                animate={{ height: [4, 8, 4] }}
                                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", delay: 0.2 }}
                              />
                              <motion.div 
                                className="bg-blue-500 w-1 h-2 rounded-full"
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
                      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Controls */}
                    <div className="flex justify-center items-center space-x-4 mb-4">
                      <div className="relative">
                        <button 
                          onClick={toggleShuffle}
                          className={`p-1.5 rounded-md transition-colors ${
                            isShuffled 
                              ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50' 
                              : 'text-gray-400 hover:text-white hover:bg-gray-700/40'
                          }`}
                          title="Shuffle"
                        >
                          <Shuffle className="h-5 w-5" strokeWidth={isShuffled ? 2.5 : 2} />
                        </button>
                        {isShuffled && (
                          <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
                            ⤭
                          </span>
                        )}
                      </div>
                      
                    <button 
                      onClick={playPrevTrack}
                      className="text-gray-400 hover:text-white transition-colors"
                        title="Previous track"
                    >
                        <SkipBack className="h-6 w-6" />
                    </button>
                    
                    <button 
                      onClick={togglePlayPause}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 focus:outline-none transition-colors"
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
                      className="text-gray-400 hover:text-white transition-colors"
                        title="Next track"
                      >
                        <SkipForward className="h-6 w-6" />
                      </button>
                      
                      <div className="relative">
                        <button 
                          onClick={toggleRepeat}
                          className={`p-1.5 rounded-md transition-colors ${
                            repeatMode === 'off'
                              ? 'text-gray-400 hover:text-white hover:bg-gray-700/40'
                              : repeatMode === 'one'
                                ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
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
                          <span className="absolute -top-1 -right-1 text-xs bg-blue-500 text-white rounded-full w-3 h-3 flex items-center justify-center">
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
                      <button onClick={toggleMute} className="text-gray-400 hover:text-white">
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
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  )}
                
                {/* Keyboard shortcuts info - only show in main player view */}
                {!showPlaylist && (
                  <div className="mt-2 text-xs text-gray-500">
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
              className="bg-black/70 backdrop-blur-md text-white p-0 rounded-full shadow-lg border border-gray-800 group flex items-center justify-center relative overflow-hidden w-16 h-16"
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
                      className="absolute inset-0 rounded-full border-2 border-blue-400/10"
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
                        background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, rgba(16,24,39,0) 70%)',
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