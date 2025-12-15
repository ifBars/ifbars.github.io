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
  const timeoutRef = useRef<number | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const [locked, setLocked] = useState(false);
  const [active, setActive] = useState(false);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [position, setPosition] = useState({ left: 0, top: 0 });

  const entry = useMemo(() => {
    if (reducedMotion) return TERMINAL_ENTRIES[0];
    return TERMINAL_ENTRIES[lineIndex] ?? TERMINAL_ENTRIES[0];
  }, [lineIndex, reducedMotion]);
  const command = entry.command;

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!active || reducedMotion) return;

    if (charIndex < command.length) {
      timeoutRef.current = window.setTimeout(() => {
        setCharIndex((prev) => prev + 1);
      }, 40);
      return;
    }

    timeoutRef.current = window.setTimeout(() => {
      setCharIndex(0);
      setLineIndex((prev) => (prev + 1) % TERMINAL_ENTRIES.length);
    }, 5000);
  }, [active, charIndex, command.length, reducedMotion]);

  useEffect(() => {
    if (!active) {
      setCharIndex(0);
      setLineIndex(0);
    }
  }, [active]);

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
      // Use requestAnimationFrame to ensure DOM is ready
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

  const show = () => {
    setActive(true);
    // Calculate position immediately
    requestAnimationFrame(() => {
      updatePosition();
    });
  };
  const hideIfUnlocked = () => {
    if (!locked) setActive(false);
  };

  const glowClass = reducedMotion ? '' : 'animate-text-glow';

  return (
    <>
      <span className="relative inline-flex align-baseline">
        <button
          ref={buttonRef}
          type="button"
          className={`group/btn inline-flex items-baseline rounded-md px-1.5 -mx-1.5 py-0.5 transition-all duration-300 underline decoration-2 decoration-white/20 hover:decoration-[#D4AF37]/80 focus-gold ${glowClass} hover:text-white/95`}
          onMouseEnter={show}
          onMouseLeave={hideIfUnlocked}
          onFocus={show}
          onBlur={hideIfUnlocked}
          onClick={() => {
            setLocked((prev) => !prev);
            setActive(true);
          }}
          aria-describedby={tooltipId}
          aria-expanded={active}
          title="Hover or click"
        >
          make them do things
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
        >
          <div className="relative rounded-lg border border-[#D4AF37]/30 bg-gradient-to-br from-black/95 via-[#0a0a0a]/95 to-black/95 px-4 py-3 text-[11px] font-mono text-neutral-200 shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_0_1px_rgba(212,175,55,0.1),0_0_24px_rgba(212,175,55,0.15)] backdrop-blur-xl pointer-events-auto">
            {/* Terminal top bar accent */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent rounded-t-lg" />
            
            {/* Terminal label */}
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[10px] text-[#D4AF37]/70 font-semibold uppercase tracking-wider">shipping log</span>
              <span className="flex-1 h-px bg-gradient-to-r from-[#D4AF37]/20 to-transparent" />
            </div>
            
            {/* Command line */}
            <div className="flex items-center gap-1 mb-3">
              <span className="text-[#D4AF37]/90 font-semibold select-none">&gt;</span>
              <span className="text-neutral-100 font-medium tracking-wide">
                {reducedMotion ? command : command.slice(0, charIndex)}
              </span>
              {!reducedMotion && (
                <span className="inline-block w-0.5 h-4 bg-[#D4AF37] animate-blink ml-0.5" />
              )}
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
            
            {/* Footer hint */}
            <div className="flex items-center justify-between pt-1.5 border-t border-white/5">
              <span className="text-[9px] text-neutral-500/80 italic">
                {locked ? 'click to close' : 'click to pin'}
              </span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1 h-1 rounded-full bg-[#D4AF37]/40"
                    style={{
                      animation: reducedMotion ? 'none' : `pulse 1.5s ease-in-out infinite ${i * 0.2}s`,
                    }}
                  />
                ))}
              </span>
            </div>
          </div>
        </span>,
        document.body
      )}
    </>
  );
}


