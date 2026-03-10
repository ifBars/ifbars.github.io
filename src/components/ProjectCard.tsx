import { useGithubStats } from '../hooks/useGithubStats';

export interface Project {
    name: string;
    projectUrl?: string | { label: string; url: string; description?: string; }[];
    sourceUrl?: string | { label: string; url: string; description?: string; }[];
    description: string;
    tags: string[];
    image?: string;
    demoImage?: string;
    youtubeVideos?: string[];
    subDescription?: string;
    isContribution?: boolean;
}

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
    className?: string; // For passing 'project-card' or 'contribution-card' for GSAP selectors
}

export default function ProjectCard({ project, onClick, className = '' }: ProjectCardProps) {
    const sourceUrl = typeof project.sourceUrl === 'string' 
        ? project.sourceUrl 
        : project.sourceUrl?.[0]?.url;
    const { stars, lastUpdated, loading } = useGithubStats(sourceUrl, project.name);

    return (
        <div
            className={`group cursor-pointer transition-transform duration-200 ease-out hover:-translate-y-[5px] ${className}`}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick();
                }
            }}
            aria-label={`View details for ${project.name}`}
        >
            <div className="block h-full">
                <div className="bg-black/40 backdrop-blur-sm border border-neutral-800 rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] flex flex-col press-effect focus-gold">
                    {/* Project Image */}
                    {project.image && (
                        <div className="relative w-full h-48 overflow-hidden bg-neutral-900/50">
                            <img 
                                src={project.image} 
                                alt={`${project.name} preview`}
                                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                        </div>
                    )}
                    
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-serif-heading text-2xl font-semibold text-white group-hover:text-[#D4AF37] transition-colors duration-300">
                                {project.name}
                            </h3>
                            <div className="flex items-center gap-2">
                                {!loading && stars > 0 && (
                                    <div className="flex items-center gap-1 bg-neutral-900/50 px-2 py-1 rounded-md border border-neutral-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[#D4AF37] fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-xs font-mono text-neutral-400">{stars}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {!loading && lastUpdated && (
                            <div className="flex items-center gap-1.5 mb-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500/60 animate-pulse" />
                                <span className="text-[10px] font-mono text-neutral-500">
                                    Updated {lastUpdated}
                                </span>
                            </div>
                        )}
                        <p className="font-serif-body text-neutral-400 mb-4 text-sm leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag, tagIndex) => (
                                <span
                                    key={tagIndex}
                                    className="bg-neutral-800/60 border border-white/5 text-xs font-serif-body px-2.5 py-0.5 rounded text-neutral-300 transition-all duration-300 group-hover:border-[#D4AF37]/40 group-hover:text-neutral-200 group-hover:-translate-y-0.5 cursor-default"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="px-6 py-4 border-t border-neutral-800 bg-black/30 flex justify-between items-center group-hover:bg-neutral-900/50 transition-colors">
                        <span className="font-serif-body text-xs text-neutral-500 group-hover:text-neutral-300 transition-colors">View Details</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 group-hover:text-[#D4AF37] transition-all duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}
