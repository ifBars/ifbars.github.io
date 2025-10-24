import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Organization {
  name: string;
  url: string;
  description: string;
  role: string;
  tags: string[];
  logo?: string;
}

export default function Organizations() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show organizations section after projects section
    const timer = setTimeout(() => {
      setVisible(true);
    }, 5000); // Delay after projects section
    
    return () => clearTimeout(timer);
  }, []);

  const organizations: Organization[] = [
    {
      name: "AccuralAI",
      url: "https://github.com/AccuralAI",
      description: "AccuralAI is an open-source organization focused on achieving better AI through many small, measurable improvements that accrue over time—shipping pragmatic research, libraries, and evaluation tools for results that matter outside the lab.",
      role: "Founder & Lead Developer",
      tags: ["AI", "Open Source", "Machine Learning", "Performance Optimization"]
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
    <section id="organizations" className={`py-16 relative z-10 transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Organizations
          </h2>
          <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto"></div>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Open source organizations I lead and contribute to
          </p>
        </div>
        
        {/* Organizations Display */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={visible ? "show" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-1 gap-6 max-w-4xl mx-auto"
        >
          {organizations.map((org, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group"
            >
              <a 
                href={org.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block h-full"
              >
                <div className="bg-black/60 backdrop-blur-sm border border-gray-800 rounded-xl overflow-hidden h-full transition-all duration-300 group-hover:border-blue-500/50 group-hover:shadow-[0_0_15px_rgba(60,130,240,0.3)] flex flex-col">
                  <div className="p-8 flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                          {org.name}
                        </h3>
                        <p className="text-blue-400 font-medium text-sm mb-3">
                          {org.role}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 mb-6 text-base leading-relaxed">
                      {org.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {org.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex} 
                          className="bg-gray-800 text-xs font-medium px-3 py-1 rounded text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="px-8 py-4 border-t border-gray-800 bg-black/30 flex justify-between items-center">
                    <span className="text-xs text-gray-500">View Organization</span>
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
