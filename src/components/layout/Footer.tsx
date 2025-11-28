export default function Footer() {
  return (
    <footer className="w-full max-w-[1800px] mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs z-20 relative border-t border-white/5 mt-auto">
      {/* Column 1: Description */}
      <div className="flex flex-col gap-4">
        <p className="font-serif-body text-neutral-400 leading-relaxed max-w-xs">
          Hobbyist developer focused on C#, game development, AI projects, and unique web experiences.
        </p>
      </div>

      {/* Column 2: Stack */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif-heading text-white text-sm">Tech Stack</h3>
        <div className="grid grid-cols-2 gap-2 text-neutral-500 font-serif-body">
          <span>C#</span>
          <span>React</span>
          <span>TypeScript</span>
          <span>Three.js</span>
          <span>Python</span>
          <span>C++</span>
        </div>
      </div>

      {/* Column 3: Socials */}
      <div className="flex flex-col gap-4">
        <h3 className="font-serif-heading text-white text-sm">Connect</h3>
        <div className="flex flex-col gap-2 font-serif-body">
          <a href="https://github.com/ifBars" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group">
            GitHub
            <i className="fas fa-arrow-up-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </a>
          <a href="https://next.nexusmods.com/profile/IfBars/mods" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group">
            Nexus Mods
            <i className="fas fa-arrow-up-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </a>
          <a href="https://ko-fi.com/ifbars" target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-[#D4AF37] transition-colors flex items-center gap-2 group">
            Ko-fi
            <i className="fas fa-arrow-up-right text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"></i>
          </a>
        </div>
      </div>

      {/* Column 4: Copyright */}
      <div className="flex flex-col justify-end items-start md:items-end gap-1 text-neutral-600">
        <span className="font-serif-heading text-lg text-white">© {new Date().getFullYear()}</span>
        <span className="font-serif-body text-[10px] uppercase tracking-wider">
          IfBars
        </span>
      </div>
    </footer>
  );
} 