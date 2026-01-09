import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  return reducedMotion;
}

type TerminalEntry = {
  command: string;
  detail: string;
  impact?: string;
  stack: string[];
};

const TERMINAL_ENTRIES: TerminalEntry[] = [
  {
    command: '> ship(S1API)',
    detail: "Schedule 1's unofficial modding framework powering most community releases.",
    impact: '25k+ downloads',
    stack: ['C#', 'MelonLoader', 'Framework'],
  },
  {
    command: '> harden(MLVScan)',
    detail: 'Security-first scanner that disables malicious MelonLoader mods before they boot.',
    impact: 'Protecting 25k+ users',
    stack: ['C#', 'Security', 'Reverse Engineering'],
  },
  {
    command: '> scale(S1DedicatedServers)',
    detail: 'First free and open-source dedicated server solution for Schedule 1, a P2P-only game.',
    impact: 'Open-source alternative for the community',
    stack: ['C#', 'Networking', 'Schedule 1'],
  },
  {
    command: '> contribute(RatScanner)',
    detail: 'Shipped UX upgrades for Tarkov players relying on realtime price checks mid-raid.',
    impact: 'Highly requested feature',
    stack: ['C#', 'WPF', 'Game Tools'],
  },
  {
    command: '> refactor(JarvisAI)',
    detail: 'Voice-driven assistant for Marvel Rivals with modular command routing.',
    impact: 'Fun tool for content creators',
    stack: ['Python', 'AI', 'Marvel Rivals'],
  },
];

