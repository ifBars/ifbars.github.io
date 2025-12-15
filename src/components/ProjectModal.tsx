import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import { Project } from './ProjectCard';
import { useGithubStats } from '../hooks/useGithubStats';

interface ProjectModalProps {
    selectedProject: Project;
    onClose: () => void;
}

export default function ProjectModal({ selectedProject, onClose }: ProjectModalProps) {
    const lenis = useLenis();
    const repoStats = useGithubStats(selectedProject.sourceUrl, selectedProject.name);

    useEffect(() => {
        if (lenis) lenis.stop();
        document.body.style.overflow = 'hidden';

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);

        return () => {
            if (lenis) lenis.start();
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [lenis, onClose]);

    if (typeof document === 'undefined') return null;

    return createPortal(
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                className="relative w-full max-w-4xl bg-[#0a0a0a] border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden z-20 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ESC Hint */}
                <motion.div
                    className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-neutral-500 text-xs font-mono pointer-events-none z-30 opacity-50"
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
                <div className="p-8 md:p-10 relative">
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-4 opacity-75">
                            <div className="flex items-center gap-2 font-mono text-xs md:text-sm tracking-wide">
                                <span className="text-[#FF79C6]">ifBars</span>
                                <span className="text-neutral-600">/</span>
                                <span className="text-[#50FA7B]">{selectedProject.name.toLowerCase().replace(/\s+/g, '-')}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded-full bg-neutral-800/80 border border-neutral-700/50 text-[10px] text-neutral-400 font-mono uppercase tracking-wider">Public</span>
                        </div>

                        <h2 className="font-serif-heading text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                            {selectedProject.name}
                        </h2>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">

                        {/* Left Column: Description (Span 2) */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-xl font-serif-heading text-neutral-200 mb-3">
                                    {selectedProject.description}
                                </h3>
                                <p className="text-neutral-400 font-serif-body leading-relaxed text-sm md:text-base">
                                    {selectedProject.subDescription || selectedProject.description}
                                </p>
                            </div>

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
                        <div className="flex flex-col gap-6">
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3">
                                {selectedProject.projectUrl && (
                                    <a
                                        href={selectedProject.projectUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between px-5 py-3.5 bg-[#D4AF37] text-black font-serif-body font-bold text-sm rounded-xl hover:bg-[#c4a030] transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:-translate-y-0.5 press-effect focus-gold"
                                    >
                                        <span>Visit Project</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </a>
                                )}
                                {selectedProject.sourceUrl && (
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
                                )}
                            </div>

                            {/* Stats Card */}
                            <div className="bg-neutral-900/50 rounded-2xl border border-white/5 p-5 space-y-4">
                                <div className="flex justify-between items-center pb-4 border-b border-white/5">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Created</span>
                                        <span className="text-sm text-neutral-200 font-mono">{repoStats.loading ? '...' : repoStats.created}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider">Stars</span>
                                        <div className="flex items-center gap-1.5 text-sm text-[#FFB86C] font-mono font-medium">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span>{repoStats.loading ? '...' : repoStats.stars}</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
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
