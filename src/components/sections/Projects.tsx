import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Project {
  name: string;
  url: string;
  description: string;
  tags: string[];
  image?: string;
}

export default function Projects() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show projects section after a delay to match the hero animation sequence
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3500);
    
    return () => clearTimeout(timer);
  }, []);

  const favoriteProjects: Project[] = [
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
      tags: ["Web", "React", "Media"]
    },
    {
      name: "ScheduleLua Framework",
      url: "https://github.com/ScheduleLua/ScheduleLua-Framework",
      description: "A lua modding framework for Schedule 1",
      tags: ["Lua", "Schedule 1", "Game Modding"]
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
      name: "S1API Documentation",
      url: "https://github.com/ifBars/S1API-docs",
      description: "The VitePress documentation for S1API, a C# abstraction layer for Schedule 1",
      tags: ["Vue", "Game Modding", "Schedule 1"]
    }
  ];

  const contributions: Project[] = [
    {
      name: "Marvel Rivals Jarvis AI",
      url: "https://github.com/PatchiPup/Jarvis-Mark-II",
      description: "AI assistant for Marvel Rivals game with voice command capabilities",
      tags: ["Python", "AI", "Marvel Rivals"]
    },
    {
      name: "Escape From Tarkov RatScanner",
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
      description: "A simple ESP for CS2",
      tags: ["C++", "Game Hacking", "CS2"]
    },
    {
      name: "Schedule 1 - CustomTV",
      url: "https://github.com/JumbleBumble/CustomTV",
      description: "Allows you to play custom videos on the TV in Schedule 1",
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
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  // Button for switching between tabs
  const [activeTab, setActiveTab] = useState('favorites');

  return (
    <section id="projects" className={`py-16 relative z-10 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Work
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>
        </div>
        
        {/* Tab selector */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-black/30 backdrop-blur-md rounded-lg">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'favorites' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Favorite Projects
            </button>
            <button
              onClick={() => setActiveTab('contributions')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                activeTab === 'contributions' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Contributions
            </button>
          </div>
        </div>
        
        {/* Projects Display */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={visible ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
        >
          {(activeTab === 'favorites' ? favoriteProjects : contributions).map((project, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <a 
                href={project.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(60,130,240,0.3)]">
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 mb-4 text-sm">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="bg-gray-800 text-xs font-medium px-2.5 py-0.5 rounded text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="px-6 py-4 border-t border-gray-800 bg-black/30 flex justify-between items-center">
                    <span className="text-xs text-gray-500">View Project</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 group-hover:text-blue-400 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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