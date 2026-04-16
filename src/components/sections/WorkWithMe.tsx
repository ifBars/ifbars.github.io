export default function WorkWithMe() {
  const borderPath = 'M 600 1 H 1167 A 32 32 0 0 1 1199 33 V 387 A 32 32 0 0 1 1167 419 H 33 A 32 32 0 0 1 1 387 V 33 A 32 32 0 0 1 33 1 H 600';

  return (
    <section id="work-with-me" className="py-10 relative z-10">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="work-with-me-shell rounded-[2rem]">
          <svg
            aria-hidden="true"
            className="work-with-me-border absolute inset-0 h-full w-full pointer-events-none"
            viewBox="0 0 1200 420"
            preserveAspectRatio="none"
          >
            <defs>
              <radialGradient id="work-with-me-gold-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f2dfab" stopOpacity="0.98" />
                <stop offset="24%" stopColor="#cda24b" stopOpacity="0.92" />
                <stop offset="58%" stopColor="#8a6421" stopOpacity="0.42" />
                <stop offset="100%" stopColor="#4f3a14" stopOpacity="0" />
              </radialGradient>
              <filter id="work-with-me-gold-blur" x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="12" />
              </filter>
              <mask id="work-with-me-border-mask">
                <rect width="1200" height="420" fill="black" />
                <path d={borderPath} className="work-with-me-border-mask" />
              </mask>
            </defs>
            <path d={borderPath} className="work-with-me-border-base" />
            <g className="work-with-me-border-glow" mask="url(#work-with-me-border-mask)">
              <ellipse rx="96" ry="28" fill="url(#work-with-me-gold-glow)" filter="url(#work-with-me-gold-blur)">
                <animateMotion dur="7.2s" repeatCount="indefinite" rotate="auto" calcMode="linear" path={borderPath} />
              </ellipse>
              <ellipse rx="62" ry="18" fill="url(#work-with-me-gold-glow)" filter="url(#work-with-me-gold-blur)" opacity="0.55">
                <animateMotion dur="7.2s" begin="-0.55s" repeatCount="indefinite" rotate="auto" calcMode="linear" path={borderPath} />
              </ellipse>
            </g>
          </svg>
          <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="font-serif-heading text-3xl font-semibold text-white md:text-5xl">
                  Work With Me
                </h2>
              </div>

              <p className="font-serif-body text-sm leading-relaxed text-neutral-300 md:text-base">
                I like building things that have to actually work - security tooling, reverse engineering-heavy systems, game modding infrastructure, and focused web products.
              </p>

              <p className="font-serif-body text-sm leading-relaxed text-neutral-400 md:text-base">
                If you&apos;re working on something weird, useful, or difficult to get right, I&apos;m probably interested.
              </p>

              <p className="font-mono text-xs uppercase tracking-[0.24em] text-neutral-500 md:text-sm">
                Discord: <span className="text-[#D4AF37]">ifbars</span>
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://github.com/ifBars"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 font-serif-body text-sm font-bold text-black transition-all hover:-translate-y-0.5 hover:bg-[#c4a030] focus-gold"
                >
                  <span>GitHub</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                <a
                  href="https://next.nexusmods.com/profile/IfBars/mods"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/70 px-5 py-3 font-serif-body text-sm text-neutral-200 transition-all hover:-translate-y-0.5 hover:border-[#D4AF37]/40 hover:text-white focus-gold"
                >
                  <span>Nexus Mods</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 transition-colors group-hover:text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
