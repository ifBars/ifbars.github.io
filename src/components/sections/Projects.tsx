import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ProjectCard, { Project } from '../ProjectCard';

gsap.registerPlugin(ScrollTrigger);

const ProjectModal = lazy(() => import('../ProjectModal'));

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

  const ownedProjects: Project[] = [
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
      name: "S1DedicatedServers",
      sourceUrl: "https://github.com/ifBars/S1DedicatedServers",
      projectUrl: [
        {
          label: "GitHub",
          url: "https://github.com/ifBars/S1DedicatedServers",
          description: "Open-source dedicated server framework"
        }
      ],
      description: "A dedicated server framework for Schedule I, adopted by commercial game-server hosts.",
      subDescription: "Built the community server stack that lets a P2P-only game run persistent, headless multiplayer sessions. Hosting providers now list, pre-install, or document S1DedicatedServers for real customer servers, including Solace Servers, Kinetic Hosting, Survival Servers, XGamingServer, and more.",
      tags: ["C#", "Schedule 1", "Multiplayer", "Commercial Hosting"],
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

  const contributedProjects: Project[] = [
    {
      name: "T3Code",
      sourceUrl: "https://github.com/pingdotgg/t3code",
      projectUrl: "https://t3.codes/",
      description: "AI desktop coding app from T3 / Theo's company.",
      subDescription: "Landed a focused UI regression fix for the provider/model picker, including browser coverage for the nested submenu positioning bug.",
      tags: ["TypeScript", "React", "AI Tools"],
      image: "/t3code.png",
      statSources: [
        {
          kind: "github-release",
          owner: "pingdotgg",
          repo: "t3code",
          label: "GitHub Releases"
        }
      ],
      isContribution: true
    },
    {
      name: "SIMM",
      sourceUrl: "https://github.com/SirTidez/simm",
      projectUrl: [
        {
          label: "Contributed PRs",
          url: "https://github.com/SirTidez/simm/pulls?q=author%3AifBars",
          description: "Merged contribution history"
        },
        {
          label: "Nexus Mods",
          url: "https://www.nexusmods.com/schedule1/mods/1750",
          description: "Public mod manager downloads"
        }
      ],
      description: "Tauri mod manager for Schedule I.",
      subDescription: "Contributed practical product work across Nexus file handling, mod download security scanning, and narrow UI fixes with frontend, backend, and Rust validation.",
      tags: ["Tauri", "React", "Rust"],
      image: "https://opengraph.githubassets.com/ifbars-simm-prs/SirTidez/simm/pulls?q=author%3AifBars",
      statSources: [
        {
          kind: "nexus",
          gameId: "7381",
          modId: "1750",
          label: "Nexus Mods"
        },
        {
          kind: "github-release",
          owner: "SirTidez",
          repo: "simm",
          label: "GitHub Releases"
        }
      ],
      isContribution: true
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
      subDescription: "Contributed focused UX improvements, including a tray icon context menu for faster access while the scanner is running.",
      tags: ["C#", "OCR", "Game Tools"],
      image: "/ratscanner.png",
      demoImage: "/ratscanner-demo.gif",
      isContribution: true
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
          {ownedProjects.map((project) => (
            <ProjectCard
              key={project.name}
              project={project}
              onClick={() => setSelectedProject(project)}
              className="project-card"
            />
          ))}
        </div>

        <div className="mt-16 border-t border-white/5 pt-10">
          <div className="mb-8 max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
              Open source contributions
            </p>
            <h3 className="mt-3 font-serif-heading text-3xl font-semibold text-white md:text-4xl">
              Projects I helped improve
            </h3>
            <p className="mt-3 font-serif-body text-sm leading-relaxed text-neutral-400 md:text-base">
              These are not my products. They are external projects where I made focused fixes, product improvements, or maintainability work that made the software easier to use or ship.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contributedProjects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                onClick={() => setSelectedProject(project)}
                className="project-card"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <Suspense fallback={null}>
            <ProjectModal selectedProject={selectedProject} onClose={() => setSelectedProject(null)} />
          </Suspense>
        )}
      </AnimatePresence>
    </section>
  );
} 
