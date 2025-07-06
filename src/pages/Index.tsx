import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mail, FileText, CheckCircle, User, AlertTriangle, Shield, Scale, Users, Play, RotateCcw, ArrowUpRight, Home, Archive, Settings, HelpCircle, Lightbulb, Heart, Flag, ExternalLink, Radio } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollProgressTracker } from '../components/ScrollProgressTracker';
import { SimpleTour } from '../components/SimpleTour';
import { TourStarter } from '../components/TourStarter';
import { BillsSidebar } from '../components/BillsSidebar';
import DonationWidget from '../components/DonationWidget';
import Dock from '../components/Dock';
import InteractiveCountWidget from '../components/InteractiveCountWidget';
import Aurora from '../components/Aurora';
import RotatingText from '../components/RotatingText';
import SplashScreen from '../components/SplashScreen';
import EmergencyReportingSystem from '../components/EmergencyReportingSystem';
import BillsFAB from '../components/BillsFAB';
import { ScrollToTop } from '../components/ScrollToTop';
import { FloatingActionButtons } from '../components/FloatingActionButtons';
import { DarkModeToggle } from '../components/DarkModeToggle';
import { ExternalRadioWindow } from '../components/ExternalRadioWindow';
import { ShareButton } from '../components/ShareButton';
import { BillsDockPopup } from '../components/BillsDockPopup';
import { Home as HomeIcon, Archive as ArchiveIcon, Settings as SettingsIcon, HelpCircle as HelpCircleIcon, Lightbulb as LightbulbIcon, Heart as HeartIcon, Flag as FlagIcon, ExternalLink as ExternalLinkIcon, Radio as RadioIcon, FileText as FileTextIcon, Users as UsersIcon } from "lucide-react";
import { TemplateCreator } from '../components/TemplateCreator';

