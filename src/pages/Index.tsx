
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, FileText, Heart, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Aurora from '../components/Aurora';
import RotatingText from '../components/RotatingText';
import { JoyrideTour } from '../components/JoyrideTour';
import { FloatingActionButtons } from '../components/FloatingActionButtons';
import { OfflineRadioSystem } from '../components/OfflineRadioSystem';
import EmergencyReportingSystem from '../components/EmergencyReportingSystem';
import DonationWidget from '../components/DonationWidget';
import { TourStarter } from '../components/TourStarter';
import { BillsDockPopup } from '../components/BillsDockPopup';
import { ClearModeToggle, ClearMode } from '../components/ClearModeToggle';
import UserCountSidebar from '../components/UserCountSidebar';
import { BillsFAB } from '../components/BillsFAB';
import ShareButton from '../components/ShareButton';
import { ScrollToTop } from '../components/ScrollToTop';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { ScrollProgressTracker } from '../components/ScrollProgressTracker';
import Dock from '../components/Dock';

const Index: React.FC = () => {
  const [showDonation, setShowDonation] = useState(false);
  const [showEmergencySystem, setShowEmergencySystem] = useState(false);
  const [showRadioSystem, setShowRadioSystem] = useState(false);
  const [showBillsPopup, setShowBillsPopup] = useState(false);
  const [clearMode, setClearMode] = useState<ClearMode>('normal');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInFirstSection, setIsInFirstSection] = useState(true);

  const rotatingTexts = [
    "Object to the Finance Bill 2025",
    "Defend the Constitution",
    "Protect Kenyan Rights",
    "Demand Civic Education"
  ];

  // Handle scroll for opacity control
  useEffect(() => {
    const handleScroll = () => {
      const firstSectionHeight = window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.min(scrollY / firstSectionHeight, 1);
      
      setScrollProgress(progress);
      setIsInFirstSection(scrollY < firstSectionHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate opacity based on clear mode and scroll position
  const getElementOpacity = () => {
    if (isInFirstSection) return 0;
    
    const baseOpacity = Math.min(scrollProgress * 2, 1);
    
    switch (clearMode) {
      case 'clear': return baseOpacity * 0.1;
      case 'ultra-clear': return 0;
      default: return baseOpacity;
    }
  };

  const getElementInteractivity = () => {
    if (isInFirstSection || clearMode === 'ultra-clear') return 'none';
    return 'auto';
  };

  const dockItems = [
    {
      icon: <FileText className="h-6 w-6" />,
      label: "Bills",
      onClick: () => setShowBillsPopup(true),
      className: "dock-item-bills"
    },
    {
      icon: <Radio className="h-6 w-6" />,
      label: "Radio",
      onClick: () => setShowRadioSystem(true),
      className: "dock-item-radio"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      label: "Emergency",
      onClick: () => setShowEmergencySystem(true),
      className: "dock-item-emergency"
    },
    {
      icon: <Heart className="h-6 w-6" />,
      label: "Support",
      onClick: () => setShowDonation(true),
      className: "dock-item-support"
    },
    {
      icon: <Users className="h-6 w-6" />,
      label: "Share",
      onClick: () => {},
      className: "dock-item-share"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <Aurora />
      
      {/* Fixed Controls */}
      <DarkModeToggle />
      <ClearModeToggle currentMode={clearMode} onModeChange={setClearMode} />
      
      {/* Back to Bill Menu */}
      <BillsFAB />

      {/* Floating Elements with opacity control */}
      <div 
        style={{ 
          opacity: getElementOpacity(),
          pointerEvents: getElementInteractivity()
        }}
        className="transition-opacity duration-500"
      >
        <FloatingActionButtons 
          onReportClick={() => setShowEmergencySystem(true)}
          onSupportClick={() => setShowDonation(true)}
          onMenuClick={() => {}}
          onScrollToTop={() => window.scrollTo(0, 0)}
        />
        <ShareButton />
        <ScrollToTop />
        <UserCountSidebar />
      </div>

      {/* First Section */}
      <section className="min-h-screen flex items-center justify-center relative">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <RotatingText texts={rotatingTexts} />
        </div>
      </section>

      {/* Main Content */}
      <section className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Object to the Finance Bill 2025
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The Finance Bill 2025 introduces punitive tax measures that will further burden ordinary Kenyans while failing to address tax avoidance by the wealthy. Stand up for fair taxation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Increased Taxes",
              description: "The bill proposes increases in various taxes, including VAT and income tax.",
              impact: "Higher cost of living for ordinary citizens"
            },
            {
              title: "Fuel Levy Hike",
              description: "A significant increase in the fuel levy, impacting transportation and energy costs.",
              impact: "Increased transportation costs and inflation"
            },
            {
              title: "Housing Fund Contribution",
              description: "Mandatory contributions to the National Housing Development Fund.",
              impact: "Reduced disposable income for workers"
            },
            {
              title: "Digital Service Tax",
              description: "Taxation of digital services, potentially affecting access to online platforms.",
              impact: "Increased costs for digital services"
            },
            {
              title: "Healthcare Levy",
              description: "New healthcare levy, adding to the financial burden on citizens.",
              impact: "Increased healthcare costs for households"
            },
            {
              title: "Excise Duty Expansion",
              description: "Expansion of excise duties to cover more goods and services.",
              impact: "Higher prices for consumer goods"
            }
          ].map((issue, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-xl font-bold mb-3 text-red-600 dark:text-red-400">{issue.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{issue.description}</p>
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  <strong>Impact:</strong> {issue.impact}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Take Action Against Unfair Taxation</h3>
          <p className="text-xl mb-6 text-red-100">
            The Finance Bill 2025 will disproportionately affect low-income Kenyans. We must stand together to demand a fairer tax system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/emergency"
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Report Concerns
            </Link>
            <button className="bg-red-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors">
              Share This Message
            </button>
          </div>
        </motion.div>
      </section>

      <BillsDockPopup isOpen={showBillsPopup} onClose={() => setShowBillsPopup(false)} originElement={null} />

      <Dock
        items={dockItems}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
        panelHeight={68}
        magnification={70}
        distance={200}
      />

        <DonationWidget isVisible={showDonation} onTimedOut={() => setShowDonation(false)} />
        
        <EmergencyReportingSystem 
          isOpen={showEmergencySystem} 
          onClose={() => setShowEmergencySystem(false)} 
        />
        
        <OfflineRadioSystem 
          isOpen={showRadioSystem} 
          onClose={() => setShowRadioSystem(false)} 
        />

        <ScrollProgressTracker 
          activeSection="hero" 
          sections={["hero", "about", "action"]} 
        />

      <TourStarter onStartTour={() => {}} />
      <JoyrideTour 
        isActive={false}
        onComplete={() => {}}
        onSkip={() => {}}
      />
    </div>
  );
};

export default Index;
