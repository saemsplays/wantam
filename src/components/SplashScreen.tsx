
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Scale, Users } from 'lucide-react';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Only show splash screen on mobile devices
  if (!isMobile) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
          <div className="flex flex-col items-center text-center px-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 150, 
                damping: 20,
                delay: 0.2
              }}
              className="w-24 h-24 mb-6 bg-gradient-to-br from-red-600 to-green-600 rounded-full flex items-center justify-center"
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                delay: 0.6, 
                duration: 0.5,
                exit: { duration: 0.3 }
              }}
              className="space-y-4"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                Finance Bill Objection
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-sm">
                Exercise Your Constitutional Rights
              </p>
              
              <div className="flex justify-center space-x-4 mt-6">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Scale className="w-4 h-4" />
                  <span>Article 118(1)</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>Public Participation</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "70%" }}
              exit={{ width: "0%", opacity: 0 }}
              transition={{ 
                delay: 1,
                duration: 1.5,
                ease: "easeInOut",
                exit: { duration: 0.3 }
              }}
              className="mt-8 h-1 bg-gradient-to-r from-red-500 to-green-500 rounded-full max-w-xs"
            />
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ 
                delay: 1.2,
                duration: 2, 
                repeat: 1,
                repeatType: "loop"
              }}
              className="mt-6 text-sm text-gray-500 dark:text-gray-400 italic"
            >
              "Your Voice, Your Constitution"
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
