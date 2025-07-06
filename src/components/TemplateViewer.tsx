
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, ArrowLeft, Eye, Share2, FileText, User } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Template {
  id: string;
  title: string;
  body: string;
  metadata: any;
  created_at: string;
  views_count: number;
  uses_count: number;
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
    clerk: true,
    financeCommittee: true
  });

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
      
      // Initialize form with template data
      setSubject(data.metadata?.subject || 'RE: MEMORANDUM OF OBJECTION TO THE FINANCE BILL 2025');
      setMessageBody(data.body);
      
      // Increment view count
      await supabase.rpc('increment_template_views', { template_id: data.id });
      
      // Update document title and meta tags for SEO
      document.title = `${data.title} - CEKA Template`;
      
      // Add Open Graph meta tags
      updateMetaTags(data);
      
    } catch (error) {
      console.error('Error fetching template:', error);
      setError('Template not found or is private');
    } finally {
      setLoading(false);
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

  const handleSendEmail = async () => {
    if (!userName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name to complete the objection letter",
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

      const recipients = {
        clerk: { email: "cna@parliament.go.ke" },
        financeCommittee: { email: "financecommitteena@parliament.go.ke" }
      };

      const selectedEmails: string[] = [];
      if (selectedRecipients.clerk) selectedEmails.push(recipients.clerk.email);
      if (selectedRecipients.financeCommittee) selectedEmails.push(recipients.financeCommittee.email);

      const to = selectedEmails.join(',');
      const encodedSubject = encodeURIComponent(subject);
      const personalizedMessage = messageBody.replace('[USER_NAME_PLACEHOLDER]', userName.trim());
      const encodedBody = encodeURIComponent(personalizedMessage);

      const mailtoLink = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
      window.location.href = mailtoLink;

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
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{template.title}</h1>
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

          {/* Recipients */}
          <Card>
            <CardHeader>
              <CardTitle>Send To</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="clerk"
                    checked={selectedRecipients.clerk}
                    onChange={(e) => setSelectedRecipients(prev => ({ ...prev, clerk: e.target.checked }))}
                    className="mt-1"
                  />
                  <Label htmlFor="clerk" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Clerk of the National Assembly</div>
                    <div className="text-sm text-gray-600">cna@parliament.go.ke</div>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-3 p-3 border rounded-lg">
                  <input
                    type="checkbox"
                    id="financeCommittee"
                    checked={selectedRecipients.financeCommittee}
                    onChange={(e) => setSelectedRecipients(prev => ({ ...prev, financeCommittee: e.target.checked }))}
                    className="mt-1"
                  />
                  <Label htmlFor="financeCommittee" className="flex-1 cursor-pointer">
                    <div className="font-semibold">Finance Committee of the National Assembly</div>
                    <div className="text-sm text-gray-600">financecommitteena@parliament.go.ke</div>
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subject */}
          <Card>
            <CardHeader>
              <CardTitle>Email Subject</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="font-medium"
              />
            </CardContent>
          </Card>

          {/* Message Body */}
          <Card>
            <CardHeader>
              <CardTitle>Your Message</CardTitle>
              <p className="text-sm text-gray-600">
                Customize this template message as needed. Your name will be automatically inserted where [USER_NAME_PLACEHOLDER] appears.
              </p>
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