export default function DoThingsEmphasis() {
  const reducedMotion = usePrefersReducedMotion();
  const id = useId();
  const tooltipId = `${id}-do-things-tooltip`;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const [locked, setLocked] = useState(false);
  const [active, setActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  const entry = useMemo(() => {
    return TERMINAL_ENTRIES[currentIndex] ?? TERMINAL_ENTRIES[0];
  }, [currentIndex]);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        left: rect.left,
        top: rect.bottom + 12,
      });
    }
  };

  useEffect(() => {
    if (active) {
      requestAnimationFrame(() => {
        updatePosition();
      });

      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [active]);

  const hideTimeoutRef = useRef<number | null>(null);

  const show = () => {
    if (hideTimeoutRef.current) {
      window.clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setActive(true);
    requestAnimationFrame(() => {
      updatePosition();
    });
  };
  
  const hideIfUnlocked = () => {
    if (!locked) {
      // Small delay to allow moving mouse to tooltip
      hideTimeoutRef.current = window.setTimeout(() => {
        setActive(false);
      }, 300);
    }
  };

  const nextEntry = () => {
    setCurrentIndex((prev) => (prev + 1) % TERMINAL_ENTRIES.length);
  };

  const prevEntry = () => {
    setCurrentIndex((prev) => (prev === 0 ? TERMINAL_ENTRIES.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (active && !locked) {
      const timer = setInterval(() => {
        nextEntry();
      }, 5000); // Rotate every 3 seconds if not locked
      return () => clearInterval(timer);
    }
  }, [active, locked]);

  // Keyboard navigation
  useEffect(() => {
    if (!active) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextEntry();
        e.preventDefault();
      } else if (e.key === 'ArrowLeft') {
        prevEntry();
        e.preventDefault();
      } else if (e.key === 'Escape') {
        setLocked(false);
        setActive(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active]);

  const glowClass = reducedMotion ? '' : 'animate-text-glow';

  return (
    <>
      <span className="relative inline-flex align-baseline">
        <button
          ref={buttonRef}
          type="button"
          className={`group/btn inline-flex items-baseline rounded-md px-1.5 -mx-1.5 py-0.5 transition-all duration-300 underline decoration-2 decoration-white/20 hover:decoration-[#D4AF37]/80 focus-visible:decoration-[#D4AF37]/80 focus-visible:text-white/95 focus:outline-none ${glowClass} hover:text-white/95`}
          onMouseEnter={show}
          onMouseLeave={hideIfUnlocked}
          onFocus={show}
          onBlur={hideIfUnlocked}
          onClick={() => {
            if (locked) {
              setLocked(false);
              setActive(false);
            } else {
              setLocked(true);
              setActive(true);
            }
          }}
          aria-describedby={tooltipId}
          aria-expanded={active}
          aria-label="Interactive project showcase button - click to pin and view featured projects"
          title="Click to pin and view featured projects"
        >
          making things work
        </button>
      </span>

      {active && typeof document !== 'undefined' && createPortal(
        <span
          ref={tooltipRef}
          id={tooltipId}
          role="note"
          className={`fixed z-[9999] w-[min(320px,85vw)] origin-top-left pointer-events-none ${reducedMotion ? '' : 'animate-tooltip-enter'}`}
          style={{
            left: `${position.left}px`,
            top: `${position.top}px`,
          }}
          onMouseEnter={show}
          onMouseLeave={hideIfUnlocked}
        >
          <div 
            className="relative rounded-lg border border-[#D4AF37]/30 bg-gradient-to-br from-black/95 via-[#0a0a0a]/95 to-black/95 px-4 py-3 text-[11px] font-mono text-neutral-200 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,175,55,0.1),0_0_24px_rgba(212,175,55,0.15)] backdrop-blur-xl pointer-events-auto"
            onMouseEnter={show}
            onMouseLeave={hideIfUnlocked}
          >
            {/* Terminal top bar accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent rounded-t-lg" />
            
            {/* Terminal label */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/20 to-transparent" />
            </div>
            
            <div key={currentIndex} className="animate-fade-in">
              {/* Command line */}
              <div className="flex items-center gap-1 mb-3">
                <span className="text-[#D4AF37]/90 font-semibold select-none">&gt;</span>
                <span className="text-neutral-100 font-medium tracking-wide">
                  {entry.command}
                </span>
              </div>
              
              {/* Proof */}
              <div className="space-y-2 mb-2.5">
                <p className="text-[11px] leading-snug text-neutral-300">
                  {entry.detail}
                </p>
                {entry.impact && (
                  <p className="text-[10px] font-semibold text-[#D4AF37]/90 tracking-wide">
                    {entry.impact}
                  </p>
                )}
              </div>
              
              {/* Stack */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {entry.stack.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-wider text-neutral-300/90 bg-white/5 border border-white/10 rounded-full px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Footer hint with carousel controls */}
            <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
              <span className="text-[9px] text-neutral-500/80 italic">
                {locked ? (
                  <span className="flex items-center gap-1.5">
                    <span className="flex gap-0.5">
                      <span className="px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-sans">←</span>
                      <span className="px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-sans">→</span>
                    </span>
                    <span>nav</span>
                    <span className="w-px h-2 bg-white/10 mx-0.5" />
                    <span className="px-1 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-sans">ESC</span>
                    <span>close</span>
                  </span>
                ) : 'Click to pin'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevEntry();
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-neutral-400 hover:text-[#D4AF37]"
                  aria-label="Previous project"
                  title="Previous (Left Arrow)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="flex items-center gap-1.5">
                  <span className="text-[9px] text-neutral-600">{currentIndex + 1}/{TERMINAL_ENTRIES.length}</span>
                  <span className="flex gap-1">
                    {TERMINAL_ENTRIES.map((_, i) => (
                      <span
                        key={i}
                        className={`w-1 h-1 rounded-full transition-colors duration-300 ${
                          i === currentIndex ? 'bg-[#D4AF37]' : 'bg-[#D4AF37]/20'
                        }`}
                      />
                    ))}
                  </span>
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextEntry();
                  }}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 transition-colors text-neutral-400 hover:text-[#D4AF37]"
                  aria-label="Next project"
                  title="Next (Right Arrow)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </span>,
        document.body
      )}
    </>
  );
}


