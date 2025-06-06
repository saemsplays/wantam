
import React from 'react';
import { Shield, Heart, Menu, ArrowUp, Radio } from 'lucide-react';
import { motion } from 'framer-motion';

interface FloatingActionButtonsProps {
  onReportClick: () => void;
  onSupportClick: () => void;
  onMenuClick: () => void;
  onScrollToTop: () => void;
  onRadioClick?: () => void;
}

export const FloatingActionButtons: React.FC<FloatingActionButtonsProps> = ({
  onReportClick,
  onSupportClick,
  onMenuClick,
  onScrollToTop,
  onRadioClick
}) => {
  const buttonSize = "w-8 h-8";
  const spacing = "mb-3";

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="fixed right-8 bottom-4 z-40 flex flex-col items-center">
      {/* Report FAB */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={onReportClick}
        className={`${buttonSize} ${spacing} bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center`}
        title="Report Emergency"
      >
        <Shield className="w-5 h-5" />
      </motion.button>

      {/* Support FAB */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={onSupportClick}
        className={`${buttonSize} ${spacing} bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center`}
        title="Support CEKA"
        data-donation-trigger
      >
        <Heart className="w-5 h-5" />
      </motion.button>

      {/* Menu/Radio FAB (conditional based on mobile) */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={isMobile ? onRadioClick : onMenuClick}
        className={`${buttonSize} ${spacing} bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center`}
        title="Radio Comms"
      >
        <Radio className="w-5 h-5" />}
      </motion.button>

    </div>
  );
};
