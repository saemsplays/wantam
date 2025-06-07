import React, { useState, useEffect, useRef } from "react";
import { FloatingActionButtons } from "../components/FloatingActionButtons";
import { ShareButton } from "../components/ShareButton";
import BillsFAB from "../components/BillsFAB";
import { DarkModeToggle } from "../components/DarkModeToggle";
import EmergencyReportingSystem from "../components/EmergencyReportingSystem";
import DonationWidget from "../components/DonationWidget";
import { OfflineRadioSystem } from "../components/OfflineRadioSystem";
import Aurora from "../components/Aurora";
import RotatingText from "../components/RotatingText";
import { ScrollToTop } from "../components/ScrollToTop";
import UserCountSidebar from "../components/UserCountSidebar";
import { ClearModeToggle, ClearMode } from "../components/ClearModeToggle";

const Index = () => {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [clearMode, setClearMode] = useState<ClearMode>('normal');
  const [scrollOpacity, setScrollOpacity] = useState(0);
  const firstSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (firstSectionRef.current) {
        const firstSectionHeight = firstSectionRef.current.offsetHeight;
        const scrollY = window.scrollY;
        
        // Calculate opacity based on scroll position relative to first section
        const opacity = Math.min(scrollY / firstSectionHeight, 1);
        setScrollOpacity(opacity);
        
        // Auto set ultra-clear mode when in first section
        if (scrollY < firstSectionHeight * 0.1) {
          setClearMode('ultra-clear');
        } else if (clearMode === 'ultra-clear' && scrollY > firstSectionHeight * 0.1) {
          setClearMode('normal');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [clearMode]);

  const getFloatingOpacity = () => {
    if (clearMode === 'ultra-clear') return 0;
    if (clearMode === 'clear') return 0.1;
    return Math.max(0.7 * scrollOpacity, 0.1);
  };

  const getFloatingInteractivity = () => {
    return clearMode !== 'ultra-clear';
  };

  const handleReportClick = () => {
    if (!getFloatingInteractivity()) return;
    setIsReportOpen(true);
  };

  const handleSupportClick = () => {
    if (!getFloatingInteractivity()) return;
    setIsDonationOpen(true);
  };

  const handleRadioClick = () => {
    if (!getFloatingInteractivity()) return;
    setIsRadioOpen(true);
  };

  const handleMenuClick = () => {
    // Handle menu functionality
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const rotatingTexts = [
    "Unite for Democracy",
    "Defend Our Rights", 
    "Fight for Justice",
    "Stand Together",
    "Protect Our Future"
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden">
      {/* Fixed Elements */}
      <DarkModeToggle />
      <ClearModeToggle onModeChange={setClearMode} />
      
      {/* Floating Action Buttons */}
      <div 
        style={{ 
          opacity: getFloatingOpacity(),
          pointerEvents: getFloatingInteractivity() ? 'auto' : 'none'
        }}
        className="transition-all duration-300"
      >
        <FloatingActionButtons
          onReportClick={handleReportClick}
          onSupportClick={handleSupportClick}
          onMenuClick={handleMenuClick}
          onScrollToTop={handleScrollToTop}
          onRadioClick={handleRadioClick}
          isReportOpen={isReportOpen}
        />
        <ShareButton />
        <BillsFAB />
      </div>

      {/* First Section with RotatingText */}
      <div ref={firstSectionRef} className="min-h-screen relative">
        <Aurora />
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-screen relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-kenyan-red via-kenyan-green to-kenyan-black">
              Reject Finance Bill 2025
            </h1>
            <RotatingText texts={rotatingTexts} />
            <p className="mt-6 text-lg md:text-xl text-gray-700 dark:text-gray-300">
              Join thousands of Kenyans in exercising your constitutional right to participate in the legislative process.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button className="px-8 py-3 bg-kenyan-red text-white rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
                Object Now
              </button>
              <button className="px-8 py-3 bg-kenyan-green text-white rounded-full font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the content */}
      <div className="relative z-10">
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
              Object to the Finance Bill 2025
            </h2>
            <div className="max-w-3xl mx-auto prose dark:prose-invert">
              <p>
                The Finance Bill 2025 proposes several controversial tax measures that will affect all Kenyans. As a citizen, you have the constitutional right under Article 118(1)(b) to participate in the legislative process.
              </p>
              <p>
                This platform helps you exercise that right by providing templates and direct submission channels to object to specific clauses of the bill.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Popups/Modals */}
      <EmergencyReportingSystem 
        isOpen={isReportOpen} 
        onClose={() => setIsReportOpen(false)} 
      />
      
      <DonationWidget 
        isVisible={isDonationOpen} 
        onTimedOut={() => setIsDonationOpen(false)} 
      />
      
      <OfflineRadioSystem 
        isOpen={isRadioOpen} 
        onClose={() => setIsRadioOpen(false)} 
      />

      <ScrollToTop />
      <UserCountSidebar />
    </div>
  );
};

export default Index;
