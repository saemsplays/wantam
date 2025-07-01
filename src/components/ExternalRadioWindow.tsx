
import React, { useRef, useEffect } from 'react';
import { Radio, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from "@/hooks/use-toast";

interface ExternalRadioWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExternalRadioWindow: React.FC<ExternalRadioWindowProps> = ({ isOpen, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleOpenExternalRadio = () => {
    const radioUrl = 'https://orad.lovable.app/';
    
    try {
      const newWindow = window.open(radioUrl, '_blank', 'noopener,noreferrer');
      
      if (newWindow) {
        toast({
          title: "Radio Opened",
          description: "The external radio system has been opened in a new tab.",
        });
        onClose();
      } else {
        // Fallback if popup is blocked
        window.location.href = radioUrl;
      }
    } catch (error) {
      console.error('Failed to open external radio:', error);
      toast({
        title: "Error",
        description: "Failed to open the radio system. Please try again.",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      // Auto-open the external radio when component opens
      handleOpenExternalRadio();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-50"
            onClick={onClose}
          />

          <motion.div
            ref={modalRef}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col rounded-r-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-red-50 dark:from-green-900/20 dark:to-red-900/20">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-black rounded-lg flex items-center justify-center">
                  <Radio className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">External Radio</h2>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Opens working radio system
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
              <div className="w-32 h-32 bg-gradient-to-r from-green-600 to-black rounded-full flex items-center justify-center shadow-lg">
                <Radio className="w-16 h-16 text-white" />
              </div>
              
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Radio System Opening
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  The external radio system is opening in a new tab. If it didn't open automatically, click the button below.
                </p>
                
                <button
                  onClick={handleOpenExternalRadio}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-black hover:from-green-700 hover:to-gray-900 text-white rounded-lg transition-colors font-medium"
                >
                  <ExternalLink className="w-5 h-5" />
                  Open Radio System
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 text-center max-w-xs">
                This will open the working radio implementation at orad.lovable.app in a new tab.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
