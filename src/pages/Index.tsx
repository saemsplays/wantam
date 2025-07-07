import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Send, Mail, FileText, CheckCircle, User, AlertTriangle, Shield, Scale, Users, Play, 
  RotateCcw, ArrowUpRight, Home, Archive, Settings, HelpCircle, Lightbulb, Heart, Flag, 
  ExternalLink, Radio, Save, FolderOpen, Share2, FolderSearch, Plus, X, Edit2, Trash2 
} from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";


const Index = () => {
  // User input states
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

  // App state
  const [userCount, setUserCount] = useState({ viewers: 0, emailsSent: 0 });
  const [showFullCount, setShowFullCount] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDonationWidgetVisible, setIsDonationWidgetVisible] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [hasSeenTour, setHasSeenTour] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [billsDockOpen, setBillsDockOpen] = useState(false);
  const [billsDockOrigin, setBillsDockOrigin] = useState<HTMLElement | null>(null);
  const [isTemplateCreatorOpen, setIsTemplateCreatorOpen] = useState(false);
  const [isTemplateBrowserOpen, setIsTemplateBrowserOpen] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [customEmails, setCustomEmails] = useState([]);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);

  // Section definitions
  const sections = [
    { id: 'hero', title: 'Introduction', position: 21.52 },
    {id: 'templates', title: 'Templates', position: 40.75 },
    { id: 'details', title: 'Your Details', position: 44 },
    { id: 'recipients', title: 'Send To', position: 53 },
    { id: 'subject', title: 'Email Subject', position: 60 },
    { id: 'letter', title: 'Your Objection Letter', position: 73 },
    { id: 'send', title: 'Ready To Submit Your Objection?', position: 96 }
  ];

  // Fetch initial data
  useEffect(() => {
    const init = async () => {
      await trackPageView();
      await fetchCounts();
      await fetchTemplates();
      checkMobile();
      
      // Check for template in URL
      const urlParams = new URLSearchParams(window.location.search);
      const templateId = urlParams.get('template');
      if (templateId) {
        loadTemplate(templateId);
      }
    };

    init();
    
    const tourSeen = localStorage.getItem('finance-bill-tour-seen');
    if (tourSeen) setHasSeenTour(true);
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const checkMobile = () => setIsMobile(window.innerWidth < 768);

  const trackPageView = async () => {
    try {
      await supabase.rpc('increment_user_action', { action_type_param: 'page_view' });
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  };

  const fetchCounts = async () => {
    try {
      const response = await supabase
        .from('user_counts')
        .select('viewers, emails_sent')
        .limit(1);
      
      if (response.data?.[0]) {
        // Fix: Convert emails_sent to emailsSent for state compatibility
        setUserCount({
          viewers: response.data[0].viewers,
          emailsSent: response.data[0].emails_sent
        });
      }
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (!error && data) setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const loadTemplate = async (templateId: string) => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .eq('id', templateId)
        .single();
      
      if (data) {
        setUserName(data.user_name || '');
        // Fix: Safely parse recipients JSON with fallback
        try {
          const parsedRecipients = typeof data.recipients === 'string' 
            ? JSON.parse(data.recipients) 
            : data.recipients;
          setSelectedRecipients(parsedRecipients || { clerk: false, financeCommittee: false });
        } catch (parseError) {
          console.error('Error parsing recipients:', parseError);
          setSelectedRecipients({ clerk: false, financeCommittee: false });
        }
        setSubject(data.subject);
        setMessageBody(data.message_body);
        
        // Update template usage count
        await supabase
          .from('email_templates')
          .update({ use_count: (data.use_count || 0) + 1 })
          .eq('id', templateId);
        
        // Scroll to form
        setTimeout(() => {
          document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
      }
    } catch (error) {
      console.error('Error loading template:', error);
      toast({
        title: "Template Not Found",
        description: "The requested template could not be loaded",
        variant: "destructive"
      });
    }
  };

  const saveTemplate = async () => {
  if (!templateName.trim()) {
    toast({
      title: "Template Name Required",
      description: "Please provide a name for your template",
      variant: "destructive"
    });
    return;
  }

  try {
    // Use the regular supabase client instead of supabaseAdmin
    const { data, error } = await supabase
      .from('email_templates')
      .insert({
        template_name: templateName,
        recipients: selectedRecipients,
        subject,
        message_body: messageBody,
        user_name: userName
      })
      .select()
      .single();

    if (error) throw error;

    // Generate and copy shareable link
    const shareableLink = `${window.location.origin}${window.location.pathname}?template=${data.id}`;
    navigator.clipboard.writeText(shareableLink);
    
    toast({ title: "Template Saved!", description: "Shareable link copied to clipboard" });
    
    setIsTemplateCreatorOpen(false);
    setTemplateName('');
    fetchTemplates();
    
  } catch (error) {
    console.error('Error saving template:', error);
    toast({
      title: "Error",
      description: "Failed to save template. Please try again.",
      variant: "destructive"
    });
  }
};
  
  // Tour handlers
  const handleTourComplete = () => {
    setShowTour(false);
    setHasSeenTour(true);
    localStorage.setItem('finance-bill-tour-seen', 'true');
  };

  const startTour = () => setShowTour(true);
  const restartTour = () => setShowTour(true);

  // Email sending logic
  const recipients = {
    clerk: { name: "Clerk of the National Assembly", email: "cna@parliament.go.ke" },
    financeCommittee: { name: "Finance Committee", email: "financecommitteena@parliament.go.ke" }
  };

  const handleRecipientChange = (recipient: string, checked: boolean) => {
    setSelectedRecipients(prev => ({ ...prev, [recipient]: checked }));
  };

  const getSelectedRecipientEmails = () => {
    const emails: string[] = [];
    if (selectedRecipients.clerk) emails.push(recipients.clerk.email);
    if (selectedRecipients.financeCommittee) emails.push(recipients.financeCommittee.email);
    customEmails.forEach(email => emails.push(email.address));
    return emails;
  };

  const isDesktop = () => !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const addCustomEmail = () => {
  if (!newEmailInput.trim()) return;
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(newEmailInput)) {
    toast({
      title: "Invalid Email",
      description: "Please enter a valid email address",
      variant: "destructive"
    });
    return;
  }
  
  const newEmail = {
    id: Date.now(),
    address: newEmailInput.trim(),
    name: newEmailInput.trim()
  };
  
  setCustomEmails(prev => [...prev, newEmail]);
  setNewEmailInput('');
  setIsAddingEmail(false);
};

const removeCustomEmail = (emailId) => {
  setCustomEmails(prev => prev.filter(email => email.id !== emailId));
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
      window.location.href = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    }
    
    toast({
      title: "Opening Your Email App",
      description: "Your objection letter is ready to send! Review and click send in your email app.",
    });
  };

  // UI helpers
  const totalUsers = userCount.viewers + userCount.emailsSent;
  const shouldShowCounter = totalUsers >= 1000;
  const displayCount = showFullCount ? totalUsers.toLocaleString() : `${Math.round(totalUsers / 1000)}K+`;

  const stats = [
    { icon: Shield, label: "Constitutional Articles", value: "Art 33, Art 35, Art 118(1)" },
    { icon: Scale, label: "Legal Foundation", value: "Constitution of Kenya 2010" },
    { icon: Users, label: "Public Participation", value: "Mandated by Art 118(1)" }
  ];

  const dockItems = [
    { icon: <Radio size={18} />, label: 'Radio', onClick: () => setIsRadioOpen(true) },
    { icon: <Flag size={18} />, label: 'Report', onClick: () => setIsReportingOpen(true) },
    { 
      icon: <Users size={18} />, 
      label: 'Reject', 
      onClick: () => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' }) 
    },
    { 
      icon: <FileText size={18} />, 
      label: 'Template', 
      onClick: () => setIsTemplateBrowserOpen(true) 
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
        onSkip={handleTourComplete}
      />
      <ScrollProgressTracker activeSection={activeSection} sections={sections} />
      
      {/* <BillsSidebar /> */}
      <InteractiveCountWidget />
      <DonationWidget />
      <EmergencyReportingSystem isOpen={isReportingOpen} onClose={() => setIsReportingOpen(false)} />
      <ExternalRadioWindow isOpen={isRadioOpen} onClose={() => setIsRadioOpen(false)} />
      {/* <BillsDockPopup isOpen={billsDockOpen} onClose={() => setBillsDockOpen(false)} originElement={billsDockOrigin} /> */}
      <ScrollToTop />
      <BillsFAB />

      {/* Hero Section */}
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
                texts={["Kuwa Organised", "Kuwa Informed","Numbers", "Kuinject", "Kupiga Kelele", "WANTAM"]}
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

      {/* Introduction Section */}
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
                <span onClick={() => setShowFullCount(!showFullCount)} className="cursor-pointer">
                  As used by {displayCount} citizens
                </span>
              ) : (
                'Action Required: Share your voice. Your constitutional right protects it.'
              )}
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Create. Amplify.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 dark:from-red-400 dark:to-green-400">
                Together
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Exercise your constitutional right to participate in legislative processes.
              Create your template & share to inspire civic action.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl p-3 md:p-6 shadow-sm">
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
              {!hasSeenTour && !showTour && <TourStarter onStartTour={startTour} />}

              {hasSeenTour && (
                <button onClick={restartTour} className="mb-4 inline-flex items-center gap-1 px-3 py-1 bg-yellow-200 hover:bg-yellow-300 dark:bg-yellow-700 dark:hover:bg-yellow-600 text-yellow-800 dark:text-yellow-200 rounded-full text-xs font-medium transition-colors">
                  <Play className="h-3 w-3" /> Restart Tour
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
                        <h3 className="font-semibold text-white mb-2">Change.org</h3>
                        <p className="text-sm text-white/90 mb-4">
                          See petitions filed for change by Kenyans through the Change.Org project.
                        </p>
                        <a href="https://www.change.org/topic/kenya" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 hover:bg-white/90 rounded-lg text-sm font-medium transition-colors">
                          See Petitions <ArrowUpRight className="h-4 w-4" />
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
                          Get the WANTAM app on your device and amplify your voice, on the go!
                        </p>
                        <button onClick={() => {
                          const link = document.createElement('a');
                          link.href = "https://juzqumvamllubshomuge.supabase.co/storage/v1/object/sign/apps/Signed%20APK%20-%20Prod%20Ready/RFB254%20by%20CEKA.apk?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZThlZDg5OC05N2JkLTRhNmEtYjUwZS0zMTU5M2U4NmMwOTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcHBzL1NpZ25lZCBBUEsgLSBQcm9kIFJlYWR5L1JGQjI1NCBieSBDRUtBLmFwayIsImlhdCI6MTc0OTA2Mjg3OSwiZXhwIjoxNzgwNTk4ODc5fQ.qS2msdBAlUVLX6XYBwNe7ErBYiRyEqZIterdv1Gjo1M";
                          link.download = "WANTAM.apk";
                          link.click();
                        }} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 hover:bg-white/90 rounded-lg text-sm font-medium transition-colors">
                          Download Here <ArrowUpRight className="h-4 w-4" />
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

      {/* Template Browser Section */}
      <section className="py-12 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full mb-4">
              <Lightbulb className="h-5 w-5" />
              <span>Community Templates</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Browse & Share {' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600 dark:from-red-400 dark:to-green-400">
                Templates
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover templates created by others, or share your own with the community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-full flex-shrink-0 backdrop-blur-sm">
                    <Share2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Share Your Template</h3>
                    <p className="mb-4 opacity-90">
                      Save your current objection as a template and share it with others
                    </p>
                    <Button onClick={() => setIsTemplateCreatorOpen(true)} className="bg-white text-indigo-600 hover:bg-white/90">
                      <Save className="mr-2 h-4 w-4" /> Save Current as Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-full flex-shrink-0 backdrop-blur-sm">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Community Templates</h3>
                    <p className="mb-4 opacity-90">
                      Browse templates created by other citizens and use them as a starting point
                    </p>
                    <Button onClick={() => setIsTemplateBrowserOpen(true)} className="bg-white text-green-600 hover:bg-white/90">
                      <FolderSearch className="mr-2 h-4 w-4" /> Browse Templates
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Recently Created Templates
              </h3>
              <Button variant="outline" onClick={() => setIsTemplateBrowserOpen(true)} className="flex-shrink-0">
                View All Templates
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.slice(0, 3).map((template) => (
                <Card key={template.id} className="group cursor-pointer hover:shadow-md transition-shadow" onClick={() => loadTemplate(template.id)}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <span className="truncate">{template.template_name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm font-medium text-gray-900 dark:text-white mb-2 line-clamp-1">
                      {template.subject}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {template.message_body}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Used {template.use_count || 0} times
                      </span>
                      <Button size="sm" variant="ghost" className="text-blue-600 dark:text-blue-400 group-hover:underline">
                        Use Template <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {templates.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <FolderOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No templates yet</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Create the first template to help others get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Form Sections */}
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

        {/* User Details Section */}
        <section id="details" className="transition-all duration-700">
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
                  <Label htmlFor="userName" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors duration-300">
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

        {/* Recipients Section */}
        <section id="recipients" className="transition-all duration-700">
          <Card className="group bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-200 dark:border-orange-700 hover:shadow-xl hover:shadow-orange-500/20 dark:hover:shadow-orange-400/30 hover:border-orange-300 dark:hover:border-orange-500 transition-all duration-300 ease-out hover:scale-[1.005] hover:from-orange-100 hover:to-red-100 dark:hover:from-orange-900/40 dark:hover:to-red-900/40">
            <CardContent className="pt-6 group-hover:bg-gradient-to-br group-hover:from-white/10 group-hover:to-transparent dark:group-hover:from-white/5 dark:group-hover:to-transparent transition-all duration-300 rounded-lg">
              <div className="space-y-6">
                <div className="group-hover:transform group-hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center mb-2">
                    <Mail className="mr-2 h-5 w-5 text-orange-600 dark:text-orange-400" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Send To
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                    Select who should receive your objection letter
                  </p>
                </div>
                
                <div className="space-y-4">
                  {/* Default Recipients */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-orange-100 dark:border-orange-800 group/item hover:border-orange-200 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 transition-all duration-300 group-hover/item:shadow-md">
                      <Checkbox
                        id="clerk"
                        checked={selectedRecipients.clerk}
                        onCheckedChange={(checked) => handleRecipientChange('clerk', checked as boolean)}
                        className="mt-1 group-hover/item:border-emerald-400 transition-colors duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <label htmlFor="clerk" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer group-hover/item:text-orange-900 dark:group-hover/item:text-orange-100 transition-colors duration-300">
                            {recipients.clerk.name}
                          </label>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover/item:text-orange-700 dark:group-hover/item:text-orange-300 transition-colors duration-300">
                          {recipients.clerk.email}
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300 transition-colors duration-300">
                          ✓ Recommended
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-3 rounded-lg border-2 border-orange-100 dark:border-orange-800 group/item hover:border-orange-200 dark:hover:border-orange-600 hover:bg-orange-50/50 dark:hover:bg-orange-900/20 transition-all duration-300 group-hover/item:shadow-md">
                      <Checkbox
                        id="financeCommittee"
                        checked={selectedRecipients.financeCommittee}
                        onCheckedChange={(checked) => handleRecipientChange('financeCommittee', checked as boolean)}
                        className="mt-1 group-hover/item:border-emerald-400 transition-colors duration-300"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <label htmlFor="financeCommittee" className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer group-hover/item:text-orange-900 dark:group-hover/item:text-orange-100 transition-colors duration-300">
                            {recipients.financeCommittee.name}
                          </label>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate group-hover/item:text-orange-700 dark:group-hover/item:text-orange-300 transition-colors duration-300">
                          {recipients.financeCommittee.email}
                        </div>
                        <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 group-hover/item:text-emerald-700 dark:group-hover/item:text-emerald-300 transition-colors duration-300">
                          ✓ Recommended
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Recipients */}
                  {customEmails.length > 0 && (
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 border-t pt-3">
                        Custom Recipients
                      </div>
                      {customEmails.map((email) => (
                        <div key={email.id} className="flex items-center space-x-3 p-3 rounded-lg border-2 border-blue-100 dark:border-blue-800 group/item hover:border-blue-200 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300">
                          <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {email.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {email.address}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCustomEmail(email.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Custom Email */}
                  <div className="border-t pt-4">
                    {!isAddingEmail ? (
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingEmail(true)}
                        className="w-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Custom Email Address
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Enter email address"
                            value={newEmailInput}
                            onChange={(e) => setNewEmailInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomEmail()}
                            className="flex-1"
                          />
                          <Button
                            onClick={addCustomEmail}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => {
                              setIsAddingEmail(false);
                              setNewEmailInput('');
                            }}
                            variant="outline"
                            size="sm"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Add additional recipients like MPs, senators, or other officials
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Subject Section */}
        <section id="subject" className="transition-all duration-700">
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
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-400/0 via-purple-400/5 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Letter Section */}
        <section id="letter" className="transition-all duration-700">
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
                  <div className="absolute inset-0 rounded-lg border-2 border-indigo-400/20 dark:border-indigo-300/20 opacity-0 group-hover/textarea:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Send Section */}
        <section id="send" className="transition-all duration-700">
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
                      <span className={userName.trim() ? "text-emerald-600 dark:text-emerald-400 font-medium group-hover/status:text-emerald-700 dark:group-hover/status:text-emerald-300 group-hover/status:font-semibold transition-all duration-300" : "text-red-500 dark:text-red-400 group-hover/status:text-red-600 dark:group-hover/status:text-red-300 transition-colors duration-300"}>
                        {userName.trim() ? "✓ Provided" : "✗ Required"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between group/status hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 rounded px-2 py-1 transition-colors duration-300">
                      <span className="text-gray-700 dark:text-gray-300 group-hover/status:text-emerald-800 dark:group-hover/status:text-emerald-200 transition-colors duration-300">Recipients:</span>
                      <span className={getSelectedRecipientEmails().length > 0 ? "text-emerald-600 dark:text-emerald-400 font-medium group-hover/status:text-emerald-700 dark:group-hover/status:text-emerald-300 group-hover/status:font-semibold transition-all duration-300" : "text-red-500 dark:text-red-400 group-hover/status:text-red-600 dark:group-hover/status:text-red-300 transition-colors duration-300"}>
                        {getSelectedRecipientEmails().length > 0 ? `✓ ${getSelectedRecipientEmails().length} selected` : "✗ None selected"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between group/status hover:bg-emerald-50/30 dark:hover:bg-emerald-900/20 rounded px-2 py-1 transition-colors duration-300">
                      <span className="text-gray-700 dark:text-gray-300 group-hover/status:text-emerald-800 dark:group-hover/status:text-emerald-200 transition-colors duration-300">Letter:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium group-hover/status:text-emerald-700 dark:group-hover/status:text-emerald-300 group-hover/status:font-semibold transition-all duration-300">✓ Ready</span>
                    </div>
                  </div>
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
                    <Save className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
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

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-gray-200 dark:text-gray-300 py-8 text-xs text-center px-4 max-w-full overflow-x-hidden transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <p className="break-words max-w-full">
            <strong>
              Published by{" "}
              <a href="https://ceka.lovable.app" target="_blank" rel="noopener noreferrer" className="underline text-emerald-400 dark:text-emerald-300 hover:text-emerald-300 dark:hover:text-emerald-200 break-words">
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

      {/* Dock */}
      <div className="absolute bottom-0 left-0 right-0">
        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>

      {/* Template Creator Dialog */}
      <Dialog open={isTemplateCreatorOpen} onOpenChange={setIsTemplateCreatorOpen}>
        <DialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Save as Template
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Save your current settings as a reusable template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="templateName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Template Name *
              </Label>
              <Input
                id="templateName"
                placeholder="e.g., Finance Bill Objection Template"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3 text-sm text-blue-700 dark:text-blue-300">
              <Lightbulb className="h-5 w-5 inline-block mr-1" />
              Your template will be publicly visible but anonymous
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateCreatorOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveTemplate}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Browser Dialog */}
      <Dialog open={isTemplateBrowserOpen} onOpenChange={setIsTemplateBrowserOpen}>
        <DialogContent className="max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Browse Templates
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300">
              Select a template to get started
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto py-4">
            {templates.map((template) => (
              <Card 
                key={template.id}
                className="group cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-300"
                onClick={() => loadTemplate(template.id)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="truncate">{template.template_name}</span>
                  </CardTitle>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(template.created_at).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {template.subject}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-3">
                    {template.message_body}
                  </div>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    Used {template.use_count || 0} times
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {templates.length === 0 && (
              <div className="col-span-full text-center py-8">
                <FolderOpen className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No templates yet</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Be the first to create a template!
                </p>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTemplateBrowserOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
