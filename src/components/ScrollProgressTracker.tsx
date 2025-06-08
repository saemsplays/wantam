
import React, { useState, useEffect } from 'react';
import { useScrollVisibility } from '../hooks/useScrollVisibility';

interface Section {
  id: string;
  title: string;
  position: number; // percentage position instead of calculated
}

interface ScrollProgressTrackerProps {
  activeSection: string;
  sections: Section[];
}

export const ScrollProgressTracker: React.FC<ScrollProgressTrackerProps> = ({ 
  activeSection, 
  sections 
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const isVisible = useScrollVisibility(300);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxHeight > 0 ? (scrolled / maxHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className={`fixed left-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col items-center transition-all duration-300 ease-in-out transform ${
        isVisible
        ? 'opacity-100 translate-y-0 pointer-events-auto'
        : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      >
      {/* Instruction text */}
      <div className="mb-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 shadow-lg border border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          Tap circles to jump to sections
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-1 h-80 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg">
        {/* Background progress fill */}
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-emerald-500 transition-all duration-300 ease-out rounded-full"
          style={{ height: `${scrollProgress}%` }}
        />

        {/* Section markers */}
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isPassed = sections.findIndex(s => s.id === activeSection) > index;
          const isIntroduction = section.id === 'hero';

          return (
            <div
              key={section.id}
              className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer group"
              style={{ top: `${section.position}%` }}
              onClick={() => scrollToSection(section.id)}
            >
              {/* Dark backdrop/shadow behind the circle */}
              <div className="absolute inset-0 w-6 h-6 bg-black/5 dark:bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />
              
              <div
                className={`
                  relative w-4 h-4 rounded-full border-3 transition-all duration-500 ease-out transform
                  ${isActive 
                    ? 'bg-white dark:bg-gray-800 border-blue-500 scale-150 shadow-lg shadow-blue-500/50' 
                    : isPassed
                    ? 'bg-emerald-500 border-emerald-500 scale-110'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:scale-125'
                  }
                `}
              />

              {/* Magnetic pulse effect for active section and special glow for Introduction */}
              {(isActive || isIntroduction) && (
                <div className={`absolute inset-0 rounded-full ${
                  isIntroduction ? 'bg-gradient-to-r from-red-400 to-green-400' : 'bg-blue-400'
                } animate-ping opacity-75`} />
              )}

              {/* Tooltip */}
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                {section.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="mt-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 shadow-lg border border-gray-200 dark:border-gray-700">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {Math.round(scrollProgress)}%
        </span>
      </div>
    </div>
  );
};
