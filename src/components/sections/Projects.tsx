import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard, { Project } from '../ProjectCard';
import ProjectModal from '../ProjectModal';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Scroll-triggered animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const heading = section.querySelector('.section-heading');
    const divider = section.querySelector('.section-divider');
    const projectCards = section.querySelectorAll('.project-card');

    // Initial state - hide elements
    gsap.set([heading, divider], { opacity: 0, y: 40 });
    gsap.set(projectCards, { opacity: 0, y: 60, scale: 0.95 });

    // Create scroll-triggered timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    });

    // Animate heading and divider
    tl.to(heading, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
      .to(divider, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power3.out',
      }, '-=0.3')
      .to(projectCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
      }, '-=0.2');

    return () => {
      tl.kill();
    };
  }, []);

  const bestWork: Project[] = [
    {
      name: "S1API",
      sourceUrl: "https://github.com/ifBars/S1API",
      projectUrl: "https://www.nexusmods.com/schedule1/mods/1194",
      description: "The unofficial C# modding framework for Schedule 1.",
      subDescription: "Used in most Schedule 1 mods, downloaded by users 25,000+ times.",
      tags: ["C#", "Schedule 1", "Game Modding"]
    },
    {
      name: "RatScanner",
      sourceUrl: "https://github.com/RatScanner/RatScanner",
      projectUrl: "https://ratscanner.com/",
      description: "Escape from Tarkov item value scanner that accelerates loot decisions.",
      subDescription: "Contributed OCR and UX tweaks to speed up reads and reduce false positives during raids.",
      tags: ["C#", "OCR", "Game Tools"]
    },
    {
      name: "MLVScan",
      sourceUrl: "https://github.com/ifBars/MLVScan",
      projectUrl: "https://www.nexusmods.com/schedule1/mods/957",
      description: "Security-first MelonLoader plugin that scans and disables malicious mods before they can run.",
      subDescription: "Trusted by 20,000+ users across NexusMods and Thunderstore.",
      tags: ["C#", "Game Modding", "Security"]
    },
    {
      name: "ProTVConvertor",
      sourceUrl: "https://github.com/ifBars/VRChat-ProTVConvertor",
      projectUrl: "https://protv-convertor.onrender.com/",
      description: "Pipeline for converting youtube playlists into VRChat ProTV-friendly formats.",
      subDescription: "Automates transcoding and packaging so creators can drop videos into VRChat worlds without compatibility headaches.",
      tags: ["C#", "Python", "VRChat", "Media"]
    },
    {
      name: "CS2 External ESP",
      sourceUrl: "https://github.com/IMXNOOBX/cs2-external-esp",
      projectUrl: "https://github.com/IMXNOOBX/cs2-external-esp",
      description: "One of the first widely adopted external ESPs for CS2 with player visualization.",
      subDescription: "I made over 100 commits to this project, including major feature additions and improvements to the codebase, around it's time of release.",
      tags: ["C++", "Game Hacking", "CS2"]
    },
    {
      name: "Marvel Rivals Jarvis AI",
      sourceUrl: "https://github.com/PatchiPup/Jarvis-Mark-II",
      projectUrl: "https://github.com/PatchiPup/Jarvis-Mark-II",
      description: "Voice-driven AI assistant for Marvel Rivals.",
      subDescription: "Extended the feature set with command routing, richer responses, and stability fixes to keep squads informed mid-match.",
      tags: ["Python", "AI", "Marvel Rivals"]
    },
    {
      name: "S1 Dedicated Servers",
      sourceUrl: "https://github.com/ifBars/S1DedicatedServers",
      projectUrl: "https://ifbars.github.io/S1DedicatedServersWiki/",
      description: "MelonLoader mod that allows dedicated server hosting for Schedule 1, a game built for P2P only.",
      subDescription: "Open-sourced the first fully functional dedicated server option for Schedule 1, enabling stable multiplayer at scale.",
      tags: ["C#", "Game Modding", "MelonLoader"]
    },
    {
      name: "Tim Apple",
      sourceUrl: "https://github.com/gmh5225/tim_apple",
      projectUrl: "https://github.com/gmh5225/tim_apple",
      description: "Clean, minimal ESP base for CS2 and foundation for my Cynosys fork.",
      subDescription: "Delivered refactors and readability improvements that made downstream feature work faster.",
      tags: ["C++", "Game Hacking", "CS2"]
    }
  ];

  return (
    <section ref={sectionRef} id="projects" className="py-16 relative z-10">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading font-serif-heading text-4xl md:text-5xl font-semibold text-white mb-4">
            My Work
          </h2>
          <div className="section-divider h-px w-20 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* My Work Display */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {bestWork.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              onClick={() => setSelectedProject(project)}
              className="project-card"
            />
          ))}
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </section>
  );
} 
