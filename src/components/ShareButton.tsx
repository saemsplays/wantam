
import React, { useState } from 'react';
import { Share2, MessageCircle, Mail, Copy, Check, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ShareButton: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const currentUrl = window.location.href;
  const shareText = "Check out the Civic Education Kenya App - Object to the Finance Bill 2025!";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const shareOptions = [
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-r from-red-600 to-green-600',
      message: '🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA',
      action: () => {
        navigator.clipboard.writeText('🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA\n\nrejectfinancebill2025.lovable.app');
        alert('Text copied! Open Instagram and paste in your story or post.');
      }
    },
    {
      name: 'X (Twitter)',
      icon: Twitter,
      color: 'bg-gradient-to-r from-black to-red-600',
      message: 'Hi #KOT #KenyansOnTwitter. You\'ve got to see this app #RFB254 by #CEKA. They\'ve really outdone themselves with this one! #RejectFinanceBill2025 #CivicEducationKenya',
      action: () => {
        const text = encodeURIComponent('🚨 Your constitutional rights matter! Join the Finance Bill objection movement. Exercise your Article 118(1) rights for public participation. #RejectFinanceBill2025 #CEKA');
        const url = encodeURIComponent('https://rejectfinancebill2025.lovable.app');
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
      }
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
        window.open('https://linktr.ee/civiceducationke', '_blank');
      }
    }
  ];

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div className="relative flex flex-col items-end">
        {/* Share Options - Now horizontal */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-row gap-2 mb-3 pr-1"
            >
              {shareOptions.map((option, index) => (
                <motion.button
                  key={option.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={option.action}
                  className={`p-3 rounded-full text-white shadow-lg transition-all duration-200 hover:scale-110 ${option.color}`}
                  title={option.label}
                >
                  <option.icon className="h-5 w-5" />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Share Button */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-4 bg-primary text-primary-foreground rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <div className="relative">
            <Users className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default ShareButton;
