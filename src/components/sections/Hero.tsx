import { useEffect, useState } from 'react';
import HeroShader from '../HeroShader';
import { usePortfolioStore } from '../../store/usePortfolioStore';

export default function Hero() {
  const [contentVisible, setContentVisible] = useState(false);
  const { setIntroComplete } = usePortfolioStore();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setContentVisible(true);
      setIntroComplete();
    }, 250);

    return () => window.clearTimeout(timer);
  }, [setIntroComplete]);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="h-[calc(100vh-70px)] md:h-[calc(100vh-75px)] relative flex flex-col justify-center items-center px-6 pb-8 overflow-hidden">
      <HeroShader />

      <div className={`absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-[#050505] transition-opacity duration-700 ${contentVisible ? 'opacity-100' : 'opacity-0'}`} />
      <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-[#050505]/85 via-[#050505]/55 to-transparent pointer-events-none" />

      <div className={`relative z-10 flex flex-col items-start text-left gap-8 w-full max-w-4xl md:max-w-5xl md:pr-24 transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-3 pointer-events-none">
          <span className="h-px w-8 bg-[#D4AF37]/50" />
          <span className="uppercase tracking-[0.25em] text-[10px] md:text-xs text-neutral-300 font-serif-body fade-up delay-100">
            Software Developer
          </span>
        </div>

        <div className="flex flex-col gap-4 md:gap-6 pointer-events-none">
          <div className="leading-[0.95]">
            <h1 className="font-serif-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white fade-up delay-100 drop-shadow-[0_18px_48px_rgba(0,0,0,0.65)]">
              Hi, I'm IfBars.
            </h1>
            <p className="font-serif-heading text-xl sm:text-2xl md:text-3xl text-white/80 italic fade-up delay-200">
              I build game mods, security tooling, and unique web apps.
            </p>
          </div>
          <p className="font-serif-body text-sm md:text-base text-neutral-300 max-w-3xl fade-up delay-200">
            I create modding frameworks and tools for game communities, build React/TypeScript web apps, and develop APIs and developer tooling. My work spans between C# Unity game mods, web apps, serverless APIs, and more, all with a focus on extensibility, stability, and user experience.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 pointer-events-auto">
          <div className="hero-explore">
            <button
              onClick={scrollToProjects}
              className="group relative inline-flex items-center gap-3 px-6 py-3 border border-neutral-800 hover:border-[#D4AF37]/60 rounded-full bg-black/40 backdrop-blur-md transition-all duration-500 overflow-hidden cursor-pointer shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
            >
              <span className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
              <span className="font-serif-body text-xs text-neutral-300 group-hover:text-white relative z-10 tracking-wide">
                Explore My Projects
              </span>
              <i className="fas fa-arrow-down text-xs text-neutral-400 group-hover:text-[#D4AF37] relative z-10 transition-colors" />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 font-serif-body">
            {['Game Modding', 'Web & React', 'APIs & Tools'].map((pill) => (
              <span
                key={pill}
                className="relative group overflow-hidden px-3 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm text-neutral-300 transition-colors duration-500 hover:border-[#D4AF37]/60"
              >
                <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">{pill}</span>
              </span>
            ))}
          </div>
        </div>

        <div className={`flex flex-wrap items-center gap-4 z-10 pointer-events-auto transition-opacity duration-1000 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
          <a
            href="https://github.com/ifBars"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-[#D4AF37] transition-all duration-300 hover:scale-110"
            aria-label="GitHub"
          >
            <i className="fab fa-github text-3xl"></i>
          </a>
          <a
            href="https://open.spotify.com/user/31vogks3tg4am4wa3t2yya6nrpmm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-green-500 transition-all duration-300 hover:scale-110"
            aria-label="Spotify"
          >
            <i className="fab fa-spotify text-3xl"></i>
          </a>
          <a
            href="https://steamcommunity.com/id/ifbars/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-blue-500 transition-all duration-300 hover:scale-110"
            aria-label="Steam"
          >
            <i className="fab fa-steam text-3xl"></i>
          </a>
          <a
            href="https://next.nexusmods.com/profile/IfBars/mods"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-[#D4AF37] transition-all duration-300 hover:scale-110"
            aria-label="Nexus Mods"
          >
            <img
              src="/nexuslogo.webp"
              alt="Nexus Mods"
              className="w-8 h-8 object-contain filter grayscale brightness-150 opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100 hover:brightness-100"
            />
          </a>
          <a
            href="https://ko-fi.com/ifbars"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-[#FF5E5B] transition-all duration-300 hover:scale-110"
            aria-label="Ko-fi"
          >
            <i className="fas fa-mug-hot text-3xl"></i>
          </a>
        </div>
      </div>
    </section>
  );
}
