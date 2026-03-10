export default function WorkWithMe() {
  return (
    <section id="work-with-me" className="py-20 relative z-10">
      <div className="container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-neutral-800 bg-black/40 backdrop-blur-sm overflow-hidden">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

          <div className="px-6 py-10 md:px-10 md:py-14">
            <div className="max-w-3xl space-y-6">
              <div className="space-y-3">
                <h2 className="font-serif-heading text-3xl font-semibold text-white md:text-5xl">
                  Work With Me
                </h2>
              </div>

              <p className="max-w-2xl font-serif-body text-sm leading-relaxed text-neutral-300 md:text-base">
                I like building things that have to actually work - security tooling, reverse engineering-heavy systems, game modding infrastructure, and focused web products.
              </p>

              <p className="max-w-2xl font-serif-body text-sm leading-relaxed text-neutral-400 md:text-base">
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
