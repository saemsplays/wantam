
import React from 'react';
import { Shield, Menu, Radio } from 'lucide-react';
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
  onRadioClick,
}) => {
  const buttonSize = "w-12 h-12";
  const spacing = "mb-3";

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="fixed right-8 bottom-44 transform -translate-y-[5px] z-40 flex flex-col items-center">
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

      {/* Radio FAB */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={onRadioClick}
        className={`${buttonSize} ${spacing} bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center`}
        title="Offline Radio"
      >
        <Radio className="w-5 h-5" />
      </motion.button>

      {/* MenuFAB */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        onClick={onMenuClick}
        className={`${buttonSize} ${spacing} bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors duration-200 flex items-center justify-center`}
        title="Bills Menu"
      >
        <Menu className="w-5 h-5" />
      </motion.button>
    </div>
  );
};
