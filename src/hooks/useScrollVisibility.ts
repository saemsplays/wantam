// hooks/useScrollVisibility.ts
import { useState, useEffect } from 'react';

export const useScrollVisibility = (threshold = 300) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > threshold);
    };

    handleScroll(); // Ensure it runs at mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  return isVisible;
};
