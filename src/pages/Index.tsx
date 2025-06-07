
import React, { useState, useRef, useEffect } from 'react';
import { FileText, Heart, Flag, Radio, Settings } from 'lucide-react';
import DonationWidget from '../components/DonationWidget';
import EmergencyReportingSystem from '../components/EmergencyReportingSystem';
import BillsFAB from '../components/BillsFAB';
import { ShareButton } from '../components/ShareButton';
import { ScrollToTop } from '../components/ScrollToTop';
import UserCountSidebar from '../components/UserCountSidebar';
import { DarkModeToggle } from '../components/DarkModeToggle';
import InteractiveCountWidget from '../components/InteractiveCountWidget';
import Dock from '../components/Dock';
import { BillsDockPopup } from '../components/BillsDockPopup';
import { OfflineRadioSystem } from '../components/OfflineRadioSystem';

const Index = () => {
  const [showEmergencySystem, setShowEmergencySystem] = useState(false);
  const [showBillsPopup, setShowBillsPopup] = useState(false);
  const [showOfflineRadio, setShowOfflineRadio] = useState(false);
  const [showDonationWidget, setShowDonationWidget] = useState(false);
  const billsButtonRef = useRef<HTMLElement>(null);
  const supportButtonRef = useRef<HTMLElement>(null);

  // Set document title and meta tags
  useEffect(() => {
    document.title = 'Reject Finance Bill 2025 - CEKA';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Reject Finance Bill 2025 - CEKA');
    }

    // Update Open Graph meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', 'Reject Finance Bill 2025 - CEKA');
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', 'Reject Finance Bill 2025 - CEKA');
    }
  }, []);

  const handleSupportClick = () => {
    setShowDonationWidget(true);
  };

  const handleReportClick = () => {
    setShowEmergencySystem(!showEmergencySystem);
  };

  const handleBillsClick = () => {
    setShowBillsPopup(!showBillsPopup);
  };

  const handleRadioClick = () => {
    setShowOfflineRadio(!showOfflineRadio);
  };

  const dockItems = [
    {
      icon: <FileText size={18} />,
      label: 'Bills',
      onClick: handleBillsClick
    },
    {
      icon: <Radio size={18} />,
      label: 'Radio',
      onClick: handleRadioClick
    },
    {
      icon: <Heart size={18} />,
      label: 'Support',
      onClick: handleSupportClick
    },
    {
      icon: <Flag size={18} />,
      label: 'Report',
      onClick: handleReportClick
    },
    {
      icon: <Settings size={18} />,
      label: 'CEKA',
      onClick: () => {
        const confirmed = confirm('You are about to visit the main CEKA platform. Would you like to proceed?');
        if (confirmed) {
          window.open('https://ceka.lovable.app', '_blank');
        }
      }
    }
  ];

  return (
    <>
      <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/083b054c-3c9f-4599-a171-93c958349839.png" 
                  alt="CEKA Logo" 
                  className="h-8 w-auto mr-2" 
                />
                <h1 className="text-xl font-bold">Reject Finance Bill 2025</h1>
              </div>
              <InteractiveCountWidget />
            </div>
          </div>
        </header>

        <div className="flex-1 flex">
          <UserCountSidebar />
          
          <div className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  Object to the Finance Bill 2025
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Exercise your constitutional right to participate in legislative processes.
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Key Constitutional Violations
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400">
                      VAT on Essential Goods
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Violates Article 43 - Economic and social rights
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400">
                      Digital Lending Tax
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Violates Article 27 - Non-discrimination protections
                    </p>
                  </div>
                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-red-600 dark:text-red-400">
                      Privacy Rights Erosion
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Violates Article 31 - Right to privacy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Position Components */}
      <DarkModeToggle />
      <ShareButton />
      <ScrollToTop />
      <BillsFAB />

      {/* Overlays and Modals */}
      {showDonationWidget && (
        <DonationWidget 
          onClose={() => setShowDonationWidget(false)}
          originElement={supportButtonRef.current}
        />
      )}

      <EmergencyReportingSystem 
        isOpen={showEmergencySystem} 
        onClose={() => setShowEmergencySystem(false)} 
      />

      <BillsDockPopup 
        isOpen={showBillsPopup}
        onClose={() => setShowBillsPopup(false)}
        originElement={billsButtonRef.current}
      />

      <OfflineRadioSystem
        isOpen={showOfflineRadio}
        onClose={() => setShowOfflineRadio(false)}
      />

      {/* Dock */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </>
  );
};

export default Index;
