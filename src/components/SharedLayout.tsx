
import React, { useState } from 'react';
import { useZIndexManager } from '@/hooks/useZIndexManager';
import { ScrollToTop } from './ScrollToTop';
import { FloatingActionButtons } from './FloatingActionButtons';
import { DarkModeToggle } from './DarkModeToggle';
import { ShareButton } from './ShareButton';
import { OfflineRadioSystem } from './OfflineRadioSystem';
import EmergencyReportingSystem from './EmergencyReportingSystem';
import DonationWidget from './DonationWidget';
import BillsFAB from './BillsFAB';
import Dock from './Dock';
import { Scale } from 'lucide-react';
import { Home as HomeIcon, Archive as ArchiveIcon, Settings as SettingsIcon, HelpCircle as HelpCircleIcon, Lightbulb as LightbulbIcon, Heart as HeartIcon, Flag as FlagIcon, ExternalLink as ExternalLinkIcon, Radio as RadioIcon, FileText as FileTextIcon, Users as UsersIcon } from "lucide-react";

interface SharedLayoutProps {
  children: React.ReactNode;
}

export const SharedLayout: React.FC<SharedLayoutProps> = ({ children }) => {
  const zIndexManager = useZIndexManager();
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isDonationVisible, setIsDonationVisible] = useState(false);

  const handleReportClick = () => {
    if (isReportingOpen) {
      zIndexManager.sendToBack('emergency');
      setIsReportingOpen(false);
    } else {
      zIndexManager.bringToFront('emergency');
      setIsReportingOpen(true);
    }
  };

  const handleRadioClick = () => {
    if (isRadioOpen) {
      zIndexManager.sendToBack('radio');
      setIsRadioOpen(false);
    } else {
      zIndexManager.bringToFront('radio');
      setIsRadioOpen(true);
    }
  };

  const handleDonationClick = () => {
    if (isDonationVisible) {
      zIndexManager.sendToBack('donation');
      setIsDonationVisible(false);
    } else {
      zIndexManager.bringToFront('donation');
      setIsDonationVisible(true);
    }
  };

  const handleSupportClick = () => {
    handleDonationClick();
  };

  const handleMenuClick = () => {
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBillsClick = () => {
    zIndexManager.bringToFront('bills');
  };

  const dockItems = [
    { 
      icon: <RadioIcon size={18} />, 
      label: 'Radio', 
      onClick: handleRadioClick
    },
    { 
      icon: <FlagIcon size={18} />, 
      label: 'Report', 
      onClick: handleReportClick
    },
    { 
      icon: <UsersIcon size={18} />, 
      label: 'CEKA', 
      onClick: () => {
        const confirmed = confirm('You are about to visit the main CEKA platform. Would you like to proceed?');
        if (confirmed) {
          window.open('https://ceka.lovable.app', '_blank');
        }
      }
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <DarkModeToggle />

      <div 
        className={`${zIndexManager.activeButton === 'share' ? 'z-[9999]' : 'z-40'}`}
        style={{
          position: 'relative',
          zIndex: zIndexManager.activeButton === 'share' ? 9999 : 40
        }}
      >
        <ShareButton />
      </div>
      
      <ScrollToTop />

      <FloatingActionButtons
        onReportClick={handleReportClick}
        onSupportClick={handleDonationClick}
        onMenuClick={handleMenuClick}
        onScrollToTop={handleScrollToTop}
        onRadioClick={handleRadioClick}
        isReportOpen={isReportingOpen}
      />

      <div 
        className={`${zIndexManager.activeButton === 'bills' ? 'z-[9999]' : 'z-50'}`}
        style={{
          position: 'relative',
          zIndex: zIndexManager.activeButton === 'bills' ? 9999 : 50
        }}
      >
        <BillsFAB />
      </div>

      <div 
        className={`${zIndexManager.activeButton === 'emergency' ? 'z-[9999]' : 'z-50'}`}
        style={{
          position: 'relative',
          zIndex: zIndexManager.activeButton === 'emergency' ? 9999 : 50
        }}
      >
        <EmergencyReportingSystem 
          isOpen={isReportingOpen} 
          onClose={() => {
            zIndexManager.sendToBack('emergency');
            setIsReportingOpen(false);
          }} 
        />
      </div>

      <div 
        className={`${zIndexManager.activeButton === 'radio' ? 'z-[9999]' : 'z-50'}`}
        style={{
          position: 'relative',
          zIndex: zIndexManager.activeButton === 'radio' ? 9999 : 50
        }}
      >
        <OfflineRadioSystem
          isOpen={isRadioOpen}
          onClose={() => {
            zIndexManager.sendToBack('radio');
            setIsRadioOpen(false);
          }}
        />
      </div>

      <div 
        className={`${zIndexManager.activeButton === 'donation' ? 'z-[9999]' : 'z-50'}`}
        style={{
          position: 'relative',
          zIndex: zIndexManager.activeButton === 'donation' ? 9999 : 50
        }}
      >
        <DonationWidget 
          isVisible={isDonationVisible}
          onTimedOut={() => {
            zIndexManager.sendToBack('donation');
          }}
        />
      </div>

      {children}

      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-200 dark:text-gray-300 py-8 text-xs text-center px-4 max-w-full overflow-x-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <p className="break-words max-w-full">
            <strong>
              Published by{" "}
              <a
                href="https://ceka.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-emerald-400 dark:text-emerald-300 hover:text-emerald-300 dark:hover:text-emerald-200 break-words"
              >
                Civic Education Kenya App (CEKA). 
              </a>
            </strong>
          </p>
          <p className="break-words max-w-full">
            CEKA provides this tool under the Constitution of Kenya 2010 (Art 33, Art 35, Art 118(1)). 
            CEKA does not store, monitor, or share personal user data. 
          </p>
          <p className="break-words max-w-full">
            We collect only anonymous, aggregate usage statistics (such as page views) to improve service delivery.
          </p>
          <p className="mt-2 italic break-words max-w-full">
            By using this platform, you acknowledge that all content is user-generated. CEKA holds no liability for any outcomes arising from your objection email.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-gray-400 dark:text-gray-500">
            <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 dark:text-emerald-300 flex-shrink-0" />
            <span className="text-center text-xs sm:text-sm break-words max-w-full">
              Exercise your constitutional right to participate in legislative processes (Art 118(1)).
            </span>
          </div>
        </div>
      </footer>

      <div className="bg-gray-800 dark:bg-gray-950 border-t border-gray-700 dark:border-gray-800 text-gray-300 dark:text-gray-400 p-3 pb-20 text-center text-xs font-medium transition-colors duration-300">
        <p className="max-w-3xl mx-auto">
          This platform operates under <strong>Art 33 (Freedom of Expression)</strong>, <strong>Art 35 (Access to Information)</strong>, and <strong>Art 118(1) (Public Participation)</strong> of the Constitution of Kenya 2010. 
          No data is stored or shared. All emails are drafted locally on your device.
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </div>
  );
};
