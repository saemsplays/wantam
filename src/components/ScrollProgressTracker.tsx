import React, { useState, useEffect, useRef } from 'react';
import { useScrollVisibility } from '../hooks/useScrollVisibility';

interface Section {
  id: string;
  title: string;
  position: number;
}

interface ScrollProgressTrackerProps {
  activeSection: string;
  sections: Section[];
}

export const ScrollProgressTracker: React.FC<ScrollProgressTrackerProps> = ({
  activeSection,
  sections,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const isVisible = useScrollVisibility(300); // controls mounting/display

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 1500);

      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxHeight > 0 ? (scrolled / maxHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const opacityClass = isScrolling || isHovered ? 'opacity-70' : 'opacity-5';

  if (!isVisible) {
    return null; // full hide when not past 300px scroll
  }

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center transition-opacity duration-300 ease-in-out ${opacityClass}`}
    >
      {/* Instruction text */}
      <div className="mb-3 bg-white dark:bg-gray-800 rounded-lg px-3 py-1 shadow-lg border border-gray-200 dark:border-gray-700"
