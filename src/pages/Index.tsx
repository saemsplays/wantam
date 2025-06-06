
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from '../components/CountUp';
import InteractiveCountWidget from '../components/InteractiveCountWidget';
import LetterGlitch from '../components/LetterGlitch';
import RotatingText from '../components/RotatingText';
import { ScrollProgressTracker } from '../components/ScrollProgressTracker';
import Dock from '../components/Dock';
import { FloatingActionButtons } from '../components/FloatingActionButtons';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { ShareButton } from '../components/ShareButton';
import { ScrollToTop } from '../components/ScrollToTop';
import SplashScreen from '../components/SplashScreen';
import EmergencyReportingSystem from '../components/EmergencyReportingSystem';
import { OfflineRadioSystem } from '../components/OfflineRadioSystem';
import DonationWidget from '../components/DonationWidget';

const Index = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [showEmergencyReport, setShowEmergencyReport] = useState(false);
  const [showOfflineRadio, setShowOfflineRadio] = useState(false);
  const [showDonation, setShowDonation] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'bills-section'];
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMenuClick = () => {
    // Scroll to bills section or handle menu logic
    const billsSection = document.getElementById('bills-section');
    if (billsSection) {
      billsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sections = [
    { id: 'hero', title: 'Introduction', position: 0 },
    { id: 'bills-section', title: 'Understanding Bills', position: 50 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-x-hidden">
      <SplashScreen />
      <ScrollProgressTracker activeSection={activeSection} sections={sections} />
      <DarkModeToggle />
      <ShareButton />
      <ScrollToTop />
      
      {/* Mobile-specific FABs */}
      {isMobile && (
        <FloatingActionButtons
          onReportClick={() => setShowEmergencyReport(true)}
          onSupportClick={() => setShowDonation(true)}
          onMenuClick={handleMenuClick}
          onScrollToTop={scrollToTop}
          onRadioClick={() => setShowOfflineRadio(true)}
          isMobile={isMobile}
        />
      )}

      {/* Desktop-specific FABs */}
      {!isMobile && (
        <FloatingActionButtons
          onReportClick={() => setShowEmergencyReport(true)}
          onSupportClick={() => setShowDonation(true)}
          onMenuClick={handleMenuClick}
          onScrollToTop={scrollToTop}
          isMobile={isMobile}
        />
      )}

      
      
      <main className="relative z-10">
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex items-center justify-center px-4 pt-16 pb-8">
          <div className="max-w-6xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-red-600 via-orange-500 to-green-600 bg-clip-text text-transparent">
                  Reject Finance Bill
                </span>
                <br />
                <LetterGlitch
                  glitchColors={['#ef4444', '#f97316', '#22c55e']}
                  glitchSpeed={3}
                  centerVignette={false}
                  outerVignette={false}
                  smooth={true}
                />
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Exercise your constitutional rights under Article 118(1). 
                Join thousands of Kenyans in making your voice heard through 
                <span className="font-semibold text-blue-600 dark:text-blue-400"> public participation</span>.
              </p>
              
              <RotatingText texts={[
                "Your Voice Matters",
                "Exercise Democracy", 
                "Reject Finance Bill 2025",
                "Public Participation Rights"
              ]} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            >
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-red-600 mb-2">
                  <CountUp target={57} duration={2000} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Reports Submitted</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                  <CountUp target={1450} duration={2000} />
                </div>
                <p className="text-gray-600 dark:text-gray-400">Active Participants</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  30%
                </div>
                <p className="text-gray-600 dark:text-gray-400">Implementation Progress</p>
              </div>
            </motion.div>

            <InteractiveCountWidget />
          </div>
        </section>

        {/* Bills Section */}
        <section id="bills-section" className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                Understanding the Bills
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Get informed about the proposed legislation and understand how it affects you and your community.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Finance Bill", color: "from-red-500 to-orange-500", link: "/" },
                { title: "Budget Bill", color: "from-blue-500 to-purple-500", link: "/budget-bill-2025" },
                { title: "Tax Laws", color: "from-green-500 to-teal-500", link: "/tax-bill-2025" },
                { title: "Investment", color: "from-purple-500 to-pink-500", link: "/investment-bill-2025" }
              ].map((bill, index) => (
                <motion.a
                  key={bill.title}
                  href={bill.link}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${bill.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  <div className="relative p-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                      {bill.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Learn about the key provisions and their impact on Kenya's economy and citizens.
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                      Read More 
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-red-600 to-green-600">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Your Voice Matters
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Democracy thrives when citizens actively participate. Exercise your constitutional right to be heard.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-red-600 px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowEmergencyReport(true)}
              >
                Submit Your Objection
              </motion.button>
            </motion.div>
          </div>
        </section>
      </main>

      <Dock 
        isMobile={isMobile}
        onRadioClick={() => setShowOfflineRadio(true)}
        onSupportClick={() => setShowDonation(true)}
      />
      
      <EmergencyReportingSystem 
        isOpen={showEmergencyReport} 
        onClose={() => setShowEmergencyReport(false)} 
      />
      
      <OfflineRadioSystem 
        isOpen={showOfflineRadio} 
        onClose={() => setShowOfflineRadio(false)} 
      />
      
      <DonationWidget 
        isVisible={showDonation} 
        onClose={() => setShowDonation(false)} 
      />
    </div>
  );
};

export default Index;
