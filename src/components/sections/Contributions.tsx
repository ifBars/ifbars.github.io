import { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard, { Project } from '../ProjectCard';
import ProjectModal from '../ProjectModal';

gsap.registerPlugin(ScrollTrigger);

export default function Contributions() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Scroll-triggered animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;
    const heading = section.querySelector('.section-heading');
    const divider = section.querySelector('.section-divider');
    const contributionCards = section.querySelectorAll('.contribution-card');

    // Initial state - hide elements
    gsap.set([heading, divider], { opacity: 0, y: 40 });
    gsap.set(contributionCards, { opacity: 0, y: 60, scale: 0.95 });

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
      .to(contributionCards, {
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

  const contributions: Project[] = [
    {
      name: "Marvel Rivals Jarvis AI",
      sourceUrl: "https://github.com/PatchiPup/Jarvis-Mark-II",
      projectUrl: "https://github.com/PatchiPup/Jarvis-Mark-II",
      description: "AI assistant for Marvel Rivals game with voice command capabilities",
      tags: ["Python", "AI", "Marvel Rivals"]
    },
    {
      name: "RatScanner",
      sourceUrl: "https://github.com/RatScanner/RatScanner",
      projectUrl: "https://github.com/RatScanner/RatScanner",
      description: "Item value scanner for Escape from Tarkov to assist with inventory management",
      tags: ["C#", "OCR", "Game Tools"]
    },
    {
      name: "CS2 - External ESP",
      sourceUrl: "https://github.com/IMXNOOBX/cs2-external-esp",
      projectUrl: "https://github.com/IMXNOOBX/cs2-external-esp",
      description: "One of the first to become popular, External ESP tool for CS2 with player visualization features",
      tags: ["C++", "Game Hacking", "CS2"]
    },
    {
      name: "CS2 - Tim Apple",
      sourceUrl: "https://github.com/gmh5225/tim_apple",
      projectUrl: "https://github.com/gmh5225/tim_apple",
      description: "A simple but clean ESP for CS2 - The original base used for my Cynosys fork",
      tags: ["C++", "Game Hacking", "CS2"]
    },
    {
      name: "Schedule 1 - CustomTV",
      sourceUrl: "https://github.com/JumbleBumble/CustomTV",
      projectUrl: "https://github.com/JumbleBumble/CustomTV",
      description: "A MelonLoader mod that allows you to play custom videos on the TV in Schedule 1",
      tags: ["C#", "Schedule 1", "Game Modding"]
    },
    {
      name: "Empire",
      sourceUrl: "https://github.com/pranjalchakraborty/Silkroad_S1API",
      projectUrl: "https://github.com/pranjalchakraborty/Silkroad_S1API",
      description: "A MelonLoader mod for Schedule 1 that adds a dynamic network of customizable NPC buyers to the game",
      tags: ["C#", "Schedule 1", "Game Modding"]
    }
  ];

  return (
    <section ref={sectionRef} id="contributions" className="py-16 relative z-10">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading font-serif-heading text-4xl md:text-5xl font-semibold text-white mb-4">
            Contributions
          </h2>
          <div className="section-divider h-px w-20 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* Contributions Display */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {contributions.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              onClick={() => setSelectedProject(project)}
              className="contribution-card"
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

