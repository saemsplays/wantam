import React, { useState, useEffect, useRef } from 'react';
import { Users, X, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CountUp from './CountUp';

const InteractiveCountWidget = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [userCount, setUserCount] = useState({ viewers: 0, emailsSent: 0 });
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [hasAutoHidden, setHasAutoHidden] = useState(false);
  
  const widgetRef = useRef<HTMLDivElement>(null);
  const autoHideTimeout = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide functionality - FIXED: Added dependency array
  useEffect(() => {
    if (isExpanded && !hasAutoHidden) {
      autoHideTimeout.current = setTimeout(() => {
        setIsExpanded(false);
        setHasAutoHidden(true);
      }, 8000);
      
      return () => {
        if (autoHideTimeout.current) {
          clearTimeout(autoHideTimeout.current);
        }
      };
    }
  }, [isExpanded, hasAutoHidden]); // Added missing dependencies

  // Touch handlers for mobile swipe - FIXED: Prevent default on touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default touch behavior
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isRightSwipe = distance < -50;
    
    if (isRightSwipe && !isExpanded) {
      setIsExpanded(true);
      setHasAutoHidden(false);
    }
  };

  // Handle click outside to close - FIXED: Removed isMobile dependency
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []); // Removed isMobile dependency

  // Fetch real count updates - FIXED: Added error handling
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data, error } = await supabase
          .from('user_counts')
          .select('viewers, emails_sent')
          .limit(1);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setUserCount({
            viewers: data[0].viewers || 0,
            emailsSent: data[0].emails_sent || 0
          });
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
        // Optional: Set error state or show user notification
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  const totalCount = userCount.viewers + userCount.emailsSent;

  if (!isVisible) return null;

  return (
    <>
      {/* Mobile Version */}
      {isMobile && (
        <div
          ref={widgetRef}
          className={`fixed top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-out ${
            isExpanded ? 'left-0' : '-left-72'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Swipe hint */}
          {!isExpanded && (
            <div className="fixed left-0 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-r-lg shadow-lg animate-pulse z-50">
              <ChevronRight size={16} />
            </div>
          )}
          
          {/* Main widget */}
          <div className="bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-2xl rounded-r-2xl p-6 w-72">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Live Activity</h3>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close widget"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  <CountUp 
                    to={totalCount} 
                    duration={2}
                    separator=","
                    className="tabular-nums"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-1">Total Citizens Engaged</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">
                    <CountUp 
                      to={userCount.viewers} 
                      duration={1.5}
                      separator=","
                    />
                  </div>
                  <p className="text-xs text-blue-600">Viewers</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">
                    <CountUp 
                      to={userCount.emailsSent} 
                      duration={1.5}
                      separator=","
                    />
                  </div>
                  <p className="text-xs text-green-600">Emails Sent</p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 text-center">
                Updates every 10 seconds
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Version */}
      {!isMobile && (
        <div
          ref={widgetRef}
          className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-500 ease-out ${
            isExpanded ? 'translate-x-0' : '-translate-x-72'
          }`}
        >
          {/* Minimized bar */}
          <div
            className={`absolute left-full top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-8 rounded-r-lg shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl ${
              isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            onClick={() => {
              setIsExpanded(true);
              setHasAutoHidden(false);
            }}
            role="button"
            tabIndex={0}
            aria-label="Expand widget"
          >
            <div className="flex flex-col items-center gap-2">
              <Users size={16} />
              <div className="text-xs font-bold" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
                <CountUp 
                  to={totalCount} 
                  duration={2}
                  separator=","
                  className="tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* Expanded widget */}
          <div className={`bg-white/95 backdrop-blur-md border-r border-gray-200 shadow-2xl rounded-r-2xl p-6 w-80 transition-all duration-500 ${
            isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Live Activity</h3>
                  <p className="text-xs text-gray-500">Citizens Taking Action</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded"
                aria-label="Close widget"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                  <CountUp 
                    to={totalCount} 
                    duration={2.5}
                    separator=","
                    className="tabular-nums"
                  />
                </div>
                <p className="text-sm text-gray-600">Total Citizens Engaged</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    <CountUp 
                      to={userCount.viewers} 
                      duration={2}
                      separator=","
                      className="tabular-nums"
                    />
                  </div>
                  <p className="text-xs text-blue-600 font-medium">Viewers</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    <CountUp 
                      to={userCount.emailsSent} 
                      duration={2}
                      separator=","
                      className="tabular-nums"
                    />
                  </div>
                  <p className="text-xs text-green-600 font-medium">Emails Sent</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Live updates every 10s</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InteractiveCountWidget;
