
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Minimize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type ClearMode = 'normal' | 'clear' | 'ultra-clear';

interface ClearModeToggleProps {
  onModeChange: (mode: ClearMode) => void;
}

export const ClearModeToggle: React.FC<ClearModeToggleProps> = ({ onModeChange }) => {
  const [mode, setMode] = useState<ClearMode>('normal');

  const toggleMode = () => {
    const modes: ClearMode[] = ['normal', 'clear', 'ultra-clear'];
    const currentIndex = modes.indexOf(mode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setMode(nextMode);
    onModeChange(nextMode);
  };

  const getIcon = () => {
    switch (mode) {
      case 'normal':
        return <Eye className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
      case 'clear':
        return <EyeOff className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
      case 'ultra-clear':
        return <Minimize className="w-6 h-6 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'normal':
        return 'Switch to Clear Mode';
      case 'clear':
        return 'Switch to Ultra Clear Mode';
      case 'ultra-clear':
        return 'Switch to Normal Mode';
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 translate-x-16 z-50">
      <motion.button
        onClick={toggleMode}
        className="relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
        style={{ opacity: 0.05 }}
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
            key={mode}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    </div>
  );
};
