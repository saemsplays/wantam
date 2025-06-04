
import React, { useState, useEffect, useRef } from 'react';
import { Heart, X, Gift, Copy, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const DONATION_OPTIONS = [
  {
    name: 'Ko-fi',
    url: 'https://ko-fi.com/civiceducationkenya',
    description: 'Support us with a coffee',
    icon: '☕'
  },
  {
    name: 'PayPal',
    url: 'https://www.paypal.com/ncp/payment/5HP7FN968RTH6',
    description: 'Donate via PayPal',
    icon: '💳'
  },
  {
    name: 'M-Pesa',
    number: '+254798903373',
    description: 'Send to M-Pesa',
    icon: '📱'
  }
];

const MAX_WIDGET_DISPLAY_TIME = 5 * 60 * 1000;

interface DonationWidgetProps {
  onTimedOut?: () => void;
  isVisible?: boolean;
}

const DonationWidget: React.FC<DonationWidgetProps> = ({ onTimedOut, isVisible: controlledVisibility }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const widgetMountTimeRef = useRef<number>(Date.now());
  const { toast } = useToast();
  
  // Show widget after delay
  useEffect(() => {
    if (controlledVisibility !== undefined) {
      setIsVisible(controlledVisibility);
      return;
    }

    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);
    
    const pulseTimer = setTimeout(() => {
      if (!isExpanded) setShowPulse(true);
    }, 12000);
    
    const idleTimer = setTimeout(() => {
      if (!isExpanded && !isHovering) {
        setIsIdle(true);
      }
    }, 30000);
    
    const timeoutTimer = setTimeout(() => {
      if (!isExpanded) {
        setIsVisible(false);
        setHasTimedOut(true);
        if (onTimedOut) onTimedOut();
      }
    }, MAX_WIDGET_DISPLAY_TIME);
    
    return () => {
      clearTimeout(visibilityTimer);
      clearTimeout(pulseTimer);
      clearTimeout(idleTimer);
      clearTimeout(timeoutTimer);
    };
  }, [isExpanded, isHovering, onTimedOut, controlledVisibility]);
  
  useEffect(() => {
    if (isExpanded) {
      setShowPulse(false);
      setIsIdle(false);
    }
    
    if (isHovering) {
      setIsIdle(false);
    }
  }, [isExpanded, isHovering]);

  useEffect(() => {
    if (hasTimedOut || controlledVisibility !== undefined) return;
    
    const checkRemainingTime = () => {
      const elapsedTime = Date.now() - widgetMountTimeRef.current;
      
      if (elapsedTime >= MAX_WIDGET_DISPLAY_TIME && !isExpanded) {
        setIsVisible(false);
        setHasTimedOut(true);
        if (onTimedOut) onTimedOut();
      }
    };
    
    const interval = setInterval(checkRemainingTime, 10000);
    
    return () => clearInterval(interval);
  }, [isExpanded, hasTimedOut, onTimedOut, controlledVisibility]);

  const handleMpesa = () => {
    navigator.clipboard.writeText('+254798903373');
    toast({
      title: "M-Pesa number copied",
      description: "+254798903373 copied to clipboard",
      duration: 3000,
    });
  };

  if (hasTimedOut || !isVisible) return null;

  return (
    <div
      className={`fixed z-50 shadow-lg rounded-lg transition-all duration-300 ${
        isExpanded 
          ? 'bottom-1/2 right-1/2 transform translate-x-1/2 translate-y-1/2 bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700' 
          : 'bottom-32 right-6'
      }`}
      style={{ zIndex: 999 }}
    >
      {!isExpanded ? (
        // Circular button design
        <button
          className={`group relative flex items-center justify-center transition-all duration-500 ease-out ${
            isHovering 
              ? 'px-4 py-3 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg' 
              : 'w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg'
          } ${showPulse ? 'animate-pulse' : ''} ${isIdle ? 'opacity-70' : 'opacity-100'}`}
          onClick={() => setIsExpanded(true)}
          onMouseEnter={() => {
            setIsHovering(true);
            setIsIdle(false);
          }}
          onMouseLeave={() => {
            setIsHovering(false);
          }}
        >
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
          <Heart className="h-5 w-5 text-white flex-shrink-0" />
          <span className={`text-white font-medium text-sm whitespace-nowrap transition-all duration-500 ease-out overflow-hidden ${
            isHovering ? 'ml-2 opacity-100 max-w-[100px]' : 'ml-0 opacity-0 max-w-0'
          }`}>
            Support Us
          </span>
        </button>
      ) : (
        // Expanded state
        <div className="w-80 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg flex items-center">
              <Gift className="h-5 w-5 mr-2 text-green-600" />
              Support Our Work
            </h3>
            <button
              className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your support helps us continue our mission of civic education in Kenya.
          </p>
          
          <div className="space-y-3">
            {DONATION_OPTIONS.map((option, index) => (
              <div 
                key={option.name}
                className="p-3 rounded-lg flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center">
                  <div className="text-xl mr-3">
                    {option.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{option.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{option.description}</p>
                  </div>
                </div>
                
                {option.name === 'M-Pesa' ? (
                  <button
                    onClick={handleMpesa}
                    className="px-3 py-1 text-sm rounded-md flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>Copy</span>
                    <Copy className="h-3 w-3 ml-1" />
                  </button>
                ) : (
                  <a
                    href={option.url}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-sm rounded-md flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                )}
              </div>
            ))}
          </div>
          
          <button
            className="w-full mt-4 py-2 rounded-md font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
            onClick={() => setIsExpanded(false)}
          >
            Maybe Later
          </button>
        </div>
      )}
    </div>
  );
};

export default DonationWidget;
