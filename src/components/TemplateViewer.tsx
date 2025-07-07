
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Send, ArrowLeft, Eye, Share2, FileText, User, CheckCircle, Mail, Plus, X, Trash2, Shield, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  slug: string | null;
  title: string;
  body: string;
  metadata: any;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  uses_count: number;
  is_verified?: boolean;
}

interface VerifiedEmail {
  id: number;
  email_address: string;
  display_name: string;
  trust_score: number;
  is_verified: boolean;
  category: string;
}

interface CustomEmail {
  id: number;
  address: string;
  name: string;
}

export const TemplateViewer: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state - initialized from template
  const [userName, setUserName] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedRecipients, setSelectedRecipients] = useState({
    clerk: false,
    financeCommittee: false
  });

  // Dynamic template sections
  const [recipientsTitle, setRecipientsTitle] = useState('Send To');
  const [recipientsDescription, setRecipientsDescription] = useState('Select who should receive your objection letter');
  const [subjectTitle, setSubjectTitle] = useState('Email Subject');
  const [subjectDescription, setSubjectDescription] = useState('The subject line for your objection email');
  const [letterTitle, setLetterTitle] = useState('Your Objection Letter');
  const [letterDescription, setLetterDescription] = useState('Review and edit your formal objection letter. The letter cites specific constitutional violations and legal grounds.');
  const [keyObjectionsTitle, setKeyObjectionsTitle] = useState('Key Objections Covered');
  const [keyObjections, setKeyObjections] = useState([
    'VAT on essential goods (Art 43 violation)',
    'Digital lending tax expansion (Art 27 violation)',
    'Privacy rights erosion (Art 31 violation)'
  ]);

  const [customEmails, setCustomEmails] = useState<CustomEmail[]>([]);
  const [newEmailInput, setNewEmailInput] = useState('');
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [verifiedEmails, setVerifiedEmails] = useState<VerifiedEmail[]>([]);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      
      // Try to fetch by slug first, then by ID
      let { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('slug', templateId)
        .eq('is_public', true)
        .single();

      if (error && error.code === 'PGRST116') {
        // Not found by slug, try by ID
        const response = await supabase
          .from('templates')
          .select('*')
          .eq('id', templateId)
          .eq('is_public', true)
          .single();
        
        data = response.data;
        error = response.error;
      }

      if (error) {
        throw error;
      }

      if (!data) {
        setError('Template not found or is private');
        return;
      }

      setTemplate(data);
      
      // Initialize form with template data including dynamic sections
      const metadata = data.metadata as any;
      const defaultSubject = metadata?.subject || 'RE: MEMORANDUM OF OBJECTION TO THE FINANCE BILL 2025';
      setSubject(defaultSubject);
      setMessageBody(data.body);
      
      // Load dynamic sections from metadata
      if (metadata?.sections) {
        setRecipientsTitle(metadata.sections.recipientsTitle || 'Send To');
        setRecipientsDescription(metadata.sections.recipientsDescription || 'Select who should receive your objection letter');
        setSubjectTitle(metadata.sections.subjectTitle || 'Email Subject');
        setSubjectDescription(metadata.sections.subjectDescription || 'The subject line for your objection email');
        setLetterTitle(metadata.sections.letterTitle || 'Your Objection Letter');
        setLetterDescription(metadata.sections.letterDescription || 'Review and edit your formal objection letter. The letter cites specific constitutional violations and legal grounds.');
        setKeyObjectionsTitle(metadata.sections.keyObjectionsTitle || 'Key Objections Covered');
        setKeyObjections(metadata.sections.keyObjections || [
          'VAT on essential goods (Art 43 violation)',
          'Digital lending tax expansion (Art 27 violation)',
          'Privacy rights erosion (Art 31 violation)'
        ]);
      }
      
      // Increment view count
      await supabase.rpc('increment_template_views', { template_id: data.id });
      
      // Update document title and meta tags for SEO
      document.title = `${data.title} - CEKA Template`;
      
      // Add Open Graph meta tags
      updateMetaTags(data);
      
      // Fetch verified emails
      await fetchVerifiedEmails();
      
    } catch (error) {
      console.error('Error fetching template:', error);
      setError('Template not found or is private');
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifiedEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('verified_emails')
        .select('*')
        .eq('is_verified', true)
        .order('trust_score', { ascending: false });
      
      if (!error && data) setVerifiedEmails(data);
    } catch (error) {
      console.error('Error fetching verified emails:', error);
    }
  };

  const updateMetaTags = (template: Template) => {
    // Update or create meta tags for social sharing
    const updateOrCreateMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) || 
                 document.querySelector(`meta[name="${property}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(property.startsWith('og:') ? 'property' : 'name', property);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    const bodySnippet = template.body.substring(0, 200) + '...';
    
    updateOrCreateMeta('og:title', template.title);
    updateOrCreateMeta('og:description', bodySnippet);
    updateOrCreateMeta('og:type', 'article');
    updateOrCreateMeta('og:url', window.location.href);
    updateOrCreateMeta('twitter:card', 'summary');
    updateOrCreateMeta('twitter:title', template.title);
    updateOrCreateMeta('twitter:description', bodySnippet);
  };

  const isDesktop = () => {
    return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  const getSelectedRecipientEmails = () => {
    const recipients = {
      clerk: { email: "cna@parliament.go.ke" },
      financeCommittee: { email: "financecommitteena@parliament.go.ke" }
    };

    const emails = [];
    if (selectedRecipients.clerk) emails.push(recipients.clerk.email);
    if (selectedRecipients.financeCommittee) emails.push(recipients.financeCommittee.email);
    
    // Add verified emails that are selected
    verifiedEmails.forEach(email => {
      if (selectedRecipients[`verified_${email.id}` as keyof typeof selectedRecipients]) {
        emails.push(email.email_address);
      }
    });
    
    // Add custom emails
    customEmails.forEach(email => emails.push(email.address));
    return emails;
  };

  const addCustomEmail = () => {
    if (!newEmailInput.trim()) return;
    
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

  const removeCustomEmail = (emailId: number) => {
    setCustomEmails(prev => prev.filter(email => email.id !== emailId));
  };

  const handleVerifiedEmailChange = (emailId: number, checked: boolean) => {
    setSelectedRecipients(prev => ({ 
      ...prev, 
      [`verified_${emailId}`]: checked 
    } as any));
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

    const totalSelectedEmails = getSelectedRecipientEmails().length;
    if (totalSelectedEmails === 0) {
      toast({
        title: "Select Recipients",
        description: "Please select at least one recipient or add a custom email address",
        variant: "destructive"
      });
      return;
    }

    try {
      // Increment template usage count
      if (template) {
        await supabase.rpc('increment_template_usage', { template_id: template.id });
      }

      // Track email sent action
      await supabase.rpc('increment_user_action', { action_type_param: 'email_sent' });

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

    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Template Not Found</h1>
          <p className="text-gray-600 mb-6">
            This template doesn't exist or is no longer available.
          </p>
          <Button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-emerald-600 to-blue-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <Card className="bg-gradient-to-r from-blue-50 to-emerald-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 p-2 rounded-lg flex-shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
                    {template.is_verified ? (
                      <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-full">
                        <Shield className="h-4 w-4 text-blue-600" />
                        <span className="text-xs font-medium text-blue-600">Verified</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-xs font-medium text-yellow-600">Unverified</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {template.views_count} views
                    </div>
                    <div className="flex items-center gap-1">
                      <Send className="h-4 w-4" />
                      {template.uses_count} uses
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Created {new Date(template.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast({ title: "Link copied to clipboard!" });
                  }}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Your Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Your Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="userName">Full Name *</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your full name as it should appear in the letter"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recipients - Now Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle>{recipientsTitle}</CardTitle>
              <p className="text-sm text-gray-600">{recipientsDescription}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="clerk"
                    checked={selectedRecipients.clerk}
                    onCheckedChange={(checked) => setSelectedRecipients(prev => ({ ...prev, clerk: !!checked }))}
                  />
                  <Label htmlFor="clerk" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Clerk of the National Assembly</div>
                    <div className="text-sm text-gray-600">cna@parliament.go.ke</div>
                    <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3 w-3" />
                      Recommended
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id="financeCommittee"
                    checked={selectedRecipients.financeCommittee}
                    onCheckedChange={(checked) => setSelectedRecipients(prev => ({ ...prev, financeCommittee: !!checked }))}
                  />
                  <Label htmlFor="financeCommittee" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Finance Committee</div>
                    <div className="text-sm text-gray-600">financecommitteena@parliament.go.ke</div>
                    <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="h-3 w-3" />
                      Recommended
                    </div>
                  </Label>
                </div>

                {/* Verified Emails Section */}
                {verifiedEmails.length > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      Verified Email Addresses
                    </h4>
                    <div className="space-y-3">
                      {verifiedEmails.map((email) => (
                        <div key={email.id} className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 group/item hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-300">
                          <Checkbox
                            id={`verified-${email.id}`}
                            checked={selectedRecipients[`verified_${email.id}` as keyof typeof selectedRecipients] || false}
                            onCheckedChange={(checked) => handleVerifiedEmailChange(email.id, !!checked)}
                            className="mt-1 group-hover/item:border-blue-400 transition-colors duration-300"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <label htmlFor={`verified-${email.id}`} className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer group-hover/item:text-blue-900 dark:group-hover/item:text-blue-100 transition-colors duration-300">
                                {email.display_name}
                              </label>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-blue-500" />
                                <span className="text-xs text-blue-600 dark:text-blue-400">Verified</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 group-hover/item:text-blue-700 dark:group-hover/item:text-blue-300 transition-colors duration-300">
                              {email.email_address}
                            </div>
                            <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              Trust Score: {email.trust_score}/100
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Emails Section */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      <Mail className="h-4 w-4 text-green-500" />
                      Add Custom Email Address
                    </h4>
                    <Button
                      onClick={() => setIsAddingEmail(true)}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Email
                    </Button>
                  </div>
                  
                  {/* Add Email Input */}
                  {isAddingEmail && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter email address"
                          value={newEmailInput}
                          onChange={(e) => setNewEmailInput(e.target.value)}
                          className="flex-1"
                          onKeyPress={(e) => e.key === 'Enter' && addCustomEmail()}
                        />
                        <Button onClick={addCustomEmail} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          onClick={() => {
                            setIsAddingEmail(false);
                            setNewEmailInput('');
                          }} 
                          size="sm" 
                          variant="outline"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Custom Emails List */}
                  {customEmails.length > 0 && (
                    <div className="space-y-2">
                      {customEmails.map((email) => (
                        <div key={email.id} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-gray-900 dark:text-white">{email.address}</span>
                          </div>
                          <Button
                            onClick={() => removeCustomEmail(email.id)}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {customEmails.length === 0 && !isAddingEmail && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                      No custom email addresses added yet
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject - Now Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle>{subjectTitle}</CardTitle>
              <p className="text-sm text-gray-600">{subjectDescription}</p>
            </CardHeader>
            <CardContent>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-medium"
              />
            </CardContent>
          </Card>

          {/* Message Body - Now Dynamic */}
          <Card>
            <CardHeader>
              <CardTitle>{letterTitle}</CardTitle>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">{letterDescription}</p>
                {keyObjections.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">{keyObjectionsTitle}</h4>
                    <ul className="space-y-1">
                      {keyObjections.map((objection, index) => (
                        <li key={index} className="text-sm text-blue-800 flex items-start gap-2">
                          <span className="text-blue-600 mt-1">•</span>
                          {objection}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Send Button */}
          <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold">Ready to Send Your Message?</h3>
                <p className="text-gray-600">
                  Click below to open your email app with everything pre-filled.
                </p>
                
                <Button
                  onClick={handleSendEmail}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 px-8 py-3"
                  disabled={!userName.trim()}
                >
                  <Send className="h-5 w-5 mr-2" />
                  Open Email & Send
                </Button>
                
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  This will open your default email app with your message ready to send.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
