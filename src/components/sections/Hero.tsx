import { useState, useEffect, useRef } from 'react';
import backgroundVideo from '../../assets/videos/background.mp4';
import CursorParticles from '../CursorParticles';
import { motion } from 'framer-motion';

export default function Hero() {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [socialsVisible, setSocialsVisible] = useState(false);
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false);
  const [entered, setEntered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const fullName = "IfBars";
  const fullSubtitle = "Software Developer";

  useEffect(() => {
    if (!entered) return;

    // Reset states
    setName('');
    setSubtitle('');
    setSocialsVisible(false);
    setScrollIndicatorVisible(false);
    
    // Type name letter by letter with a Promise
    const typeName = () => {
      return new Promise<void>((resolve) => {
        let i = 0;
        const nameInterval = setInterval(() => {
          setName(fullName.substring(0, i + 1));
          i++;
          
          if (i >= fullName.length) {
            clearInterval(nameInterval);
            resolve();
          }
        }, 120);
      });
    };
    
    // Type subtitle letter by letter with a Promise
    const typeSubtitle = () => {
      return new Promise<void>((resolve) => {
        let i = 0;
        const subtitleInterval = setInterval(() => {
          setSubtitle(fullSubtitle.substring(0, i + 1));
          i++;
          
          if (i >= fullSubtitle.length) {
            clearInterval(subtitleInterval);
            resolve();
          }
        }, 100);
      });
    };
    
    // Execute typing sequence
    const executeTyping = async () => {
      // First type the name
      await typeName();
      
      // Wait a bit before typing subtitle
      await new Promise(resolve => setTimeout(resolve, 400));
      
      // Then type the subtitle
      await typeSubtitle();
      
      // Show social icons
      setTimeout(() => {
        setSocialsVisible(true);
        
        // Finally show scroll indicator after everything else
        setTimeout(() => {
          setScrollIndicatorVisible(true);
        }, 800);
      }, 300);
    };
    
    executeTyping();
  }, [entered]);

  // Create global mousemove listener for parallax
  useEffect(() => {
    if (!entered || !videoRef.current) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!videoRef.current) return;
      
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const xPercent = (clientX / innerWidth) * 100;
      const yPercent = (clientY / innerHeight) * 100;

      const translateX = (xPercent - 50) / 10;
      const translateY = (yPercent - 50) / 10;

      videoRef.current.style.transform = `scale(1.3) translate(${translateX}%, ${translateY}%)`;
    };

    // Initialize video with a scale
    if (videoRef.current) {
      videoRef.current.style.transform = 'scale(1.3) translate(0%, 0%)';
    }

    window.addEventListener('mousemove', handleGlobalMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [entered]);

  // Handle click to enter
  const handleEnter = () => {
    setEntered(true);
    
    // Store the entered state in localStorage
    try {
      localStorage.setItem('hasEntered', 'true');
    } catch (e) {
      console.error('Error setting localStorage:', e);
    }
    
    // Dispatch a custom event to notify other components
    const event = new CustomEvent('userEntered');
    window.dispatchEvent(event);
  };

  // Handle scroll to projects
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!entered) {
    return (
      <div 
        className="fixed inset-0 bg-black flex justify-center items-center text-white text-2xl font-sans cursor-pointer z-50"
        onClick={handleEnter}
      >
        <p className="animate-pulse">click to enter...</p>
      </div>
    );
  }

  return (
    <>
      {/* Background video container */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          className="absolute min-w-full min-h-full object-cover will-change-transform"
          style={{
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Cursor particles */}
      <CursorParticles />
      
      <section id="hero" className="min-h-screen relative flex flex-col items-center justify-center pt-20">
        <div className="text-center z-20">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 min-h-16">
            {name}<span className={name.length < fullName.length ? "animate-blink" : "hidden"}>|</span>
          </h1>
          <h2 className="text-2xl md:text-3xl text-gray-300 min-h-10">
            {subtitle}<span className={subtitle.length < fullSubtitle.length && name.length === fullName.length ? "animate-blink" : "hidden"}>|</span>
          </h2>
          
          <div className={`flex justify-center gap-8 mt-6 transition-opacity duration-1000 ${socialsVisible ? 'opacity-100' : 'opacity-0'}`}>
            <a 
              href="https://github.com/ifBars" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-white transition-transform duration-300 hover:scale-125"
            >
              <i className="fab fa-github text-4xl"></i>
            </a>
            <a 
              href="https://open.spotify.com/user/31vogks3tg4am4wa3t2yya6nrpmm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-green-500 transition-transform duration-300 hover:scale-125"
            >
              <i className="fab fa-spotify text-4xl"></i>
            </a>
            <a 
              href="https://steamcommunity.com/id/ifbars/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-500 transition-transform duration-300 hover:scale-125"
            >
              <i className="fab fa-steam text-4xl"></i>
            </a>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 cursor-pointer transition-opacity duration-1000 ${scrollIndicatorVisible ? 'opacity-100' : 'opacity-0'}`}
          onClick={scrollToProjects}
          initial={{ opacity: 0 }}
          animate={scrollIndicatorVisible ? 
            { opacity: 1, y: [0, 10, 0], transition: { y: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } } } : 
            { opacity: 0 }
          }
          whileHover={{ scale: 1.2 }}
        >
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-2">Scroll Down</p>
            <div className="flex flex-col items-center">
              <div className="w-8 h-14 rounded-full border-2 border-gray-500 flex justify-center p-1.5">
                <motion.div 
                  className="w-2 h-3 bg-blue-400 rounded-full"
                  animate={{ 
                    y: [0, 15, 0],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                />
              </div>
              <motion.svg
                className="mt-2 text-blue-400 w-6 h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <path
                  d="M12 4V20M12 20L6 14M12 20L18 14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
} 