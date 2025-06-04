
import React, { useState, useEffect } from 'react';
import { Users, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CountUp from './CountUp';

const UserCountSidebar = () => {
  const [userCount, setUserCount] = useState({ viewers: 0, emailsSent: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await supabase
          .from('user_counts')
          .select('viewers, emails_sent')
          .limit(1);
        
        if (response.error) throw response.error;
        
        const data = response.data?.[0];
        if (data) {
          setUserCount({
            viewers: data.viewers || 0,
            emailsSent: data.emails_sent || 0
          });
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const totalUsers = userCount.viewers + userCount.emailsSent;

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-lg p-4 text-white">
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Users className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium">Live Stats</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            <CountUp
              from={0}
              to={totalUsers}
              separator=","
              duration={2}
              className="count-up-text"
            />
          </div>
          <div className="text-xs text-gray-400">Total Citizens</div>
        </div>

        <div className="border-t border-gray-700 pt-4 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-3 w-3 text-blue-400" />
            <div className="flex-1">
              <div className="text-sm font-medium">
                <CountUp
                  from={0}
                  to={userCount.viewers}
                  separator=","
                  duration={1.5}
                />
              </div>
              <div className="text-xs text-gray-400">Viewers</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <div className="text-sm font-medium">
                <CountUp
                  from={0}
                  to={userCount.emailsSent}
                  separator=","
                  duration={1.5}
                />
              </div>
              <div className="text-xs text-gray-400">Objections Sent</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCountSidebar;
