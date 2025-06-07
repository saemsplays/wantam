
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

const BudgetBill2025: React.FC = () => {
  const [showDonation, setShowDonation] = useState(false);
  const [showEmergencySystem, setShowEmergencySystem] = useState(false);
  const [showRadioSystem, setShowRadioSystem] = useState(false);
  const [clearMode, setClearMode] = useState<ClearMode>('normal');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInFirstSection, setIsInFirstSection] = useState(true);

  const rotatingTexts = [
    "Object to the Budget Bill 2025",
    "Demand Financial Transparency",
    "Protect Public Resources",
    "Ensure Fiscal Responsibility"
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
          onScrollToTop={() => window.scrollTo(0, 0)}
        />
        <ShareButton />
        <ScrollToTop />
        <UserCountSidebar />
        <ScrollProgressTracker 
          activeSection="hero" 
          sections={["hero", "about", "action"]} 
        />
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
            Object to the Budget Bill 2025
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            The Budget Bill 2025 proposes measures that will increase the tax burden on ordinary Kenyans while failing to address corruption and wasteful spending. We must demand a budget that serves the people.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Increased Taxes",
              description: "The bill introduces new taxes and increases existing ones, placing a heavier burden on citizens.",
              impact: "Reduces disposable income and increases the cost of living."
            },
            {
              title: "Lack of Transparency",
              description: "The budget process lacks transparency, making it difficult for citizens to understand how funds are allocated.",
              impact: "Undermines accountability and public trust."
            },
            {
              title: "Corruption Concerns",
              description: "The bill does not address corruption, leading to concerns about misuse of public funds.",
              impact: "Diverts resources away from essential services and development projects."
            },
            {
              title: "Wasteful Spending",
              description: "The budget includes allocations for non-essential projects and wasteful spending, diverting funds from critical areas.",
              impact: "Reduces the effectiveness of public spending and hinders development."
            },
            {
              title: "Debt Accumulation",
              description: "The bill increases borrowing, leading to unsustainable debt levels and future financial instability.",
              impact: "Threatens the country's long-term economic health."
            },
            {
              title: "Inequitable Distribution",
              description: "The budget does not address income inequality, exacerbating the gap between the rich and the poor.",
              impact: "Perpetuates poverty and social injustice."
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
          <h3 className="text-3xl font-bold mb-4">Demand a People's Budget</h3>
          <p className="text-xl mb-6 text-red-100">
            We must ensure that the budget reflects the needs and priorities of all Kenyans, not just a select few. Join us in demanding a fair and equitable budget.
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

      <TourStarter onStartTour={() => {}} />
      <JoyrideTour 
        isActive={false}
        onComplete={() => {}}
        onSkip={() => {}}
      />
    </div>
  );
};

export default BudgetBill2025;
