import { useState, useEffect } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show header after a delay to match the animation sequence
    const timer = setTimeout(() => {
      setVisible(true);
    }, 4000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <header className="fixed top-0 right-0 z-50 p-4 transition-opacity duration-1000 opacity-70 hover:opacity-100">
      <div className="flex justify-end">
        <button
          type="button"
          className="text-white hover:text-red-500 transition-colors duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-black/80 backdrop-blur-sm rounded-lg p-4 min-w-40">
          <nav>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#hero" 
                  className="block text-white hover:text-red-500 transition-colors duration-300 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
              </li>
              <li>
                <a 
                  href="#projects" 
                  className="block text-white hover:text-red-500 transition-colors duration-300 text-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Projects
                </a>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
} 