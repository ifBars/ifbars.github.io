import { useGitHubProfile } from '../hooks/useGitHubProfile';

export default function HeroProfileCard() {
  const profile = useGitHubProfile();

  return (
    <div
      className="hero-profile-card hidden lg:flex-row lg:flex items-start gap-5 w-[400px] xl:w-[440px] p-5 rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      aria-label="Developer profile summary"
    >
      <div className="relative flex-shrink-0">
        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-[#D4AF37]/20 ring-offset-2 ring-offset-[#0a0a0a]">
          <img
            src={profile.avatarUrl}
            alt="IfBars GitHub avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full ring-2 ring-[#0a0a0a]" title="Active" />
      </div>

      <div className="flex flex-col gap-3 min-w-0 flex-1">
        <div>
          <h3 className="font-serif-heading text-base text-white font-medium">{profile.name}</h3>
        </div>

        <p className="font-serif-body text-[11px] text-neutral-400 leading-relaxed">
          I started coding around age 11 with batch scripts, then moved through Java to C#. ProTV Converter was the first project I shared and maintained for others. Younger me would be proud of how far that curiosity has taken me.
        </p>

        <div className="flex items-center gap-5">
          <div>
            <span className="font-serif-heading text-base text-white tabular-nums">100+</span>
            <span className="font-serif-body text-[10px] text-neutral-500 uppercase tracking-wider ml-1.5">Projects</span>
          </div>
          <div>
            <span className="font-serif-heading text-base text-white tabular-nums">20+</span>
            <span className="font-serif-body text-[10px] text-neutral-500 uppercase tracking-wider ml-1.5">Contributions</span>
          </div>
        </div>
      </div>
    </div>
  );
}
