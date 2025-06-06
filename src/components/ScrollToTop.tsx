
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-20 right-8 z-40 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 ${
        isVisible 
          ? 'opacity-70 translate-y-0 pointer-events-auto hover:opacity-100' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      title="Scroll to top"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};
