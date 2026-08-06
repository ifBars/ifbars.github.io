import ProjectImage from './ProjectImage';
import type { Project } from './ProjectCard';

interface SecurityProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function SecurityProjectCard({ project, onClick }: SecurityProjectCardProps) {
  return (
    <div
      className="project-card group mt-8 cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-[5px]"
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${project.name}`}
    >
      <div
        data-project-card-surface
        className="overflow-hidden rounded-xl border border-neutral-800 bg-black/40 shadow-[0_18px_55px_rgba(0,0,0,0.22)] backdrop-blur-sm transition-all duration-300 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_0_24px_rgba(212,175,55,0.18)] press-effect focus-gold"
      >
        <div className="grid md:grid-cols-[minmax(17rem,0.78fr)_minmax(0,1.22fr)]">
          <div
            data-project-card-media
            className="relative min-h-64 overflow-hidden bg-neutral-900 md:min-h-full"
          >
            <ProjectImage
              src={project.image ?? ''}
              alt={`${project.name} preview`}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 inline-flex items-center rounded-md border border-[#8BE9FD]/25 bg-black/65 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#8BE9FD] backdrop-blur-md">
              Security research
            </div>
          </div>

          <div className="flex flex-col justify-between p-6 sm:p-8">
            <div>
              <div className="inline-flex items-center rounded-md border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#D4AF37]">
                Official fix · v0.4.6f12
              </div>
              <h3 className="mt-4 font-serif-heading text-3xl font-semibold leading-tight text-white transition-colors duration-300 group-hover:text-[#D4AF37] md:text-4xl">
                {project.name}
              </h3>
              <p className="mt-3 max-w-2xl font-serif-body text-base leading-relaxed text-neutral-300">
                {project.description}
              </p>
              {project.subDescription ? (
                <p className="mt-3 max-w-2xl font-serif-body text-sm leading-relaxed text-neutral-500">
                  {project.subDescription}
                </p>
              ) : null}
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="cursor-default rounded border border-white/5 bg-neutral-800/60 px-2.5 py-0.5 font-serif-body text-xs text-neutral-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-[#D4AF37]/40 group-hover:text-neutral-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-neutral-800 bg-black/30 px-6 py-4 transition-colors group-hover:bg-neutral-900/50 sm:px-8">
          <span className="font-serif-body text-xs text-neutral-500 transition-colors group-hover:text-neutral-300">
            View Details
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-neutral-500 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[#D4AF37]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
