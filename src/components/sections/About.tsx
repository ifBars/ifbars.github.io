export default function About() {
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            About Me
          </h2>
          <div className="w-16 h-1 mx-auto my-4 bg-indigo-600 rounded"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-center max-w-6xl mx-auto">
          <div className="md:w-1/3 mb-8 md:mb-0 md:pr-8">
            <div className="relative rounded-full overflow-hidden w-48 h-48 mx-auto border-4 border-indigo-600 shadow-lg">
              {/* Profile image placeholder - replace with your image */}
              <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <svg className="w-24 h-24 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3 text-center md:text-left">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Hello! I'm a passionate software developer with a focus on creating clean, efficient, and user-friendly applications. With experience in front-end and back-end technologies, I enjoy solving complex problems and bringing ideas to life.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              My journey in software development started with a curiosity about how things work, which evolved into a career building elegant solutions that make a difference. I'm constantly learning and exploring new technologies to expand my skill set.
            </p>
            <a 
              href="#" 
              className="inline-block px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
            >
              Download Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 