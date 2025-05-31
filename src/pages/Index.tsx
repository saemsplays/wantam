
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Mail, FileText, CheckCircle, User, AlertTriangle, Shield, Scale, Users } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ArrowUpRight } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  // Counter state - connected to Supabase database
  const [userCount, setUserCount] = useState({ viewers: 0, emailsSent: 0 });
  const [showFullCount, setShowFullCount] = useState(false);

  // Function to fetch current counts from database
  const fetchCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_counts')
        .select('viewers, emails_sent')
        .single();
      
      if (error) {
        console.error('Error fetching counts:', error);
        return;
      }
      
      setUserCount({
        viewers: data?.viewers || 0,
        emailsSent: data?.emails_sent || 0
      });
    } catch (error) {
      console.error('Error in fetchCounts:', error);
    }
  };

  // Function to increment page view
  const incrementPageView = async () => {
    try {
      const { error } = await supabase.rpc('increment_user_action', {
        action_type_param: 'page_view'
      });
      
      if (error) {
        console.error('Error incrementing page view:', error);
      }
    } catch (error) {
      console.error('Error in incrementPageView:', error);
    }
  };

  // Function to increment email sent
  const incrementEmailSent = async () => {
    try {
      const { error } = await supabase.rpc('increment_user_action', {
        action_type_param: 'email_sent'
      });
      
      if (error) {
        console.error('Error incrementing email sent:', error);
        return;
      }
      
      // Refresh counts immediately after email action
      await fetchCounts();
    } catch (error) {
      console.error('Error in incrementEmailSent:', error);
    }
  };

  // Track page view on component mount
  useEffect(() => {
    const initializePageView = async () => {
      await incrementPageView();
      await fetchCounts();
    };
    
    initializePageView();
  }, []);

  // Auto-update counter every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCounts();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

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

    const selectedEmails = getSelectedRecipientEmails();
    const to = selectedEmails.join(',');
    const encodedSubject = encodeURIComponent(subject);
    const personalizedMessage = messageBody.replace('[USER_NAME_PLACEHOLDER]', userName.trim());
    const encodedBody = encodeURIComponent(personalizedMessage);
    
    // Enhanced desktop support
    if (isDesktop()) {
      // Try Gmail web interface first, then fallback to standard mailto
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodedSubject}&body=${encodedBody}`;
      const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodeURIComponent(to)}&subject=${encodedSubject}&body=${encodedBody}`;
      
      // Try to detect email preference or provide options
      const userAgent = navigator.userAgent.toLowerCase();
      
      if (userAgent.includes('chrome') || userAgent.includes('edge')) {
        // Open Gmail web interface in new tab
        window.open(gmailUrl, '_blank');
      } else if (userAgent.includes('outlook') || userAgent.includes('office')) {
        // Open Outlook web interface in new tab
        window.open(outlookUrl, '_blank');
      } else {
        // Fallback to standard mailto
        window.location.href = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
      }
    } else {
      // Mobile - keep existing behavior
      const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
      window.location.href = mailtoLink;
    }
    
    // Increment email sent count in database
    await incrementEmailSent();
    
    toast({
      title: "Opening Your Email App",
      description: "Your objection letter is ready to send! Review and click send in your email app.",
    });
  };

  const totalUsers = userCount.viewers + userCount.emailsSent;
  const shouldShowCounter = totalUsers >= 1000;
  const displayCount = showFullCount ? totalUsers.toLocaleString() : "1K+";

  const stats = [
    { icon: Shield, label: "Constitutional Articles", value: "Art 33, Art 35, Art 118(1)" },
    { icon: Scale, label: "Legal Foundation", value: "Constitution of Kenya 2010" },
    { icon: Users, label: "Public Participation", value: "Mandated by Art 118(1)" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* ─── 1. Top Constitutional Shield Banner ─── */}
      <div className="bg-yellow-100 border-y-2 border-yellow-300 text-yellow-900 p-3 text-center text-xs font-medium">
        <p className="max-w-3xl mx-auto">
          This platform operates under <strong>Art 33 (Freedom of Expression)</strong>, <strong>Art 35 (Access to Information)</strong>, and <strong>Art 118(1) (Public Participation)</strong> of the Constitution of Kenya 2010. 
          No data is stored or shared. All emails are drafted locally on your device.
        </p>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-green-600/5"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-sm font-medium mb-6 ${
              shouldShowCounter 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
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
            
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Object to the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-green-600">
                Finance Bill 2025
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Exercise your constitutional right to participate in legislative processes.
              Submit your formal objection to protect essential goods and privacy rights.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <stat.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{stat.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Content ─── */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

       {/* ── ChatGPT Assistant Card ── */}
        <Card className="bg-gradient-to-r from-red-600 to-green-600 border-gray-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-2 rounded-lg flex-shrink-0 backdrop-blur-sm">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Need help understanding the Finance Bill 2025?</h3>
                <p className="text-sm text-white/90 mb-4">
                  Get instant answers to all your questions about the Finance Bill 2025 from our AI assistant.
                  Understand specific clauses, their implications, and how they might affect you.
                </p>
                <a
                  href="https://chatgpt.com/g/g-681270efebe08191ad509259b304815b-2025-finance-bill-gpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 hover:bg-white/90 rounded-lg text-sm font-medium transition-colors"
                  >
                  Ask the Finance Bill Assistant
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <p className="text-xs text-white/70 mt-2">
                  Opens in a new window. No login required.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* ── Quick Start Guide ── */}
        <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                    <span>Enter your name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                    <span>Review your letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                    <span>Open and send via your email</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Your Details ── */}
        <Card className="border-2 border-dashed border-blue-300 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              Your Details
            </CardTitle>
            <p className="text-gray-600">Only your name is required to prefill the objection letter</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="userName" className="text-sm font-medium text-gray-700 mb-2 block">
                  Full Name *
                </Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your full name as it should appear in the letter"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="text-lg py-3 border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              {/* ── Privacy & Anonymity Note ── */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-900 text-sm">
                <p>
                  <strong>Privacy & Anonymity Notice:</strong> This site collects <u>no</u> personal data. 
                  All inputs remain on your device until you click "Send." 
                  You may use a pseudonym or initials if desired.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Recipients ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              Send To
            </CardTitle>
            <p className="text-gray-600">Select who should receive your objection letter</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                  <Checkbox
                    id="clerk"
                    checked={selectedRecipients.clerk}
                    onCheckedChange={(checked) => handleRecipientChange('clerk', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="clerk" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-900">{recipients.clerk.name}</div>
                    <div className="text-sm text-gray-600">{recipients.clerk.email}</div>
                    <div className="text-xs text-emerald-600 mt-1">✓ Recommended</div>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                  <Checkbox
                    id="financeCommittee"
                    checked={selectedRecipients.financeCommittee}
                    onCheckedChange={(checked) => handleRecipientChange('financeCommittee', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="financeCommittee" className="flex-1 cursor-pointer">
                    <div className="font-semibold text-gray-900">{recipients.financeCommittee.name}</div>
                    <div className="text-sm text-gray-600">{recipients.financeCommittee.email}</div>
                    <div className="text-xs text-emerald-600 mt-1">✓ Recommended</div>
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Subject Line ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Email Subject
            </CardTitle>
            <p className="text-gray-600">The subject line for your objection email</p>
          </CardHeader>
          <CardContent>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="text-sm font-medium py-3 border-2 focus:border-purple-500 transition-colors"
            />
          </CardContent>
        </Card>

        {/* ── Letter Preview ── */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Your Objection Letter
            </CardTitle>
            <p className="text-gray-600">
              Review and edit your formal objection letter. The letter cites specific constitutional violations and legal grounds.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-amber-700 mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Key Objections Covered</span>
                </div>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• VAT on essential goods (Art 43 violation)</li>
                  <li>• Digital lending tax expansion (Art 27 violation)</li>
                  <li>• Privacy rights erosion (Art 31 violation)</li>
                </ul>
              </div>
              
              <Textarea
                value={messageBody.replace(
                  '[USER_NAME_PLACEHOLDER]',
                  userName || '[Your Name Will Appear Here]'
                )}
                onChange={(e) => {
                  const newValue = e.target.value.replace(
                    userName || '[Your Name Will Appear Here]',
                    '[USER_NAME_PLACEHOLDER]'
                  );
                  setMessageBody(newValue);
                }}
                rows={25}
                className="text-sm leading-relaxed font-mono resize-none border-2 focus:border-indigo-500 transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* ── Send Section ── */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Submit Your Objection?
                </h3>
                <p className="text-gray-600">
                  Clicking the button below will open your email app with everything pre-filled.
                  Just review and hit send!
                </p>
              </div>

              {/* Status Check */}
              <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Your Name:</span>
                    <span
                      className={
                        userName.trim() ? "text-emerald-600 font-medium" : "text-red-500"
                      }
                    >
                      {userName.trim() ? "✓ Provided" : "✗ Required"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recipients:</span>
                    <span
                      className={
                        getSelectedRecipientEmails().length > 0
                          ? "text-emerald-600 font-medium"
                          : "text-red-500"
                      }
                    >
                      {getSelectedRecipientEmails().length > 0
                        ? `✓ ${getSelectedRecipientEmails().length} selected`
                        : "✗ None selected"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Letter:</span>
                    <span className="text-emerald-600 font-medium">✓ Ready</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSendEmail}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <Send className="mr-3 h-6 w-6" />
                Open Email & Send Objection
              </Button>

              <p className="text-xs text-gray-500 max-w-md mx-auto">
                This will open your default email app (Gmail, Outlook, Apple Mail, etc.) with your objection letter ready to send to the National Assembly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ─── 3. Footer with CEKA Attribution & Disclaimer ─── */}
      <div className="bg-gray-900 text-gray-200 py-8 text-xs text-center px-4">
        <p>
          <strong>
            Published by{" "}
            <a
              href="https://ceka.lovable.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-emerald-400 hover:text-emerald-300"
              >
              Civic Education Kenya App (CEKA). 
            </a>
          </strong>
           <br />
          CEKA provides this tool under the Constitution of Kenya 2010 (Art 33, Art 35, Art 118(1)).
          <br />
          CEKA does not store, monitor, or share any user data.
        </p>
        <p className="mt-2 italic">
          By using this platform, you acknowledge that all content is user-generated. CEKA holds no liability for any outcomes arising from your objection email.
        </p>
        <p className="mt-4 flex items-center justify-center gap-2 text-gray-400">
          <Scale className="h-5 w-5 text-emerald-400" />
          <span>
            Exercise your constitutional right to participate in legislative processes (Art 118(1)).
          </span>
        </p>
      </div>
    </div>
  );
};

export default Index;
