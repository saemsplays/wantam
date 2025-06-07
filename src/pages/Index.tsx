import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, Play, Pause, Volume2, VolumeX, Shield, Radio, Heart, Users, FileText, Wifi, Mail, Clock, Timer, Calendar, MapPin, AlertTriangle, MessageSquare, Zap, CheckCircle, Info, XCircle, ArrowDown, ChevronDown, ExternalLink, Download, Share2, Bell, Star, Sparkles, Flame, Target, BookOpen } from 'lucide-react';
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
import { BillsFAB } from '../components/BillsFAB';
import { BillsSidebar } from '../components/BillsSidebar';
import ToastNotification from '../components/ToastNotification';
import InteractiveCountWidget from '../components/InteractiveCountWidget';
import SplashScreen from '../components/SplashScreen';
import LetterGlitch from '../components/LetterGlitch';

const Index: React.FC = () => {
  const [showDonation, setShowDonation] = useState(false);
  const [showEmergencySystem, setShowEmergencySystem] = useState(false);
  const [showRadioSystem, setShowRadioSystem] = useState(false);
  const [clearMode, setClearMode] = useState<ClearMode>('normal');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInFirstSection, setIsInFirstSection] = useState(true);
  const [donationVisible, setDonationVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showBillsSidebar, setShowBillsSidebar] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const rotatingTexts = [
    "Object to the Finance Bill 2025",
    "Exercise your Constitutional Rights",
    "Demand Transparency in Governance",
    "Fight for Financial Justice"
  ];

  const sections = [
    { id: 'intro', label: 'Introduction' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'bills', label: 'Bills' }
  ];

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

  const scrollToNextSection = () => {
    const nextSection = document.querySelector('#features');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const dockItems = [
    {
      icon: <FileText className="h-6 w-6" />,
      label: "Bills",
      onClick: () => setShowBillsSidebar(true),
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

  const billCards = [
    {
      id: 'budget',
      title: 'Budget Bill 2025',
      description: 'Government budget allocation and transparency issues',
      status: 'Active',
      urgency: 'high',
      path: '/budget-2025',
      color: 'from-red-500 to-red-600',
      icon: <Target className="h-6 w-6" />
    },
    {
      id: 'tax',
      title: 'Tax Bill 2025',
      description: 'New taxation policies affecting citizens',
      status: 'Under Review',
      urgency: 'high',
      path: '/tax-2025',
      color: 'from-orange-500 to-red-500',
      icon: <Flame className="h-6 w-6" />
    },
    {
      id: 'investment',
      title: 'Investment Bill 2025',
      description: 'Foreign investment regulations and local impact',
      status: 'Proposed',
      urgency: 'medium',
      path: '/investment-2025',
      color: 'from-yellow-500 to-orange-500',
      icon: <Sparkles className="h-6 w-6" />
    },
    {
      id: 'digital',
      title: 'Digital Economy Bill 2025',
      description: 'Digital transformation and cyber regulations',
      status: 'Draft',
      urgency: 'medium',
      path: '/digital-2025',
      color: 'from-blue-500 to-purple-500',
      icon: <BookOpen className="h-6 w-6" />
    }
  ];

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      <Aurora />
      
      {/* Fixed Controls */}
      <DarkModeToggle />
      <ClearModeToggle currentMode={clearMode} onModeChange={setClearMode} />

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

      {/* First Section - Hero */}
      <section id="intro" className="min-h-screen flex items-center justify-center relative">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <RotatingText texts={rotatingTexts} />
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.8 }}
            onClick={scrollToNextSection}
            className="mt-12 p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 group"
          >
            <ChevronDown className="h-8 w-8 text-white group-hover:animate-bounce" />
          </motion.button>
        </div>
      </section>

      {/* Second Section - Features */}
      <section id="features" className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Powerful Civic Tools
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Exercise your constitutional rights with our comprehensive platform designed for effective civic participation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: <Shield className="h-8 w-8" />,
              title: "Emergency Reporting",
              description: "Report incidents and emergencies with instant alerts to relevant authorities"
            },
            {
              icon: <Radio className="h-8 w-8" />,
              title: "Offline Communication",
              description: "P2P mesh networking for communication during network outages"
            },
            {
              icon: <FileText className="h-8 w-8" />,
              title: "Bill Analysis",
              description: "Comprehensive analysis of government bills and their impact on citizens"
            },
            {
              icon: <Heart className="h-8 w-8" />,
              title: "Community Support",
              description: "Connect with like-minded citizens and support civic education initiatives"
            },
            {
              icon: <Wifi className="h-8 w-8" />,
              title: "Real-time Updates",
              description: "Live updates on political developments and civic participation opportunities"
            },
            {
              icon: <Users className="h-8 w-8" />,
              title: "Collective Action",
              description: "Organize and participate in peaceful demonstrations and civic activities"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
            >
              <div className="text-blue-600 dark:text-blue-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Third Section - About */}
      <section id="about" className="min-h-screen py-20 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              About <LetterGlitch text="CEKA" />
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              Civic Education Kenya App (CEKA) empowers citizens to actively participate in democratic processes through constitutional awareness, bill analysis, and civic engagement tools.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 mb-12"
          >
            {[
              { icon: <BookOpen />, title: "Educational", description: "Learn about your constitutional rights and civic duties" },
              { icon: <Users />, title: "Community", description: "Connect with fellow citizens for collective action" },
              { icon: <Shield />, title: "Secure", description: "Safe platform for expressing civic concerns" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Fourth Section - Bills Overview */}
      <section id="bills" className="min-h-screen py-20 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Active Bills 2025
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Review and object to bills that affect your daily life. Exercise your constitutional right to participate in governance.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {billCards.map((bill, index) => (
            <motion.div
              key={bill.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              <Link to={bill.path}>
                <div className={`bg-gradient-to-br ${bill.color} rounded-xl p-6 h-full hover:shadow-xl transition-all duration-300 hover:scale-[1.02] text-white relative`}>
                  <div className="absolute top-4 right-4">
                    {bill.icon}
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bill.urgency === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {bill.urgency === 'high' ? 'High Priority' : 'Medium Priority'}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white">
                        {bill.status}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{bill.title}</h3>
                    <p className="text-white/90 mb-4">{bill.description}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Learn More</span>
                    <ExternalLink className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button 
            onClick={() => setShowBillsSidebar(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            View All Bills
          </button>
        </motion.div>
      </section>

      {/* Interactive Count Widget */}
      <InteractiveCountWidget 
        isVisible={donationVisible} 
        onComplete={() => setDonationVisible(false)} 
      />

      {/* Dock */}
      <Dock
        items={dockItems}
        className="fixed bottom-4 left-1/2 transform -translate-x-1/2"
        panelHeight={68}
        magnification={70}
        distance={200}
      />

      {/* Bills FAB */}
      <div className="fixed left-4 bottom-20 z-50">
        <BillsFAB />
      </div>

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

      <ScrollProgressTracker activeSection={sections[0]} sections={sections} />

      <BillsSidebar isOpen={showBillsSidebar} onClose={() => setShowBillsSidebar(false)} />

      {/* Toast Notifications */}
      <AnimatePresence>
        {toastMessage && (
          <ToastNotification
            message={toastMessage}
            onClose={() => setToastMessage('')}
          />
        )}
      </AnimatePresence>

      {/* Tour System */}
      <TourStarter />
      <JoyrideTour />
    </div>
  );
};

export default Index;
