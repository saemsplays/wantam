
import React, { useState } from 'react';
import { FileText, X, Plus, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';

const bills = [
  { id: 'finance-2025', name: 'Finance Bill 2025', path: '/', color: 'bg-gradient-to-r from-red-600 to-green-600' },
  { id: 'budget-2025', name: 'Budget Bill 2025', path: '/budget-2025', color: 'bg-gradient-to-r from-black to-red-600' },
  { id: 'tax-2025', name: 'Tax Bill 2025', path: '/tax-2025', color: 'bg-gradient-to-r from-green-600 to-black' },
  { id: 'investment-2025', name: 'Investment Bill 2025', path: '/investment-2025', color: 'bg-gradient-to-r from-red-600 to-black' },
  { id: 'digital-2025', name: 'Digital Economy Bill 2025', path: '/digital-2025', color: 'bg-gradient-to-r from-green-600 to-red-600' }
];

const BillsFAB = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleBillSelect = (path: string) => {
    navigate(path);
    setIsExpanded(false);
  };

  const getCurrentBill = () => {
    return bills.find(bill => bill.path === location.pathname) || bills[0];
  };

  return (
    <div className="fixed left-4 bottom-36 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-4 space-y-2"
          >
            {bills.map((bill, index) => (
              <motion.button
                key={bill.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleBillSelect(bill.path)}
                className={`flex items-center space-x-3 px-4 py-3 ${bill.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 whitespace-nowrap`}
                disabled={bill.path === location.pathname}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">{bill.name}</span>
                {bill.path === location.pathname && (
                  <div className="w-2 h-2 bg-white opacity-50 rounded-full" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-12 h-12 ${getCurrentBill().color} text-white rounded-full shadow-lg hover:shadow-xl transition-all transform flex items-center justify-center ${!isExpanded ? 'opacity-70 hover:opacity-100' : 'opacity-100'}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isExpanded ? <X className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
        </motion.div>
      </motion.button>

      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center"
        >
          <ChevronUp className="w-3 h-3 text-gray-600" />
        </motion.div>
      )}
    </div>
  );
};

export default BillsFAB;
