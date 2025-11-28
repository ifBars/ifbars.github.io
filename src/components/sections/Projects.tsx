import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  name: string;
  url: string;
  description: string;
  tags: string[];
  image?: string;
}

export default function Projects() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
        onEnter: () => setVisible(true),
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

  const projects: Project[] = [
    {
      name: "ProTVConvertor",
      url: "https://github.com/ifBars/VRChat-ProTVConvertor",
      description: "A tool for converting videos to VRChat ProTV compatible format",
      tags: ["Python", "VRChat", "Media"]
    },
    {
      name: "Juice WRLD Wiki",
      url: "https://juicewrldwiki.com/",
      description: "Comprehensive wiki dedicated to Juice WRLD's discography and legacy",
      tags: ["Typescript", "React", "Web"]
    },
    {
      name: "S1API (Forked)",
      url: "https://github.com/ifBars/S1API",
      description: "The unofficial C# modding framework for Schedule 1",
      tags: ["C#", "Schedule 1", "Game Modding"]
    },
    {
      name: "Jarvis Discord Bot",
      url: "https://github.com/ifBars/jarvis-dc-bot",
      description: "Advanced Discord bot with AI capabilities and custom commands",
      tags: ["Python", "Marvel Rivals", "AI"]
    },
    {
      name: "CS2 - Cynosys",
      url: "https://www.unknowncheats.me/forum/counter-strike-2-releases/610963-cynosys-external-tim-apple-fork.html",
      description: "A simple and effective ESP for CS2 that had a clean, customizable IMGUI theme",
      tags: ["C++", "Game Hacking", "CS2"]
    },
    {
      name: "MLVScan",
      url: "https://www.nexusmods.com/schedule1/mods/957",
      description: "A security-focused MelonLoader plugin designed to detect and disable potentially malicious mods before they can harm your system",
      tags: ["C#", "Game Modding", "Security"]
    }
  ];

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <section ref={sectionRef} id="projects" className="py-16 relative z-10">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading font-serif-heading text-4xl md:text-5xl font-semibold text-white mb-4">
            Projects
          </h2>
          <div className="section-divider h-px w-20 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* Projects Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={visible ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group project-card"
            >
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="bg-black/40 backdrop-blur-sm border border-neutral-800 rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:border-[#D4AF37]/60 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.2)] flex flex-col">
                  <div className="p-6 flex-1">
                    <h3 className="font-serif-heading text-2xl font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="font-serif-body text-neutral-400 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="bg-neutral-800/60 border border-white/5 text-xs font-serif-body px-2.5 py-0.5 rounded text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-neutral-800 bg-black/30 flex justify-between items-center">
                    <span className="font-serif-body text-xs text-neutral-500">View Project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-500 group-hover:text-[#D4AF37] transition-all duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
} 
