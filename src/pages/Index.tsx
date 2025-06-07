import React, { useState, useRef } from 'react';
import { FileText, Heart, Flag, Radio, Settings } from 'lucide-react';
import { DonationWidget } from '../components/DonationWidget';
import EmergencyReportingSystem from '../components/EmergencyReportingSystem';
import BillsFAB from '../components/BillsFAB';
import { ShareButton } from '../components/ShareButton';
import ScrollToTop from '../components/ScrollToTop';
import UserCountSidebar from '../components/UserCountSidebar';
import DarkModeToggle from '../components/DarkModeToggle';
import { InteractiveCountWidget } from '../components/InteractiveCountWidget';
import Dock, { type DockItemData } from '../components/Dock';
import { BillsDockPopup } from '../components/BillsDockPopup';
import { OfflineRadioSystem } from '../components/OfflineRadioSystem';
import Head from 'next/head';

const Index = () => {
  const [showEmergencySystem, setShowEmergencySystem] = useState(false);
  const [showBillsPopup, setShowBillsPopup] = useState(false);
  const [showOfflineRadio, setShowOfflineRadio] = useState(false);
  const [showDonationWidget, setShowDonationWidget] = useState(false);
  
  const billsButtonRef = useRef<HTMLElement>(null);
  const supportButtonRef = useRef<HTMLElement>(null);

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

  const dockItems: DockItemData[] = [
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
    },
  ];

  return (
    <>
      <Head>
        <title>Reject Finance Bill 2025 - CEKA</title>
        <meta name="description" content="Reject Finance Bill 2025 - CEKA" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Reject Finance Bill 2025 - CEKA" />
        <meta property="og:description" content="Reject Finance Bill 2025 - CEKA" />
        <meta property="og:image" content="https://rejectfinancebill2025.lovable.app/lovable-uploads/083b054c-3c9f-4599-a171-93c958349839.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <main className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="container mx-auto py-6 px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img src="/lovable-uploads/083b054c-3c9f-4599-a171-93c958349839.png" alt="CEKA Logo" className="h-8 w-auto mr-2" />
                <h1 className="text-xl font-bold">Reject Finance Bill 2025</h1>
              </div>
              <InteractiveCountWidget />
            </div>
          </div>
        </header>

        <div className="container mx-auto py-12 px-4 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">What is the Finance Bill 2025?</h2>
              <p className="text-gray-700 dark:text-gray-300">
                The Finance Bill 2025 is a proposed law that outlines the government's revenue-raising measures for the upcoming fiscal year. It includes various tax amendments and economic policies that could significantly impact citizens and businesses.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Why should you object?</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Potential increase in the cost of living</li>
                <li>Negative impact on small businesses</li>
                <li>Concerns over tax fairness and equity</li>
                <li>Lack of public participation in the bill's formulation</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-700 shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">How to object (Article 118(1))</h2>
              <p className="text-gray-700 dark:text-gray-300">
                Article 118(1) of the Constitution guarantees the public's right to participate in the financial matters of the country. To object, you can:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Submit written objections to your Member of Parliament</li>
                <li>Participate in public forums and discussions</li>
                <li>Engage with civil society organizations</li>
                <li>Use social media to voice your concerns</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="bg-gray-200 dark:bg-gray-800 py-4">
          <div className="container mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">
              &copy; 2024 Civic Education Kenya (CEKA). All rights reserved.
            </p>
          </div>
        </footer>
      </main>
      
      {/* Dock */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <Dock items={dockItems} />
      </div>

      {/* Bills FAB (hidden when Bills popup is active) */}
      {!showBillsPopup && <BillsFAB />}
      
      {/* Share Button */}
      <ShareButton />
      
      {/* Scroll to Top */}
      <ScrollToTop />
      
      {/* User Count Sidebar */}
      <UserCountSidebar />
      
      {/* Dark Mode Toggle */}
      <DarkModeToggle />

      {/* Popups and Overlays */}
      <BillsDockPopup 
        isOpen={showBillsPopup} 
        onClose={() => setShowBillsPopup(false)} 
        originElement={billsButtonRef.current}
      />
      
      <OfflineRadioSystem 
        isOpen={showOfflineRadio} 
        onClose={() => setShowOfflineRadio(false)} 
      />
      
      <EmergencyReportingSystem 
        isOpen={showEmergencySystem} 
        onClose={() => setShowEmergencySystem(false)} 
      />
      
      <DonationWidget 
        isOpen={showDonationWidget} 
        onClose={() => setShowDonationWidget(false)} 
        originElement={supportButtonRef.current}
      />
    </>
  );
};

export default Index;
