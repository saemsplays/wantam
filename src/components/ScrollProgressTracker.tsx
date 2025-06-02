
import React, { useState, useEffect } from 'react';

interface Section {
  id: string;
  title: string;
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

  const getMarkerPosition = (index: number) => {
    const totalSections = sections.length;
    return (index / (totalSections - 1)) * 100;
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col items-center">
      {/* Progress Bar Container */}
      <div className="relative w-1 h-80 bg-gray-200 rounded-full shadow-lg">
        {/* Background progress fill */}
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-blue-400 to-emerald-500 transition-all duration-300 ease-out rounded-full"
          style={{ height: `${scrollProgress}%` }}
        />

        {/* Section markers */}
        {sections.map((section, index) => {
          const isActive = activeSection === section.id;
          const isPassed = sections.findIndex(s => s.id === activeSection) > index;

          return (
            <div
              key={section.id}
              className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer group"
              style={{ top: `${getMarkerPosition(index)}%` }}
              onClick={() => scrollToSection(section.id)}
            >
              <div
                className={`
                  w-4 h-4 rounded-full border-3 transition-all duration-500 ease-out transform
                  ${isActive 
                    ? 'bg-white border-blue-500 scale-150 shadow-lg shadow-blue-500/50' 
                    : isPassed
                    ? 'bg-emerald-500 border-emerald-500 scale-110'
                    : 'bg-white border-gray-300 hover:border-blue-400 hover:scale-125'
                  }
                `}
              />

              {/* Magnetic pulse effect for active section */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
              )}

              {/* Tooltip */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
                {section.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="mt-4 bg-white rounded-full px-3 py-1 shadow-lg border border-gray-200">
        <span className="text-xs font-medium text-gray-600">
          {Math.round(scrollProgress)}%
        </span>
      </div>
    </div>
  );
};
