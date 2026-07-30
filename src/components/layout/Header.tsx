import { useState, useEffect, useMemo } from 'react';

function getTimeDiff(): string | null {
  try {
    const now = new Date();
    const pacific = new Date(now.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const local = new Date(now.toLocaleString('en-US'));
    const diffMinutes = Math.round((local.getTime() - pacific.getTime()) / 60000);
    const hours = Math.round(diffMinutes / 60);
    if (hours === 0) return "You're in the same timezone";
    const ahead = hours > 0;
    const absH = Math.abs(hours);
    const hStr = absH === 1 ? '1 hour' : `${absH} hours`;
    return ahead ? `You are ${hStr} ahead` : `You are ${hStr} behind`;
  } catch {
    return null;
  }
}

export default function Header() {
  const [californiaTime, setCaliforniaTime] = useState('--:--');
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const timeDiff = useMemo(getTimeDiff, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'America/Los_Angeles',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setCaliforniaTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full max-w-[1800px] mx-auto px-4 md:px-6 lg:px-8 py-2 md:py-3 grid grid-cols-1 md:grid-cols-12 gap-x-4 gap-y-2 items-center z-50 relative border-b border-white/5">
      {/* Role / Status */}
      <div className="hidden md:flex md:col-span-3 flex-col gap-1 fade-up">
        <span className="font-serif-heading text-xs uppercase tracking-widest text-neutral-400">
          Current Status
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse flex-shrink-0 shadow-[0_0_8px_rgba(212,175,55,0.5)]"></span>
          <span className="font-serif-body text-xs text-white leading-tight">
            Open to Full-Time Roles
          </span>
        </div>
      </div>

      <div className="hidden md:flex md:col-span-4 flex-col gap-1 fade-up">
        <span className="font-serif-heading text-xs uppercase tracking-widest text-neutral-400">
          Location
        </span>
        <div
          className="relative flex items-center gap-2 flex-wrap"
          onMouseEnter={() => setTooltipVisible(true)}
          onMouseLeave={() => setTooltipVisible(false)}
        >
          <i className="fas fa-location-dot text-[10px] text-[#D4AF37]/60" />
          <span className="font-serif-body text-xs text-white leading-tight cursor-default">
            California
          </span>
          <span className="text-neutral-500 text-xs font-light font-mono">{californiaTime}</span>
          {timeDiff && tooltipVisible && (
            <div className="animate-tooltip-enter absolute top-full left-0 mt-2.5 px-3 py-2 rounded-lg bg-neutral-900/95 border border-white/10 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.5)] whitespace-nowrap">
              <span className="font-serif-body text-[11px] text-neutral-300">{timeDiff}</span>
              <div className="absolute -top-1 left-4 w-2 h-2 bg-neutral-900/95 border-l border-t border-white/10 rotate-45" />
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-5 flex justify-start md:justify-end items-start md:items-center fade-up delay-200">
        <nav className="flex flex-row md:flex-col items-start md:items-end gap-3 md:gap-1.5 w-full md:w-auto">
          <a href="#projects" className="group flex items-center gap-2 font-serif-heading text-sm text-white hover-gold transition-all duration-300 focus-gold rounded-sm px-1 -mx-1 py-0.5 -my-0.5">
            <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 transition-all duration-300 text-[#D4AF37] text-xs font-mono">
              01
            </span>
            <span className="relative">
              My Work
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full group-focus-visible:w-full transition-all duration-300"></span>
            </span>
          </a>
          <a href="https://github.com/ifBars" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 font-serif-heading text-sm text-white hover-gold transition-all duration-300 focus-gold rounded-sm px-1 -mx-1 py-0.5 -my-0.5">
            <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 transition-all duration-300 text-[#D4AF37] text-xs font-mono">
              02
            </span>
            <span className="relative">
              GitHub
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full group-focus-visible:w-full transition-all duration-300"></span>
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
