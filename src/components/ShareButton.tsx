
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
      icon: MessageCircle,
      label: 'WhatsApp',
      action: () => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`, '_blank'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      icon: Mail,
      label: 'Email',
      action: () => window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareText + '\n\n' + currentUrl)}`, '_blank'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      icon: copied ? Check : Copy,
      label: copied ? 'Copied!' : 'Copy Link',
      action: copyToClipboard,
      color: copied ? 'bg-green-500' : 'bg-gray-500 hover:bg-gray-600'
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
