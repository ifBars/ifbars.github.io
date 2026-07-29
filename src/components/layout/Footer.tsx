export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto w-full border-t border-white/5">
      <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-3 px-4 py-5 text-xs text-neutral-500 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="font-serif-body">
          IfBars / Founder &amp; Lead Developer at{' '}
          <a
            href="https://barsstudio.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm text-neutral-300 underline decoration-white/20 underline-offset-2 transition-colors hover:text-[#D4AF37] focus-gold"
          >
            Bars Studio
          </a>
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-serif-body">
          <span>
            Contact: <span className="text-neutral-300">Discord ifbars</span>
          </span>
          <span>
            Projects: <a href="https://github.com/ifBars" target="_blank" rel="noopener noreferrer" className="text-neutral-300 transition-colors hover:text-[#D4AF37] focus-gold rounded-sm px-1 -mx-1">GitHub</a> / <a href="https://next.nexusmods.com/profile/IfBars/mods" target="_blank" rel="noopener noreferrer" className="text-neutral-300 transition-colors hover:text-[#D4AF37] focus-gold rounded-sm px-1 -mx-1">Nexus Mods</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
