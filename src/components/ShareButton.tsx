import React, { useState, useEffect } from 'react';
import { Share2, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShareButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showToasts, setShowToasts] = useState(true);

  const shareOptions = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-red-600 to-green-600',
      link: 'https://www.instagram.com/civiceducationke/',
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-gradient-to-r from-black to-red-600',
      link: 'https://twitter.com/civiceducationke',
    },
    {
      name: 'TikTok',
      icon: () => (
        <img 
          src="/lovable-uploads/2cc19d59-6197-421d-a11f-b1e74b3072e4.png" 
          alt="TikTok" 
          className="w-5 h-5"
        />
      ),
      color: 'bg-gradient-to-r from-green-600 to-black',
      link: 'https://www.tiktok.com/@civiceducationke',
    },
    {
      name: 'Follow CEKA',
      icon: ExternalLink,
      color: 'bg-gradient-to-r from-emerald-600 to-blue-600',
      link: 'https://linktr.ee/civiceducationke',
    }
  ];

  // Show toast notifications once after mount
  useEffect(() => {
    const toastTimeout = setTimeout(() => setShowToasts(false), 10000);
    return () => clearTimeout(toastTimeout);
  }, []);

  return (
    <div className="fixed left-4 bottom-20 z-40">
      {/* Follow Toasts */}
      {showToasts && (
        <div className="space-y-2 mb-4">
          {shareOptions.map((option) => (
            <div
              key={option.name}
              className="bg-gray-800 text-white text-sm px-4 py-2 rounded shadow-lg animate-fadeIn"
            >
              ✅ Follow us on <strong>{option.name}</strong>!
            </div>
          ))}
        </div>
      )}

      {/* Floating Share Button */}
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center ${!isOpen ? 'opacity-70 hover:opacity-100' : 'opacity-100'}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Follow"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute left-16 top-0 flex flex-row space-x-2"
            >
              {shareOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <motion.a
                    key={option.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    href={option.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 ${option.color} hover:shadow-lg text-white rounded-full transition-all duration-200 flex items-center justify-center group relative`}
                    title={option.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent />
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {option.name}
                    </div>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
