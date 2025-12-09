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

export default function Contributions() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      url: "https://github.com/PatchiPup/Jarvis-Mark-II",
      description: "AI assistant for Marvel Rivals game with voice command capabilities",
      tags: ["Python", "AI", "Marvel Rivals"]
    },
    {
      name: "RatScanner",
      url: "https://github.com/RatScanner/RatScanner",
      description: "Item value scanner for Escape from Tarkov to assist with inventory management",
      tags: ["C#", "OCR", "Game Tools"]
    },
    {
      name: "CS2 - External ESP",
      url: "https://github.com/IMXNOOBX/cs2-external-esp",
      description: "One of the first to become popular, External ESP tool for CS2 with player visualization features",
      tags: ["C++", "Game Hacking", "CS2"]
    },
    {
      name: "CS2 - Tim Apple",
      url: "https://github.com/gmh5225/tim_apple",
      description: "A simple but clean ESP for CS2 - The original base used for my Cynosys fork",
      tags: ["C++", "Game Hacking", "CS2"]
    },
    {
      name: "Schedule 1 - CustomTV",
      url: "https://github.com/JumbleBumble/CustomTV",
      description: "A MelonLoader mod that allows you to play custom videos on the TV in Schedule 1",
      tags: ["C#", "Schedule 1", "Game Modding"]
    },
    {
      name: "Empire",
      url: "https://github.com/pranjalchakraborty/Silkroad_S1API",
      description: "A MelonLoader mod for Schedule 1 that adds a dynamic network of customizable NPC buyers to the game",
      tags: ["C#", "Schedule 1", "Game Modding"]
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
    <section ref={sectionRef} id="contributions" className="py-16 relative z-10">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading font-serif-heading text-4xl md:text-5xl font-semibold text-white mb-4">
            Contributions
          </h2>
          <div className="section-divider h-px w-20 bg-[#D4AF37] mx-auto"></div>
        </div>

        {/* Contributions Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={visible ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {contributions.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group contribution-card"
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

