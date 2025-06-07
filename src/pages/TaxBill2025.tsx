import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Radio, FileText, Heart, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Dock from '../components/Dock';
import DonationWidget from '../components/DonationWidget';
import EmergencyReportingSystem from '../components/EmergencyReportingSystem';
import Aurora from '../components/Aurora';
import RotatingText from '../components/RotatingText';
import { JoyrideTour } from '../components/JoyrideTour';
import { FloatingActionButtons } from '../components/FloatingActionButtons';
import UserCountSidebar from '../components/UserCountSidebar';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { ClearModeToggle, ClearMode } from '../components/ClearModeToggle';
import ShareButton from '../components/ShareButton';
import { ScrollToTop } from '../components/ScrollToTop';
import { TourStarter } from '../components/TourStarter';
import { ScrollProgressTracker } from '../components/ScrollProgressTracker';
import { OfflineRadioSystem } from '../components/OfflineRadioSystem';

const TaxBill2025: React.FC = () => {
  const [showDonation, setShowDonation] = useState(false);
  const [showEmergencySystem, setShowEmergencySystem] = useState(false);
  const [showRadioSystem, setShowRadioSystem] = useState(false);
  const [clearMode, setClearMode] = useState<ClearMode>('normal');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInFirstSection, setIsInFirstSection] = useState(true);
  const [tourActive, setTourActive] = useState(false);

  const rotatingTexts = [
    "Object to the Tax Bill 2025",
    "Fight Unfair Taxation",
    "Protect Your Income",
    "Demand Tax Justice"
  ];

  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'content', label: 'Content' },
    { id: 'action', label: 'Action' }
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const dockItems = [
    {
      icon: <FileText className="h-6 w-6" />,
      label: "Bills",
      onClick: () => {},
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
      
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
      >
        <ArrowLeft className="h-6 w-6 text-gray-700 dark:text-gray-200" />
      </Link>

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
          onScrollToTop={scrollToTop}
          onRadioClick={() => setShowRadioSystem(true)}
        />
        <ShareButton />
        <ScrollToTop />
        <UserCountSidebar />
        <ScrollProgressTracker activeSection={sections[0]} sections={sections} />
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
            Object to the Tax Bill 2025
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The Tax Bill 2025 introduces punitive tax measures that will further burden ordinary Kenyans while failing to address tax avoidance by the wealthy. Stand up for fair taxation.
          </p>
        </motion.div>

        {/* Tax-specific issues */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Income Tax Rate Increases",
              description: "Higher tax brackets affecting middle-class earners and small business owners.",
              impact: "Reduces disposable income for working families"
            },
            {
              title: "PAYE Expansion",
              description: "Broader application of Pay-As-You-Earn tax to more income sources.",
              impact: "Increases tax burden on salaried employees"
            },
            {
              title: "Corporate Tax Loopholes",
              description: "Failure to address multinational tax avoidance schemes.",
              impact: "Shifts tax burden from corporations to individuals"
            },
            {
              title: "Turnover Tax Changes",
              description: "Modified turnover tax affecting small and medium enterprises.",
              impact: "Stifles entrepreneurship and business growth"
            },
            {
              title: "Capital Gains Tax",
              description: "Expanded capital gains tax on various asset transactions.",
              impact: "Discourages investment and economic growth"
            },
            {
              title: "Tax Compliance Costs",
              description: "Increased compliance requirements and penalties for taxpayers.",
              impact: "Creates additional burden on businesses and individuals"
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

        {/* Call to Action - Tax-specific */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-red-600 to-orange-600 rounded-xl p-8 text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Fight for Fair Taxation</h3>
          <p className="text-xl mb-6 text-red-100">
            Tax policy should promote equity and economic growth, not burden ordinary citizens. Join us in demanding fair tax reforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setShowEmergencySystem(true)}
              className="bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Report Concerns
            </button>
            <button className="bg-red-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors">
              Share This Message
            </button>
          </div>
        </motion.div>
      </section>

      {/* Dock */}
      <Dock
        items={dockItems}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
        panelHeight={68}
        magnification={70}
        distance={200}
      />

      {/* Modals and Widgets */}
      <DonationWidget isVisible={showDonation} onTimedOut={() => setShowDonation(false)} />
      
      <EmergencyReportingSystem 
        isOpen={showEmergencySystem} 
        onClose={() => setShowEmergencySystem(false)} 
      />
      
      <OfflineRadioSystem 
        isOpen={showRadioSystem} 
        onClose={() => setShowRadioSystem(false)} 
      />

      {/* Tour System */}
      <TourStarter onStartTour={() => setTourActive(true)} />
      <JoyrideTour 
        isActive={tourActive} 
        onComplete={() => setTourActive(false)}
        onSkip={() => setTourActive(false)}
      />
    </div>
  );
};

export default TaxBill2025;
