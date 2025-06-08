import React, { useState } from 'react';
import { FileText, X, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useScrollVisibility } from '../hooks/useScrollVisibility';

const bills = [
  { id: 'finance-2025', name: 'Finance Bill 2025', path: '/', color: 'bg-gradient-to-r from-red-600 to-green-600' },
  { id: 'budget-2025', name: 'Budget Bill 2025', path: '/budget-2025', color: 'bg-gradient-to-r from-black to-red-600' },
  { id: 'tax-2025', name: 'Tax Bill 2025', path: '/tax-2025', color: 'bg-gradient-to-r from-green-600 to-black' },
  { id: 'investment-2025', name: 'Investment Bill 2025', path: '/investment-2025', color: 'bg-gradient-to-r from-red-600 to-black' },
  { id: 'digital-2025', name: 'Digital Economy Bill 2025', path: '/digital-2025', color: 'bg-gradient-to-r from-green-600 to-red-600' }
];

const BillsFAB = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isVisible = useScrollVisibility(300);
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
    <div className="fixed left-4 bottom-36 z-30 transition-all duration-300 ease-in-out transform ${
    isVisible
      ? 'opacity-100 translate-y-0 pointer-events-auto'
      : 'opacity-0 translate-y-4 pointer-events-none'
  }`">
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Enhanced backdrop with blur effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 backdrop-blur-[1px] -z-10"
              onClick={() => setIsExpanded(false)}
            />
            
            {/* Enhanced bills container with glass morphism */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.3
              }}
              className="mb-4 space-y-2 bg-white/10 backdrop-blur-lg rounded-2xl p-3 border border-white/20 shadow-2xl"
              style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              }}
            >
              {bills.map((bill, index) => (
                <motion.button
                  key={bill.id}
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.8 }}
                  transition={{ 
                    delay: index * 0.05,
                    type: "spring",
                    damping: 20,
                    stiffness: 300
                  }}
                  onClick={() => handleBillSelect(bill.path)}
                  disabled={bill.path === location.pathname}
                  className={`
                    group relative flex items-center space-x-3 px-4 py-3 w-full
                    ${bill.path === location.pathname 
                      ? `${bill.color} ring-2 ring-white/30` 
                      : `${bill.color} hover:${bill.color.replace('bg-', 'bg-').replace('-500', '-600')}`
                    }
                    text-white rounded-xl shadow-lg hover:shadow-xl 
                    transition-all duration-200 transform hover:scale-[1.02] 
                    whitespace-nowrap backdrop-blur-sm
                    ${bill.path === location.pathname ? 'opacity-90' : 'hover:opacity-100 opacity-85'}
                  `}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Enhanced icon with glow effect */}
                  <div className={`
                    w-8 h-8 rounded-lg flex items-center justify-center
                    ${bill.path === location.pathname ? 'bg-white/20' : 'bg-white/10 group-hover:bg-white/20'}
                    transition-all duration-200
                  `}>
                    <FileText className="w-4 h-4" />
                  </div>
                  
                  {/* Enhanced text with better typography */}
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium tracking-wide">{bill.name}</span>
                    {bill.path === location.pathname && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-xs text-white/70 mt-0.5"
                      >
                        Current
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Enhanced current indicator */}
                  {bill.path === location.pathname && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 bg-white rounded-full shadow-lg"
                      style={{
                        boxShadow: '0 0 8px rgba(255, 255, 255, 0.6)',
                      }}
                    />
                  )}
                  
                  {/* Subtle hover glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </motion.button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Enhanced main FAB button */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          relative w-12 h-12 ${getCurrentBill().color} text-white rounded-full 
          shadow-lg hover:shadow-xl transition-all transform flex items-center justify-center
          ${!isExpanded ? 'opacity-70 hover:opacity-100' : 'opacity-100'}
          backdrop-blur-sm border border-white/10
        `}
        style={{
          boxShadow: isExpanded 
            ? '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)' 
            : '0 4px 16px rgba(0, 0, 0, 0.2)',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 45 : 0 }}
          transition={{ 
            type: "spring",
            damping: 15,
            stiffness: 300,
            duration: 0.2 
          }}
        >
          {isExpanded ? <X className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
        </motion.div>
        
        {/* Enhanced glow effect when expanded */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 rounded-full bg-white/10 animate-pulse"
          />
        )}
      </motion.button>
      
      {/* Enhanced expand indicator */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-white/90 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center shadow-lg"
          style={{
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <ChevronUp className="w-3 h-3 text-gray-700" />
        </motion.div>
      )}
    </div>
  );
};

export default BillsFAB;
