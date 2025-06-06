
import React, { useState } from 'react';
import { Share2, Instagram, Twitter, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ShareButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shareOptions = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      message: '🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA',
      action: () => {
        navigator.clipboard.writeText('🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA\n\nrejectfinancebill2025.lovable.app');
        alert('Text copied! Open Instagram and paste in your story or post.');
      }
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-black',
      message: '🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA',
      action: () => {
        const text = encodeURIComponent('🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA');
        const url = encodeURIComponent('https://rejectfinancebill2025.lovable.app');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }
    },
    {
      name: 'TikTok',
      icon: () => (
        <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
          <span className="text-black font-bold text-xs">T</span>
        </div>
      ),
      color: 'bg-black',
      message: '💪 Exercise your constitutional rights! Join the Finance Bill resistance. Your voice matters in democracy! #RejectFinanceBill2025 #CEKA #ConstitutionalRights',
      action: () => {
        navigator.clipboard.writeText('💪 Exercise your constitutional rights! Join the Finance Bill resistance. Your voice matters in democracy! #RejectFinanceBill2025 #CEKA #ConstitutionalRights\n\nrejectfinancebill2025.lovable.app');
        alert('Text copied! Open TikTok and paste in your video description.');
      }
    },
    {
      name: 'Follow CEKA',
      icon: ExternalLink,
      color: 'bg-gradient-to-r from-emerald-600 to-blue-600',
      message: 'Follow us for updates',
      action: () => {
        window.open('https://linktr.ee/ceka', '_blank');
      }
    }
  ];

  return (
    <div className="fixed left-4 bottom-20 md:bottom-4 z-50">
      <div className="relative">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Share"
        >
          <Share2 className="w-5 h-5" />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 left-0 flex flex-col space-y-2"
            >
              {shareOptions.map((option, index) => {
                const IconComponent = option.icon;
                return (
                  <motion.button
                    key={option.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      option.action();
                      setIsOpen(false);
                    }}
                    className={`w-10 h-10 ${option.color} hover:shadow-lg text-white rounded-full transition-all duration-200 flex items-center justify-center group relative`}
                    title={option.name}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <IconComponent />
                    <div className="absolute left-12 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {option.name}
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
