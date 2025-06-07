
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ExternalLink } from 'lucide-react';

interface BillsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BillsSidebar: React.FC<BillsSidebarProps> = ({ isOpen, onClose }) => {
  const bills = [
    { id: 'budget', name: 'Budget 2025', path: '/budget-2025', description: 'Government budget allocation and spending plans' },
    { id: 'tax', name: 'Tax 2025', path: '/tax-2025', description: 'New taxation policies and reforms' },
    { id: 'investment', name: 'Investment 2025', path: '/investment-2025', description: 'Foreign and local investment regulations' },
    { id: 'digital', name: 'Digital Economy 2025', path: '/digital-2025', description: 'Digital transformation and cyber regulations' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl z-[9999] overflow-hidden border-r border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">All Bills 2025</h2>
                    <p className="text-white/80 text-sm">Review and object</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {bills.map((bill) => (
                    <motion.a
                      key={bill.id}
                      href={bill.path}
                      className="block bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-[1.02] border border-gray-200 dark:border-gray-700"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{bill.name}</h3>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{bill.description}</p>
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                            <span>View Details</span>
                            <ExternalLink className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Exercise your constitutional right to public participation
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
