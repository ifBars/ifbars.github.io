import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard, { Project } from '../ProjectCard';
import ProjectModal from '../ProjectModal';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const refreshLayout = gsap.delayedCall(0.12, () => ScrollTrigger.refresh()).pause();
    const ctx = gsap.context(() => {
      const heading = section.querySelector('.section-heading');
      const divider = section.querySelector('.section-divider');
      const grid = section.querySelector<HTMLElement>('[data-projects-grid]');
      const projectCards = gsap.utils.toArray<HTMLElement>('.project-card', section);
      const projectSurfaces = gsap.utils.toArray<HTMLElement>('[data-project-card-surface]', section);
      const projectMedia = gsap.utils.toArray<HTMLElement>('[data-project-card-media]', section);

      if (!heading || !divider || !grid || projectCards.length === 0) {
        return;
      }

      if (prefersReducedMotion) {
        gsap.set([heading, divider, ...projectSurfaces], { clearProps: 'all', autoAlpha: 1 });
        return;
      }

      const getOffsetX = (target: HTMLElement) => {
        if (window.innerWidth < 768) return 0;
        const index = projectSurfaces.indexOf(target);
        return index % 2 === 0 ? -14 : 14;
      };

      gsap.set([heading, divider], { autoAlpha: 0, y: 28 });
      gsap.set(divider, { scaleX: 0.7, transformOrigin: 'center center' });
      gsap.set(projectSurfaces, {
        autoAlpha: 0,
        y: 28,
        x: (_, target) => getOffsetX(target as HTMLElement),
        scale: 0.992,
        force3D: true,
      });

      gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: section,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
      })
        .to(heading, {
          autoAlpha: 1,
          y: 0,
          duration: 0.52,
        })
        .to(divider, {
          autoAlpha: 1,
          scaleX: 1,
          duration: 0.34,
        }, '-=0.18');

      projectSurfaces.forEach((surface, index) => {
        const card = projectCards[index];
        if (!card) return;

        gsap.to(surface, {
          autoAlpha: 1,
          y: 0,
          x: 0,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'clamp(top 98%)',
            end: 'clamp(center 74%)',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });

      projectMedia.forEach((media, index) => {
        const card = projectCards[index];
        if (!card) return;

        gsap.fromTo(media, {
          yPercent: -2.5,
          scale: 1.035,
        }, {
          yPercent: 2.5,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      });
    }, section);

    let resizeObserver: ResizeObserver | null = null;
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        refreshLayout.restart(true);
      });
      resizeObserver.observe(section);
      section.querySelectorAll('.project-card').forEach(card => resizeObserver?.observe(card));
    }

    refreshLayout.restart(true);

    return () => {
      resizeObserver?.disconnect();
      refreshLayout.kill();
      ctx.revert();
    };
  }, []);

  const bestWork: Project[] = [
    {
      name: "S1API",
      sourceUrl: "https://github.com/ifBars/S1API",
      projectUrl: "https://www.nexusmods.com/schedule1/mods/1194",
      description: "The unofficial C# modding framework for Schedule 1.",
      subDescription: "Used in most Schedule 1 mods, downloaded by users 25,000+ times.",
      tags: ["C#", "Schedule 1", "Game Modding"],
      image: "/s1api.png",
      statSources: [
        {
          kind: "nexus",
          gameId: "7381",
          modId: "1194",
          label: "Nexus Mods"
        },
        {
          kind: "thunderstore",
          community: "schedule-i",
          namespace: "ifBars",
          packageName: "S1API_Forked",
          label: "Thunderstore"
        }
      ]
    },
    {
      name: "MLVScan",
      sourceUrl: "https://github.com/ifBars/MLVScan",
      projectUrl: [
        {
          label: "MLVScan (Website)",
          url: "https://mlvscan.com/",
          description: "In-browser malware scanning"
        },
        {
          label: "MLVScan (NexusMods)",
          url: "https://www.nexusmods.com/schedule1/mods/957",
          description: "MelonLoader plugin downloads and likes"
        }
      ],
      description: "Security-first MelonLoader plugin that scans and disables malicious mods before they can run.",
      subDescription: "Trusted by 30,000+ users across NexusMods and Thunderstore. Built on MLVScan.Core, a cross-platform detection engine that powers both the MelonLoader plugin and web-based scanner.",
      tags: ["C#", "Game Modding", "Security"],
      image: "/mlvscan.png",
      statSources: [
        {
          kind: "nexus",
          gameId: "7381",
          modId: "957",
          label: "Nexus Mods"
        },
        {
          kind: "thunderstore",
          community: "schedule-i",
          namespace: "ifBars",
          packageName: "MLVScan",
          label: "Thunderstore"
        }
      ]
    },
    {
      name: "SteamNetworkLib",
      sourceUrl: "https://github.com/ifBars/SteamNetworkLib",
      projectUrl: "https://www.nexusmods.com/schedule1/mods/1396",
      description: "Object-oriented Steam networking library for MelonLoader mods.",
      subDescription: "Simplifies Steam lobby management, data synchronization, and P2P messaging for Schedule I mod developers across Mono and IL2CPP builds.",
      tags: ["C#", "Schedule 1", "Networking", "Game Modding"],
      image: "/steamnetworklib.png",
      statSources: [
        {
          kind: "nexus",
          gameId: "7381",
          modId: "1396",
          label: "Nexus Mods"
        },
        {
          kind: "thunderstore",
          community: "schedule-i",
          namespace: "ifBars",
          packageName: "SteamNetworkLib_Mono",
          label: "TS Mono"
        },
        {
          kind: "thunderstore",
          community: "schedule-i",
          namespace: "ifBars",
          packageName: "SteamNetworkLib_Il2Cpp",
          label: "TS IL2CPP"
        }
      ]
    },
    {
      name: "S1 Fuel Mod",
      sourceUrl: "https://github.com/ifBars/S1FuelMod",
      projectUrl: "https://www.nexusmods.com/schedule1/mods/1153",
      description: "Comprehensive fuel system mod for Schedule I.",
      subDescription: "Adds realistic fuel consumption, fuel stations, HUD integration, persistent vehicle fuel states, and multiplayer synchronization.",
      tags: ["C#", "Schedule 1", "Game Modding", "Multiplayer"],
      image: "/fuelmod.png",
      statSources: [
        {
          kind: "nexus",
          gameId: "7381",
          modId: "1153",
          label: "Nexus Mods"
        },
        {
          kind: "thunderstore",
          community: "schedule-i",
          namespace: "ifBars",
          packageName: "S1FuelMod_Mono",
          label: "TS Mono"
        },
        {
          kind: "thunderstore",
          community: "schedule-i",
          namespace: "ifBars",
          packageName: "S1FuelMod_Il2Cpp",
          label: "TS IL2CPP"
        }
      ]
    },
    {
      name: "RatScanner",
      sourceUrl: "https://github.com/RatScanner/RatScanner",
      projectUrl: "https://ratscanner.com/",
      statSources: [
        {
          kind: "github-release",
          owner: "RatScanner",
          repo: "RatScanner",
          label: "GitHub Releases"
        }
      ],
      description: "Escape from Tarkov item value scanner that accelerates loot decisions.",
      subDescription: "Added a tray icon context menu to provide better user experience.",
      tags: ["C#", "OCR", "Game Tools"],
      image: "/ratscanner.png",
      demoImage: "/ratscanner-demo.gif",
      isContribution: true
    },
    {
      name: "ProTVConvertor",
      sourceUrl: "https://github.com/ifBars/VRChat-ProTVConvertor",
      projectUrl: "https://protv-convertor.onrender.com/",
      description: "Pipeline for converting youtube playlists into VRChat ProTV-friendly formats.",
      subDescription: "My first project I published publicly. Used by VRChat world developers to easily integrate youtube playlists into ProTV video players.",
      tags: ["C#", "Python", "VRChat", "Media"],
      image: "/protvconvertor.png",
      statSources: [
        {
          kind: "github-release",
          owner: "ifBars",
          repo: "VRChat-ProTVConvertor",
          label: "GitHub Releases"
        }
      ]
    },
    {
      name: "CS2 External ESP",
      sourceUrl: "https://github.com/IMXNOOBX/cs2-external-esp",
      projectUrl: "https://github.com/IMXNOOBX/cs2-external-esp",
      description: "One of the first widely adopted external ESPs for CS2 with player visualization.",
      subDescription: "I made over 100 commits to this project, including major feature additions and improvements to the codebase, around it's time of release.",
      tags: ["C++", "Game Hacking", "CS2"],
      image: "/cs2-external-esp.png",
      isContribution: true
    },
    {
      name: "Marvel Rivals Jarvis AI",
      sourceUrl: "https://github.com/PatchiPup/Jarvis-Mark-II",
      projectUrl: "https://github.com/PatchiPup/Jarvis-Mark-II",
      description: "Voice-driven AI assistant for Marvel Rivals.",
      subDescription: "I contributed to this project by extending the feature set with command routing, richer responses, and a complete codebase refactor for scalability.",
      tags: ["Python", "AI", "Marvel Rivals"],
      image: "/jarvis-ai.png",
      youtubeVideos: [
        "https://www.youtube.com/watch?v=CQFnD5ddRFc",
        "https://www.youtube.com/watch?v=G376sv2jNhw"
      ],
      isContribution: true
    },
    {
      name: "S1DedicatedServers",
      sourceUrl: "https://github.com/ifBars/S1DedicatedServers",
      projectUrl: "https://github.com/ifBars/S1DedicatedServers",
      description: "A dedicated server framework for Schedule I.",
      subDescription: "A comprehensive dedicated server solution enabling persistent multiplayer sessions for Schedule I.",
      tags: ["C#", "Schedule 1", "Multiplayer", "Game Server"],
      image: "/s1dedicatedservers.png",
      statSources: [
        {
          kind: "github-release",
          owner: "ifBars",
          repo: "S1DedicatedServers",
          label: "GitHub Releases"
        }
      ]
    },
    {
      name: "BigWillyMod",
      sourceUrl: "https://github.com/ifBars/BigWillyMod",
      projectUrl: "https://www.nexusmods.com/schedule1/mods/1413",
      description: "Schedule 1 mod featuring Big Willy NPC, custom quests, and live stream integrations.",
      subDescription: "A comprehensive mod adding an interactive NPC, quest system with graffiti mechanics, and Twitch live stream detection.",
      tags: ["C#", "Schedule 1", "Game Modding"],
      image: "/bigwilly.png",
      statSources: [
        {
          kind: "nexus",
          gameId: "7381",
          modId: "1413",
          label: "Nexus Mods"
        },
        {
          kind: "thunderstore",
          community: "schedule-i",
          namespace: "ifBars",
          packageName: "BigWillyMod",
          label: "Thunderstore"
        }
      ]
    }
  ];

  return (
    <section ref={sectionRef} id="projects" className="py-10 relative z-10 overflow-hidden">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="section-heading font-serif-heading text-4xl md:text-5xl font-semibold text-white mb-4">
            My Work
          </h2>
          <div className="section-divider h-px w-20 bg-[#D4AF37] mx-auto"></div>
        </div>

        <div
          data-projects-grid
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {bestWork.map((project) => (
            <ProjectCard
              key={project.name}
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
