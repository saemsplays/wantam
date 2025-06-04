
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
  const [showSwipeHint, setShowSwipeHint] = useState(true);

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

  // Auto-hide after expansion
  useEffect(() => {
    if (isExpanded && !hasAutoHidden) {
      autoHideTimeout.current = setTimeout(() => {
        setIsExpanded(false);
        setHasAutoHidden(true);
      }, 8000);

      return () => {
        if (autoHideTimeout.current) clearTimeout(autoHideTimeout.current);
      };
    }
  }, [isExpanded, hasAutoHidden]);

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
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

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch stats
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
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 10000);
    return () => clearInterval(interval);
  }, []);

  // Hide swipe hint after few seconds
  useEffect(() => {
    if (isMobile && !isExpanded) {
      const hintTimer = setTimeout(() => setShowSwipeHint(false), 5000);
      return () => clearTimeout(hintTimer);
    }
  }, [isMobile, isExpanded]);

  const totalCount = userCount.viewers + userCount.emailsSent;

  if (!isVisible) return null;

  return (
    <>
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
          {/* Swipe Tab Hint */}
          {!isExpanded && showSwipeHint && (
            <div
              className="absolute left-full top-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-2 rounded-r-lg shadow-md animate-bounce z-50 cursor-pointer pointer-events-auto"
              onClick={() => {
                setIsExpanded(true);
                setHasAutoHidden(false);
              }}
            >
              <div className="flex items-center gap-1">
                <ChevronRight size={16} />
                <span className="text-xs font-medium">Swipe to view</span>
              </div>
            </div>
          )}

          {/* Main Mobile Widget */}
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
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close widget"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  <CountUp to={totalCount} duration={2} separator="," />
                </div>
                <p className="text-sm text-gray-600 mt-1">Total Citizens Engaged</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-semibold text-blue-600">
                    <CountUp to={userCount.viewers} duration={1.5} separator="," />
                  </div>
                  <p className="text-xs text-blue-600">Viewers</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-semibold text-green-600">
                    <CountUp to={userCount.emailsSent} duration={1.5} separator="," />
                  </div>
                  <p className="text-xs text-green-600">Emails Sent</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">Updates every 10 seconds</div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop remains unchanged (optional: include if needed) */}
    </>
  );
};

export default InteractiveCountWidget;
