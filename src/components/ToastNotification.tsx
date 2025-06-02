
import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastNotificationProps {
  message: string;
  type?: 'info' | 'success' | 'error';
  onClose: () => void;
  duration?: number;
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor = {
    info: 'bg-blue-500',
    success: 'bg-emerald-500',
    error: 'bg-red-500'
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-[60] ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-fade-in`}>
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-white hover:bg-white/20 rounded p-1 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