const Index = () => {
  const [userName, setUserName] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState({
    clerk: true,
    financeCommittee: true
  });

  const [subject, setSubject] = useState(
    'RE: MEMORANDUM OF OBJECTION TO THE FINANCE BILL 2025 (NATIONAL ASSEMBLY BILLS NO. 19 OF 2025)'
  );
  const [messageBody, setMessageBody] = useState(`Dear Clerk of the National Assembly and Members of the Finance Committee,

The above subject refers;

Following the invitation by the National Assembly to submit comments on the above. Recognizing the Sovereignty of the People and Supremacy of the Constitution as under Chapter 1 of the Constitution of Kenya 2010, Rights and Fundamental Freedoms as provided under Chapter 4 of the Bill of Rights, Leadership and Integrity of State Officers as under Chapter 6, the Role of the Legislature under Chapter 8.

Pursuant to Articles 10(2), 118(1) of the Constitution 2010 that mandates Public Participation in any Legislative Process I wish to submit my Memoranda as follows:

1. REJECTION OF SECTION A, PART I OF THE 1ST SCHEDULE OF THE VALUE ADDED TAX ACT

This amendment is incompatible with the economic and social rights guaranteed under Article 43 of the Constitution of Kenya 2010.
Removing zero-rated status from essential goods will increase the cost of living and disproportionately burden low-income households.
The agricultural sector, a key economic driver, will be negatively affected, harming Kenyan households that rely on agriculture for income.

2. REJECTION OF AMENDMENTS TO SECTIONS 2 & 5 OF THE EXCISE DUTY ACT

These amendments violate the non-discrimination protections under Article 27 of the Constitution of Kenya 2010.
Expanding digital lending tax to include services offered by non-resident persons over the internet will adversely affect Kenyans who depend on digital loans for essential expenses.
While aiming to create fair competition, these changes will increase borrowing costs, making credit less accessible and leading to financial exclusion for low and middle-income Kenyans.

3. REJECTION OF AMENDMENTS TO SECTION 59A OF THE TAX PROCEDURES ACT

The deletion of subsection 1B is unconstitutional as it infringes on the right to privacy guaranteed under Article 31 of the Constitution of Kenya 2010.
This amendment would grant the Commissioner unrestricted authority to access personal and private data, including M-Pesa financial records, without necessary safeguards.
There are inadequate protections against potential overreach by the Kenya Revenue Authority, creating a risk of unauthorized access to citizens' private financial information.

In conclusion, I call for the withdrawal of this Bill as it is made in Bad Faith, ignorant to the Current Economic Needs and Political Wills of the People of Kenya, Will Entrench the Abuse of Power by the Revenue Authorities, A Dubious Attempt to Sneak in Tyranny, Reinforce Poverty, Promote Marginalization and at the end of it Will Deny Kenyans the Transformative Agenda of Vision 2030. I thus pray that you Reject it for the sake of a better Kenya.

Yours Faithfully,

[USER_NAME_PLACEHOLDER]

Citizen of Kenya`);

  const [userCount, setUserCount] = useState({ viewers: 0, emailsSent: 0 });
  const [showFullCount, setShowFullCount] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDonationWidgetVisible, setIsDonationWidgetVisible] = useState(false);
  
  // Tour state
  const [showTour, setShowTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);

  // New state for floating action buttons
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Bills dock popup state
  const [billsDockOpen, setBillsDockOpen] = useState(false);
  const [billsDockOrigin, setBillsDockOrigin] = useState<HTMLElement | null>(null);

  // Template Creator modal state
  const [isTemplateCreatorOpen, setIsTemplateCreatorOpen] = useState(false);

  // Section definitions with updated percentages including Introduction
  const sections = [
    { id: 'hero', title: 'Introduction', position: 21.52 },
    { id: 'details', title: 'Your Details', position: 44 },
    { id: 'recipients', title: 'Send To', position: 53 },
    { id: 'subject', title: 'Email Subject', position: 60 },
    { id: 'letter', title: 'Your Objection Letter', position: 73 },
    { id: 'send', title: 'Ready To Submit Your Objection?', position: 96 }
  ];

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.rpc('increment_user_action', { action_type_param: 'page_view' });
        console.log('Page view tracked successfully');
      } catch (error) {
        console.error('Error tracking page view:', error);
      }
    };

    trackPageView();
  }, []);

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
          console.log('Fetched counts:', data);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const tourSeen = localStorage.getItem('finance-bill-tour-seen');
    if (tourSeen) {
      setHasSeenTour(true);
    }
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTourComplete = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('finance-bill-tour-seen', 'true');
  };

  const handleTourSkip = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('finance-bill-tour-seen', 'true');
  };

  const startTour = () => {
    setShowTour(true);
  };

  const restartTour = () => {
    setShowTour(true);
  };

  const recipients = {
    clerk: {
      name: "Clerk of the National Assembly",
      email: "cna@parliament.go.ke"
    },
    financeCommittee: {
      name: "Finance Committee of the National Assembly", 
      email: "financecommitteena@parliament.go.ke"
    }
  };

  const handleRecipientChange = (recipient: string, checked: boolean) => {
    setSelectedRecipients(prev => ({
      ...prev,
      [recipient]: checked
    }));
  };

  const getSelectedRecipientEmails = () => {
    const emails: string[] = [];
    if (selectedRecipients.clerk) emails.push(recipients.clerk.email);
    if (selectedRecipients.financeCommittee) emails.push(recipients.financeCommittee.email);
    return emails;
  };

  const isDesktop = () => {
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const handleSendEmail = async () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name to complete the objection letter",
        variant: "destructive"
      });
      return;
    }

    if (!selectedRecipients.clerk && !selectedRecipients.financeCommittee) {
      toast({
        title: "Select Recipients",
        description: "Please select at least one recipient",
        variant: "destructive"
      });
      return;
    }

    try {
      await supabase.rpc('increment_user_action', { action_type_param: 'email_sent' });
      console.log('Email sent action tracked successfully');
    } catch (error) {
      console.error('Error tracking email sent:', error);
    }

    const selectedEmails = getSelectedRecipientEmails();
    const to = selectedEmails.join(',');
    const encodedSubject = encodeURIComponent(subject);
    const personalizedMessage = messageBody.replace('[USER_NAME_PLACEHOLDER]', userName.trim());
    const encodedBody = encodeURIComponent(personalizedMessage);
    
    if (isDesktop()) {
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodedSubject}&body=${encodedBody}`;
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodedSubject}&body=${encodedBody}`;
      
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (userAgent.includes('chrome') || userAgent.includes('edge')) {
        window.open(gmailUrl, '_blank');
      } else if (userAgent.includes('outlook') || userAgent.includes('office')) {
        window.open(outlookUrl, '_blank');
      } else {
        window.location.href = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
      }
    } else {
      const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
      window.location.href = mailtoLink;
    }
    
    toast({
      title: "Opening Your Email App",
      description: "Your objection letter is ready to send! Review and click send in your email app.",
    });
  };

  // Floating action button handlers
  const handleReportClick = () => {
    setIsReportingOpen(prev => !prev);
  };

  const handleSupportClick = () => {
    const donationButton = document.querySelector('[data-donation-trigger]') as HTMLElement;
    if (donationButton) {
      donationButton.click();
    }
  };

  const handleDockSupportClick = handleSupportClick;

  // Add the close handler
  const handleCloseDonationWidget = () => {
    setIsDonationWidgetVisible(false);
  };

  const handleMenuClick = () => {
    document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRadioClick = () => {
    setIsRadioOpen(true);
  };

  const handleBillsClick = () => {
    // Use the same navigation as BillsFAB
    setBillsDockOrigin(document.activeElement as HTMLElement);
    setBillsDockOpen(true);
  };

  const totalUsers = userCount.viewers + userCount.emailsSent;
  const shouldShowCounter = totalUsers >= 1000;
  
  const displayCount = showFullCount
    ? totalUsers.toLocaleString()
    : `${Math.round(totalUsers / 1000)}K+`;
  

  const stats = [
    { icon: Shield, label: "Constitutional Articles", value: "Art 33, Art 35, Art 118(1)" },
    { icon: Scale, label: "Legal Foundation", value: "Constitution of Kenya 2010" },
    { icon: Users, label: "Public Participation", value: "Mandated by Art 118(1)" }
  ];

  useEffect(() => {
    window.scrollTo(0, window.innerHeight * 0.02);
  }, []);

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
      label: 'Reject',
      onClick: () => {
        const el = document.getElementById('details');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    },
    {
      icon: <FileTextIcon size={18} />,
      label: 'Template',
      onClick: () => setIsTemplateCreatorOpen(true)
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <SplashScreen />
      
      <DarkModeToggle />

      <ShareButton />
      
      <SimpleTour
        isActive={showTour}
        onComplete={handleTourComplete}
        onSkip={handleTourSkip}
      />

      <ScrollProgressTracker
        activeSection={activeSection}
        sections={sections}
      />

      <div className={`transition-all duration-500 ${activeSection === 'hero' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <BillsSidebar />
      </div>

      <InteractiveCountWidget />

      <DonationWidget />

      <EmergencyReportingSystem 
        isOpen={isReportingOpen} 
        onClose={() => setIsReportingOpen(false)} 
      />

      <ExternalRadioWindow
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
      />

      <BillsDockPopup 
        isOpen={billsDockOpen}
        onClose={() => setBillsDockOpen(false)}
        originElement={billsDockOrigin}
      />

      <ScrollToTop />

      <BillsFAB />

      <TemplateCreator 
        isOpen={isTemplateCreatorOpen}
        onClose={() => setIsTemplateCreatorOpen(false)}
        initialData={{
          title: 'Finance Bill 2025 Objection Template',
          body: messageBody,
          subject: subject
        }}
      />

      <section className="h-screen relative overflow-hidden">
        <Aurora
          colorStops={["#000000", "#DC143C", "#006400"]}
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-4 text-2xl sm:text-4xl md:text-6xl font-bold">
            <span className="text-red-600">Siri Ni</span>
            <div className="px-4 sm:px-6 md:px-8 bg-gradient-to-r from-green-600 to-red-600 dark:from-green-500 dark:to-red-500 text-white overflow-hidden py-2 sm:py-3 md:py-4 justify-center rounded-lg">
              <RotatingText
                texts={["Kuwa Organised", "Kuwa Informed","Numbers", "Kuinject", "Kupiga Kelele", "Saba Saba"]}
                durations={[3000, 3000, 5000, 3000, 3000, 7000]}
                staggerFrom="last"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-1 sm:pb-2 md:pb-3"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              />
            </div>
          </div>
        </div>
      </section>

      <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-green-600/5 dark:from-red-500/10 dark:via-transparent dark:to-green-500/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 ${
              shouldShowCounter 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              <AlertTriangle className="h-5 w-5" />
              {shouldShowCounter ? (
                <span 
                  onClick={() => setShowFullCount(!showFullCount)}
                  className="cursor-pointer"
                >
                  As used by {displayCount} citizens
                </span>
              ) : (
                'Action Required: Share your voice. Your constitutional right protects it.'
              )}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Object to the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 dark:from-red-400 dark:to-green-400">
                Finance Bill 2025
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Exercise your constitutional right to participate in legislative processes.
              Submit your formal objection to protect essential goods and privacy rights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-6 shadow-sm"
                >
                  <div className="flex flex-col items-center gap-2 mb-2 text-center">
                    <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg flex-shrink-0">
                      <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-xs md:text-base leading-tight">{stat.label}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center leading-tight">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 max-w-4xl mx-auto">
              {!hasSeenTour && !showTour && (
                <TourStarter onStartTour={startTour} />
              )}

              {hasSeenTour && (
                <button
                  onClick={restartTour}
                  className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium transition-colors"
                  title="Restart tour"
                >
                  <Play className="h-3 w-3" />
                  Restart Tour
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-gradient-to-r from-red-600 to-green-600 dark:from-red-500 dark:to-green-500 border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
                        <Scale className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">Finance Bill GPT</h3>
                        <p className="text-sm text-white/90 mb-4">
                          Get instant answers about the Finance Bill 2025 from the 'Finance Bill GPT' AI assistant.
                        </p>
                        <a
                          href="https://chatgpt.com/g/g-681270efebe08191ad509259b304815b-2025-finance-bill-gpt"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 hover:bg-white/90 rounded-lg text-sm font-medium transition-colors"
                        >
                          Ask Assistant
                          <ArrowUpRight className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 border-gray-200 dark:border-gray-700 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-white/20 p-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-2">Use Our App</h3>
                        <p className="text-sm text-white/90 mb-4">
                          Get the #RejectFinanceBill app on your device and amplify your voice, on the go!
                        </p>
                        <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = "https://juzqumvamllubshomuge.supabase.co/storage/v1/object/sign/apps/Signed%20APK%20-%20Prod%20Ready/RFB254%20by%20CEKA.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZThlZDg5OC05N2JkLTRhNmEtYjUwZS0zMTU5M2U4NmMwOTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcHBzL1NpZ25lZCBBUEsgLSBQcm9kIFJlYWR5L1JGQjI1NCBieSBDRUtBLmFwayIsImlhdCI6MTc0OTA2Mjg3OSwiZXhwIjoxNzgwNTk4ODc5fQ.qS2msdBAlUVLX6XYBwNe7ErBYiRyEqZIterdv1Gjo1M";
                            link.download = "RFB254-by-CEKA.apk";
                            link.click();
                          }}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 hover:bg-white/90 rounded-lg text-sm font-medium transition-colors"
                          >
                          Download Here
                          <ArrowUpRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        
        <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-blue-900/30 dark:to-emerald-900/30 border-blue-200 dark:border-blue-700">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 dark:bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                    <span className="text-gray-700 dark:text-gray-300">Enter your name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 dark:bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                    <span className="text-gray-700 dark:text-gray-300">Review your letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 dark:bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                    <span className="text-gray-700 dark:text-gray-300">Open and send via your email</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <section id="details" className={`transition-all duration-700 ${
          activeSection === 'details' ? 'relative z-30 scale-[1.02]' : 'relative z-20'
        }`}>
         <Card className="group border-2 border-dashed border-blue-300 dark:border-blue-600 bg-blue-50/30 dark:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/30 hover:shadow-lg hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 transition-all duration-300 ease-out hover:scale-[1.01]">
  <CardHeader className="group-hover:bg-blue-50/40 dark:group-hover:bg-blue-800/20 transition-colors duration-300 rounded-t-lg">
    <CardTitle className="flex items-center gap-3">
      <div className="bg-blue-600 dark:bg-blue-500 p-2 rounded-lg group-hover:bg-blue-700 dark:group-hover:bg-blue-400 group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
        <User className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <span className="text-gray-900 dark:text-white group-hover:text-blue-900 dark:group-hover:text-blue-100 transition-colors duration-300">
        Your Details
      </span>
    </CardTitle>
    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
      Only your name is required to prefill the objection letter
    </p>
  </CardHeader>
  
  <CardContent className="group-hover:bg-gradient-to-br group-hover:from-blue-50/20 group-hover:to-transparent dark:group-hover:from-blue-800/10 dark:group-hover:to-transparent transition-all duration-300">
    <div className="space-y-4">
      <div className="relative">
        <Label 
          htmlFor="userName" 
          className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors duration-300"
        >
          Full Name *
        </Label>
        <div className="relative">
          <Input
            id="userName"
            type="text"
            placeholder="Enter your full name as it should appear in the letter"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="text-lg py-3 border-2 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20 group-hover:bg-white/50 dark:group-hover:bg-gray-700/50"
          />
          {/* Subtle glow effect on hover */}
          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400/0 via-blue-400/5 to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
      
      <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-lg p-3 text-emerald-900 dark:text-emerald-300 text-sm group-hover:bg-emerald-100/80 dark:group-hover:bg-emerald-800/40 group-hover:border-emerald-300 dark:group-hover:border-emerald-600 group-hover:shadow-sm transition-all duration-300">
        <p className="group-hover:text-emerald-800 dark:group-hover:text-emerald-200 transition-colors duration-300">
          <strong className="group-hover:text-emerald-900 dark:group-hover:text-emerald-100 transition-colors duration-300">
            Privacy & Anonymity Notice:
          </strong> This site collects <u>no</u> personal data. 
          All inputs remain on your device until you click "Send." 
          You may use a pseudonym or initials if desired.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
        </section>

        <section id="recipients" className={`transition-all duration-700 ${
          activeSection === 'recipients' ? 'relative z-30 scale-[1.02]' : 'relative z-20'
        }`}>
         <Card className="group dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/20 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 ease-out hover:scale-[1.005]">
  <CardHeader className="group-hover:bg-emerald-50/30 dark:group-hover:bg-emerald-900/20 transition-colors duration-300 rounded-t-lg">
    <CardTitle className="flex items-center gap-3">
      <div className="bg-emerald-600 dark:bg-emerald-500 p-2 rounded-lg group-hover:bg-emerald-700 dark:group-hover:bg-emerald-400 group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
        <Mail className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <span className="text-gray-900 dark:text-white group-hover:text-emerald-900 dark:group-hover:text-emerald-100 transition-colors duration-300">
        Send To
      </span>
    </CardTitle>
    <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
      Select who should receive your objection letter
    </p>
  </CardHeader>
  
  <CardContent className="group-hover:bg-gradient-to-br group-hover:from-emerald-50/10 group-hover:to-transparent dark:group-hover:from-emerald-800/5 dark:group-hover:to-transparent transition-all duration-300">
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 hover:shadow-md hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/20 transition-all duration-300 hover:scale-[1.02] group/item">
          <Checkbox
            id="clerk"
            checked={selectedRecipients.clerk}
            onCheckedChange={(checked) => handleRecipientChange('clerk', checked as boolean)}
            className="mt-1 group-hover/item:border-emerald-400 transition-colors duration-300"
          />
          <Label htmlFor="clerk" className="flex-1 cursor-pointer">
            <div className="font-semibold text-gray-900 dark:text-white group-hover/item:text-emerald-900 dark:group-hover/item:text-emerald-100 transition-colors duration-300">
              {recipients.clerk.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 group-hover/item:text-gray-700 dark:group-hover/item:text-gray-300 transition-colors duration-300">
              {recipients.clerk.email}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300 group-hover/item:font-medium transition-all duration-300">
              ✓ Recommended
            </div>
          </Label>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
        
        <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-500 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 hover:shadow-md hover:shadow-emerald-500/10 dark:hover:shadow-emerald-400/20 transition-all duration-300 hover:scale-[1.02] group/item relative">
          <Checkbox
            id="financeCommittee"
            checked={selectedRecipients.financeCommittee}
            onCheckedChange={(checked) => handleRecipientChange('financeCommittee', checked as boolean)}
            className="mt-1 group-hover/item:border-emerald-400 transition-colors duration-300"
          />
          <Label htmlFor="financeCommittee" className="flex-1 cursor-pointer">
            <div className="font-semibold text-gray-900 dark:text-white group-hover/item:text-emerald-900 dark:group-hover/item:text-emerald-100 transition-colors duration-300">
              {recipients.financeCommittee.name}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 group-hover/item:text-gray-700 dark:group-hover/item:text-gray-300 transition-colors duration-300">
              {recipients.financeCommittee.email}
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300 group-hover/item:font-medium transition-all duration-300">
              ✓ Recommended
            </div>
          </Label>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/0 via-emerald-400/5 to-emerald-400/0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
        </section>

        <section id="subject" className={`transition-all duration-700 ${
          activeSection === 'subject' ? 'relative z-30 scale-[1.02]' : 'relative z-20'
        }`}>
          <Card className="group dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:shadow-purple-500/10 dark:hover:shadow-purple-400/20 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 ease-out hover:scale-[1.005]">
  <CardHeader className="group-hover:bg-purple-50/30 dark:group-hover:bg-purple-900/20 transition-colors duration-300 rounded-t-lg">
    <CardTitle className="flex items-center gap-3">
      <div className="bg-purple-600 dark:bg-purple-500 p-2 rounded-lg group-hover:bg-purple-700 dark:group-hover:bg-purple-400 group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
        <FileText className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <span className="text-gray-900 dark:text-white group-hover:text-purple-900 dark:group-hover:text-purple-100 transition-colors duration-300">
        Email Subject
      </span>
    </CardTitle>
    <p className="text-gray-600 dark:text-gray-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
      The subject line for your objection email
    </p>
  </CardHeader>
  
  <CardContent className="group-hover:bg-gradient-to-br group-hover:from-purple-50/10 group-hover:to-transparent dark:group-hover:from-purple-800/5 dark:group-hover:to-transparent transition-all duration-300">
    <div className="relative">
      <Input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="text-sm font-medium py-3 border-2 focus:border-purple-500 dark:focus:border-purple-400 transition-all duration-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white hover:border-purple-400 dark:hover:border-purple-500 hover:shadow-md hover:shadow-purple-500/10 dark:hover:shadow-purple-400/20 group-hover:bg-white/80 dark:group-hover:bg-gray-600/80"
      />
      {/* Subtle glow effect on hover */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  </CardContent>
</Card>
        </section>

        <section id="letter" className={`transition-all duration-700 ${
          activeSection === 'letter' ? 'relative z-30 scale-[1.02]' : 'relative z-20'
        }`}>
          <Card className="group dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/20 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 ease-out hover:scale-[1.002]">
  <CardHeader className="group-hover:bg-indigo-50/30 dark:group-hover:bg-indigo-900/20 transition-colors duration-300 rounded-t-lg">
    <CardTitle className="flex items-center gap-3">
      <div className="bg-indigo-600 dark:bg-indigo-500 p-2 rounded-lg group-hover:bg-indigo-700 dark:group-hover:bg-indigo-400 group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
        <FileText className="h-5 w-5 text-white transition-transform duration-300 group-hover:rotate-3" />
      </div>
      <span className="text-gray-900 dark:text-white group-hover:text-indigo-900 dark:group-hover:text-indigo-100 transition-colors duration-300">
        Your Objection Letter
      </span>
    </CardTitle>
    <p className="text-gray-600 dark:text-gray-400 group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors duration-300">
      Review and edit your formal objection letter. The letter cites specific constitutional violations and legal grounds.
    </p>
  </CardHeader>
  
  <CardContent className="group-hover:bg-gradient-to-br group-hover:from-indigo-50/10 group-hover:to-transparent dark:group-hover:from-indigo-800/5 dark:group-hover:to-transparent transition-all duration-300">
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 group-hover:border-indigo-300 dark:group-hover:border-indigo-500 group-hover:shadow-md group-hover:shadow-indigo-500/10 dark:group-hover:shadow-indigo-400/20 transition-all duration-300 group-hover:scale-[1.005] relative">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-900 dark:group-hover:text-indigo-100 transition-colors duration-300">
          Key Objections Covered
        </h4>
        <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
          <div className="flex items-center space-x-2 group/item">
            <span className="text-red-500 dark:text-red-400 group-hover/item:text-red-600 dark:group-hover/item:text-red-300 transition-colors duration-300">•</span>
            <span className="group-hover/item:font-medium transition-all duration-300">VAT on essential goods (Art 43 violation)</span>
          </div>
          <div className="flex items-center space-x-2 group/item">
            <span className="text-red-500 dark:text-red-400 group-hover/item:text-red-600 dark:group-hover/item:text-red-300 transition-colors duration-300">•</span>
            <span className="group-hover/item:font-medium transition-all duration-300">Digital lending tax expansion (Art 27 violation)</span>
          </div>
          <div className="flex items-center space-x-2 group/item">
            <span className="text-red-500 dark:text-red-400 group-hover/item:text-red-600 dark:group-hover/item:text-red-300 transition-colors duration-300">•</span>
            <span className="group-hover/item:font-medium transition-all duration-300">Privacy rights erosion (Art 31 violation)</span>
          </div>
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-400/0 via-indigo-400/5 to-indigo-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
      
      <div className="relative group/textarea">
        <textarea
          value={messageBody}
          onChange={(e) => {
            const newValue = e.target.value.replace(
              userName || '[Your Name Will Appear Here]',
              '[USER_NAME_PLACEHOLDER]'
            );
            setMessageBody(newValue);
          }}
          rows={25}
          className="text-sm leading-relaxed font-mono resize-none border-2 focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full rounded-lg p-3 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-500/10 dark:hover:shadow-indigo-400/20 group-hover/textarea:scale-[1.002] transition-all duration-300"
        />
        {/* Subtle border glow on hover */}
        <div className="absolute inset-0 rounded-lg border-2 border-indigo-400/20 dark:border-indigo-300/20 opacity-0 group-hover/textarea:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  </CardContent>
</Card>
        </section>

        <section id="send" className={`transition-all duration-700 ${
          activeSection === 'send' ? 'relative z-30 scale-[1.02]' : 'relative z-20'
        }`}>
          <Card className="group bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 border-2 border-emerald-200 dark:border-emerald-700 hover:shadow-xl hover:shadow-emerald-500/20 dark:hover:shadow-emerald-400/30 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 ease-out hover:scale-[1.005] hover:from-emerald-100 hover:to-blue-100 dark:hover:from-emerald-900/40 dark:hover:to-blue-900/40">
  <CardContent className="pt-6 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-transparent dark:group-hover:from-white/5 dark:group-hover:to-transparent transition-all duration-300 rounded-lg">
    <div className="text-center space-y-6">
      <div className="group-hover:transform group-hover:scale-[1.02] transition-transform duration-300">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-900 dark:group-hover:text-emerald-100 transition-colors duration-300">
          Ready to Submit Your Objection?
        </h3>
        <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
          Clicking the button below will open your email app with everything pre-filled.
          Just review and hit send!
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md mx-auto border-2 border-transparent group-hover:border-emerald-200 dark:group-hover:border-emerald-600 group-hover:shadow-lg group-hover:shadow-emerald-500/10 dark:group-hover:shadow-emerald-400/20 transition-all duration-300 group-hover:scale-[1.02] relative">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between group/status hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 rounded px-2 py-1 transition-colors duration-300">
            <span className="text-gray-700 dark:text-gray-300 group-hover/status:text-emerald-800 dark:group-hover/status:text-emerald-200 transition-colors duration-300">Your Name:</span>
            <span
              className={
                userName.trim() 
                  ? "text-emerald-600 dark:text-emerald-400 font-medium group-hover/status:text-emerald-700 dark:group-hover/status:text-emerald-300 group-hover/status:font-semibold transition-all duration-300" 
                  : "text-red-500 dark:text-red-400 group-hover/status:text-red-600 dark:group-hover/status:text-red-300 transition-colors duration-300"
              }
            >
              {userName.trim() ? "✓ Provided" : "✗ Required"}
            </span>
          </div>
          <div className="flex items-center justify-between group/status hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 rounded px-2 py-1 transition-colors duration-300">
            <span className="text-gray-700 dark:text-gray-300 group-hover/status:text-emerald-800 dark:group-hover/status:text-emerald-200 transition-colors duration-300">Recipients:</span>
            <span
              className={
                getSelectedRecipientEmails().length > 0
                  ? "text-emerald-600 dark:text-emerald-400 font-medium group-hover/status:text-emerald-700 dark:group-hover/status:text-emerald-300 group-hover/status:font-semibold transition-all duration-300"
                  : "text-red-500 dark:text-red-400 group-hover/status:text-red-600 dark:group-hover/status:text-red-300 transition-colors duration-300"
              }
            >
              {getSelectedRecipientEmails().length > 0
                ? `✓ ${getSelectedRecipientEmails().length} selected`
                : "✗ None selected"}
            </span>
          </div>
          <div className="flex items-center justify-between group/status hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 rounded px-2 py-1 transition-colors duration-300">
            <span className="text-gray-700 dark:text-gray-300 group-hover/status:text-emerald-800 dark:group-hover/status:text-emerald-200 transition-colors duration-300">Letter:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover/status:text-emerald-700 dark:group-hover/status:text-emerald-300 group-hover/status:font-semibold transition-all duration-300">✓ Ready</span>
          </div>
        </div>
        {/* Subtle inner glow */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-400/0 via-emerald-400/3 to-emerald-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
      
      <div className="group/button flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleSendEmail}
          size="lg"
          className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 dark:from-emerald-500 dark:to-blue-500 dark:hover:from-emerald-600 dark:hover:to-blue-600 text-white px-4 sm:px-6 md:px-12 py-4 text-sm sm:text-base md:text-lg font-semibold shadow-lg transition-all duration-300 ease-out transform hover:scale-[1.02] group-hover/button:shadow-xl group-hover/button:shadow-emerald-500/20 dark:group-hover/button:shadow-emerald-400/25 group-hover/button:scale-[1.03]"
        >
          <Send className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 flex-shrink-0 group-hover/button:animate-pulse" />
          <span className="truncate text-xs sm:text-sm md:text-base group-hover/button:font-bold transition-all duration-300">
            Open Email & Send Objection
          </span>
        </Button>
        
        <Button
          onClick={() => setIsTemplateCreatorOpen(true)}
          variant="outline"
          size="lg"
          className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 dark:border-emerald-600 dark:text-emerald-300 dark:hover:bg-emerald-900/20 px-4 sm:px-6 py-4 text-sm sm:text-base font-semibold transition-all duration-300"
        >
          <FileText className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
          <span className="truncate">Save as Template</span>
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-300 group-hover:font-medium">
        This will open your default email app (Gmail, Outlook, Apple Mail, etc.) with your objection letter ready to send to the National Assembly.
      </p>
    </div>
  </CardContent>
</Card>
        </section>
      </div>

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

      {/* Bottom Disclaimer */}
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

      <DonationWidget 
        isVisible={isDonationWidgetVisible}
      />
      
    </div>
  );
};

export default Index;
