import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { Project } from './ProjectCard';
import { useGithubStats } from '../hooks/useGithubStats';
import { useDownloadStats } from '../hooks/useDownloadStats';
import { formatFullNumber } from '../utils/numberFormat';
import ProjectImage from './ProjectImage';

interface ProjectModalProps {
    selectedProject: Project;
    onClose: () => void;
}

export default function ProjectModal({ selectedProject, onClose }: ProjectModalProps) {
    const lenis = useLenis();
    const primarySourceUrl = typeof selectedProject.sourceUrl === 'string' 
        ? selectedProject.sourceUrl 
        : selectedProject.sourceUrl?.[0]?.url || '';
    const projectLinks = typeof selectedProject.projectUrl === 'string'
        ? [{ label: 'Visit Project', url: selectedProject.projectUrl }]
        : selectedProject.projectUrl || [];
    
    const getRepoPath = (url: string) => {
        if (!url) return { owner: 'ifBars', repo: selectedProject.name.toLowerCase().replace(/\s+/g, '-') };
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(Boolean);
            return {
                owner: pathParts[0],
                repo: pathParts[1] || selectedProject.name.toLowerCase().replace(/\s+/g, '-')
            };
        } catch {
            return { owner: 'ifBars', repo: selectedProject.name.toLowerCase().replace(/\s+/g, '-') };
        }
    };
    
    const repoPath = getRepoPath(primarySourceUrl);
    const repoStats = useGithubStats(primarySourceUrl, selectedProject.name);
    const downloadStats = useDownloadStats(selectedProject.statSources);
    const showDownloadStats = downloadStats.loading || Boolean(downloadStats.totalDownloads);
    const showDownloadBreakdown = downloadStats.sources.length > 1;
    const previewImage = selectedProject.demoImage || selectedProject.image;
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    useEffect(() => {
        if (lenis) lenis.stop();
        const previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            if (lenis) lenis.start();
            document.body.style.overflow = previousBodyOverflow;
            window.removeEventListener('keydown', handleEsc);
        };
    }, [lenis, onClose]);

    const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.split('v=')[1]?.split('&')[0];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    const nextVideo = () => {
        if (selectedProject.youtubeVideos) {
            setCurrentVideoIndex((prev) => (prev + 1) % selectedProject.youtubeVideos!.length);
        }
    };

    const prevVideo = () => {
        if (selectedProject.youtubeVideos) {
            setCurrentVideoIndex((prev) => 
                prev === 0 ? selectedProject.youtubeVideos!.length - 1 : prev - 1
            );
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[100] flex items-start justify-center p-3 pt-4 sm:p-4 md:items-center md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
                aria-label="Close modal"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="relative z-20 flex max-h-[calc(100svh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-[#0a0a0a] shadow-2xl sm:max-h-[calc(100svh-2.5rem)] md:rounded-3xl"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="project-modal-title"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-3 top-3 z-40 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/70 text-neutral-300 shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:border-[#D4AF37]/50 hover:text-white focus-gold md:right-4 md:top-4"
                    aria-label="Close project details"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                    </svg>
                </button>

                {/* ESC Hint */}
                <motion.div
                    className="pointer-events-none absolute left-1/2 top-4 z-30 hidden -translate-x-1/2 items-center gap-2 font-mono text-xs text-neutral-500 opacity-50 md:flex"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{
                        opacity: 0.5,
                        y: [0, 4, 0]
                    }}
                    transition={{
                        opacity: { duration: 0.5, delay: 0.5 },
                        y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                >
                    <span className="border border-neutral-700 bg-neutral-900/50 px-1.5 py-0.5 rounded text-[10px] tracking-wider">ESC</span>
                    <span className="text-[10px]">to exit</span>
                </motion.div>

                {/* Golden Glow Effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Header Decoration */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

                {/* Main Content Container */}
                <div data-lenis-prevent className="project-modal-scroll relative overflow-y-auto overscroll-contain px-5 pb-6 pt-7 sm:px-6 sm:pb-7 sm:pt-8 md:p-10">
                    {/* Header Section */}
                    <div className="mb-6 pr-10 md:mb-8 md:pr-0">
                        <div className="mb-4 flex flex-wrap items-center gap-2 opacity-75 sm:gap-3">
                            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-wide sm:text-xs md:text-sm">
                                <span className="max-w-full break-all text-[#FF79C6]">{repoPath.owner}</span>
                                <span className="text-neutral-600">/</span>
                                <span className="max-w-full break-all text-[#50FA7B]">{repoPath.repo}</span>
                            </div>
                            <span className="rounded-full border border-neutral-700/50 bg-neutral-800/80 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-neutral-400">Public</span>
                        </div>

                        <h2 id="project-modal-title" className="break-words font-serif-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                            {selectedProject.name}
                        </h2>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 gap-7 md:grid-cols-3 md:gap-12">

                        {/* Left Column: Description (Span 2) */}
                        <div className="space-y-5 md:col-span-2 md:space-y-6">
                            <div className="prose prose-invert max-w-none">
                                {selectedProject.isContribution && (
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 rounded-md bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono uppercase tracking-wider">
                                            Contribution
                                        </span>
                                    </div>
                                )}
                                <h3 className="text-xl font-serif-heading text-neutral-200 mb-3">
                                    {selectedProject.description}
                                </h3>
                                <p className="font-serif-body text-sm leading-relaxed text-neutral-400 md:text-base">
                                    {selectedProject.subDescription || selectedProject.description}
                                </p>
                            </div>

                            {/* YouTube Video Carousel */}
                            {selectedProject.youtubeVideos && selectedProject.youtubeVideos.length > 0 && (
                                <div className="max-w-md overflow-hidden rounded-xl border border-neutral-800/50 bg-neutral-900/30">
                                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={getYouTubeEmbedUrl(selectedProject.youtubeVideos[currentVideoIndex])}
                                            title={`${selectedProject.name} video ${currentVideoIndex + 1}`}
                                            className="absolute top-0 left-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        />
                                    </div>
                                    {selectedProject.youtubeVideos.length > 1 && (
                                        <div className="flex items-center justify-between px-3 py-2 bg-black/40 border-t border-neutral-800/50">
                                            <button
                                                onClick={prevVideo}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 hover:text-white transition-all text-xs font-mono"
                                                aria-label="Previous video"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                                Prev
                                            </button>
                                            <span className="text-xs font-mono text-neutral-500">
                                                {currentVideoIndex + 1} / {selectedProject.youtubeVideos.length}
                                            </span>
                                            <button
                                                onClick={nextVideo}
                                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-300 hover:text-white transition-all text-xs font-mono"
                                                aria-label="Next video"
                                            >
                                                Next
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Demo Image/GIF - positioned inline with description */}
                            {!selectedProject.youtubeVideos && previewImage && (
                                <div className="overflow-hidden rounded-xl border border-neutral-800/50 bg-neutral-900/30">
                                    <ProjectImage
                                        src={previewImage}
                                        alt={`${selectedProject.name} demo`}
                                        className="w-full h-auto object-contain"
                                        fallbackClassName="min-h-40"
                                        style={{ maxHeight: 'min(300px, 42svh)' }}
                                    />
                                </div>
                            )}

                            {/* Tags Row */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {selectedProject.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className={`
                                                px-3 py-1 rounded-md text-xs font-mono border
                                                ${i % 3 === 0 ? 'bg-[#FF79C6]/5 border-[#FF79C6]/20 text-[#FF79C6]' : ''}
                                                ${i % 3 === 1 ? 'bg-[#50FA7B]/5 border-[#50FA7B]/20 text-[#50FA7B]' : ''}
                                                ${i % 3 === 2 ? 'bg-[#8BE9FD]/5 border-[#8BE9FD]/20 text-[#8BE9FD]' : ''}
                                            `}
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Actions & Stats (Span 1) */}
                        <div className="flex flex-col gap-5 md:sticky md:top-0 md:self-start md:gap-6">
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                {projectLinks.length > 0 && (
                                    projectLinks.length === 1 ? (
                                        <a
                                            href={projectLinks[0].url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center justify-between px-5 py-3.5 bg-[#D4AF37] text-black font-serif-body font-bold text-sm rounded-xl hover:bg-[#c4a030] transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 press-effect focus-gold"
                                        >
                                            <span>{projectLinks[0].label}</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                            </svg>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 11-5.656-5.656l1.5-1.5m7.156-1.5l1.5-1.5a4 4 0 115.656 5.656l-3 3a4 4 0 01-5.656 0" />
                                                </svg>
                                                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Project Links</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-1.5">
                                                {projectLinks.map((link, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`group flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-all press-effect focus-gold ${idx === 0 ? 'bg-[#D4AF37] text-black hover:bg-[#c4a030]' : 'bg-neutral-900/50 border border-neutral-800 hover:border-[#D4AF37]/40 hover:bg-neutral-900'}`}
                                                    >
                                                        <div className="flex flex-col min-w-0 flex-1">
                                                            <span className={`text-xs font-mono transition-colors truncate ${idx === 0 ? 'text-black' : 'text-white group-hover:text-[#D4AF37]'}`}>
                                                                {link.label}
                                                            </span>
                                                            {link.description && (
                                                                <span className={`text-[10px] truncate ${idx === 0 ? 'text-black/70' : 'text-neutral-600'}`}>
                                                                    {link.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-colors flex-shrink-0 ${idx === 0 ? 'text-black/70' : 'text-neutral-600 group-hover:text-[#D4AF37]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                )}
                                {selectedProject.sourceUrl && (
                                    <>
                                        {typeof selectedProject.sourceUrl === 'string' ? (
                                            <a
                                                href={selectedProject.sourceUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="group flex items-center justify-center gap-2 px-5 py-3.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 font-mono text-sm rounded-xl transition-all hover:text-white press-effect focus-gold"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                </svg>
                                                <span>View Source</span>
                                            </a>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                    </svg>
                                                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Ecosystem Repos</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    {selectedProject.sourceUrl.map((repo, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={repo.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="group flex items-center justify-between gap-2 px-3 py-2 bg-neutral-900/50 border border-neutral-800 hover:border-[#D4AF37]/40 rounded-lg transition-all hover:bg-neutral-900 press-effect focus-gold"
                                                            title={repo.description}
                                                        >
                                                            <div className="flex flex-col min-w-0 flex-1">
                                                                <span className="text-xs font-mono text-white group-hover:text-[#D4AF37] transition-colors truncate">
                                                                    {repo.label}
                                                                </span>
                                                                {repo.description && (
                                                                    <span className="text-[10px] text-neutral-600 truncate">
                                                                        {repo.description}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-neutral-600 group-hover:text-[#D4AF37] transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                            </svg>
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Stats Card */}
                            <div className="bg-neutral-900/50 rounded-2xl border border-white/5 p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                                    {showDownloadStats && (
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Downloads</span>
                                            <div className="mt-1 flex items-center gap-1.5 text-sm text-[#8BE9FD] font-mono font-medium">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v12m0 0l4-4m-4 4l-4-4m-5 8h18" />
                                                </svg>
                                                <span>
                                                    {downloadStats.loading || downloadStats.totalDownloads === null
                                                        ? '...'
                                                        : formatFullNumber(downloadStats.totalDownloads)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className={`flex flex-col ${showDownloadStats ? 'items-end' : ''}`}>
                                        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Stars</span>
                                        <div className="mt-1 flex items-center gap-1.5 text-sm text-[#FFB86C] font-mono font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span>{repoStats.loading ? '...' : repoStats.stars}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 space-y-3">
                                    <div className="space-y-2.5">
                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Updated</span>
                                            <div className="flex min-w-0 items-center justify-end gap-1.5">
                                                <div className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500/60 animate-pulse" />
                                                <span className="text-[13px] text-neutral-300 font-mono text-right">
                                                    {repoStats.loading ? '...' : repoStats.lastUpdated}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-4">
                                            <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Created</span>
                                            <span className="text-[13px] text-neutral-200 font-mono text-right">
                                                {repoStats.loading ? '...' : repoStats.created}
                                            </span>
                                        </div>

                                        {(repoStats.loading || repoStats.forks > 0) && (
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Forks</span>
                                                <div className="flex items-center gap-1.5 text-[13px] text-neutral-300 font-mono">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h10M7 12h7m-7 5h10" />
                                                    </svg>
                                                    <span>{repoStats.loading ? '...' : repoStats.forks}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {showDownloadBreakdown && (
                                        <div className="space-y-2">
                                            <span className="block text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                                                Sources
                                            </span>
                                            <div className="space-y-1.5">
                                                {downloadStats.sources.map(source => (
                                                    <div
                                                        key={source.label}
                                                        className="flex items-center justify-between gap-4 text-sm font-mono"
                                                    >
                                                        <span className="text-neutral-500">
                                                            {source.label}
                                                        </span>
                                                        <span className="text-neutral-300">
                                                            {formatFullNumber(source.downloads)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block mb-2">Contributors</span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex -space-x-2">
                                            {repoStats.contributors.length === 0 && !repoStats.loading && (
                                                <div className="w-7 h-7 rounded-full bg-neutral-800 border-2 border-[#1a1a1a] flex items-center justify-center">
                                                    <span className="text-[10px] text-neutral-500">?</span>
                                                </div>
                                            )}
                                            {repoStats.contributors.map((avatar, i) => (
                                                <img
                                                    key={i}
                                                    src={avatar}
                                                    alt="Contributor"
                                                    className="w-7 h-7 rounded-full border-2 border-[#1a1a1a] bg-neutral-800 ring-2 ring-black/50"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}
