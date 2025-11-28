import { useState, useEffect } from 'react';

export default function Header() {
  const [californiaTime, setCaliforniaTime] = useState('--:--');

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
      {/* Logo Area */}
      <div className="md:col-span-2 flex flex-col fade-up">
        <a href="#" className="font-serif-heading text-xl md:text-2xl lg:text-3xl tracking-tight text-white hover:text-[#D4AF37] transition-colors duration-500 font-semibold leading-tight">
          IFBARS
        </a>
      </div>

      {/* Role / Status */}
      <div className="hidden md:flex md:col-span-2 flex-col gap-1 fade-up delay-100">
        <span className="font-serif-heading text-xs uppercase tracking-widest text-neutral-400">
          Current Status
        </span>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse flex-shrink-0"></span>
          <span className="font-serif-body text-xs text-white leading-tight">
            Open to Opportunities
          </span>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="hidden md:flex md:col-span-2 flex-col gap-1 fade-up delay-200">
        <span className="font-serif-heading text-xs uppercase tracking-widest text-neutral-400">
          Focus Areas
        </span>
        <span className="font-serif-body text-xs text-white leading-tight">
          C#, Game Dev, AI
        </span>
      </div>

      {/* Location */}
      <div className="hidden md:flex md:col-span-2 flex-col gap-1 fade-up delay-200">
        <span className="font-serif-heading text-xs uppercase tracking-widest text-neutral-400">
          Location
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-serif-body text-xs text-white leading-tight">
            California
          </span>
          <span className="text-neutral-500 text-xs font-light font-mono">{californiaTime}</span>
        </div>
      </div>

      {/* Menu */}
      <div className="md:col-span-4 flex justify-start md:justify-end items-start md:items-center fade-up delay-300">
        <nav className="flex flex-row md:flex-col items-start md:items-end gap-3 md:gap-1.5 w-full md:w-auto">
          <a href="#projects" className="group flex items-center gap-2 font-serif-heading text-sm text-white hover-gold transition-all duration-300">
            <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-[#D4AF37] text-xs font-mono">
              01
            </span>
            <span className="relative">
              Projects
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </span>
          </a>
          <a href="#contributions" className="group flex items-center gap-2 font-serif-heading text-sm text-white hover-gold transition-all duration-300">
            <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-[#D4AF37] text-xs font-mono">
              02
            </span>
            <span className="relative">
              Contributions
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </span>
          </a>
          <a href="https://github.com/ifBars" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 font-serif-heading text-sm text-white hover-gold transition-all duration-300">
            <span className="opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-[#D4AF37] text-xs font-mono">
              03
            </span>
            <span className="relative">
              GitHub
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#D4AF37] group-hover:w-full transition-all duration-300"></span>
            </span>
          </a>
        </nav>
      </div>
    </header>
  );
}
