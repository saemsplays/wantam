
import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

interface BillsDockPopupProps {
  isOpen: boolean;
  onClose: () => void;
  originElement: HTMLElement | null;
}

const bills = [
  { id: 'finance-2025', name: 'Finance Bill 2025', path: '/', color: 'bg-gradient-to-r from-red-600 to-green-600' },
  { id: 'budget-2025', name: 'Budget Bill 2025', path: '/budget-2025', color: 'bg-gradient-to-r from-black to-red-600' },
  { id: 'tax-2025', name: 'Tax Bill 2025', path: '/tax-2025', color: 'bg-gradient-to-r from-green-600 to-black' },
  { id: 'investment-2025', name: 'Investment Bill 2025', path: '/investment-2025', color: 'bg-gradient-to-r from-red-600 to-black' },
  { id: 'digital-2025', name: 'Digital Economy Bill 2025', path: '/digital-2025', color: 'bg-gradient-to-r from-green-600 to-red-600' }
];

export const BillsDockPopup: React.FC<BillsDockPopupProps> = ({ isOpen, onClose, originElement }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBillSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  const getCurrentBill = () => {
    return bills.find(bill => bill.path === location.pathname) || bills[0];
  };

  const getOriginPosition = () => {
    if (!originElement) return { x: 0, y: 0 };
    const rect = originElement.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  const originPos = getOriginPosition();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ 
              opacity: 0,
              scale: 0.8,
              x: originPos.x - 150,
              y: originPos.y - 200
            }}
            animate={{ 
              opacity: 1,
              scale: 1,
              x: originPos.x - 150,
              y: originPos.y - 250
            }}
            exit={{ 
              opacity: 0,
              scale: 0.8,
              x: originPos.x - 150,
              y: originPos.y - 200
            }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
              duration: 0.3
            }}
            className="fixed z-50 w-80 bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-lg border border-gray-700/50 rounded-2xl shadow-2xl overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-green-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Bills</h3>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-gray-800/80 hover:bg-gray-700/80 rounded-lg flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-3">
                {bills.map((bill, index) => (
                  <motion.button
                    key={bill.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleBillSelect(bill.path)}
                    disabled={bill.path === location.pathname}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                      bill.path === location.pathname
                        ? 'bg-gray-700/50 border border-gray-600/50'
                        : 'bg-gray-800/50 hover:bg-gray-700/50 hover:scale-[1.02]'
                    }`}
                  >
                    <div className={`w-10 h-10 ${bill.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="text-white font-medium text-sm">{bill.name}</h4>
                      {bill.path === location.pathname && (
                        <p className="text-green-400 text-xs mt-1">Current</p>
                      )}
                    </div>
                    {bill.path === location.pathname && (
                      <div className="w-2 h-2 bg-green-400 rounded-full" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
