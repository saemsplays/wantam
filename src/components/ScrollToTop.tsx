import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

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

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-16 left-8 z-40 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110"
      title="Scroll to top"
    >
      <ArrowUpRight className="h-5 w-5 transform rotate-[-90deg]" />
    </button>
  );
};
