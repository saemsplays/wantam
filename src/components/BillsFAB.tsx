
import React, { useState } from 'react';
import { FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BillsSidebar } from './BillsSidebar';

export const BillsFAB: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const bills = [
    { id: 'budget', name: 'Budget 2025', path: '/budget-2025' },
    { id: 'tax', name: 'Tax 2025', path: '/tax-2025' },
    { id: 'investment', name: 'Investment 2025', path: '/investment-2025' },
    { id: 'digital', name: 'Digital Economy 2025', path: '/digital-2025' }
  ];

  return (
    <>
      <div className="relative">
        {/* Individual Bill Buttons */}
        <AnimatePresence>
          {isExpanded && (
            <div className="absolute bottom-16 left-0 space-y-2">
              {bills.map((bill, index) => (
                <motion.a
                  key={bill.id}
                  href={bill.path}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  transition={{ 
                    duration: 0.2, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  className="flex items-center bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-200 dark:border-gray-600 whitespace-nowrap"
                >
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium">{bill.name}</span>
                </motion.a>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Main FAB */}
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 relative z-[60]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <div className="relative">
            {isExpanded ? (
              <ChevronDown className="h-6 w-6" />
            ) : (
              <ChevronUp className="h-6 w-6" />
            )}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          </div>
        </motion.button>

        {/* View All Button */}
        <AnimatePresence>
          {isExpanded && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: bills.length * 0.05 + 0.1 }}
              onClick={() => setShowSidebar(true)}
              className="absolute bottom-20 left-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105 text-sm font-medium whitespace-nowrap"
            >
              View All Bills
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <BillsSidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} />
    </>
  );
};
