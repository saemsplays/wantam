
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ClearMode = 'normal' | 'clear' | 'ultra-clear';

interface ClearModeToggleProps {
  onModeChange: (mode: ClearMode) => void;
  currentMode: ClearMode;
}

export const ClearModeToggle: React.FC<ClearModeToggleProps> = ({ onModeChange, currentMode }) => {
  const toggleClearMode = () => {
    const modes: ClearMode[] = ['normal', 'clear', 'ultra-clear'];
    const currentIndex = modes.indexOf(currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onModeChange(modes[nextIndex]);
  };

  const getIcon = () => {
    switch (currentMode) {
      case 'normal': return <Eye className="w-6 h-6 text-green-500" />;
      case 'clear': return <Minus className="w-6 h-6 text-yellow-500" />;
      case 'ultra-clear': return <EyeOff className="w-6 h-6 text-red-500" />;
    }
  };

  const getTitle = () => {
    switch (currentMode) {
      case 'normal': return 'Normal Mode - All visible';
      case 'clear': return 'Clear Mode - 10% opacity';
      case 'ultra-clear': return 'Ultra Clear Mode - Hidden';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-12 z-50">
      <motion.button
        onClick={toggleClearMode}
        className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
        style={{
          opacity: 0.05,
        }}
        whileHover={{
          opacity: 0.7,
          scale: 1.1,
        }}
        whileTap={{
          opacity: 1,
          scale: 0.95,
        }}
        title={getTitle()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentMode}
            initial={{ rotate: -90, opacity: 0.7 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
