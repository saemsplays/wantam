
import React, { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

const CountUp: React.FC<CountUpProps> = ({ 
  to, 
  from = 0, 
  direction = "up", 
  delay = 0, 
  duration = 2, 
  className = "", 
  startWhen = true, 
  separator = "", 
  onStart, 
  onEnd 
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [currentValue, setCurrentValue] = useState(from);
  
  useEffect(() => {
    if (!startWhen) return;
    
    const startTime = Date.now() + delay * 1000;
    const endTime = startTime + duration * 1000;
    
    const animate = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animate);
        return;
      }
      
      if (now >= endTime) {
        setCurrentValue(to);
        if (onEnd) onEnd();
        return;
      }
      
      const progress = (now - startTime) / (duration * 1000);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      const value = Math.round(from + (to - from) * easeProgress);
      setCurrentValue(value);
      
      requestAnimationFrame(animate);
    };
    
    if (onStart) onStart();
    requestAnimationFrame(animate);
  }, [to, from, delay, duration, startWhen, onStart, onEnd]);
  
  const formattedValue = separator ? 
    currentValue.toLocaleString().replace(/,/g, separator) : 
    currentValue.toLocaleString();
  
  return <span ref={ref} className={className}>{formattedValue}</span>;
};

export default CountUp;
