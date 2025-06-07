
import React from 'react';
import { Shield, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingActionButtonsProps {
  onReportClick: () => void;
  onSupportClick: () => void;
  onMenuClick: () => void;
  onScrollToTop: () => void;
  onRadioClick?: () => void;
  isReportOpen?: boolean;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onReportClick,
  onSupportClick,
  onMenuClick,
  onScrollToTop,
  onRadioClick,
  isReportOpen = false,
}) => {
  const buttonSize = "w-12 h-12";
  const spacing = "mb-3";

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="fixed right-8 bottom-44 transform -translate-y-[5px] z-30 flex flex-col items-center">
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={onReportClick}
        className={`${buttonSize} ${spacing} ${
          isReportOpen 
            ? 'bg-red-700 hover:bg-red-800 opacity-100' 
            : 'bg-red-600 hover:bg-red-700 opacity-70 hover:opacity-100'
        } text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center`}
        title="Report Emergency"
      >
        <Shield className="w-5 h-5" />
      </motion.button>

      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={onRadioClick}
        className={`${buttonSize} ${spacing} bg-gradient-to-r from-green-600 to-black hover:from-green-700 hover:to-gray-900 text-white rounded-full shadow-lg transition-all duration-200 flex items-center justify-center opacity-70 hover:opacity-100`}
        title="Offline Radio"
      >
        <Radio className="w-5 h-5" />
      </motion.button>
    </div>
  );
};
